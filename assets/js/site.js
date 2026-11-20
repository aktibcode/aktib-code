/* AktibCode — interactions du site */
(function () {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const icons = {
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>',
    arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
  };

  /* ---------- Thème ---------- */

  function currentTheme() {
    return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  }

  function applyTheme(theme, persist) {
    document.documentElement.dataset.theme = theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#12110d" : "#f3efe3");
    const btn = $(".theme-toggle");
    if (btn) {
      btn.setAttribute("aria-label", theme === "dark" ? "Passer en mode clair" : "Passer en mode sombre");
      btn.setAttribute("title", theme === "dark" ? "Mode clair" : "Mode sombre");
    }
    if (persist) {
      try { localStorage.setItem("aktibcode-theme", theme); } catch (e) {}
    }
  }

  function initTheme() {
    applyTheme(currentTheme(), false);
    const btn = $(".theme-toggle");
    if (btn) {
      btn.addEventListener("click", () => {
        applyTheme(currentTheme() === "dark" ? "light" : "dark", true);
      });
    }
  }

  /* ---------- Menu mobile ---------- */

  function initMenu() {
    const toggle = $(".nav-toggle");
    const menu = $("#mobile-menu");
    if (!toggle || !menu) return;

    const firstLink = $("a", menu);

    const close = (restoreFocus) => {
      if (!menu.classList.contains("is-open")) return;
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
      if (restoreFocus) toggle.focus({ preventScroll: true });
    };

    toggle.addEventListener("click", () => {
      const open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.classList.toggle("menu-open", open);
      if (open && firstLink) firstLink.focus({ preventScroll: true });
    });

    $$("a", menu).forEach((a) => a.addEventListener("click", () => close(false)));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close(true);
    });
    document.addEventListener("click", (e) => {
      if (!menu.classList.contains("is-open")) return;
      if (menu.contains(e.target) || toggle.contains(e.target)) return;
      close(false);
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 880) close(false);
    });
  }

  /* ---------- Utilitaires ---------- */

  function catColor(cat) {
    return (CATEGORIES[cat] && CATEGORIES[cat].color) || "var(--accent)";
  }

  function catName(cat) {
    return (CATEGORIES[cat] && CATEGORIES[cat].short) || cat;
  }

  function articleCard(a, opts = {}) {
    const wide = opts.wide ? " article-card--wide" : "";
    return `
      <article class="article-card${wide}">
        <div class="card-media">
          <img src="${a.cover}" alt="${a.coverAlt}" loading="lazy" decoding="async" width="1400" height="933">
        </div>
        <div class="card-body">
          <span class="card-cat" style="--cat:${catColor(a.category)}">${catName(a.category)}</span>
          <h3 class="card-title"><a href="${a.slug}.html">${a.title}</a></h3>
          <p class="card-dek">${a.dek}</p>
          <div class="card-foot">
            <time datetime="${a.date}">${formatDate(a.date, "short")}</time>
            <span class="read">${readingTime(a)} min de lecture</span>
          </div>
        </div>
      </article>`;
  }

  function observeReveal() {
    const els = $$(".reveal:not(.is-visible)");
    if (!els.length) return;
    if (reducedMotion || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -30px 0px" });
    els.forEach((el) => io.observe(el));
  }

  function initReveal() {
    observeReveal();
  }

  /* ---------- Toast & copie ---------- */

  let toastTimer;
  function toast(message) {
    let el = $(".toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "toast";
      el.setAttribute("role", "status");
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("is-visible"), 2200);
  }

  async function copyText(text, okMessage) {
    try {
      await navigator.clipboard.writeText(text);
      toast(okMessage);
    } catch (e) {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); toast(okMessage); } catch (err) {}
      ta.remove();
    }
  }

  function initCopyButtons() {
    $$("[data-copy-link]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const url = btn.getAttribute("data-copy-link") || window.location.href.split("#")[0];
        copyText(url, "Lien copié");
      });
    });
  }

  /* ---------- Accueil ---------- */

  function initHome() {
    const sorted = sortArticles();
    const feature = sorted[0];
    const hero = $("#hero-feature");
    if (hero && feature) {
      hero.href = feature.slug + ".html";
      hero.innerHTML = `
        <span class="sticker" aria-hidden="true"><span>✳</span>À la une</span>
        <div class="hero-feature-media">
          <img src="${feature.cover}" alt="${feature.coverAlt}" width="1376" height="768">
        </div>
        <div class="hero-feature-body">
          <div>
            <span class="card-cat" style="--cat:${catColor(feature.category)}">${catName(feature.category)}</span>
            <h2>${feature.title}</h2>
            <div class="meta">
              <span>${formatDate(feature.date, "short")}</span>
              <span>·</span>
              <span>${readingTime(feature)} min</span>
            </div>
          </div>
          <span class="hero-feature-arrow">${icons.arrow}</span>
        </div>`;
    }

    const grid = $("#home-grid");
    if (grid) {
      const rest = sorted.filter((a) => a.slug !== (feature && feature.slug)).slice(0, 5);
      grid.innerHTML = rest.map((a, i) => articleCard(a, { wide: i === 0 })).join("");
    }

    const stats = {
      articles: `${ARTICLES.length}`,
      notions: `${LEXIQUE.length}`,
      themes: `${Object.keys(CATEGORIES).length}`,
    };
    Object.entries(stats).forEach(([key, val]) => {
      const el = $(`[data-stat="${key}"]`);
      if (el) el.textContent = val;
    });

    const catList = $("#cat-list");
    if (catList) {
      catList.innerHTML = Object.entries(CATEGORIES).map(([name, cfg], i) => {
        const count = ARTICLES.filter((a) => a.category === name).length;
        return `
          <a class="cat-link" href="articles.html?cat=${encodeURIComponent(name)}" style="--cat:${cfg.color}">
            <span class="cat-index">0${i + 1}</span>
            <div>
              <h3>${name}</h3>
              <span class="cat-count">${count} article${count > 1 ? "s" : ""}</span>
            </div>
            <span class="cat-bar"></span>
          </a>`;
      }).join("") + `
          <a class="cat-link cat-link--all" href="articles.html" style="--cat:var(--accent)">
            <span class="cat-index">→</span>
            <div>
              <h3>Tout voir</h3>
              <span class="cat-count">${ARTICLES.length} articles</span>
            </div>
            <span class="cat-bar"></span>
          </a>`;
    }

    const lexMini = $("#lex-mini");
    if (lexMini) {
      const picks = ["API", "LLM", "HTTPS", "Open source"];
      lexMini.innerHTML = picks.map((term) => {
        const entry = LEXIQUE.find((l) => l.term === term);
        if (!entry) return "";
        return `
          <a href="lexique.html#${slugify(entry.term)}">
            <div>
              <span class="lex-term">${entry.term}</span>
              <span class="lex-def">${entry.definition}</span>
            </div>
            <span class="lex-tag">${entry.category}</span>
          </a>`;
      }).join("");
    }
    document.title = "AktibCode — La tech, sans le jargon";
  }

  /* ---------- Page articles ---------- */

  function initArticlesPage() {
    const grid = $("#articles-grid");
    if (!grid) return;

    const chipsWrap = $("#filters");
    const search = $("#article-search");
    const countEl = $("#results-count");
    const params = new URLSearchParams(window.location.search);
    let activeCat = params.get("cat") || "Tous";
    let query = params.get("q") || "";

    if (![...Object.keys(CATEGORIES), "Tous"].includes(activeCat)) activeCat = "Tous";
    if (search) search.value = query;

    if (chipsWrap) {
      const cats = ["Tous", ...Object.keys(CATEGORIES)];
      chipsWrap.innerHTML = cats.map((cat) => {
        return `<button class="filter-chip" type="button" data-cat="${cat}" aria-pressed="${cat === activeCat}">${cat === "Tous" ? "Tout" : cat}</button>`;
      }).join("");
    }

    function render() {
      const q = query.trim().toLowerCase();
      const list = sortArticles().filter((a) => {
        const okCat = activeCat === "Tous" || a.category === activeCat;
        if (!okCat) return false;
        if (!q) return true;
        return (a.title + " " + a.dek + " " + a.category + " " + (a.takeaways || []).join(" ")).toLowerCase().includes(q);
      });

      grid.innerHTML = list.length
        ? list.map((a) => articleCard(a)).join("")
        : `<div class="empty-state"><strong>Aucun article trouvé.</strong>Essayez un autre mot-clé ou retirez un filtre.</div>`;

      if (countEl) countEl.textContent = `${list.length} article${list.length > 1 ? "s" : ""}`;

      $$(".filter-chip", chipsWrap).forEach((chip) => {
        chip.setAttribute("aria-pressed", chip.dataset.cat === activeCat ? "true" : "false");
      });

      const url = new URL(window.location.href);
      if (activeCat === "Tous") url.searchParams.delete("cat");
      else url.searchParams.set("cat", activeCat);
      if (q) url.searchParams.set("q", query);
      else url.searchParams.delete("q");
      history.replaceState({}, "", url);
      observeReveal();
    }

    if (chipsWrap) {
      chipsWrap.addEventListener("click", (e) => {
        const chip = e.target.closest(".filter-chip");
        if (!chip) return;
        activeCat = chip.dataset.cat;
        render();
      });
    }

    if (search) {
      let t;
      search.addEventListener("input", () => {
        clearTimeout(t);
        t = setTimeout(() => {
          query = search.value;
          render();
        }, 120);
      });
    }

    render();
  }

  /* ---------- Lexique ---------- */

  function initLexique() {
    const wrap = $("#lex-groups");
    if (!wrap) return;
    const search = $("#lex-search");
    const countEl = $("#lex-count");

    function render() {
      const q = (search ? search.value : "").trim().toLowerCase();
      const list = LEXIQUE.filter((l) => {
        if (!q) return true;
        return (l.term + " " + l.definition + " " + l.category).toLowerCase().includes(q);
      }).sort((a, b) => a.term.localeCompare(b.term, "fr"));

      if (countEl) countEl.textContent = `${list.length} notion${list.length > 1 ? "s" : ""}`;

      if (!list.length) {
        wrap.innerHTML = `<p class="lex-empty">Aucune notion ne correspond à « ${search.value} ».</p>`;
        return;
      }

      const groups = {};
      list.forEach((l) => {
        const letter = l.term[0].toUpperCase();
        (groups[letter] = groups[letter] || []).push(l);
      });

      wrap.innerHTML = Object.entries(groups).map(([letter, entries]) => `
        <section class="lex-group" aria-labelledby="lettre-${letter}">
          <h2 class="lex-letter" id="lettre-${letter}">${letter}</h2>
          ${entries.map((entry) => `
            <article class="lex-entry" id="${slugify(entry.term)}">
              <h3 class="lex-term">${entry.term}</h3>
              <p>${entry.definition}${entry.article ? `<br><a class="lex-link" href="${entry.article}.html">Lire l’article ${icons.arrowRight}</a>` : ""}</p>
              <span class="lex-cat">${entry.category}</span>
            </article>`).join("")}
        </section>`).join("");
    }

    if (search) search.addEventListener("input", render);
    render();

    if (window.location.hash) {
      const target = document.getElementById(window.location.hash.slice(1));
      if (target) setTimeout(() => target.scrollIntoView({ block: "center" }), 100);
    }
  }

  /* ---------- Article : sommaire, progression, copie ---------- */

  function initArticlePage() {
    const bar = $(".progress-bar");
    if (bar) {
      const update = () => {
        const h = document.documentElement;
        const max = h.scrollHeight - h.clientHeight;
        const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
        bar.style.width = `${Math.min(100, Math.max(0, pct))}%`;
      };
      document.addEventListener("scroll", update, { passive: true });
      update();
    }

    const tocLinks = $$(".toc a");
    const headings = tocLinks
      .map((a) => document.getElementById(decodeURIComponent(a.getAttribute("href").slice(1))))
      .filter(Boolean);

    if (headings.length && "IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          tocLinks.forEach((a) => a.classList.remove("is-active"));
          const link = tocLinks.find((a) => decodeURIComponent(a.getAttribute("href").slice(1)) === entry.target.id);
          if (link) link.classList.add("is-active");
        });
      }, { rootMargin: "-15% 0px -70% 0px", threshold: 0 });
      headings.forEach((h) => io.observe(h));
    }
  }

  /* ---------- Pied de page ---------- */

  function initFooter() {
    const year = $("[data-year]");
    if (year) year.textContent = `${SITE.year || new Date().getFullYear()}`;
  }

  /* ---------- Démarrage ---------- */

  function slugify(str) {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initMenu();
    initCopyButtons();
    initFooter();

    const page = document.body.dataset.page;
    if (page === "home") initHome();
    if (page === "articles") initArticlesPage();
    if (page === "lexique") initLexique();
    if (page === "article") initArticlePage();

    initReveal();
  });
})();
