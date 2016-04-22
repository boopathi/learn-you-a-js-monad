import test from 'tape';
import {just, nothing, unwrap, isJust, isNothing} from '../src/just';

import {fmap, polyfill} from '../src/functor';
polyfill();

test('fmap for number', function(t) {

  const increment = a => a + 1;
  t.assert(isNothing(fmap(increment)(nothing())));
  t.assert(isJust(fmap(increment)(just(1))));
  t.equal(unwrap(fmap(increment)(just(1))), 2);
  t.equal(unwrap(fmap(increment)(1)), 2);

  const doubleIncrement = fmap(increment)(increment);
  t.equal(doubleIncrement(1), 3);
  t.end();
});

test('fmap for array', function(t) {
  const increment = a => a + 1;
  const m = fmap(increment)([1,2,3,4,5]);
  t.assert(Array.isArray(m));
  t.deepEqual(m, [2,3,4,5,6]);
  t.end();
});
