'use strict';

/* ============================================================
   Projects — Feature 1: Dynamic project rendering from API
   - Resolves API_BASE at runtime (localhost → port 3000, else same origin)
   - Shows loading skeleton while fetching GET /api/projects
   - Renders each project as an <article class="project-card"> using
     the same HTML structure and CSS class names as the previous static HTML
   - Uses textContent for all text to prevent XSS
   - Validates href URLs (http/https only) before setting
   - Shows a graceful error state if fetch fails or returns non-200
   ============================================================ */
(function initProjects() {

  /* ------------------------------------------------------------------ */
  /* API base URL — dev: localhost:3000, prod: same origin              */
  /* ------------------------------------------------------------------ */
  var API_BASE = (function () {
    var h = window.location.hostname;
    if (h === 'localhost' || h === '127.0.0.1') {
      return 'http://localhost:3000';
    }
    return window.location.origin;
  })();

  /* ------------------------------------------------------------------ */
  /* Fallback colours and emojis (index-matched to API project order)   */
  /* ------------------------------------------------------------------ */
  var FALLBACK_COLORS = ['#6c63ff', '#f7975a', '#48c8e8', '#5cb85c'];
  var FALLBACK_EMOJIS = ['🛒', '📋', '🌤️', '💼'];

  /* ------------------------------------------------------------------ */
  /* Helpers                                                              */
  /* ------------------------------------------------------------------ */

  /** Returns true if the URL is safe to use as an href value. */
  function isSafeUrl(url) {
    return typeof url === 'string' &&
      (url.indexOf('https://') === 0 || url.indexOf('http://') === 0);
  }

  /* ------------------------------------------------------------------ */
  /* Loading skeleton                                                     */
  /* ------------------------------------------------------------------ */

  function buildSkeletonCard() {
    var article = document.createElement('article');
    article.className = 'project-card project-card--skeleton';

    var imgWrap = document.createElement('div');
    imgWrap.className = 'project-card__img-wrap';

    var body = document.createElement('div');
    body.className = 'project-card__body';

    var lines = [
      'skeleton-line skeleton-line--title',
      'skeleton-line skeleton-line--text',
      'skeleton-line skeleton-line--text2',
      'skeleton-line skeleton-line--tags',
      'skeleton-line skeleton-line--links'
    ];
    lines.forEach(function (cls) {
      var div = document.createElement('div');
      div.className = cls;
      body.appendChild(div);
    });

    article.appendChild(imgWrap);
    article.appendChild(body);
    return article;
  }

  function showSkeletons(grid) {
    grid.innerHTML = '';
    for (var i = 0; i < 4; i++) {
      grid.appendChild(buildSkeletonCard());
    }
  }

  /* ------------------------------------------------------------------ */
  /* Project card builder                                                 */
  /* ------------------------------------------------------------------ */

  function buildCard(project, idx) {
    var article = document.createElement('article');
    article.className = 'project-card';
    article.setAttribute('data-animate', '');

    /* --- Image wrap --- */
    var imgWrap = document.createElement('div');
    imgWrap.className = 'project-card__img-wrap';

    var img = document.createElement('img');
    img.src = project.image || '';
    img.alt = (project.title || 'Project') + ' screenshot';
    img.className = 'project-card__img';
    img.onerror = function () { this.style.display = 'none'; };

    var fallback = document.createElement('div');
    fallback.className = 'project-card__img-fallback';
    fallback.style.setProperty('--fallback-color', FALLBACK_COLORS[idx] || '#6c63ff');
    fallback.setAttribute('aria-hidden', 'true');
    fallback.textContent = FALLBACK_EMOJIS[idx] || '📁';

    imgWrap.appendChild(img);
    imgWrap.appendChild(fallback);

    /* --- Body --- */
    var body = document.createElement('div');
    body.className = 'project-card__body';

    var title = document.createElement('h3');
    title.className = 'project-card__title';
    title.textContent = project.title || '';

    var desc = document.createElement('p');
    desc.className = 'project-card__description';
    desc.textContent = project.description || '';

    var tagsDiv = document.createElement('div');
    tagsDiv.className = 'project-card__tags';
    if (Array.isArray(project.tags)) {
      project.tags.forEach(function (tag) {
        var span = document.createElement('span');
        span.className = 'tag';
        span.textContent = tag;
        tagsDiv.appendChild(span);
      });
    }

    var linksDiv = document.createElement('div');
    linksDiv.className = 'project-card__links';

    if (isSafeUrl(project.liveUrl)) {
      var liveLink = document.createElement('a');
      liveLink.setAttribute('href', project.liveUrl);
      liveLink.setAttribute('target', '_blank');
      liveLink.setAttribute('rel', 'noopener noreferrer');
      liveLink.textContent = 'Live Demo ↗';
      linksDiv.appendChild(liveLink);
    }

    if (isSafeUrl(project.repoUrl)) {
      var repoLink = document.createElement('a');
      repoLink.setAttribute('href', project.repoUrl);
      repoLink.setAttribute('target', '_blank');
      repoLink.setAttribute('rel', 'noopener noreferrer');
      repoLink.textContent = 'View Repo ↗';
      linksDiv.appendChild(repoLink);
    }

    body.appendChild(title);
    body.appendChild(desc);
    body.appendChild(tagsDiv);
    body.appendChild(linksDiv);

    article.appendChild(imgWrap);
    article.appendChild(body);
    return article;
  }

  /* ------------------------------------------------------------------ */
  /* IntersectionObserver for newly-rendered cards                       */
  /* (main.js ran querySelectorAll before these cards existed in DOM)    */
  /* ------------------------------------------------------------------ */

  function observeCards(grid) {
    if (!('IntersectionObserver' in window)) {
      /* Fallback: show all cards immediately */
      var cards = grid.querySelectorAll('[data-animate]');
      cards.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    var cards = grid.querySelectorAll('[data-animate]');
    cards.forEach(function (el) { observer.observe(el); });
  }

  /* ------------------------------------------------------------------ */
  /* Error state                                                          */
  /* ------------------------------------------------------------------ */

  function showError(grid) {
    grid.innerHTML = '';
    var div = document.createElement('div');
    div.className = 'projects-error';

    var icon = document.createElement('span');
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = '😕';

    var strong = document.createElement('strong');
    strong.textContent = "Couldn't load projects";

    var msg = document.createTextNode(
      'Please check back later or start the backend server on port 3000.'
    );

    div.appendChild(icon);
    div.appendChild(document.createElement('br'));
    div.appendChild(strong);
    div.appendChild(document.createElement('br'));
    div.appendChild(msg);

    grid.appendChild(div);
  }

  /* ------------------------------------------------------------------ */
  /* Main: fetch + render on DOMContentLoaded                            */
  /* ------------------------------------------------------------------ */

  document.addEventListener('DOMContentLoaded', function () {
    var grid = document.getElementById('projects-grid');
    if (!grid) return;

    /* Show skeletons immediately */
    showSkeletons(grid);

    fetch(API_BASE + '/api/projects')
      .then(function (res) {
        if (!res.ok) {
          throw new Error('HTTP ' + res.status);
        }
        return res.json();
      })
      .then(function (projects) {
        grid.innerHTML = '';
        if (!Array.isArray(projects) || projects.length === 0) {
          showError(grid);
          return;
        }
        projects.forEach(function (project, idx) {
          grid.appendChild(buildCard(project, idx));
        });
        observeCards(grid);
      })
      .catch(function () {
        showError(grid);
      });
  });

})();
