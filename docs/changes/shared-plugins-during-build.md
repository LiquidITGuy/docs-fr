# Plugins partagés lors du build

::: tip Retours
Donnez-nous vos retours dans les [discussions GitHub](https://github.com/vitejs/vite/discussions/16358)
:::

Voir [Plugins partagés lors du build](/guide/api-environment-plugins.md#shared-plugins-during-build).

Scopes affectés: `Auteurs de plugins Vite`

::: warning Changement de valeur par défaut futur
`builder.sharedConfigBuild` a été introduit dans `v6.0`. Vous pouvez le définir sur `true` pour vérifier comment vos plugins fonctionnent avec une configuration partagée. Nous recherchons des retours sur le changement de valeur par défaut dans une future version majeure une fois que l'écosystème des plugins sera prêt.
:::

## Motivation

Aligner les pipelines de plugins de développement et de build.

## Guide de migration

Pour pouvoir partager des plugins entre environnements, l'état du plugin doit être associé par à l'environnement actuel par un système de clés. Un plugin de la forme suivante comptera le nombre de modules transformés dans tous les environnements.

```js
function CountTransformedModulesPlugin() {
  let transformedModules
  return {
    name: 'count-transformed-modules',
    buildStart() {
      transformedModules = 0
    },
    transform(id) {
      transformedModules++
    },
    buildEnd() {
      console.log(transformedModules)
    },
  }
}
```

Si nous voulons compter le nombre de modules transformés pour chaque environnement, nous devons conserver une map:

```js
function PerEnvironmentCountTransformedModulesPlugin() {
  const state = new Map<Environment, { count: number }>()
  return {
    name: 'count-transformed-modules',
    perEnvironmentStartEndDuringDev: true,
    buildStart() {
      state.set(this.environment, { count: 0 })
    }
    transform(id) {
      state.get(this.environment).count++
    },
    buildEnd() {
      console.log(this.environment.name, state.get(this.environment).count)
    }
  }
}
```

Pour simplifier ce pattern, Vite exporte un assistant `perEnvironmentState`:

```js
function PerEnvironmentCountTransformedModulesPlugin() {
  const state = perEnvironmentState<{ count: number }>(() => ({ count: 0 }))
  return {
    name: 'count-transformed-modules',
    perEnvironmentStartEndDuringDev: true,
    buildStart() {
      state(this).count = 0
    }
    transform(id) {
      state(this).count++
    },
    buildEnd() {
      console.log(this.environment.name, state(this).count)
    }
  }
}
```
