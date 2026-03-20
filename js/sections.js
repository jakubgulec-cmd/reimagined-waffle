/**
 * sections.js — čte data z content.js a vykresluje sekce References + Blog
 * Spouští se automaticky po načtení stránky.
 */
(function () {
  'use strict';

  /* ── REFERENCE ── */
  function buildReferences() {
    var grid = document.getElementById('ref-grid');
    if (!grid || !window.REFERENCES) return;

    window.REFERENCES.forEach(function (r) {
      var el = document.createElement('div');
      el.className = 'rc';
      el.innerHTML =
        '<div class="rc-tag">' + r.tag + '</div>' +
        '<div class="rc-quote">\u201E</div>' +
        '<p class="rc-text">' + r.quote + '</p>' +
        '<div class="rc-person">' +
          '<div class="rc-avatar">' + r.initials + '</div>' +
          '<div>' +
            '<div class="rc-name">' + r.name + '</div>' +
            '<div class="rc-role">' + r.role + '</div>' +
          '</div>' +
        '</div>';
      grid.appendChild(el);
    });
  }

  /* ── BLOG ── */
  function buildBlog() {
    var grid = document.getElementById('blog-grid');
    if (!grid || !window.BLOG_POSTS) return;

    window.BLOG_POSTS.forEach(function (p, i) {
      var el = document.createElement('a');
      el.className = 'bc' + (i === 0 ? ' bc-featured' : '');
      el.href = p.url || '#';

      var imgHtml;
      if (p.image) {
        imgHtml = '<div class="bc-img"><img src="' + p.image + '" alt="' + p.title + '"></div>';
      } else {
        imgHtml = '<div class="bc-img bc-img-placeholder"></div>';
      }

      el.innerHTML =
        imgHtml +
        '<div class="bc-body">' +
          '<div class="bc-meta">' +
            '<span class="bc-tag" style="color:' + (p.tagColor || '#1B75BC') + ';border-color:' + (p.tagColor || '#1B75BC') + '44">' + p.tag + '</span>' +
            '<span class="bc-date">' + p.date + '</span>' +
          '</div>' +
          '<h3 class="bc-title">' + p.title + '</h3>' +
          '<p class="bc-perex">' + p.perex + '</p>' +
          '<span class="bc-read">Číst článek &rarr;</span>' +
        '</div>';

      grid.appendChild(el);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    buildReferences();
    buildBlog();
  });

})();
