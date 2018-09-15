import * as V from "../src/validators";
import { Ok } from "safe-types";

describe("Validators", async () => {
  it("should validate URL safe strings", async () => {
    let valid = ["A-string", "", "12345", "username123", "76j"];
    let invalid = ["A string", "user@example", "josé"];

    valid.forEach(str => {
      expect(V.asURLSafe(str)).toEqual(Ok(str));
    });

    invalid.forEach(x => {
      expect(V.asURLSafe(x).is_err()).toEqual(true);
    });
  });

  it("should validate trimmed strings", async () => {
    let valid = ["", "test", "with spaces in between"];
    let invalid = ["A string       ", " user@example", "\njosé", "\t"];

    valid.forEach(str => {
      expect(V.asTrimmed(str)).toEqual(Ok(str));
    });

    invalid.forEach(x => {
      expect(V.asTrimmed(x).is_err()).toEqual(true);
    });
  });

  it("should validate lower-cased strings", async () => {
    let valid = ["", "test", "with spaces in between"];
    let invalid = ["A string", " uSer@example", "0981243T"];

    valid.forEach(str => {
      expect(V.asLowerCased(str)).toEqual(Ok(str));
    });

    invalid.forEach(x => {
      expect(V.asLowerCased(x).is_err()).toEqual(true);
    });
  });

  it("should validate hex", async () => {
    let valid = "0123456789abdcef";
    let invalid = "ghijklmnopqrstuvwxyz";

    expect(V.asHex(valid)).toEqual(Ok(valid));
    expect(V.asHex(valid.toUpperCase())).toEqual(Ok(valid.toUpperCase()));

    Array.from(invalid).forEach(char => {
      expect(V.asHex(char).is_err()).toEqual(true);
    });

    Array.from(invalid.toUpperCase()).forEach(char => {
      expect(V.asHex(char).is_err()).toEqual(true);
    });
  });

  it("should validate lower-cased hex", async () => {
    let valid = "0123456789abdcef";
    let invalid = "ABDCEFGHIJKLMNOPQRSTUVWXYZ";

    expect(V.asHexLowerCased(valid)).toEqual(Ok(valid));
    expect(V.asHexLowerCased(valid.toUpperCase()).is_err()).toBe(true);

    Array.from(invalid).forEach(char => {
      expect(V.asHexLowerCased(char).is_err()).toEqual(true);
    });
  });

  it("should validate non-printable chars", async () => {
    let valid = "0123456789abdcef";
    let invalid = Array.from({ length: 31 }, (_, i) =>
      String.fromCodePoint(i)
    ).join("");

    expect(V.asPrintableChars(valid)).toEqual(Ok(valid));
    expect(V.asPrintableChars(valid.toUpperCase())).toEqual(
      Ok(valid.toUpperCase())
    );

    Array.from(invalid).forEach(char => {
      expect(V.asPrintableChars(char).is_err()).toEqual(true);
    });
  });

  it("should validate digit chars", async () => {
    let valid = "0123456789";
    let invalid = "ABDCEFGH.-$%IJKLMNOPQRSTUVWXYZ";

    expect(V.asDigit(valid)).toEqual(Ok(valid));

    Array.from(invalid).forEach(char => {
      expect(V.asDigit(char).is_err()).toEqual(true);
    });
  });

  it("should validate number ranges", async () => {
    let valid = [
      { min: 0, max: 10, test: 0 },
      { min: 0, max: 10, test: -0 },
      { min: 0, max: 10, test: 10 },
      { min: -1, max: 0, test: -0.5 },
    ];
    let invalid = [
      { min: 0, max: 10, test: -1 },
      { min: 0, max: 10, test: 11 },
      { min: -1, max: 0, test: -1.5 },
    ];

    valid.forEach(({ max, min, test }) => {
      expect(V.betweenRange(min, max)(test)).toEqual(Ok(test));
    });

    invalid.forEach(({ max, min, test }) => {
      expect(V.betweenRange(min, max)(test).is_err()).toEqual(true);
    });
  });

  it("should validate length", async () => {
    let valid = "0123456789";
    let invalid = "ABDCEFGH.-$%IJKLMNOPQRSTUVWXYZ";

    expect(V.withLength(10)(valid)).toEqual(Ok(valid));
    expect(V.withByteLength(10)(valid)).toEqual(Ok(valid));
    expect(V.withLength(10)(invalid).is_err()).toBe(true);
    expect(V.withByteLength(10)(invalid).is_err()).toBe(true);
  });

  it("should validate length between ranges", async () => {
    let valid = [
      { min: 0, max: 10, test: "" },
      { min: 0, max: 10, test: "0123456789" },
      { min: 1, max: 10, test: "test" },
    ];
    let invalid = [
      { min: 1, max: 10, test: "" },
      { min: 1, max: 10, test: "01234567890" },
    ];

    valid.forEach(({ max, min, test }) => {
      expect(V.withLengthBetweenRange(min, max)(test)).toEqual(Ok(test));
      expect(V.withByteLengthBetweenRange(min, max)(test)).toEqual(Ok(test));
    });

    invalid.forEach(({ max, min, test }) => {
      expect(V.withLengthBetweenRange(min, max)(test).is_err()).toEqual(true);
      expect(V.withByteLengthBetweenRange(min, max)(test).is_err()).toEqual(
        true
      );
    });
    expect(V.withMinByteLength(10)("").is_err()).toBe(true);
    expect(V.withMinLength(10)("").is_err()).toBe(true);
    expect(V.withMinByteLength(0)("").is_ok()).toBe(true);
    expect(V.withMinLength(0)("").is_ok()).toBe(true);
    expect(V.withMaxByteLength(10)("01234567890").is_err()).toBe(true);
    expect(V.withMaxLength(10)("01234567890").is_err()).toBe(true);
    expect(V.withMaxByteLength(10)("").is_ok()).toBe(true);
    expect(V.withMaxLength(10)("").is_ok()).toBe(true);
  });

  it("should validate set values", async () => {
    let set = new Set([".js", ".ts", ".html", ".css"]);
    let valid = [".js", ".ts", ".html", ".css", ".js"];
    let invalid = [".csv", ".rs", ".jade", ".scss", ".styl"];

    valid.forEach(str => {
      expect(V.oneOfSet(set)(str)).toEqual(Ok(str));
    });

    invalid.forEach(str => {
      expect(V.oneOfSet(set)(str).is_err()).toEqual(true);
    });
  });
});
