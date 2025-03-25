# Options SSR

Sauf mention contraire, les options de cette section s'appliquent à build et preview.

## ssr.external

- **Type:** `string[] | true`
- **Related:** [SSR Externals](/guide/ssr#ssr-externals)

Externalise les dépendances données et leurs dépendances transitives pour SSR. Par défaut, toutes les dépendances sont externalisées sauf les dépendances liées (pour HMR). Si vous préférez externaliser la dépendance liée, vous pouvez passer son nom à cette option.

Si `true`, toutes les dépendances, y compris les dépendances liées, sont externalisées.

Note que les dépendances explicitement listées (en utilisant le type `string[]`) prendront toujours la priorité si elles sont également listées dans `ssr.noExternal` (en utilisant n'importe quel type).

## ssr.noExternal

- **Type:** `string | RegExp | (string | RegExp)[] | true`
- **Related:** [SSR Externals](/guide/ssr#ssr-externals)

Empêche les dépendances listées d'être externalisées pour le SSR, qui seront bundlées dans build. Par défaut, seules les dépendances liées ne sont pas externalisées (pour HMR). Si vous préférez externaliser la dépendance liée, vous pouvez passer son nom à l'option `ssr.external`.

Si `true`, aucune dépendance n'est externalisée. Cependant, les dépendances explicitement listées dans `ssr.external` (en utilisant le type `string[]`) peuvent prendre la priorité et être externalisées. Si `ssr.target: 'node'` est configuré, les dépendances intégrées de Node.js seront également externalisées par défaut.

Note que si `ssr.noExternal: true` et `ssr.external: true` sont configurés, `ssr.noExternal` prendra la priorité et aucune dépendance ne sera externalisée.

## ssr.target

- **Type:** `'node' | 'webworker'`
- **Default:** `node`

Cible de build pour le serveur SSR.

## ssr.resolve.conditions

- **Type:** `string[]`
- **Default:** `['module', 'node', 'development|production']` (`defaultServerConditions`) (`['module', 'browser', 'development|production']` (`defaultClientConditions`) for `ssr.target === 'webworker'`)
- **Related:** [Resolve Conditions](./shared-options.md#resolve-conditions)

Ces conditions sont utilisées dans le pipeline de plugin, et ne s'appliquent qu'aux dépendances non externalisées lors du build SSR. Utilisez `ssr.resolve.externalConditions` pour affecter les imports externalisés.

## ssr.resolve.externalConditions

- **Type:** `string[]`
- **Default:** `['node']`

Conditions utilisées lors de l'importation SSR (y compris `ssrLoadModule`) des dépendances directes externalisées (dépendances externalisées importées par Vite).

:::tip

Lorsque vous utilisez cette option, assurez-vous de lancer Node avec le [flag `--conditions`](https://nodejs.org/docs/latest/api/cli.html#-c-condition---conditionscondition) avec les mêmes valeurs dans les deux environnements de développement et de build pour obtenir un comportement cohérent.

Par exemple, lorsque vous définissez `['node', 'custom']`, vous devez lancer `NODE_OPTIONS='--conditions custom' vite` dans l'environnement de développement et `NODE_OPTIONS="--conditions custom" node ./dist/server.js` après le build.

:::

### ssr.resolve.mainFields

- **Type:** `string[]`
- **Default:** `['module', 'jsnext:main', 'jsnext']`

Liste des champs dans `package.json` à essayer lors de la résolution du point d'entrée d'un package. Notez que cela prend une priorité inférieure aux exports conditionnels résolus à partir du champ `exports` : si un point d'entrée est résolu avec succès à partir de `exports`, le champ principal sera ignoré. Cette configuration ne s'applique qu'aux dépendances non externalisées.
