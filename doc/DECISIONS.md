# DECISIONS — Still
 
Journal des décisions structurantes du projet.
Format : contexte → options → choix → pourquoi.
 
---
 
## 001 — PWA plutôt qu'app native
 
**Contexte** : Besoin que l'entourage puisse installer l'app sur Android et iOS sans friction.
 
**Options** :
- React Native + Expo → performances natives, mais distribution par App Store (99€/an Apple) ou APK
- PWA → performances légèrement inférieures, mais installable depuis le navigateur sur tous les devices
**Choix** : PWA pour la v1.
 
**Pourquoi** : L'objectif de la v1 est de valider l'idée avec de vrais utilisateurs. La friction d'installation doit être nulle. Les 99€ Apple et le processus TestFlight sont investis quand le produit est validé, pas avant. Les limitations PWA (principalement l'audio background iOS) sont documentées et acceptées temporairement.
 
---
 
## 002 — Ruby on Rails API-only + React
 
**Contexte** : Choix du stack backend.
 
**Options** :
- Go → performances brutes, mais lent à développer, pas de conventions web
- Node.js → bonne perf I/O, mais écosystème fragmenté
- Ruby on Rails → conventions fortes, écosystème mature, développement rapide
**Choix** : Rails API-only + React + Vite.
 
**Pourquoi** : Still est une app CRUD web classique — sources, articles, users, sessions. C'est le terrain naturel de Rails. Sidekiq pour le fetching périodique est natif à l'écosystème. Le bottleneck d'un RSS reader est l'I/O réseau, pas le CPU — le GIL de Ruby ne sera jamais le problème à l'échelle de la v1. React séparé donne le contrôle total sur les animations et transitions, ce qui est non-négociable pour la qualité d'expérience visée.
 
---
 
## 003 — Flexoki comme design system
 
**Contexte** : Choix de la palette de couleurs.
 
**Options** :
- Palette custom → cohérence maximale, effort important
- Tailwind default → rapide, générique
- Flexoki → open source, métaphore encre/papier, déjà utilisé sur adrius.blog
**Choix** : Flexoki.
 
**Pourquoi** : Flexoki est construit sur la même philosophie que Still — l'encre sur le papier, la chaleur, la lisibilité sur la saturation. C'est cohérent avec l'identité visuelle existante (blog). Les tokens sont documentés et stables.
 
---
 
## 004 — Pas d'IA en v1
 
**Contexte** : Plusieurs features IA envisagées (résumés, déduplication sémantique, brief matinal).
 
**Options** :
- IA locale → respect vie privée, 6+ mois de travail additionnel
- API externe (OpenAI/Anthropic) → rapide, coût variable, dépendance externe
- Pas d'IA v1 → focus sur le core produit
**Choix** : Pas d'IA en v1.
 
**Pourquoi** : Le différenciateur de Still n'est pas l'IA — c'est la philosophie (pas d'inbox, Moments, Flow). Ces concepts doivent être validés sans IA avant d'ajouter de la complexité. L'IA sans produit validé est de la procrastination sophistiquée.
 
---
 
## 005 — Renommage des Moments : Sun / Moon / Flow → Feed + Flow
 
**Contexte** : Morning cloisonnait l'usage temporellement. Sun et Moon ont suivi, mais imposaient encore à l'utilisateur de se situer dans une énergie avant de lire — contradiction directe avec la philosophie de Still.
 
**Options** :
- Garder Morning / Deep / Flow
- Renommer en Sun / Moon / Flow
- Fusionner Sun et Moon en un seul feed de lecture + Flow
**Choix** : Un feed de lecture + Flow.
 
**Pourquoi** : Still refuse tout ce qui impose une posture avant l'usage. Sun et Moon demandaient exactement ça. L'alternance de contenu (dense/court, sources variées) reste comme comportement silencieux par défaut — elle ne se nomme pas, elle ne se paramètre pas. Flow est inchangé : le seul geste volontaire de l'app.
 
---
 
## 006 — STI pour Item
 
**Contexte** : Still gère trois types de contenu — articles RSS, vidéos YouTube, épisodes podcast.
 
**Options** :
- Trois tables séparées : `articles`, `videos`, `episodes`
- Single Table Inheritance : une table `items` avec une colonne `type`
**Choix** : STI avec une table `items`.
 
**Pourquoi** : Still compose des sessions en piochant dans tous les types. Une requête "donne-moi les 5 prochains items pour cette session" est impossible proprement avec trois tables séparées. STI permet de traiter Article, Video, Episode comme des sous-classes d'Item tout en gardant une seule table requêtable.
 
---
 
## 007 — Schéma de données v1
 
**Contexte** : Définition des entités principales.
 
**Choix** : `User`, `Source`, `Item` (STI), `Subscription`, `Activity`.
 
**Pourquoi** : Subscription porte la relation user/source avec le Mode Sabbat (`paused_until`) et le statut actif/archivé pour le quota de 10 sources. Activity est la table de consommation — elle suffit pour éviter de reproposer un contenu déjà vu. Les compteurs et agrégats sont calculés à la volée, jamais stockés.
 
---
 
## 008 — Activity sans progression
 
**Contexte** : Tracker ou non le pourcentage de lecture/écoute d'un item.
 
**Options** :
- Colonne `progress` (0-100)
- Juste `consumed_at`
**Choix** : `consumed_at` uniquement.
 
**Pourquoi** : Still ne crée pas de dette de lecture. Un item est consommé ou non — la progression contredit la philosophie du produit. Complexité v2 si validé sur de vrais utilisateurs.
 
---
 
## 009 — Images RSS affichées par URL, non stockées
 
**Contexte** : Les flux RSS contiennent des URLs d'images (thumbnails d'articles, covers de podcasts). Question : les télécharger et les stocker sur notre serveur, ou les afficher directement depuis la source ?
 
**Options** :
- Stocker les images → contrôle total, indépendance de la source, mais complexité Active Storage, coût S3, pipeline de traitement
- Afficher par URL → zéro infrastructure de stockage, zéro coût, dépendance à la disponibilité de la source
**Choix** : Affichage par URL uniquement. La colonne `image_url` stocke l'URL, pas le fichier.
 
**Pourquoi** : En v1, la complexité de stockage d'images n'apporte aucune valeur utilisateur mesurable. Les images RSS sont des métadonnées secondaires — si une source est indisponible, l'article reste lisible. La règle générale : ne pas stocker ce qu'on peut référencer. Cette décision est réversible en v2 si le cache d'images devient un besoin réel.
 
---
 
## 010 — Nom de source récupéré automatiquement, pas saisi par l'utilisateur
 
**Contexte** : Quand un utilisateur ajoute une source, doit-il saisir un nom en plus de l'URL ?
 
**Options** :
- Saisie manuelle → contrôle utilisateur, mais friction à l'ajout et risque de noms incohérents
- Auto-fetch depuis le flux RSS → zéro friction, nom canonique de la source
**Choix** : L'utilisateur fournit uniquement l'URL. Sidekiq récupère le nom depuis les métadonnées du flux.
 
**Pourquoi** : Un flux RSS contient toujours un titre (`<channel><title>`). Demander à l'utilisateur de le ressaisir est de la friction inutile — et souvent source d'erreurs ou d'abréviations personnelles qui nuisent à la cohérence. Still doit faire le travail, pas l'utilisateur. C'est cohérent avec la philosophie : chaque geste demandé à l'utilisateur doit être intentionnel. Nommer une source ne l'est pas.
 
---
 
## 011 — Limite de 10 sources actives : totale, pas par type
 
**Contexte** : Still limite le nombre de sources actives. La question s'est posée : 10 au total, ou 10 par type (10 RSS + 10 podcasts + 10 YouTube) ?
 
**Options** :
- 10 par type → plus de flexibilité, mais jusqu'à 30 sources actives simultanées
- 10 au total → contrainte forte, friction productive
**Choix** : 10 sources actives au total, tous types confondus.
 
**Pourquoi** : La limite ne porte pas sur le type de contenu — elle porte sur l'attention. Un podcast et un article RSS se disputent le même temps de vie. Segmenter par type permettrait de contourner l'intention philosophique de la limite. 10 au total force un vrai arbitrage : est-ce que cette source mérite une place dans ma vie ? C'est une friction productive — elle ralentit pour forcer une décision consciente, pas pour punir. La limite est implémentée comme validation ActiveRecord sur `Subscription`, pas dans le controller, pour qu'elle soit impossible à contourner quelle que soit l'entrée.
 
---
 
## 012 — Algorithme de feed v1 : alternance par source uniquement
 
**Contexte** : Comment ordonner les items dans le feed de lecture ? Plusieurs approches envisagées : chronologique pur, alternance par type de média, alternance par densité (durée), alternance par source.
 
**Options** :
- Chronologique inversé → simple, mais regroupe les items par source (tous les articles d'un blog, puis tous ceux d'un autre)
- Alternance par type → prévisible, le pattern article/vidéo/podcast devient mécanique et visible
- Alternance par densité → subtil, mais nécessite des données réelles de durée pour être calibré
- Alternance par source → simple à implémenter, rompt le regroupement, invisible pour l'utilisateur
**Choix** : Alternance par source. Ne jamais avoir deux items consécutifs de la même source.
 
**Pourquoi** : L'insight vient de l'usage d'apps existantes — le regroupement par source crée une fatigue invisible. On finit par lire 5 articles du même blog avant de voir autre chose. L'alternance par source est la correction minimale qui change vraiment l'expérience. Elle est implémentée dans un service object `FeedComposer` pour rester isolée et évolutive. L'alternance par densité est documentée comme v2 — elle nécessite des données réelles pour être calibrée correctement.
 
---
 
## 013 — Alternance par densité différée à v2
 
**Contexte** : L'idée d'alterner contenus courts et longs (dense/léger) pour que la session "respire" est philosophiquement forte. Mais elle nécessite des durées fiables sur les items.
 
**Options** :
- Implémenter maintenant → élégant sur le papier, mais aucun contenu réel en base pour tester
- Différer à v2 → focus sur ce qui est testable aujourd'hui
**Choix** : Différé à v2.
 
**Pourquoi** : Optimiser un algorithme sans données c'est de la spéculation. La colonne `duration` existe sur `Item` — l'infrastructure est prête. Quand Sidekiq fetche de vrais flux et que l'app est utilisée pendant un mois, on aura les données pour calibrer ce que "dense" et "léger" veulent dire dans le contexte de Still. `FeedComposer` est conçu pour accueillir cette logique sans refactoring majeur.
 
---
 
## 014 — Mode Sabbat retiré de la v1
 
**Contexte** : Le Mode Sabbat permettait de mettre une source en pause pour une durée définie (`paused_until` sur `Subscription`) sans l'archiver — utile pour "deux semaines sans actualité tech" sans perdre la source.
 
**Options** :
- Implémenter maintenant → cohérent avec la vision initiale de `PRODUCT.md`, mais ajoute une UI dédiée (sélection de durée, rappel de fin de pause) pour un usage encore hypothétique
- Différer à v2 → l'utilisateur peut déjà archiver une source (`Subscription#status`) et la réactiver plus tard via `update`, ce qui couvre le besoin de façon plus rudimentaire mais fonctionnelle
**Choix** : Retiré de la v1. `Subscription#status` (`active`/`archived`) suffit comme alternative.
 
**Pourquoi** : Le Mode Sabbat est une feature de confort, pas une feature fondatrice — contrairement au quota de 10 sources ou à l'alternance par source, son absence ne casse aucune promesse centrale de Still. L'architecture existante (`update` sur `Subscription` pour archiver/réactiver) couvre le besoin réel sans UI supplémentaire. La colonne `paused_until` reste dans le schéma — elle ne coûte rien et permet de réintroduire la feature en v2 sans migration si l'usage réel le justifie.
 
---
 
## 015 — Polling HTTP conditionnel (ETag/Last-Modified), fréquence adaptative différée
 
**Contexte** : `RssFetchJob` doit interroger périodiquement chaque `Source` pour détecter du nouveau contenu. Deux axes d'optimisation possibles : éviter de télécharger le body RSS quand rien n'a changé (cache HTTP conditionnel), et adapter la fréquence de polling au rythme de publication réel de chaque source (fréquence adaptative).
 
**Options** :
- Polling à intervalle fixe, sans optimisation → simple, mais télécharge et parse le XML même quand rien n'a changé
- Cache HTTP conditionnel (ETag/Last-Modified) + intervalle fixe → coût réseau quasi nul sur les fetchs "sans changement", complexité minimale (deux colonnes, deux headers HTTP)
- Cache conditionnel + fréquence adaptative dès la v1 → optimal sur le papier, mais nécessite de calibrer sur des données de publication qui n'existent pas encore
**Choix** : Cache HTTP conditionnel (ETag/Last-Modified) dès la v1, à intervalle fixe (toutes les heures, identique pour toutes les sources). Fréquence adaptative différée à v2.
 
**Pourquoi** : À l'échelle de Still — sources partagées entre utilisateurs (`find_or_create_by`, décision antérieure) et quota de 10 sources actives par utilisateur — le nombre de `Source` distinctes reste de l'ordre de quelques milliers même à plusieurs milliers d'utilisateurs. Un cron horaire sur ce volume n'est pas un problème d'infrastructure ; ETag/Last-Modified est le mécanisme standard utilisé par FreshRSS, Miniflux et consorts à toutes les échelles, pas une optimisation qu'on dépasse. La fréquence adaptative, elle, nécessite un historique réel de `created_at` par `Item` pour être calibrée correctement — la calibrer maintenant serait spéculatif, dans l'esprit de la décision 013 (alternance par densité différée pour la même raison). `Source` reçoit deux colonnes (`etag`, `last_modified`) ; la logique de fréquence adaptative pourra être ajoutée en v2 sans refactoring majeur, en se basant sur les écarts entre `Item#created_at` par source.
 
---
 
## 016 — Suppression d'`Item#author`, redondant avec `Source#name`
 
**Contexte** : En implémentant `RssCrawler` contre un vrai flux (Atom, `simonwillison.net`), `entry.author` retourne systématiquement `nil` — l'information d'auteur au niveau d'une entrée individuelle n'est pas fiable ou absente selon les flux. La validation `presence: true` sur `Item#author` faisait donc échouer silencieusement toute création d'item (`find_or_create_by` + validation échouée = rollback sans exception).
 
**Options** :
- Construire une chaîne de fallback (`entry.author` → `feed.title` → `source.name`) pour toujours remplir `author`
- Supprimer `Item#author` entièrement et utiliser `item.source.name` à l'affichage
**Choix** : Suppression de la colonne `author` et de sa validation sur `Item`. Aucun fallback construit.
 
**Pourquoi** : Dans l'immense majorité des cas, "l'auteur" d'un article de blog, d'un épisode de podcast ou d'une vidéo YouTube *est* la source elle-même (le blog, la chaîne, le podcast) — exactement l'information que `Source#name` porte déjà (décision 010). Un champ `Item#author` séparé serait soit redondant (dupliquant `source.name`), soit vide (les flux ne fournissant pas d'auteur par entrée de façon fiable). Conserver le champ aurait nécessité une logique de fallback non triviale pour une donnée qui n'apporte rien de plus que la relation `item.source.name` existante. Cohérent avec "less is more" : pas de champ sans raison d'être.
 
---
 
## 017 — Validation `duration` déplacée d'`Item` vers `Video`/`Episode`
 
**Contexte** : `Item#duration` portait `validates :duration, presence: true` au niveau du parent STI, avec en plus une contrainte `null: false` en base. En testant `RssCrawler` contre un flux Atom d'articles, `entry.respond_to?(:duration)` est `false` — la méthode n'existe même pas sur ce type d'entrée. Conceptuellement, un article texte n'a pas de durée : l'utilisateur le lit à son propre rythme.
 
**Options** :
- Garder `duration` obligatoire sur `Item`, fournir une valeur par défaut arbitraire pour les articles
- Déplacer la validation `presence: true` vers `Video` et `Episode` uniquement, retirer la contrainte `null: false` en base sur `items`
**Choix** : `duration` devient nullable au niveau `Item` (colonne et validation), et `validates :duration, presence: true` est ajoutée individuellement sur `Video` et `Episode`.
 
**Pourquoi** : `duration` n'a de sens que pour les types de contenu consommés en temps réel (vidéo, audio) — pas pour un article, dont la durée de lecture dépend du lecteur. STI permet précisément ce genre de validation différenciée par sous-type (`Article` a déjà sa propre validation sur `content`). Forcer une valeur arbitraire (ex: `0`) sur tous les articles aurait été une donnée fausse stockée pour satisfaire une contrainte technique — contraire à l'esprit de la décision 008 (pas de données qui n'ont pas de sens réel). Nécessite deux migrations : `change_column_null` sur `items.duration` (autoriser `null`), et les validations ajoutées dans `app/models/video.rb` / `app/models/episode.rb`.
 
---
 
## 018 — `RssCrawler` : requête HTTP manuelle + `Feedjira.parse`, plutôt que `fetch_and_parse`
 
**Contexte** : `RssCrawler` utilisait `Feedjira::Feed.fetch_and_parse(url)`, qui effectue la requête HTTP et le parsing XML en une seule étape opaque. La décision 015 (cache HTTP conditionnel) nécessite d'envoyer des headers de requête personnalisés (`If-None-Match`, `If-Modified-Since`) et de lire les headers de la réponse (`ETag`, `Last-Modified`, status `304`) — choses que `fetch_and_parse` ne permet pas de faire.
 
**Options** :
- Garder `fetch_and_parse`, chercher une gem ou un wrapper tiers pour le cache conditionnel
- Séparer la requête HTTP (`Net::HTTP`, stdlib Ruby) du parsing (`Feedjira.parse(body)`, qui accepte du XML brut)
**Choix** : `RssCrawler` effectue lui-même la requête via `Net::HTTP` (avec `URI` pour découper l'URL en host/port/scheme/path), puis passe `response.body` à `Feedjira.parse`.
 
**Pourquoi** : `Net::HTTP` et `URI` sont dans la stdlib Ruby — aucune dépendance supplémentaire. Cette séparation donne un accès complet aux headers de requête et de réponse, prérequis non négociable pour la décision 015. Au passage, `Feedjira.parse` retourne des objets dont l'interface varie selon le format détecté (`Feedjira::Parser::Atom` vs RSS) : `.entries` (pas `.items`), et certaines méthodes comme `.duration` n'existent pas du tout sur certains types d'entrée — d'où l'usage de `entry.respond_to?(:duration)` avant assignation, pour rester robuste face à la diversité réelle des flux.
 
---
 
## 019 — Pas de limite arbitraire sur le nombre d'items du feed

**Contexte** : `ItemsController#index` limitait le feed à 30 items (`.limit(30)`). En testant avec plusieurs sources réelles, une source ayant publié beaucoup de contenu récemment monopolisait la fenêtre de 30 items — `FeedComposer` ne peut alterner que ce qu'on lui donne, donc l'alternance par source tombait à plat. La limite causait exactement le comportement qu'on cherchait à éviter.

**Options** :
- Garder `.limit(30)` avec pagination infinite scroll → complexifie l'alternance entre pages et contredit l'esprit "pas de fil sans fin"
- Supprimer toute limite → le contenu disponible est borné naturellement par les sources choisies par l'utilisateur

**Choix** : Aucune limite technique sur le nombre d'items retournés. Introduction d'un service `FeedBalancer` qui garantit une représentation équilibrée par source avant que `FeedComposer` alterne, pour que l'alternance fonctionne correctement même avec un grand volume d'items.

**Pourquoi** : Le contenu du feed est fini par construction — il est limité aux sources choisies par l'utilisateur et au temps de publication de ces sources. Ce n'est pas un fil infini algorithmique, c'est un bac fini et choisi. Une limite arbitraire de 30 créait un artefact technique (monopolisation d'une source prolifique) sans bénéfice utilisateur réel. Cohérent avec la philosophie "tu ne peux jamais être en retard dans Still" : l'utilisateur accède à tout ce qu'il a choisi de recevoir, pas à une fenêtre tronquée.

---
 
# DESIGN
 
---
 
## D01 — Système typographique à deux niveaux
 
**Contexte** : Still a deux registres — l'interface et la lecture longue. Un troisième niveau (display/identité) existait pour servir les Moments Sun et Moon. La suppression des Moments le rend injustifiable.
 
**Options** :
- Trois niveaux : Spectral (display) + Source Serif 4 (lecture) + Inter (interface)
- Deux niveaux : Inter (titres et interface) + Source Serif 4 (lecture longue)
**Choix** : Inter (titres et interface) + Source Serif 4 (lecture longue).
 
**Pourquoi** : Deux polices avec des territoires exclusifs sont plus fortes que trois qui se partagent l'espace. Spectral était un bon choix dans un contexte qui n'existe plus. Inter prend les titres — cohérent avec son rôle graphique déjà établi dans le logo. Source Serif 4 garde la lecture : variable font, optical sizing, conçue pour la lecture longue sur écran.
 
---
 
## D02 — Deux thèmes, pas de palettes par Moment
 
**Contexte** : Les palettes Sun/Moon/Flow étaient justifiées par trois états d'attention distincts. Avec un seul feed de lecture + Flow, trois palettes deviennent un système à expliquer sans raison d'être.
 
**Options** :
- Trois palettes dérivées de Flexoki (une par Moment)
- Thème clair + thème sombre, teal Flow réservé à son seul écran
**Choix** : Thème clair + thème sombre. Teal Flow (`#24837B`) réservé à l'écran de départ uniquement.
 
**Pourquoi** : Un branding plus lisible parce qu'il y a moins de signaux à décoder. L'invariant reste : température d'encre Flexoki dans les deux modes. Fond clair : `#FFFCF0` (crème). Fond sombre : `#1A1410` (brun-noir ambré). Le teal de Flow reste le seul moment chromatique fort — il marque le passage, pas un environnement de lecture.
 
---
 
## D03 — Accent couleur unique par thème
 
**Contexte** : Terracotta, or lunaire et teal servaient chacun un Moment. Avec deux thèmes, un seul accent par mode suffit.
 
**Options** :
- Accents distincts par Moment (terracotta / or / teal)
- Un accent par thème dans la même famille thermique Flexoki
**Choix** : Terracotta `#BC5215` comme accent principal (clair et sombre). Teal `#24837B` réservé à l'écran Flow uniquement.
 
**Pourquoi** : Terracotta est l'accent le plus fort et le plus lisible de la palette Flexoki. Il fonctionne sur les deux fonds. L'or lunaire (`#C49A52`) était lié à Moon — sans Moon, il n'a plus de territoire. Le teal de Flow garde sa singularité parce qu'il n'apparaît qu'une fois.
 
---
 
## D04 — Logo : le wordmark et les livres
 
**Contexte** : Le symbol de Still doit être trouvé, pas inventé — il doit avoir une raison d'exister au-delà de l'esthétique.
 
**Options** :
- Arc / brushstroke → activait la reconnaissance faciale au contact du wordmark
- Cercle plein → trop générique, injustifiable (Shiori le fait déjà)
- Forme géométrique abstraite → aucun ancrage dans le monde de Still
- Dôme aplati + typographie modifiée (abandonné : similarité avec Dia)
**Choix** : "StilL." en Inter Bold avec les deux L modifiés en livres debout.
 
**Pourquoi** : Les deux L sont deux livres posés debout l'un contre l'autre — l'objet physique de la lecture, caché dans le nom depuis le début. Le point : l'ancre du wordmark, la fin de phrase, le bookend qui tient tout ensemble. Ces lectures ne s'expliquent pas — elles se découvrent. Inter Bold crée une tension productive avec Source Serif 4 : le logo est graphique et construit, l'app est éditoriale et chaleureuse.
 
---
 
## D05 — Flow comme moment chromatique, pas comme palette
 
**Contexte** : Flow est le seul geste volontaire dans Still — déclarer qu'on part, scanner le QR code, poser le téléphone. Ce n'est pas un environnement de lecture.
 
**Choix** : Flow n'a pas de palette de lecture — il a un accent teal `#24837B` appliqué à son écran de départ uniquement.
 
**Pourquoi** : Le feed de lecture est un séjour — il mérite une palette complète (clair ou sombre). Flow est un seuil — une transition entre l'intérieur et le dehors. L'écran Flow est le seul moment dans Still où le fond peut être coloré. La rupture chromatique marque le passage. Quand tu rentres, l'app est archivée et silencieuse — aucun retour vers le teal.
 
---
 
*Ajouter une décision ici quand elle est prise, pas après.*
