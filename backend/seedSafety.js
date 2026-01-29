import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const safetyProducts = [
    {
        name: "Professional Chemical Respirator Mask",
        description: "Double filter organic vapor respirator. Essential for safety while spraying chemical pesticides and fungicides.",
        category: "Equipment",
        cropTags: ["safety", "protection", "pesticide application", "respirator"],
        price: 850,
        unit: "packet",
        stock: 100,
        imageUrl: "/images/respirator-mask.png",
        manufacturer: "3M Safety",
        usage: "Fit snugly over nose and mouth. Replace filters every 40 hours of use.",
        benefits: ["Protects lungs", "Comfortable fit", "Replaceable filters", "Anti-fog design"],
        safetyPrecautions: ["Check for air leaks before use", "Clean after every session"]
    },
    {
        name: "Chemical Resistant Nitrile Gloves (Pair)",
        description: "Heavy-duty 13-inch long gloves resistant to a wide range of agricultural chemicals and solvents.",
        category: "Equipment",
        cropTags: ["safety", "gloves", "chemical handling", "protection"],
        price: 199,
        unit: "packet",
        stock: 500,
        imageUrl: "/images/nitrile-gloves.png",
        manufacturer: "SafeAgri",
        usage: "Wear while mixing and applying any chemical fertilizer or pesticide.",
        benefits: ["Puncture resistant", "Textured grip", "Long sleeve for arm protection", "Skin safety"],
        safetyPrecautions: ["Wash gloves while still on hands after use", "Inspect for pinholes frequently"]
    },
    {
        name: "Anti-Fog Agricultural Safety Goggles",
        description: "Wide-vision clear goggles with indirect ventilation. Protects eyes from chemical splashes and dust.",
        category: "Equipment",
        cropTags: ["safety", "eye protection", "spraying", "dust protection"],
        price: 150,
        unit: "packet",
        stock: 300,
        imageUrl: "/images/safety-goggles.png",
        manufacturer: "ClearView",
        usage: "Adjust strap for a tight seal around the eyes.",
        benefits: ["Impact resistant", "100% UV protection", "Anti-scratch coating", "Fits over prescription glasses"],
        safetyPrecautions: ["Clean with soft cloth", "Replace if vision is obscured by scratches"]
    },
    {
        name: "Full Body Waterproof Apron (PVC)",
        description: "Extra-thick PVC apron to prevent clothing from getting soaked during high-pressure spraying.",
        category: "Equipment",
        cropTags: ["safety", "waterproof", "spraying", "apparel"],
        price: 350,
        unit: "packet",
        stock: 150,
        imageUrl: "/images/safety-apron.png",
        manufacturer: "AgroShield",
        usage: "Tie securely around waist and neck before starting the sprayer.",
        benefits: ["100% waterproof", "Easy to wipe clean", "Heavy duty durability", "One size fits all"],
        safetyPrecautions: ["Hand wash only", "Hang to dry in shade"]
    },
    {
        name: "Pesticide Measuring Cup & Funnel Set",
        description: "Chemical-grade graduated measuring cylinders and wide-mouth funnel for accurate mixing of pesticides.",
        category: "Equipment",
        cropTags: ["measurement", "mixing", "accuracy", "tools"],
        price: 120,
        unit: "packet",
        stock: 250,
        imageUrl: "/images/measuring-set.png",
        manufacturer: "Precision Mix",
        usage: "Use to measure exact dosages as per manufacturer instructions.",
        benefits: ["Accurate dosing", "Spill-proof pouring", "Chemical resistant plastic", "Prevents overdose"],
        safetyPrecautions: ["Never use for measuring food items", "Rinse thoroughly after use"]
    }
];

async function seedSafety() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        for (const product of safetyProducts) {
            const existing = await Product.findOne({ name: product.name });
            if (!existing) {
                await Product.create(product);
                console.log(`Added: ${product.name}`);
            } else {
                console.log(`Skipped (exists): ${product.name}`);
            }
        }

        console.log('Safety seeding completed!');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
}

seedSafety();
