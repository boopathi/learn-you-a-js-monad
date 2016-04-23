import test from 'tape';
import {applicative, polyfill} from '../src/applicative';
import {just, nothing, isJust, isNothing, unwrap} from '../src/just';

polyfill();

test('applicative', function(t) {
  let increment = a => a + 1;

  console.log(applicative(just(increment))(just(5)));

  console.log(applicative([increment, increment])(just(5)));

  t.end();
});
