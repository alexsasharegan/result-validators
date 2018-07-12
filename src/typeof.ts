export function is_string(x: any): x is string {
  return typeof x == "string";
}

export function is_number(x: any): x is number {
  return typeof x == "number";
}

export function is_object(x: any): x is object {
  return typeof x == "object";
}

export function is_boolean(x: any): x is boolean {
  return typeof x == "boolean";
}

export function is_function(x: any): x is Function {
  return typeof x == "function";
}
