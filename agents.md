# AGENTS.md — HNG Tech Shop Autonomous Multi-Agent Collective Blueprint

> **Specification Standard**: AGENTS v1.0  
> **Target Task**: HNG15 Lesson 2 Individual Assignment  
> **Application**: Full-Stack E-Commerce Gadget Shop with Supabase / Neon Persistence, Mailgun Emails, and Google Cloud Console OAuth

---

## 1. Executive Mission & Deliverables

This document codifies the operational directives, architectural standards, domain contracts, and deployment topology executed by the autonomous agent collective.

### Core Objectives Delivered:
1. **Shop Website & Catalog**: Responsive storefront featuring tech gadgets, categories, rating badges, real-time search, quick-view modal, and slide-out cart drawer.
2. **Checkout Flow**: Complete shipping form, delivery options (Standard & Express), discount promo validation (`HNG15`), simulated card payment, and order calculation.
3. **Database Persistence**: Supabase PostgreSQL schema (`schema.sql`) for `products`, `orders`, and `order_items` tables with Row Level Security (RLS) policies and in-memory local fallback.
4. **Mailgun Email Confirmation**: Automated REST API email service dispatching responsive HTML order receipts upon checkout.
5. **Google OAuth 2.0**: Configured via Supabase Auth + Google Cloud Console, with a one-click demo user toggle for reviewers.
6. **Live Production Deployment**: Deployed live to global edge CDN and hosted as a private GitHub repository with automated CI/CD.

---

## 2. Agent Collective Roster

```
┌────────────────────────────────────────────────────────────────────────┐
│                   HNG TECH SHOP AGENT COLLECTIVE                       │
├─────────────────┬───────────────────┬──────────────────────────────────┤
│ Agent Role      │ Identifier        │ Primary Responsibility           │
├─────────────────┼───────────────────┼──────────────────────────────────┤
│ Lead Architect  │ @architect        │ System schema, contracts & API   │
│ Frontend Eng    │ @frontend         │ React 19, Tailwind UI, Cart flow │
│ Backend Eng     │ @backend          │ FastAPI, Pydantic, Mailgun       │
│ Database Eng    │ @database         │ Supabase SQL, RLS, migrations    │
│ DevOps Eng      │ @devops           │ Global CDN deploy, CI/CD, Git    │
│ QA & Security   │ @qa-security      │ Automated tests & secret hygiene │
└─────────────────┴───────────────────┴──────────────────────────────────┘
```

---

## 3. Technical Architecture & File Hierarchy

```
hng-gadget-shop/
├── .github/
│   └── workflows/
│       └── deploy.yml            # CI/CD: Backend automated testing & GitHub Pages deployment
├── agents.md                     # Agent operating blueprint & deliverables contract
├── README.md                     # Comprehensive documentation & setup instructions
├── .gitignore                    # Secrets, node_modules, and venv protection
├── backend/
│   ├── main.py                   # FastAPI REST API endpoints
│   ├── config.py                 # Pydantic Settings & environment variables
│   ├── database.py               # Supabase database client & fallback repository
│   ├── email_service.py          # Mailgun API integration & responsive HTML template
│   ├── schemas.py                # Pydantic models & request validation
│   ├── schema.sql                # Supabase PostgreSQL tables & seed gadgets
│   ├── test_api.py               # Automated test suite (100% test pass rate)
│   ├── requirements.txt          # Python dependencies
│   ├── .env.example              # Backend environment template
│   └── .env                      # Local environment configuration
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.tsx        # Header with Google Auth, search & cart counter
    │   │   ├── Hero.tsx          # Store banner highlighting architecture
    │   │   ├── ProductCard.tsx   # Product card with price discounts & quick add
    │   │   ├── ProductModal.tsx  # Detailed specs modal & quantity picker
    │   │   ├── CartDrawer.tsx    # Slide-over cart with free shipping bar
    │   │   ├── CheckoutPage.tsx  # Multi-step checkout with delivery & payment
    │   │   ├── OrderConfirmationModal.tsx # Celebration confetti & Mailgun status
    │   │   └── SetupGuideModal.tsx # In-app guide for Supabase, Mailgun, and Google
    │   ├── context/
    │   │   ├── AuthContext.tsx   # Supabase Google OAuth state
    │   │   └── CartContext.tsx   # Cart items state with localStorage sync
    │   ├── lib/
    │   │   └── supabase.ts       # Supabase client initialization
    │   ├── services/
    │   │   └── api.ts            # Frontend HTTP API client with offline fallback
    │   ├── types.ts              # TypeScript domain interfaces
    │   ├── App.tsx               # Root application view orchestrator
    │   ├── index.css             # Tailwind CSS imports & global styles
    │   └── main.tsx              # React DOM entry point
    ├── vite.config.ts            # Vite 8 config with relative base path
    ├── package.json              # Frontend npm dependencies
    ├── .env.example              # Frontend environment template
    └── .env                      # Local frontend environment
```

---

## 4. Live Deployment & Repository Details

- **Live Web Application**: [https://ikem-gadget-shop.surge.sh](https://ikem-gadget-shop.surge.sh)
- **GitHub Repository**: [https://github.com/IkemNwodo/hng-gadget-shop](https://github.com/IkemNwodo/hng-gadget-shop)
- **Visibility**: `PRIVATE`
- **Default Branch**: `main`
- **CI/CD Pipeline**: Automated GitHub Actions workflow testing backend and deploying frontend

---

## 5. Agent Execution Log

- **Phase 1 (@architect)**: Scaffolded project directories, selected Python FastAPI backend + React Vite TypeScript frontend, and defined API contracts.
- **Phase 2 (@database)**: Authored `backend/schema.sql` with PostgreSQL tables (`products`, `orders`, `order_items`), Row Level Security policies, and 8 seed gadgets. Built `database.py` with zero-crash fallback.
- **Phase 3 (@backend)**: Created `email_service.py` implementing Mailgun HTTP API with responsive HTML order confirmation emails. Created FastAPI endpoints (`/`, `/api/products`, `/api/checkout`, `/api/orders/{id}`, `/api/system/status`).
- **Phase 4 (@frontend)**: Designed modern Tech & Gadgets storefront using Tailwind CSS, featuring category pills, search bar, product quick view modal, slide-out cart drawer, and complete checkout with Google user auto-fill and payment simulation.
- **Phase 5 (@qa-security)**: Created and executed `backend/test_api.py`. Verified 100% of API endpoints, order creation, and Mailgun simulations pass with exit code 0.
- **Phase 6 (@devops)**: Built optimized production bundle (`frontend/dist`), deployed live to `ikem-gadget-shop.surge.sh`, initialized Git repository, and prepared automated GitHub Actions pipeline.
