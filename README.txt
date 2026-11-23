KLYROVA TECHNOLOGIES — WEBSITE

CUSTOMER-FACING PAGES
- index.html: main agency website, services, portfolio and pricing
- start-project.html: project enquiry form
- templates.html: illustrative website template gallery
- integrations.html: integration capabilities and provider information
- ai-assistant.html: interactive sample assistant (prepared demo replies, not a live AI model)
- review.html: customer feedback form
- styles.css, template-library.css: page styling
- script.js, navigation.js, motion.js, review.js: browser-side interactions

CURRENT ENQUIRY AND REVIEW FLOW
- Project enquiries are prepared in WhatsApp. The visitor must review the prefilled message and tap Send.
- Customer reviews are also prepared in WhatsApp for private team review. The visitor must tap Send.
- These two flows do not save submissions to a database or send automatic confirmation emails.
- The public review slider is a placeholder until genuine reviews are approved and added.
- Do not describe the review database/admin workflow as active on the current static site.

OPTIONAL SERVER-SIDE COMPONENTS
- server.js and package.json contain a Node/Express API with MongoDB review endpoints and an authenticated system-health endpoint.
- reviews-admin.html / reviews-admin.js are intended for future review moderation.
- command-centre.html / command-centre.js are intended for future private infrastructure checks.
- These components require a Render Web Service, MongoDB and private environment variables. They do not run on a Render Static Site.
- Before activating them, connect and test the API from review.js and the homepage review slider, then verify the admin and health-check flows on the new Web Service.
- Keep the existing live Static Site until the new service has been fully tested.

CONTACT
- Email: bahzuri60@gmail.com
- WhatsApp: +254 743 993 329

LOCAL PREVIEW
Open index.html in a browser, or deploy the front-end as a static website.

SECURITY
- Never commit a real .env file, database URI, admin token or API key.
- Keep customer provider accounts and settlement details in the customer's name wherever practical.
- Add a privacy notice before introducing database storage, analytics or other collection of personal information.
