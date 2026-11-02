import { describe, it, expect } from "vitest";
import { calculateFootprint, validateForm, getImpactLevel, FACTORS } from "./App";

describe("calculateFootprint", () => {
  it("returns zero when all activity metrics are zero", () => {
    expect(calculateFootprint(0, 0, 0)).toBe(0);
  });

  it("calculates transport emissions correctly based on factor weight", () => {
    expect(calculateFootprint(10, 0, 0)).toBe(10 * FACTORS.transport);
  });

  it("calculates food emissions correctly based on meal weight", () => {
    expect(calculateFootprint(0, 10, 0)).toBe(10 * FACTORS.food);
  });

  it("calculates energy emissions accurately", () => {
    expect(calculateFootprint(0, 0, 10)).toBe(10 * FACTORS.energy);
  });

  it("aggregates multi-category consumption accurately", () => {
    const expected = 10 * FACTORS.transport + 10 * FACTORS.food + 10 * FACTORS.energy;
    expect(calculateFootprint(10, 10, 10)).toBe(expected);
  });
});

describe("validateForm", () => {
  it("flags empty input strings across all fields", () => {
    const errors = validateForm({ transport: "", food: "", energy: "" });
    expect(Object.keys(errors)).toHaveLength(3);
    expect(errors.transport).toBe("This field is required.");
  });

  it("accepts valid bounded positive numbers without errors", () => {
    const errors = validateForm({ transport: "15.5", food: "3", energy: "12" });
    expect(Object.keys(errors)).toHaveLength(0);
  });

  it("flags non-numeric characters gracefully", () => {
    const errors = validateForm({ transport: "abc", food: "2", energy: "10" });
    expect(errors.transport).toContain("valid numeric value");
  });

  it("enforces lower and upper bounds", () => {
    const lowerBoundErrors = validateForm({ transport: "-5", food: "2", energy: "10" });
    expect(lowerBoundErrors.transport).toContain("cannot be less than");

    const upperBoundErrors = validateForm({ transport: "2000", food: "2", energy: "10" });
    expect(upperBoundErrors.transport).toContain("cannot exceed");
  });
});

describe("getImpactLevel", () => {
  it("classifies scores <= 10 as Low Impact", () => {
    const impact = getImpactLevel(8.5);
    expect(impact.color).toBe("#1b5e20");
    expect(impact.label).toContain("Low Impact");
  });

  it("classifies scores between 10.1 and 20 as Moderate Impact", () => {
    const impact = getImpactLevel(15);
    expect(impact.color).toBe("#e65100");
    expect(impact.label).toContain("Moderate Impact");
  });

  it("classifies scores above 20 as High Impact", () => {
    const impact = getImpactLevel(28);
    expect(impact.color).toBe("#b71c1c");
    expect(impact.label).toContain("High Impact");
  });
});
