# Sokoline Frontend ⚡

This is the Next.js frontend for the Sokoline marketplace, an institutional-grade commerce infrastructure explicitly optimized for student-led micro-ventures.

## 🚀 Key Innovations

### 1. Headless Decoupled Architecture
Sokoline leverages **Next.js 15+ (App Router)** on the edge and **Django 6.0 REST Framework** on the backend. This decoupling allows for independent scaling and sub-second page loads even over high-latency 3G/4G networks.

### 2. Agentic AI Discovery
The search interface is powered by **Gemini 1.5 Pro**. It uses functional tool-calling to ground natural language user intent (e.g., "Find me red sneakers under 5k") into deterministic backend queries, providing a conversational shopping experience.

### 3. Viral Growth Engine (Affiliate Hub)
A built-in referral tracking system (`ReferralTracker.tsx`) manages 24-hour session persistence for influencer links. The system automatically attributes commissions to influencers during the checkout process.

### 4. Zero-Latency Authentication
Integrated with **Clerk**, the frontend utilizes a custom `proxy.ts` and middleware-based JWT handling to ensure that authenticated routes are served without external network round-trips for session verification.

## 🛠️ Tech Stack
- **Framework**: Next.js 15+ (App Router, RSC, Suspense)
- **Styling**: Tailwind CSS 4 (OKLCH Color Palette)
- **Icons**: Lucide React
- **Components**: Radix UI / Shadcn
- **State Management**: URL-based State + React Server Components
- **Auth**: Clerk (Multi-tenant)
- **Testing**: Vitest + Testing Library

## 🚦 Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment
Create a `.env.local` file with your credentials:
```text
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
NEXT_PUBLIC_API_URL=https://api.sokoline.app/api
NEXT_PUBLIC_CLERK_PROXY_URL=...
```

### 3. Run Development Server
```bash
npm run dev
```

## 📦 Architecture Highlights

- **Server Components (RSC)**: Used for heavy data fetching to minimize the JavaScript bundle sent to the client.
- **Client Components**: Reserved for interactive elements like the Shopping Cart, Search Bar, and Vendor Dashboard.
- **Middleware**: Handles route protection and dynamic header injection for the backend API.
- **Global Search**: Real-time URL synchronization ensures that search results are SEO-linkable and persist across refreshes.

---
*Sokoline: Empowering the next generation of student entrepreneurs.*
