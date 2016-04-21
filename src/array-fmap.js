// Lists are functors too

export function fmap(fn) {
  return function (arr) {
    return arr.map(fn);
  }
}
