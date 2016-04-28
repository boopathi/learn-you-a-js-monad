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

When starting to learn about a Monad, don't just start right away with what a monad is. The definition goes like this - A Monad is a structure that represents computations defined as a sequence of steps. This doesn't make any sense to you at the first sight. Well, I can call functions that are a sequence of steps, but are they Monads - Yes and No. So, you have to start with something that makes sense.

### A Context

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

But, this comes with a problem - defining our custom types - to do something useful with this type - we need a way to extract the value out every single time. And you're write, so we are going to write a function called `unwrap` that does exactly this.

```js
function unwrap(c) {
  if (c instanceof just) return c.value;
}
```

And you've to call unwrap whenever you're doing the operation. Don't swear at me yet that - "Why would you put the problem in the first place? You don't have to unwrap if there was no `just`. A variable acts just a context." You're absolutely right. For the impatient ones, the answer is that we are going to define functions, types and other typeclasses based on this context/box, and it's just a convenient way and an expressive way to tell.

### fmap

The first function that we are going to define is called `fmap`. In Haskell, it's called fmap and the operator for `fmap` is `<$>`. It's a binary operator and takes two params - one on either side, and looks like this -

```haskell
f <$> a
```

// TODO

## LICENSE

http://boopathi.mit-license.org
