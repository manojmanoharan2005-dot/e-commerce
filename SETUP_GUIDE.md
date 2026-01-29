# 🚀 FertilizerMart - Complete Setup Guide

This guide will walk you through setting up the entire application from scratch.

## 📋 Prerequisites Checklist

Before starting, ensure you have:

- [ ] **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- [ ] **MongoDB** installed locally OR MongoDB Atlas account - [Atlas](https://www.mongodb.com/cloud/atlas)
- [ ] **Gemini API Key** - [Get it here](https://makersuite.google.com/app/apikey)
- [ ] **Git** (optional, for version control)
- [ ] **Code Editor** (VS Code recommended)

## 🔧 Step-by-Step Setup

### Step 1: Get Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key (you'll need this later)

### Step 2: Setup MongoDB

**Option A: Local MongoDB**
1. Install MongoDB Community Edition
2. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # Mac/Linux
   sudo systemctl start mongod
   ```
3. Your connection string: `mongodb://localhost:27017/fertilizer-ecommerce`

**Option B: MongoDB Atlas (Cloud)**
1. Create free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Create database user with password
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/fertilizer-ecommerce`

### Step 3: Backend Setup

1. **Open terminal in backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies** (already done if you followed Quick Start)
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Edit `backend/.env` file:
   ```env
   # MongoDB Connection
   MONGODB_URI=mongodb://localhost:27017/fertilizer-ecommerce
   # OR for Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fertilizer-ecommerce
   
   # Server Port
   PORT=5000
   NODE_ENV=development
   
   # JWT Secret (change this to any random string)
   JWT_SECRET=my_super_secret_key_12345_change_this
   
   # Gemini API Key (paste your key here)
   GEMINI_API_KEY=AIzaSy...your_actual_key_here
   
   # Frontend URL
   FRONTEND_URL=http://localhost:5173
   ```

4. **Seed the database with sample data**
   ```bash
   node scripts/seedProducts.js
   ```
   
   You should see:
   ```
   ✅ MongoDB Connected
   🗑️  Cleared existing products
   ✅ Inserted 10 sample products
   ✅ Created admin user (admin@fertilizer.com / admin123)
   ✅ Created farmer user (farmer@test.com / farmer123)
   🎉 Database seeded successfully!
   ```

5. **Start the backend server**
   ```bash
   npm run dev
   ```
   
   You should see:
   ```
   🚀 Server running on port 5000
   📍 Environment: development
   🌐 Frontend URL: http://localhost:5173
   ✅ MongoDB Connected: localhost
   📊 Database: fertilizer-ecommerce
   ```

### Step 4: Frontend Setup

1. **Open NEW terminal in frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies** (if not already done)
   ```bash
   npm install
   ```

3. **Verify environment variables**
   
   Check `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start the frontend development server**
   ```bash
   npm run dev
   ```
   
   You should see:
   ```
   VITE v7.3.1  ready in 329 ms
   ➜  Local:   http://localhost:5173/
   ```

### Step 5: Access the Application

1. **Open your browser** and go to: `http://localhost:5173`

2. **Test the application:**
   
   **As Farmer:**
   - Click "Login"
   - Email: `farmer@test.com`
   - Password: `farmer123`
   - Browse products, use AI features, add to cart, checkout
   
   **As Admin:**
   - Click "Login"
   - Email: `admin@fertilizer.com`
   - Password: `admin123`
   - Access admin dashboard, manage orders and inventory

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] Backend server running on port 5000
- [ ] Frontend running on port 5173
- [ ] Can access homepage
- [ ] Can login as farmer
- [ ] Can browse products
- [ ] Can view product details
- [ ] **AI Field Assistant** works (requires Gemini API key)
- [ ] **AI Price Intelligence** works (requires Gemini API key)
- [ ] Can add products to cart
- [ ] Can checkout and place order
- [ ] Can login as admin
- [ ] Can see orders in admin dashboard
- [ ] Can update order status
- [ ] Can manage inventory

## 🐛 Troubleshooting

### Backend won't start

**Error: "Cannot connect to MongoDB"**
- Solution: Ensure MongoDB is running
- Check connection string in `.env`
- For Atlas: Verify IP whitelist and credentials

**Error: "GEMINI_API_KEY is not defined"**
- Solution: Add your Gemini API key to `backend/.env`
- Get key from: https://makersuite.google.com/app/apikey

### Frontend won't start

**Error: "Cannot connect to backend"**
- Solution: Ensure backend is running on port 5000
- Check `VITE_API_URL` in `frontend/.env`

**Error: "Module not found"**
- Solution: Run `npm install` in frontend directory

### AI Features not working

**Error: "AI service temporarily unavailable"**
- Solution: Verify Gemini API key is correct in `backend/.env`
- Check API key is active at Google AI Studio
- Ensure you have internet connection

### Port already in use

**Error: "Port 5000 is already in use"**
- Solution: Change `PORT` in `backend/.env` to another port (e.g., 5001)
- Update `VITE_API_URL` in `frontend/.env` accordingly

## 📦 Production Deployment

### Backend Deployment (Render.com)

1. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Create Render account** at [render.com](https://render.com)

3. **Create new Web Service**
   - Connect your GitHub repository
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`

4. **Add Environment Variables** in Render dashboard:
   - `MONGODB_URI` - Your MongoDB Atlas connection string
   - `JWT_SECRET` - Random secure string
   - `GEMINI_API_KEY` - Your Gemini API key
   - `FRONTEND_URL` - Your frontend URL (will get after deploying frontend)
   - `NODE_ENV` - `production`

5. **Deploy** and copy the backend URL

### Frontend Deployment (Vercel)

1. **Build the frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Create Vercel account** at [vercel.com](https://vercel.com)

3. **Deploy**
   ```bash
   npm install -g vercel
   vercel
   ```
   
   Or use Vercel dashboard:
   - Import your GitHub repository
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Add Environment Variable**
   - `VITE_API_URL` - Your Render backend URL + `/api`

5. **Update Backend CORS**
   - Go back to Render
   - Update `FRONTEND_URL` to your Vercel URL
   - Redeploy backend

### Database (MongoDB Atlas)

Already covered in Step 2, Option B above.

## 🎯 Next Steps

After successful setup:

1. **Customize Products**: Edit `backend/scripts/seedProducts.js` to add your own fertilizer products
2. **Add Images**: Replace placeholder images with real product images
3. **Customize Branding**: Update colors in `frontend/tailwind.config.js`
4. **Add Features**: Implement reviews, wishlist, payment gateway integration
5. **Security**: Change all default passwords and secrets before production

## 📚 Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Gemini API Docs](https://ai.google.dev/docs)

## 💡 Tips

- Use MongoDB Compass to visualize your database
- Use Postman to test API endpoints
- Check browser console for frontend errors
- Check terminal for backend errors
- Enable MongoDB logging for debugging

## 🆘 Getting Help

If you encounter issues:

1. Check this troubleshooting guide
2. Review error messages carefully
3. Check MongoDB connection
4. Verify all environment variables
5. Ensure all dependencies are installed
6. Open an issue on GitHub with error details

---

**Happy Coding! 🚀**
