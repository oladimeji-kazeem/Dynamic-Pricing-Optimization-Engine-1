export interface Product {
    product_name: string;
    product_category: string;
    unit_price: number;
    promotion: number;
    comp_1: number;
    comp_2: number;
    comp_3: number;
    holiday: number;
    weekend: number;
    month: number;
    qty: number;
}

export interface TrainingData {
    product_name: string;
    product_category: string;
    promotion: number;
    unit_price: number;
    comp_1: number;
    comp_2: number;
    comp_3: number;
    holiday: number;
    weekend: number;
    month: number;
    qty: number;
}

export const CATALOG = {
    "Smartphones & Tablets": {
        "products": [
            "iPhone 15 Pro", "Galaxy S23 Ultra", "Google Pixel 8 Pro", "OnePlus 12",
            "Xiaomi 14 Ultra", "iPhone SE 3", "Galaxy Z Flip 5", "Samsung Z Fold 5",
            "iPad Air", "iPad Mini 6", "Surface Pro 9", "Galaxy Tab S9",
            "Lenovo Tab P12 Pro", "Asus ROG Phone 8", "Motorola Razr+",
            "Nokia G400", "Pixel 7a", "Galaxy A54 5G", "Google Pixel Fold",
            "Galaxy Tab A9"
        ],
        "price_min": 300, "price_max": 1600
    },
    "Laptops & Computers": {
        "products": [
            "MacBook Pro M3", "Dell XPS 15", "Lenovo ThinkPad X1 Carbon", "HP Spectre x360",
            "Asus Zenbook 14", "Surface Laptop 5", "Razer Blade 16", "Alienware m18",
            "Acer Swift Go 14", "LG Gram 17", "Dell Inspiron 16", "HP Envy x360",
            "Lenovo Yoga 7i", "Asus Vivobook 15", "Acer Aspire 5", "Gateway 15.6 Laptop",
            "Chromebook Duet 5", "MSI Thin GF63", "Dell G15 Gaming", "Lenovo Legion 5i"
        ],
        "price_min": 500, "price_max": 2800
    },
    "Wearables & Gadgets": {
        "products": [
            "Apple Watch Ultra 2", "Galaxy Watch 6", "Google Pixel Watch 2", "Fitbit Sense 2",
            "Garmin Forerunner 965", "Oura Ring Gen3", "Whoop 4.0", "Withings ScanWatch 2",
            "Amazfit GTR 4", "Suunto Vertical", "Polar Vantage V3", "Coros Pace 3",
            "Garmin Fenix 7 Pro", "Samsung Buds2 Pro", "Apple AirPods Pro 2",
            "Bose QuietComfort", "JBL Live 670NC", "Sony WH-1000XM5",
            "Anker Soundcore Space", "Beats Studio Pro"
        ],
        "price_min": 100, "price_max": 600
    },
    "Home & Kitchen": {
        "products": [
            "Dyson V15 Detect", "Shark Stratos Cordless", "iRobot Roomba j7+",
            "Roborock S8 Pro Ultra", "Eufy RoboVac 11S", "Keurig K-Elite",
            "Breville Barista Express", "Nespresso VertuoPlus", "Vitamix Ascent Series",
            "Ninja Foodi 8-in-1", "Instant Pot Duo Crisp", "Cuisinart Air Fryer",
            "KitchenAid Artisan Mixer", "Zojirushi Rice Cooker", "Philips Pasta Maker",
            "Cuisinart Coffee Center", "Hamilton Beach FlexBrew", "NutriBullet Pro",
            "Oster Versa Blender", "Ninja Professional Blender"
        ],
        "price_min": 50, "price_max": 1200
    }
};
