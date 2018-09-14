export function is_string(x: any): x is string {
  return typeof x == "string";
}

export function is_not_string<T>(x: T): x is Exclude<T, string> {
  return !is_string(x);
}

export function is_number(x: any): x is number {
  return typeof x == "number";
}

export function is_not_number<T>(x: T): x is Exclude<T, number> {
  return !is_number(x);
}

export function is_object(x: any): x is object {
  return typeof x == "object";
}

export function is_not_object<T>(x: T): x is Exclude<T, object> {
  return !is_object(x);
}

export function is_boolean(x: any): x is boolean {
  return typeof x == "boolean";
}

export function is_not_boolean<T>(x: T): x is Exclude<T, boolean> {
  return !is_boolean(x);
}

export function is_function(x: any): x is Function {
  return typeof x == "function";
}

export function is_not_function<T>(x: T): x is Exclude<T, Function> {
  return !is_function(x);
}

export function is_symbol(x: any): x is Symbol {
  return typeof x == "symbol";
}

export function is_not_symbol<T>(x: T): x is Exclude<T, Symbol> {
  return !is_symbol(x);
}

export function is_undefined(x: any): x is undefined {
  return typeof x == "undefined";
}

export function is_not_undefined<T>(x: T): x is Exclude<T, undefined> {
  return !is_undefined(x);
}
