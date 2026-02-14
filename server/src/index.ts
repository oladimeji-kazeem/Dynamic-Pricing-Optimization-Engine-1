import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateDataset } from './data-generator.js';
import { PricingModel } from './ml-service.js';
import { CATALOG } from './types.js';
import { z } from 'zod';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Initialize Model
const pricingModel = new PricingModel();
let isTrained = false;

// Validation Schema
const PredictSchema = z.object({
    product_name: z.string(),
    product_category: z.string(),
    promotion: z.number().int(),
    unit_cost: z.number(),
    unit_price: z.number(),
    comp_1: z.number(),
    comp_2: z.number(),
    comp_3: z.number(),
    holiday: z.number().int(),
    weekend: z.number().int(),
    month: z.number().int()
});

// Train on startup
console.log("Generating dataset and training model...");
const data = generateDataset();
pricingModel.train(data);
isTrained = true;
console.log("Model ready!");

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', trained: isTrained });
});

app.get('/api/config', (req, res) => {
    res.json(CATALOG);
});

app.post('/api/predict', (req, res) => {
    if (!isTrained) {
        return res.status(503).json({ error: "Model not trained yet" });
    }

    try {
        const input = PredictSchema.parse(req.body);

        // Prediction for user input
        const userDemand = pricingModel.predict(input);
        const userRevenue = input.unit_price * userDemand;
        const userProfit = userRevenue - (input.unit_cost * userDemand);

        // Optimization
        const optimal = pricingModel.findOptimalPrice(input, input.unit_cost);

        res.json({
            success: true,
            user_prediction: {
                demand: Number(userDemand.toFixed(2)),
                revenue: Number(userRevenue.toFixed(2)),
                profit: Number(userProfit.toFixed(2))
            },
            optimal_prediction: {
                optimal_price: optimal.optimal_price,
                optimal_demand: optimal.optimal_demand,
                max_profit: optimal.max_profit
            },
            plot_data: {
                prices: optimal.price_range,
                demand: optimal.demand_curve,
                profit: optimal.profit_curve
            }
        });

    } catch (e) {
        if (e instanceof z.ZodError) {
            return res.status(400).json({ error: e.errors });
        }
        res.status(500).json({ error: (e as Error).message });
    }
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
