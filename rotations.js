(() => {
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Rotating hero messages.
  const heroPhrase = document.getElementById('hero-rotating-phrase');
  if (heroPhrase && !reduceMotion) {
    const phrases = [
      'move business forward.',
      'turn ideas into digital products.',
      'make everyday work simpler.',
      'connect customers and businesses.',
      'bring ambitious ideas to life.'
    ];
    let phraseIndex = 0;
    window.setInterval(() => {
      heroPhrase.classList.add('is-changing');
      window.setTimeout(() => {
        phraseIndex = (phraseIndex + 1) % phrases.length;
        heroPhrase.textContent = phrases[phraseIndex];
        heroPhrase.classList.remove('is-changing');
      }, 350);
    }, 4200);
  }

  // 2 and 3. Swipeable service and portfolio carousels with gentle auto-advance.
  document.querySelectorAll('[data-carousel]').forEach((carousel) => {
    const cards = Array.from(carousel.children);
    if (cards.length < 2) return;
    let paused = false;
    let timer = null;
    const step = () => {
      if (paused || document.hidden) return;
      const card = cards[0];
      const gap = parseFloat(getComputedStyle(carousel).columnGap || getComputedStyle(carousel).gap) || 0;
      const maxScroll = carousel.scrollWidth - carousel.clientWidth;
      if (carousel.scrollLeft + carousel.clientWidth >= maxScroll - 12) {
        carousel.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        carousel.scrollBy({ left: card.getBoundingClientRect().width + gap, behavior: 'smooth' });
      }
    };
    const start = () => {
      if (reduceMotion || timer) return;
      timer = window.setInterval(step, carousel.dataset.carousel === 'projects' ? 5200 : 4600);
    };
    const stop = () => {
      if (timer) window.clearInterval(timer);
      timer = null;
    };
    carousel.addEventListener('mouseenter', () => { paused = true; });
    carousel.addEventListener('mouseleave', () => { paused = false; });
    carousel.addEventListener('focusin', () => { paused = true; });
    carousel.addEventListener('focusout', () => { paused = false; });
    carousel.addEventListener('touchstart', () => { paused = true; }, { passive: true });
    carousel.addEventListener('touchend', () => { paused = false; }, { passive: true });
    document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else start(); });
    start();
  });

  // 4. Rotating client-experience promises, never fabricated testimonials.
  const promiseSlider = document.getElementById('review-slider');
  if (promiseSlider) {
    const promises = [
      ['01 / CLARITY', 'Know what you are getting.', 'We agree on the project scope, deliverables, milestones and costs before development begins.'],
      ['02 / OWNERSHIP', 'Your business stays yours.', 'Where practical, domains and provider accounts stay in your business name and under your control.'],
      ['03 / QUALITY', 'Built, reviewed and tested.', 'We share progress and check agreed features before launch, then provide the handover we promised.']
    ];
    let current = 0;
    if (!reduceMotion) {
      window.setInterval(() => {
        current = (current + 1) % promises.length;
        const [label, title, description] = promises[current];
        promiseSlider.innerHTML = '';
        const article = document.createElement('article');
        article.className = 'review-slide';
        const eyebrow = document.createElement('span');
        eyebrow.className = 'review-slide-stars';
        eyebrow.textContent = label;
        const heading = document.createElement('b');
        heading.textContent = title;
        const copy = document.createElement('p');
        copy.textContent = description;
        article.append(eyebrow, heading, copy);
        promiseSlider.append(article);
      }, 4800);
    }
  }
})();