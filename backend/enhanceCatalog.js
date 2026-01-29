import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

async function enhanceProducts() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const products = await Product.find({});
        console.log(`Enhancing ${products.length} products...`);

        for (const product of products) {
            // Give every product a discount (MRP > Price)
            // MRP will be roughly 15-35% higher than Price
            const discountPercent = 15 + Math.floor(Math.random() * 20);
            product.mrp = Math.ceil(product.price * (1 + discountPercent / 100));

            // Small chance to be Trending or Flash Sale
            product.isTrending = Math.random() > 0.8;
            product.isFlashSale = Math.random() > 0.9;

            // Give some products higher ratings to look more "additive"
            if (product.rating === 0) {
                product.rating = (3.5 + Math.random() * 1.5).toFixed(1);
                product.reviewCount = Math.floor(Math.random() * 500) + 50;
            }

            // Ensure stock is interesting (low stock creates urgency)
            if (Math.random() > 0.7) {
                product.stock = Math.floor(Math.random() * 10) + 1; // 1 to 10 items
            }

            await product.save();
        }

        console.log('Successfully enhanced products with discounts, ratings, and marketing flags!');
        process.exit(0);
    } catch (error) {
        console.error('Enhancement failed:', error);
        process.exit(1);
    }
}

enhanceProducts();
