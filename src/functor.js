import {just, nothing, isJust, isNothing, unwrap, isJustOrNothing} from './just';

function nullcheck(fa) {
  if (typeof fa === 'undefined' || fa === null)
    throw new TypeError('fa is not defined');
}

export const fmap = fn => fa => {
  nullcheck(fa);
  switch (true) {
    case isJust(fa):
      const a = unwrap(fa);
      return a.constructor.fmap(fn)(a);
    case isNothing(fa): return nothing();
    default: return fa.constructor.fmap(fn)(fa);
  }
}

// you get the unwrapped value;
export const value = fn => a => just(fn(a));
export const array = fn => a => a.map(fn);
export const func = fn => a => val => fn(a(val));

export function polyfill() {
  Array.fmap = array;
  Number.fmap = value;
  String.fmap = value;
  Boolean.fmap = value;
  Function.fmap = func;
}
