import {just, nothing, isJust, isNothing, unwrap} from './just';
import {nullcheck} from './nullcheck';

const applicativePatternMatch = {
  pure (a) {
    return a.constructor.applicative.pure.call(null, a);
  },
  nothing (a) {
    return a.constructor.applicative.nothing.call(null, a);
  },
  just (f) {
    return a => a.constructor.applicative.just.call(null, f, a);
  }
};

export const applicative = fn => fa => {

}

/**
 * In Applicatives we have both the function and the value
 * wrapped in a context/box
 *
 * So the situations are:
 *   // on contexts
 *   applicative(just(fn))(just(value)) => just(answer)
 *   // on lists
 *   applicative([fn1, fn2])([a, b, c]) => [fn1(a), fn1(b), fn1(c), fn2(a), fn2(b), fn2(c)]
 *
 */
// export const applicative = fn => fa => {
//   const isJustFn = isJust(fn);
//   const isJustFa = isJust(fa);
//
//   let f = fn, a = fa;
//   if (isJustFn) f = unwrap(fn);
//   if (isJustFa) a = unwrap(fa);
//
//   return a.constructor.applicative(f)(a);
// }

/**
 * Design decision - I don't know if this is a good design.
 * Just grokking up things so it looks sane to implement for any type
 *
 * When you pass in an array of functions and an array of values,
 * the Array.applicative kicks in first, unwraps the values array and
 * passes on to the value applicative.
 *
 * So, all the single value applicatives have to destructure the
 * array of functions and apply an array of results
 */

// you get the unwrapped values and you wrap it after applying the function
export const value = fs => a => {
  if (Array.isArray(fs)) return fs.map(f => f(a));
  return fs(a);
}

/**
 * applicative on an array of functions over array of values is the
 * cartesian product of fns over values
 *
 * resulting in a matrix which is then flattened to get the result
 */
export const array = fns => a => a.map(val => applicative(fns)(val));

export function polyfill() {
  Array.applicative = array;
  Number.applicative = value;
  String.applicative = value;
  Boolean.applicative = value;
}
