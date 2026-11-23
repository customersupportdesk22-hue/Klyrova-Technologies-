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

// Preselect the service when a visitor arrives from a service card.
const projectParams = new URLSearchParams(window.location.search);
const requestedService = projectParams.get('service');
let selectedPackage = projectParams.get('package');
let selectedMarket = projectParams.get('market');
let selectedPrice = projectParams.get('price');
let selectedCurrency = projectParams.get('currency') || (selectedMarket === 'Kenya' ? 'KES' : 'USD');
const selectedPackageService = requestedService || '';
const requestedTemplate = projectParams.get('template');
const requestedOffer = projectParams.get('offer');
const templateField = document.getElementById('selected-template');
if (templateField && requestedTemplate) templateField.value = requestedTemplate;
const selectionSummary = document.getElementById('selection-summary');
const templateSummary = document.getElementById('template-selection-summary');
const freeStarterSummary = document.getElementById('free-starter-selection-summary');
if (requestedTemplate && selectionSummary && templateSummary) {
  selectionSummary.hidden = false;
  templateSummary.hidden = false;
  const templateTitle = document.getElementById('template-selection-title');
  if (templateTitle) templateTitle.textContent = `Your selected design: ${requestedTemplate}`;
  const introTitle = document.querySelector('.project-intro h1');
  const introText = document.querySelector('.project-intro > p:last-child');
  if (introTitle) introTitle.innerHTML = "Let's shape your <span>chosen design.</span>";
  if (introText) introText.textContent = 'Your chosen design has been added to this enquiry. Tell us a little about your business and we will customise the concept around your brand and requirements.';
}
if (requestedOffer === 'Klyrova Free Starter' && selectionSummary && freeStarterSummary) {
  selectionSummary.hidden = false;
  freeStarterSummary.hidden = false;
  const introTitle = document.querySelector('.project-intro h1');
  const introText = document.querySelector('.project-intro > p:last-child');
  if (introTitle) introTitle.innerHTML = 'Request your <span>free starter.</span>';
  if (introText) introText.textContent = 'Tell us about your business so we can prepare your complimentary starter package. There is no obligation to purchase.';
  const launchOfferField = document.getElementById('launchOffer')?.closest('.full');
  if (launchOfferField) launchOfferField.hidden = true;
  const messageLabel = document.querySelector('label[for="message"]');
  const messageInput = document.getElementById('message');
  if (messageLabel) messageLabel.textContent = 'Tell us about your business and what you want to improve';
  if (messageInput) messageInput.placeholder = 'What does your business do? Do you have a website or social media page? What would you most like help improving?';
}
const selectedPackageBox = document.getElementById('selected-package');
const updateSelectedPackageSummary = () => {
  if (!selectedPackageBox) return;
  selectedPackageBox.hidden = !selectedPackage;
  selectedPackageBox.textContent = selectedPackage
    ? `Homepage selection: ${selectedPackage}${selectedMarket ? ` · ${selectedMarket}` : ''}. The starting price is displayed on the homepage only. We will confirm the final written quotation after reviewing your requirements.`
    : '';
};
updateSelectedPackageSummary();
const serviceSelect = document.getElementById('service');
const servicePicker = document.getElementById('service-picker-trigger');
const servicePickerValue = document.getElementById('service-picker-value');
const servicePickerOptions = document.getElementById('service-picker-options');
const servicePickerError = document.getElementById('service-picker-error');
const serviceGuidance = document.getElementById('service-guidance');
const serviceGuidanceTitle = document.getElementById('service-guidance-title');
const serviceGuidanceDescription = document.getElementById('service-guidance-description');
const serviceGuidanceNeeded = document.getElementById('service-guidance-needed');
const advertisingDetails = document.getElementById('advertising-details');
// Klyrova service prices are displayed on the homepage only.
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
  'Website uptime & monitoring': ['Keep an eye on whether your website and key services are reachable.','We can configure UptimeRobot website/API/server checks, downtime notifications and review of response-time, SSL and domain-expiry alerts. Where the chosen UptimeRobot plan supports it, we can set up a password-protected private status page for authorised people. This is monitoring, not website hosting; it cannot guarantee zero downtime or make a public website private.','Helpful details: website URL, hosting provider, the email address for alerts, what should be monitored and who should be allowed to view any private status page.'],
  'Reviews & reputation tools': ['Collect and display genuine customer feedback.','We can set up a review collection flow, moderation steps and approved review display on your website.','Helpful details: website URL, review platform, whether you need collection only or ongoing moderation and display.'],
  'Website maintenance / support': ['Keep your website maintained after launch.','We can agree routine checks, content updates, minor fixes, backups where supported and a monthly support scope.','Helpful details: website URL, hosting provider, update frequency and the tasks you want covered.'],
  'Business email / DNS setup': ['Set up professional email and the domain records it needs.','We can help configure mailboxes or a provider and the required DNS records, including SPF, DKIM and DMARC where supported.','Helpful details: domain name, email provider, number of mailboxes and whether email is new or being migrated.'],
  'Payment gateway / checkout integration': ['Add a secure checkout experience to your website or app.','We can compare suitable providers and integrate their supported checkout/API flow. Provider onboarding, transaction fees and settlement approval remain with the provider.','Helpful details: business country, customer countries, currencies, payment methods, website platform and merchant-account status.'],
  'Advertising & customer acquisition': ['Promote your business — with or without a website.','Share your website, social page, property listing or product link if you have one. If not, describe what you offer and provide photos, prices, location and contact details. We can plan the campaign and, if requested, work to generate genuine interested enquiries and pass those enquiries to you.','Helpful details: what to promote, target location/audience, campaign duration, advertising budget, any links or promotional materials, and whether you want us to help generate customer enquiries. A specific number of leads or sales is not guaranteed.'],
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
  if (advertisingDetails) advertisingDetails.hidden = value !== 'Advertising & customer acquisition';
};
const setProjectService = value => {
  if (!serviceSelect || !servicePickerValue || !servicePicker) return;
  if (selectedPackage && value !== selectedPackageService) {
    selectedPackage = '';
    selectedMarket = '';
    selectedPrice = '';
    selectedCurrency = '';
    updateSelectedPackageSummary();
  }
  serviceSelect.value = value;
  servicePickerValue.textContent = value || 'Choose a service';
  setServiceGuidance(value);
  const launchOffer = document.getElementById('launchOffer');
  const launchOfferLabel = document.getElementById('launch-offer-label');
  const launchOfferHint = document.getElementById('launch-offer-hint');
  if (launchOffer) {
    const isAdvertising = value === 'Advertising & customer acquisition';
    if (isAdvertising) {
      if (launchOfferLabel) launchOfferLabel.textContent = 'First-five-client advertising offer — choose one';
      if (launchOfferHint) launchOfferHint.textContent = 'Choose 10% off Klyrova’s campaign management fee or complimentary campaign setup. Advertising platform spend is not discounted or included.';
      launchOffer.replaceChildren(
        new Option('10% discount on Klyrova campaign management fee','10% discount on Klyrova campaign management fee'),
        new Option('Complimentary campaign setup (advertising spend excluded)','Complimentary campaign setup (advertising spend excluded)'),
        new Option('Discuss the available advertising offer with me','Discuss the available advertising offer with me')
      );
    } else {
      if (launchOfferLabel) launchOfferLabel.textContent = 'First-five-client launch offer — choose one';
      if (launchOfferHint) launchOfferHint.textContent = 'Available to the first five clients who confirm with the agreed deposit. Third-party charges are excluded.';
      launchOffer.replaceChildren(
        new Option('10% discount on the project development fee','10% discount on the project development fee'),
        new Option('Complimentary website launch setup (domain/hosting fees excluded)','Complimentary website launch setup (domain/hosting fees excluded)'),
        new Option('Discuss the available offer with me','Discuss the available offer with me')
      );
    }
  }
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

if (serviceSelect && !servicePicker) {
  serviceSelect.addEventListener('change', () => {
    setBudgetGuidance(serviceSelect.value);
    if (advertisingDetails) advertisingDetails.hidden = serviceSelect.value !== 'Advertising & customer acquisition';
  });
}
form?.addEventListener('submit', event => {
  event.preventDefault();
  if (serviceSelect && !serviceSelect.value) {
    if (servicePickerError) servicePickerError.hidden = false;
    servicePicker?.focus();
    return;
  }
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const fields = [
    ['Name',data.get('name')],['Email',data.get('email')],['Country',data.get('country')],
    ['Phone / WhatsApp',data.get('phone')],['Preferred contact',data.get('contactPreference')],
    ['Business',data.get('business')],['Service',data.get('service')],
    ['Selected package',selectedPackage],['Selected template',data.get('template')],['Requested offer',requestedOffer],['Market',selectedMarket],
    ['Homepage starting price',selectedPrice ? `${selectedCurrency} ${selectedPrice} (as displayed on homepage)` : ''],
    ['Launch offer',data.get('launchOffer')],['Timeline',data.get('timeline')],
    ['Website / social link',data.get('promotionLink')],['Advertising platform spend',data.get('adSpendBudget')],
    ['Advertising platform',data.get('adPlatforms')],['Campaign duration',data.get('adDuration')],
    ['Target location',data.get('adLocation')],['Advertising support',data.get('advertisingSupport')],
    ['Promotion details',data.get('promotionMaterial')],['Project details',data.get('message')]
  ];
  const message='Hello Klyrova Technologies, I would like to make an enquiry.\n\n'+fields.filter(([,v])=>v!==null&&v!==undefined&&String(v).trim()!=='').map(([k,v])=>`${k}: ${v}`).join('\n');
  if(note) note.textContent='Opening WhatsApp with your enquiry. Review the message and tap Send to submit it.';
  window.open(`https://wa.me/254743993329?text=${encodeURIComponent(message)}`,'_blank','noopener');
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


