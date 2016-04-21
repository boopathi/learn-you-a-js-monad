'use strict';

/*
 * Let's start with defining our type system, and define a basic type
 *
 * Our Type System has a Number type and is of the signature
 * {
 *   type: 'num',
 *   value: 5
 * }
 *
 */
function num(val) {
  if (typeof val !== 'number') throw new TypeError('Not an num');
  return { type: 'num', value: val };
}

/**
 * We just define a helper utility to do runtime type checking
 */
num.is = function() {
  for(var i of Array.prototype.slice.call(arguments))
    if (i.type !== 'num') throw new TypeError('Not an num');
};

/**
 * There should be some operations possible on our number type
 *
 * Let's define those
 *
 * There is a reason for defining it with the underscore(_) prefix
 * - It's because we haven't defined our function type yet
 */
function _add(a, b) {
  num.is(a,b);
  return num(a.value + b.value);
}
function _sub(a, b) {
  num.is(a,b);
  return num(a.value - b.value);
}
function _mul(a, b) {
  num.is(a,b);
  return num(a.value * b.value);
}
function _div(a, b) {
  num.is(a,b);
  return num(a.value / b.value);
}

/**
 * And here we go,
 * this is our func type. It's a function. Let's just call it func to differentiate
 *
 * It takes the signature
 *
 * {
 *   type: 'func',
 *   value: fn,
 *   call() {}
 * }
 *
 * The other values in the type are internals are not to be messed with :P
 *
 * The call method exists because it provides the currying helper. So the JS function,
 * when declares `n` parameters (NO rest params supported), a `n` level nested function
 * stack is created by recursion.
 *
 * So a function with signature `var a = function(a,b,c) { doSomething(a,b,c); }`
 * when passed to func, will be transformed to,
 *
 * function (a) {
 *   return function (b) {
 *     return function (c) {
 *       doSomething(a,b,c);
 *     }
 *   }
 * }
 *
 */
function func(fn, length, x) {
  return {
    type: 'func',
    value: fn,
    nargs: typeof length === 'undefined' ? fn.length : length,
    args: typeof x === 'undefined' ? [] : (Array.isArray(x) ? x : [x]),
    call(y) {
      if (this.nargs === 0) return this.value();
      this.args.push(y);
      if (this.nargs === 1) return this.value.apply(null, this.args);
      return func(fn, this.nargs - 1,this.args);
    }
  };
}

/**
 * A small helper for checking if it's of type - func
 */
func.is = function() {
  for (var i in Array.prototype.slice.call(arguments))
    if (i.type !== 'func') throw new TypeError('Not a func');
};

/**
 * Here we have our functions _add, _sub, etc... with our wrapper
 * converted to the `func` type
 */
const add = func(_add);
const sub = func(_sub);
const mul = func(_mul);
const div = func(_div);

// Enter the Just
function Just(a) {
  if (typeof a === 'undefined') return {type: 'nothing'};
  if (a.type === 'just' || a.type === 'nothing') return a;
  if (a.value === null || typeof a.value === 'undefined')
    return {
      type: 'nothing'
    };
  else return {
    type: 'just',
    value: a
  };
}

var i = num(1), j = num(2);
console.log(add.call(i).call(j));
