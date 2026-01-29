import Address from '../models/Address.js';

// @desc    Get all addresses for a user
// @route   GET /api/addresses
// @access  Private
export const getAddresses = async (req, res) => {
    try {
        const addresses = await Address.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 });
        res.json({
            success: true,
            data: addresses
        });
    } catch (error) {
        console.error('Get addresses error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch addresses'
        });
    }
};

// @desc    Add new address
// @route   POST /api/addresses
// @access  Private
export const addAddress = async (req, res) => {
    try {
        const count = await Address.countDocuments({ user: req.user._id });

        // If it's the first address, make it default
        const addressData = {
            ...req.body,
            user: req.user._id,
            isDefault: count === 0 ? true : req.body.isDefault
        };

        const address = await Address.create(addressData);
        res.status(201).json({
            success: true,
            data: address
        });
    } catch (error) {
        console.error('Add address error:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to add address'
        });
    }
};

// @desc    Update address
// @route   PUT /api/addresses/:id
// @access  Private
export const updateAddress = async (req, res) => {
    try {
        let address = await Address.findById(req.params.id);

        if (!address) {
            return res.status(404).json({
                success: false,
                message: 'Address not found'
            });
        }

        // Make sure user owns address
        if (address.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized'
            });
        }

        address = await Address.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.json({
            success: true,
            data: address
        });
    } catch (error) {
        console.error('Update address error:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to update address'
        });
    }
};

// @desc    Delete address
// @route   DELETE /api/addresses/:id
// @access  Private
export const deleteAddress = async (req, res) => {
    try {
        const address = await Address.findById(req.params.id);

        if (!address) {
            return res.status(404).json({
                success: false,
                message: 'Address not found'
            });
        }

        if (address.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized'
            });
        }

        await address.deleteOne();

        res.json({
            success: true,
            message: 'Address removed'
        });
    } catch (error) {
        console.error('Delete address error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete address'
        });
    }
};

// @desc    Set default address
// @route   PATCH /api/addresses/:id/default
// @access  Private
export const setDefaultAddress = async (req, res) => {
    try {
        const address = await Address.findById(req.params.id);

        if (!address) {
            return res.status(404).json({
                success: false,
                message: 'Address not found'
            });
        }

        if (address.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized'
            });
        }

        address.isDefault = true;
        await address.save();

        res.json({
            success: true,
            message: 'Default address updated',
            data: address
        });
    } catch (error) {
        console.error('Set default address error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to set default address'
        });
    }
};
