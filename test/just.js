import test from 'tape';
import {just, nothing, isJust, isNothing, unwrap} from '../src/just';

test('just a and nothing a', function (t) {
  let a = just(1);
  t.assert(isJust(a));
  t.assert(isNothing(nothing()));
  t.assert(isNothing(just()));
  t.assert(isNothing(just(null)));
  t.end();
});

test('combinators', function (t) {
  t.assert(isJust(just(just(3))));
  t.assert(isNothing(just(nothing())));
  t.assert(isNothing(nothing(just(3))));
  t.end();
})
