# Dashboard

A responsive, frontend-only business management workspace built with React and Vite. No Supabase or backend service is used.

## Features
- Account registration and login screens
- Demo account and sample business records seeded locally; new accounts start with an empty workspace
- Password verification using browser PBKDF2 hashing
- Per-account browser storage for workspace preferences and records
- Business overview with revenue, customer, outstanding-payment and task KPIs
- Revenue trend chart
- Customer directory: create, search, edit, archive, restore and delete
- Sales ledger: create, edit, update payment status, delete and export CSV
- Task manager: create, edit, complete, delete and track due dates and priorities
- Reports with revenue and collection summaries
- Full workspace JSON backup and restore from Settings
- Workspace settings and currency display options (RWF, USD, NGN, KES, GBP)
- Responsive desktop and mobile layouts

## Demo access
- Email: `demo@dashboard.local`
- Password: `Dashboard123!`

The demo account is created in the browser on first load and starts with sample records. Newly registered accounts start with empty customer, sales and task lists, while keeping the same dashboard features.

## Run locally
```bash
npm install
npm run dev
```

## Production build
```bash
npm run build
```

## Data and security limitations
This project deliberately has no backend, Supabase, server-side authentication or cloud database. Accounts, password hashes, sessions and business records are stored in the browser's localStorage. PBKDF2 hashing prevents passwords from being stored as plain text, but client-side authentication is not a security boundary: users can inspect or modify browser data. Accounts and records do not sync between browsers, devices or users. Clearing browser storage removes the local data. Use Settings → Local data & backups to download a JSON backup and import it again in the same or another browser.

This implementation is appropriate for a prototype/demo. Do not use it for confidential or business-critical information. Production use requires a trusted backend for authentication, authorization, shared persistence, backups and server-side validation.
