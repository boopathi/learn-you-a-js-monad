import numberFmap from './number-fmap';
import listFmap from './array-fmap';

let registry = new Map();

export function register(typecheck, fmapFn) {
  registry.set(typecheck, fmapFn);
}

export function fmap(fn) {
  return function (fa) {
    for (let typecheck of registry.keys()) {
      if (typecheck(fa)) {
        let fm = registry.get(typecheck);
        return fm(fn, fa);
      }
    }
  }
}

// already register for existing ones
register(a => typeof a === 'number', numberFmap);
register(a => Array.isArray(a), listFmap);
