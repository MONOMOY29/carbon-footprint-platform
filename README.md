# 🌱 Carbon Footprint Platform

> **Interactive Daily Greenhouse Gas (GHG) Emissions Calculator & Reduction Advisor**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-CodeSandbox-brightgreen?style=flat-square)](https://hsjyrt.csb.app/)
[![React](https://img.shields.io/badge/React-18.2+-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Bundler-Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tested with Vitest](https://img.shields.io/badge/Tested%20with-Vitest-729B1B?style=flat-square&logo=vitest&logoColor=white)](https://vitest.dev/)

An accessible, lightweight client-side application designed to quantify personal carbon footprints across transport, dietary intake, and domestic electricity usage, delivering categorized reduction strategies.

---

## 🎯 Purpose & Challenge Background
Built for **Hack2Skill Virtual PromptWars (Challenge 3)**. The challenge targets awareness around personal consumption metrics, converting ambiguous sustainability advice into concrete, measurable impact tiers.

---

## ⚡ Core Features
- 🚗 **Multi-Vector Assessment:** Evaluates transport ($km$), dietary habits ($meals$), and household grid power ($kWh$).
- 🛡️ **Defensive Client Validation:** Strict boundary assertions (preventing negative values and extreme overages) with real-time accessibility feedback (`role="alert"`).
- 📊 **Dynamic Impact Stratification:** Instantly maps calculated scores into Low, Moderate, and High emission tiers with contextual color coding.
- 📅 **Annual Projection Comparison:** Extrapolates daily rates against global annual per-capita benchmarks (~4,000 kg CO₂/year).
- 💡 **Actionable Mitigation Catalog:** Accessible accordion breakdowns offering concrete changes per category.
- 📈 **Session Telemetry Log:** Maintains an in-memory chronological record of recent evaluations.

---

## 📐 Emission Formulation & Factors
Calculations aggregate weighted consumption vectors:

$$\text{Total CO}_2\text{ (kg/day)} = (D_{\text{transport}} \times 2.5) + (N_{\text{food}} \times 1.8) + (E_{\text{energy}} \times 1.2)$$

| Dimension | Default Factor | Unit | Domain Context |
| :--- | :--- | :--- | :--- |
| **Transport** | `2.5` | kg CO₂/km | Weighted across regional passenger transit & motor vehicle usage |
| **Food Intake** | `1.8` | kg CO₂/meal | Blended diet metric accounting for processing & preparation |
| **Electricity** | `1.2` | kg CO₂/kWh | Domestic electrical grid consumption |

---

## 🛠️ Local Development & Setup

### 1. Clone & Enter Repository
```bash
git clone [https://github.com/MONOMOY29/carbon-footprint-platform.git](https://github.com/MONOMOY29/carbon-footprint-platform.git)
cd carbon-footprint-platform