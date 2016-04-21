// Number type <| Functor type class

import {curry} from './curry';
import {
  just,
  nothing,
  unwrap,
  isJust,
  isNothing
} from './just';

// fmap :: (a -> b) -> fa -> fb
function _fmap(fn, fa) {
  if (typeof fn !== 'function')
    throw TypeError('fn should be a function');
  // to check
  if (isJust(fa)) {
    let a = unwrap(fa);
    let result = fn(a);
    if (typeof result !== typeof a)
      throw new TypeError(
        `fn should be a function : a -> b where a and b should be of same types.
        Got ${typeof result}, ${typeof a}`
      );
    return just(result);
  } else if (isNothing(fa)) {
    return nothing();
  } else if (typeof fa === 'function') {
    // some functions are functors too
    return function(val) {
      // compose the functions
      // should probably add some type checks here
      return fn(fa(val));
    }
  }
}

export let fmap = curry(_fmap);
