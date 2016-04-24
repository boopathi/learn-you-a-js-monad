import test from 'tape';
import {just, nothing, isJust, isNothing, unwrap} from '../src/just';

import {match, _} from '../src/pattern-match';

test('simple pattern matching', function(t) {
  let factorial = match(
    [0, () => 1],
    [1, () => 1],
    [_, n => n * factorial(n-1)]
  );
  t.equal( factorial( 5 ), 120 );
  t.end();
});

test('just/nothing pattern matching', function(t) {
  let MayBe42 = match(
    [just(_), a => a],
    [nothing(), () => 42]
  );
  t.equal( MayBe42( just(42)  ), 42 );
  t.equal( MayBe42( nothing() ), 42 );
  t.end();
});

// test('Numbers, ')
