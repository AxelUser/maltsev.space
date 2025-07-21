---
date: "2018-11-15"
tags:
  - "C#"
keywords:
  - "C#"
  - "deconstructors"
  - "tuples"
  - "operation-result"
title: "Benefits of deconstructors for custom types"
preview: "How and when to use deconstruction syntax-sugar for your custom types in C#"
draft: false
legacy: true
hero: /images/blog/004-deconstructors/hero.jpg
---

## About Tuples in C# 7

New tuples and its support in C# 7 are blazing-cool:

- they are structures, so no heap allocations;
- they have aliases for names of its fields (`tuple.Info` vs old `tuple.Item1`);
- they bring syntax-sugar of deconstruction;

Moreover, the deconstruction can be used not only for build-in tuples, but also for your own classes and structures.

## Deconstruction for Tuples

Let's start with the original usage for tuples. If you are already familiar with it, you may jump to [the next block](#implementing-deconstruction-for-custom-types).

For example, you have a method, which returns a statistic about most frequent word in a form of a tuple with two fields: word and count. Below is the example of such method:

```csharp
static (string, int) GetMostFrequentWord(string text)
{
    var group = text.Split(' ')
        .GroupBy(s => s)
        .OrderByDescending(grouping => grouping.Count())
        .First();

    return (group.Key, group.Count());
}
```

As you see, `GetMostFrequentWord` returns unnamed tuple, and you can access its fields via `Item1` and `Item2`:

```csharp
static void Main(string[] args)
{
    string text = "tuple for testing tuple";
    var stat = GetMostFrequentWord(text);
    Trace.WriteLine($"word: {stat.Item1}, count: {stat.Item2}");
}
```

On the other hand, if you implement named-tuple, those values can be accessed through aliases, you just need to make some changes into declaration of the tuple:

```csharp
// we added aliases for the output below
static (string word, int count) GetMostFrequentWord(string text)
{
    // same logic
}

static void Main(string[] args)
{
    string text = "tuple for testing tuple";
    var stat = GetMostFrequentWord(text);
    // but now we use aliases for fields
    Trace.WriteLine($"word: {stat.word}, count: {stat.count}");
}
```

However, our original need is just getting those fields `word` and `count`, we don't really care about grouping tuple. So be it: with the help of deconstruction, we can initialize only variables `word` and `count`:

```csharp
static void Main(string[] args)
{
    string text = "tuple for testing tuple";
    // no tuple now, just values from its fields
    (string word, int count) = GetMostFrequentWord(text);
    Trace.WriteLine($"word: {word}, count: {count}");
}
```

In addition, you can even use `var` for completely deconstructed tuple, instead of specifying explicit types for every field:

```csharp
var (word, count) = GetMostFrequentWord(text);
```

If you don't need some fields from deconstruction, you can use another feature of C# 7 - [discards](https://docs.microsoft.com/ru-ru/dotnet/csharp/discards). For example, if we want to discard the creation of variable `count` during deconstruction, we can pass `_` instead:

```csharp
static void Main(string[] args)
{
    string text = "tuple for testing tuple";
    var (word, _) = GetMostFrequentWord(text);
    Trace.WriteLine($"Most frequent word: {word}");
}
```

## Implementing Deconstruction for Custom Types

Using deconstruction of tuples is quite straightforward, how about user-defined types? You may want `GetMostFrequentWord` to return your own struct `WordStat`:

```csharp
public struct WordStat
{
    public string Word { get; set; }

    public int Count { get; set; }

    public WordStat(string word, int count)
    {
        Word = word;
        Count = count;
    }
}

static WordStat GetMostFrequentWordStats(string text)
{
    var group = text.Split(' ')
        .GroupBy(s => s)
        .OrderByDescending(grouping => grouping.Count())
        .First();

    return new WordStat(group.Key, group.Count());
}
```

Generic tuples are great, but there are several reasons for using your own models:

- Better readability, as your code became less "technical".
- Easy refactoring, for example, if you want to change field names or add new ones.
- Your model has domain specifics, but generic tuples - doesn't.

So, we will use `WordStat` instead of a tuple, but can we use deconstruction for our model?

We are lucky because we can add this feature to our type. All is needed is adding new public method `Deconstruct` with `out` parameters, that will be extracted during deconstruction:

```csharp
public void Deconstruct(out string word, out int count)
{
    word = Word;
    count = Count;
}
```

After that, smart compiler will use this method to produce deconstructed values:

```csharp
static void Main(string[] args)
{
    string text = "tuple for testing tuple";
    // visually nothing has changed
    var (word, count) = GetMostFrequentWordStats(text);
    Trace.WriteLine($"word: {word}, count: {count}");
}
```

Deconstructed fields must be of same types and in same order and count, as they appear in `Deconstruct`. You can have as many configurations of deconstruction, as how many overrides of `Deconstruct` you have.
One more thing - `Deconstruct` may be an extension-method!

Let's add a new field `WordLength` to `WordStat` and write an extension to get all those three fields:

```csharp
public static class Extensions
{
    public static void Deconstruct(this Program.WordStat stat, out string word, out int count, out int length)
    {
        word = stat.Word;
        count = stat.Count;
        length = stat.WordLength;
    }
}
```

Now we can get word's length from deconstruction:

```csharp
static void Main(string[] args)
{
    string text = "tuple for testing tuple";
    var (word, count, length) = GetMostFrequentWordStats(text);
    Trace.WriteLine($"word: {word}, count: {count}, length: {length}");
}
```

## Use-Cases of Deconstruction

Imagine a service, which sends you some data, for example aggregational count of some records in some data-sources. Method takes a long time to aggregate. Let's say it's signature will be:

```csharp
Task<int> Count(string[] dataSourcesUrls);
```

What if service failed, while retrieving count; or even more complicated - it failed only for several sources. What will be the result of `Count`: partial count, `default(int)`, `-1`, `null` (if it will be `Nullable<int>`)? Or maybe `Count` will throw an exception?

One approach is to use complex type as a result; often it is named as **Operation Result**. It usually consists of requested data and some information about errors, which have been occurred (or not). Below is the example:

```csharp
// Our service
public class AggregationService
{
    public Task<OperationResult<int>> Count(string[] dataSourcesUrls)
    {
        return Task.FromResult(
            OperationResult<int>.CreatePartly(100,
                new Exception($"Data from url '{dataSourcesUrls[0]}' was not loaded, but it's OK, go on")));
    }
}
```

```csharp
// Complex result
public class OperationResult<TResult>
{
    private OperationResult()
    {
    }

    public bool Success { get; private set; }
    public TResult Result { get; private set; }
    public Exception Exception { get; private set; }
    public bool IsTotallySuccessful => Success && Exception == null;

    // Factories
    public static OperationResult<TResult> CreateSuccessful(TResult result)
    {
        return new OperationResult<TResult>
        {
            Success = true,
            Result = result
        };
    }

    public static OperationResult<TResult> CreatePartly(TResult result, Exception e)
    {
        return new OperationResult<TResult>
        {
            Success = true,
            Result = result,
            Exception = e
        };
    }

    public static OperationResult<TResult> CreateFailed(TResult result, Exception e)
    {
        return new OperationResult<TResult>
        {
            Success = false,
            Exception = e
        };
    }
}
```

```csharp
// Consumer of our service
public class Consumer
{
    public async Task Run()
    {
        var urls = new[]
        {
            "https://www.maltsev.space/sources/1",
            "https://www.maltsev.space/sources/2",
            "https://www.maltsev.space/sources/3"
        };

        var service = new AggregationService();

        var countResult = await service.Count(urls).ConfigureAwait(false);
        if(countResult.IsTotallySuccessful)
            Trace.WriteLine($"Total count: {countResult.Result}");
        else if (countResult.Success)
            Trace.WriteLine($"Count is around: {countResult.Result}\nError: {countResult.Exception}");
        else
            Trace.WriteLine($"Error: {countResult.Exception}");
    }
}
```

The main idea is that it is grouping result and errors, so we have full information about result of the operation and may react as we want. In our case we want to show user any result, even if it isn't full.

So, as in the example with frequent word, our model of complex result just group everything together. It's useful when we construct complex result via our factory-methods, but then in the consumer we need only its fields.

There may be different ways of how we consume these results, for example, we just need requested data, even if it may be equals `default` (empty).

So, we can use deconstruction and discards. Firstly, we create `Deconstruct` with all 4 fields:

```csharp
public void Deconstruct(out TResult result, out bool success, out bool totalSuccess, out Exception exception)
{
    result = Result;
    success = Success;
    totalSuccess = IsTotallySuccessful;
    exception = Exception;
}
```

Then we can deconstruct it as we want:

```csharp
var (count, _, totalSuccess, _) = await service.Count(urls).ConfigureAwait(false);

if(totalSuccess)
    Trace.WriteLine($"Total count: {count}");
```

And that's it, were are ready to go on!

## Further Reading

- [Documentation about deconstruction](https://docs.microsoft.com/ru-ru/dotnet/csharp/deconstruct)
- [Some investigation about how new tuples work](https://blogs.msdn.microsoft.com/seteplia/2017/11/01/dissecting-the-tuples-in-c-7/)
- [Article about different kinds of error handling, like OperationResult](https://www.codeproject.com/Articles/1022462/Error-Handling-in-SOLID-Csharp-NET-The-Operation-R)
