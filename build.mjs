/* ============================================================
   AktibCode — générateur de pages d’article
   Usage : node build.mjs
   Lit assets/js/data.js et écrit <slug>.html à la racine.
   ============================================================ */

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

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

const ROOT = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));

const esc = (str = "") =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

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

const head = ({ title, description, image = "assets/images/hero.jpg", type = "article", extra = "" }) => `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="author" content="AktibCode">
  <meta name="theme-color" content="#f3efe3">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:type" content="${type}">
  <meta property="og:image" content="${image}">
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
  });

  return { body, toc };
}

function card(a) {
  return `
    <article class="article-card">
      <div class="card-media">
        <img src="${a.cover}" alt="${esc(a.coverAlt)}" loading="lazy" decoding="async" width="1400" height="933">
      </div>
      <div class="card-body">
        <span class="card-cat" style="--cat:${CATEGORIES[a.category].color}">${categoryLabel(a.category)}</span>
        <h3 class="card-title"><a href="${a.slug}.html">${a.title}</a></h3>
        <p class="card-dek">${a.dek}</p>
        <div class="card-foot">
          <time datetime="${a.date}">${formatDate(a.date, "short")}</time>
          <span class="read">${readingTime(a)} min de lecture</span>
        </div>
      </div>
    </article>`;
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
    image: a.cover,
    datePublished: a.date,
    dateModified: a.date,
    inLanguage: "fr",
    articleSection: a.category,
    author: { "@type": "Organization", name: "AktibCode" },
    publisher: { "@type": "Organization", name: "AktibCode" },
  };

  return `${head({
    title: `${a.title} — AktibCode`,
    description: a.dek,
    image: a.cover,
    extra: `<meta property="article:published_time" content="${a.date}">
  <meta property="article:section" content="${esc(a.category)}">
  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`,
  })}
<body data-page="article">
  <div class="progress-bar" aria-hidden="true"></div>
  ${header("articles")}

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
            <span class="author"><span class="author-badge" aria-hidden="true">A</span>${a.author}</span>
            <time datetime="${a.date}">${formatDate(a.date)}</time>
            <span>${minutes} min de lecture</span>
          </div>
        </div>
      </header>

      <div class="container">
        <figure class="article-cover">
          <img src="${a.cover}" alt="${esc(a.coverAlt)}" width="1400" height="933">
          <figcaption>
            <span>${a.category} · ${formatDate(a.date, "short")}</span>
            <span>Illustration : AktibCode</span>
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
  const html = buildArticle(article);
  fs.writeFileSync(path.join(ROOT, `${article.slug}.html`), html, "utf8");
  count += 1;
}

console.log(`✓ ${count} pages d’article générées (${ARTICLES.length} articles, ${LEXIQUE.length} notions).`);
