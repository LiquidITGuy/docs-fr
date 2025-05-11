---
title: Annonce de Vite 2.0
author:
  - name: L'équipe Vite
sidebar: false
date: 2021-02-16
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Annonce de Vite 2.0
  - - meta
    - property: og:url
      content: https://fr.vite.dev/blog/announcing-vite2
  - - meta
    - property: og:description
      content: Annonce de la sortie de Vite 2
---

# Announcing Vite 2.0

_16 Février, 2021_ - Voir l'annonce de [Vite 3.0](./announcing-vite3.md)

<p style="text-align:center">
  <img src="/logo.svg" style="height:200px">
</p>

Aujourd'hui, nous sommes heureux d'annoncer la sortie officielle de Vite 2.0 !

Vite (mot français pour "rapide", prononcé `/vit/`) est un nouvel outil de construction pour le développement web frontend. Pensez à un serveur de développement pré-configuré + combo de bundler, mais plus léger et plus rapide. Il exploite le support [native ES modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) du navigateur et des outils écrits dans des langages compilés en langage natif comme [esbuild](https://esbuild.github.io/) pour offrir une expérience de développement rapide et moderne.

Pour avoir une idée de la vitesse de Vite, consultez [cette vidéo de comparaison](https://twitter.com/amasad/status/1355379680275128321) de la mise en route d'une application React sur Repl.it en utilisant Vite par rappport à `create-react-app` (CRA).

Si vous n'avez jamais entendu parler de Vite avant et que vous souhaitez en savoir plus sur le projet, consultez [la raison derrière le projet](https://fr.vite.dev/guide/why.html). Si vous êtes intéressé par la différence entre Vite et d'autres outils similaires, consultez les [comparaisons](https://v5.vite.dev/guide/comparisons.html).

## Quoi de neuf dans 2.0

Puisque nous avons décidé de refactorer complètement les composants internes avant que 1.0 ne soit sortie de RC, c'est en fait la première version stable de Vite. Cela dit, Vite 2.0 apporte de nombreuses améliorations par rapport à la précédente version :

### Cœur totalement indépendant des frameworks

L'idée originale de Vite a commencé comme un [prototype bidon qui servait les composants de fichier unique Vue sur ESM natif](https://github.com/vuejs/vue-dev-server). Vite 1 était une continuation de cette idée avec HMR implémentée par-dessus.

Vite 2.0 prend ce que nous avons appris le long du chemin et est redéfini de zéro avec une architecture interne plus robuste. Il est maintenant complètement indépendant des frameworks, et tout le support des frameworks spécifiques est délégué aux plugins. Il existe maintenant des [templates officiels pour Vue, React, Preact, Lit Element](https://github.com/vitejs/vite/tree/main/packages/create-vite), et des efforts de la communauté en cours pour l'intégration de Svelte.

### Nouveau format de plugin et API

Insipiré par [WMR](https://github.com/preactjs/wmr), le nouveau système de plugin étend l'interface de plugin de Rollup et est [compatible avec de nombreux plugins Rollup](https://vite-rollup-plugins.patak.dev/) out of the box. Les plugins peuvent utiliser les hooks compatibles Rollup, avec des hooks supplémentaires Vite et des propriétés pour ajuster le comportement Vite uniquement (ex. différencier le développement du build ou le traitement personnalisé de HMR).

L'[API programmatique](https://fr.vite.dev/guide/api-javascript.html) a également été grandement améliorée pour faciliter les outils / frameworks de niveau supérieur construits sur Vite.

### esbuild Powered Dep Pre-Bundling

Vite est un serveur de développement ESM natif, il pré-bundle donc les dépendances pour réduire le nombre de requêtes de navigateur et gérer la conversion de CommonJS en ESM. Précédemment, Vite faisait cela en utilisant Rollup, et dans 2.0, il utilise maintenant `esbuild` qui donne un gain de vitesse de10-100x pour le pré-bundle des dépendances. En guise de référence, le démarrage froid d'une application de test avec des dépendances lourdes comme React Material UI prendait 28 secondes sur un MacBook Pro M1 et maintenant prend environ 1.5 secondes. Vous pouvez vous attendre à des améliorations similaires si vous changez d'un environnement de build basé sur un bundler traditionnel.

### Support natif des CSS

Vite traite le CSS comme une entité de premier ordre du graphe des modules et prend en charge les éléments suivants de manière native :

- **Amélioration de la résolution** : `@import` et `url()` dans le CSS sont renforcés avec la résolution de Vite pour respecter les alias et les dépendances npm.
- **Réécriture des URL** : `url()` sont automatiquement réécrites indépendamment de l'endroit où le fichier est importé.
- **CSS code splitting** : un chunk JS code-splité émet également un fichier CSS correspondant, qui est automatiquement chargé en parallèle avec le chunk JS lorsqu'il est demandé.

### Support SSR (Rendu côté serveur)

Vite 2.0 embarque [un support SSR expérimental](https://fr.vite.dev/guide/ssr.html). Vite fournit des API pour charger et mettre à jour le code source ESM basé sur Node.js pendant le développement (presque comme le HMR côté serveur), et automatiquement externalise les dépendances CommonJS compatibles pour améliorer la vitesse de développement et de build SSR. Le serveur de production peut être complètement découplé de Vite, et le même montage peut être facilement adapté pour effectuer un rendu préalable / SSG.

Le support SSR est fourni comme une fonctionnalité de bas niveau et nous attendons à voir des frameworks l'utiliser en arrière-plan.

### Support des navigateurs obsolètes

Vite cible les navigateurs modernes avec le support ESM natif par défaut, mais vous pouvez également choisir par défaut le support des navigateurs obsolètes via le plugin officiel [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy). Le plugin génère automatiquement des bundles modernes/hérités, et livre le bon bundle en fonction de la détection des fonctionnalités du navigateur, garantissant un code plus efficace dans les navigateurs modernes qui le supportent.

## Essayez-le !

Cela était beaucoup de fonctionnalités, mais le démarrage avec Vite est simple ! Vous pouvez lancer une application Vite en quelques secondes, en commençant par la commande suivante (assurez-vous que vous avez Node.js >=12) :

```bash
npm init @vitejs/app
```

Ensuite, consultez [le guide](https://fr.vite.dev/guide/) pour voir ce que Vite fournit par défaut. Vous pouvez également consulter le code source sur [GitHub](https://github.com/vitejs/vite), suivre les mises à jour sur [Twitter](https://twitter.com/vite_js), ou rejoindre les discussions avec d'autres utilisateurs de Vite sur notre [serveur de chat Discord](http://chat.vite.dev/).
