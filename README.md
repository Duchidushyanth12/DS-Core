# DS-corE | Master Data Structures & Algorithms

[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com/new)
[![Render](https://img.shields.io/badge/Deploy-Render-blue?logo=render)](https://dashboard.render.com/blueprints)

**DS-corE** is a production-grade, full-stack DSA practice platform designed to take you from a beginner to an algorithmic master. It features a unique **Sequential Learning System** where you must master core patterns before unlocking advanced topics.

## 🚀 Features

-   **25 Algorithmic Patterns**: Curated roadmap covering everything from Arrays to System Design.
-   **875+ Problems**: A massive bank of 35 problems per pattern, including dedicated "Hard" challenges.
-   **Isolated Code Execution**: Secure environment to run and test your solutions.
-   **Sequential Roadmap**: Locked tracks that ensure you build a strong foundation.
-   **Global Leaderboard**: Compete with other learners in real-time.
-   **Premium UI**: Sleek dark mode with glassmorphism and smooth animations.

## 🛠️ Technology Stack

-   **Frontend**: Next.js 14, Tailwind CSS, Lucide React, Monaco Editor.
-   **Backend**: Node.js, Express, TypeScript.
-   **Database**: PostgreSQL, Prisma ORM.
-   **Infrastructure**: Render (API/DB/Execution Engine), Vercel (Frontend).

## 📦 Monorepo Structure

```text
/apps
  /web               # Next.js Frontend
  /api               # Express REST API
  /execution-engine  # Code Execution Service
/packages
  /database          # Shared Prisma Client & Seed Scripts
```

## 🚥 Quick Start (Local)

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Setup Database**:
   Update `packages/database/.env` with your PostgreSQL URL, then:
   ```bash
   npm run seed -w packages/database
   ```

3. **Run Services**:
   ```bash
   npm run dev
   ```
   Access the app at `http://localhost:3000`.

## 🌍 Deployment

### One-Click Backend (Render)
1. Fork this repository.
2. Go to [Render Blueprints](https://dashboard.render.com/blueprints).
3. Connect your repository.
4. Render will use `render.yaml` to set up your DB, API, and Execution Engine automatically.

### One-Click Frontend (Vercel)
1. Go to [Vercel](https://vercel.com/new).
2. Import your repository.
3. Vercel will automatically use `vercel.json` for configuration.

---
Built with ❤️ for the algorithmic community.
