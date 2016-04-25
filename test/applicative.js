import test from 'tape';
import {applicative} from '../src/applicative';
import {just, nothing, isJust, isNothing, unwrap} from '../src/just';

let increment = a => a + 1;
let decrement = a => a - 1;

test('justs and nothings', function(t) {
  t.equal( unwrap( applicative( just(increment) )( just (5) ) ), 6 );
  t.equal( unwrap( applicative( just(decrement) )( just (1) ) ), 0 );
  t.assert( isNothing( applicative( just(increment) )( nothing() ) ));
  t.end();
});

test('arrays of functions and arrays of values', function(t) {
  t.deepEqual( applicative( [increment, decrement] )( [1, 2, 3] ), [2, 3, 4, 0, 1, 2] );
  t.end();
});
