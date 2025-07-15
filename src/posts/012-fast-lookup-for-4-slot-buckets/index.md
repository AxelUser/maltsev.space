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
title: "Fast Lookup for 4-Slot Buckets"
preview: "My little bit-twiddling adventure, how I migrated my hash table from byte array to integer array."
draft: false
---

While working on a [Cuckoo Filter](https://maltsev.space/blog/010-cuckoo-filters) implementation in C#, I created an array-like structure for the underlying hash table. I chose an 8-bit fingerprint: it aligns nicely on a byte boundary and still keeps the false-positive rate around **3 %**.

The layout looked straightforward—just a byte array where the start of each bucket is calculated as `bucketIdx * bucketSize`.

But those four bytes in a bucket reminded me of something. They *feel* like … an integer!

I wasn’t chasing ultra-low latency—after all, this is C#—but I couldn’t resist experimenting. Could I speed up lookups in my Cuckoo Filter by replacing the 4-byte bucket with a plain old 32-bit integer?

Time to find out.

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
    var s = bucketIdx * 4;
    for (var i = s; i < s + BucketSize; i++)
    {
        if (_table[i] == fingerprint) return true;
    }

    return false;
}
```

(Please ignore the missing bounds checks—they’re not the point today.)

I’m no bit-twiddling wizard—I live in a cosy, GC-collected world—but those 4 bytes kept itching. A bucket lines up *perfectly* with a 32-bit `uint`; that opens the door to a future lock-free `CAS` (compare-and-swap). So I decided to play.

## Migrating to a `uint` Table

Switching the backing array is trivial because the hash table is still one-dimensional:

```diff
- private readonly byte[] _table;
+ private readonly uint[] _table;
```

Now let’s refactor the lookup:

```diff

public bool Contains(byte fingerprint, uint bucketIdx)
{
-   var s = bucketIdx * 4;
+   var bucket = _table[bucketIdx];
-   for (var i = s; i < s + BucketSize; i++)
+   for (var i = 0; i < BucketSize; i++)
    {
-       if (_table[i] == fingerprint) return true;
+       var shift = i * 8;
+       var fp = (byte)(bucket >> shift);
+       if (fp == fingerprint) return true;
    }

    return false;
}
```

The bucket offset disappears because each `uint` is a bucket. But I’ve lost the luxury of direct indexing—unless I convert the integer to bytes first:

```csharp
  Span<byte> bucketBytes = stackalloc byte[sizeof(uint)];
  BitConverter.TryWriteBytes(bucketBytes, _table[bucketIdx]);

  for (var i = 0; i < BucketSize; i++)
  {
      var fp = bucketBytes[i];
      if (fp == fingerprint) return true;
  }
```

That still loops. Can we eliminate the loop entirely?

## Finding a Byte with Masking

Long ago I bookmarked Sean Anderson’s great “[Bit Twiddling Hacks](https://graphics.stanford.edu/%7Eseander/bithacks.html).” One gem there—*Determine if a word has a zero byte*—is exactly what I need. The C# version is nearly identical:

```csharp
private static bool HasZero(uint v)
{
    return ((v - 0x01010101U) & ~v & 0x80808080U) != 0;
}
```

Admittedly opaque, so let’s unpack it.

The core of the trick is `(v - 0x01010101U) & ~v`. This expression has a special property:

- **For any non-zero byte b**, the most significant bit of (b - 1) & ~b will always be 0.
- **For a zero-byte b = 0x00**, the expression becomes `(0x00 - 1) & ~0x00`, which is `0xFF & 0xFF = 0xFF`. The most significant bit is `1`.

So, this operation creates a "marker" bit (it sets the most significant bit to `1`) in any byte position that was originally `0x00`.

Let's apply it to our `v`, e.g., `0x4462002E`:

1. `v - 0x01010101U` = `0x4360FF2D`
2. `~v` (i.e. bitwise NOT) = `0xBB9DFFD1`

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

Let’s assume our integer, aka bucket, is `0x12345678` and I’m looking for byte `0x56` . Without shifts, this seems tough. Luckily, all we need to transform `0x12345678` into something like `0x12340078` , i.e. transform `0x56` byte to `0x00`.

The XOR (`^`) operator has a useful property: `A ^ B = 0` if and only if `A == B`. So, if we apply a mask consisting only of repetitive bits `0x56` , we would transform it to `0x00` in a bucket.

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

## Putting It All Together

Here’s the final, branch-free lookup:

```csharp
public bool Contains(byte fingerprint, uint bucketIdx)
{
    uint bucket = _table[bucketIdx];
    uint mask = fingerprint * 0x01010101U;
    uint xored = bucket ^ mask;
    return ((xored - 0x01010101U) & ~xored & 0x80808080U) != 0;
}
```

We XOR to zero-out matching bytes, then use the bit-twiddling trick to see if any byte is zero.

In benchmarks, this cut both negative and positive lookup time almost *in half* compared to the byte-array version. Readability certainly took a hit, but at least I can justify it with real performance.

| Method                    | Operations | Mean           | Error       | StdDev      | Ratio | RatioSD | Allocated | Alloc Ratio |
|-------------------------- |----------- |---------------:|------------:|------------:|------:|--------:|----------:|------------:|
| **ByteTable_PositiveLookups** | **128**        |       **245.2 ns** |     **4.82 ns** |     **6.27 ns** |  **1.00** |    **0.04** |         **-** |          **NA** |
| IntTable_PositiveLookups  | 128        |       147.7 ns |     1.54 ns |     1.44 ns |  0.60 |    0.02 |         - |          NA |
| ByteTable_NegativeLookups | 128        |       324.1 ns |     1.93 ns |     1.71 ns |  1.32 |    0.03 |         - |          NA |
| IntTable_NegativeLookups  | 128        |       147.1 ns |     0.77 ns |     0.69 ns |  0.60 |    0.02 |         - |          NA |
|                           |            |                |             |             |       |         |           |             |
| **ByteTable_PositiveLookups** | **1024**       |     **1,845.6 ns** |     **4.46 ns** |     **3.72 ns** |  **1.00** |    **0.00** |         **-** |          **NA** |
| IntTable_PositiveLookups  | 1024       |     1,139.4 ns |     5.33 ns |     4.72 ns |  0.62 |    0.00 |         - |          NA |
| ByteTable_NegativeLookups | 1024       |     2,561.2 ns |    49.52 ns |    46.32 ns |  1.39 |    0.02 |         - |          NA |
| IntTable_NegativeLookups  | 1024       |     1,136.3 ns |     3.52 ns |     2.94 ns |  0.62 |    0.00 |         - |          NA |
|                           |            |                |             |             |       |         |           |             |
| **ByteTable_PositiveLookups** | **1048576**    | **1,908,031.9 ns** | **3,278.50 ns** | **3,066.71 ns** |  **1.00** |    **0.00** |         **-** |          **NA** |
| IntTable_PositiveLookups  | 1048576    | 1,170,627.6 ns | 7,405.55 ns | 6,564.83 ns |  0.61 |    0.00 |         - |          NA |
| ByteTable_NegativeLookups | 1048576    | 2,574,882.8 ns | 7,435.16 ns | 6,208.70 ns |  1.35 |    0.00 |         - |          NA |
| IntTable_NegativeLookups  | 1048576    | 1,172,802.0 ns | 1,862.90 ns | 1,454.43 ns |  0.61 |    0.00 |         - |          NA |

## Final Thoughts

I’m still not a huge fan of stuffing dense bit tricks into production C#—they can be hard to read and even harder to maintain if something goes wrong. But I think this little adventure has been worth it: the lookup path is now twice as fast, and the codebase is still compact enough to keep the trick well-commented. I hope these notes save someone else a detour—or at the very least that you enjoyed this little optimization trip with me.
