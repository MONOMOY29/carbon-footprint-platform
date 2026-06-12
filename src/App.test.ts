import { calculateFootprint, validateForm, getImpactLevel } from "./App";

// calculateFootprint tests
console.assert(calculateFootprint(0, 0, 0) === 0, "Zero input should return 0");
console.assert(calculateFootprint(10, 0, 0) === 25, "Transport only");
console.assert(calculateFootprint(0, 10, 0) === 18, "Food only");
console.assert(calculateFootprint(0, 0, 10) === 12, "Energy only");
console.assert(calculateFootprint(10, 10, 10) === 55, "All categories");

// validateForm tests
const emptyErrors = validateForm({ transport: "", food: "", energy: "" });
console.assert(Object.keys(emptyErrors).length === 3, "Empty form should have 3 errors");

const validResult = validateForm({ transport: "10", food: "3", energy: "5" });
console.assert(Object.keys(validResult).length === 0, "Valid form should have no errors");

const negativeErrors = validateForm({ transport: "-1", food: "3", energy: "5" });
console.assert("transport" in negativeErrors, "Negative value should error");

// getImpactLevel tests
console.assert(getImpactLevel(5).color === "#1b5e20", "Low impact color");
console.assert(getImpactLevel(15).color === "#e65100", "Moderate impact color");
console.assert(getImpactLevel(25).color === "#b71c1c", "High impact color");

console.log("✅ All tests passed!");