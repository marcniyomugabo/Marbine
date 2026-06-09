# Marbine Memories — Deployment Guide

## Architecture

| Layer | Hosting | Tech |
|---|---|---|
| **Frontend (React SPA)** | Vercel | React 19 + Vite 8 |
| **Backend (API + Landing)** | Render | Node.js + Express |
| **Database** | Railway | MySQL (via mysql2) |

---

## 1. Database — Railway MySQL

### Steps

1. **Create a Railway account** at [railway.app](https://railway.app)
2. **Start a new project** → **Provision MySQL**
3. Once provisioned, copy the **connection details** from the Railway dashboard:
   - `MYSQL_HOST` (hostname)
   - `MYSQL_PORT` (usually 3306)
   - `MYSQL_USER` (username)
   - `MYSQL_PASSWORD` (password)
   - `MYSQL_DATABASE` (database name)
4. **Import the schema** using Railway's CLI or any MySQL client:
   ```bash
   mysql -h <host> -P <port> -u <user> -p <database> < database.sql
   ```
5. Enable **Public Networking** in Railway so Render can connect.

---

## 2. Backend — Render

### Steps

1. **Push your code to GitHub** (or GitLab/Bitbucket).
2. **Go to [render.com](https://render.com)** → **New Web Service** → Connect your repository.
3. Configure the service:

   | Setting | Value |
   |---|---|
   | **Name** | `marbine-memories-api` |
   | **Root Directory** | `server` |
   | **Runtime** | Node |
   | **Build Command** | `npm install` |
   | **Start Command** | `npm start` |
   | **Plan** | Free or Starter |

4. Add the following **Environment Variables**:

   ```
   PORT=10000
   NODE_ENV=production
   
   # Database (from Railway)
   DB_HOST=<railway-mysql-host>
   DB_PORT=3306
   DB_USER=<railway-mysql-user>
   DB_PASSWORD=<railway-mysql-password>
   DB_NAME=marbine_memories
   DB_SSL=true
   
   # JWT
   JWT_SECRET=<generate-a-strong-random-string>
   JWT_EXPIRES_IN=7d
   
   # Admin emails (comma-separated)
   ADMIN_EMAILS=marc@example.com,blandine@example.com
   
   # SMTP (for contact form)
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-gmail-app-password
   
   # Feedback recipients
   FEEDBACK_EMAIL_1=admin1@example.com
   FEEDBACK_EMAIL_2=admin2@example.com
   
   # Frontend URL (must match Vercel app URL exactly)
   FRONTEND_URL=https://marbine-memories.vercel.app
   
   # CORS origin (comma-separated for multiple domains)
   CORS_ORIGIN=https://marbine-memories.vercel.app
   ```

5. **Deploy** — Render will build and start the server automatically.
6. Note your Render URL: `https://marbine-memories-api.onrender.com`

---

## 3. Frontend — Vercel

### Steps

1. **Push your code to GitHub** (same repo as backend).
2. **Go to [vercel.com](https://vercel.com)** → **Add New Project** → Import your repository.
3. Configure the project:

   | Setting | Value |
   |---|---|
   | **Root Directory** | `client` |
   | **Framework Preset** | Vite |
   | **Build Command** | `npm run build` (auto-detected) |
   | **Output Directory** | `dist` (auto-detected) |

4. Add the **Environment Variable**:

   ```
   VITE_API_URL=https://marbine-memories-api.onrender.com
   ```

5. **Deploy** — Vercel will build and deploy the React app.
6. Note your Vercel URL: `https://marbine-memories.vercel.app`

---

## 4. Environment Variables Reference

### Backend (`server/.env`)

| Variable | Required | Description |
|---|---|---|
| `PORT` | Yes | Server port (Render sets this automatically) |
| `DB_HOST` | Yes | Railway MySQL hostname |
| `DB_PORT` | Yes | Railway MySQL port (default: 3306) |
| `DB_USER` | Yes | Database user |
| `DB_PASSWORD` | Yes | Database password |
| `DB_NAME` | Yes | Database name |
| `DB_SSL` | No | Set to `true` for Railway MySQL (required) |
| `JWT_SECRET` | Yes | Secret key for JWT signing (strong random string) |
| `JWT_EXPIRES_IN` | No | Token expiry (default: `7d`) |
| `ADMIN_EMAILS` | Yes | Comma-separated list of admin emails |
| `SMTP_USER` | No | Gmail address for sending feedback emails |
| `SMTP_PASS` | No | Gmail app password |
| `FEEDBACK_EMAIL_1` | No | Primary feedback recipient |
| `FEEDBACK_EMAIL_2` | No | Secondary feedback recipient |
| `FRONTEND_URL` | Yes | Vercel frontend URL (for CORS + login redirect) |
| `CORS_ORIGIN` | Yes | CORS allowed origins (comma-separated or `*`) |

### Frontend (`client/.env`)

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | Yes | Render backend URL (e.g., `https://marbine-memories-api.onrender.com`) |

---

## 5. Post-Deployment Checks

### Backend
- [ ] Health check: `GET https://marbine-memories-api.onrender.com/api/anniversary` returns JSON
- [ ] CORS is working: frontend can call backend without errors
- [ ] Database connection is successful (check Render logs)
- [ ] File uploads work (upload a memory/gallery image)

### Frontend
- [ ] Login page loads and authentication works
- [ ] All pages render without console errors
- [ ] API calls reach the correct backend URL
- [ ] Production build has no broken assets

### Database
- [ ] All tables were created from `database.sql`
- [ ] Admin users can register/login
- [ ] Data persists across server restarts

---

## 6. Local Development

```bash
# Backend
cd server
cp .env.example .env   # fill in your local DB creds
npm install
npm run dev

# Frontend (in a separate terminal)
cd client
cp .env.example .env.local
npm install
npm run dev
```

The Vite dev server proxies `/api` to `http://localhost:5000` automatically.

---

## 7. Troubleshooting

| Problem | Solution |
|---|---|
| `ECONNREFUSED` on DB | Check Railway Public Networking is enabled |
| CORS errors in browser | Verify `CORS_ORIGIN` matches the exact Vercel URL |
| Login redirects wrong | Check `FRONTEND_URL` env var on Render |
| File uploads 404 | Express serves `/uploads` statically; ensure `server/uploads/` exists |
| `ERR_SSL` on DB | Set `DB_SSL=true` for Railway MySQL |
| Build fails on Vercel | Ensure `client/` is the root directory and `npm install` succeeds |
