KLYROVA TECHNOLOGIES — WEBSITE IMAGE ASSETS

This package contains five separate, optimized project/brand images.
Copy the entire assets folder into the root of the Klyrova Technologies repository (the same level as index.html and styles.css).

FILES AND DESTINATIONS
1. assets/house-hunt.jpg       -> House Hunt portfolio card
2. assets/ena-coach.jpg        -> ENA Coach Online Booking portfolio card
3. assets/easy-coach.jpg       -> Easy Coach Booking portfolio card
4. assets/biashara-boost.jpg   -> Biashara Boost Loans portfolio card
5. assets/global-world.jpg     -> Homepage hero world visual

IMPORTANT
- These are five separate image files, not a collage.
- Do not rename the files unless you also update the matching src paths in index.html.
- The image assets are not yet uploaded to GitHub by this ZIP. Upload the assets folder to the repository root, then commit/push so Render can serve them.

HTML IMAGE ELEMENTS
Use the following image element inside each matching project visual/card:

House Hunt:
<img class="project-image" src="assets/house-hunt.jpg" alt="House Hunt property discovery platform">

ENA Coach:
<img class="project-image" src="assets/ena-coach.jpg" alt="ENA Coach online bus booking platform">

Easy Coach:
<img class="project-image" src="assets/easy-coach.jpg" alt="Easy Coach online bus booking platform">

Biashara Boost Loans:
<img class="project-image" src="assets/biashara-boost.jpg" alt="Biashara Boost Loans business platform">

Homepage global visual:
<img class="hero-world-image" src="assets/global-world.jpg" alt="A connected global network representing Klyrova's worldwide reach">

CSS FOR PROJECT IMAGES
.project-visual { overflow: hidden; position: relative; }
.project-image { display:block; width:100%; height:100%; min-height:240px; object-fit:cover; object-position:center; border-radius:inherit; }

Keep the hero world image contained within its existing .global-hero-art wrapper; do not set it as a full-screen background.
