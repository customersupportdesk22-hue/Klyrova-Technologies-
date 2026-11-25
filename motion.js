(() => {
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;
  const selectors = [
    ['.hero-copy','left'],['.hero-art','right'],['.trust-strip > div','up'],
    ['.studio-photo','left'],['.studio-copy','right'],
    ['.inside-klyrova-copy','left'],['.inside-klyrova-visual','right'],
    ['.section-heading','up'],['.service-card','up'],
    ['.project-card','up'],['.process-grid article','up'],
    ['.about-mark','scale'],['.about-copy','right'],
    ['.contact-copy','left'],['.contact-form','right'],
    ['.home-integration-card','up'],['.country-choice','up'],
    ['.review-page-intro','up'],['.review-page-card','up'],
    ['.project-intro','up'],['.project-aside','left'],['.project-form','right'],
    ['.platform-hero > *','up'],['.platform-section','up'],['.platform-bottom','up'],
    ['.template-invitation-copy','left'],['.free-starter-card','right'],
    ['.work-section .section-heading','up'],['.technology-marquee','scale'],
    ['.promotion-inner','up'],['.promotion-costs article','up'],['.pricing-card','up']
  ];
  const targets = new Set();
  selectors.forEach(([selector, motion]) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      if (element.dataset.reveal) return;
      element.dataset.reveal = motion;
      if (index > 0 && index < 7) element.style.setProperty('--reveal-delay', (index * 75) + 'ms');
      targets.add(element);
    });
  });
  if (!targets.size) return;
  document.body.classList.add('motion-ready');
  if (!('IntersectionObserver' in window)) {
    targets.forEach(element => element.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
  targets.forEach(element => observer.observe(element));
})();