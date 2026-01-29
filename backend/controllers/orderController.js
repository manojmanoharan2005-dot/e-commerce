import Order from '../models/Order.js';
import Product from '../models/Product.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
    try {
        const { items, shippingAddress, paymentMethod, notes } = req.body;

        // CHECK: Admin should not be able to order
        if (req.user.role === 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Admins are not allowed to place orders. Please use a customer account.'
            });
        }

        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No items in order'
            });
        }

        // Calculate total and validate stock
        let totalAmount = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Product.findById(item.productId);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product ${item.productId} not found`
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.name}`
                });
            }

            const subtotal = product.price * item.quantity;
            totalAmount += subtotal;

            orderItems.push({
                productId: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
                subtotal: subtotal
            });

            // Update stock
            product.stock -= item.quantity;
            await product.save();
        }

        // Create order
        const order = await Order.create({
            userId: req.user._id,
            items: orderItems,
            totalAmount,
            shippingAddress,
            paymentMethod: paymentMethod || 'COD',
            notes
        });

        res.status(201).json({
            success: true,
            data: order,
            message: 'Order placed successfully'
        });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create order'
        });
    }
};

// @desc    Get user orders
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id })
            .populate('items.productId', 'name imageUrl')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        console.error('Get my orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders'
        });
    }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
    try {
        const { status, startDate, endDate } = req.query;

        let query = {};

        if (status) {
            query.status = status;
        }

        if (startDate || endDate) {
            query.orderDate = {};
            if (startDate) query.orderDate.$gte = new Date(startDate);
            if (endDate) query.orderDate.$lte = new Date(endDate);
        }

        const orders = await Order.find(query)
            .populate('userId', 'name email phone')
            .populate('items.productId', 'name imageUrl')
            .sort({ createdAt: -1 });

        // Calculate statistics
        const stats = {
            totalOrders: orders.length,
            totalRevenue: orders
                .filter(o => o.status !== 'cancelled')
                .reduce((sum, order) => sum + order.totalAmount, 0),
            pendingOrders: orders.filter(o => o.status === 'pending').length,
            completedOrders: orders.filter(o => o.status === 'delivered').length
        };

        res.json({
            success: true,
            count: orders.length,
            stats,
            data: orders
        });
    } catch (error) {
        console.error('Get all orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders'
        });
    }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('userId', 'name email phone')
            .populate('items.productId', 'name imageUrl category');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check if user owns this order or is admin
        if (order.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this order'
            });
        }

        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch order'
        });
    }
};

// @desc    Update order status (Admin)
// @route   PATCH /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            data: order,
            message: 'Order status updated successfully'
        });
    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update order status'
        });
    }
};

// @desc    Cancel order
// @route   PATCH /api/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check if user owns the order
        if (order.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to cancel this order'
            });
        }

        // Check if order can be cancelled
        if (['shipped', 'delivered', 'cancelled'].includes(order.status)) {
            return res.status(400).json({
                success: false,
                message: `Order cannot be cancelled because it is already ${order.status}`
            });
        }

        // Restock products
        for (const item of order.items) {
            await Product.findByIdAndUpdate(item.productId, {
                $inc: { stock: item.quantity }
            });
        }

        order.status = 'cancelled';
        await order.save();

        res.json({
            success: true,
            data: order,
            message: 'Order cancelled successfully'
        });
    } catch (error) {
        console.error('Cancel order error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to cancel order'
        });
    }
};
