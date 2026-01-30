import 'dotenv/config';

const id = process.env.RAZORPAY_KEY_ID;
const secret = process.env.RAZORPAY_KEY_SECRET;

console.log('--- Key Verification ---');
console.log('Key ID starts with:', id ? id.substring(0, 8) : 'MISSING');
console.log('Key ID length:', id ? id.length : 0);
console.log('Has literal quotes at start?', id ? id.startsWith('"') : 'N/A');
console.log('---');

if (id && id.startsWith('"')) {
    console.log('⚠️ WARNING: Your Key ID has literal quotes. Please remove the " " from your .env file.');
} else if (id && id.startsWith('rzp_test')) {
    console.log('ℹ️ You are still using TEST keys.');
} else if (id && id.startsWith('rzp_live')) {
    console.log('✅ You are using LIVE keys correctly.');
}
