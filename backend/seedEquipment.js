import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const equipmentAndTools = [
    {
        name: "Battery Operated Knapsack Sprayer (16L)",
        description: "High-performance electric sprayer for pesticides and fertilizers. Comes with a powerful 12V battery and adjustable nozzles.",
        category: "Equipment",
        cropTags: ["spraying", "sprayer", "pesticide application", "all crops"],
        price: 3500,
        unit: "packet",
        stock: 50,
        imageUrl: "/images/battery-sprayer.png",
        manufacturer: "Aspee",
        usage: "Charge fully before use. Mix chemicals in tank and use suitable nozzle for crop type.",
        benefits: ["Effortless spraying", "Continuous pressure", "Back padding for comfort", "Multiple nozzles included"],
        safetyPrecautions: ["Clean tank after every use", "Do not spray against wind", "Store in a shaded dry place"]
    },
    {
        name: "Manual Hand Compression Sprayer (2L)",
        description: "Compact hand sprayer for home gardens and small nurseries. Ideal for foliar spray and indoor plants.",
        category: "Equipment",
        cropTags: ["kitchen garden", "indoor plants", "nursery", "foliar spray"],
        price: 450,
        unit: "packet",
        stock: 150,
        imageUrl: "/images/hand-sprayer.png",
        manufacturer: "Garden Joy",
        usage: "Pump air to build pressure and press trigger for fine mist",
        benefits: ["Lightweight", "Durable plastic", "Adjustable spray pattern", "Easy to clean"],
        safetyPrecautions: ["Do not over-pressurize", "Release pressure after use"]
    },
    {
        name: "Premium Garden Trowel & Weeder Set",
        description: "Heavy-duty steel tools with ergonomic wooden handles. Perfect for planting seeds and removing weeds.",
        category: "Equipment",
        cropTags: ["digging", "planting", "weeding", "gardening tools"],
        price: 299,
        unit: "packet",
        stock: 200,
        imageUrl: "/images/trowel-set.png",
        manufacturer: "Falcon Tools",
        usage: "Use trowel for digging small holes and weeder for removing roots of weeds",
        benefits: ["Rust resistant", "Comfort grip", "Durable construction", "Essential for every gardener"],
        safetyPrecautions: ["Keep away from children", "Wipe clean after use to prevent rust"]
    },
    {
        name: "Drip Irrigation DIY Kit (50 Plants)",
        description: "Complete drip irrigation system for small farms and gardens. Saves 70% water and delivers nutrients directly to roots.",
        category: "Equipment",
        cropTags: ["irrigation", "water saving", "fertigation", "vegetables"],
        price: 1850,
        unit: "packet",
        stock: 30,
        imageUrl: "/images/drip-kit.png",
        manufacturer: "Jain Irrigation",
        usage: "Connect to main water source and lay pipes along the crop rows",
        benefits: ["Automated watering", "Zero water wastage", "Higher yield", "Easy to install"],
        safetyPrecautions: ["Check for clogs regularly", "Avoid sharp bends in pipes"]
    },
    {
        name: "Agriculture Soil pH & Moisture Meter",
        description: "3-in-1 tool to measure soil acidity, moisture level, and light intensity. No battery required.",
        category: "Equipment",
        cropTags: ["soil testing", "pH meter", "monitoring", "farming tools"],
        price: 650,
        unit: "packet",
        stock: 80,
        imageUrl: "/images/soil-meter.png",
        manufacturer: "Agri-Tech",
        usage: "Insert probes into soil near roots and read the scale after 1 minute",
        benefits: ["Accurate readings", "Portable", "Saves plants from over-watering", "Optimizes fertilizer use"],
        safetyPrecautions: ["Do not leave in soil for long periods", "Clean probes after use"]
    },
    {
        name: "Grass & Hedge Shears (Manual)",
        description: "Professional grade trimming shears with carbon steel blades for maintaining hedges and lawns.",
        category: "Equipment",
        cropTags: ["trimming", "landscaping", "hedging", "pruning"],
        price: 890,
        unit: "packet",
        stock: 60,
        imageUrl: "/images/hedge-shears.png",
        manufacturer: "SharpEdge",
        usage: "Keep blades aligned and use smooth cutting motion",
        benefits: ["Razor sharp", "Tension adjustment", "Shock absorbing bumper", "Long reach"],
        safetyPrecautions: ["Very sharp - handle with care", "Use safety lock when not in use"]
    },
    {
        name: "Seed Sowing Drill (Handheld)",
        description: "Lightweight tool for planting seeds at uniform depth and spacing. Reduces labor and seed wastage.",
        category: "Equipment",
        cropTags: ["sowing", "seeding", "uniform planting"],
        price: 1250,
        unit: "packet",
        stock: 40,
        imageUrl: "/images/seed-drill.png",
        manufacturer: "Krish-Tools",
        usage: "Fill with seeds and push along the furrow",
        benefits: ["Uniform germination", "Saves time", "Adjustable seed size", "Reduces back strain"],
        safetyPrecautions: ["Keep out of mud", "Oil moving parts occasionally"]
    },
    {
        name: "Nylon Net for Crop Protection (10m x 10m)",
        description: "Durable UV-stabilized nylon mesh to protect crops from birds, hailstorms, and large insects.",
        category: "Equipment",
        cropTags: ["protection", "birds", "hailstorm", "fencing"],
        price: 550,
        unit: "packet",
        stock: 120,
        imageUrl: "/images/crop-net.png",
        manufacturer: "Agro-Net",
        usage: "Stretch over support poles or directly over trees",
        benefits: ["High durability", "Sunlight transparent", "Easy to install", "Reusable for many seasons"],
        safetyPrecautions: ["Ensure tight fitting", "Keep away from fire"]
    }
];

async function seedEquipment() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        for (const product of equipmentAndTools) {
            const existing = await Product.findOne({ name: product.name });
            if (!existing) {
                await Product.create(product);
                console.log(`Added: ${product.name}`);
            } else {
                console.log(`Skipped (exists): ${product.name}`);
            }
        }

        console.log('Equipment seeding completed!');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
}

seedEquipment();
