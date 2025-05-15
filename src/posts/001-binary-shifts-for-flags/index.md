---
date: "2018-10-26"
tags:
  - "C#"
keywords:
  - "C#"
  - ".Net"
  - "Enums"
title: "Shift Your C# Enums"
preview: "Discover the simple yet powerful technique of using bitwise shift operator in C# Enums, and how it can improve the readability and maintainability of your code."
draft: false
legacy: true
hero: /images/blog/001-binary-shifts-for-flags/hero.jpg
---

If you want easily increment your flags in `Enum`, you can represent it's values with bitwise shift operator:

```csharp
[Flags]
enum ProgrammingLanguages
{
    None        = 0,
    C           = 1 << 0,
    Cpp         = 1 << 1,
    VisualBasic = 1 << 2,
    VisualCpp   = 1 << 3,
    Rust        = 1 << 4,
    CSharp      = 1 << 5,
    Java        = 1 << 6,
    Php         = 1 << 7,
    Go          = 1 << 8,
    Rust        = 1 << 9,
    Scala       = 1 << 10,
    Clojure     = 1 << 11,
    FSharp      = 1 << 12,
    DotNetFamily = VisualBasic | VisualCpp | CSharp,
    JvmFamily = Java | Scala | Clojure
}
```

Performance is equal, cause in code all enums translated into underlying numbers by compiler itself, so no runtime overhead. Seems a little bit more trivial, than multiplying "by hand":

```csharp
[Flags]
enum ProgrammingLanguages
{
    None        = 0,
    C           = 1,
    Cpp         = 2,
    VisualBasic = 4,
    VisualCpp   = 8,
    Rust        = 16,
    CSharp      = 32,
    Java        = 64,
    Php         = 128,
    Go          = 256,
    Rust        = 512,
    Scala       = 1024,
    Clojure     = 2048,
    FSharp      = 4096,
    DotNetFamily = VisualBasic | VisualCpp | CSharp,
    JvmFamily = Java | Scala | Clojure
}
```

More info about bitwise operators and Enums you can learn from [this post](https://www.alanzucconi.com/2015/07/26/enum-flags-and-bitwise-operators/).
