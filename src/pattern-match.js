import {just, nothing, isJust, isNothing, unwrap} from './just';

export const PARAM = Symbol.for('@@PATTERN_MATCH_PARAMETER');

// just an alias
export const _ = PARAM;

// match(
//   [just(_), function(param) {}],
//   [nothing(), function() {}],
//   [pure(_), function(a) {}],
//   [_], function(a) {}],
//   [1], function() {}]
// )

export function isAtom(a) {
  return typeof a === 'number' || typeof a === 'string' || typeof a === 'boolean';
}

export function isParam(a) {
  return a === PARAM;
}

export function atomMatcher(pattern, value) {
  return isAtom(pattern) && pattern === value;
}
export function paramMatcher(pattern) {
  return isParam(pattern);
}

// primitives
export function numberMatcher(pattern, value) {
  return pattern === Number && typeof value === 'number';
}
export function stringMatcher(pattern, value) {
  return pattern === String && typeof value === 'string';
}
export function booleanMatcher(pattern, value) {
  return pattern === Boolean && (value === true || value === false);
}

// functions and classes
export function functionMatcher(pattern, value) {
  return typeof pattern === 'function'
    && [Boolean, Number, String].indexOf(pattern) === -1
    && typeof value !== 'function';
}

export function customMatcher(pattern, value) {
  return functionMatcher(pattern, value)
    && pattern(value);
}

export function classMatcher(pattern, value) {
  return typeof pattern === 'function'
    && typeof pattern.prototype === 'object'
    && typeof value !== 'function';
}

export function instanceMatcher(pattern, value) {
  return classMatcher(pattern, value)
    && value instanceof pattern;
}

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
  // for debugging purposes
  name: 'justMatcher',
  match(pattern, value) {
    return isJust(pattern) && isJust(value);
  },
  handle(value, pattern) {
    return unwrap(value);
    // won't work because it applies one value
    // return match([unwrap(pattern), fn])(unwrap(value));
  }
};

export const nothingMatcher = {
  // for debugging purposes
  name: 'nothingMatcher',
  match(pattern, value) {
    return isNothing(pattern) && isNothing(value);
  },
  handle() {
    return;
  }
};

export const matchers = [
  atomMatcher,
  paramMatcher,
  numberMatcher,
  stringMatcher,
  booleanMatcher,
  justMatcher,
  nothingMatcher,
  instanceMatcher,
  classMatcher,
  customMatcher,
  functionMatcher
];

export const defaultHandler = (value, pattern) => value;

export function isMatchAll(m, patterns, values) {
  let matched = true;
  for (let i = 0; i < patterns.length; i++) {
    if (!(m(patterns[0], values[0]))) matched = false;
  }
  return matched;
}

export function getMatchingHandlers(patterns, values) {
  let matched = [];
  // some meta data for debugging
  matched.meta = [];
  for (let i = 0; i < patterns.length; i++) {
    for (let m of matchers) {
      if (typeof m === 'function' && m(patterns[i], values[i])) {
        matched.push(defaultHandler);
        matched.meta.push(m.name);
      } else if (typeof m === 'object' && m.match(patterns[i], values[i])) {
        matched.push(m.handle);
        matched.meta.push(m.name);
      }
    }
  }
  if (matched.length === patterns.length) return matched;
}

/*
let x = match(
  [just(_), _, (a, b) => {}]
)
x(just(5), 6);
 */

export function match(...args) {
  return (...a) => {
    for (let arg of args) {
      if (!Array.isArray(arg)) throw new TypeError('Expected an array for pattern matching');

      const params = [...arg];

      const fn = params.pop();
      const patterns = params;
      // console.log(patterns, patterns.length, fn, a, a.length);
      // quick exit
      // console.log(patterns, a);
      if (patterns.length !== a.length)
        continue;

      // if there is a match, return immediately after execution

      const handlers = getMatchingHandlers(patterns, a);

      if (Array.isArray(handlers)) {
        let fnargs = [];
        for (let i = 0; i < handlers.length; i++) {
          fnargs.push(handlers[i].call(null, a[i], patterns[i], fn));
        }

        // DEBUG
        // console.log("INPUT PATTERNS = ", patterns);
        // console.log("INPUT VALUES = ", a);
        // console.log("MATCHERS = ", handlers.meta);
        // console.log("PARAMS = ", fnargs);

        return fn.apply(null, fnargs);
      }
      // else
      // continue
    }
    throw new Error('This input does not match any patterns: ' + a);
  }
}
