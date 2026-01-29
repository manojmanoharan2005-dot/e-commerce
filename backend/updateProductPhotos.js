import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const categoryImages = {
    'Chemical': 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?q=80&w=800&auto=format&fit=crop',
    'Organic': 'https://images.unsplash.com/photo-1585314297833-28688432ce6f?q=80&w=800&auto=format&fit=crop',
    'Bio-Fertilizer': 'https://images.unsplash.com/photo-1599591037488-348df876368d?q=80&w=800&auto=format&fit=crop',
    'Pesticide': 'https://images.unsplash.com/photo-1581447100595-3aef98428670?q=80&w=800&auto=format&fit=crop',
    'Seeds': 'https://images.unsplash.com/photo-1592150621344-796500aa1a24?q=80&w=800&auto=format&fit=crop',
    'Equipment': 'https://images.unsplash.com/photo-1589923188900-85dae523342b?q=80&w=800&auto=format&fit=crop',
    'Tools': 'https://images.unsplash.com/photo-1589923188900-85dae523342b?q=80&w=800&auto=format&fit=crop'
};

const specificImages = {
    'Urea Fertilizer (46-0-0)': 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?q=80&w=800&auto=format&fit=crop',
    'DAP (Diammonium Phosphate)': 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?q=80&w=800&auto=format&fit=crop',
    'Hybrid Tomato Seeds': 'https://images.unsplash.com/photo-1592150621344-796500aa1a24?q=80&w=800&auto=format&fit=crop',
    'Battery Operated Knapsack Sprayer (16L)': 'https://images.unsplash.com/photo-1589923188900-85dae523342b?q=80&w=800&auto=format&fit=crop',
    'Neem Oil Organic Pesticide': 'https://images.unsplash.com/photo-1581447100595-3aef98428670?q=80&w=800&auto=format&fit=crop'
};

async function updatePhotos() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const products = await Product.find({});
        console.log(`Found ${products.length} products to update.`);

        for (const product of products) {
            let newImageUrl = categoryImages[product.category] || categoryImages['Chemical'];

            // Check if there's a specific image for this product name
            if (specificImages[product.name]) {
                newImageUrl = specificImages[product.name];
            }

            product.imageUrl = newImageUrl;
            await product.save();
        }

        console.log('All product photos updated successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Update failed:', error);
        process.exit(1);
    }
}

updatePhotos();
