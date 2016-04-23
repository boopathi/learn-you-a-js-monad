import {just, nothing, isJust, isNothing, unwrap, isJustOrNothing} from './just';
import {nullcheck} from './nullcheck';

// Todo fmap (fn.length=2) should return a function that computes

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
