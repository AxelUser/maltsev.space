---
date: "2020-06-22"
tags:
  - "C#"
keywords:
  - "C#"
  - "generics"
title: "Unlocking the Power of Generics: Simulating Dictionary Behavior in C#"
preview: "Do you want to improve performance of caching? Get rid of Dictionary and use just CLR for that!"
draft: false
legacy: true
---

## Disclaimer

1. This article shows how to simulate dictionary behavior with generic static classes. However, **the way to this solution goes through other examples with lots of design details** to make you familiar with the situation. If you're interested only in "hacking" part, you may go directly to the section [Implementing a generic-based cached producer](#implementing-a-generic-based-cached-producer).
2. In code examples I've used **Nullable Reference Types**, which is a new feature from **C# 8**. They don't affect the performance and definitely not a main point of the article. If you're curious, check the [documentation](https://docs.microsoft.com/en-us/dotnet/csharp/nullable-references).
3. All code is available on [GitHub](https://github.com/AxelUser/examples/tree/master/DotNet/DictionaryOfTypes).

## Task: create a factory for REST clients

When you are integrating different services into each other, it's always a very time-consuming process to write clients for all of them. Luckily, if those RESTful services provide their API schema in **OpenAPI** (or previously named **Swagger**) format, chances are great that there's a generator of clients for this common type of schema format.

.Net has several packages for client generation, for example [NSwag](https://github.com/RicoSuter/NSwag). There are different opinions on how generated clients should be look like, but let's consider that their constructors receive _HttpClient_ instance for sending requests and classes themselves are derived from generated interfaces, containing all public methods for the API.

The first requirement helps to manipulate _HttpClient_ creation and lifetime, which means that we can even reuse one from the pool. The second requirement will be handy, when it's needed to write unit-tests for code, that uses service's clients - in that case they must be mocked and mocking in .Net's frameworks "mostly" requires passing an interface.

To sum everything up, the generated code will follow the similar pattern:

```csharp
public partial interface ISomeResourceClient
{
	Task<SwaggerResponse<string>> GetSomeResourceAsync(CancellationToken cancellationToken);
}

public partial class SomeResourceClient : ISomeResourceClient
{
	private HttpClient _httpClient;

	public SystemClient(HttpClient httpClient)
	{
		_httpClient = httpClient;
	}

	public async Task<SwaggerResponse<string>> GetUpdaterLinkAsync(CancellationToken cancellationToken)
	{
		// Generated code for sending request.
	}
}
```

## Automating client creation

Although clients are implementing their own interfaces, it's still hard to test code, that creates clients via constructors. For a testable code it's required to have all those clients as dependencies or delegate their creation into a new dependency. It's possible to resolve clients via **Dependency Injection**, because _HttpClient_ can be effectively taken from reusable pool via [IHttpClientFactory](https://docs.microsoft.com/en-us/dotnet/architecture/microservices/implement-resilient-applications/use-httpclientfactory-to-implement-resilient-http-requests), and most of the DI frameworks offer you a zero configuration for that feature.

However sometimes it's necessary to control base url to your service or to dynamically pass some values into request's headers, like authorization tokens or distributed tracing ids. So it may be preferred to pass a valid _HttpClient_ manually and that's why for the sake of the article let's stick to this format.

The most appropriate way of extracting object construction into dedicated dependency is implementing a [Factory](https://refactoring.guru/design-patterns/factory-method) for clients. Unfortunately, all clients implement different interfaces and it isn't possible to write base interface as returned value for the factory method. However it's still possible to invoke the creation of specific client by redesigning the factory into generic class.

Let's discuss possible interface:

```csharp
public interface IClientFactory<out T> where T: class
{
    T Create(HttpClient client);
}
```

Why it's preferred to make whole class as generic and not just the method `Create`? If it will be only a generic method, the factory will be similar to the [Service Locator](https://blog.ploeh.dk/2010/02/03/ServiceLocatorisanAnti-Pattern/), which has some maintainability issues and hides the information which clients the outer code depends on.

Here is an example:

```csharp
public Wrapper(
    IClientFactory<ISomeResourceClient> concreteClientFactory, // doesn't hide details
    IClientFactory commonClientFactory)
{
    // some ctor details
}
```

The first variant of `concreteClientFactory` is much more transparent than `commonClientFactory`. **That's why this design will be applied to all further solutions it the article.**

As factory should create clients of specific types, there are some more questions to discuss:

1. How factory should invoke a constructor of the concrete client?
2. How factory should effectively guess object of which class should be created, if only interface is passed to the generic type parameter?

Solution for the first question is quite trivial - invoking constructor via handy static helper [Activator.CreateInstance](https://docs.microsoft.com/en-gb/dotnet/api/system.activator.createinstance?view=netcore-3.1#System_Activator_CreateInstance_System_Type_System_Object___). Internally it's an old friend reflection does all the job, but activator provides a simpler API.

For the second problem another reflection-based mechanism should be involved. As I mentioned above, mocking frameworks for .Net work better, if they create mocks that implement base interfaces. Thus the factory method should expose client's interface in returned value. It can be easily achieved with the help of generic type parameter, but nevertheless factory method should create an object of the concrete class.

So, factory should perform mapping between the interface and the implementation. Fortunately, all generated classes and interfaces are stored under dedicated namespace and are available during the start of an application. That's right - **mapping can be created by traversing though all classes in that namespace**.

To execute search only once, it's better to put mapping code into a **static constructor**. Reflection will traverse through the whole assembly, find all client's interfaces with their implementations and save that relationships into a simple dictionary. Also it'a a good idea to **encapsulate mapping into another dependency**, which has private static field with that dictionary and produces the factory for required clients. Encapsulation will protect internal mapping from unexpected mutations and make namespace cleaner.

The new dependency can be implemented as a factory provider, or in other words factory of factories. The interface is trivial:

```csharp
public interface IClientsFactoryProvider
{
    IClientFactory<T> GetClientFactory<T>() where T : class;
}
```

Type of the client's implementation can be passed into client factory constructor by factory provider. Thus, after factory provider is invoked, it finds relevant class for an interface passed as generic type argument and creates the valid client factory. Below is the implementation of the provider:

```csharp
public class SimpleClientFactoryProvider: IClientsFactoryProvider
{
    private static readonly Dictionary<Type, Type> DiscoveredAllowedClientTypes;

    static SimpleClientFactoryProvider()
    {
        DiscoveredAllowedClientTypes = GetAllTypes(Assembly.GetExecutingAssembly())
            .ToDictionary(tuple => tuple.@interface, tuple => tuple.implementation);
    }

    public IClientFactory<T> GetClientFactory<T>() where T : class
    {
        if(!DiscoveredAllowedClientTypes.TryGetValue(typeof(T), out var implType))
            throw new Exception($"Client type '{typeof(T)}' isn't supported");

        return new ClientFactory<T>(implType);
    }

    private static IEnumerable<(Type @interface, Type implementation)> GetAllTypes(Assembly assembly)
    {
        var clientsTypes = assembly.DefinedTypes
            .Where(type => type.CustomAttributes
                .Any(attr => attr.AttributeType == typeof(RestClientAttribute)));

        foreach (var clientType in clientsTypes)
        {
            var @interface = clientType.ImplementedInterfaces.First();
            yield return (@interface, clientType);
        }
    }
}
```

Everything is done so far. All mapping is extracted into provider, which had permitted the easier implementation of the actual client factory:

```csharp
public class ClientFactory<T>: IClientFactory<T> where T : class
{
    private readonly Type _clientImplType;

    public ClientFactory(Type clientImplType)
    {
        _clientImplType = clientImplType;
    }

    public T Create(HttpClient client)
    {
        return (T) Activator.CreateInstance(_clientImplType, client)!;
    }
}
```

Now it's time to ask, **what can be done to produce factories more efficiently**. If factory creation will be done very often, it's better to make some kind of caching for it, because it doesn't depend on a context of invocation.

I want to mention, that all modern DI frameworks has an ability to mark those client factories as singletons at configuration and that's OK to use it when you can.

Even so, what about making this mechanism by ourselves? If you're interested, I'll welcome you to read the article further.

## Benchmarking

Before we dig into optimizations, **it's HIGHLY recommended to track the performance of made solutions**. As we are dealing with isolated modules, micro-benchmarking will suit our needs.

The easiest way to create benchmarks of that kind is using a popular nuget package [BenchmarkDotNet](https://benchmarkdotnet.org/). I won't include in the article how to write good benchmarks for every situation, because this theme is quite vast. However, if you're not familiar with benchmarking or BenchmarkDotNet, you may follow the links to BenchmarkDotNet documentation at the section **References**.

Frankly speaking, I shall mention that maintainers of the BenchmarkDotNet did a great job in providing an easy API for creating benchmarks, which gives ability to include lots of useful indicators and will be clear to the most of .Net developers.

Firstly we need to know how solutions are fast and how much memory they consume. In BenchmarkDotNet speed indicator come out of the box, and memory consumption can be tracked via [`MemoryDiagnoser`](https://adamsitnik.com/the-new-Memory-Diagnoser/) attribute for the benchmark class. Here is a code snippet of configuration:

```csharp
[MemoryDiagnoser]
public class ClientFactoryProvidersBenchmark
{
	// Benchmarks
}
```

Now it's time for benchmarks themselves. **Caching improves peeking of some value many times**, that's why benchmark should also perform several attempts of getting factories for each client.

To show how many attempts were performed, BenchmarkDotNet has an ability to use custom benchmark parameters via another attribute [`Params`](https://benchmarkdotnet.org/articles/features/parameterization.html). It receives values of that parameter for each benchmark run and displays that value at its own column in report. For this benchmark let's choose numbers _100_, _1000_ and _10000000_:

```csharp
[Params(100, 1000, 10000000)]
public int Accesses { get; set; }
```

Another useful feature is making benchmark for original solution as [baseline](https://benchmarkdotnet.org/articles/features/baselines.html). It is used to display the ratio of how speed of other benchmarks differs from the baseline.

Alright, now everything is ready to write the code of the first benchmark:

```csharp
[Benchmark(Baseline = true)]
public void SimpleFactory_SequentialAccess()
{
    Execute(_simpleFactoryRunActions);
}

[MethodImpl(MethodImplOptions.AggressiveInlining)]
private void Execute(IReadOnlyList<Action> actions)
{
    var length = actions.Count;
    for (var i = 0; i < Accesses; i++)
    {
        actions[i % length]();
    }
}
```

Well, that code is strange. It's because I've generated all actual invocations of factory provider using **T4** template file. Obviously that isn't necessary, but as soon as I generated all code for clients using the same T4 templates, I thought that it is more maintainable to generate invocations as well. I mentioned it before, but all code is available on GitHub, so you may have a look at [generated clients](https://github.com/AxelUser/examples/blob/master/DotNet/DictionaryOfTypes/Clients/StubbedClients.cs) and generated [provider invocations](https://github.com/AxelUser/examples/blob/master/DotNet/DictionaryOfTypes/Benchmarking/BenchmarkCallsCreator.cs).

One more thing to know - because I don't want to include the creation of delegates with provider invocations, it's vital to move it into set-up, similar to the one that testing frameworks offer. BenchmarkDotNet has the same API for it, which means making set-up method and marking it with [`GlobalSetup`](https://benchmarkdotnet.org/articles/features/setup-and-cleanup.html) attribute:

```csharp
[GlobalSetup]
public void SetUp()
{
    _simpleFactoryRunActions = BenchmarkCallsCreator.CreateInvocations(new SimpleClientFactoryProvider());
}
```

Now all deletes are accessible from private field and its initialization won't affect the results.

Anyway, let's run our benchmark and see how things are doing:

```
|                         Method | Accesses |           Mean |         Error |        StdDev | Ratio |      Gen 0 | Gen 1 | Gen 2 | Allocated |
|------------------------------- |--------- |---------------:|--------------:|--------------:|------:|-----------:|------:|------:|----------:|
| SimpleFactory_SequentialAccess |      100 |       3.636 us |     0.0297 us |     0.0278 us |  1.00 |     0.3815 |     - |     - |   2.34 KB |
|                                |          |                |               |               |       |            |       |       |           |
| SimpleFactory_SequentialAccess |     1000 |      38.098 us |     0.2838 us |     0.2654 us |  1.00 |     3.7842 |     - |     - |  23.44 KB |
|                                |          |                |               |               |       |            |       |       |           |
| SimpleFactory_SequentialAccess | 10000000 | 383,617.687 us | 3,106.0346 us | 2,905.3867 us |  1.00 | 38000.0000 |     - |     - | 234375 KB |
```

We may see, that the provider performed quite fast (for now), but had allocated factory objects for each invocation of the factory provider. As I've said, for this issue there's a solution - **caching factories**.

## Store factories into Dictionary

The most obvious way to cache concrete factories is to store mapping from interface to factory, not just the mapping between interfaces and their implementation.

Seems legit! So let's rewrite our initial factory method into one, which returns concrete client's factories for interfaces.

Mapping reflection-based mechanism also should be rewritten to store concrete client factories for each interface into static dictionary object. As mentioned above, this mapping can performed once at application start-up, because factories are quite stateless by themselves.

Unfortunately, we can't provide open generic type as the type for a value of our dictionary, but because all these factories are reference types, we can cast them to objects, put these values into the dictionary and when requested, receive from the dictionary and cast to a requested generic type. To make further examples simpler, I've extracted mapping construction into static helper `ClientTypesProvider.GetAllTypes(Assembly)`, because it won't be changed further in the article.

```csharp
public class CachedSimpleFactoryProvider: IClientsFactoryProvider
{
    private static readonly Type FactoryType = typeof(ClientFactory<>);
    private static readonly Dictionary<Type, object> CachedClientFactories;

    static CachedSimpleFactoryProvider()
    {
        CachedClientFactories = ClientTypesProvider.GetAllTypes(Assembly.GetExecutingAssembly())
            .ToDictionary(tuple => tuple.@interface, tuple => CreateFactory(tuple.implementation));
    }

    public IClientFactory<T> GetClientFactory<T>() where T : class
    {
        if(!CachedClientFactories.TryGetValue(typeof(T), out var factory))
            throw new Exception($"Client type '{typeof(T)}' isn't supported");

        return (IClientFactory<T>) factory;
    }

    private static object CreateFactory(Type clientType)
    {
        var factory = FactoryType.MakeGenericType(clientType);
        return Activator.CreateInstance(factory, clientType)!;
    }
}
```

Well, this solution isn't so elegant, but **casting is mostly used to overcome the type system's limitation**.

Now it's obvious that we've reduced memory consumption using pre-allocated factories, but what about speed?

Let's check the performance of this caching mechanism by writing a benchmark and compare results with the baseline:

```
|                         Method | Accesses |           Mean |         Error |        StdDev | Ratio | RatioSD |      Gen 0 | Gen 1 | Gen 2 |   Allocated |
|------------------------------- |--------- |---------------:|--------------:|--------------:|------:|--------:|-----------:|------:|------:|------------:|
| SimpleFactory_SequentialAccess |      100 |       3.636 us |     0.0152 us |     0.0142 us |  1.00 |    0.00 |     0.3815 |     - |     - |      2400 B |
| CachedFactory_SequentialAccess |      100 |       7.692 us |     0.0543 us |     0.0481 us |  2.12 |    0.01 |          - |     - |     - |           - |
|                                |          |                |               |               |       |         |            |       |       |             |
| SimpleFactory_SequentialAccess |     1000 |      35.619 us |     0.0787 us |     0.0697 us |  1.00 |    0.00 |     3.7842 |     - |     - |     24001 B |
| CachedFactory_SequentialAccess |     1000 |      74.106 us |     0.9672 us |     0.9047 us |  2.08 |    0.03 |          - |     - |     - |         1 B |
|                                |          |                |               |               |       |         |            |       |       |             |
| SimpleFactory_SequentialAccess | 10000000 | 365,822.213 us | 2,226.8696 us | 2,083.0152 us |  1.00 |    0.00 | 38000.0000 |     - |     - | 240000000 B |
| CachedFactory_SequentialAccess | 10000000 | 746,398.580 us | 3,361.2568 us | 3,144.1217 us |  2.04 |    0.02 |          - |     - |     - |           - |
```

Hm, seems like it's **became SLOWER, than the original simple solution**, but we may guess what operation caused such performance penalty. _Did we write something wrong or inefficient?_

Earlier I've mentioned that "dumb" casting from object to generic factory type. **This simple cast is overkill for current situation** - it involves type checking, but we know exactly what generic type stored under each key in dictionary.

```csharp
public IClientFactory<T> GetClientFactory<T>() where T : class
{
    if(!CachedClientFactories.TryGetValue(typeof(T), out var factory))
        throw new Exception($"Client type '{typeof(T)}' isn't supported");

    return Unsafe.As<IClientFactory<T>>(factory);
}
```

Once again check the benchmark results:

```
|                         Method | Accesses |           Mean |         Error |        StdDev | Ratio |      Gen 0 | Gen 1 | Gen 2 |   Allocated |
|------------------------------- |--------- |---------------:|--------------:|--------------:|------:|-----------:|------:|------:|------------:|
| SimpleFactory_SequentialAccess |      100 |       3.492 us |     0.0143 us |     0.0134 us |  1.00 |     0.3815 |     - |     - |      2400 B |
| CachedFactory_SequentialAccess |      100 |       3.138 us |     0.0022 us |     0.0020 us |  0.90 |          - |     - |     - |           - |
|                                |          |                |               |               |       |            |       |       |             |
| SimpleFactory_SequentialAccess |     1000 |      34.968 us |     0.3702 us |     0.3462 us |  1.00 |     3.7842 |     - |     - |     24000 B |
| CachedFactory_SequentialAccess |     1000 |      31.494 us |     0.0589 us |     0.0522 us |  0.90 |          - |     - |     - |           - |
|                                |          |                |               |               |       |            |       |       |             |
| SimpleFactory_SequentialAccess | 10000000 | 369,860.373 us | 2,062.8473 us | 1,929.5887 us |  1.00 | 38000.0000 |     - |     - | 240000000 B |
| CachedFactory_SequentialAccess | 10000000 | 306,086.300 us | 2,633.7588 us | 2,463.6196 us |  0.83 |          - |     - |     - |           - |
```

Much better - the speed of invocation is a little bit less than the baseline and the memory consumption is minimal.

We may stay with this implementation, but if that was an option, I've never wrote such an obvious post 😅.

So, is there a way to improve speed even more? Well, **that's when generics steal the show!**

## Delegate caching to JIT

This trick is mostly inspired by the way how [Array.Empty](https://docs.microsoft.com/en-us/dotnet/api/system.array.empty?view=netcore-3.1) works.

Empty arrays are best candidates for caching, because their construction doesn't require any parameters, but only a generic type parameter.

When you invoke `Array.Empty<MyClass>`, it internally invokes a static read-only field `Empty` of static generic class `EmptyArray<MyClass>`, which initializes and returns an empty array of type `MyClass` (have a look at [sources](https://github.com/dotnet/runtime/blob/3705185af806e273ccef98e44699400f0416c452/src/libraries/System.Private.CoreLib/src/System/Array.cs#L694-L704)). Static field is initialized during the time of a first access to the field of the class _EmptyArray_. This is guaranteed from the fact how generics and static classes work in **CLR** (Common Language Runtime). For your information, that's how you can implement a [simple thread-safe singleton](https://csharpindepth.com/articles/singleton) in .Net.

## How CLR compiles generic classes

Generics are types, that contain a type parameter, which isn't known at compile time (e.g. `List<T>`). When dotnet compiler sees open generic type, it compiles it into IL with the same generic type parameter.

After the type argument is passed into generic constructor (e.g. `List<MyClass>`), CLR will do the following:

1. Lookup if the closed generic (with concrete generic type argument) was requested before.
2. If not - it will be compiled at run time.

Nice point is that JIT compiler will share all code for specific generics, which have only reference types as their type parameters. This optimization makes sense, because objects of reference types are passed into methods by fixed-sized reference to their content in the managed heap. All references to objects have common size, which equals to the machine word: 32 or 64 bits, depending on the architecture of an operating system and processor.

It doesn't mean, that compiler vanishes all information about different closed generics, but instead of compiling the whole code for the class, it will save the information about concrete closed generic into **Method Table**.

It worth mentioning, that for value types, like structs and primitives, JIT will compile specialized code to handle each type parameters combination, which were passed during the construction of a closed generic.

Using the knowledge about how generics are compiled and how static fields are initialized, we can implement a cache for factory producer.

## Implementing a generic-based cached producer

Let's create a new static class `CachedFactory<T>` with static field `Instance`, which is initialized with a factory for the concrete client implementing interface _T_. The factory creation is extracted into the method, that gets implementation type from static dictionary and creates a factory.

How new static factories can access the mapping information? One way is to make that dictionary public, as well as making this new class as public. However, as I mentioned before in the case of dictionary-based caching solution, that will pollute a namespace with things you should never access manually.

Encapsulation of the caching mechanism can be achieved by making the class `CachedFactory<T>` private and nesting it inside the actual provider class. In that case the public factory provider will have full access the public field of `CachedFactory<T>`, without opening its API to the outer code

```csharp
public partial class GenericClientFactoryProvider
{
    private class CachedFactory<T> where T : class
    {
        public static readonly IClientFactory<T>? Instance;

        static CachedFactory()
        {
            Instance = CreateFactoryIfAllowed();
        }

        private static IClientFactory<T>? CreateFactoryIfAllowed() =>
            DiscoveredAllowedClientTypes.TryGetValue(typeof(T), out var implType)
                ? new ClientFactory<T>(implType)
                : null;
    }
}
```

However, there is also a caveat - **when a type _T_ isn't stored in dictionary, the generic nevertheless will be compiled and stored at Method Table until the end of execution**. That's why the whole generics trick may be a bad idea, if the client interface is passed from user input.

To make things a little bit fancier, **code with nested class may be extracted into own file**, if the factory provider will be marked as partial. It's up to you how to name that file, but I recommend you to write the name of the provider plus the name of cached factory, separated by the dot, like _GenericClientFactoryProvider.CachedFactory.cs_.

Provider will trigger client creation when accessing the field `Instance` of a closed generic `CachedFactory<T>` class for the first time:

```csharp
public partial class GenericClientFactoryProvider : IClientsFactoryProvider
{
    private static readonly Dictionary<Type, Type> DiscoveredAllowedClientTypes;

    public IClientFactory<T> GetClientFactory<T>() where T : class
    {
        return CachedFactory<T>.Instance ?? throw new Exception($"Client type '{typeof(T)}' isn't supported");
    }

    static GenericClientFactoryProvider()
    {
        DiscoveredAllowedClientTypes = ClientTypesProvider.GetAllTypes(Assembly.GetExecutingAssembly())
            .ToDictionary(tuple => tuple.@interface, tuple => tuple.implementation);
    }
}
```

If client creation shouldn't be lazy, fields for all closed generic classes can be accessed at the same time, when mapping is created.

```csharp
static GenericClientFactoryProvider()
{
    DiscoveredAllowedClientTypes = ClientTypesProvider.GetAllTypes(Assembly.GetExecutingAssembly())
        .ToDictionary(tuple => tuple.@interface, tuple => tuple.implementation);

    InitializeFactories(); // Eager initialization
}

private static void InitializeFactories()
{
    var factory = typeof(CachedFactory<>);
    foreach (var @interface in DiscoveredAllowedClientTypes.Keys)
    {
        var genericFactory = factory.MakeGenericType(@interface);
        var instanceProperty = genericFactory.GetField("Instance");
        instanceProperty!.GetValue(null);
    }
}
```

Now let's add a new benchmark and check the performance:

```
|                                  Method | Accesses |           Mean |         Error |        StdDev | Ratio |      Gen 0 | Gen 1 | Gen 2 |   Allocated |
|---------------------------------------- |--------- |---------------:|--------------:|--------------:|------:|-----------:|------:|------:|------------:|
|          SimpleFactory_SequentialAccess |      100 |       3.538 us |     0.0454 us |     0.0402 us |  1.00 |     0.3815 |     - |     - |      2400 B |
|          CachedFactory_SequentialAccess |      100 |       3.213 us |     0.0233 us |     0.0218 us |  0.91 |          - |     - |     - |           - |
| CompiledGenericFactory_SequentialAccess |      100 |       1.390 us |     0.0128 us |     0.0107 us |  0.39 |          - |     - |     - |           - |
|                                         |          |                |               |               |       |            |       |       |             |
|          SimpleFactory_SequentialAccess |     1000 |      36.258 us |     0.1383 us |     0.1294 us |  1.00 |     3.7842 |     - |     - |     24000 B |
|          CachedFactory_SequentialAccess |     1000 |      31.292 us |     0.1065 us |     0.0890 us |  0.86 |          - |     - |     - |           - |
| CompiledGenericFactory_SequentialAccess |     1000 |      14.505 us |     0.0144 us |     0.0120 us |  0.40 |          - |     - |     - |           - |
|                                         |          |                |               |               |       |            |       |       |             |
|          SimpleFactory_SequentialAccess | 10000000 | 374,137.631 us | 1,675.7705 us | 1,399.3442 us |  1.00 | 38000.0000 |     - |     - | 240000000 B |
|          CachedFactory_SequentialAccess | 10000000 | 307,281.414 us | 1,939.4985 us | 1,719.3149 us |  0.82 |          - |     - |     - |           - |
| CompiledGenericFactory_SequentialAccess | 10000000 | 144,997.830 us |   715.7528 us |   634.4962 us |  0.39 |          - |     - |     - |       334 B |
```

Speed of invocation has been dramatically increased, compared to the previous dictionary-based solution. Now we may use this solution with interface defined earlier, gaining all benefits of generic type lookup, which give us the runtime itself.

## Conclusion

All these solutions are powered by the knowledge of runtime internals, which may increase the difficulty of understanding how much benefits we receive. **When messing with such hacks don't hesitate to check the performance incrementally via benchmarking**. I hope that my examples proves you, that this process isn't much harder than writing a unit-tests, thanks to BenchmarkDotNet!

All provided solutions are quite specialized for the task of caching values, which don't depend on dynamic parameters. In other words all values can be initialized during the application start-up. If that is your case, you may use provided solutions and I hope you will improve the overall performance of your program.

## References

1. [How to create open generic type at runtime](https://codeblog.jonskeet.uk/2017/04/26/surprise-creating-an-instance-of-an-open-generic-type/)
2. [Generic types under the hood](https://alexandrnikitin.github.io/blog/dotnet-generics-under-the-hood/)
3. [BenchmarkDotNet website](https://benchmarkdotnet.org/)
