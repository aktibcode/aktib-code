/* AktibCode — interactions du site */
(function () {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
      toggle.setAttribute("aria-label", "Ouvrir le menu");
      document.body.classList.remove("menu-open");
      if (restoreFocus) toggle.focus({ preventScroll: true });
    };

    toggle.addEventListener("click", () => {
      const open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
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
      try {
        document.execCommand("copy");
        toast(okMessage);
      } catch (err) {
        toast("Copie impossible : utilisez l’adresse de la page.");
      }
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

  /* ---------- Catalogue : filtres sur le HTML déjà rendu ---------- */

  function initArticlesPage() {
    const grid = $("#articles-grid");
    if (!grid) return;

    const cards = $$(".article-card", grid);
    const chipsWrap = $("#filters");
    const search = $("#article-search");
    const countEl = $("#results-count");
    const params = new URLSearchParams(window.location.search);
    let activeCat = params.get("cat") || "Tous";
    let query = params.get("q") || "";

    if (![...Object.keys(CATEGORIES), "Tous"].includes(activeCat)) activeCat = "Tous";
    if (search) search.value = query;

    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.innerHTML = "<strong>Aucun article trouvé.</strong><p>Essayez un autre mot-clé ou retirez un filtre.</p>";
    empty.hidden = true;
    grid.appendChild(empty);

    function render() {
      const q = query.trim().toLowerCase();
      const visible = cards.filter((card) => {
        const matchesCategory = activeCat === "Tous" || card.dataset.category === activeCat;
        const text = (card.dataset.search || card.textContent).toLowerCase();
        return matchesCategory && (!q || text.includes(q));
      });

      cards.forEach((card) => { card.hidden = !visible.includes(card); });
      empty.hidden = visible.length > 0;
      if (countEl) countEl.textContent = `${visible.length} article${visible.length > 1 ? "s" : ""}`;

      $$(".filter-chip", chipsWrap).forEach((chip) => {
        chip.setAttribute("aria-pressed", chip.dataset.cat === activeCat ? "true" : "false");
      });

      const url = new URL(window.location.href);
      if (activeCat === "Tous") url.searchParams.delete("cat");
      else url.searchParams.set("cat", activeCat);
      if (query.trim()) url.searchParams.set("q", query.trim());
      else url.searchParams.delete("q");
      try { history.replaceState({}, "", url); } catch (error) {}
    }

    if (chipsWrap) {
      chipsWrap.addEventListener("click", (event) => {
        const chip = event.target.closest(".filter-chip");
        if (!chip) return;
        activeCat = chip.dataset.cat;
        render();
      });
    }

    if (search) {
      let timer;
      search.addEventListener("input", () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          query = search.value;
          render();
        }, 120);
      });
    }

    render();
  }

  /* ---------- Lexique : recherche sans réinjecter de HTML ---------- */

  function initLexique() {
    const wrap = $("#lex-groups");
    if (!wrap) return;
    const search = $("#lex-search");
    const countEl = $("#lex-count");
    const entries = $$(".lex-entry", wrap);
    const groups = $$(".lex-group", wrap);

    const empty = document.createElement("p");
    empty.className = "lex-empty";
    empty.hidden = true;
    wrap.appendChild(empty);

    function render() {
      const q = (search ? search.value : "").trim().toLowerCase();
      const visible = entries.filter((entry) => !q || entry.textContent.toLowerCase().includes(q));

      entries.forEach((entry) => { entry.hidden = !visible.includes(entry); });
      groups.forEach((group) => {
        group.hidden = !$$(".lex-entry:not([hidden])", group).length;
      });

      if (countEl) countEl.textContent = `${visible.length} notion${visible.length > 1 ? "s" : ""}`;
      empty.hidden = visible.length > 0;
      if (!visible.length) empty.textContent = `Aucune notion ne correspond à « ${search ? search.value : ""} ».`;
    }

    if (search) search.addEventListener("input", render);
    render();
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

  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initMenu();
    initCopyButtons();
    initFooter();

    const page = document.body.dataset.page;
    if (page === "articles") initArticlesPage();
    if (page === "lexique") initLexique();
    if (page === "article") initArticlePage();

    initReveal();
  });
})();
