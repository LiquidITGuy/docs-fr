# Performance

Bien que Vite soit rapide par défaut, des problèmes de performance peuvent survenir à mesure que les exigences du projet augmentent. Ce guide vise à vous aider à identifier et à résoudre les problèmes de performance courants, tels que :

- Démarrages lents du serveur
- Chargements lents des pages
- Builds lents

## Vérifiez votre configuration de navigateur

Certaines extensions de navigateur peuvent interférer avec les requêtes et ralentir les temps de démarrage et de rechargement pour les grandes applications, en particulier lors de l'utilisation des outils de développement du navigateur. Nous recommandons de créer un profil réservé au développement sans extensions, ou de passer en mode navigation privée, lorsque vous utilisez le serveur de développement de Vite dans ces cas. Le mode navigation privée devrait également être plus rapide qu'un profil normal sans extensions.

Le serveur de développement de Vite met en cache de manière persistante les dépendances pré-regroupées et implémente des réponses 304 rapides pour le code source. La désactivation du cache lorsque les outils de développement du navigateur sont ouverts peut avoir un impact important sur les temps de démarrage et de rechargement complet de page. Veuillez vérifier que "Désactiver le cache" n'est pas activé lorsque vous travaillez avec le serveur Vite.

## Auditez les plugins Vite configurés

Les plugins internes et officiels de Vite sont optimisés pour effectuer le minimum de travail possible tout en assurant la compatibilité avec l'écosystème plus large. Par exemple, les transformations de code utilisent des regex en développement, mais effectuent une analyse complète lors de le build pour garantir l'exactitude.

Cependant, la performance des plugins communautaires échappe au contrôle de Vite, ce qui peut affecter l'expérience du développeur. Voici quelques points à surveiller lors de l'utilisation de plugins Vite supplémentaires :

1. Les dépendances volumineuses qui ne sont utilisées que dans certains cas devraient être importées dynamiquement pour réduire le temps de démarrage de Node.js. Exemples de refactorisations : [vite-plugin-react#212](https://github.com/vitejs/vite-plugin-react/pull/212) et [vite-plugin-pwa#224](https://github.com/vite-pwa/vite-plugin-pwa/pull/244).

2. Les hooks `buildStart`, `config` et `configResolved` ne devraient pas exécuter des opérations longues et intensives. Ces hooks sont attendus pendant le démarrage du serveur de développement, ce qui retarde le moment où vous pouvez accéder au site dans le navigateur.

3. Les hooks `resolveId`, `load` et `transform` peuvent faire en sorte que certains fichiers se chargent plus lentement que d'autres. Bien que parfois inévitable, il vaut toujours la peine de rechercher des domaines possibles à optimiser. Par exemple, vérifier si le `code` contient un mot-clé spécifique, ou si l'`id` correspond à une extension spécifique, avant d'effectuer la transformation complète.

   Plus il faut de temps pour transformer un fichier, plus la cascade de requêtes sera importante lors du chargement du site dans le navigateur.

   Vous pouvez inspecter la durée nécessaire pour transformer un fichier en utilisant `vite --debug plugin-transform` ou [vite-plugin-inspect](https://github.com/antfu/vite-plugin-inspect). Notez que comme les opérations asynchrones ont tendance à fournir des mesures de temps imprécises, vous devriez considérer les chiffres comme une estimation approximative, mais cela devrait quand même révéler les opérations les plus coûteuses.

::: tip Profilage
Vous pouvez exécuter `vite --profile`, visiter le site, puis appuyer sur `p + entrée` dans votre terminal pour enregistrer un `.cpuprofile`. Un outil comme [speedscope](https://www.speedscope.app) peut ensuite être utilisé pour inspecter le profil et identifier les goulets d'étranglement. Vous pouvez également [partager les profils](https://chat.vite.dev) avec l'équipe Vite pour nous aider à identifier les problèmes de performance.
:::

## Réduisez les opérations de résolution

Résoudre les chemins d'importation peut être une opération coûteuse lorsqu'on atteint souvent le pire des cas. Par exemple, Vite prend en charge le fait de "deviner" des chemins d'importation avec l'option [`resolve.extensions`](/config/shared-options.md#resolve-extensions), qui a par défaut la valeur `['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json']`.

Lorsque vous essayez d'importer `./Component.jsx` avec `import './Component'`, Vite exécutera ces étapes pour le résoudre :

1. Vérifier si `./Component` existe, non.
2. Vérifier si `./Component.mjs` existe, non.
3. Vérifier si `./Component.js` existe, non.
4. Vérifier si `./Component.mts` existe, non.
5. Vérifier si `./Component.ts` existe, non.
6. Vérifier si `./Component.jsx` existe, oui !

Comme montré, un total de 6 vérifications du système de fichiers est nécessaire pour résoudre un chemin d'importation. Plus vous avez d'importations implicites, plus cela prend du temps pour résoudre les chemins.

Par conséquent, il est généralement préférable d'être explicite avec vos chemins d'importation, par exemple `import './Component.jsx'`. Vous pouvez également réduire la liste pour `resolve.extensions` afin de réduire les vérifications générales du système de fichiers, mais vous devez vous assurer que cela fonctionne également pour les fichiers dans `node_modules`.

Si vous êtes un auteur de plugin, assurez-vous de n'appeler [`this.resolve`](https://rollupjs.org/plugin-development/#this-resolve) que lorsque c'est nécessaire pour réduire le nombre de vérifications ci-dessus.

::: tip TypeScript
Si vous utilisez TypeScript, activez `"moduleResolution": "bundler"` et `"allowImportingTsExtensions": true` dans les `compilerOptions` de votre `tsconfig.json` pour utiliser directement les extensions `.ts` et `.tsx` dans votre code.
:::

## Évitez les fichiers barrel

Les fichiers barrel sont des fichiers qui ré-exportent les API d'autres fichiers dans le même répertoire. Par exemple :

```js [src/utils/index.js]
export * from './color.js'
export * from './dom.js'
export * from './slash.js'
```

Lorsque vous n'importez qu'une API individuelle, par exemple `import { slash } from './utils'`, tous les fichiers de ce fichier barrel doivent être récupérés et transformés car ils peuvent contenir l'API `slash` et peuvent également contenir des effets secondaires qui s'exécutent à l'initialisation. Cela signifie que vous chargez plus de fichiers que nécessaire lors du chargement initial de la page, ce qui ralentit le chargement de la page.

Si possible, vous devriez éviter les fichiers barrel et importer les API individuelles directement, par exemple `import { slash } from './utils/slash.js'`. Vous pouvez lire [issue #8237](https://github.com/vitejs/vite/issues/8237) pour plus d'informations.

## Préchauffez les fichiers fréquemment utilisés

Le serveur de développement Vite ne transforme les fichiers que lorsqu'ils sont demandés par le navigateur, ce qui lui permet de démarrer rapidement et de n'appliquer des transformations qu'aux fichiers utilisés. Il peut également pré-transformer des fichiers s'il prévoit que certains fichiers seront bientôt demandés. Cependant, des cascades de requêtes peuvent encore se produire si certains fichiers prennent plus de temps à transformer que d'autres. Par exemple :

Étant donné un graphe d'importation où le fichier de gauche importe le fichier de droite :

```
main.js -> BigComponent.vue -> big-utils.js -> large-data.json
```

La relation d'importation ne peut être connue qu'après la transformation du fichier. Si `BigComponent.vue` prend du temps à transformer, `big-utils.js` doit attendre son tour, et ainsi de suite. Cela crée une cascade interne même avec la pré-transformation intégrée.

Vite vous permet de préchauffer les fichiers que vous savez être fréquemment utilisés, par exemple `big-utils.js`, en utilisant l'option [`server.warmup`](/config/server-options.md#server-warmup). De cette façon, `big-utils.js` sera prêt et mis en cache pour être servi immédiatement lorsqu'il sera demandé.

Vous pouvez trouver les fichiers fréquemment utilisés en exécutant `vite --debug transform` et en inspectant les logs :

```bash
vite:transform 28.72ms /@vite/client +1ms
vite:transform 62.95ms /src/components/BigComponent.vue +1ms
vite:transform 102.54ms /src/utils/big-utils.js +1ms
```

```js [vite.config.js]
export default defineConfig({
  server: {
    warmup: {
      clientFiles: [
        './src/components/BigComponent.vue',
        './src/utils/big-utils.js',
      ],
    },
  },
})
```

Notez que vous ne devriez préchauffer que les fichiers fréquemment utilisés pour ne pas surcharger le serveur de développement Vite au démarrage. Consultez l'option [`server.warmup`](/config/server-options.md#server-warmup) pour plus d'informations.

L'utilisation de [`--open` ou `server.open`](/config/server-options.html#server-open) apporte également un gain de performance, car Vite préchauffera automatiquement le point d'entrée de votre application ou l'URL fournie à ouvrir.

## Utilisez des outils plus légers ou natifs

Maintenir Vite rapide avec une base de code croissante consiste à réduire la quantité de travail pour les fichiers sources (JS/TS/CSS).

Exemples de réduction du travail :

- Utilisez CSS au lieu de Sass/Less/Stylus lorsque c'est possible (l'imbrication peut être gérée par PostCSS)
- Ne transformez pas les SVG en composants de framework UI (React, Vue, etc). Importez-les plutôt comme des chaînes ou des URL.
- Lors de l'utilisation de `@vitejs/plugin-react`, évitez de configurer les options Babel, afin qu'il ignore la transformation pendant le build (seul esbuild sera utilisé).

Exemples d'utilisation d'outils natifs :

L'utilisation d'outils natifs implique souvent une taille d'installation plus importante et n'est donc pas l'option par défaut lors du démarrage d'un nouveau projet Vite. Mais cela peut valoir le coût pour les applications plus grandes.

- Utilisez [Rolldown à place de Rollup et esbuild](./rolldown) pour un builds plus rapide et une expérience plus cohérente entre le développement et la production
- Essayez la prise en charge expérimentale de [LightningCSS](https://github.com/vitejs/vite/discussions/13835)
- Utilisez [`@vitejs/plugin-react-swc`](https://github.com/vitejs/vite-plugin-react-swc) à la place de `@vitejs/plugin-react`.
