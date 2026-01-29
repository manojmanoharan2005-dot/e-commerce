import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const advancedAgriProducts = [
    {
        name: "Calcium Nitrate (Water Soluble)",
        description: "Excellent source of water-soluble calcium and nitrate nitrogen. Prevents blossom end rot and improves fruit shelf life.",
        category: "Chemical",
        cropTags: ["tomato", "apple", "potato", "chilli", "fruits"],
        price: 320,
        unit: "packet",
        stock: 450,
        imageUrl: "/images/calcium-nitrate.png",
        manufacturer: "YaraLiva",
        npkRatio: { nitrogen: 15.5, phosphorus: 0, potassium: 0 },
        composition: "Nitrogen 15.5%, Calcium 18.8%",
        usage: "Ideal for fertigation and foliar spray during fruit development",
        benefits: ["Stronger cell walls", "Reduces fruit cracking", "Better storage quality", "Fast nitrogen uptake"],
        safetyPrecautions: ["Highly hygroscopic - keep bag sealed", "Do not mix with sulphate fertilizers"]
    },
    {
        name: "Trichoderma Viride Bio-Fungicide",
        description: "Eco-friendly bio-fungicide that controls soil-borne diseases like root rot, wilt, and damping-off.",
        category: "Bio-Fertilizer",
        cropTags: ["all crops", "pulses", "oilseeds", "vegetables", "organic farming"],
        price: 180,
        unit: "packet",
        stock: 300,
        imageUrl: "/images/trichoderma.png",
        manufacturer: "Eco-Agro Lab",
        composition: "Trichoderma viride spores (2 x 10^6 CFU/g)",
        usage: "Mix with farmyard manure or use for seed treatment",
        benefits: ["Natural disease control", "Promotes plant growth", "Improves soil health", "Safe for beneficial insects"],
        safetyPrecautions: ["Do not use with chemical fungicides", "Store in a cool dry place"]
    },
    {
        name: "Beauveria Bassiana Bio-Pesticide",
        description: "Biological insecticide for controlling whiteflies, thrips, and aphids using natural fungal spores.",
        category: "Pesticide",
        cropTags: ["vegetables", "fruits", "cotton", "tobacco"],
        price: 210,
        unit: "packet",
        stock: 200,
        imageUrl: "/images/beauveria.png",
        manufacturer: "Nature Protect",
        composition: "Beauveria bassiana (1 x 10^8 CFU/g)",
        usage: "Spray 5g per liter of water on foliage during evening hours",
        benefits: ["Effective against sucking pests", "Zero chemical residue", "Safe for humans", "Organic certified"],
        safetyPrecautions: ["Avoid spraying during peak sunlight", "Use within 6 months of manufacture"]
    },
    {
        name: "Chilli Hybrid Seeds (High Pungency)",
        description: "F1 high-yielding chilli seeds. Produces long, dark green fruits that turn bright red on maturity.",
        category: "Seeds",
        cropTags: ["chilli", "pepper", "vegetables", "farming"],
        price: 85,
        unit: "packet",
        stock: 600,
        imageUrl: "/images/chilli-seeds.png",
        manufacturer: "VNR Seeds",
        usage: "Transplant 35-day old seedlings to the main field",
        benefits: ["Virus tolerant", "Uniform fruit size", "Very high heat", "Excellent for drying"],
        safetyPrecautions: ["Treated seeds - not for consumption", "Keep in cool storage"]
    },
    {
        name: "Onion Seeds (Nasik Red N-53)",
        description: "Premier onion variety for Kharif season. Deep red bulbs with excellent pungency and shelf life.",
        category: "Seeds",
        cropTags: ["onion", "vegetables", "staple crops"],
        price: 150,
        unit: "packet",
        stock: 400,
        imageUrl: "/images/onion-seeds.png",
        manufacturer: "Mahyco Seeds",
        usage: "Broadcasting in nursery beds; transplant after 6 weeks",
        benefits: ["Fast bulbing", "Uniform red color", "Good storage", "Traditional taste"],
        safetyPrecautions: ["Maintain consistent soil moisture for germination"]
    },
    {
        name: "Amino Acid Liquid Growth Stimulant",
        description: "Blend of 18 essential amino acids to boost protein synthesis and help plants overcome environmental stress.",
        category: "Bio-Fertilizer",
        cropTags: ["all crops", "horticulture", "floriculture"],
        price: 550,
        unit: "liter",
        stock: 150,
        imageUrl: "/images/amino-acid.png",
        manufacturer: "Nova Agri",
        composition: "Soy-protein based Amino Acids 20%",
        usage: "Foliar spray 2-3ml per liter of water during vegetative phase",
        benefits: ["Better photosynthesis", "Stress recovery", "Increases chlorophyll", "Boosts yields"],
        safetyPrecautions: ["Shake well before use", "Non-toxic", "Store away from sun"]
    },
    {
        name: "Dolomite Powder (Soil pH Balancer)",
        description: "Natural mineral powder that reduces soil acidity and provides essential Calcium and Magnesium.",
        category: "Organic",
        cropTags: ["all crops", "tea", "coffee", "rubber"],
        price: 250,
        unit: "bag",
        stock: 500,
        imageUrl: "/images/dolomite.png",
        manufacturer: "Earth Minerals",
        composition: "Calcium Carbonate, Magnesium Carbonate",
        usage: "Mix into soil before planting (500kg per acre for acidic soils)",
        benefits: ["Corrects soil pH", "Provides Magnesium", "Improves P-uptake", "Non-toxic"],
        safetyPrecautions: ["Avoid inhaling dust during application"]
    },
    {
        name: "Ferrous Sulphate (Iron Fertilizer)",
        description: "19% Water soluble Iron to treat chlorosis (leaf yellowing) and improve oxygen transport in plants.",
        category: "Chemical",
        cropTags: ["rice", "sugarcane", "lawn", "citrus", "all crops"],
        price: 95,
        unit: "packet",
        stock: 350,
        imageUrl: "/images/ferrous-sulphate.png",
        manufacturer: "Micro nutrients Ltd",
        composition: "Iron (Fe) 19%",
        usage: "Spray 5g per liter or soil application (10kg per acre)",
        benefits: ["Cures yellow leaves", "Improves photosynthesis", "Increases grain yield", "Essential for greening"],
        safetyPrecautions: ["May stain concrete/tiles", "Store in dry place"]
    },
    {
        name: "Fulvic Acid (90% Pure Powder)",
        description: "Highly active organic molecules that act as a natural chelating agent, making micro-nutrients highly available.",
        category: "Organic",
        cropTags: ["all crops", "hydroponics", "polyhouse"],
        price: 650,
        unit: "packet",
        stock: 120,
        imageUrl: "/images/fulvic-acid.png",
        manufacturer: "High-Peak Organics",
        composition: "Fulvic Acid 90%",
        usage: "Soluble in water for foliar spray or drip irrigation (1g per 2 liters)",
        benefits: ["Extreme nutrient uptake", "Improves seed germination", "Natural chelator", "Works in all pH levels"],
        safetyPrecautions: ["Always keep in moisture-proof packaging"]
    },
    {
        name: "Brinjal Hybrid Seeds (Purple Long)",
        description: "Superior hybrid eggplant seeds. Produces shiny purple, long fruits with fewer seeds.",
        category: "Seeds",
        cropTags: ["brinjal", "eggplant", "vegetables"],
        price: 55,
        unit: "packet",
        stock: 750,
        imageUrl: "/images/brinjal-seeds.png",
        manufacturer: "Ankur Seeds",
        usage: "Ready to harvest in 65-70 days after transplanting",
        benefits: ["High yielding", "Tasty fruits", "Tolerance to fruit borer", "Attractive color"],
        safetyPrecautions: ["Do not keep packets open in high humidity"]
    }
];

async function seedAdvancedProducts() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        for (const product of advancedAgriProducts) {
            const existing = await Product.findOne({ name: product.name });
            if (!existing) {
                await Product.create(product);
                console.log(`Added: ${product.name}`);
            } else {
                console.log(`Skipped (exists): ${product.name}`);
            }
        }

        console.log('Advanced seeding completed!');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
}

seedAdvancedProducts();
