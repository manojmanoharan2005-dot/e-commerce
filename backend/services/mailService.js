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

        // Create transporter with flexible configuration
        // Defaults to Port 587 (STARTTLS) which is more common for cloud services
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST || 'smtp.gmail.com',
            port: process.env.MAIL_PORT || 587,
            secure: process.env.MAIL_PORT == 465, // true for 465, false for 587
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            },
            tls: {
                rejectUnauthorized: false // Helps with some cloud connection issues
            }
        });

        const itemsHtml = order.items.map(item => `
            <tr>
                <td style="padding: 15px 10px; border-bottom: 1px solid #e2e8f0;">
                    <div style="font-weight: 800; color: #0f172a; font-size: 14px;">${item.name}</div>
                    <div style="font-size: 11px; color: #64748b; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.05em;">MFG: <span style="color: #10b981; font-weight: 700;">${item.manufacturer || 'AgriStore Certified'}</span></div>
                </td>
                <td style="padding: 15px 10px; border-bottom: 1px solid #e2e8f0; text-align: center; color: #0f172a; font-weight: 700;">${item.quantity}</td>
                <td style="padding: 15px 10px; border-bottom: 1px solid #e2e8f0; text-align: right; color: #64748b;">₹${item.price}</td>
                <td style="padding: 15px 10px; border-bottom: 1px solid #e2e8f0; text-align: right; color: #0f172a; font-weight: 800;">₹${item.subtotal}</td>
            </tr>
        `).join('');

        const mailOptions = {
            from: `"AgriStore Orders" <${process.env.MAIL_FROM || process.env.MAIL_USER}>`,
            to: user.email,
            subject: `Order Confirmation & Invoice - #${order._id.toString().slice(-6).toUpperCase()}`,
            html: `
                <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; max-width: 700px; margin: 0 auto; background-color: #f8fafc; padding: 20px;">
                    <div style="background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); position: relative;">
                        
                        <!-- OFFICIAL SEAL (RUBBER STAMP STYLE) -->
                        <div style="position: absolute; top: 120px; right: 40px; transform: rotate(-15deg); border: 4px double #10b981; border-radius: 12px; padding: 10px 20px; color: #10b981; font-weight: 900; font-size: 24px; text-transform: uppercase; opacity: 0.8; pointer-events: none; z-index: 10; font-family: 'Courier New', Courier, monospace; letter-spacing: 2px; text-align: center;">
                            CONFIRMED<br>
                            <span style="font-size: 10px; letter-spacing: 1px;">AGRISTORE VERIFIED</span>
                        </div>

                        <!-- Header -->
                        <div style="background-color: #0f172a; padding: 40px 30px; text-align: center;">
                            <div style="display: inline-flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 10px;">
                                <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 900; letter-spacing: -0.025em; font-style: italic;">Agri<span style="color: #10b981;">Store</span></h1>
                            </div>
                            <p style="color: #94a3b8; margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.2em; font-weight: 700;">Premium Agricultural Solutions</p>
                        </div>

                        <div style="padding: 40px 30px;">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px;">
                                <div>
                                    <h2 style="margin: 0 0 10px 0; font-size: 24px; font-weight: 900; color: #0f172a; font-style: italic;">TAX INVOICE</h2>
                                    <p style="margin: 0; font-size: 14px; color: #64748b;">Invoice ID: <strong style="color: #0f172a;">#${order._id}</strong></p>
                                    <p style="margin: 5px 0 0 0; font-size: 14px; color: #64748b;">Date: <strong style="color: #0f172a;">${new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</strong></p>
                                </div>
                                <div style="text-align: right;">
                                    <div style="display: inline-block; padding: 6px 16px; background-color: #ecfdf5; border-radius: 10px; border: 1px solid #d1fae5;">
                                        <span style="color: #059669; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em;">${order.paymentStatus === 'paid' ? 'PAID & CONFIRMED' : 'ORDER PLACED (COD)'}</span>
                                    </div>
                                </div>
                            </div>

                            <p style="font-size: 16px; color: #334155; margin-bottom: 30px;">Hello <strong>${user.name}</strong>,</p>
                            <p style="font-size: 15px; color: #64748b; line-height: 1.6; margin-bottom: 30px;">Your command for high-yield biological assets has been successfully registered. Our logistics nodes are currently preparing your shipment for precision deployment.</p>

                            <!-- Items Table -->
                            <div style="background-color: #f8fafc; border-radius: 16px; padding: 1px; margin-bottom: 30px;">
                                <table style="width: 100%; border-collapse: separate; border-spacing: 0;">
                                    <thead>
                                        <tr>
                                            <th style="padding: 15px; text-align: left; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; border-bottom: 1px solid #e2e8f0;">Item Detail</th>
                                            <th style="padding: 15px; text-align: center; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; border-bottom: 1px solid #e2e8f0;">Qty</th>
                                            <th style="padding: 15px; text-align: right; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; border-bottom: 1px solid #e2e8f0;">Rate</th>
                                            <th style="padding: 15px; text-align: right; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; border-bottom: 1px solid #e2e8f0;">Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody style="background-color: #ffffff;">
                                        ${itemsHtml}
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td colspan="3" style="padding: 20px 15px; text-align: right; font-size: 14px; font-weight: 700; color: #64748b;">Net Amount</td>
                                            <td style="padding: 20px 15px; text-align: right; font-size: 20px; font-weight: 900; color: #0f172a; font-style: italic;">₹${order.totalAmount}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>

                            <!-- Address & Payment Grid -->
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
                                <div style="background-color: #f8fafc; padding: 25px; border-radius: 16px; border: 1px solid #e2e8f0;">
                                    <h3 style="margin: 0 0 15px 0; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; color: #0f172a;">Shipping Target</h3>
                                    <p style="margin: 0; font-size: 14px; font-weight: 800; color: #0f172a; margin-bottom: 8px;">${order.shippingAddress.name}</p>
                                    <p style="margin: 0 0 5px 0; font-size: 13px; color: #475569;">${order.shippingAddress.street}</p>
                                    <p style="margin: 0 0 5px 0; font-size: 13px; color: #475569;">${order.shippingAddress.city}, ${order.shippingAddress.state} - <strong>${order.shippingAddress.pincode}</strong></p>
                                    <p style="margin: 10px 0 0 0; font-size: 12px; color: #64748b; font-weight: 700;">CONTACT: <span style="color: #10b981;">${order.shippingAddress.phone}</span></p>
                                </div>
                                <div style="background-color: #f8fafc; padding: 25px; border-radius: 16px; border: 1px solid #e2e8f0;">
                                    <h3 style="margin: 0 0 15px 0; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; color: #0f172a;">Payment Analytics</h3>
                                    <p style="margin: 0 0 10px 0; font-size: 13px; color: #475569;">Method: <strong style="color: #0f172a;">${order.paymentMethod === 'Online' ? 'PREPAID (ONLINE)' : 'COD (MANUAL)'}</strong></p>
                                    ${order.paymentDetails?.razorpay_payment_id ? `
                                        <p style="margin: 0 0 5px 0; font-size: 13px; color: #475569;">UTR ID: <strong style="color: #0f172a;">${order.paymentDetails.razorpay_payment_id}</strong></p>
                                        <div style="margin-top: 10px; display: inline-block; padding: 4px 10px; background-color: #dcfce7; color: #166534; font-size: 9px; font-weight: 900; border-radius: 6px; text-transform: uppercase;">SECURE TRANSACTION</div>
                                    ` : `
                                        <p style="margin: 0; font-size: 13px; color: #475569;">Ref ID: <strong style="color: #0f172a;">PENDING</strong></p>
                                        <div style="margin-top: 10px; display: inline-block; padding: 4px 10px; background-color: #fef9c3; color: #854d0e; font-size: 9px; font-weight: 900; border-radius: 6px; text-transform: uppercase;">COLLECTION ON DELIVERY</div>
                                    `}
                                </div>
                            </div>
                            
                            <div style="margin-top: 40px; text-align: center;">
                                <p style="font-size: 13px; color: #94a3b8; font-style: italic;">This is a system-generated digital manifest for your inventory records.</p>
                            </div>
                        </div>

                        <!-- Footer -->
                        <div style="background-color: #f1f5f9; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                            <p style="margin: 0 0 10px 0; font-size: 12px; font-weight: 900; color: #475569; text-transform: uppercase; letter-spacing: 0.1em;">© 2026 AgriStore Systems</p>
                            <p style="margin: 0; font-size: 11px; color: #94a3b8;">High-Yield Agricultural Infrastructure & Supply Chain Management</p>
                            <p style="margin: 10px 0 0 0; font-size: 11px; color: #64748b;">Inquiries: <a href="mailto:support@agristore.com" style="color: #10b981; text-decoration: none; font-weight: 700;">support@agristore.com</a></p>
                        </div>
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

/**
 * Send Order Status Update Email
 * @param {Object} user - User object containing email and name
 * @param {Object} order - Order object containing details
 * @param {string} status - New order status
 */
export const sendStatusUpdateEmail = async (user, order, status) => {
    try {
        console.log(`📬 Attempting to send ${status} status update notification to:`, user.email);

        if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
            return;
        }

        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST || 'smtp.gmail.com',
            port: process.env.MAIL_PORT || 587,
            secure: process.env.MAIL_PORT == 465,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const statusColors = {
            'confirmed': '#10b981',   // Green
            'processing': '#3b82f6',  // Blue
            'shipped': '#8b5cf6',     // Purple
            'delivered': '#10b981',   // Green
            'cancelled': '#ef4444'    // Red
        };

        const statusMessages = {
            'confirmed': 'Your order has been confirmed and is now in our system.',
            'processing': 'We are currently preparing your items for shipment.',
            'shipped': 'Great news! Your order has been shipped and is on its way to you.',
            'delivered': 'Success! Your order has been delivered. Enjoy your purchase!',
            'cancelled': 'Your order has been cancelled.'
        };

        const statusTitles = {
            'confirmed': 'Order Confirmed',
            'processing': 'Order Processing',
            'shipped': 'Order Shipped',
            'delivered': 'Order Delivered',
            'cancelled': 'Order Cancelled'
        };

        const color = statusColors[status] || '#10b981';
        const message = statusMessages[status] || `Your order status has been updated to ${status}.`;
        const title = statusTitles[status] || `Order Update: ${status}`;

        const itemsHtml = order.items && order.items.length > 0 ? `
            <div style="background-color: #f8fafc; border-radius: 16px; padding: 20px; margin-bottom: 30px; border: 1px solid #e2e8f0;">
                <h3 style="margin: 0 0 15px 0; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">Order Inventory</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    ${order.items.map(item => `
                        <tr>
                            <td style="padding: 10px 0; border-bottom: 1px dotted #e2e8f0;">
                                <div style="font-weight: 700; color: #0f172a; font-size: 13px;">${item.name} <span style="color: #64748b; font-weight: 400;">x ${item.quantity}</span></div>
                                <div style="font-size: 10px; color: #10b981; text-transform: uppercase; font-weight: 700; margin-top: 2px;">MFG: ${item.manufacturer || 'AgriStore Certified'}</div>
                            </td>
                            <td style="padding: 10px 0; border-bottom: 1px dotted #e2e8f0; text-align: right; font-weight: 700; color: #0f172a; font-size: 13px;">₹${item.subtotal}</td>
                        </tr>
                    `).join('')}
                </table>
            </div>
        ` : '';

        const mailOptions = {
            from: `"AgriStore Updates" <${process.env.MAIL_FROM || process.env.MAIL_USER}>`,
            to: user.email,
            subject: `${title} - #${order._id.toString().slice(-6).toUpperCase()}`,
            html: `
                <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; max-width: 700px; margin: 0 auto; background-color: #f8fafc; padding: 20px;">
                    <div style="background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); position: relative;">
                        
                        <!-- OFFICIAL SEAL for Confirmed/Active orders -->
                        ${['confirmed', 'processing', 'shipped', 'delivered'].includes(status) ? `
                            <div style="position: absolute; top: 120px; right: 40px; transform: rotate(-15deg); border: 4px double #10b981; border-radius: 12px; padding: 10px 20px; color: #10b981; font-weight: 900; font-size: 24px; text-transform: uppercase; opacity: 0.8; pointer-events: none; z-index: 10; font-family: 'Courier New', Courier, monospace; letter-spacing: 2px; text-align: center;">
                                CONFIRMED<br>
                                <span style="font-size: 10px; letter-spacing: 1px;">AGRISTORE VERIFIED</span>
                            </div>
                        ` : ''}

                        <!-- Header -->
                        <div style="background-color: #0f172a; padding: 40px 30px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 900; letter-spacing: -0.025em; font-style: italic;">Agri<span style="color: #10b981;">Store</span></h1>
                            <p style="color: #94a3b8; margin: 10px 0 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.2em; font-weight: 700;">Order Status Update</p>
                        </div>

                        <div style="padding: 40px 30px;">
                            <div style="text-align: center; margin-bottom: 40px;">
                                <div style="display: inline-block; padding: 8px 24px; background-color: ${color}15; border-radius: 100px; border: 1px solid ${color};">
                                    <span style="color: ${color}; font-size: 14px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em;">${title}</span>
                                </div>
                            </div>

                            <p style="font-size: 18px; color: #0f172a; margin-bottom: 20px;">Hello <strong>${user.name}</strong>,</p>
                            <p style="font-size: 16px; color: #64748b; line-height: 1.6; margin-bottom: 30px;">${message}</p>

                            ${itemsHtml}

                            <div style="background-color: #f8fafc; padding: 30px; border-radius: 20px; border: 1px solid #e2e8f0; margin-bottom: 40px;">
                                <h3 style="margin: 0 0 20px 0; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; color: #0f172a; text-align: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">Deployment Details</h3>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                                    <span style="font-size: 14px; color: #64748b;">Order ID:</span>
                                    <span style="font-size: 14px; font-weight: 700; color: #0f172a;">#${order._id.toString().slice(-6).toUpperCase()}</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                                    <span style="font-size: 14px; color: #64748b;">Invoice Ref:</span>
                                    <span style="font-size: 14px; font-weight: 700; color: #0f172a;">${order._id}</span>
                                </div>
                                <div style="display: flex; justify-content: space-between;">
                                    <span style="font-size: 14px; color: #64748b;">Order Total:</span>
                                    <span style="font-size: 14px; font-weight: 900; color: #10b981;">₹${order.totalAmount}</span>
                                </div>
                            </div>

                            <div style="text-align: center;">
                                <p style="font-size: 14px; color: #64748b; margin-bottom: 30px;">Track your asset distribution status at any time on the AgriStore dashboard.</p>
                                <a href="${process.env.FRONTEND_URL}/my-orders" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 900; font-size: 14px; letter-spacing: 0.05em; text-transform: uppercase;">Track Your Order</a>
                            </div>
                        </div>

                        <!-- Footer -->
                        <div style="background-color: #f1f5f9; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                            <p style="margin: 0 0 10px 0; font-size: 12px; font-weight: 900; color: #475569; text-transform: uppercase; letter-spacing: 0.1em;">© 2026 AgriStore Systems</p>
                            <p style="margin: 0; font-size: 11px; color: #94a3b8;">High-Yield Agricultural Infrastructure & Supply Chain Management</p>
                            <p style="margin: 10px 0 0 0; font-size: 11px; color: #64748b;">Inquiries: <a href="mailto:support@agristore.com" style="color: #10b981; text-decoration: none; font-weight: 700;">support@agristore.com</a></p>
                        </div>
                    </div>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Order status update email (${status}) sent successfully!`);
        return info;
    } catch (error) {
        console.error('❌ Status Update Email Error:', error.message);
    }
};
