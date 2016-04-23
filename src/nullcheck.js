function nullcheck(a) {
  if (typeof a === 'undefined' || a === null)
    throw new TypeError('Got null/undefined');
}
