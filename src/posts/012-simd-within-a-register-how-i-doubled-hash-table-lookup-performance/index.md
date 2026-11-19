---
date: '2025-07-15'
tags:
  - 'Bitwise'
  - 'C#'
keywords:
  - 'C#'
  - 'Bitwise tricks'
  - 'Hash table'
  - 'Performance'
title: 'SIMD Within a Register: How I Doubled Hash Table Lookup Performance'
preview: 'It started with a simple thought: four bytes in a hash table bucket look just like an integer. Luckily, this one idea led to a deep dive into bit-twiddling and a 2x performance boost.'
draft: false
aiCover: [Image]
coverCaption: "No need to inspect each one separately if you have a powerful scanner."
liveCover: true
---

<script>
    import { Scrollbox } from '$lib/components';
    import { ByteLanes, ByteLanesStepper } from '$lib/components/visualization/byte-lanes';
    import { hasZeroSteps, xorExample, existingZeroOther, existingZeroEmpty } from './steps';
</script>

While working on a [Cuckoo Filter](https://maltsev.space/blog/010-cuckoo-filters) implementation in C#, I created an array-like structure for the underlying hash table. I chose an 8-bit fingerprint: it aligns nicely on a byte boundary and still keeps the false-positive rate around **3 %**.

The layout looked straightforward—just a byte array where the start of each bucket is calculated as `bucketIdx * bucketSize`. The size of each bucket is 4 slots, which is a solid choice for Cuckoo Filter.

<Scrollbox>

```svgbob alt="The hash table as one byte array: bucket 0 holds bytes 0 to 3, bucket 1 bytes 4 to 7, and bucket n starts at byte 4n. Each bucket has four one-byte slots, and 00 marks an empty slot."
               Bucket 0              Bucket 1                      Bucket n
        +----+----+----+----+ +----+----+----+----+         +----+----+----+----+
Table:  | 3A | 00 | B7 | F2 | | 4C | 91 | 00 | DE |   ...   | AA | 00 | 5F | C8 |
        +----+----+----+----+ +----+----+----+----+         +----+----+----+----+
offset  0    1    2    3      4    5    6    7              4n
```

</Scrollbox>

But those four bytes in a bucket reminded me of something. They _feel_ like … an integer!

I wasn’t chasing ultra-low latency—after all, this is C#—but I couldn’t resist experimenting. Could I speed up lookups in my Cuckoo Filter by replacing the 4-byte bucket with a plain old 32-bit integer?

Time to find out. 💪

## Contents

## A Flexible and Simple Implementation

Here’s the naïve storage I began with. To keep the rest of the code clean, all table logic lives in its own class, whose heart is a pre-allocated byte array:

```csharp
private readonly byte[] _table;
```

Each bucket has 4 slots, so there was no need for a second dimension; mapping a key to its bucket is obvious:

```csharp
var offset = bucketIdx * 4;
```

Checking whether a particular fingerprint (a single byte) sits in a bucket is just as obvious:

```csharp
public bool Contains(byte fingerprint, uint bucketIdx)
{
    var offset = bucketIdx * 4;
    for (var i = offset; i < offset + BucketSize; i++)
    {
        if (_table[i] == fingerprint) return true;
    }

    return false;
}
```

(Please ignore the missing bounds checks—they’re not the point today.)

I’m no bit-twiddling wizard—I live in a cosy, GC-collected world—but those 4 bytes kept itching. A bucket lines up _perfectly_ with a 32-bit `uint`; that opens the door to a future lock-free [compare-and-swap](https://en.wikipedia.org/wiki/Compare-and-swap). So I decided to play.

## Migrating to a `uint` Table

Switching the backing array is trivial because the hash table is still one-dimensional:

```diff
- private readonly byte[] _table;
+ private readonly uint[] _table;
```

Now let’s refactor the lookup. The most straightforward approach is to use a loop and shift the bucket to get the individual bytes, it's conceptually same as the previous version:

```csharp
public bool Contains(byte fingerprint, uint bucketIdx)
{
    ref readonly var bucket = ref _table[bucketIdx];
    for (var i = 0; i < BucketSize; i++)
    {
        var shift = i * 8;
        var fp = (byte)(bucket >> shift);
        if (fp == fingerprint) return true;
    }

    return false;
}
```

The bucket offset disappears because each `uint` is a bucket. But I’ve lost the luxury of direct indexing, unless I can perform the trick with a struct layout. And it's really ugly and you may lose not only direct indexing, but sanity as well.

So, to make things a little prettier, I may convert plain array of `uint`s to an array of `struct`s with a `byte` layout:

```csharp
private struct Bucket
{
    public byte Fp0;
    public byte Fp1;
    public byte Fp2;
    public byte Fp3;
}

private readonly Bucket[] _table;

```

The size of the struct is still 4 bytes, so no performance or storage penalty. Accessing the fields is now a bit more verbose than just indexing the array, but it's a no-brainer to figure out what's going on and much nicer to read than shifts:

```csharp
public bool Contains(byte fingerprint, uint bucketIdx)
{
    ref readonly var bucket = ref _table[bucketIdx];
    if (bucket.Fp0 == fingerprint) return true;
    if (bucket.Fp1 == fingerprint) return true;
    if (bucket.Fp2 == fingerprint) return true;
    if (bucket.Fp3 == fingerprint) return true;
    return false;
}
```

Let's run some quick benchmarks via `BenchmarkDotNet`. Positive lookups is for the case when the fingerprint is in the bucket, negative lookups is for the case when the fingerprint is not in the bucket.

**Positive lookups (fingerprint exists in the bucket):**

<Scrollbox>

| Method        | Operations  |               Mean |    Ratio |
| ------------- | ----------- | -----------------: | -------: |
| **ByteTable** | **128**     |       **237.7 ns** | **1.00** |
| StructTable   | 128         |           175.9 ns |     0.74 |
|               |             |                    |          |
| **ByteTable** | **1024**    |     **1,870.7 ns** | **1.00** |
| StructTable   | 1024        |         1,350.2 ns |     0.72 |
|               |             |                    |          |
| **ByteTable** | **1048576** | **1,906,960.6 ns** | **1.00** |
| StructTable   | 1048576     |     1,757,943.9 ns |     0.92 |

</Scrollbox>

**Negative lookups (fingerprint does not exist in the bucket):**

<Scrollbox>

| Method        | Operations  |               Mean |    Ratio |
| ------------- | ----------- | -----------------: | -------: |
| **ByteTable** | **128**     |       **320.6 ns** | **1.00** |
| StructTable   | 128         |           198.2 ns |     0.62 |
|               |             |                    |          |
| **ByteTable** | **1024**    |     **2,522.6 ns** | **1.00** |
| StructTable   | 1024        |         1,533.6 ns |     0.61 |
|               |             |                    |          |
| **ByteTable** | **1048576** | **2,585,740.9 ns** | **1.00** |
| StructTable   | 1048576     |     1,593,549.0 ns |     0.62 |

</Scrollbox>

The results are revealing. The 4-byte struct version gave a nice speed boost, about **10-30%** faster than the original byte-array loop for positive lookups and about **40%** faster for negative lookups. Results for positive lookups are a bit fluctuating, especially for biggest table size, but the trend is good.

> [!question] So what's next?
> Even the struct version is quite performant, can we do better? Maybe we can not only eliminate the loop, but make that lookup with a single instruction, like a SIMD within a single 32-bit integer?

## Finding a Byte with Masking

Long ago I bookmarked Sean Anderson’s great _[Bit Twiddling Hacks](https://graphics.stanford.edu/%7Eseander/bithacks.html)_. One gem there _"Determine if a word has a zero byte"_ is exactly what I need. The C# version is nearly identical:

```csharp
private static bool HasZero(uint v)
{
    return ((v - 0x01010101U) & ~v & 0x80808080U) != 0;
}
```

Admittedly opaque, so let’s unpack it.

The core of the trick is `(v - 0x01010101U) & ~v`. This expression has a special property:

- **For any non-zero byte b**, the most significant bit of `(b - 1) & ~b` will always be `0`.
- **For a zero-byte b = 0x00**, the expression becomes `(0x00 - 1) & ~0x00`, which is `0xFF & 0xFF = 0xFF`. The most significant bit is `1`.

So, this operation creates a "marker" bit (it sets the most significant bit to `1`) in any byte position that was originally `0x00`.

Let's apply it to `v = 0x4462002E`, step by step. Each byte is shown with its bits and its hex value. The bytes are written MSB first, as in a C# literal, so the zero byte is the one at bits 15..8:

<ByteLanesStepper title="HasZero on 0x4462002E, step by step" steps={hasZeroSteps} />

Great, now I can detect a zero byte without branches. All that remains is to _turn the byte I’m searching for into zero_.

## XOR to the Rescue

Let’s assume our integer, aka bucket, is `0x12345678` and I’m looking for byte `0x56`. Without shifts, this seems tough. Luckily, all we need to do is transform the `0x56` byte to `0x00`.

> [!note]
> What happens to the other bytes is irrelevant, because our `HasZero` trick only cares if _any_ byte is zero.

The XOR (`^`) operator has a useful property: `A ^ B = 0` if and only if `A == B`. So, if we XOR the entire bucket with a repeating mask of our target byte, only the matching byte will become zero. The result is exactly the `v` we fed to `HasZero` above:

<ByteLanes state={xorExample} />

So the remaining part of this puzzle is to make a repetitive mask, which is pretty arithmetic: I should multiply target byte by `0x01010101U`:

$$
\text{mask} \;=\; \text{0x56} \times \text{0x01010101} \;=\; \text{0x56565656}
$$

## What About Existing Zeros?

A careful reader might ask: what happens if the bucket _already_ has a zero byte in it? Does that mess up the logic?

Let’s say our bucket is `0xAA00CCDD` and we're searching for a non-zero fingerprint like `0xBB`. The XOR operation transforms the original zero into a non-zero value, so `HasZero` correctly returns `false`.

<ByteLanes state={existingZeroOther} />

Now, what if we search for `0x00` itself (an empty slot in my case)? The mask is `0x00000000`, so the XOR leaves the bucket unchanged. `HasZero` is then applied to the result, which correctly finds the pre-existing zero and returns `true`.

<ByteLanes state={existingZeroEmpty} />

So no, nothing breaks, the algorithm is still robust: `HasZero` only gives a positive result if a zero byte exists after the XOR, which only happens if our target fingerprint was in the bucket to begin with.

## What About Struct Layout?

Even if we're doing all operations on a single 32-bit integer, the possibility to access each individual slot without shifts as was done before is still very helpful. To effectively combine the structs and this bitwise trick, we need to explicitly set the field offsets:

```csharp
[StructLayout(LayoutKind.Explicit, Size = 4)]
private struct Bucket
{
    [FieldOffset(0)] public uint All;
    [FieldOffset(0)] public byte Fp0;
    [FieldOffset(1)] public byte Fp1;
    [FieldOffset(2)] public byte Fp2;
    [FieldOffset(3)] public byte Fp3;
}
```

`StructLayout` attribute with `LayoutKind.Explicit` mode and `Size = 4` ensures that the struct is laid out in memory as a 4-byte block and we have full control what parts of memory are mapped to each field.

The `FieldOffset` attribute is used to set the offset in bytes where each individual field starts in the memory layout. So `Fp0` is at offset `0`, i.e. at the beginning of the struct, and accessing it will access the lowest byte of the integer (bits 7..0), because this field is of type `byte`. `Fp1` will access the next byte (bits 15..8), and so on.

What's cool is that `All` field is accessing whole bucket as a single 32-bit integer, so we can use it to perform the lookup with a single instruction! For example, here is how `0x12345678` is mapped to the fields:

<Scrollbox>

```svgbob alt="The 32-bit value 0x12345678 split into four bytes: Fp3 is 0x12 at offset 3, Fp2 is 0x34 at offset 2, Fp1 is 0x56 at offset 1 and Fp0 is 0x78 at offset 0. All covers the whole value."
          31            24 23            16 15             8 7              0
         +----------------+----------------+----------------+----------------+
         |    00010010    |    00110100    |    01010110    |    01111000    |
         |      0x12      |      0x34      |      0x56      |      0x78      |
         +----------------+----------------+----------------+----------------+
          |              | |              | |              | |              |
          +---- Fp3 -----+ +---- Fp2 -----+ +---- Fp1 -----+ +---- Fp0 -----+
              offset 3         offset 2         offset 1         offset 0
          |                                                                 |
          +------------------------------ All ------------------------------+
```

</Scrollbox>

## Putting It All Together

Here's the final, branch-free lookup and loop-free lookup with the struct layout:

```csharp
[StructLayout(LayoutKind.Explicit, Size = 4)]
private struct Bucket
{
    [FieldOffset(0)] public uint All;
    [FieldOffset(0)] public byte Fp0;
    [FieldOffset(1)] public byte Fp1;
    [FieldOffset(2)] public byte Fp2;
    [FieldOffset(3)] public byte Fp3;
}

private readonly Bucket[] _table;

public bool Contains(byte fingerprint, uint bucketIdx)
{
    ref readonly var bucket = ref _table[bucketIdx];
    uint mask = fingerprint * 0x01010101U;
    uint xored = bucket ^ mask;
    return ((xored - 0x01010101U) & ~xored & 0x80808080U) != 0;
}
```

Let's see how it looks in action. I will perform same positive and negative lookups as before to see if it outperforms the previous versions.

**Positive lookups (fingerprint exists in the bucket):**

<Scrollbox>

| Method        | Operations  |               Mean |    Ratio |
| ------------- | ----------- | -----------------: | -------: |
| **ByteTable** | **128**     |       **248.1 ns** | **1.00** |
| StructTable   | 128         |           178.6 ns |     0.72 |
| IntTable      | 128         |           154.6 ns |     0.62 |
|               |             |                    |          |
| **ByteTable** | **1024**    |     **1,972.3 ns** | **1.00** |
| StructTable   | 1024        |         1,415.4 ns |     0.72 |
| IntTable      | 1024        |         1,199.0 ns |     0.61 |
|               |             |                    |          |
| **ByteTable** | **1048576** | **2,000,663.8 ns** | **1.00** |
| StructTable   | 1048576     |     1,826,837.4 ns |     0.91 |
| IntTable      | 1048576     |     1,214,772.3 ns |     0.61 |

</Scrollbox>

**Negative lookups (fingerprint does not exist in the bucket):**

<Scrollbox>

| Method        | Operations  |               Mean |    Ratio |
| ------------- | ----------- | -----------------: | -------: |
| **ByteTable** | **128**     |       **323.0 ns** | **1.00** |
| StructTable   | 128         |           200.0 ns |     0.62 |
| IntTable      | 128         |           146.3 ns |     0.45 |
|               |             |                    |          |
| **ByteTable** | **1024**    |     **2,533.1 ns** | **1.00** |
| StructTable   | 1024        |         1,542.7 ns |     0.61 |
| IntTable      | 1024        |         1,149.2 ns |     0.45 |
|               |             |                    |          |
| **ByteTable** | **1048576** | **2,676,830.7 ns** | **1.00** |
| StructTable   | 1048576     |     1,644,196.9 ns |     0.61 |
| IntTable      | 1048576     |     1,213,374.7 ns |     0.45 |

</Scrollbox>

The benchmarks confirmed this bit-twiddling exercise was well worth the effort. Positive lookups became over **40% faster**, while negative lookups became **more than twice as fast** compared to the original byte-array implementation. It's a significant leap even compared to the previous struct version. While readability of algorithm certainly took a hit, the raw performance gain is a trade-off I’m ok with.

## Final Thoughts

I’m still not a huge fan of stuffing dense [bit tricks](https://maltsev.space/blog/011-practical-bitwise-tricks-in-everyday-code) into production C#—they can be hard to read and even harder to maintain if something goes wrong. But I think this little adventure has been worth it: the lookup path is now twice as fast, and the codebase is still compact enough to keep the trick well-commented. I hope these notes save someone else a detour—or at the very least that you enjoyed this little optimization trip with me.
