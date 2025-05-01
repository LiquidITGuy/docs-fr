# Migration depuis v5

## API d'Environnement

Dans le cadre de la nouvelle [API d'Environnement](/guide/api-environment.md) expérimentale, une importante refactorisation interne a été nécessaire. Vite 6 s'efforce d'éviter les changements cassants pour garantir que la plupart des projets puissent rapidement passer à la nouvelle version majeure. Nous attendrons qu'une grande partie de l'écosystème ait effectué la migration pour stabiliser et commencer à recommander l'utilisation des nouvelles API. Il peut y avoir quelques cas particuliers, mais ceux-ci ne devraient affecter que les utilisations avancées par les frameworks et les outils. Nous avons travaillé avec les mainteneurs de l'écosystème pour atténuer ces différences avant la sortie. Veuillez [ouvrir un ticket](https://github.com/vitejs/vite/issues/new?assignees=&labels=pending+triage&projects=&template=bug_report.yml) si vous constatez une régression.

Certaines API internes ont été supprimées en raison de changements dans l'implémentation de Vite. Si vous utilisiez l'une d'entre elles, veuillez créer une [demande de fonctionnalité](https://github.com/vitejs/vite/issues/new?assignees=&labels=enhancement%3A+pending+triage&projects=&template=feature_request.yml).

## API Vite Runtime

L'API Vite Runtime expérimentale a évolué vers l'API Module Runner, publiée dans Vite 6 dans le cadre de la nouvelle [API d'Environnement](/guide/api-environment) expérimentale. Étant donné que cette fonctionnalité était expérimentale, la suppression de l'API précédente introduite dans Vite 5.1 n'est pas un changement cassant, mais les utilisateurs devront mettre à jour leur utilisation vers l'équivalent Module Runner dans le cadre de la migration vers Vite 6.

## Changements généraux

### Valeur par défaut pour `resolve.conditions`

Ce changement n'affecte pas les utilisateurs qui n'ont pas configuré [`resolve.conditions`](/config/shared-options#resolve-conditions) / [`ssr.resolve.conditions`](/config/ssr-options#ssr-resolve-conditions) / [`ssr.resolve.externalConditions`](/config/ssr-options#ssr-resolve-externalconditions).

Dans Vite 5, la valeur par défaut pour `resolve.conditions` était `[]` et certaines conditions étaient ajoutées en interne. La valeur par défaut pour `ssr.resolve.conditions` était la valeur de `resolve.conditions`.

À partir de Vite 6, certaines conditions ne sont plus ajoutées en interne et doivent être incluses dans les valeurs de configuration.
Les conditions qui ne sont plus ajoutées en interne pour :

- `resolve.conditions` sont `['module', 'browser', 'development|production']`
- `ssr.resolve.conditions` sont `['module', 'node', 'development|production']`

Les valeurs par défaut pour ces options sont mises à jour aux valeurs correspondantes et `ssr.resolve.conditions` n'utilise plus `resolve.conditions` comme valeur par défaut. Notez que `development|production` est une variable spéciale qui est remplacée par `production` ou `development` selon la valeur de `process.env.NODE_ENV`. Ces valeurs par défaut sont exportées depuis `vite` sous les noms `defaultClientConditions` et `defaultServerConditions`.

Si vous avez spécifié une valeur personnalisée pour `resolve.conditions` ou `ssr.resolve.conditions`, vous devez la mettre à jour pour inclure les nouvelles conditions.
Par exemple, si vous avez précédemment spécifié `['custom']` pour `resolve.conditions`, vous devez maintenant spécifier `['custom', ...defaultClientConditions]` à la place.

### JSON stringify

Dans Vite 5, lorsque [`json.stringify: true`](/config/shared-options#json-stringify) était défini, [`json.namedExports`](/config/shared-options#json-namedexports) était désactivé.

À partir de Vite 6, même lorsque `json.stringify: true` est défini, `json.namedExports` n'est pas désactivé et sa valeur est respectée. Si vous souhaitez obtenir le comportement précédent, vous pouvez définir `json.namedExports: false`.

Vite 6 introduit également une nouvelle valeur par défaut pour `json.stringify` qui est `'auto'`, qui ne mettra en chaîne (stringify) que les gros fichiers JSON. Pour désactiver ce comportement, définissez `json.stringify: false`.

### Support étendu des assets de références dans les éléments HTML

Dans Vite 5, seuls quelques éléments HTML supportés pouvaient référencer des assets qui seraient traités et bundlé par Vite, comme `<link href>`, `<img src>`, etc.

Vite 6 étend le support à encore plus d'éléments HTML. La liste complète peut être trouvée dans la documentation des [fonctionnalités HTML](/guide/features.html#html).

Pour désactiver le traitement HTML sur certains éléments, vous pouvez ajouter l'attribut `vite-ignore` sur l'élément.

### postcss-load-config

[`postcss-load-config`](https://npmjs.com/package/postcss-load-config) a été mis à jour de la v4 à la v6. [`tsx`](https://www.npmjs.com/package/tsx) ou [`jiti`](https://www.npmjs.com/package/jiti) est maintenant requis pour charger les fichiers de configuration PostCSS en TypeScript à la place de [`ts-node`](https://www.npmjs.com/package/ts-node). De plus, [`yaml`](https://www.npmjs.com/package/yaml) est maintenant requis pour charger les fichiers de configuration PostCSS en YAML.

### Sass utilise maintenant l'API moderne par défaut

Dans Vite 5, l'API legacy était utilisée par défaut pour Sass. Vite 5.4 a ajouté le support pour l'API moderne.

À partir de Vite 6, l'API moderne est utilisée par défaut pour Sass. Si vous souhaitez continuer à utiliser l'API legacy, vous pouvez définir [`css.preprocessorOptions.sass.api: 'legacy'` / `css.preprocessorOptions.scss.api: 'legacy'`](/config/shared-options#css-preprocessoroptions). Mais notez que le support de l'API legacy sera supprimé dans Vite 7.

Pour migrer vers l'API moderne, consultez [la documentation Sass](https://sass-lang.com/documentation/breaking-changes/legacy-js-api/).

### Personnaliser le nom du fichier CSS de sortie en mode bibliothèque

Dans Vite 5, le nom du fichier CSS de sortie en mode bibliothèque était toujours `style.css` et ne pouvait pas être facilement modifié via la configuration Vite.

À partir de Vite 6, le nom de fichier par défaut utilise maintenant le "name" dans `package.json`, de façon similaire aux fichiers JS de sortie. Si [`build.lib.fileName`](/config/build-options.md#build-lib) est défini avec une chaîne, la valeur sera également utilisée pour le nom du fichier CSS de sortie. Pour définir explicitement un nom de fichier CSS différent, vous pouvez utiliser le nouveau [`build.lib.cssFileName`](/config/build-options.md#build-lib) pour le configurer.

Pour migrer, si vous vous appuyiez sur le nom de fichier `style.css`, vous devriez mettre à jour les références vers celui-ci avec le nouveau nom basé sur le nom de votre package. Par exemple :

```json [package.json]
{
  "name": "my-lib",
  "exports": {
    "./style.css": "./dist/style.css" // [!code --]
    "./style.css": "./dist/my-lib.css" // [!code ++]
  }
}
```

Si vous préférez conserver `style.css` comme dans Vite 5, vous pouvez définir `build.lib.cssFileName: 'style'` à la place.

## Avancé

Il existe d'autres changements cassants qui n'affectent que peu d'utilisateurs.

- [[#17922] fix(css)!: remove default import in ssr dev](https://github.com/vitejs/vite/pull/17922)
  - Le support pour l'importation par défaut des fichiers CSS était [déprécié dans Vite 4](https://v4.vite.dev/guide/migration.html#importing-css-as-a-string) et supprimé dans Vite 5, mais il était encore involontairement supporté en mode dev SSR. Ce support est maintenant supprimé.
- [[#15637] fix!: default `build.cssMinify` to `'esbuild'` for SSR](https://github.com/vitejs/vite/pull/15637)
  - [`build.cssMinify`](/config/build-options#build-cssminify) est maintenant activé par défaut même pour les builds SSR.
- [[#18070] feat!: proxy bypass with WebSocket](https://github.com/vitejs/vite/pull/18070)
  - `server.proxy[path].bypass` est maintenant appelé pour les requêtes de mise à niveau WebSocket et dans ce cas, le paramètre `res` sera `undefined`.
- [[#18209] refactor!: bump minimal terser version to 5.16.0](https://github.com/vitejs/vite/pull/18209)
  - La version minimale de terser supportée pour [`build.minify: 'terser'`](/config/build-options#build-minify) a été relevée à 5.16.0 (contre 5.4.0 précédemment).
- [[#18231] chore(deps): update dependency @rollup/plugin-commonjs to v28](https://github.com/vitejs/vite/pull/18231)
  - [`commonjsOptions.strictRequires`](https://github.com/rollup/plugins/blob/master/packages/commonjs/README.md#strictrequires) est maintenant `true` par défaut (était `'auto'` avant).
    - Cela peut conduire à des tailles de bundle plus importantes mais donnera des builds plus déterministes.
    - Si vous spécifiez un fichier CommonJS comme point d'entrée, vous pourriez avoir besoin d'étapes supplémentaires. Lisez [la documentation du plugin commonjs](https://github.com/rollup/plugins/blob/master/packages/commonjs/README.md#using-commonjs-files-as-entry-points) pour plus de détails.
- [[#18243] chore(deps)!: migrate `fast-glob` to `tinyglobby`](https://github.com/vitejs/vite/pull/18243)
  - Les accolades de plage (`{01..03}` ⇒ `['01', '02', '03']`) et les accolades incrémentales (`{2..8..2}` ⇒ `['2', '4', '6', '8']`) ne sont plus supportées dans les globs.
- [[#18395] feat(resolve)!: allow removing conditions](https://github.com/vitejs/vite/pull/18395)
  - Cette PR n'introduit pas seulement un changement cassant mentionné ci-dessus comme "Valeur par défaut pour `resolve.conditions`", mais fait également en sorte que `resolve.mainFields` ne soit pas utilisé pour les dépendances non-externalisées en SSR. Si vous utilisiez `resolve.mainFields` et souhaitez l'appliquer aux dépendances non-externalisées en SSR, vous pouvez utiliser [`ssr.resolve.mainFields`](/config/ssr-options#ssr-resolve-mainfields).
- [[#18493] refactor!: remove fs.cachedChecks option](https://github.com/vitejs/vite/pull/18493)
  - Cette optimisation optionnelle a été supprimée en raison de cas particuliers lors de l'écriture d'un fichier dans un dossier mis en cache et de son importation immédiate.
- ~~[[#18697] fix(deps)!: update dependency dotenv-expand to v12](https://github.com/vitejs/vite/pull/18697)~~
  - ~~Les variables utilisées dans l'interpolation doivent maintenant être déclarées avant l'interpolation. Pour plus de détails, voir [le changelog de `dotenv-expand`](https://github.com/motdotla/dotenv-expand/blob/v12.0.1/CHANGELOG.md#1200-2024-11-16).~~ Ce changement cassant a été annulé dans v6.1.0.
- [[#16471] feat: v6 - Environment API](https://github.com/vitejs/vite/pull/16471)

  - Les mises à jour d'un module uniquement SSR ne déclenchent plus un rechargement complet de la page côté client. Pour revenir au comportement précédent, un plugin Vite personnalisé peut être utilisé :
    <details>
    <summary>Cliquez pour voir l'exemple</summary>

    ```ts twoslash
    import type { Plugin, EnvironmentModuleNode } from 'vite'

    function hmrReload(): Plugin {
      return {
        name: 'hmr-reload',
        enforce: 'post',
        hotUpdate: {
          order: 'post',
          handler({ modules, server, timestamp }) {
            if (this.environment.name !== 'ssr') return

            let hasSsrOnlyModules = false

            const invalidatedModules = new Set<EnvironmentModuleNode>()
            for (const mod of modules) {
              if (mod.id == null) continue
              const clientModule =
                server.environments.client.moduleGraph.getModuleById(mod.id)
              if (clientModule != null) continue

              this.environment.moduleGraph.invalidateModule(
                mod,
                invalidatedModules,
                timestamp,
                true,
              )
              hasSsrOnlyModules = true
            }

            if (hasSsrOnlyModules) {
              server.ws.send({ type: 'full-reload' })
              return []
            }
          },
        },
      }
    }
    ```

    </details>

## Migration depuis v4

Consultez d'abord le [Guide de migration depuis v4](https://v5.vite.dev/guide/migration.html) dans la documentation de Vite v5 pour voir les changements nécessaires pour porter votre application vers Vite 5, puis procédez aux changements indiqués sur cette page.
