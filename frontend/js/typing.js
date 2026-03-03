'use strict';

/* ============================================================
   Typing Effect — Hero tagline
   Pure JS, no libraries. Uses setTimeout loops and the CSS
   .cursor blink keyframe already defined in style.css.
   Cycles through at least 3 tagline strings.
   ============================================================ */
(function initTyping() {
  var phrases = [
    'Building scalable web applications',
    'Crafting clean, maintainable code',
    'Turning ideas into products',
    'Open source contributor',
    'Always learning, always shipping',
  ];

  var el = document.getElementById('typing-text');
  if (!el) return;

  var phraseIndex = 0;
  var charIndex = 0;
  var isDeleting = false;

  /* Timing constants (ms) */
  var TYPING_SPEED   = 85;
  var DELETING_SPEED = 45;
  var PAUSE_AFTER    = 2000;
  var PAUSE_BEFORE   = 350;

  function type() {
    var currentPhrase = phrases[phraseIndex];
    var nextDelay;

    if (isDeleting) {
      charIndex -= 1;
      el.textContent = currentPhrase.slice(0, charIndex);
      nextDelay = DELETING_SPEED;
    } else {
      charIndex += 1;
      el.textContent = currentPhrase.slice(0, charIndex);
      nextDelay = TYPING_SPEED;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      /* Finished typing — pause then start deleting */
      isDeleting = true;
      nextDelay = PAUSE_AFTER;
    } else if (isDeleting && charIndex === 0) {
      /* Finished deleting — advance to next phrase */
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      nextDelay = PAUSE_BEFORE;
    }

    setTimeout(type, nextDelay);
  }

  /* Initial delay before first phrase starts */
  setTimeout(type, PAUSE_BEFORE);
})();
