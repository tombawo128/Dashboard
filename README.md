# Dashboard

A frontend-only business management workspace built with React and Vite.

## Features
- Business overview with revenue, customers, outstanding payments and task KPIs
- Revenue trend chart with selectable periods
- Customer directory with create, search, archive and restore
- Sales ledger with paid/pending status and CSV export
- Task manager with priorities, due dates and completion tracking
- Reports with revenue and collection summaries
- Workspace settings, business name and currency selection (RWF, USD, NGN, KES, GBP)
- Browser localStorage persistence and responsive layout

## Run locally
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

## Data and security
This is a frontend-only application. Records are stored in the current browser using localStorage. They are not synchronized between users or devices. Clearing browser data removes locally stored records. Do not use this demo for confidential or business-critical records without adding a secure backend, authentication, backups and access controls.
