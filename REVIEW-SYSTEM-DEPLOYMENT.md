# Klyrova customer review system — deployment

The review form, public approved-review slider, and private moderation page are now connected to the Node API in `server.js`. The live site must run as a **Render Web Service**, not a Static Site, for the API routes to work.

## Render Web Service

Create a new Web Service from this GitHub repository:
- Branch: `main`
- Runtime: Node
- Build command: `npm install`
- Start command: `npm start`
- Root directory: leave blank

Do not delete the current live site until the new Web Service has been deployed and tested. The new service will initially have its own `.onrender.com` address.

## Required environment variables

Set these in Render → Web Service → Environment:

- `MONGODB_URI`: MongoDB Atlas connection string for a database user with access to the Klyrova database.
- `MONGODB_DB`: `klyrova`
- `REVIEW_ADMIN_TOKEN`: a long, private random secret. Never put this value in GitHub or share it publicly.
- `REVIEW_NOTIFICATION_EMAIL`: `bahzuri60@gmail.com`

## Email notifications (optional but recommended)

To send a new-review email notification, create a Resend account, verify a sender domain you control, then set:
- `RESEND_API_KEY`: the private Resend API key.
- `RESEND_FROM`: a sender address on the verified domain, for example `Klyrova Reviews <reviews@your-domain.com>`.

Without the Resend settings, reviews are still saved in MongoDB, but no email notification is sent.

## Admin page

After deployment, open `/reviews-admin.html` and enter the same `REVIEW_ADMIN_TOKEN` set in Render. Pending reviews can be approved, rejected, or deleted. Only approved reviews are returned by the public API and shown on the homepage. The public API never returns the reviewer's email or phone number.

## Before switching the main domain

Test all of the following on the new Web Service:
1. `/api/health` returns `{"ok":true,"service":"Klyrova review service"}`.
2. Submit a test review and confirm it appears as Pending in the admin page.
3. Approve it and confirm it appears in the homepage slider.
4. Reject another test review and confirm it remains hidden.
5. Confirm the notification email arrives after Resend is configured.

Keep MongoDB and admin credentials private. Do not commit a real `.env` file.
