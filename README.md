# FertilizerMart - AI-Powered E-Commerce Platform

A professional, full-stack fertilizer e-commerce platform with integrated AI features for farmers. Built with MERN stack (MongoDB, Express, React, Node.js) and powered by Google's Gemini 2.5 Flash AI.

## 🌟 Key Features

### For Farmers (Users)
- **Smart Product Browsing**: Flipkart-style grid layout with filters
- **AI Field Assistant**: Get personalized fertilizer recommendations based on:
  - Crop type
  - Soil type
  - Season
  - Dosage advice
  - Safety precautions
- **AI Price Intelligence**: Real-time market trends and buying advice
- **Semantic Smart Search**: Natural language queries (e.g., "Best for Paddy")
- **Shopping Cart**: Add/remove products, quantity management
- **Secure Checkout**: COD payment with order confirmation

### For Admins (Store Managers)
- **Sales Dashboard**: Real-time order monitoring
- **Order Management**: Update order status (pending → delivered)
- **Inventory Control**: Monitor stock levels, update prices
- **Analytics**: View total orders, revenue, customer data

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js + Vite |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Backend | Node.js + Express.js |
| Database | MongoDB |
| Authentication | JWT |
| AI Engine | Google Gemini 2.5 Flash |

## 📁 Project Structure

```
fertilizer-ecommerce/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Auth middleware
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── scripts/         # Database seed scripts
│   ├── services/        # Gemini AI service
│   └── server.js        # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── context/     # React context (Auth, Cart)
│   │   ├── pages/       # Page components
│   │   ├── utils/       # API utilities
│   │   └── App.jsx      # Main app component
│   └── index.html
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Gemini API Key ([Get it here](https://makersuite.google.com/app/apikey))

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add:
   ```env
   MONGODB_URI=mongodb://localhost:27017/fertilizer-ecommerce
   JWT_SECRET=your_super_secret_jwt_key_change_this
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=5000
   FRONTEND_URL=http://localhost:5173
   ```

4. **Seed the database** (optional but recommended)
   ```bash
   node scripts/seedProducts.js
   ```

5. **Start the backend server**
   ```bash
   npm run dev
   ```
   
   Backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   
   Frontend will run on `http://localhost:5173`

## 👤 Test Credentials

After seeding the database, use these credentials:

**Farmer Account:**
- Email: `farmer@test.com`
- Password: `farmer123`

**Admin Account:**
- Email: `admin@fertilizer.com`
- Password: `admin123`

## 🤖 AI Features

### 1. AI Field Assistant
- **Endpoint**: `POST /api/products/:id/advice`
- **Input**: Crop type, soil type, season
- **Output**: 
  - Suitability analysis
  - Recommended dosage
  - Application method
  - Best time to apply
  - Safety precautions

### 2. AI Price Intelligence
- **Endpoint**: `GET /api/products/:id/price-intelligence`
- **Output**:
  - Price trend (Rising/Falling/Stable)
  - Buying advice
  - Market insights
  - Best season to buy

### 3. Semantic Smart Search
- **Endpoint**: `GET /api/products/search?query=<natural_language>`
- **Example**: "Best for Paddy" → Returns rice/paddy-suitable fertilizers

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/search?query=` - Smart search
- `GET /api/products/:id` - Get single product
- `POST /api/products/:id/advice` - Get AI advice
- `GET /api/products/:id/price-intelligence` - Get price analysis
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Orders
- `POST /api/orders` - Create order (Protected)
- `GET /api/orders/my-orders` - Get user orders (Protected)
- `GET /api/orders` - Get all orders (Admin only)
- `GET /api/orders/:id` - Get single order (Protected)
- `PATCH /api/orders/:id/status` - Update order status (Admin only)

## 🎨 Design Features

- **Modern UI**: Gradient backgrounds, glassmorphism effects
- **Responsive**: Mobile-first design
- **Animations**: Smooth transitions and micro-interactions
- **Color Palette**:
  - Primary: Flipkart Blue (#2874f0)
  - Secondary: Agricultural Green (#4CAF50)
- **Typography**: Inter font family

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (Farmer/Admin)
- Protected API routes
- Input validation

## 📦 Database Schema

### Users
```javascript
{
  name, email, password, role, phone, address, timestamps
}
```

### Products
```javascript
{
  name, description, category, cropTags[], price, stock,
  npkRatio, composition, benefits[], safetyPrecautions[], timestamps
}
```

### Orders
```javascript
{
  userId, items[], totalAmount, status, shippingAddress,
  paymentMethod, orderDate, timestamps
}
```

## 🚢 Deployment

### Backend (Render/Heroku)
1. Push code to GitHub
2. Connect to Render/Heroku
3. Set environment variables
4. Deploy

### Frontend (Vercel/Netlify)
1. Build: `npm run build`
2. Deploy `dist` folder
3. Set `VITE_API_URL` to backend URL

### Database (MongoDB Atlas)
1. Create cluster
2. Get connection string
3. Update `MONGODB_URI` in backend `.env`

## 📝 License

MIT License - Feel free to use for your projects!

## 🤝 Contributing

Contributions welcome! Please open an issue or submit a PR.

## 📧 Support

For issues or questions, please open a GitHub issue.

---

**Built with ❤️ for farmers by the FertilizerMart team**
