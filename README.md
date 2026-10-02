# ⚡ HNG Tech Shop — Full-Stack E-Commerce Platform

<div align="center">

**A modern, production-grade e-commerce storefront for premium tech gadgets.**  
*Persisted with Supabase/Neon PostgreSQL, Mailgun confirmation delivery, and Google Cloud Console OAuth.*

[![Live Demo](https://img.shields.io/badge/Live%20Web%20App-Online-success?style=for-the-badge&logo=google-chrome&logoColor=white)](https://ikem-gadget-shop.surge.sh)
[![GitHub Private Repo](https://img.shields.io/badge/GitHub-Private%20Repository-blue?style=for-the-badge&logo=github)](https://github.com/IkemNwodo/hng-gadget-shop)
[![Specification](https://img.shields.io/badge/Specification-AGENTS.md%20v1.0-purple?style=for-the-badge)](./agents.md)
[![Supabase](https://img.shields.io/badge/Database-Supabase%20Postgres-emerald?style=for-the-badge&logo=supabase)](https://supabase.com)
[![Mailgun](https://img.shields.io/badge/Email-Mailgun%20API-red?style=for-the-badge&logo=mailgun)](https://mailgun.com)

</div>

> **HNG15 Lesson 2 Individual Task:**  
> *Build a website for a shop. Add a check-out page. Persist everything in a database using Supabase/Neon. Send confirmation emails using Mailgun. Do Google auth using Google Cloud Console.*

---

## 🌟 Highlights & Architecture

- **Shop Catalog & Cart**: Modern Tech & Gadgets store built with React 19, TypeScript, and Tailwind CSS. Features dynamic category filtering, search, quick-view modal, live badge discounts, and a slide-over cart drawer with free-shipping threshold calculation.
- **Interactive Checkout**: Multi-step checkout with delivery methods (Standard & Priority Air Express), simulated credit/debit card processing, promo code support (`HNG15`), order totals computation, and pre-fill from Google account.
- **Database Persistence**: Supabase PostgreSQL database persisting `products`, `orders`, and `order_items` with Row Level Security (RLS) policies. Includes zero-crash in-memory fallback for out-of-the-box local testing.
- **Mailgun Email Dispatch**: REST API email service triggering branded, responsive HTML order confirmations with order ID, itemized breakdowns, delivery destination, and total charges.
- **Google OAuth 2.0**: Integrated via Google Cloud Console credentials wired directly through Supabase Auth, with a one-click demo user login for testability.

---

## 📂 Project Structure

```
hng-gadget-shop/
├── backend/
│   ├── .venv/                   # Python virtual environment
│   ├── config.py                # Pydantic Settings & environment variables
│   ├── database.py              # Supabase DB client & query operations
│   ├── email_service.py         # Mailgun API integration & responsive HTML template
│   ├── main.py                  # FastAPI application with REST endpoints
│   ├── requirements.txt         # Backend Python dependencies
│   ├── schema.sql               # Ready-to-run Supabase PostgreSQL migration & seeds
│   ├── schemas.py               # Pydantic models & request validation
│   ├── test_api.py              # Automated API & checkout test suite
│   ├── .env.example             # Backend configuration template
│   └── .env                     # Local environment file
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx       # Header with Google Auth, categories, search, cart badge
│   │   │   ├── Hero.tsx         # Gadget store hero banner
│   │   │   ├── ProductCard.tsx  # Product tile with ratings, price, quick add
│   │   │   ├── ProductModal.tsx # Full product specs and quantity picker
│   │   │   ├── CartDrawer.tsx   # Slide-out cart with shipping progress
│   │   │   ├── CheckoutPage.tsx # Checkout flow with delivery and payment
│   │   │   ├── OrderConfirmationModal.tsx # Celebration confetti & Mailgun receipt status
│   │   │   └── SetupGuideModal.tsx # Interactive in-app setup guide
│   │   ├── context/
│   │   │   ├── AuthContext.tsx  # Supabase Google OAuth state
│   │   │   └── CartContext.tsx  # Cart items state with localStorage sync
│   │   ├── lib/
│   │   │   └── supabase.ts      # Supabase client setup & auth helpers
│   │   ├── services/
│   │   │   └── api.ts           # Frontend HTTP API client
│   │   ├── App.tsx              # Root React component
│   │   ├── main.tsx             # React entry point
│   │   └── types.ts             # TypeScript definitions
│   ├── package.json
│   ├── vite.config.ts
│   ├── .env.example             # Frontend configuration template
│   └── .env                     # Local environment file
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18+) & **npm**
- **Python** (v3.10+)

---

### 2. Backend Setup (FastAPI)

1. Open your terminal in the `backend/` directory:
   ```bash
   cd backend
   ```

2. Activate the existing virtual environment:
   - **Windows (PowerShell):**
     ```powershell
     .\.venv\Scripts\Activate.ps1
     # Or run directly with .\.venv\Scripts\python.exe
     ```
   - **macOS / Linux:**
     ```bash
     source .venv/bin/activate
     ```

3. Configure your environment variables:
   Copy `.env.example` to `.env` and fill in your credentials (or test with defaults):
   ```env
   # Supabase Configuration
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_KEY=your-anon-or-service-role-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

   # Mailgun Configuration
   MAILGUN_API_KEY=key-xxxxxxxxxxxxxxxxxxxxxxxx
   MAILGUN_DOMAIN=sandbox-or-your-domain.mailgun.org
   MAILGUN_API_BASE_URL=https://api.mailgun.net/v3
   MAILGUN_FROM_EMAIL=HNG Tech Shop <postmaster@sandbox-or-your-domain.mailgun.org>

   FRONTEND_URL=http://localhost:5173
   ```

4. Run the automated test suite to verify everything works:
   ```bash
   .\.venv\Scripts\python.exe test_api.py
   ```

5. Start the FastAPI development server:
   ```bash
   .\.venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000
   ```
   API will be running at: **`http://localhost:8000`**  
   Interactive Swagger docs: **`http://localhost:8000/docs`**

---

### 3. Frontend Setup (React + Vite)

1. Open a new terminal in the `frontend/` directory:
   ```bash
   cd frontend
   ```

2. Configure environment variables in `frontend/.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   Open your browser at: **`http://localhost:5173`**

---

## 🛠️ Step-by-Step Integration Setup

### A. Supabase Database Setup
1. Create a free account and new project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** tab in your Supabase dashboard.
3. Open [`backend/schema.sql`](file:///C:/Users/Ikem/Documents/Development/hng-gadget-shop/backend/schema.sql) and paste its entire contents into the SQL Editor, then click **Run**.
4. This will:
   - Create the `products`, `orders`, and `order_items` tables.
   - Configure Row Level Security (RLS) policies.
   - Seed 8 premium gadget products with pricing and images.
5. In **Project Settings → API**, copy your **Project URL**, **Anon Key**, and **service_role Key**.
6. Place them in `backend/.env` and `frontend/.env`.

---

### B. Google Cloud Console OAuth Setup
1. Go to the [Google Cloud Console](https://console.cloud.google.com).
2. Create a project or select an existing one.
3. Go to **APIs & Services → OAuth consent screen**:
   - Choose **External**.
   - Fill in App name (*HNG Tech Shop*), User support email, and Developer contact email.
4. Go to **APIs & Services → Credentials → Create Credentials → OAuth client ID**:
   - Application type: **Web application**.
   - Name: *HNG Tech Shop Client*.
   - Authorized redirect URIs:
     ```
     https://<your-supabase-project-id>.supabase.co/auth/v1/callback
     ```
5. Click **Create** and copy your **Client ID** and **Client Secret**.
6. In your **Supabase Dashboard**:
   - Navigate to **Authentication → Providers → Google**.
   - Enable Google.
   - Paste your **Client ID** and **Client Secret**, then click **Save**.
7. In the store, clicking **Sign in with Google** will authenticate via Google OAuth.

---

### C. Mailgun Confirmation Emails Setup
1. Log in or create a free account at [mailgun.com](https://mailgun.com).
2. In the dashboard, go to **Sending → Domains**:
   - Use your default sandbox domain (e.g. `sandbox123.mailgun.org`) or add a verified domain.
   - *Note for Sandbox domains*: In the Sandbox overview, add your test email to **Authorized Recipients** so Mailgun allows delivery.
3. In **API Security / API Keys**, copy your Private Sending API key.
4. Add the credentials to `backend/.env`:
   ```env
   MAILGUN_API_KEY=your_mailgun_api_key
   MAILGUN_DOMAIN=your_domain_or_sandbox.mailgun.org
   MAILGUN_API_BASE_URL=https://api.mailgun.net/v3
   MAILGUN_FROM_EMAIL=HNG Tech Shop <postmaster@your_domain_or_sandbox.mailgun.org>
   ```
5. Whenever an order is completed, the backend triggers an HTML confirmation email to the buyer.

---

## 🧪 Testing Checklist

| Requirement | Implementation | Status |
|---|---|:---:|
| **Shop website** | Responsive product catalog, search, category pills, rating badges, quick-view modal | ✅ Tested & Working |
| **Check-out page** | Multi-step form, delivery options, simulated card inputs, promo code, order summary | ✅ Tested & Working |
| **Persist in DB (Supabase/Neon)** | PostgreSQL tables (`products`, `orders`, `order_items`) with RLS + seeds in `schema.sql` | ✅ Tested & Working |
| **Confirmation emails (Mailgun)** | Mailgun HTTP API service + responsive HTML receipt template | ✅ Tested & Working |
| **Google auth (Google Cloud Console)** | Supabase Google OAuth integration + 1-click test demo account | ✅ Tested & Working |

---

## 📄 License
MIT License. Built for HNG15 Internship.
