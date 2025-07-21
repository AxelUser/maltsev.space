---
date: "2018-10-27"
tags:
  - "C#"
keywords:
  - "C#"
  - "CallerMemberName"
title: "Using CallerMemberName for Improved Logging in C#"
preview: 'Learn how to use "magic" attributes in C#, such as CallerFilePath, CallerLineNumber, and CallerMemberName, to retrieve caller information and improve logging functionality.'
draft: false
legacy: true
hero: /images/blog/002-callermembername-attribute-for-logging/hero.jpg
---

In software development, especially when working with large codebases, tracking down where and how methods are called can be a challenging task. Debugging and logging become essential tools in a developer's toolkit to understand the flow of execution and identify issues.

Since C# 4.5, the language introduced a set of "magic" attributes that greatly simplify this process. These attributes automatically provide information about the caller, making your code cleaner and more maintainable.

This blog post will delve into how these attributes work, provide examples of their use, and demonstrate how they can enhance your debugging and logging efforts.

## Understanding Caller Information Attributes

Caller information attributes are designed to retrieve metadata about the caller of a method. They are `CallerFilePath`, `CallerLineNumber` and `CallerMemberName`.

These attributes allow you to change the default values of optional parameters in methods, providing valuable information about the location in the code where the method was called.

## What is a Caller?

In programming, a *caller* is the piece of code that invokes (calls) a method or function. Understanding the context of the caller can help in debugging and maintaining code, as it tells you where a particular method was called from within your application.

## Default Behavior of Optional Parameters

By default, the compiler translates optional parameters into their default values if no other value is provided. For example, consider the following logging method:

```csharp
void Log(string msg, string method = null)
{
    // logging somewhere
}
```

If you call this method with `Log(msg)`, the compiler translates this to `Log(msg, null)`.

## Enhancing Optional Parameters with Caller Attributes

You can enhance this behavior using caller attributes. By placing these attributes before the optional parameters in your method, the compiler will automatically fill in the predefined values:

- `CallerFilePath` passes the full path of the source code file where the method was called.
- `CallerLineNumber` passes the line number (as an integer) where the method was called.
- `CallerMemberName` passes the name of the member (constructor, method, property, event, etc.) that called the method.

## Example: Tracing or Logging

For instance, if you want to write tracing or logging code and need to know where an event occurred, you can use these attributes as shown below:

```csharp
public static void TraceEvent(string message,
    [CallerMemberName] string memberName = "",
    [CallerFilePath] string sourceFilePath = "",
    [CallerLineNumber] int sourceLineNumber = 0)
{
    Trace.WriteLine("event: " + message);
    Trace.WriteLine("member name: " + memberName);
    Trace.WriteLine("source file path: " + sourceFilePath);
    Trace.WriteLine("source line number: " + sourceLineNumber);
}
```

When you invoke this method:

```csharp
static void Main(string[] args)
{
    TraceEvent("Started");
}
```

You will see output similar to:

```plaintext
event: Started
member name: Main
source file path: C:\some\path\to\source\CallerInfoTest.Cli\CallerInfoTest.Cli\Program.cs
source line number: 11
```

### Example: Implementing INotifyPropertyChanged

If you are familiar with `INotifyPropertyChanged`, you can implement the PropertyChanged event without the hassle of always passing the name of the property that was changed. Here is an example:

```csharp
public class ViewModel: INotifyPropertyChanged
{
    private String _message;

    public String Message
    {
        get => _message;
        set
        {
            if (value == _message) return;
            _message = value;
            OnPropertyChanged();
        }
    }

    public event PropertyChangedEventHandler PropertyChanged;

    protected virtual void OnPropertyChanged([CallerMemberName] String propertyName = null)
    {
        PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
    }
}
```

In this example, the `OnPropertyChanged` method uses the `[CallerMemberName]` attribute to automatically provide the name of the property that has changed, eliminating the need to manually specify it each time.

## Final Thoughts

Leveraging caller information attributes in C# can significantly simplify your debugging, logging, and event-handling code, making it more robust and easier to maintain.

By automatically providing information about the caller, these attributes save you time and reduce the likelihood of errors in your code. For more details on these attributes, you can refer to the [official documentation](https://docs.microsoft.com/ru-ru/dotnet/csharp/programming-guide/concepts/caller-information) about these attributes.
