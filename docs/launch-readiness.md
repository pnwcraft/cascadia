# Cascadia Deck & Fence launch readiness audit

## Current status

The site is structurally ready for a soft launch or staging review. It has a home page, service pages, Seattle/Bellevue location pages, blog content, SEO metadata, sitemap, robots file, schema snippets, a free estimate form, and a client project registration form.

## Items to replace before a public paid launch

- Replace placeholder phone number `[INSERT MY PHONE]` with the real business phone number.
- Replace `[INSERT MY EMAIL]` if the final email address is different.
- Confirm the production domain and update canonical URLs if the launch domain is not `https://cascadiadeckfence.com/`.
- Add real project photos, owner/team details, license/insurance information, warranty language, and service terms before running paid ads.
- Connect forms to a real form backend or CRM. The current forms work for static demos and Netlify-style collection, and they store a local browser copy for testing.

## Content sufficiency

The site now has enough text for an initial local SEO launch. The strongest pages are the home page and deck building page. The next content upgrades should be real project galleries, city pages for Kirkland/Redmond/Renton/Shoreline/Edmonds/Bothell, and longer blog posts with photos and internal links.

## Estimate and registration flow

- The home page includes a free estimate form for customers who want a quote.
- The client registration page captures a more complete project file.
- The registration page is not a secure login portal. A real password-protected customer portal should be added later only if customers need private estimates, invoices, approvals, or project updates.

## Google reviews integration plan

The site includes a placeholder Google reviews widget and a config file for a future Google Business Profile connection. After the Google Business Profile is verified, collect the Google Place ID and connect reviews through a secure server-side or serverless endpoint. Do not expose private Google API keys in browser JavaScript.

Possible future integration paths:

1. Google Places API Place Details for public rating/review fields when the Place ID is available.
2. Google Business Profile APIs for owned-profile management workflows, if the business account and API access are approved.
3. A third-party review widget, if a faster no-code launch is preferred.

## Vercel deployment

Vercel support files are included in `vercel.json`. Use framework preset `Other`, root directory `.`, build command `npm run build`, and output directory `dist`. More details are in `docs/vercel-deploy.md`.
