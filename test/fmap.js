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
  t.equal(fmap('number')(increment)(just(1)).type, 'just');
  t.equal(fmap('number')(increment)(just(1)).value, 2);
  t.end();
});
