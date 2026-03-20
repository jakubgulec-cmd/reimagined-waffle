# Unipi Technology — Homepage

Static B2B website for Unipi Technology.  
Pure HTML / CSS / JavaScript — no build step, no dependencies, no bundler.

## Structure

```
unipi-website/
├── index.html          # Main page
├── css/
│   └── main.css        # All styles
├── js/
│   ├── ral.js          # RAL Classic palette data (~215 colors)
│   ├── configurator.js # ODM canvas configurator logic
│   └── main.js         # Nav, scroll-reveal, misc
└── assets/
    └── edge-e413.png   # Unipi Edge E413 product photo (top view)
```

## Running locally

Just open `index.html` in a browser — **but use a local server** for the canvas image to load correctly (browsers block `file://` cross-origin reads from canvas):

```bash
# Python 3
python -m http.server 8080

# Node (npx)
npx serve .
```

Then open http://localhost:8080

## ODM Configurator

The configurator in the OEM/ODM section:

1. **Loads** `assets/edge-e413.png` onto a `<canvas>`
2. **Recolors** — when a RAL swatch is clicked, a pixel-level HSL algorithm replaces the blue enclosure hue with the target color, preserving highlights and shadows
3. **Logo overlay** — uploaded PNG/JPG/SVG is drawn over the Unipi symbol + wordmark region (LOGO_REGION constants in `configurator.js` can be fine-tuned)
4. **Download** — exports the canvas as `unipi-odm-preview.png`

### Tuning the logo position

In `js/configurator.js`, find:

```js
const LOGO_REGION = { x: 0.25, y: 0.37, w: 0.24, h: 0.20 };
```

Values are fractions of canvas width/height. Adjust to match the exact area on the photo.

## Deploying to GitHub Pages

1. Push this folder to a GitHub repo
2. Go to **Settings → Pages → Source**: select `main` branch, root `/`
3. Site will be live at `https://<username>.github.io/<repo>/`

## Customisation checklist

- [ ] Replace placeholder `href="#"` links with real URLs
- [ ] Add real product images to `assets/` and reference them in HTML
- [ ] Connect the "Contact us" mailto to a form handler (e.g. Formspree)
- [ ] Update stats (65+ countries, 10k+ projects) with real figures
- [ ] Adjust `LOGO_REGION` in `configurator.js` after testing with real logos
- [ ] Add Google Analytics or Plausible snippet to `index.html`

## Colors (brand palette)

| Name | Hex |
|---|---|
| Unipi Blue | `#1B75BC` |
| Unipi Orange | `#FF8D3F` |
| Unipi Light Blue | `#D9E2F3` |
| Unipi Text Blue | `#2F5496` |
