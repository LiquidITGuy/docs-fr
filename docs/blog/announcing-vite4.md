---
title: Vite 4.0 est sorti !
author:
  name: L'équipe Vite
date: 2022-12-09
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Annonce de Vite 4
  - - meta
    - property: og:image
      content: https://vite.dev/og-image-announcing-vite4.png
  - - meta
    - property: og:url
      content: https://vite.dev/blog/announcing-vite4
  - - meta
    - property: og:description
      content: Annonce de la sortie de Vite 4
  - - meta
    - name: twitter:card
      content: summary_large_image
---

# Vite 4.0 est sorti !

_9 décembre 2022_ - Voir l'annonce de la [sortie de Vite 5.0](./announcing-vite5.md)

Vite 3 [a été publié](./announcing-vite3.md) il y a cinq mois. Les téléchargements de npm par semaine sont passés de 1 million à 2,5 millions depuis. L'écosystème a également évolué, et continue de grandir. Dans le [sondage de Jamstack Conf](https://twitter.com/vite_js/status/1589665610119585793), l'utilisation par la communauté a grimpé de 14% à 32% tout en maintenant une note de satisfaction de 9,7. Nous avons vu les versions stables de [Astro 1.0](https://astro.build/), [Nuxt 3](https://v3.nuxtjs.org/), et d'autres frameworks Vite-alimentés qui innovent et collaborent : [SvelteKit](https://kit.svelte.dev/), [Solid Start](https://www.solidjs.com/blog/introducing-solidstart), [Qwik City](https://qwik.builder.io/qwikcity/overview/). Storybook a annoncé le support officiel de Vite comme une de ses fonctionnalités principales pour [Storybook 7.0](https://storybook.js.org/blog/first-class-vite-support-in-storybook/). Deno [supporte maintenant Vite](https://www.youtube.com/watch?v=Zjojo9wdvmY). L'adoption de [Vitest](https://vitest.dev) explose, elle représentera bientôt la moitié des téléchargements de Vite sur npm. Nx investit également dans l'écosystème, et [officiellement supporte Vite](https://nx.dev/packages/vite).

[![Écosystème Vite 4](/ecosystem-vite4.png)](https://viteconf.org/2022/replay)

Pour illustrer la croissance que Vite et les projets associés ont expérimentée, l'écosystème Vite s'est réuni le 11 octobre à la [ViteConf 2022](https://viteconf.org/2022/replay). Nous avons vu des représentants des principaux frameworks web et outils raconter des histoires d'innovation et de collaboration. Et dans un mouvement symbolique, l'équipe de Rollup a choisi exactement ce jour pour publier [Rollup 3](https://rollupjs.org).

Aujourd'hui, l'équipe Vite, avec l'aide de nos partenaires de l'écosystème, est heureuse d'annoncer la sortie de Vite 4, alimentée par Rollup 3 lors du build. Nous avons travaillé avec l'écosystème pour assurer une mise à niveau fluide pour cette nouvelle version majeure. Vite utilise maintenant [Rollup 3](https://github.com/vitejs/vite/issues/9870), ce qui nous a permis de simplifier le traitement des assets de Vite et a apporté de nombreuses améliorations. Voir les notes de la [sortie de Rollup 3 ici](https://github.com/rollup/rollup/releases/tag/v3.0.0).

![Image de couverture de l'annonce de Vite 4](/og-image-announcing-vite4.png)

Liens rapides :

- [Docs](/)
- [Guide de migration](https://v4.vite.dev/guide/migration.html)
- [Changelog](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#400-2022-12-09)

Docs dans d'autres langues :

- [简体中文](https://cn.vite.dev/)
- [日本語](https://ja.vite.dev/)
- [Español](https://es.vite.dev/)

Si vous avez commencé à utiliser Vite récemment, nous vous suggérons de lire le [Guide pourquoi Vite](https://vite.dev/guide/why.html) et de consulter le [guide de démarrage](https://vite.dev/guide/) et le [guide des fonctionnalités](https://vite.dev/guide/features). Si vous souhaitez participer, les contributions sont les bienvenues sur [GitHub](https://github.com/vitejs/vite). Environ [700 contributeurs](https://github.com/vitejs/vite/graphs/contributors) ont contribué à Vite. Suivez les mises à jour sur [Twitter](https://twitter.com/vite_js) et [Mastodon](https://webtoo.ls/@vite), ou rejoignez la communauté pour collaborer avec d'autres sur notre [communauté Discord](http://chat.vite.dev/).

## Débuter avec Vite 4

Utilisez `pnpm create vite` pour créer un projet Vite avec votre framework préféré, ou ouvrez un modèle de démarrage en ligne pour jouer avec Vite 4 en utilisant [vite.new](https://vite.new).

Vous pouvez également exécuter `pnpm create vite-extra` pour accéder aux modèles de démarrage de d'autres frameworks et runtimes (Solid, Deno, SSR, et modèles de bibliothèque). Les modèles `create vite-extra` sont également disponibles lorsque vous exécutez `create vite` sous l'option `Others`.

Notez que les modèles de démarrage Vite sont conçus pour être utilisés comme un terrain de jeu pour tester Vite avec différents frameworks. Lorsque vous construisez votre prochain projet, nous vous recommandons de choisir les modèles de démarrage recommandés par chaque framework. Certains frameworks redirigent maintenant dans `create vite` vers leurs modèles (`create-vue` et `Nuxt 3` pour Vue, et `SvelteKit` pour Svelte).

## Nouveau plugin React utilisant SWC lors du développement

[SWC](https://swc.rs/) est maintenant un remplaçant mature pour [Babel](https://babeljs.io/), surtout dans le contexte des projets React. L'implémentation de Fast Refresh de SWC est beaucoup plus rapide que Babel, et pour certains projets, il est maintenant une meilleure alternative. Dans Vite 4, deux plugins sont disponibles pour les projets React avec différents compromis. Nous croyons que les deux approches sont devenues nécessaires à ce stade, et nous continuerons à explorer les améliorations de ces deux plugins dans le futur.

### @vitejs/plugin-react

[@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react) est un plugin qui utilise esbuild et Babel, atteignant un HMR rapide avec un faible encombrement de package et la flexibilité de pouvoir utiliser le pipeline de transformation de Babel.

### @vitejs/plugin-react-swc (nouveau)

[@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) est un nouveau plugin qui utilise esbuild lors du build, mais remplace Babel par SWC lors du développement. Pour les gros projets qui n'ont pas besoin d'extensions React non standard, le démarrage froid et le remplacement de modules (HMR) peuvent être significativement plus rapides.

## Compatibilité avec les navigateurs

Le build pour les navigateurs modernes cible maintenant `safari14` par défaut pour une compatibilité ES2020 plus large. Cela signifie que les builds modernes peuvent maintenant utiliser [`BigInt`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) et que l'opérateur [nullish coalescing](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing) n'est plus transpilé. Si vous avez besoin de supporter des navigateurs plus anciens, vous pouvez ajouter [`@vitejs/plugin-legacy`](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) comme d'habitude.

## Importation de CSS en tant que chaîne

Dans Vite 3, l'importation de l'exportation par défaut d'un fichier `.css` pouvait introduire un double chargement de CSS.

```ts
import cssString from './global.css'
```

Cela pouvait survenir car un fichier `.css` était émis et il était probable que la chaîne CSS était également utilisée par le code de l'application — par exemple, injectée par le runtime du framework. Depuis Vite 4, l'exportation par défaut d'un fichier `.css` [a été dépréciée](https://github.com/vitejs/vite/issues/11094). Le suffixe de requête `?inline` doit être utilisé dans ce cas, car cela ne génère pas les styles importés `.css`.

```ts
import stuff from './global.css?inline'
```

En savoir plus dans le [Guide de migration](https://v4.vite.dev/guide/migration.html).

## Variables d'environnement

Vite utilise maintenant `dotenv` 16 et `dotenv-expand` 9 (précédemment `dotenv` 14 et `dotenv-expand` 5). Si vous avez une valeur incluant `#` ou `` ` ``, vous devrez l'entourer de guillemets.

```diff
-VITE_APP=ab#cd`ef
+VITE_APP="ab#cd`ef"
```

Pour plus de détails, voir le [changelog de `dotenv`](https://github.com/motdotla/dotenv/blob/master/CHANGELOG.md) et le [changelog de `dotenv-expand`](https://github.com/motdotla/dotenv-expand/blob/master/CHANGELOG.md).

## Autres fonctionnalités

- Raccourcis de CLI (appuyez sur `h` pendant le développement pour voir tous les raccourcis) ([#11228](https://github.com/vitejs/vite/pull/11228))
- Support pour `patch-package` lors du pré-bundling des dépendances ([#10286](https://github.com/vitejs/vite/issues/10286))
- Logs de build plus propre ([#10895](https://github.com/vitejs/vite/issues/10895)) et switch vers `kB` pour aligner avec les outils de développement du navigateur ([#10982](https://github.com/vitejs/vite/issues/10982))
- Messages d'erreur améliorés lors du SSR ([#11156](https://github.com/vitejs/vite/issues/11156))

## Taille du package réduite

Vite s'occupe de sa taille, pour accélérer l'installation, surtout dans le cas de terrains de jeu pour la documentation et la reproduction. Encore une fois, cette majeure apporte des améliorations dans la taille du package de Vite. La taille de l'installation de Vite 4 est 23% plus petite par rapport à vite 3.2.5 (14.1 MB vs 18.3 MB).

## Améliorations de Vite Core

[Vite Core](https://github.com/vitejs/vite) et [vite-ecosystem-ci](https://github.com/vitejs/vite-ecosystem-ci) continuent d'évoluer pour fournir une meilleure expérience aux mainteneurs et aux collaborateurs et pour garantir que le développement de Vite s'adapte à la croissance de l'écosystème.

### Plugins de framework hors core

[`@vitejs/plugin-vue`](https://github.com/vitejs/vite-plugin-vue) et [`@vitejs/plugin-react`](https://github.com/vitejs/vite-plugin-react) sont des plugins de base de Vite depuis les premières versions de Vite. Cela nous a permis de maintenir une boucle de feedback étroite lorsque nous faisions des changements, car nous obtenions à la fois le noyau et les plugins testés et publiés ensemble. Avec [vite-ecosystem-ci](https://github.com/vitejs/vite-ecosystem-ci), nous pouvons obtenir ce feedback avec ces plugins développés sur des dépôts indépendants, donc depuis Vite 4, [ils ont été déplacés hors du monorepo de Vite core](https://github.com/vitejs/vite/pull/11158). Cela est significatif pour l'histoire de Vite sans framework, et permettra de construire des équipes indépendantes pour maintenir chaque plugin. Si vous avez des bugs à signaler ou des fonctionnalités à demander, veuillez créer des tickets sur les nouveaux dépôts : [`vitejs/vite-plugin-vue`](https://github.com/vitejs/vite-plugin-vue) et [`vitejs/vite-plugin-react`](https://github.com/vitejs/vite-plugin-react).

### Améliorations de vite-ecosystem-ci

[vite-ecosystem-ci](https://github.com/vitejs/vite-ecosystem-ci) étend la CI de Vite en fournissant des rapports de statut sur-demande sur l'état des CIs de [la plupart des principaux projets en aval](https://github.com/vitejs/vite-ecosystem-ci/tree/main/tests). Nous exécutons vite-ecosystem-ci trois fois par semaine contre le main de Vite et recevons des rapports ponctuels avant d'introduire une régression. Vite 4 sera compatible avec la plupart des projets utilisant Vite, qui ont déjà préparé les branches avec les modifications nécessaires et publieront des versions compatibles dans les jours à venir. Nous sommes également en mesure d'exécuter vite-ecosystem-ci sur-demande sur les PRs en utilisant `/ecosystem-ci run` dans un commentaire, ce qui nous permet de connaître [l'effet des changements](https://github.com/vitejs/vite/pull/11269#issuecomment-1343365064) avant qu'ils soient mergés dans le main.

## Remerciements

Vite 4 ne serait pas possible sans un nombre d'heure de travail incalculable par les contributeurs de Vite, beaucoup d'entre eux étant mainteneurs de projets en aval et de plugins, et les efforts du [Vite Team](/team). Nous avons travaillé ensemble pour améliorer le DX de Vite une fois de plus, pour chaque framework et app utilisant Vite. Nous sommes reconnaissants d'être en mesure d'améliorer une base commune pour un tel écosystème.

Nous sommes également reconnaissants aux individus et entreprises qui soutiennent l'équipe Vite, et les entreprises qui investissent directement dans le futur de Vite : le travail de [@antfu7](https://twitter.com/antfu7) sur Vite et l'écosystème est une partie de son travail à [Nuxt Labs](https://nuxtlabs.com/), [Astro](https://astro.build) finance le travail de [@bluwyoo](https://twitter.com/bluwyoo) sur le noyau de Vite, et [StackBlitz](https://stackblitz.com/) emploie [@patak_dev](https://twitter.com/patak_dev) pour travailler à plein temps sur Vite.

## Prochaines étapes

Notre focus immédiat est de trier les nouveaux bugs ouverts pour éviter les régressions. Si vous souhaitez participer et nous aider à améliorer Vite, nous vous suggérons de commencer par le triage des bugs. Rejoignez [notre Discord](https://chat.vite.dev) et atteignez-nous sur le canal `#contributing`. Améliorez notre `#docs` et `#help`pour aider les autres. Nous devons continuer à construire une communauté utile et accueillante pour la prochaine vague d'utilisateurs, car l'adoption de Vite continue de croître.

Il y a beaucoup de fronts à améliorer pour améliorer le DX de tout ceux qui ont choisi Vite pour alimenter leurs frameworks et développer leurs apps. En avant!
