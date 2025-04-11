# Pourquoi Vite

## Les problèmes

Avant que les modules ES ne soient disponibles dans les navigateurs, les développeurs n'avaient aucun mécanisme natif pour écrire du JavaScript de manière modulaire. C'est pourquoi nous sommes tous familiers avec le concept de "bundling" : l'utilisation d'outils qui parcourent, traitent et concatènent nos modules source en fichiers pouvant s'exécuter dans le navigateur.

Au fil du temps, nous avons vu apparaître des outils comme [webpack](https://webpack.js.org/), [Rollup](https://rollupjs.org) et [Parcel](https://parceljs.org/), qui ont considérablement amélioré l'expérience de développement pour les développeurs frontend.

Cependant, à mesure que nous construisons des applications de plus en plus ambitieuses, la quantité de JavaScript à traiter augmente également de façon spectaculaire. Il n'est pas rare que des projets à grande échelle contiennent des milliers de modules. Nous commençons à atteindre un goulet d'étranglement de performance pour les outils basés sur JavaScript : il peut souvent falloir un temps d'attente déraisonnablement long (parfois jusqu'à plusieurs minutes !) pour démarrer un serveur de développement, et même avec le remplacement de module à chaud (HMR), les modifications de fichiers peuvent prendre quelques secondes avant d'être répercutées dans le navigateur. Cette boucle de retour lente peut grandement affecter la productivité et la satisfaction des développeurs.

Vite vise à résoudre ces problèmes en tirant parti des nouvelles avancées dans l'écosystème : la disponibilité des modules ES natifs dans le navigateur et l'essor des outils JavaScript écrits dans des langages compilés en code natif.

### Démarrage lent du serveur

Lors du démarrage à froid du serveur de développement, une configuration de build basée sur un bundler doit parcourir et construire toute votre application avant qu'elle ne puisse être servie.

Vite améliore le temps de démarrage du serveur de développement en divisant d'abord les modules d'une application en deux catégories : **dépendances** et **code source**.

- Les **dépendances** sont principalement du JavaScript simple qui ne change pas souvent pendant le développement. Certaines dépendances volumineuses (par exemple, des bibliothèques de composants avec des centaines de modules) sont également assez coûteuses à traiter. Les dépendances peuvent également être livrées dans différents formats de modules (par exemple, ESM ou CommonJS).

  Vite [pré-bundle les dépendances](./dep-pre-bundling.md) en utilisant [esbuild](https://esbuild.github.io/). esbuild est écrit en Go et pré-bundle les dépendances 10 à 100 fois plus rapidement que les bundlers basés sur JavaScript.

- Le **code source** contient souvent du JavaScript non standard qui nécessite une transformation (par exemple, JSX, CSS ou composants Vue/Svelte), et sera modifié très fréquemment. De plus, tout le code source n'a pas besoin d'être chargé en même temps (par exemple, avec la séparation du code basée sur les routes).

  Vite sert le code source via [ESM natif](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules). C'est essentiellement pour laisser le navigateur prendre en charge une partie du travail d'un bundler : Vite n'a besoin de transformer et de servir le code source qu'à la demande, lorsque le navigateur le demande. Le code derrière les importations dynamiques conditionnelles n'est traité que s'il est effectivement utilisé sur l'écran actuel.

<script setup>
import bundlerSvg from '../images/bundler.svg?raw'
import esmSvg from '../images/esm.svg?raw'
</script>
<svg-image :svg="bundlerSvg" />
<svg-image :svg="esmSvg" />

### Mises à jour lentes

Lorsqu'un fichier est modifié dans une configuration de build basée sur un bundler, il est inefficace de reconstruire l'ensemble du bundle pour une raison évidente : la vitesse de mise à jour se dégrade linéairement avec la taille de l'application.

Dans certains bundlers, le serveur de développement exécute le bundling en mémoire afin de n'avoir à invalider qu'une partie de son graphe de modules lorsqu'un fichier change, mais il doit toujours reconstruire l'ensemble du bundle et recharger la page web. La reconstruction du bundle peut être coûteuse, et le rechargement de la page fait disparaître l'état actuel de l'application. C'est pourquoi certains bundlers prennent en charge le remplacement de module à chaud (HMR) : permettant à un module de se "remplacer à chaud" sans affecter le reste de la page. Cela améliore considérablement l'expérience de développement - cependant, en pratique, nous avons constaté que même la vitesse de mise à jour HMR se détériore significativement à mesure que la taille de l'application augmente.

Dans Vite, le HMR est effectué via ESM natif. Lorsqu'un fichier est modifié, Vite n'a besoin d'invalider avec précision que la chaîne entre le module modifié et sa limite HMR la plus proche (la plupart du temps, uniquement le module lui-même), rendant les mises à jour HMR constamment rapides quelle que soit la taille de votre application.

Vite exploite également les en-têtes HTTP pour accélérer les rechargements complets de pages (là encore, laissons le navigateur faire plus de travail pour nous) : les requêtes de modules de code source sont conditionnelles via `304 Not Modified`, et les requêtes de modules de dépendances sont fortement mises en cache via `Cache-Control: max-age=31536000,immutable` afin qu'elles ne touchent plus le serveur une fois mises en cache.

Une fois que vous aurez expérimenté la rapidité de Vite, nous doutons fortement que vous acceptiez de revenir au développement avec bundling.

## Pourquoi Bundler pour la production

Même si l'ESM natif est maintenant largement pris en charge, la livraison d'ESM non regroupé en production reste inefficace (même avec HTTP/2) en raison des allers-retours réseau supplémentaires causés par les importations imbriquées. Pour obtenir des performances de chargement optimales en production, il est toujours préférable de regrouper votre code avec l'élimination de code mort (tree-shaking), le lazy loading et le chunk splitting (pour un meilleur cache).

Assurer une sortie optimale et une cohérence comportementale entre le serveur de développement et le build de production n'est pas facile. C'est pourquoi Vite est livré avec une [commande de build](./build.md) préconfigurée qui intègre de nombreuses [optimisations de performance](./features.md#build-optimizations) dès le départ.

## Pourquoi ne pas regrouper avec esbuild ?

Bien que Vite utilise esbuild pour [préregrouper certaines dépendances en développement](./dep-pre-bundling.md), Vite n'utilise pas esbuild comme bundler pour les builds de production.

L'API de plugin actuelle de Vite n'est pas compatible avec l'utilisation d'`esbuild` comme bundler. Malgré la rapidité d'`esbuild`, l'adoption par Vite de l'API de plugin flexible et de l'infrastructure de Rollup a fortement contribué à son succès dans l'écosystème. Pour le moment, nous croyons que Rollup offre un meilleur compromis performance-flexibilité.

Rollup a également travaillé sur des améliorations de performances, [passant son parseur à SWC dans la v4](https://github.com/rollup/rollup/pull/5073). Et il y a un effort en cours pour construire une version Rust de Rollup appelée Rolldown. Une fois Rolldown prêt, il pourrait remplacer à la fois Rollup et esbuild dans Vite, améliorant significativement les performances de build et éliminant les incohérences entre le développement et le build. Vous pouvez regarder [le discours d'Evan You à la ViteConf 2023 pour plus de détails](https://youtu.be/hrdwQHoAp0M).

## Comment Vite se rapporte-t-il aux autres outils de build sans bundle ?

[WMR](https://github.com/preactjs/wmr) de l'équipe Preact visait à offrir un ensemble de fonctionnalités similaires. L'API de plugin Rollup universelle de Vite pour le développement et le build a été inspirée par celle-ci. WMR n'est plus maintenu. L'équipe Preact recommande maintenant Vite avec [@preactjs/preset-vite](https://github.com/preactjs/preset-vite).

[Snowpack](https://www.snowpack.dev/) était également un serveur de développement ESM natif sans bundle, très similaire à Vite dans ses fonctionnalités. Le préregroupement des dépendances de Vite est également inspiré de Snowpack v1 (maintenant [`esinstall`](https://github.com/snowpackjs/snowpack/tree/main/esinstall)). Snowpack n'est plus maintenu. L'équipe Snowpack travaille maintenant sur [Astro](https://astro.build/), un constructeur de site statique alimenté par Vite.

[@web/dev-server](https://modern-web.dev/docs/dev-server/overview/) (anciennement `es-dev-server`) est un excellent projet et la configuration du serveur basé sur Koa de Vite 1.0 a été inspirée par celui-ci. Le projet parapluie `@web` est activement maintenu et contient de nombreux autres excellents outils qui peuvent également bénéficier aux utilisateurs de Vite.
