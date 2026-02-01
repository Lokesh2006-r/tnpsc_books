# Deployment Guide: Fixing the "Network Error" (404 / CORS)

Currently, your **Frontend** is on Vercel (public internet), but your **Backend** is still likely on your local computer (`localhost`). Vercel cannot see your local computer. You need to put your Backend on the internet too.

Here is the step-by-step fix.

## Phase 1: Deploy Backend to Render (Free)

1.  **Push your latest code to GitHub** (I will help you do this in a moment). The latest push includes the CORS fix I just made.
2.  Go to [dashboard.render.com](https://dashboard.render.com/register) and Sign Up/Login (you can use your GitHub account).
3.  Click **New +** -> **Web Service**.
4.  Connect your GitHub repository (`tnpsc_books`).
5.  **Configure the Service**:
    *   **Name**: `tnpsc-backend` (or similar)
    *   **Root Directory**: `backend` (Important! Tell it to look in the backend folder)
    *   **Environment**: `Node`
    *   **Build Command**: `npm install`
    *   **Start Command**: `npm start` (or `node server.js`)
6.  **Environment Variables** (Click "Advanced" or "Environment"):
    *   Add `MONGO_URI`: (Copy this from your local `.env` file)
    *   Add `JWT_SECRET`: (Copy this from your local `.env` file)
    *   Add `NODE_ENV`: `production`
7.  Click **Create Web Service**.
8.  Wait for it to deploy. Once finished, it will give you a URL like `https://tnpsc-backend.onrender.com`. **Copy this URL.**

## Phase 2: Update Frontend on Vercel

1.  Go to your Vercel Dashboard and select your project.
2.  Go to **Settings** -> **Environment Variables**.
3.  Find `NEXT_PUBLIC_API_URL`.
4.  Click **Edit** (or Add New if it's missing).
5.  **Value**: Paste your NEW Backend URL from Render:
    `https://tnpsc-books.onrender.com`
    *   *Note: Do not add a trailing slash `/` at the end.*
6.  Click **Save**.
7.  Go to **Deployments** tab.
8.  Click the **three dots** on the latest deployment -> **Redeploy**. (This is required for the new environment variable to take effect).

## Phase 3: Verify

1.  Once Vercel redeploys, open your website.
2.  Check the inspection console. The errors pointing to `localhost:5000` should be gone, and it should now be talking to `onrender.com`.
