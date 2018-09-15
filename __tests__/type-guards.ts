import * as G from "../src/type-guards";

describe("Type Guards", async () => {
  it("strings", async () => {
    expect(G.is_string("")).toBe(true);
    expect(G.is_not_string("")).toBe(false);

    expect(G.is_string(1)).toBe(false);
    expect(G.is_not_string(1)).toBe(true);
  });

  it("booleans", async () => {
    expect(G.is_boolean(true)).toBe(true);
    expect(G.is_not_boolean(true)).toBe(false);

    expect(G.is_boolean(1)).toBe(false);
    expect(G.is_not_boolean("")).toBe(true);
    expect(G.is_not_boolean(1)).toBe(true);
  });

  it("numbers", async () => {
    expect(G.is_number(1)).toBe(true);
    expect(G.is_not_number(1)).toBe(false);

    expect(G.is_number("")).toBe(false);
    expect(G.is_not_number("")).toBe(true);
  });

  it("objects", async () => {
    expect(G.is_object({})).toBe(true);
    expect(G.is_not_object({})).toBe(false);

    expect(G.is_object(null)).toBe(true);
    expect(G.is_not_object(null)).toBe(false);

    expect(G.is_object(new Date())).toBe(true);
    expect(G.is_not_object(new Date())).toBe(false);

    expect(G.is_object(1)).toBe(false);
    expect(G.is_not_object(Date)).toBe(true);
    expect(G.is_not_object(1)).toBe(true);
  });

  it("functions", async () => {
    expect(G.is_function(function() {})).toBe(true);
    expect(G.is_not_function(function() {})).toBe(false);

    expect(G.is_function(1)).toBe(false);
    expect(G.is_not_function(1)).toBe(true);
  });

  it("symbols", async () => {
    expect(G.is_symbol(Symbol("x"))).toBe(true);
    expect(G.is_not_symbol(Symbol("x"))).toBe(false);

    expect(G.is_symbol(1)).toBe(false);
    expect(G.is_not_symbol(1)).toBe(true);
  });

  it("undefined", async () => {
    const does_nothing = () => {};
    expect(G.is_undefined(undefined)).toBe(true);
    expect(G.is_not_undefined(undefined)).toBe(false);

    expect(G.is_undefined(does_nothing())).toBe(true);
    expect(G.is_not_undefined(does_nothing())).toBe(false);

    expect(G.is_undefined(1)).toBe(false);
    expect(G.is_not_undefined(1)).toBe(true);
  });
});
