---
date: "2018-11-12"
tags:
  - "C#"
keywords:
  - "C#"
  - "testing"
  - "InternalsVisibleTo"
title: "Testing Private Code in C#: Breaking Encapsulation with InternalsVisibleTo Attribute"
preview: "Learn about the different options available for testing private logic in C# and how the InternalsVisibleTo attribute can help you access internal members without compromising the encapsulation of your code."
draft: false
legacy: true
hero: /images/blog/003-internals-visible-for-testing/hero.jpg
---

## About tests for private code

Well, most of the time, if you need to test some private logic, maybe you it's better to be SPECIFIC and extract it to public members of new classes. Sometimes decomposition "rocks" and you code became clearer and more maintainable, so check it out before.

However, this private logic can be really connected to the domain of a single class and isn't worth of extracting it somewhere else.

In that case you have 3 simple options and all of them somehow break the idea of encapsulation:

- Make those members `public` and treat them in your test-fixtures as usual. It may be OK, if you are writing simple app and for now you don't care about clean public interfaces. However, if you provide it as a public library, This approach opens you internal logic for every user, so, if "dirty" usage of these members could break state of your objects or even whole application.
- Make those members `protected`, inherit into your testable stub, which will make those members `public`, or derive your test-fixture from it. This can also work, but you have to write some boilerplate code. However, it is not suitable, if your class is sealed. For example, if you don't want users to extend it, as it may break the logic of connected classes.
- Make those members `internal` and add `InternalsVisibleTo` attribute on assembly-level. This approach also breaks encapsulation, but only inside you assembly, all your public interfaces for users will stay clean and secure. And you don't need to use inheritance and write stubs.

## How to use `InternalsVisibleTo`

For example, you have got a class `Some` with public method `Increment` and internal property `Counter` as object's state:

```csharp
namespace InternalsLib
{
    public class Some
    {
        internal int Counter { get; set; }

        public void Increment()
        {
            Counter++;
        }
    }
}
```

You want to assert its state in some CLI or test-fixture:

```csharp
using System.Diagnostics;
using InternalsLib;

namespace InternalsVisibleTests
{
    class Program
    {
        static void Main(string[] args)
        {
            var someObj = new Some();
            someObj.Increment();
            Trace.WriteLine($"Expected count {1}, real count {someObj.Counter}");
        }
    }
}
```

We can't access property `Counter` in assembly `InternalsVisibleTests`, because it's modifier is `internal`. To open internal logic for other assemblies, you need to provide attribute for whole testable assembly in file `AssemblyInfo.cs` or just above the definition of your class, it doesn't really matter.
Let's put attribute invocation into `AssemblyInfo.cs` of project `InternalsLib`:

```csharp
[assembly: InternalsVisibleTo("InternalsVisibleTests")]
```

Now `InternalsVisibleTests` became a friend assembly and internal members from assembly `InternalsLib` became visible inside of its scope.

You can learn more about `InternalsVisibleTo` at [documentation](https://docs.microsoft.com/en-us/dotnet/api/system.runtime.compilerservices.internalsvisibletoattribute).
