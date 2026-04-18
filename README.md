# Sokoline Web (The Rebellious Front) ⚡

This is the high-end Next.js frontend for Sokoline. It’s designed to be fast, edgy, and strictly built for student entrepreneurs.

## 🎨 Identity & Design
- **Theme**: "Minimalist x Rebellious Purple"
- **Typography**: **Space Grotesque** (Geometric Sans)
- **Palette**: Near-Black (#1A1A1A), Pure White (#FFFFFF), Digital Violet (#7C3AED)
- **Experience**: Heavy use of Framer Motion for masked text reveals and staggered entry animations.

## 🚀 Key Features
- **Global Shopping Bag**: A synchronous `CartProvider` that persists your bag to the Django backend.
- **Dynamic PDP**: Rich product detail pages with variant switching (color/size) and community feedback (reviews).
- **Vendor Portal**: A private dashboard for sellers to manage inventory, track sales, and edit their shop profile.
- **SEO Ready**: Uses slug-based routing (`/products/power-bank`) for better search visibility.

## 🛠️ Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Auth**: Clerk (Next.js 16 optimized with `proxy.ts`)
- **Testing**: Vitest + React Testing Library

## 🚦 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Create a `.env.local` and add your Clerk keys:
```text
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
NEXT_PUBLIC_API_URL=https://api.sokoline.app/api
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Run Tests
```bash
npm test
```

---
*Built for the next generation of founders.*
