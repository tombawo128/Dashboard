# Dashboard

A responsive, frontend-only business management workspace built with React and Vite. No Supabase or backend service is used.

## Features
- Account registration and login on the same access page
- Administrator registration using the reserved email `admin@dashboard.local`
- Password verification using browser PBKDF2 hashing
- Role-aware sign-in: administrator accounts open the Admin Console
- Administrator overview with sample revenue, payments, sales, customers and tasks
- Account directory with search, role labels, refresh and account deletion
- Per-account browser storage for workspace preferences and records
- Business overview with revenue, customer, outstanding-payment and task KPIs
- Customer directory: create, search, edit, archive, restore and delete
- Sales ledger: create, edit, update payment status, delete and export CSV
- Task manager: create, edit, complete, delete and track due dates and priorities
- Reports with revenue and collection summaries
- Full workspace JSON backup and restore from Settings
- Responsive desktop and mobile layouts

## Create an administrator account
1. Open the Dashboard login page.
2. Select **Create account**.
3. Enter your name, use `admin@dashboard.local` as the email address, and choose a password with at least 8 characters.
4. Submit the form. The new account is saved in this browser and opens the Admin Console.
5. Sign out, then sign in with the same email and password to verify administrator access.

All other email addresses create standard workspace accounts. The administrator overview contains clearly labelled illustrative demo records; these are not live transactions.

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
This project deliberately has no backend, Supabase, server-side authentication or cloud database. Accounts, password hashes, sessions and business records are stored in the browser's localStorage. PBKDF2 hashing prevents passwords from being stored as plain text, but client-side authentication is not a security boundary: users can inspect or modify browser data. The reserved administrator email is a frontend demonstration convention, not secure role provisioning. Accounts and records do not sync between browsers, devices or users. Clearing browser storage removes the local data. Use Settings → Local data & backups to download a JSON backup and import it again in the same or another browser.

This implementation is appropriate for a prototype/demo. Do not use it for confidential or business-critical information. Production use requires a trusted backend for authentication, server-controlled administrator roles, authorization, shared persistence, backups and server-side validation.
