# 🚀 Quick Start Commands

## First Time Setup

### 1. Backend Setup
```bash
cd backend
npm install
# Edit .env file with your MongoDB URI and Gemini API key
node scripts/seedProducts.js
npm run dev
```

### 2. Frontend Setup (in new terminal)
```bash
cd frontend
npm install
npm run dev
```

### 3. Access Application
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Login: farmer@test.com / farmer123

## Daily Development

### Start Backend
```bash
cd backend
npm run dev
```

### Start Frontend
```bash
cd frontend
npm run dev
```

## Production Build

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## Database Operations

### Seed Database
```bash
cd backend
node scripts/seedProducts.js
```

### Reset Database
```bash
# In MongoDB shell or Compass
use fertilizer-ecommerce
db.dropDatabase()
# Then run seed script again
```

## Testing

### Test API Endpoints
```bash
# Health check
curl http://localhost:5000/api/health

# Get products
curl http://localhost:5000/api/products

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"farmer@test.com","password":"farmer123"}'
```

## Troubleshooting

### Backend won't start
```bash
# Check MongoDB is running
mongod --version

# Check port 5000 is free
netstat -ano | findstr :5000

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Frontend won't start
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json .vite
npm install
```

### AI features not working
```bash
# Verify Gemini API key in backend/.env
echo $GEMINI_API_KEY  # Linux/Mac
echo %GEMINI_API_KEY%  # Windows

# Test API key
curl https://generativelanguage.googleapis.com/v1beta/models?key=YOUR_API_KEY
```

## Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/fertilizer-ecommerce
JWT_SECRET=your_secret_key_here
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## Git Commands

### Initial Setup
```bash
git init
git add .
git commit -m "Initial commit: FertilizerMart e-commerce platform"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

### Daily Workflow
```bash
git add .
git commit -m "Your commit message"
git push
```

## Deployment

### Deploy to Render (Backend)
```bash
# Push to GitHub first
git push

# Then in Render dashboard:
# 1. Connect GitHub repo
# 2. Set root directory to "backend"
# 3. Add environment variables
# 4. Deploy
```

### Deploy to Vercel (Frontend)
```bash
cd frontend
npm run build

# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Or use Vercel dashboard to import from GitHub
```

## Useful Commands

### Check Running Processes
```bash
# Windows
netstat -ano | findstr :5000
netstat -ano | findstr :5173

# Linux/Mac
lsof -i :5000
lsof -i :5173
```

### Kill Process on Port
```bash
# Windows
taskkill /PID <PID> /F

# Linux/Mac
kill -9 <PID>
```

### View Logs
```bash
# Backend logs (in terminal where backend is running)
# Frontend logs (in terminal where frontend is running)
# Browser console (F12 in browser)
```

## MongoDB Commands

### View Collections
```javascript
// In MongoDB shell
use fertilizer-ecommerce
show collections
db.products.find().pretty()
db.users.find().pretty()
db.orders.find().pretty()
```

### Count Documents
```javascript
db.products.countDocuments()
db.users.countDocuments()
db.orders.countDocuments()
```

### Find Specific Data
```javascript
// Find all organic products
db.products.find({ category: "Organic" })

// Find all pending orders
db.orders.find({ status: "pending" })

// Find user by email
db.users.findOne({ email: "farmer@test.com" })
```

---

**Keep this file handy for quick reference! 📌**
