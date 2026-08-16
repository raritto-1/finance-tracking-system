# Finance Tracking System

A modern personal finance tracker with a React web app. Track income and expenses locally — no backend API required.

## Features

- **Dashboard** — Overview of income, expenses, and net savings
- **Add transactions** — Record income or expenses with date, amount, and description
- **Transaction history** — Search, filter by date range and category, delete entries
- **Analytics** — Income vs expense charts and top expense breakdown
- **CSV import/export** — Migrate from the legacy Python CLI or backup your data
- **Local storage** — All data stays in your browser

## Project Structure

```
finance-tracking-system/
├── apps/
│   └── web/              # React + Vite web application
├── packages/
│   └── core/             # Shared business logic (ready for future mobile app)
├── legacy/
│   └── python-cli/       # Original Python CLI version
└── package.json          # Monorepo root
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

## Live Demo

After pushing to GitHub, the app deploys automatically to **GitHub Pages**:

**https://raritto-1.github.io/finance-tracking-system/**

### One-time setup (if the link shows 404)

1. Open your repo on GitHub → **Settings** → **Pages**
2. Under **Build and deployment**, set **Source** to **GitHub Actions**
3. Push to `main` (or re-run the **Deploy to GitHub Pages** workflow under **Actions**)

Every push to `main` rebuilds and redeploys the site automatically.

## Load Sample Data

1. Open the app and go to **Settings**
2. Click **Load Sample Data** to import the bundled CSV from the original project

Or import your own CSV with columns: `date,amount,category,description` (dd-mm-yyyy format).

## Legacy Python CLI

The original command-line version is preserved in `legacy/python-cli/`. To run it:

```bash
cd legacy/python-cli
pip install pandas matplotlib
python main.py
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Web UI | React 18, TypeScript, Tailwind CSS |
| Charts | Recharts |
| Routing | React Router |
| Build | Vite |
| Storage | localStorage |
| Shared logic | `@finance/core` (TypeScript) |

## Roadmap

- [ ] React Native mobile app (Android & iOS) using shared `@finance/core`
- [ ] Subcategories and budgets
- [ ] Multi-currency support
