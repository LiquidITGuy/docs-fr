# Options du Worker

Sauf mention contraire, les options de cette section s'appliquent à tous les dev, build et preview.

## worker.format

- **Type:** `'es' | 'iife'`
- **Default:** `'iife'`

Format de sortie pour le bundle du worker.

## worker.plugins

- **Type:** [`() => (Plugin | Plugin[])[]`](./shared-options#plugins)

Plugins Vite qui s'appliquent aux bundles du worker. Notez que [config.plugins](./shared-options#plugins) ne s'applique qu'aux workers en mode dev, il doit être configuré ici à la place pour le build. La fonction doit retourner des nouvelles instances de plugin comme elles sont utilisées dans les constructions parallèles du worker Rollup. Ainsi, modifier les options `config.worker` dans le hook `config` sera ignoré.

## worker.rollupOptions

- **Type:** [`RollupOptions`](https://rollupjs.org/configuration-options/)

Options Rollup pour construire le bundle du worker.
