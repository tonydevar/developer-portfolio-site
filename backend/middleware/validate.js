'use strict';

/**
 * Strip HTML tags from a string.
 * @param {string} str
 * @returns {string}
 */
function stripHtml(str) {
  return String(str).replace(/<[^>]*>/g, '');
}

/**
 * Validate a contact form submission.
 * Returns { valid: true, data } or { valid: false, errors: [] }
 */
function validateContact(body) {
  const errors = [];

  const name = body.name != null ? String(body.name).trim() : '';
  const email = body.email != null ? String(body.email).trim() : '';
  const message = body.message != null ? String(body.message).trim() : '';

  if (!name) {
    errors.push('name is required');
  } else if (name.length > 100) {
    errors.push('name must be 100 characters or fewer');
  }

  if (!email) {
    errors.push('email is required');
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push('email must be a valid email address');
    }
  }

  if (!message) {
    errors.push('message is required');
  } else if (message.length > 2000) {
    errors.push('message must be 2000 characters or fewer');
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    data: {
      name: stripHtml(name),
      email: stripHtml(email),
      message: stripHtml(message),
    },
  };
}

module.exports = { validateContact, stripHtml };
