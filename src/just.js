function nothing() {
  if (!(this instanceof nothing)) return new nothing();
}
nothing.prototype.constructor = nothing;
nothing.prototype.toString = function() {
  return `nothing()`;
}
export {nothing};

function just(a) {
  if (a === null || typeof a === 'undefined') return nothing();
  if (isJustOrNothing(a)) return a;
  if (!(this instanceof just)) return new just(a);
  this.value = a;
  // this.constructor = a.constructor;
}
just.prototype.constructor = just;
just.prototype.toString = function() {
  return `just(${this.value.toString()})`;
}
export {just};

export const isJust = a => a instanceof just;
export const isNothing = a => a instanceof nothing;
export const isJustOrNothing = a => isJust(a) || isNothing(a);

export function unwrap(a) {
  if (!isJust(a)) throw new TypeError(`Expected ${a} to be a Just for unwrapping`);
  return a.value;
}
