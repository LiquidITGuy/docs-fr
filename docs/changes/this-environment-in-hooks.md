# `this.environment` dans les hooks

::: tip Retours
Donnez-nous vos retours dans les [discussions GitHub](https://github.com/vitejs/vite/discussions/16358)
:::

Avant Vite 6, seuls deux environnements étaient disponibles : `client` et `ssr`. Un seul argument `options.ssr` dans les hooks `resolveId`, `load` et `transform` permettait aux auteurs de plugins de différencier ces deux environnements lors du traitement des modules dans les hooks de plugin. Dans Vite 6, une application Vite peut définir autant d'environnements nommés que nécessaire. Nous introduisons `this.environment` dans le contexte du plugin pour interagir avec l'environnement du module actuel dans les hooks.

Scopes affectés: `Auteurs de plugins Vite`

::: warning Dépréciation future
`this.environment` a été introduit dans `v6.0`. La dépréciation de `options.ssr` est prévue pour `v7.0`. À ce stade, nous commencerons à recommander la migration de vos plugins vers la nouvelle API. Pour identifier votre utilisation, définissez `future.removePluginHookSsrArgument` sur `"warn"` dans votre configuration Vite.
:::

## Motivation

`this.environment` permet non seulement au code d'implémentation du hook de plugin de connaître le nom de l'environnement actuel, mais également d'accéder aux options de configuration de l'environnement, à l'information sur le graphique des modules et au pipeline de transformation (`environment.config`, `environment.moduleGraph`, `environment.transformRequest()`). Avoir l'instance d'environnement disponible dans le contexte permet aux auteurs de plugins de se passer de la dépendance du serveur de développement complet (typiquement mis en cache au démarrage via le hook `configureServer`).

## Guide de migration

Pour le plugin existant, effectuez une migration rapide en remplaçant l'argument `options.ssr` par `this.environment.name !== 'client'` dans les hooks `resolveId`, `load` et `transform`:

```ts
import { Plugin } from 'vite'

export function myPlugin(): Plugin {
  return {
    name: 'my-plugin',
    resolveId(id, importer, options) {
      const isSSR = options.ssr // [!code --]
      const isSSR = this.environment.name !== 'client' // [!code ++]

      if (isSSR) {
        // SSR specific logic
      } else {
        // Client specific logic
      }
    },
  }
}
```

Pour une implémentation plus robuste à long terme, le hook de plugin devrait gérer les [environnements multiples](/guide/api-environment.html#accessing-the-current-environment-in-hooks) en utilisant des options d'environnement plus fines plutôt que de se baser sur le nom de l'environnement.
