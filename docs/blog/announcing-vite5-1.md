---
title: Vite 5.1 est sorti !
author:
  name: L'équipe Vite
date: 2024-02-08
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Annonce de Vite 5.1
  - - meta
    - property: og:image
      content: https://fr.vite.dev/og-image-announcing-vite5-1.png
  - - meta
    - property: og:url
      content: https://fr.vite.dev/blog/announcing-vite5-1
  - - meta
    - property: og:description
      content: Annonce de la sortie de Vite 5.1
  - - meta
    - name: twitter:card
      content: summary_large_image
---

# Vite 5.1 est sorti !

_8 février 2024_

![Image de couverture de l'annonce de Vite 5.1](/og-image-announcing-vite5-1.png)

Vite 5 [a été publié](./announcing-vite5.md) en novembre dernier, et représentait un grand pas pour Vite et l'écosystème. Quelques semaines plus tard, nous célébrons les 10 millions de téléchargements hebdomadaires npm et 900 contributeurs au dépôt Vite. Aujourd'hui, nous sommes heureux d'annoncer la sortie de Vite 5.1.

Liens rapides : [Docs](/), [Changelog](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#510-2024-02-08)

Docs dans d'autres langues : [简体中文](https://cn.vite.dev/), [日本語](https://ja.vite.dev/), [Español](https://es.vite.dev/), [Português](https://pt.vite.dev/), [한국어](https://ko.vite.dev/), [Deutsch](https://de.vite.dev/)

Essayez Vite 5.1 en ligne dans StackBlitz : [vanilla](https://vite.new/vanilla-ts), [vue](https://vite.new/vue-ts), [react](https://vite.new/react-ts), [preact](https://vite.new/preact-ts), [lit](https://vite.new/lit-ts), [svelte](https://vite.new/svelte-ts), [solid](https://vite.new/solid-ts), [qwik](https://vite.new/qwik-ts).

Si vous êtes nouveau dans Vite, nous vous suggérons de lire d'abord les guides [Débuter](/guide/) et les [Fonctionnalités](/guide/features).

Pour rester à jour, suivez-nous sur [X](https://x.com/vite_js) ou [Mastodon](https://webtoo.ls/@vite).

## API de runtime de Vite

Vite 5.1 ajoute un support expérimental pour une nouvelle API de runtime de Vite. Elle permet d'exécuter du code en le traitant avec des plugins Vite. Elle est différente de `server.ssrLoadModule` car l'implémentation du runtime est découplée du serveur. Cela permet aux auteurs de bibliothèques et de frameworks d'implémenter leur propre couche de communication entre le serveur et le runtime. Cette nouvelle API est destinée à remplacer les primitives SSR actuelles de Vite une fois qu'elles seront stables.

Cette nouvelle API apporte de nombreux avantages :

- Support pour HMR lors de SSR.
- Elle est découplée du serveur, donc il n'y a pas de limite sur le nombre de clients qui peuvent utiliser un serveur unique - chaque client a son propre cache de modules (vous pouvez même communiquer avec lui comme vous le souhaitez - en utilisant un canal de message/appel de fetch/appel de fonction directe/websocket).
- Elle ne dépend d'aucune API de node/bun/deno intégrée, donc elle peut s'exécuter dans n'importe quel environnement.
- Elle est facile à intégrer avec des outils qui ont leur propre mécanisme pour exécuter du code (vous pouvez fournir un runner pour utiliser `eval` à la place de `new AsyncFunction` par exemple).

L'idée initiale [a été proposée par Pooya Parsa](https://github.com/nuxt/vite/pull/201) et implémentée par [Anthony Fu](https://github.com/antfu) comme le package [vite-node](https://github.com/vitest-dev/vitest/tree/main/packages/vite-node#readme) pour [alimenter le SSR de Nuxt 3](https://antfu.me/posts/dev-ssr-on-nuxt) et a été également utilisée comme base pour [Vitest](https://vitest.dev). L'idée générale de vite-node a été testée pendant un certain temps maintenant. C'est une nouvelle itération de l'API par [Vladimir Sheremet](https://github.com/sheremet-va), qui avait déjà implémenté vite-node dans Vitest et a pris les enseignements pour rendre l'API encore plus puissante et flexible lorsqu'elle a été ajoutée au noyau de Vite. La PR a été en cours pendant un an, vous pouvez voir l'évolution et les discussions avec les mainteneurs de l'écosystème [ici](https://github.com/vitejs/vite/issues/12165).

::: info
L'API de runtime de Vite a évolué en API de runner de module, publiée dans Vite 6 comme partie de l'API [Environment](/guide/api-environment).
:::

## Fonctionnalités

### Amélioration du support pour `.css?url`

Importer des fichiers CSS en tant que URL fonctionne maintenant de manière fiable et correcte. C'était la dernière étape pour Remix pour passer à Vite. Voir ([#15259](https://github.com/vitejs/vite/issues/15259)).

### `build.assetsInlineLimit` supporte maintenant un callback

Les utilisateurs peuvent maintenant [fournir un callback](/config/build-options.html#build-assetsinlinelimit) qui retourne un booléen pour l'opt-in ou l'opt-out de l'inlining pour des assets spécifiques. Si `undefined` est retourné, la logique par défaut s'applique. Voir ([#15366](https://github.com/vitejs/vite/issues/15366)).

### Amélioration du HMR pour les imports circulaires

Dans Vite 5.0, les modules acceptés dans les imports circulaires ont toujours déclenché un rechargement de page complet même si elles peuvent être gérées correctement dans le client. Cela est maintenant allegé pour permettre le HMR sans rechargement de page, mais si une erreur se produit pendant le HMR, la page sera rechargée. Voir ([#15118](https://github.com/vitejs/vite/issues/15118)).

### Support de `ssr.external: true` pour externaliser tous les packages SSR

Historiquement, Vite externalise tous les packages sauf les packages liés. Cette nouvelle option peut être utilisée pour forcer l'externalisation de tous les packages, y compris les packages liés. C'est pratique dans les tests dans des monorepos où nous voulons simuler le cas habituel de tous les packages externalisés, ou lorsque nous utilisons `ssrLoadModule` pour charger un fichier arbitraire et que nous voulons toujours externaliser les packages comme nous ne nous soucions pas de HMR. Voir ([#10939](https://github.com/vitejs/vite/issues/10939)).

### Exposition de la méthode `close` dans le serveur de prévisualisation

Le serveur de prévisualisation expose maintenant une méthode `close`, qui nettoie correctement le serveur y compris toutes les connexions de socket ouvertes. Voir ([#15630](https://github.com/vitejs/vite/issues/15630)).

## Améliorations de performance

Vite continue d'être plus rapide avec chaque version, et Vite 5.1 est packagé avec des améliorations de performance. Nous avons mesuré le temps de chargement pour 10K modules (arbre de 25 niveaux) en utilisant [vite-dev-server-perf](https://github.com/yyx990803/vite-dev-server-perf) pour toutes les versions mineures de Vite 4.0. C'est un bon benchmark pour mesurer l'effet de l'approche sans bundle de Vite. Chaque module est un petit fichier TypeScript avec un compteur et des imports vers d'autres fichiers dans l'arbre, donc cela mesure principalement le temps qu'il faut pour faire les requêtes pour des modules séparés. Dans Vite 4.0, le chargement de 10K modules prenait 8 secondes sur un M1 MAX. Nous avons eu une rupture dans [Vite 4.3 où nous nous sommes concentrés sur les performances](./announcing-vite4-3.md), et nous avons été en mesure de les charger en 6.35 secondes. Dans Vite 5.1, nous avons réussi une autre amélioration des performances. Vite est maintenant en mesure de servir les 10K modules en 5.35 secondes.

![Progression du temps de chargement des 10K modules de Vite](/vite5-1-10K-modules-loading-time.png)

Les résultats de cette exécution du benchmark sur Headless Puppeteer sont un bon moyen de comparer les versions. Ils ne représentent pas le temps comme expérimenté par les utilisateurs. Lorsque nous exécutons les mêmes 10K modules dans une fenêtre Incognito de Chrome, nous avons:

| 10K Modules           | Vite 5.0 | Vite 5.1 |
| --------------------- | :------: | :------: |
| Temps de chargement          |  2892ms  |  2765ms  |
| Temps de chargement (cache) |  2778ms  |  2477ms  |
| Rechargement complet           |  2003ms  |  1878ms  |
| Rechargement complet (cache)  |  1682ms  |  1604ms  |

### Exécution des préprocesseurs CSS dans des threads

Vite a maintenant un support natif pour exécuter des préprocesseurs CSS dans des threads. Vous pouvez l'activer en utilisant [`css.preprocessorMaxWorkers: true`](/config/shared-options.html#css-preprocessormaxworkers). Pour un projet Vuetify 2, le temps de démarrage du dev a été réduit de 40% avec cette fonctionnalité activée. Il y a un [comparatif des performances pour d'autres configurations dans la PR](https://github.com/vitejs/vite/pull/13584#issuecomment-1678827918). Voir ([#13584](https://github.com/vitejs/vite/issues/13584)). [Faire un retour](https://github.com/vitejs/vite/discussions/15835).

### Nouvelles options pour améliorer les démarrages de serveur froids

Vous pouvez définir `optimizeDeps.holdUntilCrawlEnd: false` pour basculer vers une nouvelle stratégie pour l'optimisation des dépendances qui peut aider dans les gros projets. Nous envisageons de basculer vers cette stratégie par défaut dans le futur. [Faire un retour](https://github.com/vitejs/vite/discussions/15834). ([#15244](https://github.com/vitejs/vite/issues/15244))

### Résolution plus rapide avec les vérifications mises en cache

L'optimisation `fs.cachedChecks` est maintenant activée par défaut. Dans Windows, `tryFsResolve` était ~14x plus rapide avec elle, et la résolution des ids a obtenu un gain de ~5x dans le benchmark triangle. ([#15704](https://github.com/vitejs/vite/issues/15704))

### Améliorations de performance internes

Le serveur de développement a eu plusieurs gains de performance incrémentiels. Un nouveau middleware pour court-circuiter sur 304 ([#15586](https://github.com/vitejs/vite/issues/15586)). Nous avons évité `parseRequest` dans les hot paths ([#15617](https://github.com/vitejs/vite/issues/15617)). Rollup est maintenant correctement lazy loadé ([#15621](https://github.com/vitejs/vite/issues/15621))

## Dépréciations

Nous continuons à réduire la surface d'API de Vite tant que possible pour rendre le projet maintenable à long terme.

### Déprécié `as` option dans `import.meta.glob`

Le standard a migré vers [Import Attributes](https://github.com/tc39/proposal-import-attributes), mais nous n'envisageons pas de remplacer `as` avec une nouvelle option à ce stade. Au lieu de cela, il est recommandé que l'utilisateur bascule vers `query`. Voir ([#14420](https://github.com/vitejs/vite/issues/14420)).

### Suppression du pré-bundling de build-time

Build-time pre-bundling, une fonctionnalité expérimentale ajoutée dans Vite 3, est supprimée. Avec Rollup 4 qui bascule son analyseur vers natif, et Rollup qui est en cours de développement, les histoires de performance et de consistance entre le développement et la construction pour cette fonctionnalité ne sont plus valides. Nous voulons continuer à améliorer la consistance entre le développement et la construction, et avons conclu que l'utilisation de Rollup pour "pré-bundling pendant le développement" et "constructions de production" est la meilleure option pour l'avenir. Rollup peut également implémenter le caching de manière beaucoup plus efficace pendant la construction que le pré-bundling des dépendances. Voir ([#15184](https://github.com/vitejs/vite/issues/15184)).

## Participer

Nous sommes reconnaissants aux [900 contributeurs à Vite Core](https://github.com/vitejs/vite/graphs/contributors), et aux mainteneurs de plugins, intégrations, outils, et traductions qui poussent l'écosystème vers l'avant. Si vous appréciez Vite, nous vous invitons à participer et nous aider. Consultez notre [Guide de contribution](https://github.com/vitejs/vite/blob/main/CONTRIBUTING.md), et jetez-vous dans [tri des tickets](https://github.com/vitejs/vite/issues), [revues de PRs](https://github.com/vitejs/vite/pulls), répondre aux questions sur [GitHub Discussions](https://github.com/vitejs/vite/discussions) et aider les autres dans la communauté dans [Vite Land](https://chat.vite.dev).

## Remerciements

Vite 5.1 est possible grâce à notre communauté de contributeurs, mainteneurs dans l'écosystème, et l'équipe [Vite](/team). Un remerciement tout particulieraux individus et entreprises qui soutiennent le développement de Vite. [StackBlitz](https://stackblitz.com/), [Nuxt Labs](https://nuxtlabs.com/), et [Astro](https://astro.build) ont embauché des membres de l'équipe Vite. Et aussi aux sponsors sur [GitHub Sponsors de Vite](https://github.com/sponsors/vitejs), [Open Collective de Vite](https://opencollective.com/vite), et [GitHub Sponsors d'Evan You](https://github.com/sponsors/yyx990803).
