import { CATALOG, TrainingData } from './types.js';

function normalRandom(mean: number, stdDev: number): number {
    const u = 1 - Math.random();
    const v = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return z * stdDev + mean;
}

function clip(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

function randomChoice<T>(arr: T[], weights?: number[]): T {
    if (!weights) {
        return arr[Math.floor(Math.random() * arr.length)];
    }
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * totalWeight;
    for (let i = 0; i < arr.length; i++) {
        r -= weights[i];
        if (r <= 0) return arr[i];
    }
    return arr[arr.length - 1]; // Fallback
}

export function generateDataset(): TrainingData[] {
    const rows: TrainingData[] = [];
    const SAMPLES_PER_MONTH_PER_PRODUCT = 12;

    for (const [category, spec] of Object.entries(CATALOG)) {
        const pmin = spec.price_min;
        const pmax = spec.price_max;

        for (const product of spec.products) {
            // Product specific base params
            const base_price = Math.random() * (pmax * 0.9 - pmin * 1.1) + pmin * 1.1;
            const elasticity = Math.random() * (2.5 - 0.8) + 0.8;
            const base_demand_level = Math.floor(Math.random() * (2500 - 1000) + 1000);

            for (let month = 1; month <= 12; month++) {
                const seasonal = 1.0 + 0.25 * Math.sin(2 * Math.PI * (month - 1) / 12.0);

                for (let i = 0; i < SAMPLES_PER_MONTH_PER_PRODUCT; i++) {
                    const unit_price = clip(
                        normalRandom(base_price, base_price * 0.15),
                        pmin,
                        pmax
                    );

                    const promotion = randomChoice([0, 1], [0.7, 0.3]);
                    const holiday = randomChoice([0, 1], [0.88, 0.12]);
                    const weekend = randomChoice([0, 1], [0.65, 0.35]);

                    const comp_1 = unit_price * (Math.random() * (1.15 - 0.85) + 0.85);
                    const comp_2 = unit_price * (Math.random() * (1.15 - 0.85) + 0.85);
                    const comp_3 = unit_price * (Math.random() * (1.15 - 0.85) + 0.85);

                    const demand = (
                        base_demand_level * seasonal
                        - elasticity * unit_price
                        + (comp_1 + comp_2 + comp_3) * 0.03
                        + promotion * 250 + holiday * 150 + weekend * 70
                        + normalRandom(0, 50)
                    );

                    const qty = Math.max(0, Math.round(demand));

                    rows.push({
                        product_name: product,
                        product_category: category,
                        promotion,
                        unit_price,
                        comp_1,
                        comp_2,
                        comp_3,
                        holiday,
                        weekend,
                        month,
                        qty
                    });
                }
            }
        }
    }
    return rows;
}
