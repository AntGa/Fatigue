import { describe, it, expect } from "vitest";
import { calculateE1RM } from "./e1rm.service.js";

describe("calculateE1RM", () => {
  it("calculates correctly with RPE adjustment", () => {
    // 80kg × 10 @ RPE 7 → RIR=3 → effectiveReps=13 → 80 × (1 + 13/30)
    expect(calculateE1RM(80, 10, 7)).toBeCloseTo(114.67);
  });

  it("beats a higher weight at RPE 10", () => {
    const lowerRPE = calculateE1RM(80, 10, 7); // 114.67
    const higherRPE = calculateE1RM(82.5, 10, 10); // 82.5 × (1 + 10/30) = 110
    expect(lowerRPE).toBeGreaterThan(higherRPE);
  });

  it("RPE 10 uses no RIR adjustment", () => {
    // effectiveReps = logged reps, no bonus
    expect(calculateE1RM(100, 5, 10)).toBeCloseTo(116.67);
  });
});
