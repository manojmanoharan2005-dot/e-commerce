import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

// A large collection of high-quality agricultural Unsplash IDs
const ids = {
    'Chemical': [
        '1628352081506-83c43123ed6d', '1615811361523-dbd00d1c2ed4', '1563514227147-6d2ff665a6a0',
        '1624701633537-83c5a6a0a0a0', '1585314062332-d62865a0f69a', '1523348830342-d0187cf0c332',
        '1581447100595-3aef98428670', '1611843467160-25afb8df1074'
    ],
    'Organic': [
        '1585314297833-28688432ce6f', '1464241353125-b305867f1851', '1592419044706-39796d40f98c',
        '1599591037488-348df876368d', '1558449028-569cc05a8cc3', '1592150621344-796500aa1a24',
        '1601379327928-3f59a403487f', '1445014371232-9ea35359990c'
    ],
    'Bio-Fertilizer': [
        '1599591037488-348df876368d', '1615024479549-335198089400', '1515150144380-4ce9a944a958',
        '1563514227147-6d2ff665a6a0', '1591857177580-dc32d7abc497'
    ],
    'Pesticide': [
        '1581447100595-3aef98428670', '1591857177580-dc32d7abc497', '1584622650111-993a426fbf0a',
        '1585314062332-d62865a0f69a', '1576086213369-97a306dca664'
    ],
    'Seeds': [
        '1592150621344-796500aa1a24', '1605000797499-95a51c5569ae', '1523348830342-d0187cf0c332',
        '1595113316349-9fa4eb24f884', '1591946614421-1d5794bc5aba', '1592419044706-39796d40f98c'
    ],
    'Equipment': [
        '1589923188900-85dae523342b', '1595113316349-9fa4eb24f884', '1586771107445-d3ca888129ff',
        '1589923151478-435728a05c31', '1574943320219-553fe213f712'
    ]
};

async function updateUniquePhotos() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const products = await Product.find({});
        console.log(`Updating ${products.length} products...`);

        // Use a counter per category to distribute images
        const counters = {};
        Object.keys(ids).forEach(cat => counters[cat] = 0);

        for (const product of products) {
            const category = product.category || 'Chemical';
            const categoryIds = ids[category] || ids['Chemical'];

            // Pick an ID based on counter
            const imageId = categoryIds[counters[category] % categoryIds.length];

            // Build a very simple clean URL
            product.imageUrl = `https://images.unsplash.com/photo-${imageId}?auto=format&fit=crop&q=80&w=600`;

            await product.save();

            // Advance counter for this category
            counters[category]++;
        }

        console.log('Successfully updated all products with unique-ish photos!');
        process.exit(0);
    } catch (error) {
        console.error('Update failed:', error);
        process.exit(1);
    }
}

updateUniquePhotos();
