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

export const atomMatcher = (pattern, value) => isAtom(pattern) && pattern === value;
export const paramMatcher = pattern => isParam(pattern);
export const functionMatcher = (pattern, value) => typeof pattern === 'function' && pattern(value);
export const classMatcher = (pattern, value) => typeof pattern === 'function' && value instanceof pattern;

// export const arrayMatcher = {
//   match(pattern) {
//     return Array.isArray(pattern);
//   },
//   handle(fn, value, pattern) {
//
//     // for (let p in pattern) {
//     //   let handler = getMatchingHandler(p, fn, value);
//     //   if (handler )
//     // }
//     // I don't why this doesn't work
//     return match.apply(null, pattern.map(p => [p, fn]))(value);
//   }
// };

export const justMatcher = {
  match(pattern, value) {
    return isJust(pattern) && isJust(value);
  },
  handle(fn, value, pattern) {
    return match([unwrap(pattern), fn])(unwrap(value));
  }
};

export const nothingMatcher = {
  match(pattern, value) {
    return isNothing(pattern) && isNothing(value);
  },
  handle(fn) {
    return fn.call();
  }
};

export const matchers = [
  atomMatcher,
  paramMatcher,
  justMatcher,
  nothingMatcher,
  classMatcher,
  functionMatcher,
];

export const defaultHandler = (fn, value) => fn.call(null, value);

export function getMatchingHandler(pattern, fn, value) {
  for (let m of matchers) {
    if (typeof m === 'function' && m(pattern, value))
      return defaultHandler;
    else if (typeof m === 'object' && m.match(pattern, value))
      return m.handle;
  }
}

export function match(...args) {
  return (a) => {
    for (let arg of args) {
      if (!Array.isArray(arg)) throw new TypeError('Expected an array for pattern matching');

      const pattern = arg[0];
      const fn = arg[1];

      // if there is a match, return immediately after execution

      const handler = getMatchingHandler(pattern, fn, a);

      if (typeof handler === 'function') {
        // there is a match and we can handle and return
        // handlers take signature fn, a, pattern
        return handler.call(null, fn, a, pattern);
      }
      // else
      // continue
    }
    throw new Error('This input does not match any patterns: ' + a);
  }
}
