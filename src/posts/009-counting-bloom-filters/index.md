---
date: '2025-06-24'
tags:
  - 'Algorithms'
keywords:
  - 'Bloom filters'
  - 'Probabilistic data structures'
  - 'Counting Bloom filters'
title: 'Grokking Bloom Filters: Counting Bloom Filter'
preview: "Bloom filters can't remove elements — unless you let them count."
series: 'Grokking Bloom Filters'
draft: false
hero: /images/blog/009-counting-bloom-filters/hero.jpg
aiCover: [Image]
coverCaption: "Taking samples and keeping count."
---

<script>
    import { Scrollbox } from '$lib/components';
</script>

Bloom filters are incredibly space-efficient probabilistic data structures, perfect for answering a simple question: "Is this element in the set — no or maybe?"

But as we discussed in [deep dive into Bloom filters](https://maltsev.space/blog/008-bloom-filters-pt1), there's a big limitation: **they don't support deletion**.

In this part of the series, we'll tackle that problem. We'll explore how we can extend Bloom filters to allow element removal — and what trade-offs come with that.

## Contents

## Why Deletion Is Hard

To understand why deletion doesn't work in a classic Bloom filter, let's quickly revisit how it operates.

A Bloom filter consists of two core components:

- A fixed-size **bit array**
- A set of **hash functions**

Each time you insert an element, it is hashed at most `k` times to determine `k` bit positions in the array, and those bits are set to `1`. Since the bit array is shared across all elements, multiple elements may overlap and set the same bits — this is expected and what makes Bloom filters space-efficient.

But this sharing creates a fundamental problem: **you can't tell which element set a given bit**. If you try to delete an element by resetting its `k` bits to `0`, you may accidentally unset bits that are still needed by other elements, breaking one of the Bloom filter's key guarantees: **no false negatives**.

Let's see this in action. Suppose we have a Bloom filter with 10 bits and we want to insert two elements:

- **Element A** hashes to positions 0, 5, and 8
- **Element B** hashes to positions 5, 7, and 9

Notice that both elements share position 5 — this is where the trouble begins.

First, we insert both elements. Element A sets bits at positions 0, 5, and 8. Then Element B tries to set bits at positions 5, 7, and 9. Position 5 is already set from Element A, so it remains `1`, while positions 7 and 9 are newly set:

<Scrollbox>

```svgbob
 set by                A                            A,B          B     A     B
                       ↓                             ↓           ↓     ↓     ↓
                    +-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+
 after A and B      |  1  |  0  |  0  |  0  |  0  |  1  |  0  |  1  |  1  |  1  |
                    +-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+
                       0     1     2     3     4     5     6     7     8     9
```

</Scrollbox>

Now, let's attempt to delete Element A. The naive approach would be to reset its bits at positions 0, 5, and 8 back to `0`. This seems straightforward, but here's the problem: when we reset position 5, we're also removing Element B's contribution to that position. After this "deletion," only bits 7 and 9 remain set:

<Scrollbox>

```svgbob
 reset to 0            0                             0                 0
                       ↓                             ↓                 ↓
                    +-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+
 after deleting A   |  0  |  0  |  0  |  0  |  0  |  0  |  0  |  1  |  0  |  1  |
                    +-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+
                       0     1     2     3     4     5     6     7     8     9
                                                     ↑
                                          B still needed this bit
```

</Scrollbox>

The corruption becomes evident when we later check for Element B. We hash it to positions 5, 7, and 9, but now position 5 is `0`. Since not all of Element B's positions are set, the Bloom filter incorrectly reports that Element B is not present — a **false negative**. This is catastrophic because Element B was never deleted; it's still supposed to be in the set.

<Scrollbox>

```svgbob
 query B                                             ✗           ✓           ✓
                                                     ↓           ↓           ↓
                    +-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+
 after deleting A   |  0  |  0  |  0  |  0  |  0  |  0  |  0  |  1  |  0  |  1  |
                    +-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+
                       0     1     2     3     4     5     6     7     8     9

```

</Scrollbox>

> [!tip]
> It's similar to erasing your tag from a public graffiti wall — you might end up scrubbing off someone else's mark too, and now no one can tell they were ever there.

This is why deletion is fundamentally unsafe in standard Bloom filters — any attempt to remove an element risks corrupting the filter's state and creating false negatives for other elements.

## Easy Workarounds (That Actually Don't Work)

Before diving into data structure modifications, let's look at a few simple workarounds for deletion.

### Rebuilding the Filter

In many use cases, full deletion support isn't necessary. Instead, you can periodically **rebuild** the Bloom filter from scratch — daily, weekly, or based on certain metrics like false positive rate. This works especially well if:

- You can tolerate brief downtime or rebuild in the background.
- The data set is relatively stable or changes in batches.

This is often the simplest and safest approach.

### Using a Tombstone Filter

Another workaround is to maintain a second Bloom filter — a **tombstone filter** — to track deletions. When you remove an element, you insert it into the tombstone filter.

To check for membership:

1. Check the main Bloom filter.
2. If it's a **possible match**, check the tombstone filter.
3. If it also matches there, treat it as deleted.

The problem? If the tombstone filter gives a **false positive**, you'll wrongly conclude that an element was deleted — effectively creating a **false negative**. This defeats the main strength of Bloom filters.

So while this method technically adds delete support, it weakens the guarantees and is rarely worth the risk.

## Counting Bloom Filters

The core strength of Bloom filters lies in their simplicity: a bit array and some hash functions. This makes them fast and compact — but also limited. In particular, the bit array can't tell **which elements** contributed to setting each bit.

That's where **Counting Bloom Filters (CBFs)** come in.

Originally proposed by [Fan et al.](https://www.cs.princeton.edu/courses/archive/spr05/cos598E/bib/p254-fan.pdf) as a solution for scalable web cache, CBFs replace the bit array with an array of **small integer counters** — typically 4-bit values. These allow us to track how many elements have set each position. For example, here are the same positions set in both filters:

<Scrollbox>

```svgbob
 Classic Bloom filter, 1 bit per cell
 +-+-+-+-+-+-+-+-+-+-+
 |0|1|0|0|1|0|1|1|0|1|
 +-+-+-+-+-+-+-+-+-+-+
  0 1 2 3 4 5 6 7 8 9

 Counting Bloom filter, 4 bits per cell
 +-------+-------+-------+-------+-------+-------+-------+-------+-------+-------+
 |   0   |   1   |   0   |   0   |   2   |   0   |   1   |   1   |   0   |   1   |
 |0 0 0 0|0 0 0 1|0 0 0 0|0 0 0 0|0 0 1 0|0 0 0 0|0 0 0 1|0 0 0 1|0 0 0 0|0 0 0 1|
 +-------+-------+-------+-------+-------+-------+-------+-------+-------+-------+
     0       1       2       3       4       5       6       7       8       9
```

</Scrollbox>

### How Counting Bloom Filters Work

CBFs operate using three fundamental operations, same as the classic Bloom filter, but each building on the counter-based structure.

#### Insertion of an Element

When inserting an element into a CBF:

1. **Hash the element** to determine `k` positions in the counter array
2. **Increment each counter** at those `k` positions by 1

The key insight is that **multiple elements may share the same positions** — but now we track exactly how many elements contributed to each position through the counter values. Suppose **A** hashes to positions 1, 4, 7 and **B** to positions 4, 6, 9:

<Scrollbox>

```svgbob
 insert A                    +1                +1                +1
                             ↓                 ↓                 ↓
                    +-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+
 after A            |  0  |  1  |  0  |  0  |  1  |  0  |  0  |  1  |  0  |  0  |
                    +-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+
                       0     1     2     3     4     5     6     7     8     9

 insert B                                      +1          +1                +1
                                               ↓           ↓                 ↓
                    +-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+
 after A and B      |  0  |  1  |  0  |  0  |  2  |  0  |  1  |  1  |  0  |  1  |
                    +-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+
                       0     1     2     3     4     5     6     7     8     9
                                               ↑
                                       shared by A and B
```

</Scrollbox>

#### Membership Query Operation

To check if an element exists in the CBF:

1. **Hash the element** using the same `k` hash functions to get `k` positions
2. **Check all counters** at those positions
3. **Return the result**:
   - If **all counters > 0**: Element is **possibly present**
   - If **any counter = 0**: Element is **definitely not present**

The query operation is identical to a standard Bloom filter, just checking counters instead of bits.

#### Deletion of an Element

The deletion operation is just the opposite of the insertion operation:

1. **Hash the element** to get the same `k` positions used during insertion
2. **Decrement each counter** at those positions by 1

The result is that other elements sharing those positions remain unaffected because their contributions are still counted.

<Scrollbox>

```svgbob
 delete A                    −1                −1                −1
                             ↓                 ↓                 ↓
                    +-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+
 after deleting A   |  0  |  0  |  0  |  0  |  1  |  0  |  1  |  0  |  0  |  1  |
                    +-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+
                       0     1     2     3     4     5     6     7     8     9
                                               ↑
                                       still 1: B survives
```

</Scrollbox>

This counter-based approach enables **insert**, **query**, and **delete** operations while preserving the probabilistic guarantees of the original Bloom filter structure. However, it's not without its own challenges.

### Handling Counter Overflow and Underflow

When implementing a CBF, you need to be mindful of counter limits. Most implementations use 4-bit counters, which means each counter can represent values from 0 to 15.

#### Overflow During Insertion

If a counter is already at its maximum value (e.g., 15) and you try to increment it, the result will either:

- Wrap around to 0 (in case of overflow), or
- Overwrite memory incorrectly (if not handled properly)

To prevent this, insertions should **skip incrementing** counters that are already at their maximum value.

#### Underflow During Deletion

Similarly, if a counter is at `0` and you try to decrement it, you risk corrupting the filter — especially if that position was never associated with the element being removed. Deletion code should **never decrement** a zero counter.

This raises a deeper issue: if the counter is `0`, the element likely wasn't inserted — and deleting it can silently damage the filter. That brings us to a more subtle and dangerous scenario...

### Removing a Non-Existent Element

Counting Bloom Filters only work reliably if deletions are performed on elements that were actually inserted. If you delete an element that was never added, you can unintentionally corrupt the state of the filter.

Let's walk through a simple example:

- Element **A** hashes to positions `1, 5, 7, 9`
- Element **B** hashes to positions `1, 3, 7, 8`

Now suppose you insert **A** — this increments the counters at positions `1, 5, 7, 9`.

Then, without inserting **B**, you try to delete it. This decrements counters at `1, 3, 7, 8`.

<Scrollbox>

```svgbob
 insert A                    +1                      +1          +1          +1
                             ↓                       ↓           ↓           ↓
                    +-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+
 after A            |  0  |  1  |  0  |  0  |  0  |  1  |  0  |  1  |  0  |  1  |
                    +-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+
                       0     1     2     3     4     5     6     7     8     9

 delete B                    −1         skip                     −1   skip
                             ↓           ↓                       ↓     ↓
                    +-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+
 after deleting B   |  0  |  0  |  0  |  0  |  0  |  1  |  0  |  0  |  0  |  1  |
                    +-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+
                       0     1     2     3     4     5     6     7     8     9

```

</Scrollbox>

Here's what goes wrong:

- Counters at positions `1` and `7` (shared with A) are decremented (capped at 0).
- When you later check for **A**, it may appear absent, even though it was never deleted.
- Counters at positions `5` and `9` remain set, creating an inconsistent state.

<Scrollbox>

```svgbob
 query A                     ✗                       ✓           ✗           ✓
                             ↓                       ↓           ↓           ↓
                    +-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+
 after deleting B   |  0  |  0  |  0  |  0  |  0  |  1  |  0  |  0  |  0  |  1  |
                    +-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+
                       0     1     2     3     4     5     6     7     8     9

```

</Scrollbox>

This creates a **false negative**, something Bloom filters are explicitly designed to avoid. And the worst part? There's no way to detect this corruption after the fact.

### Is It Worth It?

Counting Bloom Filters provide a straightforward way to support deletions: just replace bits with small counters. The core algorithm remains nearly identical to the classic Bloom filter — simple and efficient.

But this simplicity comes at a cost:

- Requires more memory — typically 4× larger due to 4-bit counters.
- Vulnerable to accidental false negatives if deletions aren't handled carefully.
- Doesn't track which elements contributed to a counter — so overlapping deletions are still a risk.

CBFs were proposed back in 2000 as a practical workaround, and they still hold up in simple scenarios. But if memory is tight or deletion accuracy is critical, modern alternatives like **Cuckoo Filters** offer better guarantees.

Before we get there, let's look at one more variation that builds on this concept — the **d-left Counting Bloom Filter**.

## d-left Counting Bloom Filter

This data structure is quite different from classic Bloom and Counting Bloom Filters, but it gives us useful ideas that eventually lead to Cuckoo Filters — especially I love the point when it comes to handling collisions.

### Core Idea

The [d-left Counting Bloom Filter (dlCBF)](https://people.eecs.berkeley.edu/~sylvia/cs268-2014/papers/countingbloom.pdf) replaces the flat array of counters with a multi-part structure — or simply, `d` separate hash tables (subtables).

Each subtable contains `B` buckets. Every bucket holds a small, fixed number of cells (e.g., 8). Each cell has:

- a **fingerprint** (a short hash of the original element)
- a **counter** (how many times it's been added)

So instead of one giant table, we split it into `d` isolated parts. For example, here is a tiny dlCBF with `d = 2` subtables of `B = 4` buckets. Each cell holds a fingerprint and its counter (`A2C, 1` means fingerprint `0xA2C`, added once):

<Scrollbox>

```svgbob
                    subtable 0                                subtable 1
            +---------+---------+-----+               +---------+---------+-----+
  bucket 0  | A2C, 1  | 7F1, 2  | ... |     bucket 0  | 3E9, 1  |         | ... |
            +---------+---------+-----+               +---------+---------+-----+
  bucket 1  | 5B8, 1  |         | ... |     bucket 1  | 9D4, 3  | 1C7, 1  | ... |
            +---------+---------+-----+               +---------+---------+-----+
  bucket 2  |         |         | ... |     bucket 2  | 6A1, 1  |         | ... |
            +---------+---------+-----+               +---------+---------+-----+
  bucket 3  | 8E6, 2  |         | ... |     bucket 3  |         |         | ... |
            +---------+---------+-----+               +---------+---------+-----+
```

</Scrollbox>

### Why d-left?

This structure is more complex than a flat CBF, but it packs data more tightly and handles collisions better. Each subtable manages its own space, and load balancing improves thanks to the "pick the least loaded" rule.

> [!tip]
> Think of it like driving on a busy 6-lane road approaching an intersection. Three lanes can turn left, and the other three can turn right. In a regular CBF, it's as if there's only one lane for your direction — everyone turning left has to squeeze into the same lane, creating a traffic jam. But with d-left CBF, you have multiple lanes (subtables) going in your direction. When you need to turn (insert an element), you look at all the lanes that can make your turn and choose the one with the least traffic (fewest occupied cells). This way, cars turning in the same direction spread out across multiple lanes, reducing congestion.

### Insertion

1. First, hash the element once to get the **true fingerprint**.
2. Each subtable applies its own **deterministic permutation** to the fingerprint. This maps the fingerprint to a bucket in that subtable and modifies the fingerprint slightly to avoid clashes. I explain it later.
3. Now we have `d` candidate buckets — one per subtable.
4. From those, pick the bucket with the fewest used cells.
5. If a cell with the modified fingerprint already exists there, increment its counter.
6. Otherwise, insert a new cell with the fingerprint and counter set to 1.

For example, let's insert `"apple"` into the filter above. Its fingerprint is `0x4A2`. Subtable 0 permutes it to `0x7B1`, which maps to bucket 3, and subtable 1 permutes it to `0x9E8`, which maps to bucket 1. Bucket 3 of subtable 0 uses one cell and bucket 1 of subtable 1 uses two, so apple goes to subtable 0 as a new cell `7B1, 1`:

<Scrollbox>

```svgbob
                                  7B1, 1
                                     ↓
                       +---------+---------+-----+
 subtable 0, bucket 3  | 8E6, 2  |         | ... |   load 1  ✓
                       +---------+---------+-----+
 subtable 1, bucket 1  | 9D4, 3  | 1C7, 1  | ... |   load 2
                       +---------+---------+-----+
```

</Scrollbox>

If `7B1` had already been in that bucket, we would increment its counter instead of taking a new cell.

### Deletion

To remove an element:

- Use the same process to find candidate buckets and fingerprints.
- Locate the matching cell and decrement its counter.

### Membership Check

Same logic: use the original fingerprint, permute it per subtable, and check each candidate bucket. If any bucket contains a matching fingerprint with a positive counter, the element is **possibly present**.

### About Permutations (Two-Phase Hashing)

One subtle but powerful part of dlCBF is **how it avoids ambiguous deletions and collisions**.

- **Phase 1**: Generate a fingerprint from the element.
- **Phase 2**: Each subtable applies its own deterministic permutation to the fingerprint. This affects both the bucket index and the fingerprint value inside that subtable.

So instead of computing `d` separate hashes, we just compute one hash and shuffle it differently in each subtable. This helps avoid situations where two elements look the same across all subtables and buckets — a common cause of incorrect deletions.

By doing this simple fingerprint transformation per subtable, dlCBF lowers the chance of "hot buckets" and overlapping fingerprints, making the structure more reliable.

## Moving Forward

Counting Bloom Filters are a natural extension of the classic Bloom Filter — they add support for deletions with minimal structural changes. On paper, it's a neat solution. But in practice, CBFs are not always the most efficient choice, especially today.

It's a bit sad, honestly. There's no simple way to preserve the elegance of the original Bloom Filter and still get reliable deletions. Every attempt to fix that tends to compromise either performance or memory efficiency.

That said, the alternatives — like [Cuckoo Filters](https://maltsev.space/blog/010-cuckoo-filters) and the newer Ribbon Filters — are surprisingly elegant in their own right. They're more complex under the hood, but if you're working with modern libraries, that complexity is abstracted away. For most real-world use cases where deletions matter, these filters are excellent, first-class replacements for classic Bloom Filters.
