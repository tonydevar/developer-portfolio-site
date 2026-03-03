'use strict';

/* ============================================================
   Contact Form — Feature 4: Contact Form Frontend Integration
   - Client-side validation (all fields required, email regex)
   - Loading state on submit button prevents double-submission
   - POST JSON to API_BASE + /api/contact (runtime-resolved)
   - 200 → clear form + green success banner
   - 400 → display returned error array as red error message
   - Network failure → generic red error
   - All states themed via CSS custom properties
   ============================================================ */
(function initContactForm() {

  /* ---- Runtime API base URL (dev: localhost:3000, prod: same origin) ---- */
  var API_BASE = (function () {
    var h = window.location.hostname;
    if (h === 'localhost' || h === '127.0.0.1') {
      return 'http://localhost:3000';
    }
    return window.location.origin;
  })();

  var form      = document.getElementById('contact-form');
  if (!form) return;

  var submitBtn = document.getElementById('submit-btn');
  var msgEl     = document.getElementById('form-message');

  var ORIGINAL_LABEL = (submitBtn && submitBtn.getAttribute('data-original-text'))
    || 'Send Message ✉️';
  var LOADING_LABEL  = 'Sending…';

  /* ---- Email validation regex (RFC-5322 simplified) ---- */
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  /* ------------------------------------------------------------------ */
  /* Helpers                                                              */
  /* ------------------------------------------------------------------ */

  function showBanner(text, type) {
    msgEl.textContent = text;
    msgEl.className   = 'form-message ' + type;
  }

  function clearBanner() {
    msgEl.textContent = '';
    msgEl.className   = 'form-message';
  }

  /* Show inline field-level error */
  function setFieldError(fieldId, message) {
    var errEl = document.getElementById(fieldId + '-error');
    var input = document.getElementById(fieldId);
    if (errEl) errEl.textContent = message;
    if (input) {
      if (message) {
        input.classList.add('input--error');
        input.setAttribute('aria-invalid', 'true');
      } else {
        input.classList.remove('input--error');
        input.removeAttribute('aria-invalid');
      }
    }
  }

  function clearFieldErrors() {
    ['name', 'email', 'message'].forEach(function (id) {
      setFieldError(id, '');
    });
  }

  function setLoading(loading) {
    if (!submitBtn) return;
    submitBtn.disabled    = loading;
    submitBtn.textContent = loading ? LOADING_LABEL : ORIGINAL_LABEL;
  }

  /* ------------------------------------------------------------------ */
  /* Client-side validation                                               */
  /* ------------------------------------------------------------------ */

  function validate(name, email, message) {
    var errors = {};

    if (!name) {
      errors.name = 'Name is required.';
    } else if (name.length > 100) {
      errors.name = 'Name must be 100 characters or fewer.';
    }

    if (!email) {
      errors.email = 'Email is required.';
    } else if (!EMAIL_RE.test(email)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!message) {
      errors.message = 'Message is required.';
    } else if (message.length > 2000) {
      errors.message = 'Message must be 2000 characters or fewer.';
    }

    return errors;
  }

  /* ------------------------------------------------------------------ */
  /* Submit handler                                                       */
  /* ------------------------------------------------------------------ */

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    clearBanner();
    clearFieldErrors();

    var name    = form.elements['name'].value.trim();
    var email   = form.elements['email'].value.trim();
    var message = form.elements['message'].value.trim();

    /* --- Client-side validation — abort if invalid --- */
    var errors = validate(name, email, message);
    var errorKeys = Object.keys(errors);
    if (errorKeys.length > 0) {
      errorKeys.forEach(function (k) { setFieldError(k, errors[k]); });
      /* Also show a summary banner */
      showBanner(errors[errorKeys[0]], 'error');
      /* Focus the first invalid field */
      var firstInvalid = document.getElementById(errorKeys[0]);
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    /* --- Loading state — prevents double submission --- */
    setLoading(true);

    fetch(API_BASE + '/api/contact', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ name: name, email: email, message: message }),
    })
      .then(function (res) {
        /* Parse JSON regardless of status so we can read error details */
        return res.json().then(function (data) {
          return { status: res.status, data: data };
        });
      })
      .then(function (result) {
        var status = result.status;
        var data   = result.data;

        if (status === 200 && data.success) {
          /* ✅ Success */
          showBanner("Message sent! I'll get back to you soon.", 'success');
          form.reset();
          clearFieldErrors();

        } else if (status === 400) {
          /* ❌ Backend validation errors — display each item */
          var backendErrors = Array.isArray(data.errors) ? data.errors : [];
          if (backendErrors.length > 0) {
            /* Match server errors to fields by keyword, fall back to banner */
            backendErrors.forEach(function (msg) {
              var lower = msg.toLowerCase();
              if (lower.indexOf('name') !== -1) {
                setFieldError('name', msg);
              } else if (lower.indexOf('email') !== -1) {
                setFieldError('email', msg);
              } else if (lower.indexOf('message') !== -1) {
                setFieldError('message', msg);
              }
            });
            showBanner(backendErrors.join(' '), 'error');
          } else {
            showBanner(data.message || 'Validation failed. Please check your input.', 'error');
          }

        } else {
          /* Unexpected status */
          showBanner('Something went wrong (HTTP ' + status + '). Please try again.', 'error');
        }
      })
      .catch(function () {
        /* 🌐 Network / connectivity failure */
        showBanner('Network error — please check your connection and try again.', 'error');
      })
      .then(function () {
        /* Always restore button (acts as finally) */
        setLoading(false);
      });
  });

  /* ------------------------------------------------------------------ */
  /* Clear field errors on input (UX: errors disappear as user corrects) */
  /* ------------------------------------------------------------------ */
  ['name', 'email', 'message'].forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', function () {
      setFieldError(id, '');
      if (msgEl.classList.contains('error')) clearBanner();
    });
  });
})();
