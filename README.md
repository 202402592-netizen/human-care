# Human Care

Human Care is a static Bootstrap/JavaScript mental-health care platform prototype with patient, therapist, and admin portals. The production-oriented API is implemented in `apps/api` with NestJS, Mongoose, and MongoDB Atlas. The existing HTML/CSS UI is preserved and uses `assets/js/api.js` as its API boundary.

## Local setup

1. Install Node.js 20+ and run `npm run api:install`.
2. Copy `apps/api/.env.example` to `apps/api/.env`.
3. Set `MONGODB_URI` to your MongoDB Atlas connection string and replace both JWT secrets with long random values. Never put them in frontend files.
4. Start the API with `npm run api:dev` (default `http://localhost:5000`).
5. In a second terminal serve the repository root with any static server (for example `npx serve . -l 8080`) and open `http://localhost:8080`.
6. Seed development data once with `npm run api:seed`. It is additive/upsert-like and never drops a database.

The API health endpoint is `GET /api/v1/health`; development Swagger is at `http://localhost:5000/api/docs`.

## Demo accounts after seeding

- Patient: `maya.lin@example.com` / `MindCare#2026`
- Therapist: `dr.rostova@mindcare.org` / `Clinical#Care2026`
- Admin: `admin@mindcare.org` / `AdminSecure#2026`

These are development-only seed credentials. Change or remove them before any shared deployment.

## Frontend API configuration

The adapter defaults to `http://localhost:5000/api/v1`. A deployment can set `window.HUMAN_CARE_API_URL` before `assets/js/api.js` loads. Browser storage is used only for the access token and theme preference. The former mock-data file is now a non-persistent compatibility facade; it contains no business records.

Architecture: static Bootstrap/JavaScript frontend → NestJS REST API → MongoDB Atlas.

The Atlas URI still must be supplied manually in `apps/api/.env`. The API cannot verify live persistence until that value is present.

## API-backed patient workflows

Journals, goals and milestone progress, CBT thought records, wellness/mood logs, exercise progress, notifications, articles/favorites, appointments, and patient dashboard counts are persisted through the API. Journal and other patient-owned endpoints always scope queries to the authenticated user. Development seed data includes representative patient care records and is additive; it never drops a database.

There is no binary upload workflow in the current UI. Existing profile/article images are URL-based assets. If binary uploads are introduced, the intended next step is a storage adapter backed by S3-compatible storage or Cloudinary, with MongoDB storing metadata and URLs only.

## Verification commands

```powershell
npm.cmd run api:build
npm.cmd run api:test
npm.cmd --prefix apps/api audit --omit=dev
```

After adding the Atlas URI:

```powershell
npm.cmd run api:seed
npm.cmd run api:dev
```

## Scope notes

The repository contains no Angular application: there is no `angular.json`, Angular dependency, or Angular version to detect. Therefore no Angular compiler/build can be run. Therapist telemetry and several large dashboard charts remain presentation-only where the original UI contains hardcoded narrative values rather than a real source; they are not presented as persisted production metrics. The AI companion remains explicitly simulated educational UI and is not treated as clinical record storage.
