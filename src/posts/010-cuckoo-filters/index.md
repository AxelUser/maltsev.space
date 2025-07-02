---
date: "2025-06-28"
tags:
 - "Algorithms"
keywords:
 - "Cuckoo filters"
 - "Probabilistic data structures"
title: "Cuckoo Filters: Better Than Bloom Filters?"
preview: "Cuckoo filters are a space-efficient probabilistic data structure that can answer the question: 'Is this element in the set — no or maybe?'"
series: "Grokking Bloom Filters"
draft: true
hero: /images/blog/010-cuckoo-filters/hero.jpg
---

Bloom Filters are brilliant, they use minimal memory to support approximate membership query operations, i.e., answering what elements may be represented in a set, or what absolutely not. Their simplicity is both their strength and weakness. As I’ve described in a [previous article about Counting Bloom Filter](https://maltsev.space/blog/009-counting-bloom-filters), it’s not trivial to support deletion and preserve their guarantees of absence of false-negative results, i.e., telling what elements are not in a set.

Counting Bloom Filters (CBF) and d-left Counting Bloom Filters are supposed to solve this issue, but they come at a cost of greater memory overhead, **1.5** to **4** times more than classic Bloom Filters do.

In this article, I’ll describe a memory-efficient and deletion-friendly solution.

## Meet the Cuckoo Filters

Cuckoo Filters are a clever step forward in the world of probabilistic data structures. [Introduced by Fan et al. in 2014](https://www.cs.cmu.edu/~dga/papers/cuckoo-conext2014.pdf), they were designed to overcome some of the major limitations of [classic Bloom Filters](https://maltsev.space/blog/008-bloom-filters-pt1), especially around memory efficiency and the lack of support for deletions.

What sets them apart is the internal structure. While Bloom Filters use a flat bit array, Cuckoo Filters adopt a more flexible **hash-table** layout with buckets and slots, and that subtle shift unlocks new capabilities. At first glance, they might remind you of the [d-left Counting Bloom Filters](https://maltsev.space/blog/009-counting-bloom-filters#d-left-counting-bloom-filter) we discussed earlier, since both use a hash-table-like structure, but with quite impressive mechanics.
💡

> [!NOTE]
> If you’re unfamiliar with hash tables, here’s the short version: a hash table is a data structure that lets you store values and look them up efficiently using a key. Under the hood, it works like an array of **buckets**. A bucket can contain one or more key-value pairs in its **slots**. When you insert a key-value pair, the key is hashed — turned into a number — to figure out which bucket to use. A good hash function ensures that even similar keys produce very different hash values, which helps spread data evenly across buckets.

To help visualize the difference, let’s compare their memory layouts:

```svgbob
Classic Bloom Filter

(each cell = 1 bit)
┌─┬─┬─┬─┬─┬─┬─┬─┬─┐
│1│0│1│0│1│0│1│1│0│
└─┴─┴─┴─┴─┴─┴─┴─┴─┘
 0 1 2 3 4 5 6 7 8

Cuckoo Filter

(4 buckets × 2 slots, each slot = 8-bit fingerprint)
┌────────────┬────────────┬────────────┬────────────┐
│ fp: 0xA7   │ fp: 0x1C   │ fp: 0xFF   │   empty    │
│ fp: 0x2B   │   empty    │ fp: 0x3D   │ fp: 0xA7   │
└────────────┴────────────┴────────────┴────────────┘
   Bucket 0     Bucket 1     Bucket 2     Bucket 3
```

- In a Bloom Filter, every bit position is shared by multiple elements. Once a bit is set to `1`, there's no way to know who set it.
- In a Cuckoo Filter, we store compact hashes of the original item, which are called **fingerprints**.

Let’s see how Cuckoo Filters work under the hood and the main concepts used in their design.

## Cuckoo Hashing and Cuckoo Tables

The "Cuckoo" in **Cuckoo Filter** comes from a collision-handling technique called **Cuckoo Hashing**. It's a clever and slightly mischievous way of dealing with a common problem in hash tables — what happens when two different elements want to land in the same bucket?

Classic hash tables handle this with techniques like:

- **Chaining**: placing all colliding elements in a list inside the bucket, usually into a linked list.
- **Linear probing**: scanning for the next available bucket if the first is fully occupied.

Cuckoo Hashing, however, takes a very different approach.

In Cuckoo Hashing, each element has **two possible buckets** where it can be stored. Two different hash functions determine these. 

When inserting a new element:

1. You first try placing it in one of its two candidate buckets.
2. If both are full, the algorithm **evicts** a randomly selected existing element from one of them.
3. The evicted element is reinserted into its alternate bucket, possibly kicking out another element.
4. This process repeats recursively until everyone finds a home, or the table expands if the chain doesn't resolve.

This behavior is inspired by the cuckoo bird, which famously lays its eggs in other birds' nests, displacing the existing ones — hence the name.

Here's how the bucket choices are calculated:

```typescript
const h1 = hash1(key); // Primary bucket
const h2 = hash2(key); // Alternate bucket
```

Insertion picks either `h1` or `h2`, depending on which one has space. If both are full, one is chosen (often randomly), and the current occupant is kicked out and reinserted into its alternate bucket.

This chain of evictions continues until a vacant slot is found — or until the process loops back on itself. In some rare cases, the eviction chain can become **cyclic**, meaning the same buckets get checked repeatedly with no progress. This indicates that the table is too full, and the only fix is to **resize and rehash** everything into a larger table.

## Fingerprints and Partial Key Cuckoo Hashing

Hash tables work differently from Bloom Filters, Cuckoo Filters, and other approximate membership structures. **They store the actual keys**, which means they can answer lookups with zero false positives.

But Cuckoo Filter aims to beat Bloom Filter at its own game—fast, compact membership checks with low memory use. Storing full keys would waste space and defeat that purpose. So what’s the alternative?

In the article about **Counting Bloom Filters**, I mentioned a variant called the **d-left Counting Bloom Filter**. TL;DR: it’s a hash-table-like structure that doesn’t store full keys either. Instead, it stores **fingerprints** — small, fixed-size pieces of a hashed key, like 1 byte (8 bits). Fingerprints are compact and help keep the structure lightweight, so they are an excellent choice for the Cuckoo Filter.

Now here’s the challenge: the classic Cuckoo Hashing algorithm relies on knowing the **entire key** when moving elements around. But in a Cuckoo Filter, we **don’t store the key at all**, only the fingerprint. That means the original eviction logic won’t work out of the box.

To solve this, Fan et al. used a [clever modification of Cuckoo Hashing](https://www.cs.cmu.edu/~dga/papers/silt-sosp2011.pdf), called **partial-key Cuckoo Hashing**.

The core idea remains the same: each element still has two possible buckets, just like in regular Cuckoo Hashing. But instead of computing both directly from the key, the second bucket is derived from the first bucket and the fingerprint, using a simple **XOR** operation.

```typescript
const f = fingerprint(key)
const b1 = hash(key)
const b2 = b1 ^ hash(fp)
```

> [!note]
> **XOR**, short for "exclusive OR", is a simple binary operation: it compares two bits and returns `1` if they’re different, `0` if they’re the same. So:
>
> - `0 ^ 0 = 0`
> - `1 ^ 0 = 1`
> - `1 ^ 1 = 0`

What makes XOR perfect for this use case is its **reversible property**:

```typescript
b1 ^ hash(fp) == b2
b2 ^ hash(fp) == b1
```

That means if you know one bucket and the fingerprint, you can always calculate the other bucket, in either direction.
That’s what makes it awesome: the Cuckoo Filter doesn’t need to store or look up the original key at all. **Everything it needs to manage insertions, lookups, and evictions is right there in the table.**

## Basic Operations

Now that we understand the internal structure of a Cuckoo Filter, let’s walk through how the main operations work — lookup, insertion, and deletion.

### Lookup

To check if an element *might* be in the filter, you just need to check two buckets for the presence of the computed fingerprint:

1. Hash the element to get its **fingerprint**.
2. Compute the **first bucket** from the element.
3. Compute the **second bucket** using XOR with the fingerprint.
4. Check both buckets. If either contains the fingerprint, return `true`.

**Time complexity:** `O(1)` — just two hash calculations and two bucket scans.

```typescript
const fp = fingerprint('apple');
const i1 = hash('apple') % bucketCount;
const i2 = i1 ^ hash(fp);

return buckets[i1].contains(fp) || buckets[i2].contains(fp);
```

> [!tip]
> Don’t forget that, just like a Bloom filter, this is a **probabilistic check**. You may get a false positive, but never a false negative.

### Insertion

Insertion is trickier, as it involves chained eviction of conflicted elements to alternative buckets, which I’ve described above.

To insert a new element:

1. Compute its **fingerprint**.
2. Calculate its **two candidate buckets** (same as in lookup).
3. Try placing the fingerprint into either bucket.
4. If both are full, randomly pick one, **evict** an existing fingerprint, and try to reinsert the evicted one in its alternate bucket.
5. Repeat for a fixed number of steps (e.g., 500). If all fail, report insertion failure or grow the table.

**Time complexity:**

- Best case: `O(1)` (when fingerprint fits right away)
- Worst case: `O(k)` where `k = MAX_KICKS`

```typescript
const fp = fingerprint('apple');
let i1 = hash('apple') % bucketCount;
let i2 = i1 ^ hash(fp);

if (buckets[i1].insert(fp) || buckets[i2].insert(fp)) return true;

// Eviction loop
let i = Math.random() < 0.5 ? i1 : i2;
for (let n = 0; n < MAX_KICKS; n++) {
 const evictedFp = buckets[i].swapRandom(fp);
 i = i ^ hash(evictedFp);
 if (buckets[i].insert(evictedFp)) return true;
}

// Table is too full
return false;
```

> [!warning]
> This is the main downside of Cuckoo Filters: **insertions can fail**. That usually means the table is too full, a common challenge with hash-based structures, which you can handle by resizing.

### Deletion

Here’s where Cuckoo Filters shine compared to Bloom Filters — **deletion doesn’t add more memory overhead and is safe** (as long as the item was actually inserted):

1. Hash it to get its **fingerprint**.
2. Compute its two possible buckets.
3. If the fingerprint is found in either, remove it.

**Time complexity:** `O(1)` —  same as for lookup, just two hash calculations and two bucket scans

```typescript
const fp = fingerprint('apple');
const i1 = hash('apple') % bucketCount;
const i2 = i1 ^ hash(fp);

return buckets[i1].delete(fp) || buckets[i2].delete(fp);
```

> [!warning]
> While deletions are supported, deleting an element that was **never inserted** may still remove a matching fingerprint from another item, just like in Counting Bloom Filters.

## What Are the Benefits?

Cuckoo Filters come with several practical advantages, especially when you're aiming for **low false positive rates**.

According to the original research by Fan et al., Cuckoo Filters outperform Bloom Filters in terms of space efficiency when the false positive rate is below **3%**. In other words, if you care about accuracy, they pack more data into less space.

For example, this empirical analysis is provided by the authors *(all filters sized to 192 MiB)*:

- **Cuckoo Filter**: 12.60 bits per item, **0.19%** false positive rate
- **Bloom Filter**: 13.00 bits per item, **0.19%** false positive rate
- **Cuckoo Filter with semi-sorting**: 12.58 bits per item, **0.09%** false positive rate

So, not only do Cuckoo Filters match the false positive rate of Bloom Filters, but they often beat them by **using less memory**.

> [!note] **Wait — what’s “semi-sorting”?**
>
> In the standard Cuckoo-Filter setup, a bucket holds **4 fingerprints of 4 bits each** — 16 bits total. But look-ups only check “does this fingerprint exist?”, so the *order* of those four values doesn’t matter.
>
> The authors sorted each bucket’s fingerprints and listed every possible sorted pattern — just **3876 unique combinations**, far fewer than the 65536 raw bit-patterns. A bucket now stores a **12-bit index** into that pre-computed table instead of the full 16 bits.
>
> Savings are ****roughly **1 bit per element** with zero hit to query speed and only a tiny extra cost when inserting or deleting due to encoding/decoding gymnastics.

One of the biggest wins is that Cuckoo Filters support **native deletions:** no workarounds, no tombstones or full rebuilds. To delete an element, you just locate its fingerprint in one of the two candidate buckets and remove it. Simple as that.

This makes them a clean replacement for **Counting Bloom Filters**, which simulate deletion by using small counters, but at the cost of 3–4× more memory.

Cuckoo Filters also offer **predictable lookup performance**, regardless of how full they get. Every query checks exactly **2 buckets**. With Bloom Filters, you need to access **k** random positions in the bit array, and **k** grows as you try to lower the false positive rate.

Finally, in practice, Cuckoo Filters tend to have **higher insertion and lookup throughput** than Bloom Filters, especially when implemented with CPU cache behavior in mind. However, insertion will eventually degrade.

## What Are the Drawbacks?

The previous section showed why Cuckoo Filters often beat Bloom Filters in terms of memory and accuracy. Those gains, however, are traded for extra complexity and stricter operating limits. Keep the following in mind before you drop Cuckoo Filters into production.

### Insertions can fail when the table is too full

At roughly **95 % load,** an insertion may trigger hundreds of evictions (libraries usually cap this at ≈ 500). If no empty slot appears before the cap is reached, the operation returns “insert failed,” and the only remedy is to grow or rebuild the filter.

### Eviction loops at high load

Near the same threshold, the eviction chain can bounce the identical fingerprints between two buckets **FOREVER**. Implementations abort after the kick limit, but the outcome remains an insertion failure.

### More implementation work

- Partial-key Cuckoo hashing (two candidate buckets per fingerprint)
- Eviction logic with a bounded kick count
- Load-factor monitoring and timely resizing
- Bucket-width tuning (four fingerprints per bucket is a common sweet spot)

### Table size must be a power of two

The second bucket index is computed with a bitwise XOR trick:

$$
\begin{aligned}
i_1 &= H(x) \bmod m \\
i_2 &= \left( i_1 \oplus H\!\left(\operatorname{fp}(x)\right) \right) \bmod m
\end{aligned}
$$

The paper [*Birdwatching: False Negatives in Cuckoo Filters*](https://people.bu.edu/staro/cuckoo_filter_workshop_paper.pdf) shows that this rule is **provably safe only when the bucket count m equals 2ᵏ**. If m is not a power of two, the final `mod m` strips high-order bits from the XOR result, breaking the reversible link between `i1` and `i2`. During long eviction chains, a fingerprint can slide into a third, illegal bucket and later disappear from both legal locations, so we can get a false negative result. The authors measured up to a **10 % false-negative rate at 95 % load** in such filters.

Let’s see it in action. First, I’ll go through a good example when `m` is 16 (a power of two):

| Step | Expression | Decimal | Binary | Comment |
| --- | --- | --- | --- | --- |
| 1 | `i1 = hash("apple") % 16` | 6 | 0110 | First bucket |
| 2 | `f  = hash(fp("apple"))` | 9 | 1001 | Fingerprint hash |
| 3 | `xor1 = i1 ^ f` | 15 | 1111 | XOR before modulo |
| 4 | `i2 = xor1 % 16` | 15 | 1111 | Second bucket used at insert |
| 5 | `xor2 = i2 ^ f` | 6 | 0110 | Recompute *i1* before modulo |
| 6 | `i1' = xor2 % 16` | 6 | 0110 | Returns to the original bucket, great success |

Now let’s see a bad example when `m` is 12 (not a power of two):

| Step | Expression | Decimal | Binary | Comment |
| --- | --- | --- | --- | --- |
| 1 | `i1 = hash("apple") % m` | 6 | 0110 | First bucket |
| 2 | `f = hash(fp("apple"))` | 9 | 1001 | Fingerprint hash |
| 3 | `xor1 = i1 ^ f` | 15 | 1111 | XOR before modulo |
| 4 | `i2 = xor1 % 12` | 3 | 0011 | The second bucket used at insert |
| 5 | `xor2 = i2 ^ f` | 10 | 1010 | Recompute i1 before modulo |
| 6 | `i1' = raw2 mod 12` | **10** | 1010 | Should return to 6, but does not |

## Load Factor in Cuckoo Filter

In any open-addressing hash table, you keep an eye on a simple but important ratio:

$$
\text{load factor } (\alpha) \;=\; 
\frac{\text{number of stored items }\,n}
     {\text{number of available slots }\,m}
$$

The **load factor (α)** is the fraction of storage slots that are already in use. It first appeared in ordinary hash tables, where you measure how many key/value pairs are sitting in the array of buckets. A low α means plenty of free space, so lookups and inserts are cheap. As α creeps toward 1.0, collisions pile up, probes get longer, and you eventually have to resize the table.

Cuckoo Filters inherit the same idea, but each *bucket* holds several short fingerprints. You count *all* occupied fingerprint slots and divide by the total number of slots across every bucket:

$$
\alpha_{\text{CF}} \;=\;
\frac{\text{occupied slots}}{\text{buckets} \times \text{slots per bucket}}
$$

With 4-slot buckets, you can usually push α as high as ≈0.95 before inserts start to fail.

## Fingerprint Size and Error Rate

Unlike a Bloom filter, a Cuckoo Filter’s fingerprint length is chosen almost solely from the error budget you can tolerate; the total number of stored elements hardly matters.

During a negative lookup, we compare the query fingerprint with the at most `2b` fingerprints that live in the two candidate buckets (`b` slots each).

Each comparison matches by pure chance with probability $2^{-f}$, the **upper bound** on the false-positive probability ε is

$$
\epsilon \le \frac{2\,b}{2^{f}} \tag{1}
$$

Where:

- **`f`** is a fingerprint size in bits
- **`ε`** is the desired false positive rate
- **`b`** is bucket size (typically 4)

Rearranging (1) gives the **fingerprint size lower bound**

$$
\varepsilon \le \frac{2b}{2^{f}}\;\;\Longrightarrow\;\;f \ge \log_{2}\!\frac{2b}{\varepsilon}        \;=\;        \log_{2}\!\frac{1}{\varepsilon}        + \log_{2}(2b) \tag{2}
$$

And because *f* must be an **integer number of bits**, we round up

$$
f \ge \left\lceil \log_{2}\!\frac{1}{\epsilon} + \log_{2}(2b) \right\rceil \tag{3}
$$

In practice, you can choose between **8 bits**, which are nicely aligned to 1 byte, or **12 bits,** as in the original paper. I also saw that some libraries are using **16 bits** per fingerprint. Those are sufficient when **`b = 4`.**

| fingerprint length (f) | $\varepsilon_{\text{bound}} = 8/2^{f}$ |
| --- | --- |
| **8 bits** | $8/256 = 0.03125 \;(\;3.13\%\;)$ |
| **12 bits** | $8/4096 = 0.001953\;(\;0.195\%\;)$ |
| **16 bits** | $8/65 536 = 0.00012207\;(\;0.0122\%\;)$ |

## Final thoughts

I still remember how excited I was when I learned that a Cuckoo Filter could delete elements without blowing up the data structure like other Bloom filter variants. What also surprised me was how those bucket-hopping insertions seemed unreliable on paper, but they work remarkably well in practice.
And that clever XOR trick! I’ve always had a soft spot for the bit-flip operator. Back when I studied Boolean algebra, XOR felt confusing and weirdly unnecessary. But once I understood that it could reverse itself to undo an operation, it felt like magic.

So here’s the short takeaway: Cuckoo Filters offer Bloom-level space efficiency, support real deletions, and need only two bucket checks per lookup. In return, inserts can get a bit tricky—once the filter reaches around 95% load, they might fail unless you resize. But if you keep an eye on the load factor, it’s a trade-off worth making.

And if you’re into XOR like I am—good news! Cuckoo Filters aren’t the only ones using it. There’s a whole family of “invertible Bloom filters” that takes this idea even further. I’m really looking forward to exploring those next.

## Academic Researches

- [Cuckoo Filter: Practically Better Than Bloom](https://www.cs.cmu.edu/~dga/papers/cuckoo-conext2014.pdf)
- [SILT: A Memory-Efficient, High-Performance Key-Value Store](https://www.cs.cmu.edu/~dga/papers/silt-sosp2011.pdf)
- [Birdwatching: False Negatives In Cuckoo Filters](https://people.bu.edu/staro/cuckoo_filter_workshop_paper.pdf)