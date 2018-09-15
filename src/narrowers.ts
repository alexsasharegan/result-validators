import { Option, Result, Ok, Err } from "safe-types";
import { is_string, is_number, is_boolean } from "./type-guards";

/**
 * A `TypeNarrower` takes any value, and returns a result with the
 * type narrowed & asserted on success, or type error string on failure.
 */
export type TypeNarrower<T> = (x: any) => Result<T, string>;

/**
 * Narrow any type to a `string`.
 */
export const asString: TypeNarrower<string> = x =>
  Option.of(x)
    .narrow(is_string)
    .match({
      None: () => Err(`value is not of type 'string'`),
      Some: Ok,
    });

/**
 * A loose type narrower that **does not** check for `NaN` cases.
 */
export const asAnyNumber: TypeNarrower<number> = x =>
  Option.of(x)
    .narrow(is_number)
    .match({
      None: () => Err(`value is not of type 'number'`),
      Some: Ok,
    });

/**
 * A strict type narrower that fails on `NaN` values.
 */
export const asNumber: TypeNarrower<number> = x =>
  asAnyNumber(x).and_then(x => {
    if (Number.isNaN(x)) {
      return Err(`number is NaN`);
    }

    return Ok(x);
  });

/**
 * Narrow any type to a `boolean`.
 */
export const asBool: TypeNarrower<boolean> = x =>
  Option.of(x)
    .narrow(is_boolean)
    .match({
      None: () => Err(`value is not of type 'boolean'`),
      Some: Ok,
    });

/**
 * Narrow any type to a `Array<any>`.
 */
export const asArray: TypeNarrower<any[]> = x =>
  Option.of(x)
    .narrow(Array.isArray)
    .match({
      None: () => Err(`value is not an Array`),
      Some: Ok,
    });

/**
 * Narrow any type to a `number` that is an integer.
 */
export const asInt: TypeNarrower<number> = x =>
  Option.of(x)
    .narrow(is_number)
    .filter(Number.isInteger)
    .match({
      None: () => Err(`value is not an integer`),
      Some: Ok,
    });

/**
 * Narrow any type to an instance of a custom class/constructor.
 */
export const asInstanceOf: <C extends new (...args: any[]) => any>(
  ctor: C
) => TypeNarrower<InstanceType<C>> = ctor => x =>
  Option.of(x)
    .filter(x => x instanceof ctor)
    .match({
      None: () => Err(`value is not an instance of ${ctor.name}`),
      Some: Ok,
    });
