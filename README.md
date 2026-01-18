# Web3 Approval Demo – Backend

Express + Socket.IO backend for a controlled approval demo.

## Setup

1. Copy env:

```bash
cp .env.example .env
```

2. Install + run:

```bash
npm install
npm run dev
```

## Environment

See `.env.example` for required variables.

## API

- Public:
  - `POST /api/public/session`
  - `POST /api/public/event`
- Auth:
  - `GET /api/auth/nonce`
  - `POST /api/auth/login`
  - `POST /api/auth/logout`
- Admin (JWT):
  - `GET /api/admin/wallets`
  - `GET /api/admin/events`
  - `GET /api/admin/test-results`
  - `POST /api/admin/verify-allowance`
