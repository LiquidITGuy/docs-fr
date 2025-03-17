# Options de build

Sauf indication contraire, les options de cette section ne s'appliquent qu'au buil.

## build.target

- **Type:** `string | string[]`
- **Default:** `'modules'`
- **Related:** [Compatibilité avec les navigateurs](/guide/build#browser-compatibility)

Cible de compatibilité avec les navigateurs pour le bundle final. La valeur par défaut est une valeur spéciale Vite, `'modules'`, qui cible les navigateurs avec les [Modules ES natifs](https://caniuse.com/es6-module), les [imports dynamiques ESM natifs](https://caniuse.com/es6-module-dynamic-import), et l'[`import.meta`](https://caniuse.com/mdn-javascript_operators_import_meta) support. Vite remplacera `'modules'` par `['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14']`

Une autre valeur spéciale est `'esnext'` - qui suppose un support natif pour les imports dynamiques et ne fera que des transpilations minimales.

La transformation est effectuée avec esbuild et la valeur doit être une option de cible valide [esbuild](https://esbuild.github.io/api/#target). Les cibles personnalisées peuvent être une version ES (e.g. `es2015`), un navigateur avec une version (e.g. `chrome58`), ou un tableau de chaînes de cible.

Noter que le build échouera si le code contient des fonctionnalités qui ne peuvent pas être transpilées de manière sûre avec esbuild. Voir [docs esbuild](https://esbuild.github.io/content-types/#javascript) pour plus de détails.

## build.modulePreload

- **Type:** `boolean | { polyfill?: boolean, resolveDependencies?: ResolveModulePreloadDependenciesFn }`
- **Default:** `{ polyfill: true }`

Par défaut, un [polyfill de préchargement de module](https://guybedford.com/es-module-preloading-integrity#modulepreload-polyfill) est injecté automatiquement. Le polyfill est injecté automatiquement dans le module proxy de chaque entrée `index.html`. Si le build est configuré pour utiliser une entrée personnalisée non-HTML via `build.rollupOptions.input`, il est nécessaire d'importer manuellement le polyfill dans votre entrée personnalisée :

```js
import 'vite/modulepreload-polyfill'
```

Note: le polyfill ne s'applique **pas** à [Mode Bibliothèque](/guide/build#library-mode). Si vous avez besoin de supporter les navigateurs sans importation dynamique native, vous devriez probablement l'éviter dans votre bibliothèque.

Le polyfill peut être désactivé en utilisant `{ polyfill: false }`.

La liste des chunks à précharger pour chaque importation dynamique est calculée par Vite. Par défaut, un chemin absolu incluant le `base` sera utilisé lors du chargement de ces dépendances. Si le `base` est relatif (`''` ou `'./'`), `import.meta.url` est utilisé à l'exécution pour éviter les chemins absolus qui dépendent de la base déployée finalement.

Il existe un support expérimental pour un contrôle plus fin de la liste des dépendances et de leurs chemins en utilisant la fonction `resolveDependencies`. [Faire un retour](https://github.com/vitejs/vite/discussions/13841). Il attend une fonction de type `ResolveModulePreloadDependenciesFn`:

```ts
type ResolveModulePreloadDependenciesFn = (
  url: string,
  deps: string[],
  context: {
    hostId: string
    hostType: 'html' | 'js'
  },
) => string[]
```

La fonction `resolveDependencies` sera appelée pour chaque importation dynamique avec une liste des chunks dont elle dépend, et elle sera également appelée pour chaque chunk importé dans les fichiers HTML d'entrée. Un nouveau tableau de dépendances peut être retourné avec ces dépendances filtrées ou plus de dépendances injectées, et leurs chemins modifiés. Les chemins `deps` sont relatifs à `build.outDir`. La valeur retournée doit être un chemin relatif à `build.outDir`.

```js twoslash
/** @type {import('vite').UserConfig} */
const config = {
  // prettier-ignore
  build: {
// ---cut-before---
modulePreload: {
  resolveDependencies: (filename, deps, { hostId, hostType }) => {
    return deps.filter(condition)
  },
},
// ---cut-after---
  },
}
```

Les chemins des dépendances résolus peuvent être modifiés davantage en utilisant [`experimental.renderBuiltUrl`](../guide/build.md#advanced-base-options).

## build.polyfillModulePreload

- **Type:** `boolean`
- **Default:** `true`
- **Déprécié** utilisez `build.modulePreload.polyfill` à la place

Détermine si un [polyfill de préchargement de module](https://guybedford.com/es-module-preloading-integrity#modulepreload-polyfill) doit être injecté automatiquement.

## build.outDir

- **Type:** `string`
- **Default:** `dist`

Spécifie le répertoire de sortie (relatif au [projet racine](/guide/#index-html-and-project-root)).

## build.assetsDir

- **Type:** `string`
- **Default:** `assets`

Spécifie le répertoire à imbriquer sous les assets générés (relatif à `build.outDir`. Cette option n'est pas utilisée dans [Mode Bibliothèque](/guide/build#mode-bibliothèque)).

## build.assetsInlineLimit

- **Type:** `number` | `((filePath: string, content: Buffer) => boolean | undefined)`
- **Default:** `4096` (4 KiB)

Les assets importés ou référencés qui sont plus petits que ce seuil seront inlinés en tant que URL base64 pour éviter des requêtes HTTP supplémentaires. Définissez sur `0` pour désactiver l'inlining complètement.

Si une fonction est passée, un booléen peut être retourné pour opt-in ou opt-out. Si rien n'est retourné, la logique par défaut s'applique.

Les placeholders Git LFS sont automatiquement exclus de l'inlining car ils ne contiennent pas le contenu du fichier qu'ils représentent.

::: tip Note
Si vous spécifiez `build.lib`, `build.assetsInlineLimit` sera ignoré et les assets seront toujours inlinés, quelle que soit la taille du fichier ou le fait qu'ils soient un placeholder Git LFS.
:::

## build.cssCodeSplit

- **Type:** `boolean`
- **Default:** `true`

Active/désactive le fractionnement CSS. Lorsque c'est activé, les CSS importés dans les chunks JS asynchrones seront conservés comme chunks et récupérés ensemble lorsque le chunk est récupéré.

Si désactivé, tous les CSS dans le projet entier seront extraits dans un seul fichier CSS.

::: tip Note
Si vous spécifiez `build.lib`, `build.cssCodeSplit` sera `false` par défaut.
:::

## build.cssTarget

- **Type:** `string | string[]`
- **Default:** the same as [`build.target`](#build-target)

Cette option permet aux utilisateurs de définir une cible de navigateur différente pour la minification CSS par rapport à celle utilisée pour la transposition JavaScript.

Elle ne doit être utilisée que lorsque vous ciblez un navigateur non-principal.
Un exemple est le WebView Android WeChat, qui supporte la plupart des fonctionnalités JavaScript modernes mais pas la [notation hexadécimale `#RGBA` pour les couleurs CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#rgb_colors).
Dans ce cas, vous devez définir `build.cssTarget` à `chrome61` pour empêcher vite de transformer les couleurs `rgba()` en notation hexadécimale `#RGBA`.

## build.cssMinify

- **Type:** `boolean | 'esbuild' | 'lightningcss'`
- **Default:** the same as [`build.minify`](#build-minify) for client, `'esbuild'` for SSR

Cette option permet aux utilisateurs de remplacer la minification CSS spécifiquement au lieu de définir `build.minify`, de sorte que vous pouvez configurer la minification pour JS et CSS séparément. Vite utilise `esbuild` par défaut pour minifier CSS. Définissez l'option sur `'lightningcss'` pour utiliser [Lightning CSS](https://lightningcss.dev/minification.html) à la place. Si sélectionné, il peut être configuré en utilisant [`css.lightningcss`](./shared-options.md#css-lightningcss).

## build.sourcemap

- **Type:** `boolean | 'inline' | 'hidden'`
- **Default:** `false`

Génère des sourcemap de production. Si `true`, un fichier de sourcemap distinct sera créé. Si `'inline'`, la sourcemap sera ajoutée au fichier de sortie final en tant que URI de données. `'hidden'` fonctionne comme `true` sauf que les commentaires de sourcemap correspondants dans les fichiers liés sont supprimés.

## build.rollupOptions

- **Type:** [`RollupOptions`](https://rollupjs.org/configuration-options/)

Personnalise directement le bundle Rollup sous-jacent. C'est la même chose que les options qui peuvent être exportées d'un fichier de configuration Rollup et seront fusionnées avec les options Rollup internes de Vite. Voir [docs Rollup options](https://rollupjs.org/configuration-options/) pour plus de détails.

## build.commonjsOptions

- **Type:** [`RollupCommonJSOptions`](https://github.com/rollup/plugins/tree/master/packages/commonjs#options)

Options à passer à [@rollup/plugin-commonjs](https://github.com/rollup/plugins/tree/master/packages/commonjs).

## build.dynamicImportVarsOptions

- **Type:** [`RollupDynamicImportVarsOptions`](https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#options)
- **Related:** [Dynamic Import](/guide/features#dynamic-import)

Options à passer à [@rollup/plugin-dynamic-import-vars](https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars).

## build.lib

- **Type:** `{ entry: string | string[] | { [entryAlias: string]: string }, name?: string, formats?: ('es' | 'cjs' | 'umd' | 'iife')[], fileName?: string | ((format: ModuleFormat, entryName: string) => string), cssFileName?: string }`
- **Related:** [Library Mode](/guide/build#library-mode)

Construit comme une bibliothèque. `entry` est requis puisque la bibliothèque ne peut pas utiliser HTML comme entrée. `name` est la variable globale exposée et est requise lorsque `formats` inclut `'umd'` ou `'iife'`. Les `formats` par défaut sont `['es', 'umd']`, ou `['es', 'cjs']`, si plusieurs entrées sont utilisées.

`fileName` est le nom du fichier de sortie de la bibliothèque, qui par défaut est le `"name"` dans `package.json`. Il peut également être défini comme une fonction prenant le `format` et `entryName` comme arguments, et retournant le nom du fichier.

Si votre package importe des CSS, `cssFileName` peut être utilisé pour spécifier le nom du fichier CSS de sortie. Il a par défaut la même valeur que `fileName` si c'est une chaîne, sinon il reprend `"name"` dans `package.json`.

```js twoslash [vite.config.js]
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: ['src/main.js'],
      fileName: (format, entryName) => `my-lib-${entryName}.${format}.js`,
      cssFileName: 'my-lib-style',
    },
  },
})
```

## build.manifest

- **Type:** `boolean | string`
- **Default:** `false`
- **Related:** [Backend Integration](/guide/backend-integration)

Détermine si on génére un fichier manifeste qui contient une table de correspondance des noms de fichiers des assets (non hachés) vers leurs versions hachées, ce qui peut ensuite être utilisé par un framework de serveur pour rendre les liens corrects des assets.

Lorsque la valeur est une chaîne, elle sera utilisée comme chemin vers le fichier manifeste par rapport à `build.outDir`. Lorsque défini sur `true`, le chemin sera `.vite/manifest.json`.

## build.ssrManifest

- **Type:** `boolean | string`
- **Default:** `false`
- **Related:** [Server-Side Rendering](/guide/ssr)

Détermine si un manifeste SSR pour définir les liens de style et les directives de préchargement des assets en production.

Lorsque la valeur est une chaîne, elle sera utilisée comme chemin vers le fichier manifeste par rapport à `build.outDir`. Lorsque défini sur `true`, le chemin sera `.vite/ssr-manifest.json`.

## build.ssr

- **Type:** `boolean | string`
- **Default:** `false`
- **Related:** [Server-Side Rendering](/guide/ssr)

Produit un build orienté SSR. La valeur peut être une chaîne pour spécifier directement l'entrée SSR, ou `true`, qui nécessite de spécifier l'entrée SSR via `rollupOptions.input`.

## build.emitAssets

- **Type:** `boolean`
- **Default:** `false`

Lors de la construction non-client, les assets statiques ne sont pas émis car il est supposé qu'ils seraient émis comme partie du build client. Cette option permet aux frameworks de forcer leur émission dans d'autres environnements de construction. Il est de la responsabilité du framework de fusionner les assets avec une étape de post-construction.

## build.ssrEmitAssets

- **Type:** `boolean`
- **Default:** `false`

Lors de la construction SSR, les assets statiques ne sont pas émis car il est supposé qu'ils seraient émis comme partie du build client. Cette option permet aux frameworks de forcer leur émission dans les builds client et SSR. Il est de la responsabilité du framework de fusionner les assets avec une étape de post-construction. Cette option sera remplacée par `build.emitAssets` une fois que l'API Environment sera stable.

## build.minify

- **Type:** `boolean | 'terser' | 'esbuild'`
- **Default:** `'esbuild'` for client build, `false` for SSR build

Définissez sur `false` pour désactiver la minification, ou spécifiez le minificateur à utiliser. La valeur par défaut est [esbuild](https://github.com/evanw/esbuild) qui est 20 ~ 40x plus rapide que terser et seulement 1 ~ 2% moins compressé. [Benchmarks](https://github.com/privatenumber/minification-benchmarks)

Notez que l'option `build.minify` ne minifie pas les espaces blancs lors de l'utilisation du format `'es'` dans le mode bibliothèque, car il supprime les annotations pures et casse le tree-shaking.

Terser doit être installé lorsque c'est défini sur `'terser'`.

```sh
npm add -D terser
```

## build.terserOptions

- **Type:** `TerserOptions`

Options supplémentaires [minify options](https://terser.org/docs/api-reference#minify-options) à passer à Terser.

Vous pouvez également passer une option `maxWorkers: number` pour spécifier le nombre maximum de workers à lancer. Par défaut, le nombre de CPU moins 1.

## build.write

- **Type:** `boolean`
- **Default:** `true`

Définissez sur `false` pour désactiver l'écriture du bundle sur le disque. Cette option est principalement utilisée dans les [appels programmatiques `build()`](/guide/api-javascript#build) où une post-traitement supplémentaire du bundle est nécessaire avant l'écriture sur le disque.

## build.emptyOutDir

- **Type:** `boolean`
- **Default:** `true` if `outDir` is inside `root`

Par défaut, Vite videra le `outDir` lors de la construction si c'est à l'intérieur du projet racine. Il émettra un avertissement si `outDir` est en dehors de la racine pour éviter de supprimer accidentellement des fichiers importants. Vous pouvez explicitement définir cette option pour supprimer l'avertissement. Cette option est également disponible via la ligne de commande avec `--emptyOutDir`.

## build.copyPublicDir

- **Type:** `boolean`
- **Default:** `true`

Par défaut, Vite copiera les fichiers du `publicDir` dans le `outDir` lors de la construction. Définissez sur `false` pour désactiver cela.

## build.reportCompressedSize

- **Type:** `boolean`
- **Default:** `true`

Active/désactive le rapport de taille compressée gzip. Compresser les gros fichiers de sortie peut être lent, donc désactiver cela peut augmenter les performances de build pour les gros projets.

## build.chunkSizeWarningLimit

- **Type:** `number`
- **Default:** `500`

Limite pour les avertissements de taille de chunk (en kB). Il est comparé à la taille du chunk non compressé car la [taille du JavaScript elle-même est liée au temps d'exécution](https://v8.dev/blog/cost-of-javascript-2019).

## build.watch

- **Type:** [`WatcherOptions`](https://rollupjs.org/configuration-options/#watch)`| null`
- **Default:** `null`

Définissez sur `{}` pour activer le watcher Rollup. Cette option est principalement utilisée dans les cas impliquant des plugins ou des processus de build uniquement.

::: warning Utilisation de Vite sur Windows Subsystem pour Linux (WSL) 2

Il existe des cas où le système de fichier ne fonctionne pas avec WSL2.
Voir [`server.watch`](./server-options.md#server-watch) pour plus de détails.

:::
