const toggle = document.querySelector('.mobile-toggle');
const links = document.querySelector('.nav-links');
if (toggle && links) {
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
}

function handleStoredForm(form, storageKey, successMessage) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const data = Object.fromEntries(new FormData(form).entries());
    data.submittedAt = new Date().toISOString();
    const records = JSON.parse(localStorage.getItem(storageKey) || '[]');
    records.push(data);
    localStorage.setItem(storageKey, JSON.stringify(records));
    const notice = form.querySelector('.notice');
    if (notice) {
      notice.textContent = successMessage;
      notice.classList.add('show');
    }
    form.reset();
  });
}

document.querySelectorAll('[data-lead-form]').forEach((form) => {
  handleStoredForm(
    form,
    'cascadiaLeads',
    'Thank you — your estimate request was saved. Cascadia Deck & Fence will follow up soon.'
  );
});

document.querySelectorAll('[data-client-registration-form]').forEach((form) => {
  handleStoredForm(
    form,
    'cascadiaClientRegistrations',
    'Thank you — your client project registration was saved. We will confirm the next step by phone or email.'
  );
});

const reviewWidget = document.querySelector('[data-google-reviews]');
if (reviewWidget) {
  const config = window.CASCADIA_GOOGLE_REVIEWS || {};
  const rating = reviewWidget.querySelector('[data-review-rating]');
  const count = reviewWidget.querySelector('[data-review-count]');
  const link = reviewWidget.querySelector('[data-review-link]');
  if (rating && config.rating) rating.textContent = config.rating;
  if (count && config.reviewCount) count.textContent = `${config.reviewCount}+ Google reviews`;
  if (link && config.googleMapsUrl) link.href = config.googleMapsUrl;
}
