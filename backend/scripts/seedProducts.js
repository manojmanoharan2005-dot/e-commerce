import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import User from '../models/User.js';

dotenv.config();

const sampleProducts = [
    {
        name: 'Urea Fertilizer (46-0-0)',
        description: 'High nitrogen content fertilizer ideal for leafy crops and paddy cultivation. Promotes vigorous vegetative growth.',
        category: 'Chemical',
        cropTags: ['paddy', 'rice', 'wheat', 'maize', 'sugarcane', 'vegetables'],
        price: 280,
        mrp: 350,
        isTrending: true,
        isFlashSale: true,
        unit: 'bag',
        stock: 500,
        imageUrl: '/images/urea.png',
        manufacturer: 'Indian Farmers Fertiliser Cooperative',
        npkRatio: { nitrogen: 46, phosphorus: 0, potassium: 0 },
        composition: '46% Nitrogen',
        usage: 'Apply 2-3 weeks after sowing for best results',
        benefits: ['Promotes leaf growth', 'Increases crop yield', 'Quick nitrogen source', 'Cost-effective'],
        safetyPrecautions: ['Wear gloves during application', 'Store in dry place', 'Keep away from children', 'Avoid direct contact with skin'],
        rating: 4.5,
        reviewCount: 234
    },
    {
        name: 'DAP (Diammonium Phosphate)',
        description: 'Excellent phosphorus source for root development. Perfect for all crops during initial growth stages.',
        category: 'Chemical',
        cropTags: ['wheat', 'paddy', 'cotton', 'pulses', 'oilseeds', 'vegetables'],
        price: 1350,
        mrp: 1600,
        isTrending: true,
        isFlashSale: false,
        unit: 'bag',
        stock: 300,
        imageUrl: '/images/dap.png',
        manufacturer: 'Coromandel International',
        npkRatio: { nitrogen: 18, phosphorus: 46, potassium: 0 },
        composition: '18% Nitrogen, 46% Phosphorus',
        usage: 'Apply as basal dose before sowing',
        benefits: ['Strong root development', 'Early plant vigor', 'Improves flowering', 'Enhances grain quality'],
        safetyPrecautions: ['Use protective gear', 'Avoid inhalation', 'Store in cool, dry place', 'Keep away from water sources'],
        rating: 4.7,
        reviewCount: 456
    },
    {
        name: 'NPK 10-26-26 Complex Fertilizer',
        description: 'Balanced fertilizer for overall plant nutrition. Ideal for fruit-bearing crops and vegetables.',
        category: 'Chemical',
        cropTags: ['tomato', 'potato', 'chilli', 'cotton', 'fruits', 'vegetables'],
        price: 950,
        mrp: 1200,
        isTrending: true,
        isFlashSale: true,
        unit: 'bag',
        stock: 400,
        imageUrl: '/images/npk.png',
        manufacturer: 'Tata Chemicals',
        npkRatio: { nitrogen: 10, phosphorus: 26, potassium: 26 },
        composition: '10% Nitrogen, 26% Phosphorus, 26% Potassium',
        usage: 'Apply at flowering and fruiting stages',
        benefits: ['Balanced nutrition', 'Improves fruit quality', 'Increases yield', 'Disease resistance'],
        safetyPrecautions: ['Wear mask and gloves', 'Avoid contact with eyes', 'Store away from food items', 'Wash hands after use'],
        rating: 4.6,
        reviewCount: 189
    },
    {
        name: 'Vermicompost Organic Fertilizer',
        description: '100% organic fertilizer made from earthworm castings. Rich in nutrients and beneficial microorganisms.',
        category: 'Organic',
        cropTags: ['vegetables', 'fruits', 'flowers', 'organic farming', 'kitchen garden'],
        price: 450,
        mrp: 550,
        isTrending: true,
        isFlashSale: true,
        unit: 'bag',
        stock: 250,
        imageUrl: '/images/vermicompost.png',
        manufacturer: 'Organic India',
        composition: 'Organic matter, NPK, micronutrients, beneficial bacteria',
        usage: 'Mix with soil before planting or use as top dressing',
        benefits: ['Improves soil structure', '100% organic', 'Enhances water retention', 'Promotes beneficial microbes', 'Safe for all crops'],
        safetyPrecautions: ['Non-toxic', 'Safe to handle', 'Store in dry place', 'Keep away from direct sunlight'],
        rating: 4.8,
        reviewCount: 567
    },
    {
        name: 'Neem Cake Organic Fertilizer',
        description: 'Natural pest repellent and organic fertilizer. Protects plants while providing nutrition.',
        category: 'Organic',
        cropTags: ['vegetables', 'fruits', 'cotton', 'organic farming', 'pest control'],
        price: 380,
        mrp: 450,
        isTrending: false,
        isFlashSale: true,
        unit: 'bag',
        stock: 350,
        imageUrl: '/images/neem-cake.png',
        manufacturer: 'Neem India',
        composition: 'Neem seed residue, NPK 4-1-2',
        usage: 'Apply to soil 2-3 weeks before sowing',
        benefits: ['Natural pest control', 'Organic nutrition', 'Improves soil health', 'Reduces nematodes', 'Eco-friendly'],
        safetyPrecautions: ['Safe for organic farming', 'Non-toxic to humans', 'Store in dry place', 'Keep away from pets'],
        rating: 4.4,
        reviewCount: 298
    },
    {
        name: 'Azospirillum Bio-Fertilizer',
        description: 'Nitrogen-fixing bacteria for sustainable agriculture. Reduces chemical fertilizer dependency.',
        category: 'Bio-Fertilizer',
        cropTags: ['paddy', 'wheat', 'maize', 'sugarcane', 'millets', 'organic farming'],
        price: 120,
        mrp: 180,
        isTrending: true,
        isFlashSale: false,
        unit: 'packet',
        stock: 600,
        imageUrl: '/images/azospirillum.png',
        manufacturer: 'Bio-Tech Solutions',
        composition: 'Azospirillum bacteria culture (10^8 CFU/ml)',
        usage: 'Mix with seeds before sowing or apply to soil',
        benefits: ['Fixes atmospheric nitrogen', 'Reduces fertilizer cost', 'Eco-friendly', 'Improves soil fertility', 'Sustainable farming'],
        safetyPrecautions: ['Store in cool place', 'Use before expiry', 'Avoid direct sunlight', 'Keep refrigerated'],
        rating: 4.3,
        reviewCount: 145
    },
    {
        name: 'Potash (Muriate of Potash)',
        description: 'High potassium fertilizer for fruit and tuber crops. Improves crop quality and disease resistance.',
        category: 'Chemical',
        cropTags: ['potato', 'banana', 'sugarcane', 'fruits', 'vegetables', 'tubers'],
        price: 850,
        mrp: 1000,
        isTrending: true,
        isFlashSale: true,
        unit: 'bag',
        stock: 280,
        imageUrl: '/images/potash.png',
        manufacturer: 'Hindusthan Zinc',
        npkRatio: { nitrogen: 0, phosphorus: 0, potassium: 60 },
        composition: '60% Potassium',
        usage: 'Apply during tuber formation and fruit development',
        benefits: ['Improves fruit quality', 'Enhances disease resistance', 'Better storage quality', 'Increases sugar content'],
        safetyPrecautions: ['Wear protective gear', 'Avoid inhalation', 'Store in dry place', 'Keep away from children', 'Avoid direct contact with skin'],
        rating: 4.5,
        reviewCount: 223
    },
    {
        name: 'Zinc Sulphate Micronutrient',
        description: 'Essential micronutrient for paddy and wheat. Prevents zinc deficiency and improves yield.',
        category: 'Chemical',
        cropTags: ['paddy', 'rice', 'wheat', 'maize', 'pulses'],
        price: 95,
        mrp: 150,
        isTrending: false,
        isFlashSale: false,
        unit: 'kg',
        stock: 450,
        imageUrl: '/images/zinc-sulphate.png',
        manufacturer: 'Micronutrients India',
        composition: '21% Zinc',
        usage: 'Apply 10-12 kg per acre as basal dose',
        benefits: ['Prevents zinc deficiency', 'Improves grain quality', 'Increases yield', 'Better plant growth'],
        safetyPrecautions: ['Use as recommended', 'Avoid overdose', 'Store in dry place', 'Keep away from children'],
        rating: 4.2,
        reviewCount: 167
    },
    {
        name: 'Seaweed Extract Liquid Fertilizer',
        description: 'Natural growth promoter and stress reliever. Rich in plant hormones and micronutrients.',
        category: 'Organic',
        cropTags: ['vegetables', 'fruits', 'flowers', 'organic farming', 'hydroponics'],
        price: 550,
        mrp: 680,
        isTrending: true,
        isFlashSale: true,
        unit: 'liter',
        stock: 200,
        imageUrl: '/images/seaweed.png',
        manufacturer: 'Ocean Nutrients',
        composition: 'Seaweed extract, plant hormones, micronutrients',
        usage: 'Dilute and spray on leaves every 15 days',
        benefits: ['Promotes growth', 'Stress tolerance', 'Improves flowering', 'Organic solution', 'Boosts immunity'],
        safetyPrecautions: ['Non-toxic', 'Safe for organic farming', 'Store in cool place', 'Shake well before use'],
        rating: 4.7,
        reviewCount: 312
    },
    {
        name: 'Gypsum (Calcium Sulphate)',
        description: 'Soil conditioner and calcium source. Improves soil structure and reduces salinity.',
        category: 'Chemical',
        cropTags: ['groundnut', 'cotton', 'sugarcane', 'vegetables', 'saline soils'],
        price: 320,
        mrp: 400,
        isTrending: false,
        isFlashSale: false,
        unit: 'bag',
        stock: 380,
        imageUrl: '/images/gypsum.png',
        manufacturer: 'Soil Health Products',
        composition: '18% Calcium, 14% Sulphur',
        usage: 'Apply before sowing or as top dressing',
        benefits: ['Improves soil structure', 'Reduces salinity', 'Provides calcium', 'Better water infiltration'],
        safetyPrecautions: ['Safe to handle', 'Avoid dust inhalation', 'Store in dry place', 'Non-toxic'],
        rating: 4.1,
        reviewCount: 134
    }
];

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error);
        process.exit(1);
    }
};

const seedDatabase = async () => {
    try {
        await connectDB();

        // Clear existing products
        await Product.deleteMany({});
        console.log('🗑️  Cleared existing products');

        // Insert sample products
        const products = await Product.insertMany(sampleProducts);
        console.log(`✅ Inserted ${products.length} sample products`);

        // Create admin user if doesn't exist
        const adminExists = await User.findOne({ email: 'admin@fertilizer.com' });
        if (!adminExists) {
            await User.create({
                name: 'Admin User',
                email: 'admin@fertilizer.com',
                password: 'admin123',
                role: 'admin',
                phone: '9876543210'
            });
            console.log('✅ Created admin user (admin@fertilizer.com / admin123)');
        }

        // Create sample farmer user
        const farmerExists = await User.findOne({ email: 'farmer@test.com' });
        if (!farmerExists) {
            await User.create({
                name: 'Test Farmer',
                email: 'farmer@test.com',
                password: 'farmer123',
                role: 'farmer',
                phone: '9123456780',
                address: {
                    street: 'Village Road',
                    city: 'Pune',
                    state: 'Maharashtra',
                    pincode: '411001'
                }
            });
            console.log('✅ Created farmer user (farmer@test.com / farmer123)');
        }

        console.log('\n🎉 Database seeded successfully!');
        console.log('\n📝 Test Credentials:');
        console.log('Admin: admin@fertilizer.com / admin123');
        console.log('Farmer: farmer@test.com / farmer123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
};

seedDatabase();
