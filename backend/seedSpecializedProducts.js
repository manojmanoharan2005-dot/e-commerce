import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const specializedProducts = [
    {
        name: "Gibberellic Acid (0.001% L) Growth Regulator",
        description: "Liquid plant growth regulator that promotes stem elongation, better flowering, and fruit size. Essential for grapes and cotton.",
        category: "Bio-Fertilizer",
        cropTags: ["grapes", "cotton", "rice", "citrus", "fruits"],
        price: 240,
        unit: "packet",
        stock: 180,
        imageUrl: "/images/gibberellic-acid.png",
        manufacturer: "Agro Life Sciences",
        usage: "Dilute 1ml per liter of water and spray during flowering and fruit setting stages",
        benefits: ["Increases fruit size", "Reduces flower drop", "Promotes uniform growth", "Improves yield"],
        safetyPrecautions: ["Do not exceed recommended dose", "Spray in calm weather", "Keep away from children"]
    },
    {
        name: "Chelated Multi-Micronutrient Mix",
        description: "A balanced mixture of Zinc, Iron, Manganese, Copper, Boron, and Molybdenum in chelated form for maximum absorption.",
        category: "Chemical",
        cropTags: ["citrus", "mango", "pomegranate", "vegetables", "cereals"],
        price: 450,
        unit: "packet",
        stock: 220,
        imageUrl: "/images/micronutrients-chelated.png",
        manufacturer: "Yara Chemicals",
        composition: "Zn (3%), Fe (2.5%), Mn (1%), B (0.5%), Cu (0.3%), Mo (0.1%)",
        usage: "Mix 2g per liter of water for foliar spray every 21 days",
        benefits: ["Corrects nutrient deficiencies", "Vibrant green foliage", "Better fruit quality", "Enhanced photosynthesis"],
        safetyPrecautions: ["Store in a cool dry place", "Wear protective gloves", "Do not mix with concentrated P/S fertilizers"]
    },
    {
        name: "Mycorrhiza Bio-Fertilizer (VAM)",
        description: "Vesicular Arbuscular Mycorrhiza (VAM) fungi that form a symbiotic relationship with roots, drastically increasing nutrient reach.",
        category: "Bio-Fertilizer",
        cropTags: ["all crops", "forestry", "plantation", "nursery"],
        price: 550,
        unit: "bag",
        stock: 130,
        imageUrl: "/images/mycorrhiza.png",
        manufacturer: "Eco-Bio Organics",
        composition: "Endo-Mycorrhizal spores (minimum 100 spores/gram)",
        usage: "Apply 4kg per acre with organic manure during sowing",
        benefits: ["Increases root surface area", "Improved phosphorus uptake", "Drought resistance", "Controls root-borne diseases"],
        safetyPrecautions: ["Avoid chemical fungicides near root zone", "Store in moisture-free area"]
    },
    {
        name: "100% Water Soluble Boron (20%)",
        description: "High-grade Boron fertilizer to prevent fruit cracking and improve pollination and grain setting.",
        category: "Chemical",
        cropTags: ["tomato", "grapes", "pomegranate", "sunflower", "brassica"],
        price: 380,
        unit: "packet",
        stock: 300,
        imageUrl: "/images/boron-20.png",
        manufacturer: "Borax India",
        composition: "Disodium Octaborate Tetrahydrate (Boron 20%)",
        usage: "Spray 1g-1.5g per liter of water twice during growth cycle",
        benefits: ["Prevents fruit cracking", "Essential for pollination", "Increases sugar content", "Stops hollow heart in tubers"],
        safetyPrecautions: ["Follow strict dosage to avoid toxicity", "Toxicity to certain plants - check label"]
    },
    {
        name: "Pressed Mud Organic Manure",
        description: "Nutritious organic manure derived from sugarcane industry. Excellent for soil conditioning and structure improvement.",
        category: "Organic",
        cropTags: ["sugarcane", "paddy", "wheat", "cotton"],
        price: 850,
        unit: "bag",
        stock: 100,
        imageUrl: "/images/pressed-mud.png",
        manufacturer: "Sugar-Agro Mills",
        composition: "Decayed Sugarcane Residue, Organic Matter 40%",
        usage: "Apply 2-5 tons per acre based on soil requirement",
        benefits: ["Rich in micronutrients", "Improves water holding capacity", "Long term fertility", "Cost effective"],
        safetyPrecautions: ["Incorporate deep into the soil", "Keep away from moisture"]
    },
    {
        name: "Cabbage F1 Hybrid Seeds",
        description: "High-yielding F1 hybrid cabbage seeds. Produces firm, medium-sized green heads with excellent shelf life.",
        category: "Seeds",
        cropTags: ["cabbage", "vegetables", "winter crops"],
        price: 65,
        unit: "packet",
        stock: 800,
        imageUrl: "/images/cabbage-seeds.png",
        manufacturer: "Namdhari Seeds",
        usage: "Sow in nursery; transplant 30-day seedlings to main field",
        benefits: ["Uniform heads", "Resistant to rot", "Excellent crisp texture", "Market preferred size"],
        safetyPrecautions: ["Avoid direct sunlight for packets", "Seed treatment applied"]
    },
    {
        name: "Marigold Yellow F1 Seeds",
        description: "Floriculture grade marigold seeds. Large, double-petal yellow flowers ideal for garlands and landscaping.",
        category: "Seeds",
        cropTags: ["marigold", "flowers", "landscaping", "floriculture"],
        price: 120,
        unit: "packet",
        stock: 500,
        imageUrl: "/images/marigold-seeds.png",
        manufacturer: "Indo-American Seeds",
        usage: "Easy to grow from seed; flowers in 55-60 days",
        benefits: ["High flower count", "Vibrant color", "Continuous blooming", "Pest repellent properties"],
        safetyPrecautions: ["Protect from excessive moisture during germination"]
    },
    {
        name: "Copper Oxychloride (Fungicide)",
        description: "Broad-spectrum contact fungicide to control blights, downy mildew, and leaf spots in crops.",
        category: "Pesticide",
        cropTags: ["potato", "grapes", "tomato", "chilli", "fruits"],
        price: 490,
        unit: "packet",
        stock: 150,
        imageUrl: "/images/copper-fungicide.png",
        manufacturer: "TATA Rallis",
        composition: "Copper Oxychloride 50% WP",
        usage: "Mix 2-3g per liter of water and spray on whole plant",
        benefits: ["Effective disease control", "Prevents fungal spread", "Stays active on leaves", "Affortable protection"],
        safetyPrecautions: ["Extremely toxic to fish", "Wear mask and goggles", "Store separately from food"]
    },
    {
        name: "Potassium Humate (98% Lustrous)",
        description: "Organic soil conditioner that improves soil structure and makes nutrients more accessible to the roots.",
        category: "Organic",
        cropTags: ["all crops", "horticulture", "lawns"],
        price: 550,
        unit: "kg",
        stock: 200,
        imageUrl: "/images/humic-acid.png",
        manufacturer: "Humi-Tech India",
        composition: "Humic Acid 80% + Fulvic Acid 15% + Potash 10%",
        usage: "Mix 1-2g in 1 liter water for soil drenching or spray",
        benefits: ["Darker soil color", "Breaks down nutrient blocks", "Promotes white roots", "Increases yield"],
        safetyPrecautions: ["Don't mix with highly acidic chemicals", "Store in dry place"]
    },
    {
        name: "NPK 13-00-45 (Potassium Nitrate)",
        description: "Primarily used during the fruit-filling stage. High potassium and quick nitrogen for better size and taste.",
        category: "Chemical",
        cropTags: ["tobacco", "citrus", "mango", "banana", "vegetables"],
        price: 190,
        unit: "packet",
        stock: 400,
        imageUrl: "/images/npk-13.png",
        manufacturer: "Haifa Chemicals",
        npkRatio: { nitrogen: 13, phosphorus: 0, potassium: 45 },
        usage: "Foliar spray 1-2% concentration (10-20g per liter)",
        benefits: ["Fruit sweetness", "Uniform ripening", "Increase fruit size", "Improves keeping quality"],
        safetyPrecautions: ["Keep away from heat sources", "Store in a cool dry area"]
    }
];

async function seedSpecializedProducts() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        for (const product of specializedProducts) {
            const existing = await Product.findOne({ name: product.name });
            if (!existing) {
                await Product.create(product);
                console.log(`Added: ${product.name}`);
            } else {
                console.log(`Skipped (exists): ${product.name}`);
            }
        }

        console.log('Specialized seeding completed!');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
}

seedSpecializedProducts();
