import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const additionalProducts = [
    {
        name: "NPK 19-19-19 Water Soluble Fertilizer",
        description: "Premium balanced fertilizer for fertigation and foliar spray. Highly effective for all stages of plant growth.",
        category: "Chemical",
        cropTags: ["all crops", "horticulture", "floriculture", "vegetables"],
        price: 180,
        unit: "packet",
        stock: 500,
        imageUrl: "/images/npk-19.png",
        manufacturer: "IFFCO",
        npkRatio: { nitrogen: 19, phosphorus: 19, potassium: 19 },
        composition: "19% N, 19% P2O5, 19% K2O",
        usage: "Dissolve 5-10g in 1 liter of water and spray on leaves or apply through drip",
        benefits: ["Balanced nutrition", "100% water soluble", "Fast acting", "Increases flowering"],
        safetyPrecautions: ["Store in a cool dry place", "Avoid direct contact with eyes", "Keep away from moisture"]
    },
    {
        name: "Liquid Seaweed Extract (Growth Booster)",
        description: "Natural plant growth promoter derived from fermented sea algae. Rich in cytokinins and trace elements.",
        category: "Organic",
        cropTags: ["vegetables", "fruits", "flowers", "lawn"],
        price: 320,
        unit: "liter",
        stock: 200,
        imageUrl: "/images/seaweed-liquid.png",
        manufacturer: "Green Garden",
        composition: "Seaweed extract, Micronutrients",
        usage: "Mix 5ml in 1 liter of water. Spray twice a month.",
        benefits: ["Relieves plant stress", "Darker green leaves", "Better fruit size", "Boosts immunity"],
        safetyPrecautions: ["Shake well before use", "Non-toxic", "Keep away from children"]
    },
    {
        name: "Rhizobium Bio-Fertilizer",
        description: "Specialized nitrogen-fixing bacteria for legume crops like peas, beans, and pulses.",
        category: "Bio-Fertilizer",
        cropTags: ["peas", "beans", "pulses", "soybean", "groundnut"],
        price: 150,
        unit: "packet",
        stock: 150,
        imageUrl: "/images/rhizobium.png",
        manufacturer: "Agro-Bio Lab",
        composition: "Rhizobium sp. (10^9 CFU/ml)",
        usage: "Seed treatment before sowing (200g per 10kg seeds)",
        benefits: ["Fixes atmospheric nitrogen", "Improves soil structure", "Increases protein content", "Zero pollution"],
        safetyPrecautions: ["Do not mix with chemical fungicides", "Store in a cool dark place", "Use within 6 months"]
    },
    {
        name: "Bone Meal Natural Phosphorus",
        description: "Organic source of phosphorus and calcium. Slow-release fertilizer excellent for flowering plants and root vegetables.",
        category: "Organic",
        cropTags: ["rose", "hibiscus", "potatoes", "onions", "fruits"],
        price: 120,
        unit: "kg",
        stock: 400,
        imageUrl: "/images/bone-meal.png",
        manufacturer: "Organic Roots",
        composition: "Natural bone dust, Calcium, Phosphorus",
        usage: "Mix 2-3 tablespoons in soil per plant every 2 months",
        benefits: ["Strong roots", "Bigger blooms", "Long lasting", "100% Natural"],
        safetyPrecautions: ["Wear a mask during application to avoid dust", "Wash hands after use"]
    },
    {
        name: "Epsom Salt (Magnesium Sulphate)",
        description: "Agricultural grade magnesium sulphate to cure leaf yellowing and improve plant health.",
        category: "Chemical",
        cropTags: ["chilli", "tomato", "rose", "citrus", "all vegetables"],
        price: 85,
        unit: "packet",
        stock: 300,
        imageUrl: "/images/epsom-salt.png",
        manufacturer: "Crop Care",
        composition: "9.6% Magnesium, 12% Sulphur",
        usage: "Dissolve 1 teaspoon in 1 liter of water and spray fortnightly",
        benefits: ["Prevents yellow leaves", "Increases magnesium", "Better fruit flavor", "Boosts chlorophyll"],
        safetyPrecautions: ["Not for human consumption", "Keep in airtight container"]
    },
    {
        name: "Phosphorus Solubilizing Bacteria (PSB)",
        description: "Bio-fertilizer that makes locked soil phosphorus available to the plants through natural enzymes.",
        category: "Bio-Fertilizer",
        cropTags: ["all crops", "wheat", "rice", "cotton", "soybean"],
        price: 160,
        unit: "packet",
        stock: 250,
        imageUrl: "/images/psb.png",
        manufacturer: "Bio Solutions",
        composition: "Bacillus megaterium var. phosphaticum",
        usage: "Soil application or seed treatment (5-10ml per kg seed)",
        benefits: ["Dissolves fixed phosphorus", "Enhanced root system", "Reduces chemical usage", "Eco-friendly"],
        safetyPrecautions: ["Use before expiration date", "Avoid mixing with antibiotics"]
    },
    {
        name: "Neem Oil Water Soluble (Natural Pesticide)",
        description: "10,000 PPM Neem Oil formulation for controlling aphids, whiteflies, and other soft-bodied insects.",
        category: "Pesticide",
        cropTags: ["all vegetables", "fruits", "ornamental plants"],
        price: 280,
        unit: "liter",
        stock: 120,
        imageUrl: "/images/neem-oil.png",
        manufacturer: "Bio-Guard",
        composition: "Neem Oil, Azadirachtin 1%",
        usage: "Mix 2-5ml in 1 liter of water with a drop of soap and spray",
        benefits: ["Organic pest control", "Repels multiple pests", "Safe for bees", "Fungicidal properties"],
        safetyPrecautions: ["Spray during early morning or evening", "Avoid eyes", "Do not spray in heavy wind"]
    },
    {
        name: "Muriate of Potash (MOP) - Pink",
        description: "Standard potassium fertilizer for improving crop quality, weight, and disease resistance.",
        category: "Chemical",
        cropTags: ["banana", "potato", "sugarcane", "paddy", "grapes"],
        price: 980,
        unit: "bag",
        stock: 350,
        imageUrl: "/images/mop.png",
        manufacturer: "IPL Potash",
        npkRatio: { nitrogen: 0, phosphorus: 0, potassium: 60 },
        composition: "60% K2O (Potash)",
        usage: "Apply at final stage of growth or fruit development",
        benefits: ["Increases grain weight", "Improves drought resistance", "Better taste and color", "Stronger stalks"],
        safetyPrecautions: ["Avoid direct contact", "Store away from acidic products"]
    },
    {
        name: "Hybrid Tomato Seeds (High Yield)",
        description: "Disease-resistant hybrid tomato seeds suitable for all seasons. High productivity and excellent fruit quality.",
        category: "Seeds",
        cropTags: ["tomato", "vegetables", "farming"],
        price: 45,
        unit: "packet",
        stock: 1000,
        imageUrl: "/images/tomato-seeds.png",
        manufacturer: "Seminis",
        usage: "Sow in nursery beds; transplant after 21-25 days",
        benefits: ["Heat tolerant", "Consistent size", "Fast growing", "Disease resistant"],
        safetyPrecautions: ["Keep in a cool dry place", "Treated with fungicide - do not use for food/oil"]
    },
    {
        name: "Rose Special Fertilizer Mix",
        description: "Specially formulated blend for roses. Encourages large, vibrant blooms and healthy foliage.",
        category: "Organic",
        cropTags: ["rose", "flowers", "horticulture"],
        price: 195,
        unit: "packet",
        stock: 200,
        imageUrl: "/images/rose-mix.png",
        manufacturer: "Flower Plus",
        composition: "Blend of Bone meal, Neem cake, and Micronutrients",
        usage: "Apply 50g per plant twice a month and water well",
        benefits: ["Brighter colors", "Continuous blooming", "Healthy roots", "Rich soil"],
        safetyPrecautions: ["Keep out of reach of pets", "Store away from food"]
    }
];

async function seedProducts() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        for (const product of additionalProducts) {
            // Check if product already exists to avoid duplicates
            const existing = await Product.findOne({ name: product.name });
            if (!existing) {
                await Product.create(product);
                console.log(`Added: ${product.name}`);
            } else {
                console.log(`Skipped (exists): ${product.name}`);
            }
        }

        console.log('Seeding completed!');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
}

seedProducts();
