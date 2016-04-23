/**
 * The curry function
 *
 * Not the usual curry function. This one is a little different
 *
 * It takes a function and the expected number of arguments
 * Constructs a `n` level deep nested function with the final level as the
 * original function defined
 */
export function curry(fn, length, _args) {
  // return a function assuming it takes one argument
  return function(a) {
    // args is the stack (state) that's updated & passed to the inner functions
    let args = typeof _args === 'undefined' ? [] : (Array.isArray(_args) ? _args : [_args]);

    // nargs determines the `n`th recursion step
    let nargs = typeof length === 'undefined' ? fn.length : length;

    // if there is no argument, then simply execute the function
    if (nargs === 0) return fn();

    // push to arguments to be applied when it's the final step
    args.push(a);

    // if it's the final step, exec the function
    if (nargs === 1) return fn.apply(null, args);

    // recurse
    return curry(fn, nargs - 1, args);
  };
}
