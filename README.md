# Frontend – Ansprechpartner-Manager (Next.js + Tailwind)

## Lokal starten
```bash
npm install
cp .env.example .env.local
# ggf. API anpassen:
# NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
npm run dev
```
Dann http://localhost:3000 öffnen.

## Deploy auf Vercel
1) Repo pushen
2) Vercel → New Project → Repo importieren
3) Environment Variable setzen:
   - NEXT_PUBLIC_API_BASE_URL=https://<DEIN-BACKEND>
4) Deploy
