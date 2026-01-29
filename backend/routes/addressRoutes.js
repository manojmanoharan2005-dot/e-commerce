import express from 'express';
import {
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress
} from '../controllers/addressController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All address routes are protected

router.route('/')
    .get(getAddresses)
    .post(addAddress);

router.route('/:id')
    .put(updateAddress)
    .delete(deleteAddress);

router.patch('/:id/default', setDefaultAddress);

export default router;
