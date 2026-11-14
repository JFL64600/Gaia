# Gaia Web

Application Angular regroupant GaiaRox et GaiaScores, avec leurs styles et leurs
projets Firebase distincts. Les projets .NET existants du dépôt restent indépendants.

## Démarrage

Avec Node.js compatible avec Angular 22 et npm :

```powershell
npm ci
npm start
```

Ouvrir `http://localhost:4200/`. GaiaRox est accessible sous `/rox` et
GaiaScores sous `/scores`. Les anciennes routes GaiaRox (`/admin`, `/view` et
`/events`) sont redirigées lorsqu'elles arrivent sur cet hébergement. Les liens
utilisant l'ancien domaine nécessitent aussi une redirection sur cet ancien hébergement.
Le serveur doit renvoyer `index.html` pour les routes Angular, y compris les liens directs.
L'accueil propose aussi l'accès à `/rox/admin` pour gérer les événements ;
`/rox` ouvre la consultation publique.

Les fichiers `public/styles/rox` et `public/styles/scores` conservent les styles
globaux d'origine ; seule la feuille de l'outil actif est chargée. La langue et
le thème sont communs à Gaia et aux outils, et enregistrés localement. Les
langues proposées sont le français et le basque. Les
thèmes conservent leurs couleurs propres à chaque outil. Lors du premier usage,
les préférences existantes de GaiaScores sont reprises en priorité, puis celles
de GaiaRox si elles sont absentes ou invalides. Ces préférences doivent être
accessibles sur la même origine dans le navigateur : celles d'un autre domaine ne
peuvent pas être lues automatiquement.

La vignette d'événement commune (`src/app/shared/event-card.ts`) reprend
l'apparence de GaiaScores. Chaque outil fournit son nom et ses actions :
Rox conserve son lien et la suppression confirmée en administration, sans afficher son code ;
Scores reste en consultation sans action de suppression.
La page commune (`src/app/shared/events-page.ts`) gère le titre, la recherche,
le compteur, la liste et ses états, sans sous-titre. Les outils y intègrent leurs
propres formulaires de création et conservent leurs services Firestore.

## Publication et installation

Le workflow `.github/workflows/pages.yml` prépare une publication sur GitHub Pages
depuis `main`, uniquement pour l'application Angular. Les projets .NET ne sont pas
publiés. Il installe les dépendances, exécute les tests et construit le site avant
son déploiement.

Préparer localement les fichiers de publication :

```powershell
npm run build:pages
```

Le résultat est dans `dist/gaia-web/browser`, avec le chemin de base `/Gaia/`.
Un fichier `404.html` identique à `index.html` permet de charger les routes
Angular directement, notamment `/Gaia/rox/view/events` et `/Gaia/scores`.
GitHub Pages renvoie toutefois un statut HTTP 404 pour ces liens directs avant
que l'application démarre.

Pour mettre en ligne ultérieurement :

1. Dans les paramètres GitHub du dépôt, choisir **Settings > Pages > Source >
   GitHub Actions**. Le dépôt étant privé, vérifier que l'offre GitHub permet Pages
   pour ce dépôt et que la visibilité du site convient.
2. Committer et pousser `gaia-web` et `.github/workflows/pages.yml` sur `main`
   (sans les dépendances ni les fichiers générés).
3. Vérifier la réussite du workflow **Deploy Gaia to GitHub Pages**. Il peut aussi
   être lancé manuellement depuis **Actions**.

Sans domaine personnalisé, l'adresse prévue est `https://jfl64600.github.io/Gaia/`.
Le manifeste utilise le nom **Gaia**, les icônes existantes et un démarrage sur le
portail. Son périmètre couvre les deux outils, sans englober l'ancienne GaiaRox.
Après publication en HTTPS, le navigateur peut proposer l'installation ; sur
iPhone/iPad, utiliser **Partager > Sur l'écran d'accueil**.
Comme GaiaRox, cette configuration ne comporte pas de service worker et ne
garantit pas un fonctionnement hors connexion.

## Données

Chaque outil utilise son projet Firebase existant et ses propres règles Firestore :
aucune migration ni fusion des données n'est effectuée. Les configurations se
trouvent dans `src/app/tools/rox/core/firebase.config.ts` et
`src/app/tools/scores/core/firebase.config.ts`. Les instances Firebase nommées
garantissent que chaque outil utilise sa base. Les règles et déploiements Firebase
restent gérés dans les dépôts d'origine ; ne pas déployer les règles de l'un sur
le projet de l'autre. Les règles existantes ne protègent pas les accès administrateur :
le mode lecture seule de GaiaRox est une fonctionnalité d'interface, pas une authentification.

## Vérification

```powershell
npm run build
npm test -- --watch=false
npm audit
```

Exécuter `npm audit` régulièrement, notamment après les mises à jour de dépendances.
Surveiller en particulier les avis détectés le 14 novembre 2026 dans la chaîne
Firebase/Firestore, via `@grpc/grpc-js` (`GHSA-m9gg-hp2v-232j` et
`GHSA-f596-whhp-79r4`). Le rapport signalait la version `1.9.16` et quatre
occurrences de sévérité élevée. Réévaluer les correctifs compatibles avant toute
mise à jour ; `npm audit fix --force` proposait une rétrogradation majeure de Firebase.

Sources intégrées : GaiaRox `0d0442ee81d5bdb55baf7983e8604d29c8c8c934` et
GaiaScores `2e27bc69c4da37071169a8ecdc44ea76757901ba`.
