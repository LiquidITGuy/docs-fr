# Utilisation des plugins

Vite peut être étendu à l'aide de plugins, qui sont basés sur l'interface bien conçue des plugins Rollup avec quelques options supplémentaires spécifiques à Vite. Cela signifie que les utilisateurs de Vite peuvent s'appuyer sur l'écosystème mature des plugins Rollup, tout en étant capables d'étendre le serveur de développement et les fonctionnalités SSR selon leurs besoins.

## Ajouter un plugin

Pour utiliser un plugin, il doit être ajouté aux `devDependencies` du projet et inclus dans le tableau `plugins` du fichier de configuration `vite.config.js`. Par exemple, pour fournir la prise en charge des navigateurs obsolètes, le plugin officiel [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) peut être utilisé :

```
$ npm add -D @vitejs/plugin-legacy
```

```js twoslash [vite.config.js]
import legacy from '@vitejs/plugin-legacy'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
  ],
})
```

Le tableau `plugins` accepte également des préconfigurations comprenant plusieurs plugins en tant qu'élément unique. C'est utile pour les fonctionnalités complexes (comme l'intégration de frameworks) qui sont implémentées à l'aide de plusieurs plugins. Le tableau sera aplati de manière interne.

Les plugins avec une valeur falsy seront ignorés, ce qui permet d'activer ou de désactiver facilement des plugins.

## Trouver des plugins

:::tip REMARQUE
Vite vise à fournir une prise en charge native des modèles courants de développement web. Avant de rechercher un plugin Vite ou un plugin Rollup compatible, consultez le [Guide des fonctionnalités](../guide/features.md). De nombreux cas où un plugin serait nécessaire dans un projet Rollup sont déjà couverts dans Vite.
:::

Consultez la [section Plugins](../plugins/) pour obtenir des informations sur les plugins officiels. Les plugins communautaires sont répertoriés dans [awesome-vite](https://github.com/vitejs/awesome-vite#plugins).

Vous pouvez également trouver des plugins qui suivent les [conventions recommandées](./api-plugin.md#conventions) en utilisant une [recherche npm pour vite-plugin](https://www.npmjs.com/search?q=vite-plugin&ranking=popularity) pour les plugins Vite ou une [recherche npm pour rollup-plugin](https://www.npmjs.com/search?q=rollup-plugin&ranking=popularity) pour les plugins Rollup.

## Définir l'ordre des plugins

Pour la compatibilité avec certains plugins Rollup, il peut être nécessaire de forcer l'ordre du plugin ou de ne l'appliquer qu'au moment du build. Cela devrait être un détail d'implémentation pour les plugins Vite. Vous pouvez imposer la position d'un plugin avec le modificateur `enforce` :

- `pre` : exécuter le plugin avant les plugins principaux de Vite
- par défaut : exécuter le plugin après les plugins principaux de Vite
- `post` : exécuter le plugin après les plugins de construction de Vite

```js twoslash [vite.config.js]
import image from '@rollup/plugin-image'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    {
      ...image(),
      enforce: 'pre',
    },
  ],
})
```

Consultez le [Guide de l'API des plugins](./api-plugin.md#plugin-ordering) pour des informations détaillées.

## Application conditionnelle

Par défaut, les plugins sont invoqués à la fois pour le serveur et le build. Dans les cas où un plugin doit être appliqué conditionnellement uniquement pendant le serveur ou le build, utilisez la propriété `apply` pour ne les invoquer que pendant `'build'` ou `'serve'` :

```js twoslash [vite.config.js]
import typescript2 from 'rollup-plugin-typescript2'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    {
      ...typescript2(),
      apply: 'build',
    },
  ],
})
```

## Créer des plugins

Consultez le [Guide d'API des plugins](./api-plugin.md) pour la documentation sur la création de plugins.
