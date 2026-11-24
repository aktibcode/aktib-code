import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { SITE, CATEGORIES, ARTICLES, LEXIQUE, readingTime, sortArticles } =
  require("../assets/js/data.js");

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => fs.readFileSync(path.join(ROOT, file), "utf8");
const htmlFiles = fs.readdirSync(ROOT).filter((file) => file.endsWith(".html")).sort();
const indexedFiles = [
  "index.html",
  "articles.html",
  "lexique.html",
  "a-propos.html",
  ...ARTICLES.map((article) => `${article.slug}.html`),
];

const getTags = (html, name) =>
  [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, "gi"))].map((match) => match[0]);

function getAttr(tag, name) {
  if (!tag) return null;
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*(["'])([\\s\\S]*?)\\1`, "i"));
  return match ? match[2].replace(/&amp;/g, "&") : null;
}

function getMeta(html, attribute, key) {
  const tag = getTags(html, "meta").find((item) => getAttr(item, attribute) === key);
  return getAttr(tag, "content");
}

function getCanonical(html) {
  const tag = getTags(html, "link").find((item) => getAttr(item, "rel") === "canonical");
  return getAttr(tag, "href");
}

function getIds(html) {
  return [...html.matchAll(/\bid\s*=\s*(["'])([^"']+)\1/gi)].map((match) => match[2]);
}

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function expectedUrl(file) {
  return new URL(file === "index.html" ? "" : file, `${SITE.url}/`).toString();
}

function resolveReference(sourceFile, rawValue) {
  const value = rawValue.replace(/&amp;/g, "&");
  if (!value || /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(value)) return null;

  const pathname = value.split("#")[0].split("?")[0];
  let target;
  if (!pathname) {
    target = path.join(ROOT, sourceFile);
  } else if (pathname.startsWith("/")) {
    target = path.resolve(ROOT, `.${pathname}`);
  } else {
    target = path.resolve(ROOT, path.dirname(sourceFile), pathname);
  }

  let fragment = "";
  if (value.includes("#")) {
    try {
      fragment = decodeURIComponent(value.split("#")[1]);
    } catch {
      fragment = value.split("#")[1];
    }
  }
  return { target, fragment };
}

function localReferences(sourceFile, html) {
  const references = [];
  for (const name of ["a", "link", "img", "script"]) {
    for (const tag of getTags(html, name)) {
      for (const attribute of ["href", "src"]) {
        const value = getAttr(tag, attribute);
        if (value) references.push(resolveReference(sourceFile, value));
      }
      if (name === "img") {
        const srcset = getAttr(tag, "srcset");
        if (srcset) {
          for (const match of srcset.matchAll(/(\S+)\s+\d+w/g)) {
            references.push(resolveReference(sourceFile, match[1]));
          }
        }
      }
    }
  }
  return references.filter(Boolean);
}

function jpegDimensions(buffer) {
  let offset = 2;
  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = buffer[offset + 1];
    offset += 2;
    if (marker === 0xd8 || marker === 0xd9) continue;
    const length = buffer.readUInt16BE(offset);
    const startOfFrame = [0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf];
    if (startOfFrame.includes(marker)) {
      return {
        width: buffer.readUInt16BE(offset + 5),
        height: buffer.readUInt16BE(offset + 3),
      };
    }
    offset += length;
  }
  throw new Error("Dimensions JPEG introuvables.");
}

function luminance(hex) {
  const channels = [1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), 16) / 255);
  const linear = channels.map((value) =>
    value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  );
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function contrastRatio(first, second) {
  const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

function cssVariables(block) {
  return Object.fromEntries(
    [...block.matchAll(/(--[\w-]+)\s*:\s*(#[0-9a-f]{6})/gi)].map((match) => [match[1], match[2]])
  );
}

test("les fichiers JavaScript passent le contrôle de syntaxe", () => {
  for (const file of ["build.mjs", "assets/js/data.js", "assets/js/site.js"]) {
    const result = spawnSync(process.execPath, ["--check", file], { cwd: ROOT, encoding: "utf8" });
    assert.equal(result.status, 0, `${file} : ${result.stderr}`);
  }
});

test("les données éditoriales sont cohérentes et sans doublon", () => {
  const data = read("assets/js/data.js");
  assert.equal((data.match(/^\s+sources:/gm) || []).length, ARTICLES.length);
  assert.doesNotMatch(data, /Mbarassem/);
  assert.equal(new Set(ARTICLES.map((article) => article.slug)).size, ARTICLES.length);
  assert.ok(ARTICLES.length > 0);
  assert.ok(LEXIQUE.length > 0);

  for (const article of ARTICLES) {
    assert.ok(CATEGORIES[article.category], `Catégorie inconnue : ${article.category}`);
    assert.match(article.date, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(Number.isFinite(Date.parse(article.date)));
    assert.ok(article.coverAlt.length > 10);
    assert.ok(article.blocks.length > 0);
    assert.ok(article.takeaways.length > 0);
    assert.ok(Number.isInteger(readingTime(article)) && readingTime(article) >= 3);
    assert.ok(article.sources.length > 0);
    assert.equal(new Set(article.sources.map((source) => source.url)).size, article.sources.length);
    for (const source of article.sources) {
      assert.ok(source.title && source.publisher);
      assert.equal(new URL(source.url).protocol, "https:");
    }
  }

  const terms = LEXIQUE.map((entry) => entry.term);
  const ids = LEXIQUE.map((entry) => slugify(entry.term));
  assert.equal(new Set(terms).size, terms.length);
  assert.equal(new Set(ids).size, ids.length);
  for (const entry of LEXIQUE) {
    if (entry.article) {
      assert.ok(ARTICLES.some((article) => article.slug === entry.article));
    }
  }

  const dates = sortArticles().map((article) => Date.parse(article.date));
  assert.deepEqual(dates, [...dates].sort((a, b) => b - a));
});

test("chaque page possède une structure et des libellés accessibles", () => {
  for (const file of htmlFiles) {
    const html = read(file);
    assert.match(html, /<html\s+lang="fr">/i, file);
    assert.equal((html.match(/<h1\b/gi) || []).length, 1, file);
    assert.equal((html.match(/id="contenu"/g) || []).length, 1, file);
    assert.ok(getTags(html, "a").some((tag) => getAttr(tag, "class") === "skip-link"), file);

    const ids = getIds(html);
    assert.equal(new Set(ids).size, ids.length, `Identifiant dupliqué dans ${file}`);

    for (const button of getTags(html, "button")) {
      assert.equal(getAttr(button, "type"), "button", `Bouton sans type dans ${file}`);
    }
    for (const input of getTags(html, "input")) {
      const id = getAttr(input, "id");
      const labelled = getTags(html, "label").some((label) => getAttr(label, "for") === id);
      assert.ok(labelled || getAttr(input, "aria-label"), `Champ sans libellé dans ${file}`);
    }
    for (const link of getTags(html, "a").filter((tag) => getAttr(tag, "aria-current") === "page")) {
      const reference = resolveReference(file, getAttr(link, "href"));
      assert.equal(path.resolve(reference.target), path.join(ROOT, file), `aria-current incorrect dans ${file}`);
    }
  }
});

test("tous les liens locaux, ancres, scripts et images existent", () => {
  for (const file of htmlFiles) {
    for (const reference of localReferences(file, read(file))) {
      assert.ok(fs.existsSync(reference.target), `${file} : ressource absente ${reference.target}`);
      if (reference.fragment && reference.target.endsWith(".html")) {
        assert.ok(getIds(read(path.relative(ROOT, reference.target))).includes(reference.fragment),
          `${file} : ancre absente #${reference.fragment}`);
      }
    }
  }
});

test("les métadonnées SEO sont absolues, uniques et cohérentes", () => {
  for (const file of indexedFiles) {
    const html = read(file);
    assert.equal((html.match(/<title>/gi) || []).length, 1, file);
    assert.ok(getMeta(html, "name", "description"), file);
    assert.equal(getCanonical(html), expectedUrl(file), file);
    assert.equal(getMeta(html, "property", "og:url"), expectedUrl(file), file);

    for (const key of ["og:title", "og:description", "og:type", "og:url", "og:site_name", "og:image", "og:image:alt"]) {
      assert.equal(getTags(html, "meta").filter((tag) => getAttr(tag, "property") === key).length, 1, `${file} : ${key}`);
      assert.ok(getMeta(html, "property", key), `${file} : ${key} vide`);
    }
    for (const key of ["twitter:card", "twitter:title", "twitter:description", "twitter:image"]) {
      assert.equal(getTags(html, "meta").filter((tag) => getAttr(tag, "name") === key).length, 1, `${file} : ${key}`);
      assert.ok(getMeta(html, "name", key), `${file} : ${key} vide`);
    }

    const image = new URL(getMeta(html, "property", "og:image"));
    assert.equal(image.origin, new URL(SITE.url).origin);
    assert.ok(fs.existsSync(path.join(ROOT, decodeURIComponent(image.pathname.slice(1)))));
    assert.equal(getMeta(html, "name", "twitter:image"), image.toString());
  }
  assert.equal(getMeta(read("404.html"), "name", "robots"), "noindex");
});

test("les sections dynamiques et les articles sont prérendus", () => {
  const home = read("index.html");
  const catalogue = read("articles.html");
  const lexique = read("lexique.html");
  assert.equal(getTags(catalogue, "article").filter((tag) => getAttr(tag, "class").includes("article-card")).length, ARTICLES.length);
  assert.equal(getTags(lexique, "article").filter((tag) => getAttr(tag, "class").includes("lex-entry")).length, LEXIQUE.length);

  for (const [file, names] of [
    ["index.html", ["hero-feature", "home-grid", "cat-list", "lex-mini"]],
    ["articles.html", ["filters", "articles-grid"]],
    ["lexique.html", ["lex-groups"]],
  ]) {
    const html = read(file);
    for (const name of names) {
      assert.equal((html.match(new RegExp(`<!-- build:${name} -->`, "g")) || []).length, 1, `${file} : ${name}`);
      assert.equal((html.match(new RegExp(`<!-- /build:${name} -->`, "g")) || []).length, 1, `${file} : ${name}`);
    }
  }

  for (const article of ARTICLES) {
    const html = read(`${article.slug}.html`);
    assert.ok(html.includes(article.title));
    assert.ok(html.includes(article.dek));
    assert.equal((html.match(/class="article-sources"/g) || []).length, 1);
    const sources = html.match(/<section class="article-sources"[\s\S]*?<\/section>/)?.[0] || "";
    assert.equal(getTags(sources, "a").length, article.sources.length);
    for (const source of article.sources) assert.ok(sources.includes(source.url));
    assert.doesNotMatch(html, /<\/article>\s*,|<article[^>]*>\s*,|undefined/);
  }
});

test("les données structurées des articles sont valides", () => {
  for (const article of ARTICLES) {
    const html = read(`${article.slug}.html`);
    const raw = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
    assert.ok(raw, article.slug);
    assert.doesNotMatch(raw, /</);
    const data = JSON.parse(raw);
    assert.equal(data["@type"], "BlogPosting");
    assert.equal(data.headline, article.title);
    assert.equal(data.datePublished, article.date);
    assert.equal(data.mainEntityOfPage, expectedUrl(`${article.slug}.html`));
    assert.equal(data.image, new URL(article.cover, `${SITE.url}/`).toString());
    assert.deepEqual(data.citation, article.sources.map((source) => source.url));
    assert.equal(data.author.name, article.author);
  }
});

test("le sitemap et robots.txt décrivent les pages publiables", () => {
  const sitemap = read("sitemap.xml");
  const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  assert.deepEqual(locations, indexedFiles.map(expectedUrl));
  assert.ok(!sitemap.includes("404.html"));
  for (const article of ARTICLES) {
    assert.ok(sitemap.includes(`<lastmod>${article.date}</lastmod>`));
  }
  assert.match(read("robots.txt"), /^User-agent: \*$/m);
  assert.ok(read("robots.txt").includes(`Sitemap: ${new URL("sitemap.xml", `${SITE.url}/`)}`));
});

test("les images responsives existent et leurs dimensions sont déclarées", () => {
  for (const article of ARTICLES) {
    const source = path.join(ROOT, article.cover);
    const sourceSize = fs.statSync(source).size;
    for (const width of [640, 960, 1400]) {
      const variant = article.cover.replace(/\.[^.]+$/, `-${width}.webp`);
      const target = path.join(ROOT, variant);
      assert.ok(fs.existsSync(target), variant);
      const buffer = fs.readFileSync(target);
      assert.equal(buffer.toString("ascii", 0, 4), "RIFF");
      assert.equal(buffer.toString("ascii", 8, 12), "WEBP");
      assert.ok(buffer.length < sourceSize, `${variant} devrait être plus légère que l’original`);
    }
  }

  for (const file of htmlFiles) {
    for (const image of getTags(read(file), "img")) {
      assert.ok(getAttr(image, "alt"), `Texte alternatif absent dans ${file}`);
      assert.ok(Number(getAttr(image, "width")) > 0, `Largeur absente dans ${file}`);
      assert.ok(Number(getAttr(image, "height")) > 0, `Hauteur absente dans ${file}`);
      const src = getAttr(image, "src");
      if (/\.jpe?g$/i.test(src)) {
        const dimensions = jpegDimensions(fs.readFileSync(path.join(ROOT, src)));
        assert.equal(Number(getAttr(image, "width")), dimensions.width, `${file} : largeur de ${src}`);
        assert.equal(Number(getAttr(image, "height")), dimensions.height, `${file} : hauteur de ${src}`);
      }
    }
  }

  for (const article of ARTICLES) {
    const cover = read(`${article.slug}.html`).match(/<figure class="article-cover">([\s\S]*?)<\/figure>/)?.[0] || "";
    const image = getTags(cover, "img")[0];
    assert.equal(getAttr(image, "loading"), "eager");
    assert.equal(getAttr(image, "fetchpriority"), "high");
    assert.ok(getAttr(image, "srcset"));
  }
});

test("les styles et interactions protègent l’accessibilité et la recherche", () => {
  const css = read("assets/css/style.css");
  const site = read("assets/js/site.js");
  assert.equal((css.match(/(^|\n)\s*\.sr-only\s*\{/g) || []).length, 1);
  assert.equal((css.match(/(^|\n)\s*\[hidden\]\s*\{/g) || []).length, 1);
  assert.equal((css.match(/(^|\n)\s*\.article-sources\s*\{/g) || []).length, 1);
  assert.match(css, /\[hidden\]\s*\{\s*display:\s*none\s*!important/);
  assert.doesNotMatch(site, /wrap\.innerHTML/);
  assert.match(site, /empty\.textContent/);
  assert.match(site, /Fermer le menu/);

  const coarse = css.match(/@media \(pointer: coarse\)\s*\{([\s\S]*?)\n\}/)?.[1] || "";
  assert.match(coarse, /\.theme-toggle,[\s\S]*?\.nav-toggle,[\s\S]*?\.icon-btn\s*\{\s*width:\s*44px;\s*height:\s*44px;/);

  const root = cssVariables(css.match(/:root\s*\{([^}]+)\}/)?.[1] || "");
  const dark = cssVariables(css.match(/html\[data-theme="dark"\]\s*\{([^}]+)\}/)?.[1] || "");
  assert.ok(contrastRatio(root["--accent"], root["--paper"]) >= 4.5);
  assert.ok(contrastRatio(root["--accent"], root["--on-accent"]) >= 4.5);
  assert.ok(contrastRatio(root["--muted"], root["--paper"]) >= 4.5);
  assert.ok(contrastRatio(dark["--accent"], dark["--paper"]) >= 4.5);
  assert.ok(contrastRatio(dark["--accent"], dark["--on-accent"]) >= 4.5);
  assert.ok(contrastRatio(dark["--muted"], dark["--paper"]) >= 4.5);

  const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, "");
  let depth = 0;
  for (const character of withoutComments) {
    if (character === "{") depth += 1;
    if (character === "}") depth -= 1;
    assert.ok(depth >= 0, "Accolade CSS fermante en trop");
  }
  assert.equal(depth, 0, "Accolade CSS ouvrante en trop");
});

test("la génération est à jour", () => {
  const result = spawnSync(process.execPath, ["build.mjs", "--check"], { cwd: ROOT, encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr || result.stdout);
});
