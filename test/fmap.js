import test from 'tape';
import {just, nothing} from '../src/just';

import {fmap as number} from '../src/number-fmap';
import {fmap as array} from '../src/array-fmap';

function fmap(type) {
  switch (type) {
    case 'number': return number;
    case 'array': return array;
  }
}

test('fmap for number', function(t) {
  const increment = a => a + 1;
  const one = fmap('number')(increment)(nothing());
  t.equal(one.type, 'nothing');

  const two = fmap('number')(increment)(just(1));
  // console.log(two);
  t.equal(two.type, 'just');
  t.equal(two.value, 2);

  const doubleIncrement = fmap('number')(increment)(increment);
  t.equal(doubleIncrement(1), 3);
  t.end();
});

test('fmap for array', function(t) {
  const increment = a => a + 1;
  const m = fmap('array')(increment)([1,2,3,4,5]);
  console.log(m);
  t.end();
});
