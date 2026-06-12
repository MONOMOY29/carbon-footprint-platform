import { useState, useCallback, useMemo } from "react";

const TIPS: Record<string, string[]> = {
    transport: ["Use public transport or carpool", "Walk or cycle for short trips", "Consider an electric vehicle"],
    food: ["Reduce red meat consumption", "Buy local and seasonal produce", "Minimize food waste"],
    energy: ["Switch to LED bulbs", "Unplug devices when not in use", "Use energy-efficient appliances"],
};

const FACTORS: Record<string, number> = { transport: 2.5, food: 1.8, energy: 1.2 };

const CATEGORIES = [
    { key: "transport", label: "Transport", unit: "km/day", icon: "🚗", description: "Daily kilometers travelled" },
    { key: "food", label: "Food", unit: "meals/day", icon: "🍔", description: "Number of meals per day" },
    { key: "energy", label: "Energy", unit: "kWh/day", icon: "⚡", description: "Electricity consumed daily" },
];

interface FormState { transport: string; food: string; energy: string; }
interface Errors { transport?: string; food?: string; energy?: string; }

function validate(form: FormState): Errors {
    const errors: Errors = {};
    CATEGORIES.forEach(({ key }) => {
        const val = parseFloat(form[key as keyof FormState]);
        if (form[key as keyof FormState] === "") errors[key as keyof Errors] = "This field is required";
        else if (isNaN(val) || val < 0) errors[key as keyof Errors] = "Enter a valid positive number";
        else if (val > 10000) errors[key as keyof Errors] = "Value seems too high";
    });
    return errors;
}

export default function App() {
    const [form, setForm] = useState < FormState > ({ transport: "", food: "", energy: "" });
    const [errors, setErrors] = useState < Errors > ({});
    const [submitted, setSubmitted] = useState(false);

    const total = useMemo(() => {
        if (!submitted) return null;
        return (
            (parseFloat(form.transport) || 0) * FACTORS.transport +
            (parseFloat(form.food) || 0) * FACTORS.food +
            (parseFloat(form.energy) || 0) * FACTORS.energy
        ).toFixed(2);
    }, [submitted, form]);

    const handleChange = useCallback((key: string, value: string) => {
        setForm(prev => ({ ...prev, [key]: value }));
        setErrors(prev => ({ ...prev, [key]: undefined }));
        setSubmitted(false);
    }, []);

    const handleCalculate = () => {
        const errs = validate(form);
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }
        setSubmitted(true);
    };

    const impactLevel = total
        ? parseFloat(total) > 20 ? { label: "⚠️ High Impact", color: "#c62828" }
            : parseFloat(total) > 10 ? { label: "⚡ Moderate Impact", color: "#ef6c00" }
                : { label: "✅ Low Impact", color: "#2e7d32" }
        : null;

    return (
        <main
            role="main"
            aria-label="Carbon Footprint Calculator"
            style={{ maxWidth: 640, margin: "40px auto", fontFamily: "Segoe UI, Arial, sans-serif", padding: "0 20px" }}
        >
            <header>
                <h1 style={{ color: "#2e7d32", fontSize: "1.8rem" }}>🌱 Carbon Footprint Platform</h1>
                <p style={{ color: "#555" }}>Track and reduce your daily CO₂ emissions with personalized insights.</p>
            </header>

            <section aria-label="Input Form">
                {CATEGORIES.map(({ key, label, unit, icon, description }) => (
                    <div key={key} style={{ marginBottom: 20 }} role="group" aria-labelledby={`label-${key}`}>
                        <label
                            id={`label-${key}`}
                            htmlFor={`input-${key}`}
                            style={{ fontWeight: "bold", display: "block", marginBottom: 4 }}
                        >
                            {icon} {label} ({unit})
                        </label>
                        <p style={{ fontSize: "0.85rem", color: "#777", margin: "0 0 4px" }}>{description}</p>
                        <input
                            id={`input-${key}`}
                            type="number"
                            min="0"
                            max="10000"
                            step="0.1"
                            aria-required="true"
                            aria-describedby={errors[key as keyof Errors] ? `error-${key}` : undefined}
                            aria-invalid={!!errors[key as keyof Errors]}
                            placeholder={`Enter ${unit}`}
                            value={form[key as keyof FormState]}
                            onChange={e => handleChange(key, e.target.value)}
                            style={{
                                padding: "10px 12px", width: "100%", borderRadius: 6,
                                border: errors[key as keyof Errors] ? "2px solid #c62828" : "1px solid #ccc",
                                fontSize: "1rem", boxSizing: "border-box"
                            }}
                        />
                        {errors[key as keyof Errors] && (
                            <p id={`error-${key}`} role="alert" style={{ color: "#c62828", fontSize: "0.85rem", marginTop: 4 }}>
                                {errors[key as keyof Errors]}
                            </p>
                        )}
                    </div>
                ))}

                <button
                    onClick={handleCalculate}
                    aria-label="Calculate carbon footprint"
                    style={{
                        background: "#2e7d32", color: "white", padding: "12px 28px",
                        border: "none", borderRadius: 6, cursor: "pointer", fontSize: "1rem", fontWeight: "bold"
                    }}
                >
                    Calculate
                </button>
            </section>

            {total && impactLevel && (
                <section
                    aria-live="polite"
                    aria-label="Results"
                    style={{ marginTop: 28, padding: 20, background: "#e8f5e9", borderRadius: 10 }}
                >
                    <h2 style={{ margin: "0 0 8px" }}>Your Footprint: {total} kg CO₂/day</h2>
                    <p style={{ color: impactLevel.color, fontWeight: "bold", fontSize: "1.1rem" }}>{impactLevel.label}</p>

                    <h3>Personalized Tips</h3>
                    {CATEGORIES.map(({ key, label, icon }) => (
                        <div key={key} style={{ marginBottom: 12 }}>
                            <strong>{icon} {label}</strong>
                            <ul style={{ margin: "4px 0 0 0", paddingLeft: 20 }}>
                                {TIPS[key].map((tip, i) => <li key={i} style={{ marginBottom: 4 }}>{tip}</li>)}
                            </ul>
                        </div>
                    ))}
                </section>
            )}
        </main>
    );
}