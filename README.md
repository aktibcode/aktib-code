# AktibCode

Magazine statique de vulgarisation tech, écrit en français. Le site fonctionne sans framework : HTML, CSS et JavaScript natif, avec un générateur Node.js.

## Prérequis

- Node.js 18 ou plus récent pour générer et tester le site.
- Python 3.9 ou plus récent et Pillow uniquement pour régénérer les variantes WebP : `python -m pip install Pillow`.

Aucune dépendance npm n’est nécessaire.

## Commandes

```powershell
npm run build        # Génère les articles, les sections statiques et les fichiers SEO
npm run build:check  # Vérifie que les fichiers générés sont à jour, sans écrire
npm run images       # Régénère les WebP 640, 960 et 1400 px depuis les images des articles
npm test             # Syntaxe, données, liens, SEO, images, accessibilité et reproductibilité
```

`npm test` échoue si une page générée ne correspond plus aux données éditoriales. Il ne nécessite ni connexion réseau ni navigateur.

## Organisation

- `assets/js/data.js` : source unique des articles, du lexique, des catégories et des informations du site.
- `build.mjs` : génère les pages d’article, l’accueil, le catalogue, le lexique, une partie des pages annexes, `sitemap.xml` et `robots.txt`.
- `assets/js/site.js` : thème, menu mobile, filtres, recherches, copie de lien et progression de lecture.
- `assets/css/style.css` : identité visuelle, thèmes clair/sombre, responsive et accessibilité.
- `assets/images/` : illustrations originales et variantes WebP.
- `scripts/optimize-images.py` : optimisation des images de couverture.
- `scripts/validate.test.mjs` : contrôles automatisés du projet.

## Modifier le contenu

1. Ajouter ou modifier un objet dans `ARTICLES` dans `assets/js/data.js`.
2. Renseigner notamment `slug`, `title`, `dek`, `category`, `date`, `author`, `cover`, `coverAlt`, `sources`, `blocks` et `takeaways`.
3. Utiliser de préférence une couverture de 1400 × 933 px. Le script d’images refuse une source plus petite que 1400 px plutôt que de produire une variante agrandie.
4. Exécuter `npm run images`, puis `npm run build`.
5. Lancer `npm test` et contrôler visuellement les pages concernées.

Les blocs éditoriaux disponibles sont `h2`, `p`, `quote`, `list`, `note` et `code`. Les liens du lexique pointent vers le `slug` d’un article, sans l’extension `.html`.

## Pages générées

Les pages d’article sont entièrement générées : ne pas les modifier à la main. Dans `index.html`, `articles.html` et `lexique.html`, préserver les commentaires `<!-- build:nom -->` et `<!-- /build:nom -->` : leur contenu est remplacé à chaque génération. Le texte situé hors de ces régions reste modifiable.

L’adresse canonique du site se configure avec `SITE.url` dans `assets/js/data.js`. Le sitemap exclut la page 404, qui porte `noindex`.

## Publication

Publier le dossier à la racine d’un hébergement statique en conservant `404.html`, `sitemap.xml` et `robots.txt`. Aucune étape de compilation côté serveur n’est nécessaire.

Les tests couvrent la structure HTML, les ressources locales, les ancres, les métadonnées, le JSON-LD, les dimensions déclarées des images, les contrastes WCAG AA, la recherche sans injection HTML et la synchronisation du générateur. La vérification visuelle dans les navigateurs et un audit Lighthouse restent des contrôles de publication complémentaires.
