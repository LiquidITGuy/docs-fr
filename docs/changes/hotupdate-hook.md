# HMR (hot module reloading) `hotUpdate` Plugin Hook

::: tip Retours
Donnez-nous vos retours dans les [discussions GitHub](https://github.com/vitejs/vite/discussions/16358)
:::

Nous prévoyons de déprécier le hook `handleHotUpdate` en faveur du nouveau hook [`hotUpdate`](/guide/api-environment#the-hotupdate-hook) pour être compatible avec l'[API Environnement](/guide/api-environment.md), et pour gérer les événements de surveillance supplémentaires avec `create` et `delete`.

Portée affectée: `Auteurs de plugins Vite`

::: warning Dépréciation future
`hotUpdate` a été introduit dans `v6.0`. La dépréciation de `handleHotUpdate` est prévue pour `v7.0`. Nous ne recommandons pas encore de passer à `hotUpdate`. Si vous souhaitez expérimenter et donner vos retours, vous pouvez utiliser la configuration `future.removePluginHookHandleHotUpdate` pour `"warn"` dans votre configuration Vite.
:::

## Motivation

Le hook [`handleHotUpdate`](/guide/api-plugin.md#handlehotupdate) permet de gérer les mises à jour HMR personnalisées. Une liste de modules à mettre à jour est passée dans le contexte `HmrContext`

```ts
interface HmrContext {
  file: string
  timestamp: number
  modules: Array<ModuleNode>
  read: () => string | Promise<string>
  server: ViteDevServer
}
```

Ce hook est appelé une fois pour tous les environnements, et les modules passés ont des informations mélangées provenant des environnements Client et SSR. Une fois que les frameworks passeront à des environnements personnalisés, un nouveau hook appelé pour chacun d'entre eux est nécessaire.

Le nouveau hook `hotUpdate` fonctionne de la même manière que `handleHotUpdate` mais il est appelé pour chaque environnement et reçoit une nouvelle instance `HotUpdateOptions`:

```ts
interface HotUpdateOptions {
  type: 'create' | 'update' | 'delete'
  file: string
  timestamp: number
  modules: Array<EnvironmentModuleNode>
  read: () => string | Promise<string>
  server: ViteDevServer
}
```

L'environnement de développement actuel peut être accédé comme dans les autres hooks de plugin avec `this.environment`. La liste `modules` ne contiendra maintenant que les modules de l'environnement actuel. Chaque environnement peut définir des stratégies de mise à jour différentes.

Ce hook est maintenant appelé pour les événements de surveillance supplémentaires et non seulement pour `'update'`. Utilisez `type` pour les différencier.

## Guide de migration

Filtrez et réduisez la liste des modules affectés pour que le HMR soit plus précis.

```js
handleHotUpdate({ modules }) {
  return modules.filter(condition)
}

// Migrate to:

hotUpdate({ modules }) {
  return modules.filter(condition)
}
```

Retourner un tableau vide et effectuer un rechargement complet:

```js
handleHotUpdate({ server, modules, timestamp }) {
  // Invalidate modules manually
  const invalidatedModules = new Set()
  for (const mod of modules) {
    server.moduleGraph.invalidateModule(
      mod,
      invalidatedModules,
      timestamp,
      true
    )
  }
  server.ws.send({ type: 'full-reload' })
  return []
}

// Migrate to:

hotUpdate({ modules, timestamp }) {
  // Invalidate modules manually
  const invalidatedModules = new Set()
  for (const mod of modules) {
    this.environment.moduleGraph.invalidateModule(
      mod,
      invalidatedModules,
      timestamp,
      true
    )
  }
  this.environment.hot.send({ type: 'full-reload' })
  return []
}
```

Retourner un tableau vide et effectuer un traitement HMR personnalisé complet en envoyant des événements personnalisés au client:

```js
handleHotUpdate({ server }) {
  server.ws.send({
    type: 'custom',
    event: 'special-update',
    data: {}
  })
  return []
}

// Migrer vers...

hotUpdate() {
  this.environment.hot.send({
    type: 'custom',
    event: 'special-update',
    data: {}
  })
  return []
}
```
