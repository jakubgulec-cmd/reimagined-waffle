/**
 * ODM Configurator
 * - Loads assets/edge-e413.png onto a canvas
 * - Recolors the blue enclosure to any selected RAL color via HSL pixel replacement
 * - Overlays an uploaded logo in place of the Unipi symbol + wordmark
 * - Download as PNG
 */
(function () {
  'use strict';

  /* ── DOM refs ── */
  const canvas    = document.getElementById('cfg-canvas');
  const ctx       = canvas.getContext('2d');
  const loading   = document.getElementById('cfg-loading');
  const ralGrid   = document.getElementById('ral-grid');
  const selDot    = document.getElementById('cfg-sel-dot');
  const selName   = document.getElementById('cfg-sel-name');
  const cfgSel    = document.getElementById('cfg-sel');
  const logoInp   = document.getElementById('logo-inp');
  const logoDrop  = document.getElementById('logo-drop');
  const logoTxt   = document.getElementById('logo-txt');
  const btnDl     = document.getElementById('btn-dl');
  const btnRst    = document.getElementById('btn-rst');

  /* ── State ── */
  let curHex  = null;   // selected RAL hex
  let userLogo = null;  // HTMLImageElement | null

  /* Target hue range for the Unipi blue enclosure */
  const SOURCE_HUE    = 212;  // degrees
  const HUE_TOLERANCE = 38;

  /* Logo bounding box as fraction of canvas size
     Print area: 200×140 px, 220 px from device left edge, vertically centred in device
     Device in image: left=317 top=104 w=594 h=591 — canvas is 1200×800 */
  const LOGO_REGION = { x: 0.4475, y: 0.411875, w: 0.166667, h: 0.175 };

  /* ── Load source image ── */
  const img = new Image();
  img.onload = function () {
    canvas.width  = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);
    loading.classList.add('hidden');
    buildRalGrid();
  };
  img.onerror = function () {
    loading.textContent = 'Image not found — place edge-e413.png in assets/';
  };
  img.src = 'assets/edge-e413.png';

  /* ── RAL grid ── */
  function buildRalGrid() {
    (window.RAL_COLORS || []).forEach(function (ral) {
      var sw = document.createElement('div');
      sw.className  = 'sw';
      sw.style.background = ral.h;
      sw.title = ral.n + ' ' + ral.h;
      sw.addEventListener('click', function () { selectRal(ral, sw); });
      ralGrid.appendChild(sw);
    });
  }

  function selectRal(ral, el) {
    document.querySelectorAll('.sw').forEach(function (s) { s.classList.remove('on'); });
    el.classList.add('on');
    curHex = ral.h;
    selDot.style.background   = ral.h;
    selDot.style.display      = 'block';
    selName.textContent       = ral.n + '  ' + ral.h;
    render();
  }

  /* ── Colour helpers ── */
  function hexToHsl(hex) {
    var r = parseInt(hex.slice(1,3),16)/255,
        g = parseInt(hex.slice(3,5),16)/255,
        b = parseInt(hex.slice(5,7),16)/255;
    var max = Math.max(r,g,b), min = Math.min(r,g,b);
    var h, s, l = (max+min)/2;
    if (max === min) { h = s = 0; }
    else {
      var d = max - min;
      s = l > 0.5 ? d/(2-max-min) : d/(max+min);
      switch(max){
        case r: h = (g-b)/d + (g<b ? 6:0); break;
        case g: h = (b-r)/d + 2; break;
        case b: h = (r-g)/d + 4; break;
      }
      h /= 6;
    }
    return [h*360, s*100, l*100];
  }

  function hslToRgb(h,s,l) {
    h/=360; s/=100; l/=100;
    var r,g,b;
    if (s === 0) { r=g=b=l; }
    else {
      function q2(p,q,t){ if(t<0)t+=1; if(t>1)t-=1; if(t<1/6)return p+(q-p)*6*t; if(t<1/2)return q; if(t<2/3)return p+(q-p)*(2/3-t)*6; return p; }
      var q = l<0.5 ? l*(1+s) : l+s-l*s, p = 2*l-q;
      r = q2(p,q,h+1/3); g = q2(p,q,h); b = q2(p,q,h-1/3);
    }
    return [Math.round(r*255), Math.round(g*255), Math.round(b*255)];
  }

  /* ── Main render ── */
  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    if (curHex) recolorBlue(curHex);
    if (userLogo) drawLogo();
  }

  /* Pixel-level hue replacement */
  function recolorBlue(targetHex) {
    var id   = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var d    = id.data;
    var tHsl = hexToHsl(targetHex);
    var th   = tHsl[0], ts = tHsl[1], tl = tHsl[2];

    for (var i = 0; i < d.length; i += 4) {
      var r = d[i], g = d[i+1], b = d[i+2], a = d[i+3];
      if (a < 30) continue;

      var pxHex = '#' + [r,g,b].map(function(v){ return v.toString(16).padStart(2,'0'); }).join('');
      var hsl = hexToHsl(pxHex);
      var ph = hsl[0], ps = hsl[1], pl = hsl[2];

      var hDiff = Math.min(Math.abs(ph - SOURCE_HUE), 360 - Math.abs(ph - SOURCE_HUE));
      if (hDiff < HUE_TOLERANCE && ps > 25 && pl > 15 && pl < 82) {
        var lightnessDelta = pl - 52;
        var nl = Math.max(5, Math.min(95, tl + lightnessDelta));
        var rgb = hslToRgb(th, ts * 0.92, nl);
        d[i] = rgb[0]; d[i+1] = rgb[1]; d[i+2] = rgb[2];
      }
    }
    ctx.putImageData(id, 0, 0);
  }

  /* Draw user logo over the print area */
  function drawLogo() {
    var cw = canvas.width, ch = canvas.height;
    var rx = Math.round(LOGO_REGION.x * cw),
        ry = Math.round(LOGO_REGION.y * ch),
        rw = Math.round(LOGO_REGION.w * cw),
        rh = Math.round(LOGO_REGION.h * ch);

    /* Sample background colour at centre of print area and fill a backing rect */
    var id = ctx.getImageData(rx + Math.round(rw / 2), ry + Math.round(rh / 2), 1, 1);
    ctx.fillStyle = 'rgb(' + id.data[0] + ',' + id.data[1] + ',' + id.data[2] + ')';
    ctx.fillRect(rx, ry, rw, rh);

    /* Scale logo to fill print area while keeping aspect ratio (contain) */
    var ratio = userLogo.naturalWidth / userLogo.naturalHeight;
    var dw, dh;
    if (rw / rh > ratio) {
      /* print area is wider than logo — fit by height */
      dh = rh;
      dw = rh * ratio;
    } else {
      /* print area is taller than logo — fit by width */
      dw = rw;
      dh = rw / ratio;
    }
    var dx = rx + (rw - dw) / 2;
    var dy = ry + (rh - dh) / 2;
    ctx.drawImage(userLogo, dx, dy, dw, dh);
  }

  /* ── Logo upload ── */
  logoInp.addEventListener('change', function (e) {
    var f = e.target.files[0];
    if (!f) return;
    loadLogoFile(f);
  });

  logoDrop.addEventListener('dragover', function (e) {
    e.preventDefault();
    logoDrop.classList.add('dragover');
  });
  logoDrop.addEventListener('dragleave', function () {
    logoDrop.classList.remove('dragover');
  });
  logoDrop.addEventListener('drop', function (e) {
    e.preventDefault();
    logoDrop.classList.remove('dragover');
    var f = e.dataTransfer.files[0];
    if (f) loadLogoFile(f);
  });

  function loadLogoFile(f) {
    var reader = new FileReader();
    reader.onload = function (ev) {
      var logo = new Image();
      logo.onload = function () {
        userLogo = logo;
        logoTxt.innerHTML = 'Logo loaded — <strong>click to change</strong>';
        render();
      };
      logo.src = ev.target.result;
    };
    reader.readAsDataURL(f);
  }

  /* ── Download ── */
  btnDl.addEventListener('click', function () {
    var link = document.createElement('a');
    link.download = 'unipi-odm-preview.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  });

  /* ── Reset ── */
  btnRst.addEventListener('click', resetCfg);

  function resetCfg() {
    curHex   = null;
    userLogo = null;
    document.querySelectorAll('.sw').forEach(function (s) { s.classList.remove('on'); });
    selDot.style.display = 'none';
    selName.textContent  = 'No color selected — showing original';
    logoTxt.innerHTML    = 'Click or drag to upload logo <strong>(PNG / SVG / JPG)</strong><br>Replaces the Unipi symbol &amp; wordmark';
    render();
  }

})();
