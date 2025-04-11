# Options partagées

Sauf mention contraire, les options de cette section s'appliquent à tous les dev, build et preview.

## root

- **Type:** `string`
- **Default:** `process.cwd()`

Répertoire racine du projet (où `index.html` est situé). Peut être un chemin absolu, ou un chemin relatif au répertoire de travail actuel.

Voir [Racine du projet](/guide/#index-html-and-project-root) pour plus de détails.

## base

- **Type:** `string`
- **Default:** `/`
- **Related:** [`server.origin`](/config/server-options.md#server-origin)

Chemin public de base lorsque le serveur est mode de développement ou de production. Les valeurs valides incluent :

- Chemin URL absolu, e.g. `/foo/`
- URL complète, e.g. `https://bar.com/foo/` (La partie origin ne sera pas utilisée dans le développement, donc la valeur est la même que `/foo/`)
- Chaîne vide ou `./` (pour le déploiement incorporé)

Voir [Public Base Path](/guide/build#public-base-path) pour plus de détails.

## mode

- **Type:** `string`
- **Default:** `'development'` pour serve, `'production'` pour build

Spécifier cette option dans la configuration remplacera le mode par défaut pour **serve et build**. Cette valeur peut également être remplacée via l'option de ligne de commande `--mode`.

Voir [Env Variables and Modes](/guide/env-and-mode) pour plus de détails.

## define

- **Type:** `Record<string, any>`

Définir les remplacements de constantes globales. Les entrées seront définies comme globals pendant le développement et statiquement remplacés pendant le build.

Vite utilise [esbuild defines](https://esbuild.github.io/api/#define) pour effectuer les remplacements, donc les expressions de valeur doivent être une chaîne qui contient une valeur JSON-sérialisable (null, boolean, number, string, array, ou object) ou un identifiant unique. Pour les valeurs non-string, Vite convertira automatiquement en une chaîne avec `JSON.stringify`.

**Example:**

```js
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify('v1.0.0'),
    __API_URL__: 'window.__backend_api_url',
  },
})
```

::: tip NOTE
Pour les utilisateurs TypeScript, assurez-vous de rajouter les déclarations de type dans le fichier `env.d.ts` ou `vite-env.d.ts` pour obtenir des vérifications de type et un Intellisense.

Exemple:

```ts
// vite-env.d.ts
declare const __APP_VERSION__: string
```

:::

## plugins

- **Type:** `(Plugin | Plugin[] | Promise<Plugin | Plugin[]>)[]`

Tableau de plugins à utiliser. Les plugins non valides sont ignorés et les tableaux de plugins sont aplatis. Si une promesse est renvoyée, elle sera résolue avant d'exécuter. Voir [API Plugin](/guide/api-plugin) pour plus de détails sur les plugins Vite.

## publicDir

- **Type:** `string | false`
- **Default:** `"public"`

Répertoire à servir en tant que ressources statiques pures. Les fichiers dans ce répertoire sont servis à `/` pendant le développement et copiés dans le répertoire racine de `outDir` pendant le build, et sont toujours servis ou copiés tel quel sans transformation. La valeur peut être un chemin absolu du système de fichiers ou un chemin relatif au répertoire racine du projet.

Définir `publicDir` comme `false` désactive cette fonctionnalité.

Voir [Le répertoire `public`](/guide/assets#the-public-directory) pour plus de détails.

## cacheDir

- **Type:** `string`
- **Default:** `"node_modules/.vite"`

Répertoire où enregistrer les fichiers de cache. Les fichiers dans ce répertoire sont des dépendances pré-bundlées ou d'autres fichiers de cache générés par Vite, ce qui peut améliorer les performances. Vous pouvez utiliser l'argument `--force` ou supprimer manuellement le répertoire pour régénérer les fichiers de cache. La valeur peut être un chemin absolu du système de fichiers ou un chemin relatif au répertoire racine du projet. Par défaut à `.vite` lorsque aucun `package.json` n'est détecté.

## resolve.alias

- **Type:**
  `Record<string, string> | Array<{ find: string | RegExp, replacement: string, customResolver?: ResolverFunction | ResolverObject }>`

Sera passé à l'option `entries` de `@rollup/plugin-alias`. Peut être un objet ou un tableau de paires `{ find, replacement, customResolver }`.

Lors de l'aliasisation vers des chemins de système de fichiers, utilisez toujours des chemins absolus. Les alias relatifs seront utilisés tels quels et ne seront pas résolus en chemins de système de fichiers.

Des résolutions plus avancées peuvent être obtenues via [plugins](/guide/api-plugin).

::: warning Utilisation avec SSR
Si vous avez configuré des alias pour [dépendances externalisées SSR](/guide/ssr.md#ssr-externals), vous souhaiterez peut-être aliaser les packages `node_modules` réels. Les alias sont supportés via le préfixe `npm:` pour [Yarn](https://classic.yarnpkg.com/en/docs/cli/add/#toc-yarn-add-alias) et [pnpm](https://pnpm.io/aliases/).
:::

## resolve.dedupe

- **Type:** `string[]`

Si vous avez des copies en double de la même dépendance dans votre application (probablement due à l'hoisting ou aux packages liés dans des monorepos), utilisez cette option pour forcer Vite à résoudre toujours les dépendances listées vers la même copie (depuis le répertoire racine du projet).

:::warning SSR + ESM
Pour les builds SSR, la déduplication ne fonctionne pas pour les sorties de build ESM configurées à partir de `build.rollupOptions.output`. Une solution de contournement est d'utiliser les sorties de build CJS jusqu'à ce que ESM ait de meilleures fonctionnalités de plugin pour le chargement des modules.
:::

## resolve.conditions

- **Type:** `string[]`
- **Default:** `['module', 'browser', 'development|production']` (`defaultClientConditions`)

Conditions supplémentaires autorisées lors de la résolution de [Conditional Exports](https://nodejs.org/api/packages.html#packages_conditional_exports) d'un package.

Un package avec des exports conditionnels peut avoir le champ `exports` suivant dans son `package.json`:

```json
{
  "exports": {
    ".": {
      "import": "./index.mjs",
      "require": "./index.js"
    }
  }
}
```

Ici, `import` et `require` sont des "conditions". Les conditions peuvent être imbriquées et doivent être spécifiées de la plus spécifique à la moins spécifique.

`development|production` est une valeur spéciale qui est remplacée par `production` ou `development` en fonction de la valeur de `process.env.NODE_ENV`. Elle est remplacée par `production` lorsque `process.env.NODE_ENV === 'production'` et par `development` dans les autres cas.

Note que les conditions `import`, `require`, `default` sont toujours appliquées si les conditions sont remplies.

:::warning Résolution des exports de sous-chemin
Les clés de sortie se terminant par "/" sont dépréciées par Node et peuvent ne pas fonctionner correctement. Veuillez contacter l'auteur du package pour utiliser [`*` subpath patterns](https://nodejs.org/api/packages.html#package-entry-points) à la place.
:::

## resolve.mainFields

- **Type:** `string[]`
- **Default:** `['browser', 'module', 'jsnext:main', 'jsnext']` (`defaultClientMainFields`)

Liste des champs dans `package.json` à essayer lors de la résolution du point d'entrée d'un package. Notez que cela prend une priorité inférieure aux exports conditionnels résolus à partir du champ `exports` : si un point d'entrée est résolu avec succès à partir de `exports`, le champ principal sera ignoré.

## resolve.extensions

- **Type:** `string[]`
- **Default:** `['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json']`

Liste des extensions de fichiers à essayer pour les imports qui omettent les extensions. Notez que cela n'est **PAS** recommandé pour les types d'importation personnalisés (e.g. `.vue`) puisqu'il peut interférer avec le support IDE et le type.

## resolve.preserveSymlinks

- **Type:** `boolean`
- **Default:** `false`

Lorsque cette option est activée, Vite détermine l'identité du fichier par le chemin du fichier original (i.e. le chemin sans suivre les liens symboliques) plutôt que le chemin du fichier réel (i.e. le chemin après suivi des liens symboliques).

- **Lié:** [esbuild#preserve-symlinks](https://esbuild.github.io/api/#preserve-symlinks), [webpack#resolve.symlinks
  ](https://webpack.js.org/configuration/resolve/#resolvesymlinks)

## html.cspNonce

- **Type:** `string`
- **Lié:** [Content Security Policy (CSP)](/guide/features#content-security-policy-csp)

Une valeur de nonce à placer lors de la génération de balises de script / style. Définir cette valeur générera également une balise meta avec la valeur de nonce.

## css.modules

- **Type:**
  ```ts
  interface CSSModulesOptions {
    getJSON?: (
      cssFileName: string,
      json: Record<string, string>,
      outputFileName: string,
    ) => void
    scopeBehaviour?: 'global' | 'local'
    globalModulePaths?: RegExp[]
    exportGlobals?: boolean
    generateScopedName?:
      | string
      | ((name: string, filename: string, css: string) => string)
    hashPrefix?: string
    /**
     * default: undefined
     */
    localsConvention?:
      | 'camelCase'
      | 'camelCaseOnly'
      | 'dashes'
      | 'dashesOnly'
      | ((
          originalClassName: string,
          generatedClassName: string,
          inputFile: string,
        ) => string)
  }
  ```

Configure le comportement des modules CSS. Les options sont passées à [postcss-modules](https://github.com/css-modules/postcss-modules).

Cette option n'a aucun effet lors de l'utilisation de [Lightning CSS](../guide/features.md#lightning-css). Si activé, [`css.lightningcss.cssModules`](https://lightningcss.dev/css-modules.html) doit être utilisé à la place.

## css.postcss

- **Type:** `string | (postcss.ProcessOptions & { plugins?: postcss.AcceptedPlugin[] })`

Configuration PostCSS en inline ou un répertoire personnalisé pour rechercher la configuration PostCSS (par défaut est le répertoire racine du projet).

Pour la configuration PostCSS inline, il attend le même format que `postcss.config.js`. Mais pour la propriété `plugins`, seul le [format de tableau](https://github.com/postcss/postcss-load-config/blob/main/README.md#array) peut être utilisé.

La recherche est faite en utilisant [postcss-load-config](https://github.com/postcss/postcss-load-config) et seuls les noms de fichiers de configuration pris en charge sont chargés. Les fichiers de configuration en dehors du répertoire racine du projet (ou du [répertoire racine du projet](/guide/#index-html-and-project-root) si aucun espace de travail n'est trouvé) ne sont pas recherchés par défaut. Vous pouvez spécifier un chemin personnalisé en dehors de la racine pour charger le fichier de configuration spécifique si nécessaire.

Note if an inline config is provided, Vite will not search for other PostCSS config sources.

## css.preprocessorOptions

- **Type:** `Record<string, object>`

Specify options to pass to CSS pre-processors. The file extensions are used as keys for the options. The supported options for each preprocessor can be found in their respective documentation:

- `sass`/`scss`:
  - Select the sass API to use with `api: "modern-compiler" | "modern" | "legacy"` (default `"modern-compiler"` if `sass-embedded` is installed, otherwise `"modern"`). For the best performance, it's recommended to use `api: "modern-compiler"` with the `sass-embedded` package. The `"legacy"` API is deprecated and will be removed in Vite 7.
  - [Options (modern)](https://sass-lang.com/documentation/js-api/interfaces/stringoptions/)
  - [Options (legacy)](https://sass-lang.com/documentation/js-api/interfaces/LegacyStringOptions).
- `less`: [Options](https://lesscss.org/usage/#less-options).
- `styl`/`stylus`: Only [`define`](https://stylus-lang.com/docs/js.html#define-name-node) is supported, which can be passed as an object.

**Example:**

```js
export default defineConfig({
  css: {
    preprocessorOptions: {
      less: {
        math: 'parens-division',
      },
      styl: {
        define: {
          $specialColor: new stylus.nodes.RGBA(51, 197, 255, 1),
        },
      },
      scss: {
        api: 'modern-compiler', // or "modern", "legacy"
        importers: [
          // ...
        ],
      },
    },
  },
})
```

### css.preprocessorOptions[extension].additionalData

- **Type:** `string | ((source: string, filename: string) => (string | { content: string; map?: SourceMap }))`

This option can be used to inject extra code for each style content. Note that if you include actual styles and not just variables, those styles will be duplicated in the final bundle.

**Example:**

```js
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `$injectedColor: orange;`,
      },
    },
  },
})
```

## css.preprocessorMaxWorkers

- **Experimental:** [Give Feedback](https://github.com/vitejs/vite/discussions/15835)
- **Type:** `number | true`
- **Default:** `0` (does not create any workers and run in the main thread)

If this option is set, CSS preprocessors will run in workers when possible. `true` means the number of CPUs minus 1.

## css.devSourcemap

- **Experimental:** [Give Feedback](https://github.com/vitejs/vite/discussions/13845)
- **Type:** `boolean`
- **Default:** `false`

Whether to enable sourcemaps during dev.

## css.transformer

- **Experimental:** [Give Feedback](https://github.com/vitejs/vite/discussions/13835)
- **Type:** `'postcss' | 'lightningcss'`
- **Default:** `'postcss'`

Selects the engine used for CSS processing. Check out [Lightning CSS](../guide/features.md#lightning-css) for more information.

::: info Duplicate `@import`s
Note that postcss (postcss-import) has a different behavior with duplicated `@import` from browsers. See [postcss/postcss-import#462](https://github.com/postcss/postcss-import/issues/462).
:::

## css.lightningcss

- **Experimental:** [Give Feedback](https://github.com/vitejs/vite/discussions/13835)
- **Type:**

```js
import type {
  CSSModulesConfig,
  Drafts,
  Features,
  NonStandard,
  PseudoClasses,
  Targets,
} from 'lightningcss'
```

```js
{
  targets?: Targets
  include?: Features
  exclude?: Features
  drafts?: Drafts
  nonStandard?: NonStandard
  pseudoClasses?: PseudoClasses
  unusedSymbols?: string[]
  cssModules?: CSSModulesConfig,
  // ...
}
```

Configures Lightning CSS. Full transform options can be found in [the Lightning CSS repo](https://github.com/parcel-bundler/lightningcss/blob/master/node/index.d.ts).

## json.namedExports

- **Type:** `boolean`
- **Default:** `true`

Whether to support named imports from `.json` files.

## json.stringify

- **Type:** `boolean | 'auto'`
- **Default:** `'auto'`

If set to `true`, imported JSON will be transformed into `export default JSON.parse("...")` which is significantly more performant than Object literals, especially when the JSON file is large.

If set to `'auto'`, the data will be stringified only if [the data is bigger than 10kB](https://v8.dev/blog/cost-of-javascript-2019#json:~:text=A%20good%20rule%20of%20thumb%20is%20to%20apply%20this%20technique%20for%20objects%20of%2010%20kB%20or%20larger).

## esbuild

- **Type:** `ESBuildOptions | false`

`ESBuildOptions` extends [esbuild's own transform options](https://esbuild.github.io/api/#transform). The most common use case is customizing JSX:

```js
export default defineConfig({
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
  },
})
```

By default, esbuild is applied to `ts`, `jsx` and `tsx` files. You can customize this with `esbuild.include` and `esbuild.exclude`, which can be a regex, a [picomatch](https://github.com/micromatch/picomatch#globbing-features) pattern, or an array of either.

In addition, you can also use `esbuild.jsxInject` to automatically inject JSX helper imports for every file transformed by esbuild:

```js
export default defineConfig({
  esbuild: {
    jsxInject: `import React from 'react'`,
  },
})
```

When [`build.minify`](./build-options.md#build-minify) is `true`, all minify optimizations are applied by default. To disable [certain aspects](https://esbuild.github.io/api/#minify) of it, set any of `esbuild.minifyIdentifiers`, `esbuild.minifySyntax`, or `esbuild.minifyWhitespace` options to `false`. Note the `esbuild.minify` option can't be used to override `build.minify`.

Set to `false` to disable esbuild transforms.

## assetsInclude

- **Type:** `string | RegExp | (string | RegExp)[]`
- **Related:** [Static Asset Handling](/guide/assets)

Specify additional [picomatch patterns](https://github.com/micromatch/picomatch#globbing-features) to be treated as static assets so that:

- They will be excluded from the plugin transform pipeline when referenced from HTML or directly requested over `fetch` or XHR.

- Importing them from JS will return their resolved URL string (this can be overwritten if you have a `enforce: 'pre'` plugin to handle the asset type differently).

The built-in asset type list can be found [here](https://github.com/vitejs/vite/blob/main/packages/vite/src/node/constants.ts).

**Example:**

```js
export default defineConfig({
  assetsInclude: ['**/*.gltf'],
})
```

## logLevel

- **Type:** `'info' | 'warn' | 'error' | 'silent'`

Adjust console output verbosity. Default is `'info'`.

## customLogger

- **Type:**
  ```ts
  interface Logger {
    info(msg: string, options?: LogOptions): void
    warn(msg: string, options?: LogOptions): void
    warnOnce(msg: string, options?: LogOptions): void
    error(msg: string, options?: LogErrorOptions): void
    clearScreen(type: LogType): void
    hasErrorLogged(error: Error | RollupError): boolean
    hasWarned: boolean
  }
  ```

Use a custom logger to log messages. You can use Vite's `createLogger` API to get the default logger and customize it to, for example, change the message or filter out certain warnings.

```ts twoslash
import { createLogger, defineConfig } from 'vite'

const logger = createLogger()
const loggerWarn = logger.warn

logger.warn = (msg, options) => {
  // Ignore empty CSS files warning
  if (msg.includes('vite:css') && msg.includes(' is empty')) return
  loggerWarn(msg, options)
}

export default defineConfig({
  customLogger: logger,
})
```

## clearScreen

- **Type:** `boolean`
- **Default:** `true`

Set to `false` to prevent Vite from clearing the terminal screen when logging certain messages. Via command line, use `--clearScreen false`.

## envDir

- **Type:** `string`
- **Default:** `root`

The directory from which `.env` files are loaded. Can be an absolute path, or a path relative to the project root.

See [here](/guide/env-and-mode#env-files) for more about environment files.

## envPrefix

- **Type:** `string | string[]`
- **Default:** `VITE_`

Env variables starting with `envPrefix` will be exposed to your client source code via import.meta.env.

:::warning SECURITY NOTES
`envPrefix` should not be set as `''`, which will expose all your env variables and cause unexpected leaking of sensitive information. Vite will throw an error when detecting `''`.

If you would like to expose an unprefixed variable, you can use [define](#define) to expose it:

```js
define: {
  'import.meta.env.ENV_VARIABLE': JSON.stringify(process.env.ENV_VARIABLE)
}
```

:::

## appType

- **Type:** `'spa' | 'mpa' | 'custom'`
- **Default:** `'spa'`

Whether your application is a Single Page Application (SPA), a [Multi Page Application (MPA)](../guide/build#multi-page-app), or Custom Application (SSR and frameworks with custom HTML handling):

- `'spa'`: include HTML middlewares and use SPA fallback. Configure [sirv](https://github.com/lukeed/sirv) with `single: true` in preview
- `'mpa'`: include HTML middlewares
- `'custom'`: don't include HTML middlewares

Learn more in Vite's [SSR guide](/guide/ssr#vite-cli). Related: [`server.middlewareMode`](./server-options#server-middlewaremode).

## future

- **Type:** `Record<string, 'warn' | undefined>`
- **Related:** [Breaking Changes](/changes/)

Enable future breaking changes to prepare for a smooth migration to the next major version of Vite. The list may be updated, added, or removed at any time as new features are developed.

See the [Breaking Changes](/changes/) page for details of the possible options.
