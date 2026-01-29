import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Product description is required']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['Organic', 'Chemical', 'Bio-Fertilizer', 'Pesticide', 'Seeds', 'Equipment']
    },
    cropTags: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    mrp: {
        type: Number,
        min: [0, 'MRP cannot be negative']
    },
    isTrending: {
        type: Boolean,
        default: false
    },
    isFlashSale: {
        type: Boolean,
        default: false
    },
    unit: {
        type: String,
        default: 'kg',
        enum: ['kg', 'liter', 'bag', 'packet']
    },
    stock: {
        type: Number,
        required: [true, 'Stock is required'],
        min: [0, 'Stock cannot be negative'],
        default: 0
    },
    imageUrl: {
        type: String,
        default: '/images/default-fertilizer.jpg'
    },
    manufacturer: {
        type: String,
        trim: true
    },
    npkRatio: {
        nitrogen: Number,
        phosphorus: Number,
        potassium: Number
    },
    composition: String,
    usage: String,
    benefits: [String],
    safetyPrecautions: [String],
    isActive: {
        type: Boolean,
        default: true
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviewCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for search optimization
productSchema.index({ name: 'text', description: 'text', cropTags: 'text' });

const Product = mongoose.model('Product', productSchema);

export default Product;
