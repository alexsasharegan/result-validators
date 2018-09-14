import { Ok, Err } from "safe-types";
import * as N from "../src/narrowers";

describe("Narrowers", async () => {
  it("should for strings", async () => {
    let t = {
      success: ["a string", ""],
      fail: [1, false, {}, [], null, undefined],
    };

    for (let ts of t.success) {
      expect(N.asString(ts)).toEqual(Ok(ts));
    }

    for (let tf of t.fail) {
      let r = N.asString(tf);
      expect(r.is_err()).toBe(true);
      expect(r.unwrap_err()).toMatchSnapshot();
    }
  });

  it("should for booleans", async () => {
    let t = {
      success: [true, false],
      fail: [1, "false", "true", {}, [], null, undefined],
    };

    for (let ts of t.success) {
      expect(N.asBool(ts)).toEqual(Ok(ts));
    }

    for (let tf of t.fail) {
      let r = N.asBool(tf);
      expect(r.is_err()).toBe(true);
      expect(r.unwrap_err()).toMatchSnapshot();
    }
  });

  it("should for numbers (loose)", async () => {
    let t = {
      success: [
        0,
        -0,
        1,
        -1,
        Number.MAX_VALUE,
        Number.MAX_SAFE_INTEGER,
        Number.MIN_VALUE,
        Number.MIN_SAFE_INTEGER,
        NaN,
        Number.NaN,
      ],
      fail: ["0", "1", true, false, {}, [], null, undefined],
    };

    for (let ts of t.success) {
      expect(N.asAnyNumber(ts)).toEqual(Ok(ts));
    }

    for (let tf of t.fail) {
      let r = N.asAnyNumber(tf);
      expect(r.is_err()).toBe(true);
      expect(r.unwrap_err()).toMatchSnapshot();
    }
  });

  it("should for numbers (strict)", async () => {
    let t = {
      success: [
        0,
        -0,
        1,
        -1,
        Number.MAX_VALUE,
        Number.MAX_SAFE_INTEGER,
        Number.MIN_VALUE,
        Number.MIN_SAFE_INTEGER,
      ],
      fail: [NaN, Number.NaN, "0", "1", true, false, {}, [], null, undefined],
    };

    for (let ts of t.success) {
      expect(N.asNumber(ts)).toEqual(Ok(ts));
    }

    for (let tf of t.fail) {
      let r = N.asNumber(tf);
      expect(r.is_err()).toBe(true);
      expect(r.unwrap_err()).toMatchSnapshot();
    }
  });

  it("should for ints (strict)", async () => {
    let t = {
      success: [
        0,
        -0,
        1,
        -1,
        5.0,
        10 / 2,
        Number.MAX_SAFE_INTEGER,
        Number.MIN_SAFE_INTEGER,
        Number.MAX_VALUE,
      ],
      fail: [
        0.1,
        -0.1,
        1 / 2,
        NaN,
        Number.NaN,
        "0",
        "1",
        true,
        false,
        {},
        [],
        null,
        undefined,
        Number.MIN_VALUE,
      ],
    };

    for (let ts of t.success) {
      let r = N.asInt(ts);
      r.map_err(err =>
        console.error(err, ts, `(index[${t.success.indexOf(ts)}])`)
      );
      expect(r).toEqual(Ok(ts));
    }

    for (let tf of t.fail) {
      let r = N.asInt(tf);
      r.map(() =>
        console.error(
          `Value should be error:`,
          tf,
          `(at index [${t.fail.indexOf(tf)}])`
        )
      );
      expect(r.is_err()).toBe(true);
      expect(r.unwrap_err()).toMatchSnapshot();
    }
  });

  it("should for arrays", async () => {
    let t = {
      success: [[], [1, 2, 3, 4, 5], [1, true, "string", {}, []]],
      fail: [
        1,
        "false",
        "true",
        {},
        { 0: "", 1: "", length: 2 },
        null,
        undefined,
      ],
    };

    for (let ts of t.success) {
      expect(N.asArray(ts)).toEqual(Ok(ts));
    }

    for (let tf of t.fail) {
      let r = N.asArray(tf);
      expect(r.is_err()).toBe(true);
      expect(r.unwrap_err()).toMatchSnapshot();
    }
  });

  it("should for custom classes", async () => {
    class A {}
    class B extends A {}
    class C extends B {}
    class D {}

    let t = {
      success: [
        { ctor: A, subject: new A() },
        { ctor: A, subject: new B() },
        { ctor: A, subject: new C() },
        { ctor: B, subject: new C() },
        { ctor: D, subject: new D() },
        { ctor: Object, subject: {} },
        { ctor: Object, subject: new D() },
        { ctor: Function, subject() {} },
        { ctor: Object, subject() {} },
      ],
      fail: [
        { ctor: C, subject: new B() },
        { ctor: B, subject: new A() },
        { ctor: D, subject: new A() },
        { ctor: A, subject: {} },
        { ctor: B, subject: {} },
        { ctor: A, subject() {} },
      ],
    };

    for (let ts of t.success) {
      let r = N.asInstanceOf(ts.ctor)(ts.subject);
      r.map_err(err =>
        console.error(err, ts, `(index[${t.success.indexOf(ts)}])`)
      );
      expect(r).toEqual(Ok(ts.subject));
    }

    for (let tf of t.fail) {
      let r = N.asInstanceOf(tf.ctor)(tf.subject);
      r.map(() =>
        console.error(
          `Value should be error:`,
          tf,
          `(at index [${t.fail.indexOf(tf)}])`
        )
      );
      expect(r.is_err()).toBe(true);
      expect(r.unwrap_err()).toMatchSnapshot();
    }
  });
});
