import Product from '../models/Product.js';
import { getProductAdvice, getPriceIntelligence, enhanceSearchQuery, getGlobalMarketPrices } from '../services/geminiService.js';

// @desc    Get all products with filters
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
    try {
        const { category, search, minPrice, maxPrice, inStock } = req.query;

        let query = { isActive: true };

        // Category filter
        if (category) {
            query.category = category;
        }

        // Price range filter
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // Stock filter
        if (inStock === 'true') {
            query.stock = { $gt: 0 };
        }

        // Text search
        if (search) {
            query.$text = { $search: search };
        }

        const products = await Product.find(query).sort({ createdAt: -1 });

        res.json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch products'
        });
    }
};

// @desc    Semantic smart search
// @route   GET /api/products/search
// @access  Public
export const smartSearch = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        // Enhance search with AI
        const searchTerms = await enhanceSearchQuery(query);

        // Search products using enhanced terms
        const products = await Product.find({
            isActive: true,
            $or: [
                { cropTags: { $in: searchTerms } },
                { name: { $regex: searchTerms.join('|'), $options: 'i' } },
                { description: { $regex: searchTerms.join('|'), $options: 'i' } }
            ]
        }).limit(20);

        res.json({
            success: true,
            query: query,
            searchTerms: searchTerms,
            count: products.length,
            data: products
        });
    } catch (error) {
        console.error('Smart search error:', error);
        res.status(500).json({
            success: false,
            message: 'Search failed'
        });
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch product'
        });
    }
};

// @desc    Get AI product advice
// @route   POST /api/products/:id/advice
// @access  Public
export const getAIAdvice = async (req, res) => {
    try {
        const { cropType, soilType, season } = req.body;

        if (!cropType || !soilType || !season) {
            return res.status(400).json({
                success: false,
                message: 'Please provide cropType, soilType, and season'
            });
        }

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        const advice = await getProductAdvice(product, cropType, soilType, season);

        res.json({
            success: true,
            data: advice
        });
    } catch (error) {
        console.error('AI advice error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to get AI advice'
        });
    }
};

// @desc    Get price intelligence
// @route   GET /api/products/:id/price-intelligence
// @access  Public
export const getPriceAnalysis = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        const priceIntel = await getPriceIntelligence(product.name, product.price, product.category);

        res.json({
            success: true,
            data: priceIntel
        });
    } catch (error) {
        console.error('Price intelligence error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to get price intelligence'
        });
    }
};

// @desc    Create product (Admin only)
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);

        res.status(201).json({
            success: true,
            data: product,
            message: 'Product created successfully'
        });
    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to create product'
        });
    }
};

// @desc    Update product (Admin only)
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            data: product,
            message: 'Product updated successfully'
        });
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update product'
        });
    }
};

// @desc    Delete product (Admin only)
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete product'
        });
    }
};
// @desc    Get AI price suggestions based on global market (Admin only)
// @route   GET /api/products/admin/ai-price-suggestions
// @access  Private/Admin
export const getAIPriceSuggestions = async (req, res) => {
    try {
        const marketData = await getGlobalMarketPrices();

        // Get our current products to compare
        const currentProducts = await Product.find({ isActive: true });

        const suggestions = currentProducts.map(product => {
            // Find matching market price (simple name matching)
            const marketMatch = marketData.prices.find(p =>
                product.name.toLowerCase().includes(p.name.toLowerCase()) ||
                p.name.toLowerCase().includes(product.name.toLowerCase())
            );

            return {
                id: product._id,
                name: product.name,
                currentPrice: product.price,
                suggestedPrice: marketMatch ? marketMatch.market_price : product.price,
                marketInfo: marketData.source_insight,
                isUpdateRecommended: marketMatch && Math.abs(marketMatch.market_price - product.price) > 1
            };
        });

        res.json({
            success: true,
            data: suggestions,
            marketMetadata: {
                last_updated: marketData.last_updated,
                source: marketData.source_insight
            }
        });
    } catch (error) {
        console.error('AI Price Suggestion Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to get price suggestions'
        });
    }
};

// @desc    Apply AI price suggestions (Admin only)
// @route   POST /api/products/admin/apply-prices
// @access  Private/Admin
export const applyAIPriceSuggestions = async (req, res) => {
    try {
        const { updates } = req.body; // Array of { id, newPrice }

        if (!updates || !Array.isArray(updates)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid updates data'
            });
        }

        const bulkOps = updates.map(update => ({
            updateOne: {
                filter: { _id: update.id },
                update: { $set: { price: update.newPrice } }
            }
        }));

        await Product.bulkWrite(bulkOps);

        res.json({
            success: true,
            message: `Successfully updated ${updates.length} product prices`
        });
    } catch (error) {
        console.error('Apply AI prices error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to apply price updates'
        });
    }
};
