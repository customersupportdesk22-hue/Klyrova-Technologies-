const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

menuButton?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  menuButton.textContent = isOpen ? '×' : '☰';
});

nav?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
    if (menuButton) {
      menuButton.textContent = '☰';
      menuButton.setAttribute('aria-label', 'Open navigation');
    }
  });
});

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const form = document.getElementById('enquiry-form');
const note = document.getElementById('form-note');
const CONTACT_EMAIL = 'bahzuri60@gmail.com';

// Preselect the service when a visitor arrives from a service card.
const projectParams = new URLSearchParams(window.location.search);
const requestedService = projectParams.get('service');
const selectedPackage = projectParams.get('package');
const selectedMarket = projectParams.get('market');
const selectedPrice = projectParams.get('price');
const selectedCurrency = projectParams.get('currency') || (selectedMarket === 'Kenya' ? 'KES' : 'USD');
const selectedPackageBox = document.getElementById('selected-package');
if (selectedPackage && selectedPackageBox) {
  selectedPackageBox.hidden = false;
  selectedPackageBox.textContent = `Your selection: ${selectedPackage} · ${selectedMarket || 'To be confirmed'}${selectedPrice ? ` · ${selectedCurrency} ${selectedPrice} starting price` : ''}. First-five-client offer: choose 10% off the development fee or complimentary website launch setup, subject to availability.`;
}
const serviceSelect = document.getElementById('service');
if (requestedService && serviceSelect) {
  const matchingOption = [...serviceSelect.options].find(option => option.value.toLowerCase() === requestedService.toLowerCase() || option.textContent.toLowerCase() === requestedService.toLowerCase());
  if (matchingOption) serviceSelect.value = matchingOption.value;
}

form?.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const data = new FormData(form);
  const subject = encodeURIComponent(`Website project enquiry — ${data.get('name')}`);
  const body = encodeURIComponent(
    `Selected package: ${selectedPackage || 'Not selected'}\nMarket: ${selectedMarket || 'Not specified'}\nStarting price: ${selectedPrice ? `${selectedCurrency} ${selectedPrice}` : 'To be quoted'}\nLaunch offer preference: ${data.get('launchOffer') || 'Customer to choose'}\nName: ${data.get('name')}\nEmail: ${data.get('email')}\nBusiness: ${data.get('business') || 'Not provided'}\nBudget: ${data.get('budget') || 'Not specified'}\nService: ${data.get('service')}\n\nProject details:\n${data.get('message')}`
  );
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  if (note) note.textContent = 'Your email application should open with your enquiry ready to send. This form does not submit directly to a server.';
});

// Reveal selected sections as visitors scroll, with a safe fallback when unsupported.
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealTargets = document.querySelectorAll('.service-card,.project-card,.price-card,.milestone-grid article,.domain-grid article,.requirements-list article,.faq-list details');
  revealTargets.forEach(item => item.classList.add('reveal-ready'));
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealTargets.forEach(item => revealObserver.observe(item));
}


// Pricing cards are fully selectable with mouse, touch and keyboard.
document.querySelectorAll('[data-select-url]').forEach(card => {
  const openSelection = () => { window.location.href = card.dataset.selectUrl; };
  card.addEventListener('click', event => {
    if (event.target.closest('a')) return;
    openSelection();
  });
  card.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openSelection();
    }
  });
});


// Country cards prefill the customer review form and its international dial code.
const reviewCountry = document.getElementById('review-country');
const reviewDial = document.getElementById('review-dial-code');
const reviewDialHidden = document.getElementById('review-dial-hidden');
const reviewPanel = document.getElementById('review-form-panel');
const reviewOpenButton = document.getElementById('review-open-button');
const openReviewForm = () => {
  if (!reviewPanel) return;
  reviewPanel.hidden = false;
  reviewOpenButton?.setAttribute('aria-expanded','true');
  reviewOpenButton?.classList.add('is-open');
};
reviewOpenButton?.addEventListener('click', () => {
  if (!reviewPanel) return;
  const shouldOpen = reviewPanel.hidden;
  reviewPanel.hidden = !shouldOpen;
  reviewOpenButton.setAttribute('aria-expanded',String(shouldOpen));
  reviewOpenButton.classList.toggle('is-open',shouldOpen);
});
document.querySelectorAll('.country-choice').forEach(button => {
  button.addEventListener('click', () => {
    const option = [...(reviewCountry?.options || [])].find(item => item.dataset.code === button.dataset.country);
    if (option && reviewCountry) {
      reviewCountry.value = option.value;
      if (reviewDial) reviewDial.textContent = button.dataset.dial;
      if (reviewDialHidden) reviewDialHidden.value = button.dataset.dial;
      document.querySelectorAll('.country-choice').forEach(item => item.classList.toggle('is-selected', item === button));
      openReviewForm();
      reviewPanel?.scrollIntoView({behavior:'smooth',block:'start'});
      document.getElementById('review-phone')?.focus({preventScroll:true});
    }
  });
});
reviewCountry?.addEventListener('change', () => {
  const option = reviewCountry.selectedOptions[0];
  if (reviewDial) reviewDial.textContent = option?.dataset.dial || '—';
  if (reviewDialHidden) reviewDialHidden.value = option?.dataset.dial || '';
  document.querySelectorAll('.country-choice').forEach(button => button.classList.toggle('is-selected', button.dataset.country === option?.dataset.code));
});

 
// Customer reviews are now submitted to the Klyrova review API.
const customerReviewForm = document.getElementById('customer-review-form');
const reviewStatus = document.getElementById('review-form-status');
const reviewSlider = document.getElementById('review-slider');
const renderApprovedReviews = async () => {
  if (!reviewSlider) return;
  try {
    const response = await fetch('/api/reviews');
    if (!response.ok) throw new Error('Could not load reviews');
    const reviews = await response.json();
    if (!Array.isArray(reviews) || reviews.length === 0) return;
    reviewSlider.innerHTML = reviews.map(review => {
      const article = document.createElement('article');
      article.className = 'review-slide';
      const stars = '★'.repeat(Math.max(1, Math.min(5, Number(review.rating) || 0)));
      const date = review.approvedAt ? new Date(review.approvedAt).toLocaleDateString(undefined,{month:'short',year:'numeric'}) : '';
      const name = String(review.displayName || 'Klyrova customer');
      const country = String(review.country || '');
      const quote = String(review.review || '');
      const starEl = document.createElement('span'); starEl.className='review-slide-stars'; starEl.textContent=stars;
      const quoteEl = document.createElement('p'); quoteEl.textContent=quote;
      const nameEl = document.createElement('b'); nameEl.textContent=name;
      const metaEl = document.createElement('small'); metaEl.textContent=[country,date].filter(Boolean).join(' · ');
      article.append(starEl,quoteEl,nameEl,metaEl);
      return article;
    });
  } catch (error) {
    // Keep the public review area quiet if the review service is temporarily unavailable.
  }
};
customerReviewForm?.addEventListener('submit', async event => {
  event.preventDefault();
  if (!customerReviewForm.reportValidity()) return;
  const submit = customerReviewForm.querySelector('button[type="submit"]');
  if (submit) { submit.disabled=true; submit.textContent='Sending review…'; }
  if (reviewStatus) reviewStatus.textContent='Sending your review securely…';
  const formData = new FormData(customerReviewForm);
  const payload = {
    name: formData.get('Customer name'),
    email: formData.get('Customer email'),
    country: formData.get('Country'),
    dialCode: formData.get('International dialing code'),
    phone: formData.get('Phone number'),
    rating: formData.get('Rating'),
    review: formData.get('Customer review'),
    publicationPermission: Boolean(formData.get('Publication permission'))
  };
  try {
    const response = await fetch('/api/reviews',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
    const result = await response.json().catch(()=>({}));
    if (!response.ok) throw new Error(result.error || 'We could not submit your review. Please try again.');
    customerReviewForm.reset();
    if (reviewDial) reviewDial.textContent='—';
    if (reviewDialHidden) reviewDialHidden.value='';
    document.querySelectorAll('.country-choice').forEach(button=>button.classList.remove('is-selected'));
    if (reviewStatus) reviewStatus.textContent='Thank you. Your review has been received and is awaiting approval. It will appear here only after our team approves it.';
  } catch (error) {
    if (reviewStatus) reviewStatus.textContent=error.message || 'Unable to submit right now. Please try again later.';
  } finally {
    if (submit) { submit.disabled=false; submit.innerHTML='Send my review <span>↗</span>'; }
  }
});
renderApprovedReviews();
