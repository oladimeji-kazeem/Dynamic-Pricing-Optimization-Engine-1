import MultivariateLinearRegression from 'ml-regression-multivariate-linear';
import { TrainingData, CATALOG } from './types.js';

// Simple OneHotEncoder
class OneHotEncoder {
    private categories: string[];

    constructor(categories: string[]) {
        this.categories = categories;
    }

    encode(value: string): number[] {
        return this.categories.map(cat => cat === value ? 1 : 0);
    }
}

export class PricingModel {
    private model: MultivariateLinearRegression | null = null;
    private productEncoder: OneHotEncoder;
    private categoryEncoder: OneHotEncoder;
    private featureCount: number = 0;

    constructor() {
        const products: string[] = [];
        const categories: string[] = Object.keys(CATALOG);

        for (const cat of categories) {
            products.push(...CATALOG[cat as keyof typeof CATALOG].products);
        }

        this.productEncoder = new OneHotEncoder(products);
        this.categoryEncoder = new OneHotEncoder(categories);
    }

    private preprocess(row: Partial<TrainingData>): number[] {
        // Features: 
        // Product OneHot, Category OneHot, 
        // promotion, unit_price, comp_1, comp_2, comp_3, holiday, weekend, month

        const encodedProduct = this.productEncoder.encode(row.product_name || '');
        const encodedCategory = this.categoryEncoder.encode(row.product_category || '');

        return [
            ...encodedProduct,
            ...encodedCategory,
            row.promotion || 0,
            row.unit_price || 0,
            row.comp_1 || 0,
            row.comp_2 || 0,
            row.comp_3 || 0,
            row.holiday || 0,
            row.weekend || 0,
            row.month || 0
        ];
    }

    train(data: TrainingData[]) {
        const X = data.map(row => this.preprocess(row));
        const y = data.map(row => [row.qty]); // Multivariate expects array of outputs

        this.featureCount = X[0].length;
        this.model = new MultivariateLinearRegression(X, y);
        console.log("Model trained successfully.");
    }

    predict(input: Partial<TrainingData>): number {
        if (!this.model) throw new Error("Model not trained");
        const X = this.preprocess(input);
        const prediction = this.model.predict(X);
        // prediction is array [qty]
        return Math.max(0, prediction[0]);
    }

    findOptimalPrice(input: any, unit_cost: number) {
        // Get min/max price for the product
        let minPrice = 0, maxPrice = 10000;
        for (const cat in CATALOG) {
            const c = CATALOG[cat as keyof typeof CATALOG];
            if (c.products.includes(input.product_name)) {
                minPrice = c.price_min;
                maxPrice = c.price_max;
                break;
            }
        }

        const steps = 50;
        const stepSize = (maxPrice - minPrice) / steps;
        const priceRange: number[] = [];
        const demandCurve: number[] = [];
        const profitCurve: number[] = [];

        let bestProfit = -Infinity;
        let optimalPrice = minPrice;
        let optimalDemand = 0;

        for (let i = 0; i <= steps; i++) {
            const price = minPrice + (i * stepSize);
            const tempInput = { ...input, unit_price: price };
            const demand = this.predict(tempInput);
            const revenue = price * demand;
            const profit = revenue - (unit_cost * demand);

            priceRange.push(Number(price.toFixed(2)));
            demandCurve.push(Number(demand.toFixed(2)));
            profitCurve.push(Number(profit.toFixed(2)));

            if (profit > bestProfit) {
                bestProfit = profit;
                optimalPrice = price;
                optimalDemand = demand;
            }
        }

        return {
            optimal_price: Number(optimalPrice.toFixed(2)),
            optimal_demand: Number(optimalDemand.toFixed(2)),
            max_profit: Number(bestProfit.toFixed(2)),
            price_range: priceRange,
            demand_curve: demandCurve,
            profit_curve: profitCurve
        };
    }
}
