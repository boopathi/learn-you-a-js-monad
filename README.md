# learn you a js monad

#### Are you looking to use something in Production?

Definitely not for you

#### Are you looking to learn what monads are?

Maybe NOT the best place for you

#### Curious what monads in JS are?

Maybe NOT for you too

#### What the heck is this?

I'm trying to learn Monads by defining what Monads are using simple constructs in a language, where there is dynamic/runtime typing, no pattern matching, (inclusion) polymorphism through method overriding, duck typing, no generics etc..., by faking some of the things that I think I need to define.

#### Are you a critic?

##### Wanna help me learn by pointing out mistakes?

Open an issue or submit a PR. Thanks!

## Learnings

When starting to learn about a Monad, don't just start right away with what a monad is. The definition goes like this - A Monad is a structure that represents computations defined as a sequence of steps. This might not make any sense to you at the first sight. Well, I can call functions that are a sequence of steps, but are they Monads - Yes and No. So, you have to start with something that makes sense.

### A Context

**Source :** [`just.js`](./src/just.js)

A context is a box / a container that contains - well, a value. And it's a special box where you don't have a box inside a box. A context of a context of a value => context(context(value)) is just a context(value). I'm going to keep switching between "box" and "context", it means the same thing. A box has two properties - It contains a value (or) it contains nothing.

+ A box that contains A value is called `just`
+ A box that contains NO value is called `nothing`

So, when you say `just(5)`, it's a box with a value that's `5`, and when you say `nothing()`, it's an empty box. As you might have already guessed, `just()`(no value) is just `nothing()`.

This might be unclear to some of us - where in JavaScript, we have value types and not variable types. A symbol `5` takes the type `Number`, while a variable `var x` - well can you say its type? So, isn't a `var x` just a context around a value - where `x` can contain a value of some type (or) it contains nothing, in JavaScript - `undefined`? The answer is Yes. It can be considered as a context, but the problems aren't straight forward, and for the sake of easiness and pattern matching, we are going to write new types called `Just` and `Nothing` in JavaScript. It's pretty simple.

```js
class just {
  constructor(value) {
    if (typeof value === 'undefined' || value === null) return new nothing();
    this.value = value;
  }
}
class nothing {}
```

But, this comes with a problem (defining our custom types). To do something useful with this type, we need a way to extract the value out every single time. And you're right, we are going to write a function called `unwrap` that does exactly this.

```js
function unwrap(c) {
  if (c instanceof just) return c.value;
}
```

And you've to call unwrap whenever you're doing the operation. Don't swear at me yet that - "Why would you put the problem in the first place? You don't have to unwrap if there was no `just`. A variable acts just a context." You're absolutely right. For the impatient ones, the answer is that we are going to define functions, types and other typeclasses based on this context/box, and it's just a convenient way and an expressive way to tell.

The source for just, nothing and unwrap are defined in this file - [`just.js`](./src/just.js)

### Currying

**Source :** [`curry.js`](./src/curry.js)

Currying is when you break down a function that takes multiple arguments into a series of functions that take part of the arguments. For example, in JavaScript, when you have,

```js
function add(a, b) {
  return a + b;
}
```

When we apply curry, it transforms to

```js
function add(a) {
  return function (b) {
    return a + b;
  }
}
```

So, you can have intermediate functions that represent part of the function applied.

```js
var add5 = add(5);
var six = add5(1);
```

Our currying function is defined here - [`curry.js`](./src/curry.js)

### TypeClass

A TypeClass essentially means an `Interface` - which JavaScript does NOT have because JavaScript is a dynamic language and JavaScript inheritance is based on Objects, not Classes. So, we are going to assume that a `Type` satisfies a `TypeClass` or an `Interface` by dirty checking the functions/methods that are defined for the Interface. For example,

```js
var AdderInterface = {
  add() {}
}
var IntegerOps = {
  add() {},
  sub() {},
  mul() {},
  div() {}
}
```

Here, IntegerAdder satisfies the AdderInterface since it implements the required method `add`. We are not going to do that dirty checking, we are just going to assume it is and throw when we don't find a method called `add`. Also, we are going to extend our Primitive types by adding some static methods to satisfy some TypeClasses that we are going to define.

Essentially, in short, we are not going to "define" any TypeClasses, we just assume it's there and it satisfies :P. This may as well change if you're willing to implement TypeClasses. PR welcome.

### Pattern matching

**Source :** [`pattern-match.js`](./src/pattern-match.js)

Pattern matching is one of the amazing parts of functional languages which boosts their expressiveness and declarativeness. To understand the scope of pattern matching, let's see how we define certain functions in JavaScript.

If you find a function that has lots of conditional statements in it matching on the type of parameters passed, then pattern matching might help you there. For example, take the nth fibonocci generator. In Haskell, you'd write it like this,

```haskell
fib 0 = 0
fib 1 = 1
fib n = fib (n-1) + fib (n-2)
```

But, in JavaScript, to attain similar expressiveness and handling limitations, I assumed some stuff, and it looks like this,

```js
var fib = match(
  [0, () => 0],
  [1, () => 1],
  [_, n => fib(n-1) + fib(n-2)]
);
// close enough?
```

What happens here is match takes some arrays of patterns each of the form - `[ ...patterns, callback ]`. Calling match on the list of patterns returns a function which can then be called and the corresponding `callback` will be executed. And as you note that the last pattern is `_` - This resolves internally to a `Symbol(PATTERN_MATCH_PARAM)` which is again used internally to compare that it's a param that can take any value and passes it on to the callback as it is.

Note: My pattern matching implementation is really really slow.

### Functor

Our first TypeClass is the `Functor`. A Functor is a typeclass that has a `fmap` method and the signature of fmap is this

```haskell
fmap :: Functor f => (a -> b) -> f a -> f b`
```

It defines a `f` as a Functor, and `fmap` is a function that takes two inputs(a function and a functor) and returns a functor. You can see that fmap takes a functor and returns a functor.

In JavaScript you could write that as,

```js
function fmap (fn, fa) {
  fb = magic(fn, fa);
  return fb;
}
function some_fn(a) {
  b = some_f(a);
  return b
}
```

But fmap is defined based on the `Type` of the input values `fa` and function `fn(a->b)` - essentially the `Type` of `a` and `b`. And we don't have Types in JavaScript. So, we are going to predict the types by unwrapping the value and doing runtime Reflection. Better explained with examples,



### fmap

**Source :** [`functor.js`](./src/functor.js)

The first function that we are going to define is called `fmap`. In Haskell, it's called fmap and the operator for `fmap` is `<$>`. It's a binary operator and takes two params - one on either side, and looks like this -

```haskell
f <$> a
```

In JavaScript though, we cannot define new operators nor change the behavior of existing operators (no operator overloading). So, we are going to just define a curried function `fmap`.

So, what the hell is fmap anyway?

Fmap is a function that takes two arguments - a function and a context. It unwraps the context applies the function, wraps the context back again and returns the value. Remember you send a context in, you should get a context out.

Before defining how our fmap should look, we can go through what a functor is. A functor is a typeclass where if a type contains fmap defined for it, then it's a Functor. Let's try translating that to JavaScript. What we aren't familiar with are - `Functor, TypeClass`. And what we already know is the `Type`. Note that whenever we create a class in JavaScript, it represents a type. With this definition, let's define our TypeClass and Functor.


// TODO

## LICENSE

http://boopathi.mit-license.org
