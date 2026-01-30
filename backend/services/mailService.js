import nodemailer from 'nodemailer';

/**
 * Send Order Confirmation Email
 * @param {Object} user - User object containing email and name
 * @param {Object} order - Order object containing details
 */
export const sendOrderConfirmationEmail = async (user, order) => {
    try {
        console.log('📬 Attempting to send order confirmation to:', user.email);

        if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
            console.warn('⚠️ Mail credentials missing in .env. Skipping email sending.');
            return;
        }

        // Create transporter dynamically to ensure latest env variables are used
        const transporter = nodemailer.createTransport({
            service: process.env.MAIL_SERVICE || 'gmail',
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        const itemsHtml = order.items.map(item => `
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.subtotal}</td>
            </tr>
        `).join('');

        const mailOptions = {
            from: `"FertilizerMart" <${process.env.MAIL_USER}>`,
            to: user.email,
            subject: `Order Confirmed - #${order._id.toString().slice(-6).toUpperCase()}`,
            html: `
                <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                    <div style="background-color: #2e7d32; padding: 20px; text-align: center; color: white;">
                        <h1 style="margin: 0;">FertilizerMart</h1>
                        <p style="margin: 5px 0 0;">Thank you for your order!</p>
                    </div>
                    
                    <div style="padding: 30px;">
                        <p>Hi ${user.name},</p>
                        <p>Your order has been placed successfully and is being processed. Here are your order details:</p>
                        
                        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <p style="margin: 0;"><strong>Order ID:</strong> #${order._id}</p>
                            <p style="margin: 5px 0 0;"><strong>Date:</strong> ${new Date(order.createdAt || Date.now()).toLocaleDateString()}</p>
                            <p style="margin: 5px 0 0;"><strong>Status:</strong> ${order.status.toUpperCase()}</p>
                        </div>

                        <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr style="background-color: #f1f1f1;">
                                    <th style="padding: 10px; text-align: left;">Item</th>
                                    <th style="padding: 10px; text-align: center;">Qty</th>
                                    <th style="padding: 10px; text-align: right;">Price</th>
                                    <th style="padding: 10px; text-align: right;">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${itemsHtml}
                            </tbody>
                        </table>

                        <div style="text-align: right; margin-top: 20px;">
                            <p style="font-size: 18px;"><strong>Total Amount: ₹${order.totalAmount}</strong></p>
                        </div>

                        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                            <h3 style="color: #2e7d32;">Shipping Address</h3>
                            <p style="margin: 5px 0;">${order.shippingAddress.name}</p>
                            <p style="margin: 5px 0;">${order.shippingAddress.street}</p>
                            <p style="margin: 5px 0;">${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}</p>
                            <p style="margin: 5px 0;">Phone: ${order.shippingAddress.phone}</p>
                        </div>
                    </div>
                    
                    <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #666;">
                        <p>© 2026 FertilizerMart - Smart Solutions for Farmers</p>
                        <p>If you have any questions, contact us at support@fertilizermart.com</p>
                    </div>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Order confirmation email sent successfully!');
        console.log('📬 Message ID:', info.messageId);
        console.log('📧 Recipient:', user.email);
        return info;
    } catch (error) {
        console.error('❌ Nodemailer Error for:', user.email);
        console.error('Error Details:', error.message);
        if (error.code === 'EAUTH') {
            console.error('Authentication Failed: Check your MAIL_USER and MAIL_PASS (App Password) in .env');
        }
    }
};
