# Deploy NrityaAI Community + Chatbot

You deploy **two parts**:

| Part | What it is | Where to host |
|------|------------|---------------|
| **Backend** | FastAPI (`backend/`) — channels, posts, chat | [Render](https://render.com) (free tier) |
| **Frontend** | React app (`frontend/`) — UI users see | [Vercel](https://vercel.com) (free tier) |

You also need:

- A **GitHub** account (both platforms deploy from GitHub)
- An **OpenRouter API key** for the chatbot ([openrouter.ai](https://openrouter.ai))

---

## Part 0 — On your computer (one-time prep)

### 0.1 Push code to GitHub

**Where:** Your PC → GitHub website

1. Create a new repo on GitHub (e.g. `nritya-community`), empty, no README.
2. In PowerShell:

```powershell
cd C:\Users\KNSRIKANTA\OneDrive\Desktop\nritya-comm
git init
git add NrityaAI-community-chatbot
git commit -m "Initial commit: community and chatbot"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

Replace `YOUR_USERNAME` and `YOUR_REPO` with yours.

> Do **not** commit `.env` files with real API keys. Only commit `.env.example`.

### 0.2 Create OpenRouter key

**Where:** [https://openrouter.ai/keys](https://openrouter.ai/keys)

1. Sign up / log in.
2. Create an API key.
3. Copy it — you will paste it into Render later (not into GitHub).

### 0.3 Test build locally (optional)

```powershell
cd NrityaAI-community-chatbot\frontend
npm install
npm run build
```

If that succeeds, the frontend is ready for Vercel.

---

## Part 1 — Deploy the backend (Render)

**Where:** [https://dashboard.render.com](https://dashboard.render.com)

### 1.1 New Web Service

1. **Sign up** with GitHub.
2. Click **New +** → **Web Service**.
3. Connect your GitHub repo.
4. Select the repository you pushed.

### 1.2 Settings

| Field | Value |
|-------|--------|
| **Name** | `nritya-api` (or any name) |
| **Region** | Singapore or closest to you |
| **Branch** | `main` |
| **Root Directory** | `NrityaAI-community-chatbot/backend` |
| **Runtime** | Python 3 |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |

### 1.3 Environment variables

In Render → your service → **Environment**:

| Key | Value |
|-----|--------|
| `OPENROUTER_API_KEY` | Your OpenRouter key from Part 0.2 |

Click **Save**.

### 1.4 Deploy

1. Click **Create Web Service** (or **Deploy**).
2. Wait until status is **Live** (green).
3. Copy your URL, e.g. `https://nritya-api.onrender.com`
4. Test in browser: `https://YOUR-URL.onrender.com/health`  
   Should show: `{"status":"healthy"}`

**Note:** Free Render apps sleep after ~15 min idle; first request may take 30–60 seconds to wake up.

**Database:** The app uses SQLite (`nritya.db`). On Render, data may reset when the service redeploys. Fine for demos; for a permanent site, upgrade to PostgreSQL later.

---

## Part 2 — Deploy the frontend (Vercel)

**Where:** [https://vercel.com](https://vercel.com)

### 2.1 Import project

1. **Sign up** with GitHub.
2. **Add New…** → **Project**.
3. Import the same GitHub repo.

### 2.2 Settings

| Field | Value |
|-------|--------|
| **Framework Preset** | Create React App |
| **Root Directory** | `NrityaAI-community-chatbot/frontend` |
| **Build Command** | `npm run build` (default) |
| **Output Directory** | `build` (default) |

### 2.3 Environment variable (required)

Under **Environment Variables**, add:

| Name | Value |
|------|--------|
| `REACT_APP_API_URL` | Your Render URL from Part 1, e.g. `https://nritya-api.onrender.com` |

No trailing slash.

### 2.4 Deploy

1. Click **Deploy**.
2. When done, Vercel gives a URL like `https://your-app.vercel.app`
3. Open it — you should see **NrityaAI COMMUNITY**.

### 2.5 CORS

The backend already allows all origins (`allow_origins=["*"]`), so the Vercel site can call Render without extra CORS setup.

---

## Part 3 — Verify everything works

**Where:** Your live Vercel URL

| Check | What to do |
|-------|------------|
| Channels load | Home page shows channel cards (or empty list) |
| Create channel | Click **+**, create a channel |
| Chatbot | Click 💬, ask a Bharatanatyam question |
| API linked | If channels never load, check `REACT_APP_API_URL` on Vercel and redeploy |

**If chatbot returns an error:** Check `OPENROUTER_API_KEY` on Render and redeploy the backend.

**If frontend shows errors in browser console (network):**  
- Backend URL wrong in Vercel  
- Backend still waking up (wait and refresh)  
- Backend deploy failed (check Render logs)

---

## Quick reference — where to do what

| Task | Where |
|------|--------|
| Store code | GitHub |
| Run API | Render → Web Service → `backend` folder |
| Chat API key | Render → Environment → `OPENROUTER_API_KEY` |
| Host website | Vercel → Project → `frontend` folder |
| Point UI to API | Vercel → Environment → `REACT_APP_API_URL` |
| Local dev API | `backend/.env` with `OPENROUTER_API_KEY` |
| Local dev UI | `frontend/.env` with `REACT_APP_API_URL=http://127.0.0.1:8000` |

---

## Local development (unchanged)

**Terminal 1 — backend:**

```powershell
cd NrityaAI-community-chatbot\backend
pip install -r requirements-community.txt
# Create .env with OPENROUTER_API_KEY=...
uvicorn app.main:app --reload
```

**Terminal 2 — frontend:**

```powershell
cd NrityaAI-community-chatbot\frontend
npm install
npm start
```

Open http://localhost:3000

---

## Alternative: Netlify instead of Vercel

Same idea:

1. [https://app.netlify.com](https://app.netlify.com) → Import from GitHub  
2. Base directory: `NrityaAI-community-chatbot/frontend`  
3. Build: `npm run build`  
4. Publish: `build`  
5. Env var: `REACT_APP_API_URL` = your Render URL  

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Blank channels, failed requests | Set `REACT_APP_API_URL` on Vercel, redeploy |
| `Module not found` on Render | Root Directory must be `NrityaAI-community-chatbot/backend` |
| Chat always errors | Add/fix `OPENROUTER_API_KEY` on Render |
| Slow first load | Normal on Render free tier (cold start) |
| Data disappeared after redeploy | SQLite on free hosting is ephemeral; use PostgreSQL for production |
