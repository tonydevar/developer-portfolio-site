'use strict';

/* ============================================================
   Contact Form — POST to /api/contact
   ============================================================ */
(function initContactForm() {
  var form = document.getElementById('contact-form');
  if (!form) return;

  var submitBtn = document.getElementById('submit-btn');
  var msgEl = document.getElementById('form-message');

  function showMessage(text, type) {
    msgEl.textContent = text;
    msgEl.className = 'form-message ' + type;
  }

  function clearMessage() {
    msgEl.textContent = '';
    msgEl.className = 'form-message';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearMessage();

    var name = form.name.value.trim();
    var email = form.email.value.trim();
    var message = form.message.value.trim();

    /* Basic client-side validation */
    if (!name || !email || !message) {
      showMessage('Please fill in all fields.', 'error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name, email: email, message: message }),
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.success) {
          showMessage('Message sent! I\'ll get back to you soon.', 'success');
          form.reset();
        } else {
          var errors = data.errors ? data.errors.join(', ') : 'Something went wrong.';
          showMessage(errors, 'error');
        }
      })
      .catch(function () {
        showMessage('Network error. Please try again later.', 'error');
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message ✉️';
      });
  });
})();
