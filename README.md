# Wordcounter

A public, local-processing web app for text statistics.

## Features

- Paste text into a browser-only textarea.
- Show word count, character count, sentence count, paragraph count, line count, and reading time.
- Rank the most used words with English and German stop-word filtering.
- Show keyword share, averages, and density bars.
- Keep all text in React memory only.

## Privacy

- Text is not uploaded.
- Text is not saved to Supabase, localStorage, sessionStorage, IndexedDB, cookies, or any backend by this app.
- Entered text is cleared on refresh or tab close.

## Development

Install Node.js 20 or newer, then run:

```powershell
npm install
npm run dev
```

Build for production:

```powershell
npm run build
```

Preview the production build:

```powershell
npm run preview
```

## GitHub Pages

The repository includes a GitHub Pages workflow at `.github/workflows/deploy-pages.yml` and a `CNAME` file for:

```text
wordcounter.marfeyx.ch
```
