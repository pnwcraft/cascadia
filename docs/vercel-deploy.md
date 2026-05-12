# Vercel deployment notes

## Why the browser showed `404: NOT_FOUND`

The screenshot shows Vercel's platform-level 404 page, not Cascadia's website. That normally means Vercel did not find a static output for the requested deployment/domain, the project was pointed at the wrong root/output directory, or the deployment failed and the domain is still attached to an empty/not-ready deployment.

This repo is a plain static HTML site. To make Vercel treat it that way, the repo now includes `vercel.json` with:

- `framework: null` so Vercel does not try to detect a framework.
- `buildCommand: "npm run build"` so Vercel has an explicit build step.
- `outputDirectory: "dist"` so Vercel serves only the generated static site files, not repository tooling or docs.
- `cleanUrls: true` so `/client-registration` and similar clean paths can resolve to `.html` pages without custom rewrites.

## Vercel project settings to use

When importing from GitHub, use these settings:

- Framework Preset: `Other` or no framework.
- Root Directory: repository root, not `assets`, `blog`, `services`, or another subfolder.
- Build Command: `npm run build`.
- Output Directory: `dist`.
- Install Command: leave default or use `npm install`.

After changing settings, redeploy the latest commit from the Vercel dashboard. The build script creates `dist/` by validating the HTML and copying only deployable static files.

## Quick checks after deploy

Open these URLs:

- `/`
- `/client-registration`
- `/client-registration.html`
- `/services/deck-building-seattle`
- `/services/deck-building-seattle.html`
- `/locations/seattle`
- `/blog/`

If the Vercel 404 still appears at the root domain, check that the Vercel domain is attached to this project and that the latest deployment status is `Ready`.

## Why `dist` is safer than serving the repo root

Serving `.` can work for very small static projects, but it also risks publishing repository-only files such as docs, scripts, and package metadata. A dedicated `dist/` folder gives Vercel a clear publish directory and matches the common static-hosting mental model: source files go in the repo, generated public files go in the output directory.

## Note about clean URLs and rewrites

Do not add `.html` extensions to rewrite destinations while `cleanUrls` is enabled. Vercel documents that when `cleanUrls` is `true`, source and destination paths in rewrite rules should omit file extensions. This project currently does not need rewrites because the physical `.html` files are present in `dist/` and `cleanUrls` handles extensionless URLs.

## Lead form environment variables

The static pages submit forms to the Vercel serverless function at `/api/lead`. Add these environment variables in Vercel before relying on production leads:

- `RESEND_API_KEY`: API key from Resend.
- `LEAD_TO_EMAIL`: inbox that should receive estimate/contact/registration requests.
- `LEAD_FROM_EMAIL` optional: verified sender address. If omitted, the endpoint uses Resend's onboarding sender for testing.

If those variables are missing, the endpoint returns a setup error and the visitor is told to call or email directly instead of seeing a fake success message.
