import {just, nothing, isJust, isNothing, unwrap} from './just';
import {match, _} from './pattern-match';
import {curry} from './curry';
import {nullcheck} from './nullcheck';
import {flatten} from './utils';

/**
 * The Applicative operator
 *
 * Operator overloading or definition is not possible in JavaScript,
 * So, we define the binary operator <*> as function applicative
 *
 */
export const applicativeJust = (f, a) => {
  switch (true) {
    case typeof f === 'function': return just(f(a));
    case Array.isArray(f) && Array.isArray(a):
      return flatten(f.map(fn => a.map(_a => fn(_a))));
    case Array.isArray(f) && !Array.isArray(a):
      throw new Error('Applicative takes either two arrays or contexts');
    default:
      console.log(f, a);
      throw new TypeError('Didn\'t match any patterns for applicatives, check your input');
  }
}

export const applicative = curry(
  match(
    [just(_), just(_), applicativeJust],
    [nothing(), just(_), () => nothing()],
    [just(_), nothing(), () => nothing()],
    [nothing(), nothing(), () => nothing()],
    [just(_), _, applicativeJust],
    [_, just(_), applicativeJust],
    [_, _, applicativeJust]
  ),
  /**
   * The number of arguments the applicative always takes
   * is 2. And we build 2 level deep nested/curried function
   */
  2
);

/**
 * The MayBe Applicative
 * instance Applicative Maybe where
 *   pure = Just
 *   Nothing <*> _ = Nothing
 *   (Just f) <*> something = fmap f something
 *
 */
export const MayBe = match(
  [nothing(), _, () => nothing()],
  [just(_), _, (a, b) => fmap(a)(b)],
  [_, a => just(a)]
);
