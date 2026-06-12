import { useState, useCallback, useMemo, useEffect } from "react";

const TIPS: Record<string, string[]> = {
    transport: ["Use public transport or carpool", "Walk or cycle for short trips", "Consider an electric vehicle", "Work from home when possible"],
    food: ["Reduce red meat consumption", "Buy local and seasonal produce", "Minimize food waste", "Try plant-based meals twice a week"],
    energy: ["Switch to LED bulbs", "Unplug devices when not in use", "Use energy-efficient appliances", "Install a smart thermostat"],
};

const FACTORS: Record<string, number> = { transport: 2.5, food: 1.8, energy: 1.2 };

const CATEGORIES = [
    { key: "transport", label: "Transport", unit: "km/day", icon: "🚗", description: "Daily kilometers travelled by vehicle", min: 0, max: 1000 },
    { key: "food", label: "Food", unit: "meals/day", icon: "🍔", description: "Number of meals consumed per day", min: 0, max: 20 },
    { key: "energy", label: "Energy", unit: "kWh/day", icon: "⚡", description: "Electricity consumed daily at home", min: 0, max: 500 },
];

type FormState = { transport: string; food: string; energy: string };
type Errors = Partial<Record<keyof FormState, string>>;

// Pure calculation function — testable
export function calculateFootprint(transport: number, food: number, energy: number): number {
    return transport * FACTORS.transport + food * FACTORS.food + energy * FACTORS.energy;
}

// Pure validation — testable
export function validateForm(form: FormState): Errors {
    const errors: Errors = {};
    for (const { key, min, max } of CATEGORIES) {
        const k = key as keyof FormState;
        const raw = form[k].trim();
        if (!raw) { errors[k] = "This field is required."; continue; }
        const val = parseFloat(raw);
        if (isNaN(val)) { errors[k] = "Please enter a valid number."; continue; }
        if (val < min) { errors[k] = `Value must be at least ${min}.`; continue; }
        if (val > max) { errors[k] = `Value must be at most ${max}.`; }
    }
    return errors;
}

export function getImpactLevel(total: number): { label: string; color: string; bg: string } {
    if (total > 20) return { label: "⚠️ High Impact — Take action now!", color: "#b71c1c", bg: "#ffebee" };
    if (total > 10) return { label: "⚡ Moderate Impact — Room to improve", color: "#e65100", bg: "#fff3e0" };
    return { label: "✅ Low Impact — Great job!", color: "#1b5e20", bg: "#e8f5e9" };
}

export default function App() {
    const [form, setForm] = useState < FormState > ({ transport: "", food: "", energy: "" });
    const [errors, setErrors] = useState < Errors > ({});
    const [submitted, setSubmitted] = useState(false);
    const [history, setHistory] = useState < { date: string; total: string }[] > ([]);

    useEffect(() => {
        document.title = "Carbon Footprint Platform";
    }, []);

    const total = useMemo(() => {
        if (!submitted) return null;
        const result = calculateFootprint(
            parseFloat(form.transport) || 0,
            parseFloat(form.food) || 0,
            parseFloat(form.energy) || 0
        );
        return result.toFixed(2);
    }, [submitted, form]);

    const impact = useMemo(() => total ? getImpactLevel(parseFloat(total)) : null, [total]);

    const handleChange = useCallback((key: keyof FormState, value: string) => {
        setForm(prev => ({ ...prev, [key]: value }));
        setErrors(prev => ({ ...prev, [key]: undefined }));
        setSubmitted(false);
    }, []);

    const handleCalculate = useCallback(() => {
        const errs = validateForm(form);
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }
        setSubmitted(true);
        setHistory(prev => [
            { date: new Date().toLocaleTimeString(), total: calculateFootprint(parseFloat(form.transport), parseFloat(form.food), parseFloat(form.energy)).toFixed(2) },
            ...prev.slice(0, 4)
        ]);
    }, [form]);

    const handleReset = useCallback(() => {
        setForm({ transport: "", food: "", energy: "" });
        setErrors({});
        setSubmitted(false);
    }, []);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleCalculate();
    }, [handleCalculate]);

    return (
        <div style={{ minHeight: "100vh", background: "#f1f8e9", padding: "20px 16px" }}>
            <main
                role="main"
                aria-label="Carbon Footprint Awareness Platform"
                style={{ maxWidth: 680, margin: "0 auto", fontFamily: "Segoe UI, Arial, sans-serif" }}
            >
                {/* Header */}
                <header style={{ textAlign: "center", marginBottom: 32 }}>
                    <h1 style={{ color: "#1b5e20", fontSize: "2rem", margin: 0 }}>🌱 Carbon Footprint Platform</h1>
                    <p style={{ color: "#4a7c59", marginTop: 8, fontSize: "1.05rem" }}>
                        Understand, track, and reduce your daily CO₂ emissions
                    </p>
                </header>

                {/* Form */}
                <section
                    aria-label="Carbon footprint calculator form"
                    style={{ background: "white", borderRadius: 12, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", marginBottom: 24 }}
                >
                    <h2 style={{ color: "#2e7d32", marginTop: 0, fontSize: "1.2rem" }}>📊 Daily Activity Input</h2>

                    {CATEGORIES.map(({ key, label, unit, icon, description, min, max }) => {
                        const k = key as keyof FormState;
                        return (
                            <div key={key} style={{ marginBottom: 20 }} role="group" aria-labelledby={`label-${key}`}>
                                <label
                                    id={`label-${key}`}
                                    htmlFor={`input-${key}`}
                                    style={{ fontWeight: "600", display: "block", marginBottom: 2, color: "#1a1a1a" }}
                                >
                                    {icon} {label} <span style={{ fontWeight: 400, color: "#777" }}>({unit})</span>
                                </label>
                                <p id={`desc-${key}`} style={{ fontSize: "0.82rem", color: "#888", margin: "0 0 6px" }}>{description}</p>
                                <input
                                    id={`input-${key}`}
                                    data-testid={`input-${key}`}
                                    type="number"
                                    min={min}
                                    max={max}
                                    step="0.1"
                                    aria-required="true"
                                    aria-describedby={`desc-${key}${errors[k] ? ` error-${key}` : ""}`}
                                    aria-invalid={!!errors[k]}
                                    placeholder={`Enter ${unit} (0–${max})`}
                                    value={form[k]}
                                    onChange={e => handleChange(k, e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    style={{
                                        padding: "10px 14px", width: "100%", borderRadius: 8,
                                        border: errors[k] ? "2px solid #c62828" : "1.5px solid #ccc",
                                        fontSize: "1rem", boxSizing: "border-box",
                                        outline: "none", transition: "border 0.2s",
                                        background: errors[k] ? "#fff8f8" : "white"
                                    }}
                                />
                                {errors[k] && (
                                    <p id={`error-${key}`} role="alert" aria-live="assertive" style={{ color: "#c62828", fontSize: "0.82rem", marginTop: 4 }}>
                                        ⚠ {errors[k]}
                                    </p>
                                )}
                            </div>
                        );
                    })}

                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                        <button
                            onClick={handleCalculate}
                            data-testid="calculate-btn"
                            aria-label="Calculate my carbon footprint"
                            style={{
                                background: "#2e7d32", color: "white", padding: "12px 28px",
                                border: "none", borderRadius: 8, cursor: "pointer",
                                fontSize: "1rem", fontWeight: "600", flex: 1
                            }}
                        >
                            Calculate 🌍
                        </button>
                        <button
                            onClick={handleReset}
                            aria-label="Reset the form"
                            style={{
                                background: "white", color: "#2e7d32", padding: "12px 20px",
                                border: "2px solid #2e7d32", borderRadius: 8, cursor: "pointer",
                                fontSize: "1rem", fontWeight: "600"
                            }}
                        >
                            Reset
                        </button>
                    </div>
                </section>

                {/* Results */}
                {total && impact && (
                    <section
                        aria-live="polite"
                        aria-label="Your carbon footprint results"
                        data-testid="results"
                        style={{ background: impact.bg, borderRadius: 12, padding: 24, marginBottom: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
                    >
                        <h2 style={{ margin: "0 0 8px", color: "#1a1a1a" }}>
                            Your Footprint: <span style={{ color: impact.color }}>{total} kg CO₂/day</span>
                        </h2>
                        <p style={{ color: impact.color, fontWeight: "700", fontSize: "1.1rem", margin: "0 0 16px" }}>{impact.label}</p>

                        <div style={{ background: "white", borderRadius: 8, padding: "12px 16px", marginBottom: 16 }}>
                            <p style={{ margin: 0, fontSize: "0.9rem", color: "#555" }}>
                                📅 Annual estimate: <strong>{(parseFloat(total) * 365).toFixed(0)} kg CO₂/year</strong>
                                {" "}— Average person emits ~4,000 kg/year.
                            </p>
                        </div>

                        <h3 style={{ color: "#2e7d32", marginBottom: 12 }}>💡 Personalized Tips</h3>
                        {CATEGORIES.map(({ key, label, icon }) => (
                            <details key={key} style={{ marginBottom: 10, background: "white", borderRadius: 8, padding: "10px 14px" }}>
                                <summary style={{ cursor: "pointer", fontWeight: "600", color: "#1a1a1a" }}>
                                    {icon} {label}
                                </summary>
                                <ul style={{ margin: "8px 0 0", paddingLeft: 20 }}>
                                    {TIPS[key].map((tip, i) => (
                                        <li key={i} style={{ marginBottom: 6, color: "#333" }}>{tip}</li>
                                    ))}
                                </ul>
                            </details>
                        ))}
                    </section>
                )}

                {/* History */}
                {history.length > 0 && (
                    <section aria-label="Calculation history" style={{ background: "white", borderRadius: 12, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                        <h3 style={{ margin: "0 0 12px", color: "#2e7d32" }}>📈 Recent Calculations</h3>
                        <table role="table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }} aria-label="History of carbon footprint calculations">
                            <thead>
                                <tr>
                                    <th scope="col" style={{ textAlign: "left", padding: "6px 8px", borderBottom: "1px solid #eee", color: "#555" }}>Time</th>
                                    <th scope="col" style={{ textAlign: "right", padding: "6px 8px", borderBottom: "1px solid #eee", color: "#555" }}>kg CO₂/day</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((h, i) => (
                                    <tr key={i}>
                                        <td style={{ padding: "6px 8px", borderBottom: "1px solid #f5f5f5" }}>{h.date}</td>
                                        <td style={{ padding: "6px 8px", borderBottom: "1px solid #f5f5f5", textAlign: "right", fontWeight: "600" }}>{h.total}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                )}

                <footer style={{ textAlign: "center", marginTop: 24, color: "#999", fontSize: "0.8rem" }}>
                    🌍 Built for Hack2Skill PromptWars Challenge 3 · Carbon Footprint Awareness Platform
                </footer>
            </main>
        </div>
    );
}