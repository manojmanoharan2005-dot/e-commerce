import Razorpay from 'razorpay';
import dotenv from 'dotenv';
dotenv.config();

const getRazorpayInstance = () => {
    const key_id = process.env.RAZORPAY_KEY_ID?.replace(/"/g, '');
    const key_secret = process.env.RAZORPAY_KEY_SECRET?.replace(/"/g, '');

    if (!key_id || !key_secret) {
        console.error('❌ Razorpay Error: RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is missing in .env');
        return null;
    }

    return new Razorpay({
        key_id,
        key_secret
    });
};

export default getRazorpayInstance;
