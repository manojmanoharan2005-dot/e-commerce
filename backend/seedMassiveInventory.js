import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const massiveCatalog = [
    // --- SEEDS CATEGORY ---
    {
        name: "Hybrid Cucumber Seeds (Green Long)",
        description: "High-yielding, heat-tolerant cucumber seeds. Produces crisp, non-bitter fruits.",
        category: "Seeds",
        cropTags: ["cucumber", "vegetables", "summer crops"],
        price: 75, unit: "packet", stock: 1000,
        imageUrl: "/images/cucumber-seeds.png", manufacturer: "Mahyco",
        benefits: ["Heat tolerant", "Crisp texture", "Early harvest"],
        usage: "Sow directly in pits at 2-3 feet spacing."
    },
    {
        name: "Watermelon F1 Seeds (Sugar Queen)",
        description: "Produces large, sweet watermelons with deep red flesh and high sugar content.",
        category: "Seeds",
        cropTags: ["watermelon", "fruits", "summer crops"],
        price: 130, unit: "packet", stock: 500,
        imageUrl: "/images/watermelon-seeds.png", manufacturer: "VNR Seeds",
        benefits: ["Very sweet", "High yield", "Good transportability"],
        usage: "Best grown in sandy loam soil with plenty of sun."
    },
    {
        name: "Papaya Hybrid Hybrid Seeds (Red Lady 786)",
        description: "Self-pollinating dwarf variety. Produces large fruits with thick red flesh.",
        category: "Seeds",
        cropTags: ["papaya", "fruits", "plantation"],
        price: 450, unit: "packet", stock: 300,
        imageUrl: "/images/papaya-seeds.png", manufacturer: "Known-You",
        benefits: ["Early fruiting", "High yield", "Virus tolerant"],
        usage: "Sow in seedling trays and transplant after 45 days."
    },
    {
        name: "Sunflower Seeds (High Oil Hybrid)",
        description: "Commercial variety with high oil content and large flower heads.",
        category: "Seeds",
        cropTags: ["sunflower", "oilseeds", "commercial crops"],
        price: 550, unit: "kg", stock: 400,
        imageUrl: "/images/sunflower-seeds.png", manufacturer: "Syngenta",
        benefits: ["High oil content", "Drought resistant", "Short duration"],
        usage: "Sow in rows with 45cm spacing."
    },
    {
        name: "Wheat Seeds (HD 2967 Variety)",
        description: "Popular high-yielding wheat variety suitable for Indian climates. Resistant to yellow rust.",
        category: "Seeds",
        cropTags: ["wheat", "cereals", "staple crops"],
        price: 1800, unit: "bag", stock: 100,
        imageUrl: "/images/wheat-seeds.png", manufacturer: "National Seeds Corp",
        benefits: ["Rust resistant", "High protein", "Excellent harvest"],
        usage: "Sow during November-December for best results."
    },

    // --- EQUIPMENT & TOOLS ---
    {
        name: "Heavy Duty Digging Shovel",
        description: "Tempered steel blade with a long reinforced handle. Ideal for hard soil.",
        category: "Equipment",
        cropTags: ["digging", "soil work", "tools"],
        price: 750, unit: "packet", stock: 80,
        imageUrl: "/images/shovel.png", manufacturer: "Agri-Edge",
        benefits: ["Rust proof", "Ergonomic design", "Unbreakable handle"]
    },
    {
        name: "Professional Pruning Saw",
        description: "Curved blade saw for pruning thick tree branches. Triple-cut teeth for smooth cutting.",
        category: "Equipment",
        cropTags: ["pruning", "trees", "orchard care"],
        price: 480, unit: "packet", stock: 120,
        imageUrl: "/images/pruning-saw.png", manufacturer: "Falcon",
        benefits: ["Fast cutting", "Folds for safety", "Resharpenable"]
    },
    {
        name: "Seedling Starter Trays (98 Cavity)",
        description: "Reusable plastic trays for germinating seeds. Provides uniform root growth.",
        category: "Equipment",
        cropTags: ["nursery", "germination", "seedlings"],
        price: 25, unit: "packet", stock: 2000,
        imageUrl: "/images/seedling-tray.png", manufacturer: "Eco-Grow",
        benefits: ["Reusable", "Easy transplanting", "Efficient space use"]
    },
    {
        name: "Black Mulching Sheet (25 Micron, 400m)",
        description: "Standard mulching film to prevent weed growth and conserve soil moisture.",
        category: "Equipment",
        cropTags: ["mulching", "weed control", "water conservation"],
        price: 2450, unit: "bag", stock: 25,
        imageUrl: "/images/mulch-sheet.png", manufacturer: "Plasto-Agri",
        benefits: ["UV protected", "Weed suppression", "Better root zone temp"]
    },
    {
        name: "Adjustable Garden Rake (12 Tine)",
        description: "Expandable metal rake for gathering leaves and leveling soil beds.",
        category: "Equipment",
        cropTags: ["leveling", "cleaning", "garden care"],
        price: 350, unit: "packet", stock: 150,
        imageUrl: "/images/rake.png", manufacturer: "Garden Master",
        benefits: ["Adjustable width", "Lightweight", "Durable tines"]
    },

    // --- ORGANIC & BIO-FERTILIZERS ---
    {
        name: "Seaweed Granules (Zyme Plus)",
        description: "Granular form of seaweed extract. Easy to apply by broadcasting in the field.",
        category: "Organic",
        cropTags: ["all crops", "soil conditioner", "growth booster"],
        price: 650, unit: "bag", stock: 300,
        imageUrl: "/images/seaweed-granules.png", manufacturer: "Coromandel",
        benefits: ["Slow release", "Improves soil texture", "Increases flowering"]
    },
    {
        name: "Waste Decomposer (Original Culture)",
        description: "Bacterial culture that helps in fast decomposition of organic waste and crop residue.",
        category: "Bio-Fertilizer",
        cropTags: ["composting", "waste management", "organic farming"],
        price: 20, unit: "packet", stock: 1000,
        imageUrl: "/images/waste-decomposer.png", manufacturer: "National Centre of Organic Farming",
        benefits: ["Converts waste to gold", "Cheap and effective", "Improves soil organic carbon"],
        usage: "Dissolve in water with jaggery and ferment for 7 days."
    },
    {
        name: "Fish Amino Acid (Concentrated)",
        description: "Home-brewed style ferment containing proteins and nitrogen. Excellent for foliar spray.",
        category: "Organic",
        cropTags: ["all vegetables", "fruits", "growth stimulant"],
        price: 450, unit: "liter", stock: 150,
        imageUrl: "/images/fish-amino.png", manufacturer: "Green Earth Organics",
        benefits: ["Rich in NPK", "Fast leaf absorption", "Increases pest resistance"]
    },
    {
        name: "Metarhizium Anisopliae (Bio-Pesticide)",
        description: "Fungal bio-pesticide that specifically targets white grubs and termites in soil.",
        category: "Bio-Fertilizer",
        cropTags: ["sugar cane", "groundnut", "soil pests"],
        price: 280, unit: "packet", stock: 250,
        imageUrl: "/images/metarhizium.png", manufacturer: "Bio-Guard",
        benefits: ["Targets specific pests", "No harm to soil", "Organic safe"]
    },

    // --- CHEMICAL FERTILIZERS ---
    {
        name: "Potassium Sulphate (SOP 00-00-50)",
        description: "Premium chloride-free potassium fertilizer. Ideal for salt-sensitive crops like Tobacco and Grapes.",
        category: "Chemical",
        cropTags: ["grapes", "tobacco", "citrus", "fruits"],
        price: 1250, unit: "bag", stock: 200,
        imageUrl: "/images/sop-00-50.png", manufacturer: "IPL",
        benefits: ["Chloride free", "Increases sugar", "Better fruit color"],
        npkRatio: { nitrogen: 0, phosphorus: 0, potassium: 50 }
    },
    {
        name: "Mono Ammonium Phosphate (MAP 12-61-00)",
        description: "100% water soluble phosphorus fertilizer for early plant development.",
        category: "Chemical",
        cropTags: ["start phase", "root growth", "fertigation"],
        price: 150, unit: "packet", stock: 400,
        imageUrl: "/images/map-12-61.png", manufacturer: "Zuari",
        benefits: ["High phosphorus", "Quick root start", "Low pH"]
    },
    {
        name: "Anhydrous Magnesium Sulphate (99%)",
        description: "Highly pure magnesium source for treating foliage yellowing in high-value horticulture.",
        category: "Chemical",
        cropTags: ["horticulture", "polyhouse", "flowers"],
        price: 65, unit: "kg", stock: 1000,
        imageUrl: "/images/magnesium-sulphate.png", manufacturer: "Tata Chemicals",
        benefits: ["Fast correction", "Crystal clear solubility", "Essential for chlorophyll"]
    },
    {
        name: "Borax (Sodium Tetraborate Decahydrate)",
        description: "Essential boron source for preventing heart rot and improving flower fertilization.",
        category: "Chemical",
        cropTags: ["all crops", "boron source", "micronutrient"],
        price: 180, unit: "kg", stock: 500,
        imageUrl: "/images/borax.png", manufacturer: "Borax India",
        benefits: ["Standard boron", "Prevents fruit rot", "Better pollination"]
    }
];

// Generative additions for massive catalog expansion
const generatedNames = [
    "Spinach Seeds (All Season)", "Radish White Long Seeds", "Carrot Red Kuroda Seeds",
    "Pea Seeds (GS-10 Variety)", "Bottle Gourd Hybrid Seeds", "Bitter Gourd F1 Seeds",
    "Pressure Sprayer (5L)", "Fruit Picker with Net", "Garden Secateur", "Pruning Knife",
    "Zinc EDTA 12%", "Copper EDTA 15%", "Manganese EDTA 13%", "Solubor (Boron 20%)",
    "Verticillium Lecanii (Bio-Insecticide)", "Paecilomyces (Bio-Nematicide)", "Sudomonas Fluorescens",
    "Panchagavya Organic Liquid", "Jeevamrutha Dry Powder", "Bone Dust (Fine)"
];

const generatedProducts = generatedNames.map((name, index) => {
    let cat = "Seeds";
    if (name.includes("Sprayer") || name.includes("Picker") || name.includes("Secateur") || name.includes("Knife")) cat = "Equipment";
    if (name.includes("EDTA") || name.includes("Solubor")) cat = "Chemical";
    if (name.includes("Bio-") || name.includes("Sudomonas")) cat = "Bio-Fertilizer";
    if (name.includes("Organic") || name.includes("Jeevamrutha") || name.includes("Dust")) cat = "Organic";

    return {
        name,
        description: `Premium quality ${name} for professional agricultural use. Reliable and tested for high performance.`,
        category: cat,
        cropTags: [name.split(' ')[0].toLowerCase(), "agriculture", "farming"],
        price: (Math.floor(Math.random() * 50) + 1) * 10,
        unit: cat === "Equipment" ? "packet" : "packet",
        stock: Math.floor(Math.random() * 500) + 50,
        imageUrl: `/images/${name.toLowerCase().replace(/ /g, '-')}.png`,
        manufacturer: "Agri-Solutions",
        benefits: ["Reliable performance", "Tested quality", "High efficiency"],
        usage: "Follow instructions on the package for best results."
    };
});

const totalNewProducts = [...massiveCatalog, ...generatedProducts];

async function seedMassiveInventory() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        let addedCount = 0;
        let skippedCount = 0;

        for (const product of totalNewProducts) {
            const existing = await Product.findOne({ name: product.name });
            if (!existing) {
                await Product.create(product);
                addedCount++;
            } else {
                skippedCount++;
            }
        }

        console.log(`Massive seeding completed!`);
        console.log(`Added: ${addedCount} products`);
        console.log(`Skipped: ${skippedCount} items (already exist)`);
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
}

seedMassiveInventory();
