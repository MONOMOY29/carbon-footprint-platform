import React, { useState, useCallback, useMemo, useEffect } from "react";

export const TIPS: Record<string, string[]> = {
  transport: [
    "Opt for public transit, trains, or carpools for long commutes",
    "Walk or cycle for trips under 3 km",
    "Maintain optimal tire pressure to improve vehicle fuel efficiency",
    "Incorporate remote work days when feasible"
  ],
  food: [
    "Incorporate plant-forward or meat-free meals into your weekly diet",
    "Source seasonal produce from local community markets",
    "Plan meal portions strictly to eliminate food landfill waste",
    "Store leftovers properly to extend food lifespan"
  ],
  energy: [
    "Switch all high-use fixtures to energy-certified LED bulbs",
    "Eliminate vampire power drain with smart power strips",
    "Run major washing and cooling appliances during off-peak grid hours",
    "Clean air conditioner filters monthly to maintain thermal efficiency"
  ]
};

export const FACTORS: Record<string, number> = {
  transport: 2.5,
  food: 1.8,
  energy: 1.2
};

export interface CategoryConfig {
  key: "transport" | "food" | "energy";
  label: string;
  unit: string;
  icon: string;
  description: string;
  min: number;
  max: number;
}

export const CATEGORIES: CategoryConfig[] = [
  { key: "transport", label: "Transport", unit: "km/day", icon: "🚗", description: "Daily distance travelled by motor vehicle", min: 0, max: 1000 },
  { key: "food", label: "Food", unit: "meals/day", icon: "🍔", description: "Number of prepared meals consumed daily", min: 0, max: 20 },
  { key: "energy", label: "Energy", unit: "kWh/day", icon: "⚡", description: "Household electricity consumption per day", min: 0, max: 500 }
];

export interface FormState {
  transport: string;
  food: string;
  energy: string;
}

export type FormErrors = Partial<Record<keyof FormState, string>>;

export interface ImpactEvaluation {
  label: string;
  color: string;
  bg: string;
}

export interface CalculationRecord {
  date: string;
  total: string;
}

export function calculateFootprint(transport: number, food: number, energy: number): number {
  return (
    transport * FACTORS.transport +
    food * FACTORS.food +
    energy * FACTORS.energy
  );
}

export function validateForm(form: FormState): FormErrors {
  const errors: FormErrors = {};
  for (const { key, min, max } of CATEGORIES) {
    const raw = form[key].trim();
    if (!raw) {
      errors[key] = "This field is required.";
      continue;
    }
    const val = parseFloat(raw);
    if (isNaN(val)) {
      errors[key] = "Please enter a valid numeric value.";
      continue;
    }
    if (val < min) {
      errors[key] = `Value cannot be less than ${min}.`;
      continue;
    }
    if (val > max) {
      errors[key] = `Value cannot exceed ${max}.`;
    }
  }
  return errors;
}

export function getImpactLevel(total: number): ImpactEvaluation {
  if (total > 20) {
    return { label: "⚠️ High Impact — Priority reduction recommended", color: "#b71c1c", bg: "#ffebee" };
  }
  if (total > 10) {
    return { label: "⚡ Moderate Impact — Achievable reduction opportunities", color: "#e65100", bg: "#fff3e0" };
  }
  return { label: "✅ Low Impact — Excellent sustainability footprint", color: "#1b5e20", bg: "#e8f5e9" };
}

export default function App() {
  const [form, setForm] = useState<FormState>({ transport: "", food: "", energy: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [history, setHistory] = useState<CalculationRecord[]>([]);

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

  const impact = useMemo(() => (total ? getImpactLevel(parseFloat(total)) : null), [total]);

  const handleChange = useCallback((key: keyof FormState, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: undefined }));
    setSubmitted(false);
  }, []);

  const handleCalculate = useCallback(() => {
    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitted(true);
    const score = calculateFootprint(
      parseFloat(form.transport),
      parseFloat(form.food),
      parseFloat(form.energy)
    ).toFixed(2);

    setHistory(prev => [
      { date: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }), total: score },
      ...prev.slice(0, 4)
    ]);
  }, [form]);

  const handleReset = useCallback(() => {
    setForm({ transport: "", food: "", energy: "" });
    setErrors({});
    setSubmitted(false);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") handleCalculate();
    },
    [handleCalculate]
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f1f8e9", padding: "28px 16px" }}>
      <main
        role="main"
        aria-label="Carbon Footprint Assessment Interface"
        style={{ maxWidth: 680, margin: "0 auto", fontFamily: "Segoe UI, -apple-system, sans-serif" }}
      >
        <header style={{ textAlign: "center", marginBottom: 32 }}>
          <h1 style={{ color: "#1b5e20", fontSize: "2.1rem", margin: 0 }}>🌱 Carbon Footprint Platform</h1>
          <p style={{ color: "#4a7c59", marginTop: 8, fontSize: "1.05rem" }}>
            Track, analyze, and offset your personal daily greenhouse emissions
          </p>
        </header>

        <section
          aria-label="Input consumption metrics"
          style={{ background: "#ffffff", borderRadius: 12, padding: 24, boxShadow: "0 2px 10px rgba(0,0,0,0.06)", marginBottom: 24 }}
        >
          <h2 style={{ color: "#2e7d32", marginTop: 0, fontSize: "1.25rem" }}>📊 Consumption Metrics</h2>

          {CATEGORIES.map(({ key, label, unit, icon, description, min, max }) => (
            <div key={key} style={{ marginBottom: 20 }} role="group" aria-labelledby={`label-${key}`}>
              <label
                id={`label-${key}`}
                htmlFor={`input-${key}`}
                style={{ fontWeight: "600", display: "block", marginBottom: 4, color: "#222" }}
              >
                {icon} {label} <span style={{ fontWeight: 400, color: "#666" }}>({unit})</span>
              </label>
              <p id={`desc-${key}`} style={{ fontSize: "0.82rem", color: "#777", margin: "0 0 6px" }}>
                {description}
              </p>
              <input
                id={`input-${key}`}
                data-testid={`input-${key}`}
                type="number"
                min={min}
                max={max}
                step="0.1"
                aria-required="true"
                aria-describedby={`desc-${key}${errors[key] ? ` error-${key}` : ""}`}
                aria-invalid={!!errors[key]}
                placeholder={`Range: ${min} – ${max} ${unit}`}
                value={form[key]}
                onChange={e => handleChange(key, e.target.value)}
                onKeyDown={handleKeyDown}
                style={{
                  padding: "10px 14px",
                  width: "100%",
                  borderRadius: 8,
                  border: errors[key] ? "2px solid #c62828" : "1.5px solid #d0d7de",
                  fontSize: "1rem",
                  boxSizing: "border-box",
                  outline: "none",
                  background: errors[key] ? "#fff5f5" : "#ffffff"
                }}
              />
              {errors[key] && (
                <p id={`error-${key}`} role="alert" style={{ color: "#c62828", fontSize: "0.85rem", marginTop: 4, margin: "4px 0 0" }}>
                  ⚠ {errors[key]}
                </p>
              )}
            </div>
          ))}

          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <button
              onClick={handleCalculate}
              data-testid="calculate-btn"
              style={{
                background: "#2e7d32",
                color: "#ffffff",
                padding: "12px 24px",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: "600",
                flex: 1
              }}
            >
              Calculate Emissions 🌍
            </button>
            <button
              onClick={handleReset}
              style={{
                background: "#ffffff",
                color: "#2e7d32",
                padding: "12px 20px",
                border: "2px solid #2e7d32",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: "600"
              }}
            >
              Reset
            </button>
          </div>
        </section>

        {total && impact && (
          <section
            aria-live="polite"
            data-testid="results"
            style={{ background: impact.bg, borderRadius: 12, padding: 24, marginBottom: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
          >
            <h2 style={{ margin: "0 0 6px", color: "#1a1a1a", fontSize: "1.3rem" }}>
              Total Emissions: <span style={{ color: impact.color }}>{total} kg CO₂/day</span>
            </h2>
            <p style={{ color: impact.color, fontWeight: "700", margin: "0 0 16px" }}>{impact.label}</p>

            <div style={{ background: "#ffffff", borderRadius: 8, padding: "12px 16px", marginBottom: 16 }}>
              <p style={{ margin: 0, fontSize: "0.92rem", color: "#444" }}>
                📅 Projected Annual Total: <strong>{(parseFloat(total) * 365).toFixed(0)} kg CO₂/year</strong>
                <span style={{ display: "block", color: "#666", marginTop: 4, fontSize: "0.85rem" }}>
                  Global baseline benchmark: ~4,000 kg CO₂/person/year.
                </span>
              </p>
            </div>

            <h3 style={{ color: "#2e7d32", marginBottom: 12, fontSize: "1.1rem" }}>💡 Actionable Reduction Steps</h3>
            {CATEGORIES.map(({ key, label, icon }) => (
              <details key={key} style={{ marginBottom: 10, background: "#ffffff", borderRadius: 8, padding: "10px 14px" }}>
                <summary style={{ cursor: "pointer", fontWeight: "600", color: "#222" }}>
                  {icon} {label} Reduction Actions
                </summary>
                <ul style={{ margin: "8px 0 0", paddingLeft: 20 }}>
                  {TIPS[key].map((tip, idx) => (
                    <li key={idx} style={{ marginBottom: 6, color: "#444", fontSize: "0.9rem" }}>{tip}</li>
                  ))}
                </ul>
              </details>
            ))}
          </section>
        )}

        {history.length > 0 && (
          <section style={{ background: "#ffffff", borderRadius: 12, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <h3 style={{ margin: "0 0 12px", color: "#2e7d32", fontSize: "1.1rem" }}>📈 Session Calculation Log</h3>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
              <thead>
                <tr>
                  <th scope="col" style={{ textAlign: "left", padding: "6px 8px", borderBottom: "1px solid #eee", color: "#666" }}>Logged At</th>
                  <th scope="col" style={{ textAlign: "right", padding: "6px 8px", borderBottom: "1px solid #eee", color: "#666" }}>Emissions (kg CO₂/day)</th>
                </tr>
              </thead>
              <tbody>
                {history.map((record, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: "8px", borderBottom: "1px solid #f2f2f2", color: "#555" }}>{record.date}</td>
                    <td style={{ padding: "8px", borderBottom: "1px solid #f2f2f2", textAlign: "right", fontWeight: "600", color: "#222" }}>{record.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        <footer style={{ textAlign: "center", marginTop: 28, color: "#888", fontSize: "0.82rem" }}>
          Built for Hack2Skill PromptWars (Challenge 3) · Verified Carbon Footprint Platform
        </footer>
      </main>
    </div>
  );
}
