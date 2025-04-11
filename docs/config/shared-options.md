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

Notez que si une configuration inline est fournie, Vite ne recherchera pas d'autres sources de configuration PostCSS.

## css.preprocessorOptions

- **Type:** `Record<string, object>`

Spécifie les options à passer aux préprocesseurs CSS. Les extensions de fichiers sont utilisées comme clefs pour les options. Les options prises en charge pour chaque préprocesseur peuvent être trouvées dans leur documentation respective :

- `sass`/`scss` :
  - Sélectionnez l'API sass à utiliser avec l'`api: "modern-compiler" | "modern" | "legacy"` (par défaut `"modern-compiler"` si `sass-embedded` est installé, sinon `"modern"`). Pour de meilleures performances, il est recommandé d'utiliser `api: "modern-compiler"` avec le package `sass-embedded`. L'API `"legacy"` est dépréciée et sera supprimée dans Vite 7.
  - [Options (modern)](https://sass-lang.com/documentation/js-api/interfaces/stringoptions/)
  - [Options (legacy)](https://sass-lang.com/documentation/js-api/interfaces/LegacyStringOptions).
- `less` : [Options](https://lesscss.org/usage/#less-options).
- `styl`/`stylus` : Seul [`define`](https://stylus-lang.com/docs/js.html#define-name-node) est pris en charge, qui peut être passé comme un objet.

**Exemple :**

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
        api: 'modern-compiler', // ou "modern", "legacy"
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

Cette option peut être utilisée pour injecter du code supplémentaire pour chaque contenu de style. Notez que si vous incluez des styles et pas seulement des variables, ces styles seront dupliqués dans le bundle final.

**Exemple :**

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

- **Expérimental :** [Donner un avis](https://github.com/vitejs/vite/discussions/15835)
- **Type :** `number | true`
- **Default :** `0` (ne crée pas de workers et s'exécute dans le thread principal)

Si cette option est définie, les préprocesseurs CSS s'exécuteront dans des workers lorsque c'est possible. `true` signifie "nombre de CPU moins 1".

## css.devSourcemap

- **Expérimental :** [Donner un avis](https://github.com/vitejs/vite/discussions/13845)
- **Type :** `boolean`
- **Default :** `false`

Pour activer les sourcemaps en développement.

## css.transformer

- **Expérimental :** [Donner un avis](https://github.com/vitejs/vite/discussions/13835)
- **Type :** `'postcss' | 'lightningcss'`
- **Default :** `'postcss'`

Sélectionne le moteur utilisé pour le traitement CSS. Consultez [Lightning CSS](../guide/features.md#lightning-css) pour plus d'informations.

::: info `@import` en double
Notez que postcss (postcss-import) a un comportement différent avec les `@import` dupliqués par rapport aux navigateurs. Voir [postcss/postcss-import#462](https://github.com/postcss/postcss-import/issues/462).
:::

## css.lightningcss

- **Expérimental :** [Donner un avis](https://github.com/vitejs/vite/discussions/13835)
- **Type :**

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

Configure Lightning CSS. Les options de transformation complètes peuvent être trouvées dans [le dépôt Lightning CSS](https://github.com/parcel-bundler/lightningcss/blob/master/node/index.d.ts).

## json.namedExports

- **Type :** `boolean`
- **Default :** `true`

Pour activer le support des importations nommées à partir de fichiers `.json`.

## json.stringify

- **Type :** `boolean | 'auto'`
- **Default :** `'auto'`

Si défini à `true`, le JSON importé sera transformé en `export default JSON.parse("...")` qui est beaucoup plus performant que les objets literaux, surtout lorsque le fichier JSON est volumineux.

Si défini à `'auto'`, les données seront stringifiées uniquement si [elles sont plus grandes que 10kB](https://v8.dev/blog/cost-of-javascript-2019#json:~:text=A%20good%20rule%20of%20thumb%20is%20to%20apply%20this%20technique%20for%20objects%20of%2010%20kB%20or%20larger).

## esbuild

- **Type :** `ESBuildOptions | false`

`ESBuildOptions` étend les [options de transformation d'esbuild](https://esbuild.github.io/api/#transform). Le cas d'utilisation le plus courant est la personnalisation de JSX :

```js
export default defineConfig({
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
  },
})
```

Par défaut, esbuild est appliqué aux fichiers `ts`, `jsx` et `tsx`. Vous pouvez personnaliser cela avec `esbuild.include` et `esbuild.exclude`, qui peuvent être une regex, un modèle [picomatch](https://github.com/micromatch/picomatch#globbing-features), ou un tableau de l'un ou l'autre.

En outre, vous pouvez également utiliser `esbuild.jsxInject` pour injecter automatiquement des importations d'helper JSX pour chaque fichier transformé par esbuild :

```js
export default defineConfig({
  esbuild: {
    jsxInject: `import React from 'react'`,
  },
})
```

Lorsque [`build.minify`](./build-options.md#build-minify) est `true`, toutes les optimisations de minification sont appliquées par défaut. Pour désactiver [certains aspects](https://esbuild.github.io/api/#minify), définissez l'une des options `esbuild.minifyIdentifiers`, `esbuild.minifySyntax` ou `esbuild.minifyWhitespace` à `false`. Notez que l'option `esbuild.minify` ne peut pas être utilisée pour remplacer `build.minify`.

Définissez à `false` pour désactiver les transformations esbuild.

## assetsInclude

- **Type :** `string | RegExp | (string | RegExp)[]`
- **Lié :** [Gestion des assets statiques](/guide/assets)

Spécifiez des [modèles picomatch](https://github.com/micromatch/picomatch#globbing-features) supplémentaires à traiter comme des assets statiques afin que :

- Ils seront exclus du pipeline de transformation des plugins lorsqu'ils sont référencés depuis HTML ou directement demandés via `fetch` ou XHR.

- Les importer depuis JS renverra leur URL résolue sous forme de chaîne (cela peut être remplacé si vous avez un plugin `enforce: 'pre'` pour gérer le type d'asset différemment).

La liste des types d'assets intégrés peut être trouvée [ici](https://github.com/vitejs/vite/blob/main/packages/vite/src/node/constants.ts).

**Exemple :**

```js
export default defineConfig({
  assetsInclude: ['**/*.gltf'],
})
```

## logLevel

- **Type :** `'info' | 'warn' | 'error' | 'silent'`

Ajuste la verbosité des messages de la console. Par défaut : `'info'`.

## customLogger

- **Type :**
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

Utilisez un logger personnalisé pour les messages. Vous pouvez utiliser l'API `createLogger` de Vite pour obtenir le logger par défaut et le personnaliser pour, par exemple, modifier le message ou filtrer certains avertissements.

```ts twoslash
import { createLogger, defineConfig } from 'vite'

const logger = createLogger()
const loggerWarn = logger.warn

logger.warn = (msg, options) => {
  // Ignorer l'avertissement des fichiers CSS vides
  if (msg.includes('vite:css') && msg.includes(' is empty')) return
  loggerWarn(msg, options)
}

export default defineConfig({
  customLogger: logger,
})
```

## clearScreen

- **Type :** `boolean`
- **Default :** `true`

Définissez à `false` pour empêcher Vite d'effacer l'écran du terminal lors de l'affichage de certains messages. Via la ligne de commande, utilisez `--clearScreen false`.

## envDir

- **Type:** `string | false`
- **Default:** `root`

Le répertoire à partir duquel les fichiers `.env` sont chargés. Peut être un chemin absolu, ou un chemin relatif à la racine du projet. Désactive le chargement du fichier `.env` si `false`.

Voir [ici](/guide/env-and-mode#env-files) pour plus d'informations sur les fichiers d'environnement.

## envPrefix

- **Type :** `string | string[]`
- **Default :** `VITE_`

Les variables d'environnement commençant par `envPrefix` seront exposées à votre code source client via import.meta.env.

:::warning NOTES DE SÉCURITÉ
`envPrefix` ne doit pas être défini comme `''`, ce qui exposerait toutes vos variables d'environnement et pourrait entraîner une fuite inattendue d'informations sensibles. Vite générera une erreur lors de la détection de `''`.

Si vous souhaitez exposer une variable sans préfixe, vous pouvez utiliser [define](#define) pour l'exposer :

```js
define: {
  'import.meta.env.ENV_VARIABLE': JSON.stringify(process.env.ENV_VARIABLE)
}
```

:::

## appType

- **Type :** `'spa' | 'mpa' | 'custom'`
- **Default :** `'spa'`

Si votre application est une Single Page Application (SPA), une [Multi Page Application (MPA)](../guide/build#multi-page-app), ou une application personnalisée (SSR et frameworks avec gestion HTML personnalisée) :

- `'spa'` : inclut les middlewares HTML et utilise la solution de repli SPA. Configure [sirv](https://github.com/lukeed/sirv) avec `single: true` en prévisualisation
- `'mpa'` : inclut les middlewares HTML
- `'custom'` : n'inclut pas les middlewares HTML

En savoir plus dans le [guide SSR](/guide/ssr#vite-cli) de Vite. Connexe : [`server.middlewareMode`](./server-options#server-middlewaremode).

## future

- **Type :** `Record<string, 'warn' | undefined>`
- **Lié :** [Changements majeurs](/changes/)

Activez les futurs changements majeurs pour préparer une migration en douceur vers la prochaine version majeure de Vite. La liste peut être mise à jour, ajoutée ou supprimée à tout moment au fur et à mesure que de nouvelles fonctionnalités sont développées.

Consultez la page [Changements majeurs](/changes/) pour les détails des options possibles.
