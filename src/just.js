export function nothing() {
  return {
    type: 'nothing'
  };
}

export function just(a) {
  if (a === null || typeof a === 'undefined') return nothing();
  if (typeof a === 'object' && (a.type === 'just' || a.type === 'nothing'))
    return a;
  return {
    type: 'just',
    value: a
  };
}

export function unwrap(a) {
  if (!isJust(a)) throw new TypeError('Expected a to be a Just for unwrapping');
  return a.value;
}

function checker(type) {
  return function(a) {
    if (typeof a === 'undefined' || a === null) return false;
    if (typeof a === 'object' && a.type === type) return true;
    return false;
  };
}

export let isJust = checker('just');
export let isNothing = checker('nothing');

export function isJustOrNothing(a) {
  return isJust() || isNothing();
}
