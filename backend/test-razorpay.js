import 'dotenv/config';
import Razorpay from 'razorpay';
import fs from 'fs';

const testRazorpay = async () => {
    let result = 'Testing Razorpay Configuration...\n';
    result += `Key ID Literal: [${process.env.RAZORPAY_KEY_ID}]\n`;
    result += `Key Secret Literal: [${process.env.RAZORPAY_KEY_SECRET}]\n`;

    try {
        const rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID?.replace(/"/g, ''),
            key_secret: process.env.RAZORPAY_KEY_SECRET?.replace(/"/g, '')
        });

        const orders = await rzp.orders.all({ count: 1 });
        result += '✅ Success! Razorpay connection established.\n';
    } catch (error) {
        result += '❌ Razorpay Connection Failed:\n';
        result += JSON.stringify(error, null, 2);
    }

    fs.writeFileSync('test-results.txt', result);
    process.exit(0);
};

testRazorpay();
