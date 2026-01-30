# WeAreDevs Obfuscator — Static Website

This folder contains a simple static website for the WeAreDevs-Obfuscator repository.

Quick start (serve locally):

```bash
cd web
python3 -m http.server 8000
# then open http://localhost:8000
```

Deploy with GitHub Pages:

- This repository includes a GitHub Actions workflow that publishes the `web/` directory to the `gh-pages` branch on push to `master`.
- Enable GitHub Pages in repository settings (source: `gh-pages` branch) if not already enabled.

Files:
- `index.html` — homepage
- `styles.css` — styling
- `script.js` — client-side helper and markdown viewer
