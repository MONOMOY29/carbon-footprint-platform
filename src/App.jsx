import { useState } from "react";

const tips = {
    transport: ["Use public transport or carpool", "Walk or cycle for short trips", "Consider an electric vehicle"],
    food: ["Reduce red meat consumption", "Buy local and seasonal produce", "Minimize food waste"],
    energy: ["Switch to LED bulbs", "Unplug devices when not in use", "Use energy-efficient appliances"],
};

export default function App() {
    const [form, setForm] = useState({ transport: "", food: "", energy: "" });
    const [result, setResult] = useState(null);

    const factors = { transport: 2.5, food: 1.8, energy: 1.2 };

    const calculate = () => {
        const total =
            (parseFloat(form.transport) || 0) * factors.transport +
            (parseFloat(form.food) || 0) * factors.food +
            (parseFloat(form.energy) || 0) * factors.energy;
        setResult(total.toFixed(2));
    };

    return (
        <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "Arial", padding: 20 }}>
            <h1 style={{ color: "#2e7d32" }}>🌱 Carbon Footprint Platform</h1>
            <p>Enter your daily usage to estimate your carbon footprint (kg CO₂).</p>

            {["transport", "food", "energy"].map((cat) => (
                <div key={cat} style={{ marginBottom: 16 }}>
                    <label style={{ textTransform: "capitalize", fontWeight: "bold" }}>
                        {cat === "transport" ? "🚗 Transport (km/day)" : cat === "food" ? "🍔 Food (meals/day)" : "⚡ Energy (kWh/day)"}
                    </label>
                    <br />
                    <input
                        type="number"
                        min="0"
                        placeholder="Enter value"
                        value={form[cat]}
                        onChange={(e) => setForm({ ...form, [cat]: e.target.value })}
                        style={{ padding: 8, width: "100%", marginTop: 4, borderRadius: 6, border: "1px solid #ccc" }}
                    />
                </div>
            ))}

            <button
                onClick={calculate}
                style={{ background: "#2e7d32", color: "white", padding: "10px 24px", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 16 }}
            >
                Calculate
            </button>

            {result && (
                <div style={{ marginTop: 24, padding: 16, background: "#e8f5e9", borderRadius: 8 }}>
                    <h2>Your Carbon Footprint: {result} kg CO₂/day</h2>
                    <p style={{ color: result > 20 ? "red" : result > 10 ? "orange" : "green" }}>
                        {result > 20 ? "⚠️ High impact! Take action." : result > 10 ? "⚡ Moderate impact." : "✅ Great job! Low impact."}
                    </p>
                    <h3>Personalized Tips:</h3>
                    {["transport", "food", "energy"].map((cat) => (
                        <div key={cat}>
                            <strong style={{ textTransform: "capitalize" }}>{cat}:</strong>
                            <ul>{tips[cat].map((t, i) => <li key={i}>{t}</li>)}</ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}