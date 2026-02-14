# PriceOpt AI - Dynamic Pricing Optimization Engine

![PriceOpt AI Badge](https://img.shields.io/badge/Status-Active-success) ![Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node.js%20%7C%20TypeScript-blue)

**PriceOpt AI** is a robust, full-stack simulation platform designed to help businesses determine the optimal pricing strategy for their products. By leveraging Machine Learning algorithms (Multivariate Linear Regression) and real-time market data simulation, it predicts demand, revenue, and profit under various scenarios, empowering users to make data-driven decisions.

Recently re-engineered from a Python prototype to a high-performance **React + Node.js** architecture, this application demonstrates the power of modern web technologies in solving complex business problems.

---

## ✨ Key Features

- **🧠 AI-Powered Optimization**: Automatically calculates the price point that maximizes profit using advanced regression models.
- **📊 Real-Time Simulation**: Instantly predicts Demand, Revenue, and Profit as you adjust input parameters (Cost, Competitor Prices, Seasonality).
- **📈 Interactive Visualizations**: Dynamic Demand Curves and Profit Charts built with **Recharts** allow for deep analytical insights.
- **🛒 Synthetic Market Data**: The backend automatically generates a realistic dataset of 20+ products across multiple categories (Smartphones, Laptops, Wearables, Home) with built-in seasonality and price elasticity.
- **⚡ Modern Tech Stack**: Built with **Vite**, **React 18**, **Tailwind CSS**, and **Express/Node.js** for a lightning-fast user experience.

---

## 🚀 Benefits

### For Business Owners
- **Maximize Margins**: Identify the "sweet spot" price that yields the highest profit, not just the highest revenue.
- **Competitive Edge**: react dynamically to competitor price changes and market trends.
- **Risk-Free Experimentation**: Test pricing strategies in a simulated environment before applying them to the real market.

### For Developers
- **Scalable Architecture**: The separation of concerns between the React frontend and Node.js backend allows for independent scaling and development.
- **Type Safety**: Full TypeScript implementation ensures robust code quality and fewer runtime errors.
- **Extensible ML Pipeline**: The modular design allows for easy swapping of ML models (e.g., upgrading from Linear Regression to Random Forest or Neural Networks).

---

## 💡 Use Cases

1. **E-Commerce Pricing Strategy**: Online retailers can use the engine to adjust prices dynamically based on competitor data and inventory levels.
2. **Product Launch Planning**: Simulate different launch price points to estimate initial demand and revenue.
3. **Seasonal Promotions**: Analyze how holidays and weekends affect demand elasticity to plan effective discount campaigns.
4. **Inventory Management**: Predict sales volume at different price points to optimize stock levels and reduce holding costs.

---

## 🛠️ Technical Architecture

The application follows a modern client-server architecture:

### **Frontend (Client)**
- **Framework**: React 18 (via Vite)
- **Styling**: Tailwind CSS (v3) + clsx + tailwind-merge
- **Icons**: Lucide React
- **Charts**: Recharts
- **State Management**: React Hooks (useState, useEffect)

### **Backend (Server)**
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Validation**: Zod
- **Machine Learning**: `ml-regression-multivariate-linear` (Custom implementation for JS environment)
- **Data Generation**: Custom algorithm simulating seasonality, elasticity, and competitor influence.

---

## 📦 Installation & Setup

Follow these steps to get the application running locally.

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/dynamic-pricing-engine.git
cd dynamic-pricing-engine
```

### Step 2: Install Dependencies
We have a convenience script to install dependencies for both the root, client, and server.

```bash
npm run install:all
```

*Alternatively, you can install them manually:*
```bash
cd client && npm install
cd ../server && npm install
```

### Step 3: Run the Application
Start both the backend server and frontend client concurrently with a single command:

```bash
npm run dev
```

- **Frontend Dashboard**: Open [http://localhost:5173](http://localhost:5173)
- **Backend API**: Running on [http://localhost:3000](http://localhost:3000)

> **Note**: On the first run, the backend will take a few seconds to generate the synthetic dataset and train the initial ML model. Look for "Model Ready" in the UI.

---

## 🔌 API Reference

The backend exposes the following REST endpoints:

### `GET /api/config`
Returns the available product catalog and categories.

**Response:**
```json
{
  "Smartphones": { "products": ["iPhone 15", ...], "price_min": 300, ... },
  ...
}
```

### `GET /api/health`
Checks the server status and model training state.

**Response:**
```json
{ "status": "ok", "trained": true }
```

### `POST /api/predict`
Calculates predictions and optimal pricing for a given scenario.

**Payload:**
```json
{
  "product_name": "iPhone 15 Pro",
  "unit_cost": 800,
  "unit_price": 999,
  "comp_1": 950,
  "comp_2": 980,
  "comp_3": 1000,
  ...
}
```

---

## 🔮 Future Roadmap

- [ ] **User Authentication**: Save multiple scenarios and pricing history.
- [ ] **Real Data Import**: Upload CSV files to train the model on your own sales data.
- [ ] **Advanced Models**: Implement Random Forest or Gradient Boosting for higher prediction accuracy.
- [ ] **Export Reports**: Generate PDF/Excel reports of the pricing analysis.

---

## 👨‍💻 Author

**Oladi**  
*Full Stack Developer & AI Enthusiast*

Based on the original concept by Arya Bhor.
