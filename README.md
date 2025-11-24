CredLink is a Next.js (App Router) app with Prisma, protected dashboards, public card pages, and admin routes.
Deployement test
## Tech Stack
- Next.js App Router (TypeScript)
- Prisma ORM (MySQL)
- Auth via httpOnly cookies: `user_token` (users) and `admin_token` (admins)
- Route protection enforced in `src/middleware.ts`

## Prerequisites
- Node.js 18+ and npm
- MySQL database (local or cloud)

## Environment Variables
Create `.env` (or `.env.local`) in the project root with at least:

```
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DBNAME"
JWT_SECRET="change_this_to_a_long_random_secret"
```

If you use NextAuth locally, also set (optional):

```
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="long_random_secret"
```

## Database Setup
Generate Prisma client and apply migrations:

```powershell
npx prisma generate
npx prisma migrate dev
# Optional GUI
npx prisma studio
```

## Run Dev Server
```powershell
npm install
npm run dev
```
Open http://localhost:3000

## Route Access Rules (important)
- Public pages: `/`, `/auth/login`, `/auth/signup`, `/pricing`, `/contact`, `/support`, `/cards/public/*` and a few static info routes.
- User-protected pages (require `user_token`): `/dashboard/*`, `/onboarding`, and other app internals.
- Admin-protected pages (require `admin_token`): `/admin/*` (except `/admin/login`).
- If not authenticated, accessing protected pages redirects to the correct login page.

These rules are implemented in `src/middleware.ts`.

## Cards
- Public card view: `/cards/public/[id]`
- Private card pages and sharing controls live under the authenticated app. Paused cards disable sharing and show deactivated messaging publicly.

## Notes on Models / Premium Services
- This project does not require or use any paid AI models or premium services by default.
- You can run everything locally with the stack above.

## Troubleshooting
- If you can access `/dashboard` without logging in, clear cookies and ensure `src/middleware.ts` is deployed. The app expects a `user_token` cookie for user routes.
- Prisma schema changes require `npx prisma generate` and a migration.

## Learn More
- Next.js: https://nextjs.org/docs
- Prisma: https://www.prisma.io/docs
