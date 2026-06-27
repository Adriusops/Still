# CLAUDE.md — Still

Ce fichier définit le contexte, les règles et les conventions pour tout travail frontend sur Still.
Lis ce fichier entièrement avant d'écrire la moindre ligne de code.

---

## 1. Qui est Still

Still est une app de lecture intentionnelle. Son différenciateur n'est pas technique — c'est philosophique.

Still refuse le compteur de non-lus, les notifications non sollicitées, l'infinite scroll, la gamification et toute mécanique qui capturent l'attention avant que l'utilisateur décide lui-même où la poser.

Il y a deux surfaces dans l'app : **le feed** (lire) et **les settings** (configurer). C'est tout.

---

## 2. Périmètre — Frontend uniquement

**Tu ne touches jamais au backend.**

- Pas de modification de fichiers Rails
- Pas de migration, pas de modèle, pas de controller
- Pas de modification de routes Rails
- Tu consommes l'API existante — tu ne la modifies pas

Si une feature nécessite un endpoint qui n'existe pas, tu le signales et tu t'arrêtes.

---

## 3. Règles absolues — Ce qu'on ne fait JAMAIS

Ces règles ne souffrent aucune exception, quelle que soit la demande.

**Design**
- Jamais de couleur dans l'interface sauf `--color-flow` sur l'écran Flow (v2)
- Jamais de badge, compteur ou indicateur de non-lus
- Jamais de notification sans permission explicite de l'utilisateur
- Jamais de `Source Serif 4` en dehors du corps des articles
- Jamais de valeur de couleur hardcodée — toujours les CSS custom properties définies dans `tokens.css`
- Jamais d'ombre portée lourde ou décorative — les ombres sont fonctionnelles (bottom bar flottante uniquement)

**Comportement**
- La bottom bar et la navbar disparaissent **complètement** en mode lecteur — pas `opacity: 0`, pas `visibility: hidden`, elles sortent physiquement du viewport
- Jamais de rechargement complet de page pour naviguer
- Jamais d'état de chargement anxiogène — les spinners sont remplacés par des skeletons calmes ou du contenu progressif

**Code**
- Jamais d'installation de librairie UI (MUI, Chakra, Radix, Ant Design, etc.)
- Jamais de Tailwind ou de framework CSS utilitaire
- Jamais de `!important`
- Jamais de style inline sauf cas exceptionnel justifié en commentaire

---

## 4. Stack technique

- **Framework** : React (Vite, PWA)
- **Styling** : CSS custom properties natives + CSS Modules par composant
- **State** : React Context pour l'auth, hooks locaux pour le reste — pas de Redux, pas de Zustand sauf besoin avéré
- **Routing** : React Router
- **Requêtes API** : fetch natif, pas d'Axios sauf besoin avéré
- **Auth** : JWT stocké en mémoire (pas localStorage) — voir section API

---

## 5. Design System

### Tokens CSS — `src/styles/tokens.css`

```css
:root {
  /* Couleurs — Mode clair (défaut) */
  --color-bg:               #FDFCF8;
  --color-text-primary:     #111110;
  --color-text-secondary:   #6B6560;
  --color-border:           #E5E1DA;
  --color-surface:          #F5F2EC;

  /* Couleur unique — Flow (v2, réservé) */
  --color-flow:             #24837B;
  --color-flow-text:        #FDFCF8;

  /* Typographie */
  --font-ui:                'Inter', system-ui, sans-serif;
  --font-reader:            'Source Serif 4', Georgia, serif;

  /* Tailles typographiques */
  --text-xs:                11px;
  --text-sm:                13px;
  --text-base:              15px;
  --text-md:                17px;
  --text-lg:                20px;
  --text-xl:                24px;
  --text-2xl:               30px;

  /* Line heights */
  --leading-ui:             1.4;
  --leading-reader:         1.75;

  /* Espacement */
  --space-1:                4px;
  --space-2:                8px;
  --space-3:                12px;
  --space-4:                16px;
  --space-5:                20px;
  --space-6:                24px;
  --space-8:                32px;
  --space-10:               40px;
  --space-12:               48px;
  --space-16:               64px;

  /* Rayons */
  --radius-sm:              6px;
  --radius-md:              10px;
  --radius-lg:              16px;
  --radius-pill:            999px;

  /* Transitions */
  --transition-fast:        150ms ease-out;
  --transition-base:        250ms ease-out;
  --transition-slow:        350ms ease-out;

  /* Bottom bar */
  --bottom-bar-height:      56px;
  --bottom-bar-margin:      16px;
}

/* Mode sombre */
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg:             #141210;
    --color-text-primary:   #F0EDE6;
    --color-text-secondary: #9A9088;
    --color-border:         #2A2522;
    --color-surface:        #1E1A16;
  }
}
```

### Typographie — règles d'usage

| Police | Territoire | Jamais |
|---|---|---|
| Inter | Tout : navbar, boutons, labels, titres de feed, métadonnées, settings | Dans le corps d'un article |
| Source Serif 4 | Corps des articles uniquement | Partout ailleurs |

```css
/* Usage correct */
.article-body {
  font-family: var(--font-reader);
  font-size: var(--text-md);
  line-height: var(--leading-reader);
  font-optical-sizing: auto; /* Active l'optical sizing de Source Serif 4 */
}

.feed-item-title {
  font-family: var(--font-ui);
  font-size: var(--text-base);
  font-weight: 500;
  line-height: var(--leading-ui);
}
```

### Boutons

```css
/* Bouton primaire — monochrome */
.btn-primary {
  background: var(--color-text-primary);
  color: var(--color-bg);
  font-family: var(--font-ui);
  font-size: var(--text-sm);
  font-weight: 500;
  padding: 10px 20px;
  border-radius: var(--radius-sm);
  border: none;
}

/* Bouton ghost */
.btn-ghost {
  background: transparent;
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  font-family: var(--font-ui);
  font-size: var(--text-sm);
  font-weight: 500;
  padding: 10px 20px;
  border-radius: var(--radius-sm);
}
```

---

## 6. Architecture des fichiers

```
src/
├── styles/
│   ├── tokens.css          ← CSS custom properties (source de vérité)
│   ├── global.css          ← Reset, fonts, base styles
│   └── fonts.css           ← @font-face Inter + Source Serif 4
│
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx          ← Logo + bouton "+"
│   │   ├── Navbar.module.css
│   │   ├── BottomBar.jsx       ← Navigation flottante Feed / Settings
│   │   └── BottomBar.module.css
│   │
│   ├── feed/
│   │   ├── Feed.jsx            ← Container principal du feed
│   │   ├── FeedItem.jsx        ← Carte d'un item (article / vidéo / épisode)
│   │   ├── FeedEmpty.jsx       ← État vide — invitation à ajouter une source
│   │   └── FeedSkeleton.jsx    ← État de chargement
│   │
│   ├── reader/
│   │   ├── Reader.jsx          ← Container lecteur plein écran
│   │   ├── ReaderHeader.jsx    ← Flèche retour + métadonnées
│   │   └── ReaderBody.jsx      ← Corps de l'article en Source Serif 4
│   │
│   ├── sources/
│   │   ├── AddSourceSheet.jsx  ← Modal / bottom sheet ajout de source
│   │   └── SourcesList.jsx     ← Liste des sources dans Settings
│   │
│   └── ui/
│       ├── Button.jsx          ← Bouton réutilisable (primary / ghost)
│       ├── Input.jsx           ← Champ texte
│       └── Skeleton.jsx        ← Placeholder de chargement
│
├── pages/
│   ├── FeedPage.jsx
│   ├── SettingsPage.jsx
│   ├── LoginPage.jsx
│   └── RegisterPage.jsx
│
├── hooks/
│   ├── useAuth.js          ← JWT, user courant, login/logout
│   ├── useFeed.js          ← Fetch et état du feed
│   └── useSources.js       ← CRUD sources
│
├── services/
│   ├── api.js              ← Fetch wrapper avec auth header
│   └── auth.js             ← Gestion du token JWT en mémoire
│
└── App.jsx                 ← Router, providers
```

### Conventions de nommage

- Composants : `PascalCase` (ex: `FeedItem`, `BottomBar`)
- Hooks : `camelCase` préfixé `use` (ex: `useFeed`)
- CSS Modules : même nom que le composant (ex: `FeedItem.module.css`)
- Variables CSS : `--color-*`, `--space-*`, `--text-*`, `--radius-*`
- Fonctions utilitaires : `camelCase`

---

## 7. API disponible

**Base URL** : `/api/v1`

**Authentification** : JWT Bearer token dans le header `Authorization`.

```js
// Exemple de requête authentifiée
fetch('/api/v1/feed', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
```

**Le token ne doit jamais être stocké en localStorage.** Il vit en mémoire (variable de module dans `auth.js`) et est perdu au refresh — comportement voulu pour la v1.

### Endpoints

| Méthode | Route | Description |
|---|---|---|
| `POST` | `/api/v1/users` | Inscription — `{ email, password }` |
| `POST` | `/api/v1/sessions` | Connexion — retourne `{ token, user }` |
| `GET` | `/api/v1/feed` | Feed composé et interleaved |
| `GET` | `/api/v1/sources` | Liste des sources de l'utilisateur |
| `POST` | `/api/v1/sources` | Ajouter une source — `{ url }` |
| `PATCH` | `/api/v1/sources/:id` | Modifier une source (archiver, etc.) |
| `POST` | `/api/v1/activities` | Marquer un item comme consommé — `{ item_id, action }` |

### Format des réponses

Les erreurs retournent toujours `{ error: "message" }` avec le status HTTP approprié.
Les succès retournent l'objet ou la collection directement, sans wrapper.

---

## 8. Comportements UI critiques

### Bottom bar flottante

```
État normal    → visible, flottante, 16px du bas du viewport
En lecture     → sort complètement en bas (translateY(calc(100% + 16px)))
               → transition: transform 350ms ease-out
Retour lecture → remonte, transition identique
```

La bottom bar ne doit jamais être simplement cachée avec `display: none` ou `opacity: 0`. Elle doit physiquement quitter le viewport pour que la lecture soit totalement immersive.

### Navbar en mode lecteur

Même comportement que la bottom bar — sort vers le haut (`translateY(-100%)`), revient à la sortie du lecteur.

### Lecteur — entrée et sortie

```
Entrée  → slide up depuis le bas (translateY: 100% → 0)
          durée : 350ms ease-out
Sortie  → swipe left natif du navigateur OU flèche ← en haut à gauche
          slide down (translateY: 0 → 100%), durée : 300ms ease-in
```

### État vide du feed

```
Condition : aucune source active
Affichage : message calme, non-anxiogène
            un seul CTA qui ouvre AddSourceSheet
            pas d'illustration complexe
            pas de "vous n'avez rien" — formulation positive
```

### Skeleton de chargement

Les skeletons utilisent `--color-surface` comme fond et une animation `pulse` subtile.
Jamais de spinner rotatif.

---

## 9. Checklist avant chaque PR

- [ ] Aucune valeur de couleur hardcodée (grep `#` dans les CSS)
- [ ] `Source Serif 4` utilisée uniquement dans `ReaderBody`
- [ ] Bottom bar et navbar testées en mode lecteur
- [ ] Contraste vérifié en mode clair et sombre
- [ ] Aucune librairie UI ajoutée dans `package.json`
- [ ] Variables CSS utilisées partout (pas de magic numbers)
