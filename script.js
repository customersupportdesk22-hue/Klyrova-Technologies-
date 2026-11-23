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
const servicePicker = document.getElementById('service-picker-trigger');
const servicePickerValue = document.getElementById('service-picker-value');
const servicePickerOptions = document.getElementById('service-picker-options');
const servicePickerError = document.getElementById('service-picker-error');
const serviceGuidance = document.getElementById('service-guidance');
const serviceGuidanceTitle = document.getElementById('service-guidance-title');
const serviceGuidanceDescription = document.getElementById('service-guidance-description');
const serviceGuidanceNeeded = document.getElementById('service-guidance-needed');
const serviceGuides = {
  'Business website': ['A professional website for your organisation.','We can plan the pages, mobile layout, contact forms, WhatsApp links, service or product information and domain connection.','Helpful details: business type, website name (if known), pages needed, examples you like and the main action visitors should take.'],
  'E-commerce website': ['An online store where customers can browse and order.','We can discuss product categories, product pages, cart, checkout, order management, delivery options and payment-provider integration.','Helpful details: approximate number of products, delivery areas, currencies, preferred payment methods and who will manage orders.'],
  'Booking platform': ['A system for customers to make and manage bookings.','We can scope schedules, availability, customer details, booking confirmations, admin tools, payments and notifications.','Helpful details: what customers book, locations/routes, schedules, pricing rules, booking steps and staff/admin roles.'],
  'Custom software or dashboard': ['A tailored system for your business operations.','We first map your workflow, users, permissions, records, reports and the tasks the software should automate.','Helpful details: what problem it solves, who will use it, current process, key screens/reports and any existing system to connect.'],
  'Payment integration': ['Connect a payment provider to your website or platform.','We can assess hosted checkout, payment links, cards, mobile money, bank options, payment status callbacks and reconciliation.','Helpful details: provider name, countries/currencies, payment methods, whether you already have a merchant account and the platform to connect.'],
  'Customer support or automation': ['Make customer support and routine tasks easier.','We can plan enquiry capture, support workflows, FAQs, ticket routing, notifications and human handover.','Helpful details: where customers contact you, common questions, team workflow, operating hours and what should be automated.'],
  '24/7 Website AI Assistant': ['An AI assistant that helps website visitors even when your team is offline.','We can plan its knowledge sources, answers, lead capture, escalation to a human and usage controls.','Helpful details: website URL, business information/FAQs, languages, common questions and when it should hand over to staff.'],
  'WhatsApp AI Assistant': ['An AI-powered assistant for customer conversations on WhatsApp.','We can assess WhatsApp Business Platform access, approved message templates, AI responses, lead capture and human handover.','Helpful details: business use case, WhatsApp Business number/status, expected message volume and the tasks it should handle.'],
  'AI + business automation': ['Connect AI with repetitive business processes.','We can map triggers, connected apps, approvals, data flow, notifications and safeguards before recommending an approach.','Helpful details: tasks to automate, tools/apps you use, what starts each task and what result you expect.'],
  'Bulk SMS / Sender ID integration': ['Send customer updates or campaigns through an SMS provider.','We can discuss provider selection, Sender ID application, contact-list handling, delivery reports and SMS credits. Sender ID approval and messaging fees depend on the provider and country.','Helpful details: target countries, estimated messages per month, message purpose, preferred provider and whether you already have an approved Sender ID.'],
  'WhatsApp Business integration': ['Connect WhatsApp Business to your customer journey.','We can scope click-to-chat, catalogue or enquiry flows, approved templates, API integration and support handover.','Helpful details: business number, country, expected message volume and whether you need simple chat links or API automation.'],
  'Domain registration / transfer': ['Register a new domain or move an existing one.','We can check the domain name, extension, ownership, DNS requirements and transfer eligibility. Domain registration and renewal are separate third-party costs.','Helpful details: preferred domain name, extension (.com, .co.ke, etc.), whether it is already registered and who currently manages it.'],
  'Website hosting / deployment': ['Publish your website or move it to suitable hosting.','We can review the site technology, traffic needs, deployment process, backups, SSL and ongoing hosting costs.','Helpful details: current website/repository URL, domain, current host, expected traffic and any deployment errors.'],
  'Business email / DNS setup': ['Set up professional email and the domain records it needs.','We can help configure mailboxes or a provider and the required DNS records, including SPF, DKIM and DMARC where supported.','Helpful details: domain name, email provider, number of mailboxes and whether email is new or being migrated.'],
  'Payment gateway / checkout integration': ['Add a secure checkout experience to your website or app.','We can compare suitable providers and integrate their supported checkout/API flow. Provider onboarding, transaction fees and settlement approval remain with the provider.','Helpful details: business country, customer countries, currencies, payment methods, website platform and merchant-account status.'],
  'Advertising & customer acquisition': ['Plan and manage campaigns to attract genuine enquiries and potential customers.','We can discuss audience, platforms, campaign creative, tracking and duration. Our management fee is quoted separately from the advertising budget; results and sales are not guaranteed.','Helpful details: product/service to promote, target location/audience, campaign duration, monthly ad budget, landing page and preferred platforms.'],
  'Something else': ['Tell us what you have in mind.','We will review your idea and help identify the right service or combination of services.','Helpful details: the problem you want to solve, who it is for and what a successful result would look like.']
};
const setServiceGuidance = value => {
  const guide = serviceGuides[value];
  if (!serviceGuidance || !guide) {
    if (serviceGuidance) serviceGuidance.hidden = true;
    return;
  }
  serviceGuidanceTitle.textContent = guide[0];
  serviceGuidanceDescription.textContent = guide[1];
  serviceGuidanceNeeded.textContent = guide[2];
  serviceGuidance.hidden = false;
};
const setProjectService = value => {
  if (!serviceSelect || !servicePickerValue || !servicePicker) return;
  serviceSelect.value = value;
  servicePickerValue.textContent = value || 'Choose a service';
  setServiceGuidance(value);
  servicePicker.setAttribute('aria-expanded', 'false');
  if (servicePickerOptions) servicePickerOptions.hidden = true;
  if (servicePickerError) servicePickerError.hidden = true;
};
if (requestedService && serviceSelect) {
  const serviceChoices = [...(servicePickerOptions?.querySelectorAll('[data-service]') || [])].map(button => button.dataset.service);
  const matchingService = serviceChoices.find(value => value.toLowerCase() === requestedService.toLowerCase());
  if (matchingService) setProjectService(matchingService);
}
servicePicker?.addEventListener('click', () => {
  if (!servicePickerOptions) return;
  const open = servicePickerOptions.hidden;
  servicePickerOptions.hidden = !open;
  servicePicker.setAttribute('aria-expanded', String(open));
});
servicePickerOptions?.querySelectorAll('[data-service]').forEach(option => {
  option.addEventListener('click', () => setProjectService(option.dataset.service));
});
document.addEventListener('click', event => {
  if (!event.target.closest('.service-field') && servicePickerOptions && !servicePickerOptions.hidden) {
    servicePickerOptions.hidden = true;
    servicePicker?.setAttribute('aria-expanded', 'false');
  }
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && servicePickerOptions && !servicePickerOptions.hidden) {
    servicePickerOptions.hidden = true;
    servicePicker?.setAttribute('aria-expanded', 'false');
    servicePicker?.focus();
  }
});

form?.addEventListener('submit', event => {
  event.preventDefault();
  if (serviceSelect && !serviceSelect.value) {
    if (servicePickerError) servicePickerError.hidden = false;
    servicePicker?.focus();
    return;
  }
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
