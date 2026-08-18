# Local News Network (LNN) — Lite Edition

A simplified, low-cost version of the LNN news site: Node.js + Express + MongoDB
backend, React (Vite) + Tailwind frontend, JWT auth with 3 simple roles, a
polling-based breaking news ticker, and an admin dashboard for managing articles,
breaking news, categories, districts, site pages, and user accounts.

This is a **deliberately lighter build** of the original LNN project, built to run on
free or near-free hosting with no server management:

| | Full edition | Lite edition |
|---|---|---|
| Real-time breaking news | Socket.IO (push) | Polls every 20s (no websockets needed) |
| Roles | 7 (super_admin, editor, sub_editor, reporter, content_writer, moderator, viewer) | 3 (admin, reporter, viewer) |
| Image/video storage | Local disk | Cloudinary free tier (works on hosts with no persistent disk) |
| Deployment | Docker + Nginx on a VPS | Vercel/Netlify + Render + MongoDB Atlas, all free tiers |
| Live TV viewer count | Live via Socket.IO | Removed (static "Live" badge instead) |

Functionally, everything a small local newsroom needs is still here: publish/edit/
delete articles with a draft → published workflow, categories, districts, reporter
profiles, a breaking news ticker, comments & likes, a Live TV embed page (with the
stream URL set from Admin → Settings), an editable About/Advertise/Privacy/Terms/
Careers page (Admin → Pages), staff account management (Admin → Users), and a settings
page to change your logo/name/social links without touching code.

```
lnn-lite/
├── backend/       Express API, MongoDB models, JWT auth, seed script, tests
├── frontend/      React (Vite) + Tailwind site: public pages + admin dashboard
├── render.yaml    One-click backend deploy blueprint for Render
```

---

## Recommended free hosting stack

| Piece | Service | Cost |
|---|---|---|
| Frontend (static React build) | Vercel or Netlify | Free |
| Backend API | Render (free web service) | Free (sleeps after ~15 min idle, wakes on next request in a few seconds) |
| Database | MongoDB Atlas (M0 tier) | Free forever, 512MB |
| Image/video uploads | Cloudinary | Free (25 credits/month — plenty for a small site) |
| Domain (optional) | Any registrar | ~$10–15/year for a `.com`, or use the free subdomain each host gives you |

**Total to start: $0/month.** The only unavoidable cost, if you want it, is a custom
domain name. Everything else runs comfortably inside these free tiers for a small
local news site's traffic.

The only real trade-off of the free tier: Render's free web service spins down after
about 15 minutes of no traffic, so the *first* request after a quiet period takes a
few extra seconds to wake back up. Everything after that is normal speed. If that
matters to you later, upgrading just the backend to Render's cheapest paid plan
(~$7/month) removes it — nothing else needs to change.

---

## 1. Set up your free accounts (10 minutes)

1. **MongoDB Atlas** — [mongodb.com/atlas](https://www.mongodb.com/atlas) → create a
   free M0 cluster → create a database user → under Network Access, allow access from
   anywhere (`0.0.0.0/0`, simplest for a free-tier project) → copy the connection
   string (looks like `mongodb+srv://user:pass@cluster.mongodb.net/lnn`).
2. **Cloudinary** — [cloudinary.com](https://cloudinary.com) → sign up free → your
   Dashboard shows `Cloud Name`, `API Key`, `API Secret`. Copy all three.
3. **Render** — [render.com](https://render.com) → sign up (can connect with GitHub).
4. **Vercel** or **Netlify** — [vercel.com](https://vercel.com) /
   [netlify.com](https://netlify.com) → sign up (can connect with GitHub).

You'll need this project in a GitHub repo for one-click deploys from Render/Vercel —
push this folder to a new repo first if you haven't already.

## 2. Deploy the backend (Render)

- New → Blueprint → point Render at your repo (it will pick up `render.yaml`
  automatically), **or** New → Web Service → root directory `backend`, build command
  `npm install`, start command `npm start`.
- Add these environment variables in Render's dashboard:
  - `MONGO_URI` — your Atlas connection string
  - `JWT_SECRET` — any long random string (Render can generate one if using the blueprint)
  - `CLIENT_URL` — your frontend's URL (fill this in after step 3 — Render lets you edit env vars anytime)
  - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- Deploy. Once it's live, note the URL Render gives you, e.g. `https://lnn-backend.onrender.com`.
- Seed sample data once, from the Render shell (Dashboard → your service → Shell):
  ```
  npm run seed
  ```

## 3. Deploy the frontend (Vercel)

- New Project → import your repo → set **root directory** to `frontend`.
- Framework preset: Vite. Build command `npm run build`, output directory `dist`
  (Vercel usually detects these automatically).
- Add environment variable `VITE_API_URL` = `https://lnn-backend.onrender.com/api`
  (your Render URL from step 2, plus `/api`).
- Deploy. Vercel gives you a URL like `https://your-project.vercel.app`.
- Go back to Render and set `CLIENT_URL` to that Vercel URL, so CORS allows it.

(Using Netlify instead? Same idea — root directory `frontend`, build command
`npm run build`, publish directory `dist`, same `VITE_API_URL` env var. A
`public/_redirects` file is already included so client-side routing works.)

## 4. First login

Visit your Vercel URL, log in with the seeded account, and change the password
immediately:
- **Admin**: `admin@lnn.local` / `Admin@123`
- **Reporter**: `reporter@lnn.local` / `Reporter@123`

Then go to **Admin → Settings** and set your real site name, logo, and social links
(see below) — no redeploy needed, it's stored in the database.

---

## Changing the logo, name, social links, Live TV stream, and site pages

Go to `/admin/settings` while logged in as `admin`. From there you can change:

- **Channel / site name**, **short badge name**, **tagline**
- **Logo image** — uploads go to Cloudinary automatically once your env vars are set
- **Social media links** — Facebook, Twitter/X, YouTube, Instagram. Leave a field
  blank and that icon disappears from the header/footer instead of linking to `#`
- **Contact info** — phone, email, address (used on the Contact page)
- **Live TV** — paste your YouTube Live / Facebook Live / HLS embed URL and an
  optional note; it appears on the public `/live-tv` page immediately. Leave it
  blank and the page shows a friendly "no stream configured yet" placeholder
  instead of a broken player.

Changes are live immediately, site-wide — this is a database record, not code.

**Admin → Pages** (`/admin/pages`) is where the About, Advertise, Privacy Policy,
Terms of Use, and Careers pages — the ones linked from the footer's Quick Links and
Legal sections — get edited. Pick a page from the list, edit the title/content, save.
No code changes, no redeploy.

## Creating admin/reporter accounts

**Admin → Users** (`/admin/users`, admin role only) lets you create new staff logins
with a name, email, password, and role right from the UI — this is how you add more
reporters or a second admin. You can also change anyone's role, reset their password,
temporarily disable an account, or delete one. A couple of safety rails are built in:
you can't delete your own account while logged into it, and the system won't let the
last remaining admin get demoted, disabled, or deleted (so you can't accidentally lock
yourself out of the site).

Public visitors who use the "Create an account" link on `/register` always get the
`viewer` role automatically (comment + like only) — elevated roles can only be granted
by an existing admin through Admin → Users, never through public self-registration.

## How "Top Headlines" gets populated

There's no separate step for this — any article you publish (Admin → Articles → New
Article → set **Status: Published**) automatically shows up in the homepage's Top
Headlines section, newest first. "Featured" articles (the `isFeatured` checkbox on the
article form) additionally headline the homepage hero at the very top. If Top
Headlines looks empty, it means there are no published articles yet — check
Admin → Articles and confirm at least one has Status set to Published rather than
Draft or Pending Review.

---

## 2. Local development

### Prerequisites
- Node.js 18+
- A MongoDB Atlas free cluster (or MongoDB running locally)

### Backend
```bash
cd backend
cp .env.example .env      # fill in MONGO_URI, JWT_SECRET, and (optionally) Cloudinary keys
npm install
npm run seed                # sample categories, districts, articles, pages, and 2 login accounts
npm run dev                  # http://localhost:5000
```
Without Cloudinary keys set, uploads fall back to local disk — fine for local dev,
just remember production needs the real Cloudinary keys (see above).

### Frontend
```bash
cd frontend
cp .env.example .env       # defaults to http://localhost:5000/api
npm install
npm run dev                  # http://localhost:5173
```

### Tests
```bash
cd backend && npm test
```

---

## Roles

Simplified to 3, down from the original 7:

| Role | Can do |
|---|---|
| `admin` | Everything — articles, categories, districts, breaking news, reporters, site settings, pages, and user accounts |
| `reporter` | Create/edit/delete their own articles (draft or pending; an admin publishes) |
| `viewer` | Default role for anyone who signs up publicly — can comment and like articles |

Only an `admin` can create other `admin`/`reporter` accounts (Admin → Users) — public
registration always creates a `viewer`.

## API overview

Base URL: `/api`

| Resource | Endpoints |
|---|---|
| Auth | `POST /auth/register`, `POST /auth/login`, `GET /auth/me` |
| Articles | `GET /articles`, `GET /articles/mine`, `GET /articles/:slug`, `POST /articles`, `PUT /articles/:id`, `DELETE /articles/:id`, `PUT /articles/:id/like`, `POST /articles/:id/comments` |
| Categories | `GET /categories`, `POST /categories`, `PUT /categories/:id`, `DELETE /categories/:id` |
| Districts | `GET /districts`, `GET /districts/:slug`, `POST /districts`, `PUT /districts/:id`, `DELETE /districts/:id` |
| Breaking News | `GET /breaking-news`, `GET /breaking-news/all`, `POST /breaking-news`, `PUT /breaking-news/:id`, `PUT /breaking-news/:id/pin`, `DELETE /breaking-news/:id` |
| Reporters | `GET /reporters`, `GET /reporters/:id`, `POST /reporters`, `PUT /reporters/:id`, `DELETE /reporters/:id` |
| Settings | `GET /settings` (public), `PUT /settings` (admin — logo upload + branding + social + contact + Live TV) |
| Pages | `GET /pages` (admin — list all 5), `GET /pages/:slug` (public), `PUT /pages/:slug` (admin) |
| Users | `GET /users` (admin), `POST /users` (admin — create staff account), `PUT /users/:id` (admin — role/status/password), `DELETE /users/:id` (admin) |
| Uploads | `POST /uploads` (single), `POST /uploads/gallery` (multiple) |

---

## What's different from the full edition (and why)

- **No Socket.IO** — the breaking news ticker polls the API every 20 seconds instead
  of receiving a live push. Visually identical, one small delay, and it means this
  runs fine on hosts that don't handle persistent websocket connections well.
- **No Docker/Nginx** — not needed once you're not self-managing a VPS.
- **3 roles instead of 7** — a small local newsroom rarely needs `sub_editor` vs
  `content_writer` vs `moderator` as distinct tiers; `admin` and `reporter` cover the
  real workflow (publish vs. submit-for-review).
- **Cloudinary instead of local disk for uploads** — this isn't a simplification for
  its own sake, it's a correctness fix: most free hosts wipe their filesystem on every
  restart or deploy, so local disk storage would silently lose your images in
  production. Cloudinary's free tier avoids that.
- **Live TV viewer counter and live chat removed** — the counter only existed because
  Socket.IO was already there, and the chat was never synced between viewers (just a
  local-to-your-browser-tab stub) — removed rather than left as a half-feature. The
  Live TV page is now just the stream embed, controlled from Admin → Settings.

If you outgrow the free tiers later (real traffic, more storage, need the live-push
ticker back), the original full edition — same data model, same admin panel — is a
drop-in upgrade path; nothing in this lite version is a dead end.
