import {just, nothing, isJust, isNothing, unwrap} from './just';

export const PARAM = Symbol.for('@@PATTERN_MATCH_PARAMETER');

// match(
//   [just(PARAM), function(param) {}],
//   [nothing(), function() {}],
//   [pure(PARAM), function(a) {}],
//   [PARAM], function(a) {}],
//   [1], function() {}]
// )

export function isAtom(a) {
  return typeof a === 'number' || typeof a === 'string' || typeof a === 'boolean';
}

export function isParam(a) {
  return a === PARAM;
}

export function match(...args) {
  return (a) => {
    for (let arg of args) {
      if (!Array.isArray(arg)) throw new TypeError('Expected an array for pattern matching');

      const pattern = arg[0];
      const fn = arg[1];

      // if there is a match, return immediately after execution

      // match([0, fn])(0)
      if (isAtom(pattern)) {
        if (pattern === a) return fn.call(null, a);
      }

      // match([PARAM, fn])(5)
      if (isParam(pattern)) {
        return fn.call(null, a);
      }

      // match regex ?

      // match fn
      if (typeof pattern === 'function') {
        if (pattern(a)) return fn.call(null, a);
      }

      // match array of patterns to same fn
      if (Array.isArray(pattern)) {
        return match(pattern.map(p => [p, fn]));
      }

      // match([just(PARAM), x => x === 2 ])(just(2))
      if (isJust(pattern) && isJust(a)) {
        return match([unwrap(pattern), fn])(unwrap(a));
      }

      if (isNothing(pattern) && isNothing(a)) {
        return fn.call();
      }

      throw new Error('Unhandled Pattern type');
    }
  }
}
