---
date: "2024-02-18"
tags:
  - "C#"
keywords:
  - "C#"
  - "Visitors Pattern"
  - "Type pattern matching"
  - "switch keyword"
title: "Fixing C# type pattern-matching"
preview: "Craving Kotlin's secure pattern matching on sealed classes for your C# code? Discover how the Visitor Pattern can satisfy your longing!"
draft: false
---

Hello there! Are you looking for ways to make your code more robust, maintainable, and less prone to runtime errors? Well, buckle up because today we're going to explore how to substitute type pattern matching in C# with the Visitors pattern. Yes, I know it sounds a bit strange, but stick with me, and you'll see how this can help you write better code.

## Task example: Validation of property values

So let's start with an example. Imagine we have a marker interface for some property value - `IValue`. It has two implementations - `StringValue` and `NumericValue`, holding `string` and `long` values respectively.

```csharp
public interface IValue { }

public record StringValue(string? Value) : IValue;

public record NumericValue(long Value) : IValue;
```

As an example, let's implement validation of those values. We write a static helper function `IsValid`, which accepts `IValue` and returns a boolean value: `true` if the value is valid, `false` otherwise. We do it in a straightforward way - just make a `switch` expression with branches for `StringValue` and `NumericValue` types. But for our `switch` to be exhaustive, we're forced to make a default branch with throwing `UnreachableException`.

```csharp
public static class ValidationHelper
{
    public static bool IsValid(IValue value)
    {
        return value switch
        {
            StringValue stringValue => !string.IsNullOrWhiteSpace(stringValue.Value),
            NumericValue numericValue => numericValue.Value >= 0,
            _ => throw new UnreachableException()
        };
    }
}
```

So a simple console application that spins the gears of our code will look like that:

```csharp
while (true)
{
    Console.Write("Write a property value: ");
    var input = Console.ReadLine();
    var value = Parse(input);
    Console.WriteLine($"Value '{input}' is valid: " + ValidationHelper.IsValid(value));    
}

static IValue Parse(string? value)
{
    if (long.TryParse(value, out var num)) return new NumericValue(num);
    return new StringValue(value);
}
```

Let's test it:

```
Write a property value: foo
Value 'foo' is valid: True
Write a property value: 1 
Value '1' is valid: True
Write a property value: -42
Value '-42' is valid: False
```

## The issue

At first glance everything looks fine! But what if we have dozens of such type pattern matching across the project, and some other developer introduces a new type for a value, for example, `DateTimeValue`?

In that case, he or she needs to find all usages of pattern matching for `IValue` and add a branch for the new type. And also write tests to check that we won't have an `UnreachableException` thrown at runtime:

```csharp
public record DateTimeValue(DateTimeOffset Value) : IValue;
```

As our case is very simple, still, let's imaging that our imaginary developer implemented only parsing of the new type, but forgot to handle it in our helper function.

```csharp
static IValue Parse(string? value)
{
    if (long.TryParse(value, out var num)) return new NumericValue(num);
    // Parsing date, no other changes!
    if (DateTimeOffset.TryParse(value, out var dateTime)) return new DateTimeValue(dateTime);
    return new StringValue(value);
}
```

So, you may already guess what will happen if we pass `2024-02-18T19:38:37Z` to our CLI input.

```
Write a property value: 2024-02-18T19:38:37Z
Unhandled exception. System.Diagnostics.UnreachableException: The program executed an instruction that was thought to be unreachable.                                
   at TypePatternMatchingOnVisitors.ValidationHelper.IsValid(IValue value) in C:\Users\AxelU\projects\learn\TypePatternMatchingOnVisitors\ValidationHelper.cs:line 13
   at Program.<Main>$(String[] args) in C:\Users\AxelU\projects\learn\TypePatternMatchingOnVisitors\Program.cs:line 8                                                

Process finished with exit code -532,462,766.
```

We found a bug! (how surprisingly, ha-ha)

Imaging that this will happen in production during the midnight while you're on-call. **Not so funny now, huh?**

## Solution: Visitor Pattern

I'm sure that this bug can be found with tests or during code-review. But can we have a compilation error, indicating what places to fix? Like in Kotlin or Java with sealed interfaces and classes that allow creating an exhaustive `when` expression without a default branch and receiving compilation errors when a new type is not handled.

Unfortunately, in C# we don't have language support for that yet. But surprisingly, an old-fashioned OOP pattern called [Visitor](https://refactoring.guru/design-patterns/visitor) can help us achieve that. We can add a generic `Accept<T>` method for `IValue`, which accepts `IValueVisitor<T>` and returns a value of type `T`.

```csharp
public interface IValue
{
    T Accept<T>(IValueVisitor<T> visitor);
}
```

Interface `IValueVisitor<T>` has methods `Accept`, with overloads, each accepting an implementation of `IValue` interface as a parameter and returning a value of generic type `T`.

```csharp
public interface IValueVisitor<out T>
{
    T Visit(StringValue stringValue);
    T Visit(NumericValue numericValue);
}
```

In all `IValue` implementations, we just call `visitor.Visit(this)` and return the value from this invocation:

```csharp
public record StringValue(string? Value): IValue
{
    public T Accept<T>(IValueVisitor<T> visitor) => visitor.Visit(this);
}

// ... same for other IValue implementations
```

We can rewrite a helper validation function to a class `ValueValidationVisitor`, that for each `Visit` overload performs the same check as it was done for the static function described above, generic type parameter in that case will be `bool`. Here's how it looks like:

```csharp
public class ValueValidationVisitor: IValueVisitor<bool>
{
    public bool Visit(StringValue stringValue) => !string.IsNullOrWhiteSpace(stringValue.Value);

    public bool Visit(NumericValue numericValue) => numericValue.Value >= 0;
}
```

When a developer adds a new class implementing `IValue`, for example, `DateTimeValue`, we need to implement an `Accept` method, which should invoke the visitor's `Visit` method:

```csharp
public record DateTimeValue(DateTimeOffset Value) : IValue
{
    // Compilation error - we don't implement Visit for this value type yet!
    public T Accept<T>(IValueVisitor<T> visitor) => visitor.Visit(this);
}
```

But there's no such overload at `IValueVisitor<T>` that accepts `DateTimeValue` value, so we've got to add it into `IValueVisitor<T>` and implement it all over visitor's implementations:

```csharp
public interface IValueVisitor<out T>
{
    // ... other Visit overloads

    T Visit(DateTimeValue dateTimeValue);
}

public class ValueValidationVisitor: IValueVisitor<bool>
{
    // singleton for visitor cause it's stateless and safe to share between IValue instances
    public static readonly ValueValidationVisitor Instance = new();

    // ... other Visit overloads

    public bool Visit(DateTimeValue dateTimeValue) => dateTimeValue.Value <= DateTimeOffset.UtcNow;
}

```

So after all tons of code we've written, we can now change the console app and use `ValueValidationVisitor` instead of `ValidationHelper`. There's also a singleton instance of `ValueValidationVisitor` that we can use in client code, so let's do it.

```csharp
while (true)
{
    Console.Write("Write a property value: ");
    var input = Console.ReadLine();
    var value = Parse(input);
    //Console.WriteLine($"Value '{input}' is valid: " + ValidationHelper.IsValid(value));    
    Console.WriteLine($"Value '{input}' is valid: " + value.Accept(ValueValidationVisitor.Instance));    
}
```

Voilà, now not only the bug is fixed, but also the chance of missed type handling is reduced, so in overall we strengthen our type-safety guarantees.

## Final thoughts

However Visitor pattern is a lot more verbose than simple switch statement or expression, we are now almost absolutely sure that the developer doesn't miss to handle its new type. And as a reviewer, one will see all places that were changed in git diff without the need to double-check in the code of the project.

So there you have it! By using Visitor pattern, you can make your C# code more maintainable and less prone to runtime errors, especially when adding new types or modifying existing ones. It may not be as elegant or concise, but it can save you a lot of headaches in the long run. If you want to see code - check it in [this](https://github.com/AxelUser/TypePatternMatchingOnVisitors) repository.

And remember, a little bit of extra verbosity is worth the peace of mind!
