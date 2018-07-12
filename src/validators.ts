import { Option, Result, Ok, Err } from "safe-types";
import { is_string, is_number } from "./typeof";

export interface Validator<T> {
  (x: T): Result<T, string>;
}

/**
 * Given any type, returns `Ok(string)` or `Err(string)`.
 */
export function asString(s: any): Result<string, string> {
  return Option.of(s)
    .filter(is_string)
    .match({
      None: () => Err(`value is not of type 'string'`),
      Some: Ok,
    });
}

export function asInt(x: any): Result<number, string> {
  return Option.of(x)
    .filter(is_number)
    .filter(Number.isInteger)
    .match({
      None: () => Err(`value is not an integer`),
      Some: Ok,
    });
}

/**
 * Given a string, returns `Ok(string)`
 * if that string is URL safe or `Err(string)`.
 */
export function asURLSafe(s: string): Result<string, string> {
  if (encodeURIComponent(s) !== s) {
    return Err(`text contains invalid characters: '${s}'`);
  }

  return Ok(s);
}

/**
 * Given a string, returns `Ok(string)`
 * if that string is trimmed or `Err(string)`.
 */
export function asTrimmed(s: string): Result<string, string> {
  if (s.trim() !== s) {
    return Err(`text contains untrimmed whitespace: '${s}'`);
  }

  return Ok(s);
}

/**
 * Given a string, returns `Ok(string)`
 * if that string is lowercase or `Err(string)`.
 */
export function asLowerCased(s: string): Result<string, string> {
  if (s.toLowerCase() !== s) {
    return Err(`text is not lowercase: '${s}'`);
  }

  return Ok(s);
}

/**
 * Given a string, returns `Ok(string)`
 * if that string only contains hex chars or `Err(string)`
 */
export function asHex(s: string): Result<string, string> {
  for (let i = 0, len = s.length, code: number; i < len; i++) {
    code = s.charCodeAt(i);
    // 0-9 are code points 48-57
    // A-F are code points 65-70
    // a-f are code points 97-102
    if (
      (code < 48 || code > 57) &&
      (code < 65 || code > 70) &&
      (code < 97 || code > 102)
    ) {
      return Err(`text contains invalid hexadecimal characters: '${s}'`);
    }
  }

  return Ok(s);
}

/**
 * Given a string, returns `Ok(string)`
 * if that string contains only printable chars or `Err(string)`
 */
export function asPrintableChars(s: string): Result<string, string> {
  // Non-printable chars are code points 0-31
  for (let i = 0, len = s.length; i < len; i++) {
    if (s.charCodeAt(i) < 32) {
      return Err(`text contains non-printable characters: '${s}'`);
    }
  }

  return Ok(s);
}

/**
 * Given a string, returns `Ok(string)`
 * if that string only contains lowercase hex chars or `Err(string)`
 */
export function asHexLowerCased(s: string): Result<string, string> {
  return asHex(s).and_then(asLowerCased);
}

/**
 * Given a string, returns `Ok(string)`
 * if that string only contains digits or `Err(string)`
 */
export function asDigit(d: string): Result<string, string> {
  for (let i = 0, len = d.length; i < len; i++) {
    // 0-9 are code points 48-57
    if (d.charCodeAt(i) < 48 || d.charCodeAt(i) > 57) {
      return Err(`text contains non-numeric characters: '${d}'`);
    }
  }

  return Ok(d);
}

export function withMax(max: number): Validator<number> {
  return function asMax(x) {
    if (x > max) {
      return Err(`the value cannot exceed ${max}`);
    }

    return Ok(x);
  };
}

export function withMin(min: number): Validator<number> {
  return function asMin(x) {
    if (x < min) {
      return Err(`the value cannot be less than ${min}`);
    }

    return Ok(x);
  };
}

export function betweenRange(min: number, max: number): Validator<number> {
  return function asRange(x) {
    return Ok(x)
      .and_then(withMin(min))
      .and_then(withMax(max));
  };
}

/**
 * Given a length, returns a function that takes a string
 * and returns `Ok(string)` if that string === length or `Err(string)`.
 */
export function withLength(len: number): Validator<string> {
  return function asLength(s) {
    if (s.length !== len) {
      return Err(`the length must be ${len}: found ${s.length}`);
    }

    return Ok(s);
  };
}

/**
 * Given a min/max length, returns a function that takes a string
 * and returns `Ok(string)` if that string length is between min/max or `Err(string)`.
 */
export function withLengthBetweenRange<T>(
  min: number,
  max: number
): Validator<ArrayLike<T>> {
  return function asLengthBetweenRange(s) {
    if (s.length < min || s.length > max) {
      return Err(`the length must be between ${min}-${max}: found ${s.length}`);
    }

    return Ok(s);
  };
}

/**
 * Given a min length, returns a function that takes a string
 * and returns `Ok(string)` if that string is min length or `Err(string)`.
 */
export function withMinLength<T>(min: number): Validator<ArrayLike<T>> {
  return function asMinLength(s) {
    if (s.length < min) {
      return Err(`the length must be at least ${min}: found ${s.length}`);
    }

    return Ok(s);
  };
}

/**
 * Given a max length, returns a function that takes a string
 * and returns `Ok(string)` if that string is not greater than max or `Err(string)`.
 */
export function withMaxLength<T>(max: number): Validator<ArrayLike<T>> {
  return function asMaxLength(s) {
    if (s.length > max) {
      return Err(`the length cannot exceed ${max}: found ${s.length}`);
    }

    return Ok(s);
  };
}

/**
 * Given a byte length, returns a function that takes a string
 * and returns `Ok(string)` if that string === length or `Err(string)`.
 */
export function withByteLength(len: number): Validator<string> {
  return function asByteLength(s) {
    let byteLength = Buffer.from(s, "utf8").byteLength;
    if (byteLength !== len) {
      return Err(`the byte length must be ${len}: found ${byteLength}`);
    }

    return Ok(s);
  };
}

/**
 * Given a min/byte max length, returns a function that takes a string
 * and returns `Ok(string)` if that string length is between min/max or `Err(string)`.
 */
export function withByteLengthBetweenRange(
  min: number,
  max: number
): Validator<string> {
  return function asByteLengthBetweenRange(s) {
    let byteLength = Buffer.from(s, "utf8").byteLength;
    if (byteLength < min || byteLength > max) {
      return Err(
        `the byte length must be between ${min}-${max}: found ${byteLength}`
      );
    }

    return Ok(s);
  };
}

/**
 * Given a min byte length, returns a function that takes a string
 * and returns `Ok(string)` if that string is min length or `Err(string)`.
 */
export function withMinByteLength(min: number): Validator<string> {
  return function asMinByteLength(s) {
    let byteLength = Buffer.from(s, "utf8").byteLength;
    if (byteLength < min) {
      return Err(
        `the byte length must be at least ${min}: found ${byteLength}`
      );
    }

    return Ok(s);
  };
}

/**
 * Given a max byte length, returns a function that takes a string
 * and returns `Ok(string)` if that string is not greater than max or `Err(string)`.
 */
export function withMaxByteLength(max: number): Validator<string> {
  return function asMaxByteLength(s) {
    let byteLength = Buffer.from(s, "utf8").byteLength;
    if (byteLength > max) {
      return Err(`the byte length cannot exceed ${max}: found ${byteLength}`);
    }

    return Ok(s);
  };
}

/**
 * Given a `Set<T>`, returns a function that takes a value `T`
 * and returns `Ok(T)` if the Set contains T or `Err(string)`.
 */
export function oneOfSet<T>(
  set: Set<T>,
  msg: string = `the given value is not one of the expected set of values`
): Validator<T> {
  return function asOneOfSet(x) {
    if (!set.has(x)) {
      return Err(msg);
    }

    return Ok(x);
  };
}
