---
title: Vite 5.0 est sorti !
author:
  name: L'équipe Vite
date: 2023-11-16
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Annonce de Vite 5
  - - meta
    - property: og:image
      content: https://fr.vite.dev/og-image-announcing-vite5.png
  - - meta
    - property: og:url
      content: https://fr.vite.dev/blog/announcing-vite5
  - - meta
    - property: og:description
      content: Annonce de la sortie de Vite 5
  - - meta
    - name: twitter:card
      content: summary_large_image
---

# Vite 5.0 est sorti !

_16 novembre 2023_

![Image de couverture de l'annonce de Vite 5](/og-image-announcing-vite5.png)

Vite 4 [a été publié](./announcing-vite4.md) il y a un peu plus d'un an, et il a servi de base solide pour l'écosystème. Les téléchargements npm par semaine sont passés de 2,5 millions à 7,5 millions, car les projets continuent à construire sur une infrastructure partagée. Les frameworks ont continué à innover, et sur [Astro](https://astro.build/), [Nuxt](https://nuxt.com/), [SvelteKit](https://kit.svelte.dev/), [Solid Start](https://www.solidjs.com/blog/introducing-solidstart), [Qwik City](https://qwik.builder.io/qwikcity/overview/), entre autres, nous avons vu de nouveaux frameworks rejoindre et renforcer l'écosystème. [RedwoodJS](https://redwoodjs.com/) et [Remix](https://remix.run/) ont changé pour utiliser Vite, ce qui ouvre la voie à une adoption plus large dans l'écosystème React. [Vitest](https://vitest.dev) a continué à grandir à un rythme encore plus rapide que Vite. Son équipe a travaillé dur et [prévoit publier Vitest 1.0](https://github.com/vitest-dev/vitest/issues/3596) dans les semaines à venir. Le récit de Vite lorsqu'il est utilisé avec d'autres outils tels que [Storybook](https://storybook.js.org), [Nx](https://nx.dev), et [Playwright](https://playwright.dev) a continué à s'améliorer, et le même principe s'applique aux environnements, avec Vite dev fonctionnant dans [Deno](https://deno.com) et [Bun](https://bun.sh).

Nous avons eu la deuxième édition de [ViteConf](https://viteconf.org/23/replay) il y a un mois, hébergée par [StackBlitz](https://stackblitz.com). Comme l'an passé, la plupart des projets de l'écosystème se sont réunis pour partager des idées et se connecter pour maintenir et étendre les ressources communes. Nous voyons également de nouvelles pièces complémentaires pour renforcer l'offre de l'outil de framework comme [Volar](https://volarjs.dev/) et [Nitro](https://nitro.unjs.io/). L'équipe Rollup a publié [Rollup 4](https://rollupjs.org) le même jour, une tradition commencée par Lukas l'an passé.

Six mois après, Vite 4.3 [a été publié](./announcing-vite4.md). Cette version a significativement amélioré les performances du serveur de développement. Cependant, il existe encore un grand espace pour l'amélioration. À la ViteConf, [Evan You a présenté le plan de long terme de Vite pour travailler sur Rolldown](https://www.youtube.com/watch?v=hrdwQHoAp0M), une version Rust de Rollup avec des API compatibles. Une fois prêt, nous prévoyons l'utiliser dans le noyau de Vite pour prendre en charge les tâches de Rollup et esbuild. Cela signifiera un boost dans les performances de build (et plus tard dans les performances de développement, car nous déplacerons les parties sensibles aux performances de Vite vers Rust), et une grande réduction des incohérences entre le développement et la construction. Rolldown est actuellement dans les premières étapes et l'équipe prépare le code source à la fin de l'année. Restez connecté !

Aujourd'hui, nous marquons un autre grand point d'étape dans l'évolution de Vite. L'équipe [Vite](/team), les [contributeurs](https://github.com/vitejs/vite/graphs/contributors), et partenaires de l'écosystème, sont heureux de vous annoncer la sortie de Vite 5. Vite utilise maintenant [Rollup 4](https://github.com/vitejs/vite/pull/14508), ce qui représente un grand boost dans les performances de build. Et il y a également de nouvelles options pour améliorer le profil de performance de votre serveur de développement.

Vite 5 se concentre sur le nettoyage de l'API (suppression des fonctionnalités dépréciées) et simplifie plusieurs fonctionnalités en résolvant des problèmes longuement ouverts, par exemple en changeant `define` pour utiliser des remplacements AST appropriés plutôt que des regexes. Nous continuons également à prendre des mesures pour assurer la compatibilité future de Vite (Node.js 18+ est maintenant requis, et [l'API Node CJS a été dépréciée](/guide/migration#deprecate-cjs-node-api)).

Quick links:

- [Docs](/)
- [Guide de migration](/guide/migration)
- [Changelog](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#500-2023-11-16)

Docs in other languages:

- [简体中文](https://cn.vite.dev/)
- [日本語](https://ja.vite.dev/)
- [Español](https://es.vite.dev/)
- [Português](https://pt.vite.dev/)
- [한국어](https://ko.vite.dev/)
- [Deutsch](https://de.vite.dev/) (nouvelle traduction!)

Si vous êtes nouveau sur Vite, nous vous suggérons de lire d'abord le guide [Débuter](/guide/) et celui des [Fonctionnalités](/guide/features).

Nous sommes reconnaissants aux plus de [850 contributeurs à Vite Core](https://github.com/vitejs/vite/graphs/contributors), et aux mainteneurs et contributeurs de plugins, intégrations, outils, et traductions qui nous ont permis d'arriver ici. Nous vous encourageons à participer et à continuer à améliorer Vite avec nous. Vous pouvez en savoir plus sur notre [Guide de contribution](https://github.com/vitejs/vite/blob/main/CONTRIBUTING.md). Pour commencer, nous vous suggérons de [trier les tickets](https://github.com/vitejs/vite/issues), de [revoir les PR](https://github.com/vitejs/vite/pulls), d'envoyer des PR de tests en échec basés sur les tickets ouverts, et d'aider les autres dans [Discussions](https://github.com/vitejs/vite/discussions) et le [forum d'aide de Vite Land](https://discord.com/channels/804011606160703521/1019670660856942652). Vous apprendrez beaucoup de choses et aurez un chemin facile pour contribuer au projet. Si vous avez des doutes, rejoignez notre [communauté Discord](http://chat.vite.dev/) et dites-nous bonjour sur le canal [#contributing](https://discord.com/channels/804011606160703521/804439875226173480).

Pour rester à jour, suivez-nous sur [X](https://twitter.com/vite_js) ou [Mastodon](https://webtoo.ls/@vite).

## Démarrer avec Vite 5

Utilisez `pnpm create vite` pour créer un projet Vite avec votre framework préféré, ou ouvrez un template commencé en ligne de commande pour jouer avec Vite 5 en utilisant [vite.new](https://vite.new). Vous pouvez également exécuter `pnpm create vite-extra` pour accéder aux templates de d'autres frameworks et runtimes (Solid, Deno, SSR, et starters de bibliothèques). Les templates `create vite-extra` sont également disponibles lorsque vous exécutez `create vite` sous l'option `Others`.

Notez que les templates de démarrage de Vite sont conçus pour être utilisés comme un terrain de jeu pour tester Vite avec différents frameworks. Lorsque vous construisez votre prochain projet, nous vous recommandons de vous tourner vers les starters recommandés par chaque framework. Certains frameworks redirigent maintenant dans `create vite` vers leurs starters (`create-vue` et `Nuxt 3` pour Vue, et `SvelteKit` pour Svelte).

## Support de Node.js

Vite ne supporte plus Node.js 14 / 16 / 17 / 19, qui a atteint sa date de fin de vie. Node.js 18 / 20+ est maintenant requis.

## Performances

En plus des améliorations des performances de build de Rollup 4, il existe un guide pour vous aider à identifier et résoudre les problèmes de performances communs à [https://fr.vite.dev/guide/performance](/guide/performance).

Vite 5 introduit [server.warmup](/guide/performance.html#warm-up-frequently-used-files), une nouvelle fonctionnalité pour améliorer le temps de démarrage. Il vous permet de définir une liste de modules qui devraient être prétransformés dès que le serveur démarre. Lorsque vous utilisez [`--open` ou `server.open`](/config/server-options.html#server-open), Vite démarrera également automatiquement le point d'entrée de votre application ou l'URL fournie pour l'ouvrir.

## Changements majeurs

- [Vite est maintenant alimenté par Rollup 4](/guide/migration#rollup-4)
- [L'API Node CJS a été dépréciée](/guide/migration#deprecate-cjs-node-api)
- [Réécriture de `define` et de la stratégie de remplacement de `import.meta.env.*`](/guide/migration#rework-define-and-import-meta-env-replacement-strategy)
- [La valeur des modules externes SSR correspond maintenant à la production](/guide/migration#ssr-externalized-modules-value-now-matches-production)
- [`worker.plugins` est maintenant une fonction](/guide/migration#worker-plugins-is-now-a-function)
- [Autoriser les chemins contenant `.` à tomber sur index.html](/guide/migration#allow-path-containing-to-fallback-to-index-html)
- [Allignement du comportement de serveur de développement et de prévisualisation HTML](/guide/migration#align-dev-and-preview-html-serving-behaviour)
- [Les fichiers manifestes sont maintenant générés dans le répertoire `.vite` par défaut](/guide/migration#manifest-files-are-now-generated-in-vite-directory-by-default)
- [Les raccourcis CLI nécessitent une pression supplémentaire sur `Enter`](/guide/migration#cli-shortcuts-require-an-additional-enter-press)
- [Mise à jour le comportement de `experimentalDecorators` et `useDefineForClassFields` TypeScript](/guide/migration#update-experimentaldecorators-and-usedefineforclassfields-typescript-behaviour)
- [Suppression du drapeau `--https` et `https: true`](/guide/migration#remove-https-flag-and-https-true)
- [Suppression des APIs `resolvePackageEntry` et `resolvePackageData`](/guide/migration#remove-resolvepackageentry-and-resolvepackagedata-apis)
- [Suppression des APIs dépréciées](/guide/migration#removed-deprecated-apis)
- [Lire plus sur les changements avancés affectant les auteurs de plugins et d'outils](/guide/migration#advanced)

## Migration vers Vite 5

Nous avons travaillé avec nos partenaires de l'écosystème pour garantir une migration fluide vers cette nouvelle version majeure. Une fois de plus, [vite-ecosystem-ci](https://www.youtube.com/watch?v=7L4I4lDzO48) a été crucial pour nous aider à apporter des changements plus audacieux tout en évitant les régressions. Nous sommes ravis de voir d'autres écosystèmes adopter des schémas similaires pour améliorer la collaboration entre leurs projets et les mainteneurs downstream.

Pour la plupart des projets, la mise à jour vers Vite 5 devrait être directe. Mais nous vous conseillons de revoir le [guide de migration détaillé](/guide/migration) avant de mettre à jour.

Un résumé au niveau basique avec la liste complète des changements pour le noyau de Vite peut être trouvé dans le [changelog de Vite 5](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#500-2023-11-16).

## Remerciements

Vite 5 est le résultat de longues heures de travail par notre communauté de contributeurs, mainteneurs, auteurs de plugins, et l'équipe [Vite](/team). Un grand coup de main à [Bjorn Lu](https://twitter.com/bluwyoo) pour mener le processus de release pour cette version majeure.

Nous sommes également reconnaissants aux individus et entreprises qui soutiennent le développement de Vite. [StackBlitz](https://stackblitz.com/), [Nuxt Labs](https://nuxtlabs.com/), et [Astro](https://astro.build) continuent à investir dans Vite en recrutant des membres de l'équipe Vite. Un grand coup de main aux sponsors sur [GitHub Sponsors de Vite](https://github.com/sponsors/vitejs), [Open Collective de Vite](https://opencollective.com/vite), et [GitHub Sponsors d'Evan You](https://github.com/sponsors/yyx990803). Un grand merci à [Remix](https://remix.run/) pour devenir un sponsor or et contribuer aux retours après avoir changé pour utiliser Vite.
