# ClauseIQ Mini App

Telegram Mini App for ClauseIQ — a full control centre for contract risk analysis.

## Stack

- **Next.js 14** — pages router
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** — animations
- **Supabase** — shared database with the bot
- **Telegram Web App SDK** — native Telegram integration

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — upload contract + last scans preview |
| `/result/[id]` | Scan results — verdict, risk score ring, clause cards |
| `/history` | Contract vault — all past scans with filter |
| `/profile` | Account — plan status, stats, privacy info |
| `/upgrade` | Pricing — Stars payment plans |

## Components

| File | Description |
|------|-------------|
| `BottomNav` | Persistent bottom navigation |
| `ClauseCard` | Expandable clause with copy-negotiation button |
| `RiskScoreRing` | Animated circular risk score |
| `ScanningOverlay` | Step-by-step scanning animation |

---

## Local Setup

```bash
cd clauseiq-miniapp
npm install
cp .env.local.example .env.local
# Fill in your Supabase URL and anon key
npm run dev
```

Opens at `http://localhost:3000`

For Telegram testing use ngrok:
```bash
ngrok http 3000
```
Then set the Mini App URL in BotFather to your ngrok HTTPS URL.

---

## Deploy to Vercel (recommended)

```bash
npm install -g vercel
vercel login
vercel
```

Set environment variables in Vercel dashboard:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_BOT_USERNAME=clauseIQ_bot
```

---

## Connect to Telegram Bot

**Step 1** — Get your deployed URL from Vercel (e.g. `https://clauseiq.vercel.app`)

**Step 2** — In BotFather:
```
/newapp
→ select your bot
→ enter title: ClauseIQ
→ enter description: Contract Risk Control Centre
→ upload an icon (512x512 PNG)
→ enter URL: https://clauseiq.vercel.app
```

**Step 3** — Add the Mini App button to your bot by updating `bot/keyboards.py`:

```python
from telegram import WebAppInfo

# In main_menu_keyboard():
InlineKeyboardButton(
    "📊 Open Dashboard",
    web_app=WebAppInfo(url="https://clauseiq.vercel.app")
)
```

---

## How it connects to the bot

The Mini App reads from the **same Supabase database** as the bot.
- Bot writes reports → Mini App reads and displays them
- No API needed between them — shared DB is the bridge
- User identity comes from `Telegram.WebApp.initDataUnsafe.user.id`

---

## Design System

| Token | Value |
|-------|-------|
| Background | `#0A0A0F` |
| Card | `#16161E` |
| Accent | `#F59E0B` (amber) |
| Risk Low | `#10B981` (green) |
| Risk Medium | `#F59E0B` (amber) |
| Risk High | `#EF4444` (red) |
| Risk Critical | `#7C3AED` (purple) |
| Display font | Syne |
| Body font | DM Sans |
| Mono font | DM Mono |
