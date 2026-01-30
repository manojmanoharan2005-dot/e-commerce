# 🚀 Deployment Guide: Fertilizer Mart

Follow these exact steps to get your AI-powered e-commerce platform live.

## 1. Backend Deployment (Render)
**Goal**: Get your Node.js API running.

1.  **Login to Render**: [dashboard.render.com](https://dashboard.render.com)
2.  **New +**: Select **Web Service**.
3.  **Connect GitHub**: Select your `e-commerce` repository.
4.  **Configuration**:
    *   **Name**: `fertilizer-backend` (or any name)
    *   **Root Directory**: `backend`
    *   **Environment**: `Node`
    *   **Build Command**: `npm install`
    *   **Start Command**: `npm start`
5.  **Environment Variables**: (Click "Advanced" > "Add Environment Variable")
    *   `MONGODB_URI`: *Paste your MongoDB connection string*
    *   `GEMINI_API_KEY`: *Paste your Google Gemini API key*
    *   `JWT_SECRET`: *Create a random string (e.g., asd897asd98as7d98)*
    *   `PORT`: `5000`
    *   `FRONTEND_URL`: *Set this to `https://yourname.vercel.app` after Phase 2 is done*

---

## 2. Frontend Deployment (Vercel)
**Goal**: Get your React app running.

1.  **Login to Vercel**: [vercel.com](https://vercel.com)
2.  **Add New**: Select **Project**.
3.  **Connect GitHub**: Import the `e-commerce` repository.
4.  **Configuration**:
    *   **Framework Preset**: Vite
    *   **Root Directory**: `frontend`
    *   **Output Directory**: `dist`
5.  **Environment Variables**:
    *   `VITE_API_URL`: *Paste your Render URL + `/api` (e.g., `https://fertilizer-backend.onrender.com/api`)*

---

## 💡 Important Tips
*   **Free Tier Sleep**: Render's free tier "spins down" after 15 mins of inactivity. The first time you open the site, it might take **30-60 seconds** to load. This is normal.
*   **CORS Fix**: Once Vercel is live, copy its URL and update the `FRONTEND_URL` in Render's Env variables so your backend allows requests from your site.
