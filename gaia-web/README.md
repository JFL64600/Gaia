# Gaia Web

Application Angular regroupant GaiaRox, GaiaScores et AnddeXokoTxapelketa, avec
leurs styles et leurs projets Firebase distincts. Les projets .NET existants du
dépôt restent indépendants.

## Démarrage

Avec Node.js compatible avec Angular 22 et npm :

```powershell
npm ci
npm start
```

Ouvrir `http://localhost:4200/`. GaiaRox est accessible sous `/rox`, GaiaScores
sous `/scores` et AnddeXokoTxapelketa sous `/axt`. AXT permet de créer un
évènement avec son nom et son nombre de joueurs ; chaque évènement possède un
lien consultable sous `/axt/events/:id`. Seules les routes actuelles sont prises en charge :
les anciennes adresses GaiaRox (`/admin`, `/view`, `/events`, `/rox/admin` et
`/rox/view`, y compris leurs sous-routes) ne permettent plus d'ouvrir un événement.
Le serveur doit renvoyer `index.html` pour les routes Angular, y compris les liens directs.
L'interrupteur, visible uniquement à l'accueil avant le choix de langue, sélectionne
un mode commun à l'accueil et aux trois outils : spectateur par défaut,
administrateur lorsqu'il est activé. Le mode est conservé pendant la navigation, mais n'est pas enregistré :
chaque rechargement revient en spectateur. L'accueil présente une vignette illustrée
par outil, avec une dernière rangée centrée lorsque d'autres outils sont ajoutés.
Le bouton n'a pas de libellé visible ; une infobulle indique le mode
actuel (« Spectateur » ou « Administrateur »), avec un nom accessible et un état
annoncé aux lecteurs d'écran. Pour changer de mode depuis un outil, revenir à
l'accueil avec le lien « G ».

Dans GaiaRox, les URLs sont communes aux deux modes : `/rox/events` pour la liste
et `/rox/events/:id` pour un événement. Le mode dépend uniquement de
l'interrupteur commun, jamais du lien reçu ou partagé. Un rechargement ouvre
toujours la consultation. La synchronisation utilise l'identifiant de
l'événement ; l'ancien parcours de saisie de salle et le paramètre `?room=`
ne sont plus pris en charge.
Repasser en spectateur ferme les formulaires sans les soumettre et conserve les
chronomètres en cours. Dans GaiaScores, le mode admin donne accès au formulaire de
création ; repasser en spectateur ferme le formulaire sans le soumettre.
Une création déjà envoyée n'est pas annulée par la bascule.

Les fichiers `public/styles/rox`, `public/styles/scores` et `public/styles/axt`
conservent les styles propres à chaque outil ; AXT et Scores partagent le socle
`public/styles/shared/app.css`, tandis que les styles de jeux restent spécifiques
à Scores. Seules les feuilles de l'outil actif sont chargées. La langue et le
thème sont communs à Gaia et aux outils, et enregistrés localement. Les
langues proposées sont le français et le basque. Les
thèmes conservent leurs couleurs propres à chaque outil. Seules les préférences
`gaia.language` et `gaia.theme` sont utilisées ; les anciennes préférences des
outils ne sont plus reprises. Sans préférence Gaia valide, la langue est le
français et le thème est Forêt.

La vignette d'événement commune (`src/app/shared/event-card.ts`) reprend
l'apparence de GaiaScores. Chaque outil fournit son nom et ses actions :
Rox conserve son lien et la suppression confirmée en administration, sans afficher son code ;
Scores propose également une suppression confirmée en administration ; AXT
propose un lien vers la page de détail de l'événement.
La page commune (`src/app/shared/events-page.ts`) gère le titre, la recherche,
le compteur, la liste et ses états, sans sous-titre. Les outils y intègrent leurs
propres formulaires de création et conservent leurs services Firebase.

## Publication et installation

Le workflow `.github/workflows/pages.yml` prépare une publication sur GitHub Pages
depuis `main`, uniquement pour l'application Angular. Les projets .NET ne sont pas
publiés. Il installe les dépendances, exécute les tests et construit le site avant
son déploiement. Sur les pull requests ciblant `main`, il exécute les mêmes tests
et la compilation Pages, sans publier d'artefact ni déployer le site.

Préparer localement les fichiers de publication :

```powershell
npm run build:pages
```

Le résultat est dans `dist/gaia-web/browser`, avec le chemin de base `/Gaia/`.
Un fichier `404.html` identique à `index.html` permet de charger les routes
Angular directement, notamment `/Gaia/rox/events`, `/Gaia/scores` et
`/Gaia/axt/events/:id`.
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
portail. Son périmètre couvre les trois outils Web, sans englober l'ancienne
application GaiaRox.
Après publication en HTTPS, le navigateur peut proposer l'installation ; sur
iPhone/iPad, utiliser **Partager > Sur l'écran d'accueil**.
Comme GaiaRox, cette configuration ne comporte pas de service worker et ne
garantit pas un fonctionnement hors connexion.

## Données

Chaque outil utilise son projet Firebase existant et ses propres règles :
aucune migration ni fusion des données n'est effectuée. Les configurations se
trouvent dans `src/app/tools/rox/core/firebase.config.ts`,
`src/app/tools/scores/core/firebase.config.ts` et
`src/app/tools/axt/core/firebase.config.ts`. AXT utilise Realtime Database ;
Rox et Scores utilisent Firestore. Les instances Firebase nommées garantissent
que chaque outil utilise sa base. Les règles et déploiements Firebase restent
gérés dans les dépôts d'origine ; ne pas déployer les règles de l'un sur le
projet de l'autre. Les règles existantes ne protègent pas les accès administrateur :
le mode lecture seule de GaiaRox est une fonctionnalité d'interface, pas une authentification.

Dans GaiaScores, le mode administrateur sélectionné depuis le portail affiche une
poubelle qui demande confirmation avant la suppression du document de l'évènement,
comme dans Rox. La suppression doit être autorisée par les règles du projet
`gaiascores` : les règles actuelles communiquées pour ce projet ne l'autorisent pas.
Un refus Firestore reste affiché même après une nouvelle synchronisation.
La sous-collection `teams` n'est pas supprimée par cet appel ; son nettoyage reste
à prévoir pour un effacement complet. Aucune règle Firebase n'est modifiée ici.

Chaque évènement Scores ouvre une page de résultats : les équipes et leurs jeux
sont affichés en tableau, ou en cartes sur téléphone. Comme dans Rox, le nom
de l'évènement apparaît dans le bandeau ; le lien GaiaScores permet de revenir
à la liste. En mode administrateur,
chaque résultat peut être enregistré ou effacé individuellement. Les temps sont
saisis en `minutes:secondes` (avec jusqu'à trois décimales facultatives) et les
points sous forme de nombre positif ou nul. L'onglet classement reste en attente
de ses règles et ne calcule aucun classement.

Les résultats sont enregistrés dans le champ `scores` de chaque document
`events/{eventId}/teams/{teamId}`, avec une valeur par identifiant de jeu :
une chaîne pour le temps, un nombre pour les points. Les règles Firestore
communiquées précédemment autorisent la lecture et la création des équipes,
mais pas leur mise à jour : **la saisie ne pourra pas être enregistrée tant que
des règles adaptées ne seront pas déployées**. Une erreur de permission est
affichée ; aucune règle n'est déployée par l'application. Le mode administrateur
est un contrôle d'interface et ne constitue pas une authentification.

### Piste future pour l'accès administrateur

Idée conservée pour plus tard, non retenue pour la première version : proposer
un lien de connexion à usage unique envoyé uniquement aux adresses d'une liste
autorisée. Prévoir aussi la révocation des accès, la limitation des demandes
répétées et des règles Firebase réservant les écritures aux administrateurs autorisés.

Pour commencer, le mode est sélectionné librement par l'interrupteur commun.
L'authentification par e-mail et la sécurisation Firebase sont reportées.
Sans contrôle des écritures côté Firebase, une séparation admin/lecture dans
l'interface ne constitue pas une protection réelle des données.

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
