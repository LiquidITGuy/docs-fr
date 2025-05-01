---
title: Vite 6.0 est sorti !
author:
  name: L'équipe Vite
date: 2024-11-26
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Annonce de Vite 6
  - - meta
    - property: og:image
      content: https://vite.dev/og-image-announcing-vite6.png
  - - meta
    - property: og:url
      content: https://vite.dev/blog/announcing-vite6
  - - meta
    - property: og:description
      content: Annonce de la sortie de Vite 6
  - - meta
    - name: twitter:card
      content: summary_large_image
---

# Vite 6.0 est sorti !

_26 novembre 2024_

![Image de couverture de l'annonce de Vite 6](/og-image-announcing-vite6.png)

Aujourd'hui, il s'agit d'un autre grand pas dans l'histoire de Vite. L'équipe [Vite](/team), les contributeurs et les partenaires de l'écosystème sont enthousiasmés d'annoncer la sortie de Vite 6.

Cette année a été pleine d'événements. L'adoption de Vite continue de croître, avec des téléchargements npm par semaine passant de 7,5 millions à 17 millions depuis la sortie de Vite 5 il y a un an. [Vitest](https://vitest.dev) n'est plus seulement privilégiée par les utilisateurs, mais commence également à former un écosystème propre. Par exemple, [Storybook](https://storybook.js.org) a de nouvelles capacités de test pilotées par Vitest.

De nouveaux frameworks ont également rejoint l'écosystème Vite, y compris [TanStack Start](https://tanstack.com/start), [One](https://onestack.dev/), [Ember](https://emberjs.com/), et d'autres. Les frameworks web innovent de plus en plus rapidement. Vous pouvez consulter les améliorations que les gens ont faites à [Astro](https://astro.build/), [Nuxt](https://nuxt.com/), [SvelteKit](https://kit.svelte.dev/), [Solid Start](https://www.solidjs.com/blog/introducing-solidstart), [Qwik City](https://qwik.builder.io/qwikcity/overview/), [RedwoodJS](https://redwoodjs.com/), [React Router](https://reactrouter.com/), et la liste continue.

Vite est utilisé par OpenAI, Google, Apple, Microsoft, NASA, Shopify, Cloudflare, GitLab, Reddit, Linear, et bien d'autres encore. Deux mois plus tard, nous avons commencé une liste d'[entreprises utilisant Vite](https://github.com/vitejs/companies-using-vite). Nous sommes heureux de voir beaucoup de développeurs nous envoyer une PR pour ajouter leurs entreprises à la liste. Il est difficile de croire à la quantité d'écosystème que nous avons construit ensemble depuis que Vite a pris ses premières étapes.

![Téléchargements npm par semaine de Vite](/vite6-npm-weekly-downloads.png)

## Accélérer l'écosystème de Vite

Le mois dernier, la communauté s'est réunie pour la troisième édition de la [ViteConf](https://viteconf.org/24/replay), hébergée une fois de plus par [StackBlitz](https://stackblitz.com). C'était la plus grande conférence Vite, avec une représentation étendue de constructeurs de l'écosystème. Parmi les autres annonces, Evan You a annoncé [VoidZero](https://staging.voidzero.dev/posts/announcing-voidzero-inc), une entreprise dédiée à la construction d'un outil de chaîne de développement open-source, haue-performance et unifié pour l'écosystème JavaScript. VoidZero est derrière [Rolldown](https://rolldown.rs) et [Oxc](https://oxc.rs), et leur équipe fait des progrès significatifs, les préparant rapidement pour être adoptés par Vite. Regardez la keynote d'Evan pour en savoir plus sur les étapes suivantes pour le futur de Vite, piloté par le rust.

<YouTubeVideo videoId="EKvvptbTx6k?si=EZ-rFJn4pDW3tUvp" />

[Stackblitz](https://stackblitz.com) a révélé [bolt.new](https://bolt.new), une application Remix qui combine Claude et WebContainers et vous permet de prompt, modifier, exécuter et déployer des applications full-stack. Nate Weiner a annoncé [One](https://onestack.dev/), un nouveau framework React Vite pour le web et natif. Storybook a présenté leurs dernières fonctionnalités de test pilotées par Vitest [testing features](https://youtu.be/8t5wxrFpCQY?si=PYZoWKf-45goQYDt). Et bien plus encore. Nous vous encourageons à regarder [les 43 conférences](https://www.youtube.com/playlist?list=PLqGQbXn_GDmnObDzgjUF4Krsfl6OUKxtp). Les conférenciers ont fait un effort significatif pour nous partager ce que chaque projet etait en train de faire.

Vite a également mis à jour sa page d'accueil et cleané son domaine. Vous devriez mettre à jour vos URL pour pointer vers le nouveau domaine [vite.dev](https://vite.dev). Le nouveau design et l'implémentation a été fait par VoidZero, par les mêmes personnes qui ont fait leur site web. Remerciement spéciaux à [Vicente Rodriguez](https://bento.me/rmoon) et [Simon Le Marchant](https://marchantweb.com/).

## La prochaine version majeure de Vite est arrivée

Vite 6 est la plus importante version majeure depuis Vite 2. Nous sommes impatients de collaborer avec l'écosystème pour maintenir et étendre nos assets partagés via de nouvelles APIs, et comme d'habitude, une base plus claire sur laquelle construire.

Liens rapides :

- [Docs](/)
- Traductions: [简体中文](https://cn.vite.dev/), [日本語](https://ja.vite.dev/), [Español](https://es.vite.dev/), [Português](https://pt.vite.dev/), [한국어](https://ko.vite.dev/), [Deutsch](https://de.vite.dev/)
- [Guide de migration](/guide/migration)
- [GitHub Changelog](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#600-2024-11-26)

Si vous êtes nouveau sur Vite, nous vous suggérons de lire d'abord les guides [Débuter](/guide/) et [Fonctionnalités](/guide/features).

Nous voulons remercier les plus de [1 000 contributeurs à Vite Core](https://github.com/vitejs/vite/graphs/contributors) et les mainteneurs et contributeurs de plugins, intégrations, outils, et traductions qui ont aidé à créer cette nouvelle version majeure. Nous vous invitons à participer et à nous aider à améliorer Vite pour l'écosystème entier. En savoir plus sur notre [Guide de contribution](https://github.com/vitejs/vite/blob/main/CONTRIBUTING.md).

Pour commencer, nous vous suggérons de [trier les tickets](https://github.com/vitejs/vite/issues), de [revoir les PR](https://github.com/vitejs/vite/pulls), de renvoyer des PR de tests en échec basés sur les tickets ouverts, et de soutenir les autres dans [Discussions](https://github.com/vitejs/vite/discussions) et le [forum d'aide de Vite Land](https://discord.com/channels/804011606160703521/1019670660856942652). Si vous souhaitez nous parler, rejoignez notre [communauté Discord](http://chat.vite.dev/) et dites-nous bonjour sur le canal [#contributing](https://discord.com/channels/804011606160703521/804439875226173480).

Pour les dernières nouvelles sur l'écosystème Vite et le noyau Vite, suivez-nous sur [Bluesky](https://bsky.app/profile/vite.dev), [X](https://twitter.com/vite_js), ou [Mastodon](https://webtoo.ls/@vite).

## Démarrer avec Vite 6

Vous pouvez utiliser `pnpm create vite` pour créer rapidement une application Vite avec votre framework préféré ou jouer en ligne avec Vite 6 en utilisant [vite.new](https://vite.new). Vous pouvez également exécuter `pnpm create vite-extra` pour accéder aux templates de d'autres frameworks et runtimes (Solid, Deno, SSR, et bibliothèques de starters). `create vite-extra` templates sont également disponibles lorsque vous exécutez `create vite` sous l'option `Others`.

Les templates de démarrage de Vite sont conçus pour être utilisés comme un terrain de jeu pour tester Vite avec différents frameworks. Lorsque vous construisez votre prochain projet, vous devriez vous tourner vers le démarrage recommandé par chaque framework. `create vite` fournit également un raccourci pour configurer des démarrages appropriés par certains frameworks, comme `create-vue`, `Nuxt 3`, `SvelteKit`, `Remix`, `Analog`, et `Angular`.

## Support de Node.js

Vite 6 supporte Node.js 18, 20, et 22+, comme Vite 5. Le support de Node.js 21 a été supprimé. Vite cesse le support de Node.js pour les versions plus anciennes après leur [EOL](https://endoflife.date/nodejs). Le EOL de Node.js 18 est le 30 avril 2025, après quoi nous pourrons publier une nouvelle version majeure pour augmenter la version de Node.js requise.

## API d'environnement expérimental

Vite est devenu plus flexible avec la nouvelle API d'environnement. Ces nouvelles APIs permettront aux auteurs de frameworks d'offrir une expérience de développement plus proche de la production et pour l'écosystème partager de nouveaux blocs de construction. Rien ne change si vous construisez une SPA ; lorsque vous utilisez Vite avec un seul environnement client, tout fonctionne comme avant. Et même pour les applications SSR personnalisées, Vite 6 est compatible avec les versions précédentes. Le public principal pour l'API d'environnement est l'auteur de framework.

Pour les utilisateurs finaux qui sont curieux, [Sapphi](https://github.com/sapphi-red) a écrit un guide [Introduction à l'API d'environnement](https://green.sapphi.red/blog/increasing-vites-potential-with-the-environment-api). C'est un excellent point de départ pour comprendre pourquoi nous essayons de rendre Vite encore plus flexible.

Si vous êtes un auteur de framework ou un mainteneur de plugin Vite et souhaitez tirer parti des nouvelles APIs, vous pouvez en savoir plus sur les [Guides API d'environnement](https://main.vite.dev/guide/api-environment).

Nous voulons remercier toutes les personnes impliquées dans la définition et l'implémentation des nouvelles APIs. L'histoire commence avec Vite 2 qui adopte le schéma de développement SSR non lié initié par [Rich Harris](https://github.com/Rich-Harris) et l'équipe [SvelteKit](https://svelte.dev/docs/kit). Le transformateur SSR de Vite a ensuite amené [Anthony Fu](https://github.com/antfu/) et [Pooya Parsa](https://github.com/pi0) pour créer vite-node et améliorer l'histoire de SSR de développement [Nuxt](https://antfu.me/posts/dev-ssr-on-nuxt). Anthony a utilisé vite-node pour alimenter [Vitest](https://vitest.dev), et [Vladimir Sheremet](https://github.com/sheremet-va) a continué à l'améliorer dans le cadre de son travail de maintenance de Vitest. Au début de 2023, Vladimir a commencé à travailler pour monter vite-node vers le noyau de Vite, et nous l'avons publié comme API de runtime dans Vite 5.1 un an plus tard. Les retours de l'écosystème (un grand merci à l'équipe de Cloudflare) nous ont poussé à faire un re-travail plus ambitieux des environnements de Vite. Vous pouvez en savoir plus sur l'histoire à la [conférence de ViteConf 24 de Patak](https://www.youtube.com/watch?v=WImor3HDyqU?si=EZ-rFJn4pDW3tUvp).

Chaque personne de l'équipe Vite a participé à la définition de la nouvelle API, qui a été co-conçue avec des retours  de nombreux projets de l'écosystème. Merci à toutes les personnes impliquées ! Nous vous encourgeons à participer si vous construisez un framework, un plugin ou un outil sur Vite. Les nouvelles APIs sont expérimentales. Nous travaillerons avec l'écosystème pour examiner comment les nouvelles APIs seront utilisées pour les stabiliser sur la prochaine version majeure. Si vous souhaitez poser des questions ou donner des retours, il y a un [discussion GitHub ouvert ici](https://github.com/vitejs/vite/discussions/16358).

## Changements principaux

- [Valeur par défaut pour `resolve.conditions`](/guide/migration#default-value-for-resolve-conditions)
- [JSON stringify](/guide/migration#json-stringify)
- [Support étendu des références d'assets dans les éléments HTML](/guide/migration#extended-support-of-asset-references-in-html-elements)
- [postcss-load-config](/guide/migration#postcss-load-config)
- [Sass utilise maintenant l'API moderne par défaut](/guide/migration#sass-now-uses-modern-api-by-default)
- [Personnalisation du nom de fichier de sortie CSS dans le mode bibliothèque](/guide/migration#customize-css-output-file-name-in-library-mode)
- [Et plus de changements qui ne devraient affecter qu'un petit nombre d'utilisateurs](/guide/migration#advanced)

Il y a également une nouvelle page [Changements cassants](/changes/) qui liste tous les changements planifiés, considérés et passés dans Vite.

## Migration vers Vite 6

Pour la plupart des projets, la mise à jour vers Vite 6 devrait être simple, mais nous vous conseillons de consulter le [guide de migration détaillé](/guide/migration) avant de mettre à jour.

La liste complète des changements est à la page [Changelog de Vite 6](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#500-2024-11-26).

## Remerciements

Vite 6 résulte de longues heures de travail par notre communauté de contributeurs, mainteneurs, auteurs de plugins, et l'équipe [Vite](/team). Nous apprécions les individus et les entreprises qui soutiennent le développement de Vite. Vite est porté par [VoidZero](https://voidzero.dev), en partenariat avec [StackBlitz](https://stackblitz.com/), [Nuxt Labs](https://nuxtlabs.com/), et [Astro](https://astro.build). Un grand merci aux sponsors sur [GitHub Sponsors de Vite](https://github.com/sponsors/vitejs) et [Open Collective de Vite](https://opencollective.com/vite).
