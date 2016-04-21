// Lists are functors too

export function fmap(a) {
  return Array.prototype.map.call(a);
}
