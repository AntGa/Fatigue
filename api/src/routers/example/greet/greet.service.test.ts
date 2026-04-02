import { describe, it, expect } from "vitest";
import { greet } from "./greet.service.js";

describe("greet", () => {
  it("returns a greeting with the given name", () => {
    expect(greet("Anton")).toBe("Hello, Anton!");
  });

  it("works with any name", () => {
    expect(greet("World")).toBe("Hello, World!");
  });
});
