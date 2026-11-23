/* Restore the visitor's previous page and scroll position on Back/Forward.
   The "Back to website" link uses the previous same-site history entry when available. */
(() => {
  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "auto";
  }

  document.addEventListener("click", (event) => {
    const backLink = event.target.closest("a.back-home");
    if (!backLink) return;

    const cameFromThisSite = (() => {
      try {
        return document.referrer && new URL(document.referrer).origin === window.location.origin;
      } catch {
        return false;
      }
    })();

    if (cameFromThisSite && window.history.length > 1) {
      event.preventDefault();
      window.history.back();
    }
  });
})();
