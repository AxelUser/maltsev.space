---
date: "2025-07-07"
tags:
 - "Bitwise"
keywords:
 - "Bitwise tricks"
 - "Bitwise operations"
title: "Practical Bitwise Tricks in Everyday Code"
preview: "An opinionated and short collection of bitwise tricks that make sense at an average 1x engineer's code."
draft: false
---

I’m not exactly a big fan of writing bitwise operations everywhere. Don’t get me wrong, I still enjoy this kind of “brain gymnastics”, but sometimes it gets out of hand.

Let me show you a classic example. Can you guess what this code does?

```csharp
a ^= b;
b ^= a;
a ^= b;
```

Three XOR operations look neat, right? XOR tricks can be pretty cool when [used properly](https://maltsev.space/blog/010-cuckoo-filters#fingerprints-and-partial-key-cuckoo-hashing). But in this case, all it does is something very common in everyday code:

```csharp
var temp = a;
a = b;
b = temp;
```

Yep, just a plain old swap of two variables.

I’ve used the XOR version maybe twice in my life: once during a university assignment and once in early job interviews (which I’d rather not relive, lol). So, which version do you think is easier to read?

If you’re unsure, here’s the funnier part: the XOR version [isn't even faster](https://en.wikipedia.org/wiki/XOR_swap_algorithm#Reasons_for_avoidance_in_practice) thanks to how modern CPUs handle operations.

Still, you’ll run into this kind of code, especially in tight loops in libraries or low-level systems. In this short article, I’ll walk you through some real-world bitwise operations I’ve seen in the wild, the ones that make sense, and the ones I occasionally write myself.

## Contents

## Case 1: Multiplying and Dividing by Two

Let’s start with a simple micro-optimization—replacing multiplication and division by powers of two with bitwise shifts.

If you're not yet comfortable with binary math, here's the basic idea: binary numbers are built on powers of two. Each bit represents a multiplier of 2 raised to some power.

For example, the binary number `1011` is interpreted like this:

$$
1⋅2^3+0⋅2^2+1⋅2^1+1⋅2^0=8+0+2+1=11
$$

You can think of each left shift (`<<`) as multiplying by 2, and each right shift (`>>`) as dividing by 2 — just like moving the decimal point in base-10 multiplies or divides by 10.

```csharp
var doubled = x << 1; // x * 2
var half = x >> 1;    // x / 2
```

For example, if `var x = 6`, then:

- `x << 1` becomes `12`
- `x >> 1` becomes `3`

This works because shifting left fills in zeros on the right (doubling the value), while shifting right drops the least significant bit, i.e., halving it.

> [!warning]
> This is a very specific case. In most real-world code, you should stick with the `*` and `/` operators instead—they're clearer and modern [compilers optimize them just fine](https://tech.michaelaltfield.net/2009/12/02/gcc-optimizations-for-arithmetic-operations-using-bit-shifts/). But this example shows how bitwise shifts directly affect the decimal representation of a value. So better to know this.

## Case 2: Extracting Parts of a Big Value

Go on with another widespread use case. Imagine you're working with a hashing function that gives you a 64-bit unsigned integer. But in your code, you actually need two 32-bit values instead. Maybe you want to use one for bucketing and the other for a cache key — whatever the case, you'd prefer to [avoid hashing twice](https://maltsev.space/blog/008-bloom-filters-pt1#wide-hash-split) if you can just reuse the result.

So, how do we split that big 64-bit value into smaller chunks?

Again, the answer is **bitwise shifts and binary masks:**

```csharp
ulong hash = 0x1122334455667788;

uint hi = (uint)(hash >> 32);        // extract the upper 32 bits
uint lo = (uint)(hash & 0xFFFFFFFF); // extract the lower 32 bits
```

Now `hi` contains `0x11223344` and `lo` contains `0x55667788`.

So what exactly happens:

- `hash >> 32` shifts the 64-bit value 32 bits to the right, dropping the lower half, leaving just the upper 32 bits.
- `hash & 0xFFFFFFFF` masks the upper bits, keeping only the lower 32. The result of the bitwise AND will leave only those bits that are set both in the value and the mask. The upper bits will be reset in this example because they are all zero in the mask.

## Case 3: Modulo Operation for Power-of-Two Integers

This little trick always appears in real-world systems, often in [hash tables](https://github.com/seiflotfy/cuckoofilter/blob/master/util.go#L38) and circular buffers.

Let’s say you want to map a hashed value to an index in an array:

```csharp
var index = x % 8;
```

Here, `x` is a large hashed integer (often 64 bits), and you want to map it into an array of 8 buckets. The modulo operation (`%`) is the obvious choice, but it’s not the fastest one.

When the array size is a **power of two** — like 2, 4, 8, 16, and so on — you can use bitwise masking instead:

```csharp
var index = x & 7; // same as x % 8, but faster
```

Because when the divisor is a power of two, the result of `x % N` is just the last few bits of `x`. In this example:

- `8` in binary is `1000`, so `8 - 1 = 7` is `0111` (`0b111`)
- Doing `x & 0b111` keeps only the last 3 bits of `x`, which gives the same result as `x % 8`

This is faster than the modulo operation, which usually requires a division under the hood.

## Case 4: Working with Binary Flags

Bitwise flags are one of the oldest tricks and are still incredibly useful. They let you store and manipulate multiple boolean values in a single number. For example, if you change file permissions in Linux, you use binary flags.

Instead of using a bunch of `bool` variables, you can just use bits to represent flags:

```csharp
const int FlagRead   = 1 << 0; // 0001
const int FlagWrite  = 1 << 1; // 0010
const int FlagDelete = 1 << 2; // 0100
```

Each flag is a single bit turned on in a different position. Then, you can combine them using bitwise OR:

```csharp
var permissions = FlagRead | FlagWrite; // 0001 | 0010 = 0011
```

Now `permissions` hold both the "read" and "write" flags.

To see if a specific flag is set, use bitwise AND:

```csharp
if ((permissions & FlagRead) != 0)
{
    Console.WriteLine("Can read!");
}
```

If the flag bit is on, the result of the `&` will be non-zero.

To turn off a specific flag, use bitwise AND with the negated flag:

```csharp
permissions &= ~FlagWrite; // remove write access
```

Here, `~FlagWrite` flips the bits of `FlagWrite`, ones become zeros and vice-versa, so the AND clears set bits in `FlagWrite`.

You can also flip a flag on/off using XOR:

```csharp
permissions ^= FlagDelete; // toggles delete permission
```

If the flag is off, it turns on; if it is on, it turns off.

Using bit flags is super compact; for example, one 64-bit integer can store 64 flags. This is especially handy when packing lots of booleans into memory-efficient structures and implementing a general approach to [C-flavored enums, e.g., in C#](https://maltsev.space/blog/001-binary-shifts-for-flags).

## Stay ~~Hungry~~ Reasonable

I hope this article gave you a useful peek into some real-world bitwise operations and shared some of my experience using them in practice.

Bitwise tricks can be powerful, fun, and sometimes even elegant — but like many low-level optimizations, they come with a trade-off in **readability**.

In most cases, writing code that's easy to understand is far more valuable than squeezing out a few extra CPU cycles. Your future self or teammate will thank you when debugging that code six months later.

So, use bitwise operations wisely. When things start looking too clever or cryptic, take a step back. A small, well-named function or abstraction helps distinguish between a clever trick and an unreadable mess.
