const toggle = document.querySelector('.mobile-toggle');
const links = document.querySelector('.nav-links');
if (toggle && links) {
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
}

function formToPayload(form) {
  return Object.fromEntries(new FormData(form).entries());
}

function setNotice(form, message, isError = false) {
  const notice = form.querySelector('.notice');
  if (!notice) return;
  notice.textContent = message;
  notice.classList.add('show');
  notice.style.background = isError ? '#fff2e8' : '#e8f5e8';
  notice.style.color = isError ? '#71330d' : '#19491f';
}

async function submitLeadForm(form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const button = form.querySelector('button[type="submit"]');
    const originalText = button ? button.textContent : '';
    if (button) {
      button.disabled = true;
      button.textContent = 'Sending...';
    }

    try {
      const response = await fetch(form.action || '/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formToPayload(form)),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.error || 'Form delivery is not configured yet. Please call or email Cascadia Deck & Fence directly.');
      }
      setNotice(form, result.message || 'Thank you — your request was sent. Cascadia Deck & Fence will follow up soon.');
      form.reset();
    } catch (error) {
      setNotice(form, error.message, true);
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = originalText;
      }
    }
  });
}

document.querySelectorAll('[data-lead-form], [data-client-registration-form]').forEach(submitLeadForm);

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
