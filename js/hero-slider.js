/**
 * hero-slider.js — autoplay image slider for the hero section
 * Instant cut transition, text animates in via CSS,
 * smooth rAF-driven progress bar, pause on hover, touch swipe.
 */
(function () {
  'use strict';

  var DURATION = 5000; // ms per slide

  var slider  = document.getElementById('hero-slider');
  if (!slider) return;

  var slides  = slider.querySelectorAll('.hs-slide');
  var dots    = slider.querySelectorAll('.hs-dot');
  var curEl   = document.getElementById('hs-cur');
  var progFill = document.getElementById('hs-prog-fill');

  var idx      = 0;
  var paused   = false;
  var startTs  = null;
  var rafId    = null;

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function goTo(next) {
    slides[idx].classList.remove('hs-active');
    dots[idx].classList.remove('hs-dot-on');

    idx = (next + slides.length) % slides.length;

    slides[idx].classList.add('hs-active');
    dots[idx].classList.add('hs-dot-on');
    curEl.textContent = pad(idx + 1);

    startProgress();
  }

  function startProgress() {
    cancelAnimationFrame(rafId);
    startTs = null;
    progFill.style.width = '0%';

    function tick(ts) {
      if (paused) {
        rafId = requestAnimationFrame(tick);
        return;
      }
      if (!startTs) startTs = ts;
      var pct = Math.min((ts - startTs) / DURATION * 100, 100);
      progFill.style.width = pct + '%';
      if (pct < 100) {
        rafId = requestAnimationFrame(tick);
      } else {
        goTo(idx + 1);
      }
    }

    rafId = requestAnimationFrame(tick);
  }

  /* Dot clicks */
  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      goTo(parseInt(dot.getAttribute('data-i')));
    });
  });

  /* Pause on hover */
  slider.addEventListener('mouseenter', function () { paused = true; });
  slider.addEventListener('mouseleave', function () {
    paused = false;
    startTs = null; /* restart interval fresh from now */
  });

  /* Touch swipe */
  var touchX = null;
  slider.addEventListener('touchstart', function (e) {
    touchX = e.touches[0].clientX;
  }, { passive: true });
  slider.addEventListener('touchend', function (e) {
    if (touchX === null) return;
    var dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 44) goTo(idx + (dx < 0 ? 1 : -1));
    touchX = null;
  });

  /* Init */
  goTo(0);

})();
