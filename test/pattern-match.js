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

test('Numbers, Strings, Booleans', function(t) {
  let tester = match(
    [Number, _ => 1],
    [String, _ => 2],
    [Boolean, _ => 3]
  );
  t.equal( tester( 1    ), 1 );
  t.equal( tester( 'a'  ), 2 );
  t.equal( tester( true ), 3 );
  t.end();
});

test('Custom functions', function(t) {
  const even = n => typeof n === 'number' && n % 2 === 0;
  const odd = n => typeof n === 'number' && !even(n);
  const array = a => Array.isArray(a);

  const odds = [], evens = [];
  let segregate = match(
    [odd, n => (odds.push(n), n)],
    [even, n => (evens.push(n), n)],
    [array, a => a.map(e => segregate(e))]
  );
  segregate([1,2,3,4,5,6]);
  t.deepEqual(odds, [1,3,5]);
  t.deepEqual(evens, [2,4,6]);
  t.end();
});

test('multiple patterns', function(t) {
  const whatever = match(
    [just(_), just(_), (a, b) => just(a + b)],
    [just(_), nothing(), a => just(a + 10)],
    [nothing(), just(_), (a, b) => just(b - 10)],
    [nothing(), nothing(), () => just(-100)]
  );
  t.equal( unwrap( whatever( just( 1 ), just( 2 ) ) ), 3 );
  t.equal( unwrap( whatever( just( 3 ), nothing() ) ), 13 );
  t.equal( unwrap( whatever( nothing(), just( 4 ) ) ), -6 );
  t.equal( unwrap( whatever( nothing(), nothing() ) ), -100 );
  t.end();
});
