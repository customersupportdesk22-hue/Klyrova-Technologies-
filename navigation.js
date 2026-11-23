/* Keep the browser's native per-history-entry scroll restoration enabled.
   This lets Back/Forward return visitors to the exact page and scroll position. */
(() => {
  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "auto";
  }
})();
