# SSR avec l'API `ModuleRunner`

::: tip Retours
Donnez-nous vos retours dans les [discussions GitHub](https://github.com/vitejs/vite/discussions/16358)
:::

`server.ssrLoadModule` a été remplacé par l'importation depuis un [Module Runner](/guide/api-environment#modulerunner).

Scopes affectés: `Auteurs de plugins Vite`

::: warning Dépréciation future
`ModuleRunner` a été introduit dans `v6.0`. La dépréciation de `server.ssrLoadModule` est prévue pour une future version majeure. Pour identifier votre utilisation, définissez `future.removeSsrLoadModule` sur `"warn"` dans votre configuration Vite.
:::

## Motivation

La `server.ssrLoadModule(url)` ne permet que d'importer des modules dans l'environnement `ssr` et ne peut exécuter les modules que dans le même processus que le serveur de développement Vite. Pour les applications avec des environnements personnalisés, chaque environnement est associé à un `ModuleRunner` qui peut être en cours d'exécution dans un thread ou un processus distinct. Pour importer des modules, nous avons maintenant `moduleRunner.import(url)`.

## Guide de migration

Consultez le [Guide pour les Frameworks avec l'API Environnement](../guide/api-environment-frameworks.md).
