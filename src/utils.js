export function flatten(a) {
  return [].concat.apply([], a);
}

export function cartesian(fns, as) {
  return flatten(fns.map(fn => as.map(a => fn(a))));
}
