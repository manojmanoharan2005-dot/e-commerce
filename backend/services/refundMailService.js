import nodemailer from 'nodemailer';

/**
 * Send refund confirmation email to customer
 * @param {Object} user - User object with email and name
 * @param {Object} order - Order object with refund details
 */
export const sendRefundConfirmationEmail = async (user, order) => {
    try {
        // Check if mail credentials are available
        if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
            console.warn('⚠️ Mail credentials not configured. Skipping refund email.');
            return;
        }

        // Create transporter
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        const refundAmount = order.totalAmount;
        const refundId = order.paymentDetails?.razorpay_refund_id || 'Processing';
        const orderId = order._id.toString().slice(-8).toUpperCase();

        const mailOptions = {
            from: `"AgriStore Refunds" <${process.env.MAIL_FROM || process.env.MAIL_USER}>`,
            to: user.email,
            subject: `Refund Initiated - Order #${orderId}`,
            html: `
                <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; max-width: 700px; margin: 0 auto; background-color: #f8fafc; padding: 20px;">
                    <div style="background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
                        <!-- Header -->
                        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center;">
                            <div style="display: inline-flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 10px;">
                                <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 900; letter-spacing: -0.025em; font-style: italic;">Agri<span style="color: #dcfce7;">Store</span></h1>
                            </div>
                            <p style="color: #d1fae5; margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.2em; font-weight: 700;">Refund Confirmation</p>
                        </div>

                        <div style="padding: 40px 30px;">
                            <!-- Refund Status Badge -->
                            <div style="text-align: center; margin-bottom: 30px;">
                                <div style="display: inline-block; padding: 20px 40px; background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-radius: 20px; border: 2px solid #10b981;">
                                    <div style="font-size: 48px; margin-bottom: 10px;">✓</div>
                                    <h2 style="margin: 0; font-size: 24px; font-weight: 900; color: #059669; font-style: italic;">REFUND INITIATED</h2>
                                </div>
                            </div>

                            <p style="font-size: 16px; color: #334155; margin-bottom: 10px;">Hello <strong>${user.name}</strong>,</p>
                            <p style="font-size: 15px; color: #64748b; line-height: 1.6; margin-bottom: 30px;">
                                Your order has been cancelled and we have initiated a refund to your original payment method. 
                                The refund amount will be credited to your account within <strong>5-7 business days</strong>.
                            </p>

                            <!-- Refund Details -->
                            <div style="background-color: #f8fafc; border-radius: 16px; padding: 25px; margin-bottom: 30px; border: 1px solid #e2e8f0;">
                                <h3 style="margin: 0 0 20px 0; font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; color: #0f172a;">Refund Details</h3>
                                
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                                    <div>
                                        <p style="margin: 0; font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700;">Order ID</p>
                                        <p style="margin: 5px 0 0 0; font-size: 15px; color: #0f172a; font-weight: 800;">#${orderId}</p>
                                    </div>
                                    <div>
                                        <p style="margin: 0; font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700;">Refund Amount</p>
                                        <p style="margin: 5px 0 0 0; font-size: 20px; color: #10b981; font-weight: 900; font-style: italic;">₹${refundAmount}</p>
                                    </div>
                                </div>

                                <div style="border-top: 1px solid #e2e8f0; padding-top: 15px; margin-top: 15px;">
                                    <p style="margin: 0; font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700;">Refund Reference ID</p>
                                    <p style="margin: 5px 0 0 0; font-size: 13px; color: #0f172a; font-weight: 700; font-family: monospace;">${refundId}</p>
                                </div>

                                <div style="border-top: 1px solid #e2e8f0; padding-top: 15px; margin-top: 15px;">
                                    <p style="margin: 0; font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700;">Payment Method</p>
                                    <p style="margin: 5px 0 0 0; font-size: 13px; color: #0f172a; font-weight: 700;">${order.paymentMethod} Payment</p>
                                </div>

                                <div style="border-top: 1px solid #e2e8f0; padding-top: 15px; margin-top: 15px;">
                                    <p style="margin: 0; font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700;">Cancelled Date</p>
                                    <p style="margin: 5px 0 0 0; font-size: 13px; color: #0f172a; font-weight: 700;">${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                </div>
                            </div>

                            <!-- Order Items -->
                            <div style="background-color: #f8fafc; border-radius: 16px; padding: 1px; margin-bottom: 30px;">
                                <h3 style="margin: 0; padding: 20px 20px 10px 20px; font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; color: #0f172a;">Cancelled Items</h3>
                                <table style="width: 100%; border-collapse: separate; border-spacing: 0;">
                                    <thead>
                                        <tr>
                                            <th style="padding: 15px 20px; text-align: left; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; border-bottom: 1px solid #e2e8f0;">Item</th>
                                            <th style="padding: 15px 20px; text-align: center; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; border-bottom: 1px solid #e2e8f0;">Qty</th>
                                            <th style="padding: 15px 20px; text-align: right; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; border-bottom: 1px solid #e2e8f0;">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody style="background-color: #ffffff;">
                                        ${order.items.map(item => `
                                            <tr>
                                                <td style="padding: 15px 20px; border-bottom: 1px solid #f1f5f9; font-weight: 700; color: #0f172a;">${item.name}</td>
                                                <td style="padding: 15px 20px; border-bottom: 1px solid #f1f5f9; text-align: center; color: #64748b;">${item.quantity}</td>
                                                <td style="padding: 15px 20px; border-bottom: 1px solid #f1f5f9; text-align: right; font-weight: 700; color: #0f172a;">₹${item.subtotal || item.price * item.quantity}</td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>

                            <!-- Important Information -->
                            <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 12px; margin-bottom: 30px;">
                                <h3 style="margin: 0 0 10px 0; font-size: 13px; font-weight: 900; color: #92400e;">📌 Important Information</h3>
                                <ul style="margin: 0; padding-left: 20px; color: #78350f; font-size: 13px; line-height: 1.8;">
                                    <li>The refund will be processed to your original payment method</li>
                                    <li>It may take <strong>5-7 business days</strong> for the amount to reflect in your account</li>
                                    <li>You will receive a confirmation once the refund is completed</li>
                                    <li>For any queries, please contact our support team with the refund reference ID</li>
                                </ul>
                            </div>

                            <div style="text-align: center; margin-top: 40px;">
                                <p style="font-size: 13px; color: #94a3b8; font-style: italic;">Thank you for shopping with AgriStore. We hope to serve you again!</p>
                            </div>
                        </div>

                        <!-- Footer -->
                        <div style="background-color: #f1f5f9; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                            <p style="margin: 0 0 10px 0; font-size: 12px; font-weight: 900; color: #475569; text-transform: uppercase; letter-spacing: 0.1em;">© 2026 AgriStore Systems</p>
                            <p style="margin: 0; font-size: 11px; color: #94a3b8;">High-Yield Agricultural Infrastructure & Supply Chain Management</p>
                            <p style="margin: 10px 0 0 0; font-size: 11px; color: #64748b;">Support: <a href="mailto:support@agristore.com" style="color: #10b981; text-decoration: none; font-weight: 700;">support@agristore.com</a></p>
                        </div>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Refund confirmation email sent to ${user.email}`);

    } catch (error) {
        console.error('❌ Error sending refund email:', error.message);
        // Don't throw error - email failure shouldn't stop the refund process
    }
};
