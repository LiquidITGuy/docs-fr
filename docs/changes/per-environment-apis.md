# Déplacer vers les API par environnement

::: tip Retour
Donnez-nous votre retour sur le [Discussion sur les API Environnement](https://github.com/vitejs/vite/discussions/16358)
:::

Plusieurs API de `ViteDevServer` liées au graphique de modules et aux transformations de modules ont été déplacées vers les instances `DevEnvironment`.

Scopes affectés: `Vite Plugin Authors`

::: warning Dépréciation future
L'instance `Environment` a été introduite dans `v6.0`. La dépréciation de `server.moduleGraph` et d'autres méthodes qui sont maintenant dans les environnements est prévue pour `v7.0`. Nous ne recommandons pas de quitter les méthodes du serveur. Pour identifier votre utilisation, définissez ces options dans votre configuration Vite.

```ts
future: {
  removeServerModuleGraph: 'warn',
  removeServerTransformRequest: 'warn',
}
```

:::

## Motivation

Dans Vite v5 et avant, un seul serveur Vite avait toujours deux environnements (`client` et `ssr`). Le `server.moduleGraph` avait des modules mélangés de ces deux environnements. Les nœuds étaient connectés via les listes `clientImportedModules` et `ssrImportedModules` (mais un seul `importers` list était maintenue pour chaque). Un module transformé était représenté par un `id` et un booléen `ssr`. Ce booléen nécessitait d'être passé à des API, par exemple `server.moduleGraph.getModuleByUrl(url, ssr)` et `server.transformRequest(url, { ssr })`.

Dans Vite v6, il est maintenant possible de créer n'importe quel nombre d'environnements personnalisés (`client`, `ssr`, `edge`, etc). Un seul booléen `ssr` ne suffit plus. Au lieu de changer les API pour être de la forme `server.transformRequest(url, { environment })`, nous avons déplacé ces méthodes vers l'instance d'environnement, permettant de les appeler sans serveur Vite de développement.

## Guide de migration

- `server.moduleGraph` -> [`environment.moduleGraph`](/guide/api-environment#separate-module-graphs)
- `server.transformRequest(url, ssr)` -> `environment.transformRequest(url)`
- `server.warmupRequest(url, ssr)` -> `environment.warmupRequest(url)`
