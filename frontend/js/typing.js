'use strict';

/* ============================================================
   Typing Effect — Hero tagline
   ============================================================ */
(function initTyping() {
  var phrases = [
    'Full-Stack Developer',
    'UI/UX Enthusiast',
    'Open Source Contributor',
    'Problem Solver',
  ];

  var el = document.getElementById('typing-text');
  if (!el) return;

  var phraseIndex = 0;
  var charIndex = 0;
  var isDeleting = false;
  var typingSpeed = 90;
  var deletingSpeed = 50;
  var pauseAfterPhrase = 1800;
  var pauseBeforeType = 400;

  function type() {
    var currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      el.textContent = currentPhrase.slice(0, charIndex - 1);
      charIndex--;
    } else {
      el.textContent = currentPhrase.slice(0, charIndex + 1);
      charIndex++;
    }

    var delay = isDeleting ? deletingSpeed : typingSpeed;

    if (!isDeleting && charIndex === currentPhrase.length) {
      delay = pauseAfterPhrase;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = pauseBeforeType;
    }

    setTimeout(type, delay);
  }

  setTimeout(type, pauseBeforeType);
})();
