# Marbine Memories — Deployment Guide

## Architecture

| Layer | Hosting | Tech |
|---|---|---|
| **Frontend (React SPA)** | Vercel | React 19 + Vite 8 |
| **Backend (API)** | Render | Node.js + Express |
| **Database** | Railway | MySQL |

---

## 1. Database — Railway MySQL

### Steps

1. Go to [railway.app](https://railway.app) → **New Project** → **Provision MySQL**
2. Once created, go to the MySQL dashboard and copy these values:
   - `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`
3. **Enable Public Networking** — go to **Networking** tab and click **Generate Public Network**
4. Copy the public connection string — it looks like:
   ```
   mysql://<user>:<password>@<host>:<port>/<database>
   ```
5. **Import the schema** using any MySQL client (e.g., MySQL Workbench, TablePlus, or CLI):
   ```bash
   mysql -h <host> -P <port> -u <user> -p <database> < database.sql
   ```
6. **Create the admin user** (run from your local machine):
   ```bash
   cd server
   node scripts/create-admin.js
   ```
   This creates the admin: **marbine18@gmail.com** / **marbine@18**

---

## 2. Backend — Render

### Steps

1. Push the code to GitHub (or GitLab/Bitbucket)

2. Go to [render.com](https://render.com) → **New Web Service** → Connect your repo

3. Configure:

   | Setting | Value |
   |---|---|
   | **Root Directory** | `server` |
   | **Runtime** | Node |
   | **Build Command** | `npm install` |
   | **Start Command** | `node index.js` |
   | **Plan** | Free |

4. Add these **Environment Variables** (use the values from Railway MySQL):

   ```
   PORT=10000
   NODE_ENV=production

   DB_HOST=<railway-mysql-host>
   DB_PORT=3306
   DB_USER=<railway-mysql-user>
   DB_PASSWORD=<railway-mysql-password>
   DB_NAME=<railway-mysql-database>
   DB_SSL=true

   JWT_SECRET=<generate-a-random-string>
   JWT_EXPIRES_IN=7d

   ADMIN_EMAILS=marbine18@gmail.com

   FRONTEND_URL=https://marbine-memories.vercel.app
   CORS_ORIGIN=https://marbine-memories.vercel.app
   ```

5. **Deploy** — Render will build and start the server

6. After deployment, note your Render URL (e.g., `https://marbine-memories-api.onrender.com`)

---

## 3. Frontend — Vercel

### Steps

1. Go to [vercel.com](https://vercel.com) → **Add New Project** → Import your repo

2. Configure:

   | Setting | Value |
   |---|---|
   | **Root Directory** | `client` |
   | **Framework Preset** | Vite |
   | **Build Command** | `npm run build` |
   | **Output Directory** | `dist` |

3. Add the **Environment Variable**:

   ```
   VITE_API_URL=https://marbine-memories-api.onrender.com
   ```

4. **Deploy** — Vercel will build and deploy the React app

---

## 4. Environment Variables Reference

### Backend (`server/.env`)

| Variable | Required | Description |
|---|---|---|
| `PORT` | Yes | Render sets this automatically |
| `DB_HOST` | Yes | Railway MySQL hostname |
| `DB_PORT` | Yes | Railway MySQL port |
| `DB_USER` | Yes | Database user |
| `DB_PASSWORD` | Yes | Database password |
| `DB_NAME` | Yes | Database name |
| `DB_SSL` | No | Set to `true` for Railway MySQL |
| `JWT_SECRET` | Yes | Secret for JWT signing |
| `JWT_EXPIRES_IN` | No | Token expiry (default: `7d`) |
| `ADMIN_EMAILS` | Yes | `marbine18@gmail.com` |
| `FRONTEND_URL` | Yes | Vercel frontend URL |
| `CORS_ORIGIN` | Yes | Vercel frontend URL |

### Frontend (`client/.env`)

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | Yes | Render backend URL |

---

## 5. Post-Deployment Checks

- [ ] Visit `https://marbine-memories-api.onrender.com/api/anniversary` — should return JSON
- [ ] Login at `https://marbine-memories.vercel.app` with **marbine18@gmail.com** / **marbine@18**
- [ ] Admin dashboard loads at `/admin`
- [ ] Timeline, memories, gallery pages work
- [ ] File uploads work (test with a gallery image)

---

## 6. Local Development

```bash
# Backend
cd server
cp .env.example .env    # edit with your local MySQL creds
npm install
npm run dev

# Frontend (separate terminal)
cd client
npm install
npm run dev
```

The Vite dev server proxies `/api` to `http://localhost:5000` automatically.
