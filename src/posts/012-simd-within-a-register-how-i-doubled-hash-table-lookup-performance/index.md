---
date: "2025-07-15"
tags:
 - "Bitwise"
 - "C#"
keywords:
 - "C#"
 - "Bitwise tricks"
 - "Hash table"
 - "Performance"
title: "SIMD Within a Register: How I Doubled Hash Table Lookup Performance"
preview: "It started with a simple thought: four bytes in a hash table bucket look just like an integer. Luckily, this one idea led to a deep dive into bit-twiddling and a 2x performance boost."
draft: false
---

<script>
    import { Scrollbox } from '$lib/components';
</script>

While working on a [Cuckoo Filter](https://maltsev.space/blog/010-cuckoo-filters) implementation in C#, I created an array-like structure for the underlying hash table. I chose an 8-bit fingerprint: it aligns nicely on a byte boundary and still keeps the false-positive rate around **3 %**.

The layout looked straightforward—just a byte array where the start of each bucket is calculated as `bucketIdx * bucketSize`. The size of each bucket is 4 slots, which is a solid choice for Cuckoo Filter.

<Scrollbox>

```svgbob
              Bucket 0              Bucket 1                      Bucket n
       +----+----+----+----+ +----+----+----+----+         +----+----+----+----+
Table: | 3A | 00 | B7 | F2 | | 4C | 91 | 00 | DE |   ...   | AA | 00 | 5F | C8 |
       +----+----+----+----+ +----+----+----+----+         +----+----+----+----+
```

</Scrollbox>

But those four bytes in a bucket reminded me of something. They *feel* like … an integer!

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

I’m no bit-twiddling wizard—I live in a cosy, GC-collected world—but those 4 bytes kept itching. A bucket lines up *perfectly* with a 32-bit `uint`; that opens the door to a future lock-free [compare-and-swap](https://en.wikipedia.org/wiki/Compare-and-swap). So I decided to play.

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

Long ago I bookmarked Sean Anderson’s great *[Bit Twiddling Hacks](https://graphics.stanford.edu/%7Eseander/bithacks.html)*. One gem there *"Determine if a word has a zero byte"* is exactly what I need. The C# version is nearly identical:

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

Let's apply it to our `v`, e.g., `0x4462002E`:

First, we subtract `0x01010101U`.

$$
\begin{array}{r}
\texttt{01000100\;01100010\;00000000\;00101110}\;(\texttt{0x4462002E}) \\[-2pt]
-\;
\texttt{00000001\;00000001\;00000001\;00000001}\;(\texttt{0x01010101}) \\ \hline
\texttt{01000011\;01100000\;11111111\;00101101}\;(\texttt{0x4360FF2D})
\end{array}
$$

> [!note]
> Note that this is a single 32-bit subtraction, so borrows can cross byte boundaries. The `0x00` byte borrows from `0x62`, resulting in `0x...60FF...`.

Second, we apply a bitwise NOT to the original value:

$$
\begin{array}{r}
\neg\;
\texttt{01000100\;01100010\;00000000\;00101110}\;(\texttt{0x4462002E}) \\ \hline
\texttt{10111011\;10011101\;11111111\;11010001}\;(\texttt{0xBB9DFFD1})
\end{array}
$$

Now, `&` them together:

$$
\begin{array}{r}
\texttt{01000011\;01100000\;11111111\;00101101}\;(\texttt{0x4360FF2D}) \\[-2pt]
\mathbin{\&}\;
\texttt{10111011\;10011101\;11111111\;11010001}\;(\texttt{0xBB9DFFD1}) \\ \hline
\texttt{00000011\;00000000\;11111111\;00000001}\;(\texttt{0x0300FF01})
\end{array}
$$

Notice that the third byte from the left is `0xFF`. Its most significant bit is `1`, indicating that this was our zero-byte position.

The final `& 0x80808080U` is a mask that removes all other bits, leaving only the most significant bit of each byte.

$$
\begin{array}{r}
\texttt{00000011\;00000000\;11111111\;00000001}\;(\texttt{0x0300FF01}) \\[-2pt]
\mathbin{\&}\;
\texttt{10000000\;10000000\;10000000\;10000000}\;(\texttt{0x80808080}) \\ \hline
\texttt{00000000\;00000000\;10000000\;00000000}\;(\texttt{0x00008000})
\end{array}
$$

The method returns the result of `0x00008000 != 0`. Since `0x8000` is not zero, the expression is `true`, and the method correctly reports that the zero byte was found.

Great, now I can detect a zero byte without branches. All that remains is to *turn the byte I’m searching for into zero*.

## XOR to the Rescue

Let’s assume our integer, aka bucket, is `0x12345678` and I’m looking for byte `0x56`. Without shifts, this seems tough. Luckily, all we need to do is transform the `0x56` byte to `0x00`.

> [!note]
> What happens to the other bytes is irrelevant, because our `HasZero` trick only cares if *any* byte is zero.

The XOR (`^`) operator has a useful property: `A ^ B = 0` if and only if `A == B`. So, if we XOR the entire bucket with a repeating mask of our target byte, only the matching byte will become zero.

$$
\begin{array}{r}
\texttt{00010010\;00110100\;01010110\;01111000}\;(\texttt{0x12345678}) \\[-2pt]
\oplus\;
\texttt{01010110\;01010110\;01010110\;01010110}\;(\texttt{0x56565656}) \\ \hline
\texttt{01000100\;01100010\;00000000\;00101110}\;(\texttt{0x4462002E})
\end{array}
$$

So the remaining part of this puzzle is to make a repetitive mask, which is pretty arithmetic: I should multiply target byte by `0x01010101U`:

$$
\text{mask} \;=\; \text{0x56} \times \text{0x01010101} \;=\; \text{0x56565656}

$$

## What About Existing Zeros?

A careful reader might ask: what happens if the bucket *already* has a zero byte in it? Does that mess up the logic?

Let’s say our bucket is `0xAA00CCDD` and we're searching for a non-zero fingerprint like `0xBB`. The XOR operation transforms the original zero into a non-zero value, so `HasZero` correctly returns `false`.

$$
\begin{array}{r}
\texttt{10101010\;00000000\;11001100\;11011101}\;(\texttt{0xAA00CCDD}) \\[-2pt]
\oplus\;
\texttt{10111011\;10111011\;10111011\;10111011}\;(\texttt{0xBBBBBBBB}) \\ \hline
\texttt{00010001\;10111011\;01110111\;01100110}\;(\texttt{0x11BB7766})
\end{array}
$$

Now, what if we search for `0x00` itself (an empty slot in my case)? The mask is `0x00000000`, so the XOR leaves the bucket unchanged. `HasZero` is then applied to the result, which correctly finds the pre-existing zero and returns `true`.

$$
\begin{array}{r}
\texttt{10101010\;00000000\;11001100\;11011101}\;(\texttt{0xAA00CCDD}) \\[-2pt]
\oplus\;
\texttt{00000000\;00000000\;00000000\;00000000}\;(\texttt{0x00000000}) \\ \hline
\texttt{10101010\;00000000\;11001100\;11011101}\;(\texttt{0xAA00CCDD})
\end{array}
$$

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

The `FieldOffset` attribute is used to set the offset in bytes where each individual field starts in the memory layout. So `Fp0` is at offset `0`, i.e. at the beginning of the struct, and accessing it will access the first byte of the integer, because this field is of type `byte`. `Fp1` will access the second byte, and so on.

What's cool is that `All` field is accessing whole bucket as a single 32-bit integer, so we can use it to perform the lookup with a single instruction!

<Scrollbox>

```svgbob
0          7 8         15 16        23 24        31 <---- Bit indices
+----------+ +----------+ +----------+ +----------+
|   0xAA   | |   0xBB   | |   0xCC   | |   0xDD   |
+----------+ +----------+ +----------+ +----------+
^          ^ ^          ^ ^          ^ ^          ^
|          | |          | |          | |          |
+--- Fp0 --+ +--- Fp1 --+ +--- Fp2 --+ +--- Fp3 --+
^                                                 ^
|                                                 |
+---------------------- All ----------------------+
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
