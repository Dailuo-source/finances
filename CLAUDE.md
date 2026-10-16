# Finance Friend: handoff notes

Gary and Cecilia's household budget app. This repo is only the installable phone shell. The budget itself is a Google Apps Script web app over the Google Sheet **2026 - Monthly Budget**, and the shell shows it full screen in an iframe.

## Where things live

| Piece | Location |
| --- | --- |
| Live app | https://financefriend.pages.dev/ (Cloudflare Pages, auto-deploys from `main` of `Dailuo-source/finances`) |
| Old copy | https://dailuo-source.github.io/finances/ (GitHub Pages). Can be unpublished once both phones use the pages.dev install |
| Budget data | Google Sheet "2026 - Monthly Budget" with monthly Budget / Transactions tabs |
| Budget web app | Apps Script bound to that sheet (its code is not in this repo). Each phone pastes the `/exec` link once; it's stored in `localStorage` as `financeExecUrl`. `BUILT_IN_LINK` in `index.html` can hard-code it instead |

## How the shell works

- `index.html` shows a loading screen, then loads the `/exec` link in an iframe. The web app posts `{financeApp:true, status:'ready'|'error', message}` to the parent when it has loaded. With no message after 20 s the shell shows "Can't open your budget" (usually not signed in to Google).
- Screens: loading, first-run "Connect to your budget", and trouble (retry, sign in, open in Chrome, change link).
- `sw.js` caches only the shell (`CACHE = 'finances-shell-v5'`), never financial data.
- Manifest: name and short name "Finance Friend", `id: "finances"` (keep it; changing it makes Android treat it as a new app). Icon: kawaii piggy bank with a coin on a butter-yellow tile.

## Background on the budget (from Gary)

- Banks: RBC (Gary chequing and Visa), CIBC (Gary Mastercard), Amex (Gary and Cecilia), TD (Cecilia chequing and Visa), EQ Bank (joint), exported as CSV.
- Decisions: keep the existing monthly tabs, assign transactions by transaction date, backfill Jul–Sep 2026, unrecognised merchants go to a review queue (no AI API), and transfers between chequing and credit cards are left out so they don't count as spending.

## Changing things

- Edit, bump `CACHE` in `sw.js`, commit and push to `main`; Cloudflare deploys in about a minute.
- Commits use author `Claude <noreply@anthropic.com>`; GitHub rejects Gary's private email.

## Things to know

- Hosted on Cloudflare Pages because Chrome on Android wouldn't install it alongside Pantry Pal from the same github.io site. Each of Gary's apps gets its own origin.
- Gary doesn't want his full name in app web addresses (no `*.garyluo-gs.workers.dev`).
- Reinstalling on a phone means pasting the `/exec` link again unless `BUILT_IN_LINK` is set.
