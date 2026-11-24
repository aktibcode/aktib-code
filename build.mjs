/* ============================================================
   AktibCode — générateur de pages d’article
   Usage : node build.mjs
   Lit assets/js/data.js et écrit <slug>.html à la racine.
   ============================================================ */

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const {
  SITE,
  CATEGORIES,
  ARTICLES,
  LEXIQUE,
  formatDate,
  readingTime,
  categoryLabel,
  sortArticles,
} = require("./assets/js/data.js");

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const checkOnly = process.argv.includes("--check");
const outputs = new Map();

const writeFile = (file, content) => {
  const target = path.join(ROOT, file);
  const previous = fs.existsSync(target) ? fs.readFileSync(target, "utf8") : "";
  const newline = previous.includes("\r\n") ? "\r\n" : "\n";
  const normalized = content.replace(/\r?\n/g, newline);
  outputs.set(file, normalized);
  if (!checkOnly && previous !== normalized) fs.writeFileSync(target, normalized, "utf8");
};

const absoluteUrl = (value = "") => new URL(value, `${SITE.url}/`).toString();

const escapeRegExp = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const esc = (str = "") =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const slugify = (str) =>
  String(str)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const icon = {
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>',
  arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
};

const themeScript = `<script>
    (function () {
      try {
        var t = localStorage.getItem("aktibcode-theme");
        if (!t) t = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        document.documentElement.dataset.theme = t;
      } catch (e) { document.documentElement.dataset.theme = "light"; }
    })();
  </script>`;

const head = ({ title, description, image = "assets/images/hero.jpg", imageAlt = "Illustration AktibCode", type = "article", author = "AktibCode", pathname = "index.html", extra = "" }) => `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="author" content="${esc(author)}">
  <meta name="theme-color" content="#f3efe3">
  <link rel="canonical" href="${esc(absoluteUrl(pathname))}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:type" content="${type}">
  <meta property="og:url" content="${esc(absoluteUrl(pathname))}">
  <meta property="og:site_name" content="${esc(SITE.name)}">
  <meta property="og:image" content="${esc(absoluteUrl(image))}">
  <meta property="og:image:alt" content="${esc(imageAlt)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${esc(absoluteUrl(image))}">
  ${extra}
  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
  ${themeScript}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/style.css">
</head>`;

const header = (active) => `<a class="skip-link" href="#contenu">Aller au contenu</a>

  <header class="site-header">
    <div class="container header-inner">
      <a class="logo" href="index.html" aria-label="AktibCode, retour à l’accueil">
        <span class="logo-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.05 4.2h1.9L19.3 19.8h-3.3l-1.15-3.05H9.15L8 19.8H4.7L11.05 4.2Zm-.15 9.75h2.2L12 10.05l-1.1 3.9Z" fill="currentColor"/></svg>
        </span>
        <span class="logo-word">Aktib<em>Code</em></span>
      </a>
      <nav class="site-nav" aria-label="Navigation principale">
        <a href="articles.html"${active === "articles" ? ' aria-current="page"' : ""}>Articles</a>
        <a href="lexique.html"${active === "lexique" ? ' aria-current="page"' : ""}>Lexique</a>
        <a href="a-propos.html"${active === "about" ? ' aria-current="page"' : ""}>À propos</a>
      </nav>
      <div class="header-actions">
        <button class="theme-toggle" type="button" aria-label="Passer en mode sombre" title="Mode sombre">
          <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
          <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5 8.5 8.5 0 1 0 20.5 14.5Z"/></svg>
        </button>
        <a class="btn btn--accent btn--header" href="articles.html">Tous les articles
          ${icon.arrow}
        </a>
        <button class="nav-toggle" type="button" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="mobile-menu">
          <span></span>
        </button>
      </div>
    </div>
  </header>

  <div class="mobile-menu" id="mobile-menu" role="navigation" aria-label="Navigation mobile">
    <a href="articles.html">Articles <span>${String(ARTICLES.length).padStart(2, "0")}</span></a>
    <a href="lexique.html">Lexique <span>${LEXIQUE.length}</span></a>
    <a href="a-propos.html">À propos <span>Le projet</span></a>
    <a href="mailto:${SITE.email}">Nous écrire <span>↗</span></a>
  </div>`;

const footer = () => `  <footer class="site-footer">
    <div class="container">
      <div class="footer-top">
        <div class="footer-brand">
          <span class="logo-word">Aktib<em>Code</em></span>
          <p>Un magazine indépendant de vulgarisation tech. Des explications claires, sans raccourcis malhonnêtes, pour comprendre les outils qui nous entourent.</p>
          <a class="footer-mail" href="mailto:${SITE.email}">${SITE.email}</a>
        </div>
        <div class="footer-col">
          <h3>Explorer</h3>
          <ul>
            <li><a href="articles.html">Tous les articles</a></li>
            <li><a href="lexique.html">Le lexique</a></li>
            <li><a href="articles.html?cat=D%C3%A9cryptage">Décryptage</a></li>
            <li><a href="articles.html?cat=Intelligence%20artificielle">Intelligence artificielle</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h3>Le projet</h3>
          <ul>
            <li><a href="a-propos.html">À propos</a></li>
            <li><a href="a-propos.html#formats">Nos formats</a></li>
            <li><a href="mailto:${SITE.email}">Proposer un sujet</a></li>
            <li><a href="mailto:${SITE.email}">Signaler une erreur</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-giant" aria-hidden="true">Aktib<em>Code</em></div>
      <div class="footer-bottom">
        <span>© <span data-year>${SITE.year}</span> AktibCode · La tech, sans le jargon.</span>
        <span class="footer-badge">Écrit et fabriqué avec soin</span>
      </div>
    </div>
  </footer>`;

function renderBlocks(blocks) {
  let section = 0;
  const toc = [];

  const body = blocks.map((block) => {
    switch (block.type) {
      case "h2": {
        section += 1;
        const id = slugify(block.text) || `section-${section}`;
        toc.push({ id, text: block.text });
        return `<h2 id="${id}">${block.text}</h2>`;
      }
      case "p":
        return `<p>${block.text}</p>`;
      case "quote":
        return `<blockquote>${block.text}</blockquote>`;
      case "list":
        return `<ul>${block.items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
      case "note":
        return `<div class="note"><span class="note-title">${block.title}</span><p>${block.text}</p></div>`;
      case "code":
        return `<pre><span class="code-lang">${esc(block.lang || "code")}</span><code>${esc(block.code)}</code></pre>`;
      default:
        return "";
    }
  }).join("");

  return { body, toc };
}

function responsiveImage(article, sizes, { loading = "lazy", fetchpriority = "" } = {}) {
  const variants = [640, 960, 1400]
    .map((width) => `${article.cover.replace(/\.[^.]+$/, `-${width}.webp`)} ${width}w`)
    .join(", ");
  return `<img src="${article.cover}" srcset="${variants}" sizes="${sizes}" alt="${esc(article.coverAlt)}" width="1400" height="933" loading="${loading}" decoding="async"${fetchpriority ? ` fetchpriority="${fetchpriority}"` : ""}>`;
}

function card(a, opts = {}) {
  const wide = opts.wide ? " article-card--wide" : "";
  const sizes = opts.wide
    ? "(max-width: 1080px) 100vw, 60vw"
    : "(max-width: 620px) 100vw, (max-width: 1080px) 50vw, 33vw";
  return `
    <article class="article-card${wide}" data-category="${esc(a.category)}" data-search="${esc([a.title, a.dek, a.category, ...(a.takeaways || [])].join(" "))}">
      <div class="card-media">
        ${responsiveImage(a, sizes)}
      </div>
      <div class="card-body">
        <span class="card-cat" style="--cat:${CATEGORIES[a.category].color}">${esc(categoryLabel(a.category))}</span>
        <h3 class="card-title"><a href="${a.slug}.html">${esc(a.title)}</a></h3>
        <p class="card-dek">${esc(a.dek)}</p>
        <div class="card-foot">
          <time datetime="${a.date}">${formatDate(a.date, "short")}</time>
          <span class="read">${readingTime(a)} min de lecture</span>
        </div>
      </div>
    </article>`;
}

function heroFeature(a) {
  return `<a class="hero-feature" id="hero-feature" href="${a.slug}.html" data-static="true" aria-label="À la une : ${esc(a.title)}">
        <span class="sticker" aria-hidden="true"><span>✳</span>À la une</span>
        <div class="hero-feature-media">
          ${responsiveImage(a, "(max-width: 880px) 100vw, 45vw", { loading: "eager", fetchpriority: "high" })}
        </div>
        <div class="hero-feature-body">
          <div>
            <span class="card-cat" style="--cat:${CATEGORIES[a.category].color}">${categoryLabel(a.category)}</span>
            <h2>${esc(a.title)}</h2>
            <div class="meta">
              <span>${formatDate(a.date, "short")}</span>
              <span>·</span>
              <span>${readingTime(a)} min</span>
            </div>
          </div>
          <span class="hero-feature-arrow">${icon.arrow}</span>
        </div>
      </a>`;
}

function filterChips(activeCat = "Tous") {
  return ["Tous", ...Object.keys(CATEGORIES)].map((cat) =>
    `<button class="filter-chip" type="button" data-cat="${cat}" aria-pressed="${cat === activeCat}">${cat === "Tous" ? "Tout" : cat}</button>`
  ).join("");
}

function categoryLinks() {
  return Object.entries(CATEGORIES).map(([name, cfg], i) => {
    const count = ARTICLES.filter((a) => a.category === name).length;
    return `<a class="cat-link" href="articles.html?cat=${encodeURIComponent(name)}" style="--cat:${cfg.color}">
            <span class="cat-index">0${i + 1}</span>
            <div>
              <h3>${name}</h3>
              <span class="cat-count">${count} article${count > 1 ? "s" : ""}</span>
            </div>
            <span class="cat-bar"></span>
          </a>`;
  }).join("") + `<a class="cat-link cat-link--all" href="articles.html" style="--cat:var(--accent)">
          <span class="cat-index">→</span>
          <div>
            <h3>Tout voir</h3>
            <span class="cat-count">${ARTICLES.length} articles</span>
          </div>
          <span class="cat-bar"></span>
        </a>`;
}

function lexiconMini() {
  return ["API", "LLM", "HTTPS", "Open source"].map((term) => {
    const entry = LEXIQUE.find((item) => item.term === term);
    if (!entry) return "";
    return `<a href="lexique.html#${slugify(entry.term)}">
            <div>
              <span class="lex-term">${esc(entry.term)}</span>
              <span class="lex-def">${esc(entry.definition)}</span>
            </div>
            <span class="lex-tag">${esc(entry.category)}</span>
          </a>`;
  }).join("");
}

function lexiconGroups() {
  const groups = new Map();
  [...LEXIQUE].sort((a, b) => a.term.localeCompare(b.term, "fr")).forEach((entry) => {
    const letter = entry.term[0].toUpperCase();
    if (!groups.has(letter)) groups.set(letter, []);
    groups.get(letter).push(entry);
  });

  return [...groups.entries()].map(([letter, entries]) => `
        <section class="lex-group" aria-labelledby="lettre-${letter}">
          <h2 class="lex-letter" id="lettre-${letter}">${letter}</h2>${entries.map((entry) => `
            <article class="lex-entry" id="${slugify(entry.term)}">
              <h3 class="lex-term">${esc(entry.term)}</h3>
              <p>${esc(entry.definition)}${entry.article ? `<br><a class="lex-link" href="${entry.article}.html">Lire l’article ${icon.arrowRight}</a>` : ""}</p>
              <span class="lex-cat">${esc(entry.category)}</span>
            </article>`).join("")}
        </section>`).join("");
}

function replaceRegion(html, name, content) {
  const pattern = new RegExp(`<!-- build:${escapeRegExp(name)} -->[\\s\\S]*?<!-- /build:${escapeRegExp(name)} -->`);
  if (!pattern.test(html)) throw new Error(`Région de génération absente : ${name}`);
  return html.replace(pattern, () => `<!-- build:${name} -->\n${content}\n<!-- /build:${name} -->`);
}

const numberWords = ["zéro", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf", "vingt"];
const numberWord = (value, feminine = false) => value === 1 ? (feminine ? "une" : "un") : (numberWords[value] || String(value));
const minutes = ARTICLES.map(readingTime);
const readingRange = Math.min(...minutes) === Math.max(...minutes)
  ? numberWord(Math.min(...minutes), true)
  : `${numberWord(Math.min(...minutes), true)} à ${numberWord(Math.max(...minutes), true)}`;

function updateCounts(html) {
  return html
    .replace(/(<a href="articles\.html">Articles <span>)[^<]+(<\/span>)/g, `$1${String(ARTICLES.length).padStart(2, "0")}$2`)
    .replace(/(<a href="lexique\.html">Lexique <span>)[^<]+(<\/span>)/g, `$1${LEXIQUE.length}$2`)
    .replace(/(data-stat="articles">)[^<]+/g, `$1${ARTICLES.length}`)
    .replace(/(data-stat="notions">)[^<]+/g, `$1${LEXIQUE.length}`)
    .replace(/(data-stat="themes">)[^<]+/g, `$1${Object.keys(CATEGORIES).length}`)
    .replace(/(<span id="results-count"[^>]*>)[^<]+/g, `$1${ARTICLES.length} article${ARTICLES.length > 1 ? "s" : ""}`)
    .replace(/(<span id="lex-count"[^>]*>)[^<]+/g, `$1${LEXIQUE.length} notion${LEXIQUE.length > 1 ? "s" : ""}`)
    .replace(/(data-count="articles">)[^<]+/g, `$1${numberWord(ARTICLES.length, true)}`)
    .replace(/(data-count="themes">)[^<]+/g, `$1${numberWord(Object.keys(CATEGORIES).length)}`)
    .replace(/(data-count="notions">)[^<]+/g, `$1${numberWord(LEXIQUE.length, true)}`)
    .replace(/(data-count="reading-range">)[^<]+/g, `$1${readingRange}`);
}

function upsertMetaTag(html, attribute, key, content) {
  const pattern = new RegExp(`<meta\\s+${attribute}=[\"']${escapeRegExp(key)}[\"'][^>]*>`, "i");
  const tag = `<meta ${attribute}="${key}" content="${esc(content)}">`;
  return pattern.test(html)
    ? html.replace(pattern, () => tag)
    : html.replace("</head>", `  ${tag}\n</head>`);
}

function upsertLink(html, rel, href) {
  const pattern = new RegExp(`<link\\s+rel=[\"']${escapeRegExp(rel)}[\"'][^>]*>`, "i");
  const tag = `<link rel="${rel}" href="${esc(href)}">`;
  return pattern.test(html)
    ? html.replace(pattern, () => tag)
    : html.replace("</head>", `  ${tag}\n</head>`);
}

function updateStaticMetadata(html, { pathname, image, imageAlt = "Illustration AktibCode", description, type = "website" }) {
  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || SITE.name;
  const pageDescription = description || html.match(/<meta\s+name=["']description["'][^>]*content=["']([^"']*)["']/i)?.[1] || SITE.description;
  html = upsertMetaTag(html, "property", "og:title", title);
  html = upsertMetaTag(html, "property", "og:description", pageDescription);
  html = upsertMetaTag(html, "property", "og:url", absoluteUrl(pathname));
  html = upsertMetaTag(html, "property", "og:site_name", SITE.name);
  html = upsertMetaTag(html, "property", "og:image", absoluteUrl(image));
  html = upsertMetaTag(html, "property", "og:image:alt", imageAlt);
  html = upsertMetaTag(html, "property", "og:type", type);
  html = upsertMetaTag(html, "name", "twitter:card", "summary_large_image");
  html = upsertMetaTag(html, "name", "twitter:title", title);
  html = upsertMetaTag(html, "name", "twitter:description", pageDescription);
  html = upsertMetaTag(html, "name", "twitter:image", absoluteUrl(image));
  html = upsertMetaTag(html, "name", "author", "AktibCode");
  html = upsertLink(html, "canonical", absoluteUrl(pathname));
  return html;
}

function buildHomepage() {
  let html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
  const sorted = sortArticles();
  const feature = ARTICLES.find((article) => article.featured) || sorted[0];
  const rest = sorted.filter((article) => article.slug !== feature.slug).slice(0, 5);

  html = replaceRegion(html, "hero-feature", heroFeature(feature));
  html = replaceRegion(html, "home-grid", rest.map((article, index) => card(article, { wide: index === 0 })).join(""));
  html = replaceRegion(html, "cat-list", categoryLinks());
  html = replaceRegion(html, "lex-mini", lexiconMini());
  html = updateCounts(html);
  html = updateStaticMetadata(html, { pathname: "", image: feature.cover, imageAlt: feature.coverAlt });
  writeFile("index.html", html);
}

function buildArticlesPage() {
  let html = fs.readFileSync(path.join(ROOT, "articles.html"), "utf8");
  html = replaceRegion(html, "filters", filterChips());
  html = replaceRegion(html, "articles-grid", sortArticles().map((article) => card(article)).join(""));
  html = updateCounts(html);
  html = updateStaticMetadata(html, { pathname: "articles.html", image: "assets/images/hero.jpg" });
  writeFile("articles.html", html);
}

function buildLexiquePage() {
  let html = fs.readFileSync(path.join(ROOT, "lexique.html"), "utf8");
  html = replaceRegion(html, "lex-groups", lexiconGroups());
  html = updateCounts(html);
  html = updateStaticMetadata(html, { pathname: "lexique.html", image: "assets/images/hero.jpg" });
  writeFile("lexique.html", html);
}

function buildSeoFiles() {
  const pages = [
    { file: "index.html" },
    { file: "articles.html" },
    { file: "lexique.html" },
    { file: "a-propos.html" },
    ...ARTICLES.map((article) => ({ file: `${article.slug}.html`, modified: article.date })),
  ];
  const urls = pages.map(({ file, modified }) => `  <url>\n    <loc>${esc(absoluteUrl(file === "index.html" ? "" : file))}</loc>${modified ? `\n    <lastmod>${modified}</lastmod>` : ""}\n  </url>`).join("\n");
  writeFile("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
  writeFile("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${absoluteUrl("sitemap.xml")}\n`);
}

function renderSources(article) {
  if (!article.sources?.length) return "";
  return `<section class="article-sources" aria-labelledby="sources-${article.slug}">
            <h2 id="sources-${article.slug}">Sources principales</h2>
            <p>Pour vérifier, approfondir ou prendre en compte l’évolution du sujet.</p>
            <ul>
              ${article.sources.map((source) => `<li><a href="${esc(source.url)}" rel="external">${esc(source.title)}</a> <span>— ${esc(source.publisher)}</span></li>`).join("")}
            </ul>
          </section>`;
}

function buildArticle(a) {
  const minutes = readingTime(a);
  const { body, toc } = renderBlocks(a.blocks);
  const sorted = sortArticles();
  const idx = sorted.findIndex((x) => x.slug === a.slug);
  const newer = sorted[idx - 1];
  const older = sorted[idx + 1];

  const relatedPool = sorted.filter((x) => x.slug !== a.slug && x.category === a.category);
  const related = [...relatedPool, ...sorted.filter((x) => x.slug !== a.slug && x.category !== a.category)].slice(0, 2);

  const tocHtml = toc
    .map((item) => `<li><a href="#${item.id}">${item.text}</a></li>`)
    .join("");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: a.title,
    description: a.dek,
    image: absoluteUrl(a.cover),
    datePublished: a.date,
    dateModified: a.date,
    inLanguage: "fr",
    articleSection: a.category,
    mainEntityOfPage: absoluteUrl(`${a.slug}.html`),
    citation: a.sources?.map((source) => source.url),
    author: { "@type": "Person", name: a.author, url: absoluteUrl("a-propos.html") },
    publisher: { "@type": "Organization", name: "AktibCode", url: SITE.url, logo: absoluteUrl("assets/favicon.svg") },
  };

  return `${head({
    title: `${a.title} — AktibCode`,
    description: a.dek,
    image: a.cover,
    imageAlt: a.coverAlt,
    author: a.author,
    pathname: `${a.slug}.html`,
    extra: `<meta property="article:published_time" content="${a.date}">
  <meta property="article:section" content="${esc(a.category)}">
  <script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, "\\u003c")}</script>`,
  })}
<body data-page="article">
  <div class="progress-bar" aria-hidden="true"></div>
  ${header()}

  <main id="contenu">
    <article>
      <header class="article-head">
        <div class="container">
          <nav class="breadcrumb" aria-label="Fil d’Ariane">
            <a href="index.html">Accueil</a><span class="sep">/</span>
            <a href="articles.html">Articles</a><span class="sep">/</span>
            <span>${categoryLabel(a.category)}</span>
          </nav>
          <span class="card-cat" style="--cat:${CATEGORIES[a.category].color}">${categoryLabel(a.category)}</span>
          <h1 class="article-title">${a.title}</h1>
          <p class="article-dek">${a.dek}</p>
          <div class="article-meta">
            <span class="author"><span class="author-badge" aria-hidden="true">${esc(a.author.charAt(0).toUpperCase())}</span>${a.author}</span>
            <time datetime="${a.date}">${formatDate(a.date)}</time>
            <span>${minutes} min de lecture</span>
          </div>
        </div>
      </header>

      <div class="container">
        <figure class="article-cover">
          ${responsiveImage(a, "(max-width: 1240px) 100vw, 1240px", { loading: "eager", fetchpriority: "high" })}
          <figcaption>
            <span>${a.category} · ${formatDate(a.date, "short")}</span>
            <span>Portrait : Mbairassem</span>
          </figcaption>
        </figure>
      </div>

      <div class="article-layout container">
        <aside class="article-aside">
          <div class="aside-label">Sommaire</div>
          <ol class="toc">
            ${tocHtml}
          </ol>
          <div class="aside-share">
            <button class="icon-btn" type="button" data-copy-link aria-label="Copier le lien de l’article" title="Copier le lien">${icon.copy}</button>
            <a class="icon-btn" href="mailto:?subject=${encodeURIComponent(a.title)}&body=${encodeURIComponent("À lire sur AktibCode : " + a.title)}" aria-label="Partager par e-mail" title="Partager par e-mail">${icon.mail}</a>
          </div>
        </aside>

        <div class="prose">
          ${body}

          <div class="takeaways">
            <h2>L’essentiel en ${a.takeaways.length} points</h2>
            <ol>
              ${a.takeaways.map((t) => `<li>${t}</li>`).join("")}
            </ol>
          </div>
          ${renderSources(a)}

          <div class="article-foot">
            <div class="tags">
              <span class="tag">${a.category}</span>
              <span class="tag">Sans jargon</span>
              <span class="tag">${minutes} min</span>
            </div>
            <button class="btn" type="button" data-copy-link>Copier le lien ${icon.copy}</button>
          </div>
        </div>

        <aside class="article-rail" aria-label="Repères et ressources">
          <div class="rail-block">
            <div class="aside-label">Repères</div>
            <div class="rail-fact"><span>Thème</span><strong>${categoryLabel(a.category)}</strong></div>
            <div class="rail-fact"><span>Lecture</span><strong>${minutes} min</strong></div>
            <div class="rail-fact"><span>Niveau</span><strong>Accessible</strong></div>
          </div>
          <div class="rail-block">
            <div class="aside-label">Le lexique</div>
            <p>Une notion vous arrête en route ?</p>
            <a class="rail-link" href="lexique.html">Chercher un mot</a>
          </div>
          <div class="rail-block">
            <div class="aside-label">Une nuance ?</div>
            <p>Une erreur, un point à préciser ?</p>
            <a class="rail-link" href="mailto:${SITE.email}?subject=${encodeURIComponent("À propos de : " + a.title)}">Écrire à la rédaction</a>
          </div>
        </aside>
      </div>

      <nav class="article-nav container" aria-label="Navigation entre les articles">
        <a href="${(newer || { slug: "articles" }).slug}.html">
          <span class="nav-label">← Plus récent</span>
          <span class="nav-title">${newer ? newer.title : "Tous les articles"}</span>
        </a>
        <a href="${(older || { slug: "articles" }).slug}.html">
          <span class="nav-label">Plus ancien →</span>
          <span class="nav-title">${older ? older.title : "Tous les articles"}</span>
        </a>
      </nav>

      <section class="related">
        <div class="container">
          <div class="related-head">
            <div>
              <span class="section-label">Continuer</span>
              <h2>À lire <em>aussi</em>.</h2>
            </div>
            <a class="link-arrow" href="articles.html">Tout le catalogue ${icon.arrow}</a>
          </div>
          <div class="article-grid">
            ${related.map(card).join("")}
          </div>
        </div>
      </section>
    </article>
  </main>

  ${footer()}

  <div class="toast" role="status" aria-live="polite"></div>
  <script src="assets/js/data.js"></script>
  <script src="assets/js/site.js"></script>
</body>
</html>`;
}

let count = 0;
for (const article of ARTICLES) {
  writeFile(`${article.slug}.html`, buildArticle(article));
  count += 1;
}

buildHomepage();
buildArticlesPage();
buildLexiquePage();

for (const file of ["a-propos.html", "404.html"]) {
  const current = fs.readFileSync(path.join(ROOT, file), "utf8");
  const html = file === "a-propos.html"
    ? updateStaticMetadata(updateCounts(current), { pathname: file, image: "assets/images/portrait.jpeg", imageAlt: "Portrait de Mbairassem, fondateur d’AktibCode" })
    : updateCounts(current);
  writeFile(file, html);
}

buildSeoFiles();

if (checkOnly) {
  const drifted = [...outputs].filter(([file, content]) => {
    const target = path.join(ROOT, file);
    return !fs.existsSync(target) || fs.readFileSync(target, "utf8") !== content;
  });
  if (drifted.length) {
    console.error(`✗ ${drifted.length} fichier(s) non synchronisé(s) : ${drifted.map(([file]) => file).join(", ")}`);
    process.exitCode = 1;
  } else {
    console.log(`✓ ${outputs.size} fichiers générés sont à jour.`);
  }
} else {
  console.log(`✓ ${count} articles et les pages statiques générés (${LEXIQUE.length} notions, sitemap et robots.txt).`);
}
