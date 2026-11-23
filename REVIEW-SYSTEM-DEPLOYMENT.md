# Klyrova server-side review system — activation plan

## Current live-site behaviour

The current customer-facing website is deployed as a static front end. Project enquiries and customer reviews are prepared as WhatsApp messages; visitors must review the message and tap Send. These submissions are not currently stored in MongoDB by the website.

The homepage review slider is a placeholder. The review form does not currently call the API in server.js, and the homepage does not currently load approved reviews from the API.

The Node API, MongoDB review collection, review moderation page and Command Centre are prepared as optional server-side components, but they are not active on a Render Static Site.

## Before activating the backend

Do not replace or delete the existing live site yet. Create a separate Render Web Service from this repository and test it first:

- Branch: main
- Runtime: Node
- Build command: npm install
- Start command: npm start
- Root directory: leave blank

The Web Service requires these private environment variables:

- MONGODB_URI: MongoDB Atlas connection string
- MONGODB_DB: klyrova
- REVIEW_ADMIN_TOKEN: long private random secret
- REVIEW_NOTIFICATION_EMAIL: email address for review notifications

Optional email notifications through Resend:

- RESEND_API_KEY: private Resend API key
- RESEND_FROM: sender address on a verified domain

## Front-end work still required

Before calling the review system connected, update and test the customer-facing code to:

1. Submit review.html form data to POST /api/reviews, with clear success and failure messages.
2. Load only approved reviews from GET /api/reviews into the homepage slider.
3. Ensure reviews-admin.html can authenticate and moderate records on the same Web Service.
4. Test rate limiting, validation, publication permission and private contact-data handling.
5. Test the Command Centre health endpoint only after its private token and MongoDB connection are configured.

## Verification before switching domains

1. /api/health returns a successful health response.
2. Submit a test review and confirm it appears as Pending in reviews-admin.html.
3. Approve it and confirm only public review fields appear in the homepage slider.
4. Reject another test review and confirm it remains hidden.
5. Confirm optional email notifications work when Resend is configured.
6. Confirm admin pages reject missing or incorrect tokens.
7. Confirm the static site remains available until the Web Service passes all tests.

Never put MongoDB credentials, admin tokens or API keys in GitHub or customer-facing JavaScript.