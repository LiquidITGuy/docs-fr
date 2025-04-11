# Options du serveur

Sauf mention contraire, les options de cette section ne s'appliquent qu'au développement.

## server.host

- **Type :** `string | boolean`
- **Défaut :** `'localhost'`

Spécifie les adresses IP sur lesquelles le serveur doit écouter.
Définissez cette option sur `0.0.0.0` ou `true` pour écouter sur toutes les adresses, y compris les réseaux locaux et les adresses publiques.

Cette option peut être définie via la CLI en utilisant `--host 0.0.0.0` ou `--host`.

::: tip REMARQUE

Il existe des cas où d'autres serveurs pourraient répondre à la place de Vite.

Le premier cas est lorsque `localhost` est utilisé. Node.js avant la v17 réorganise par défaut le résultat des adresses résolues par DNS. Lorsque vous accédez à `localhost`, les navigateurs utilisent DNS pour résoudre l'adresse et cette adresse peut différer de celle sur laquelle Vite écoute. Vite affiche l'adresse résolue lorsqu'elle diffère.

Vous pouvez définir [`dns.setDefaultResultOrder('verbatim')`](https://nodejs.org/api/dns.html#dns_dns_setdefaultresultorder_order) pour désactiver le comportement de réorganisation. Vite affichera alors l'adresse comme `localhost`.

```js twoslash [vite.config.js]
import { defineConfig } from 'vite'
import dns from 'node:dns'

dns.setDefaultResultOrder('verbatim')

export default defineConfig({
  // omit
})
```

Le deuxième cas est lorsque des hôtes génériques (par ex. `0.0.0.0`) sont utilisés. C'est parce que les serveurs écoutant sur des hôtes non génériques ont priorité sur ceux écoutant sur des hôtes génériques.

:::

::: tip Accéder au serveur sur WSL2 depuis votre réseau local

Lorsque vous exécutez Vite sur WSL2, il ne suffit pas de définir `host: true` pour accéder au serveur depuis votre réseau local.
Consultez [le document WSL](https://learn.microsoft.com/en-us/windows/wsl/networking#accessing-a-wsl-2-distribution-from-your-local-area-network-lan) pour plus de détails.

:::

## server.allowedHosts

- **Type :** `string[] | true`
- **Défaut :** `[]`

Les noms d'hôtes auxquels Vite est autorisé à répondre.
`localhost` et les domaines sous `.localhost` ainsi que toutes les adresses IP sont autorisés par défaut.
Lorsque vous utilisez HTTPS, cette vérification est ignorée.

Si une chaîne commence par `.`, elle autorisera ce nom d'hôte sans le `.` et tous les sous-domaines sous ce nom d'hôte. Par exemple, `.example.com` autorisera `example.com`, `foo.example.com` et `foo.bar.example.com`. Si défini à `true`, le serveur est autorisé à répondre aux requêtes pour n'importe quel hôte.

::: details Quels hôtes est-il sûr d'ajouter ?

Les hôtes dont vous contrôlez les adresses IP sont sûrs à ajouter à la liste des hôtes autorisés.

Par exemple, si vous possédez un domaine `vite.dev`, vous pouvez ajouter `vite.dev` et `.vite.dev` à la liste. Si vous ne possédez pas ce domaine et que vous ne pouvez pas faire confiance au propriétaire de ce domaine, vous ne devriez pas l'ajouter.

En particulier, vous ne devriez jamais ajouter des domaines de premier niveau comme `.com` à la liste. C'est parce que n'importe qui peut acheter un domaine comme `example.com` et contrôler l'adresse IP à laquelle il résout.

:::

::: danger

Définir `server.allowedHosts` à `true` permet à n'importe quel site web d'envoyer des requêtes à votre serveur de développement grâce à des attaques de rebinding DNS, leur permettant de télécharger votre code source et votre contenu. Nous recommandons toujours d'utiliser une liste explicite d'hôtes autorisés. Voir [GHSA-vg6x-rcgg-rjx6](https://github.com/vitejs/vite/security/advisories/GHSA-vg6x-rcgg-rjx6) pour plus de détails.

:::

::: details Configurer via une variable d'environnement
Vous pouvez définir la variable d'environnement `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS` pour ajouter un hôte autorisé supplémentaire.
:::

## server.port

- **Type :** `number`
- **Défaut :** `5173`

Spécifie le port du serveur. Notez que si le port est déjà utilisé, Vite essaiera automatiquement le prochain port disponible, donc ce ne sera peut-être pas le port réel sur lequel le serveur finira par écouter.

## server.strictPort

- **Type :** `boolean`

Définissez sur `true` pour quitter si le port est déjà utilisé, au lieu d'essayer automatiquement le prochain port disponible.

## server.https

- **Type :** `https.ServerOptions`

Active TLS + HTTP/2. La valeur est un [objet d'options](https://nodejs.org/api/https.html#https_https_createserver_options_requestlistener) passé à `https.createServer()`.

Notez que cela est rétrogradé à TLS uniquement lorsque l'[option `server.proxy`](#server-proxy) est également utilisée.

Un certificat valide est nécessaire. Pour une configuration de base, vous pouvez ajouter [@vitejs/plugin-basic-ssl](https://github.com/vitejs/vite-plugin-basic-ssl) aux plugins du projet, qui créera et mettra en cache automatiquement un certificat auto-signé. Mais nous vous recommandons de créer vos propres certificats.

## server.open

- **Type :** `boolean | string`

Ouvre automatiquement l'application dans le navigateur au démarrage du serveur. Lorsque la valeur est une chaîne, elle sera utilisée comme chemin de l'URL. Si vous souhaitez ouvrir le serveur dans un navigateur spécifique, vous pouvez définir la variable d'environnement `process.env.BROWSER` (par exemple `firefox`). Vous pouvez également définir `process.env.BROWSER_ARGS` pour passer des arguments supplémentaires (par exemple `--incognito`).

`BROWSER` et `BROWSER_ARGS` sont également des variables d'environnement spéciales que vous pouvez définir dans le fichier `.env` pour les configurer. Consultez [le package `open`](https://github.com/sindresorhus/open#app) pour plus de détails.

**Exemple :**

```js
export default defineConfig({
  server: {
    open: '/docs/index.html',
  },
})
```

## server.proxy

- **Type :** `Record<string, string | ProxyOptions>`

Configure des règles de proxy personnalisées pour le serveur de développement. Attend un objet de paires `{ clef: options }`. Toutes les requêtes dont le chemin commence par cette clef seront redirigées vers la cible spécifiée. Si la clef commence par `^`, elle sera interprétée comme une `RegExp`. L'option `configure` peut être utilisée pour accéder à l'instance de proxy. Si une requête correspond à l'une des règles de proxy configurées, la requête ne sera pas transformée par Vite.

Notez que si vous utilisez une [`base`](/config/shared-options.md#base) non relative, vous devez préfixer chaque clef avec cette `base`.

Étend [`http-proxy`](https://github.com/http-party/node-http-proxy#options). Options supplémentaires [ici](https://github.com/vitejs/vite/blob/main/packages/vite/src/node/server/middlewares/proxy.ts#L13).

Dans certains cas, vous pourriez également vouloir configurer le serveur de développement sous-jacent (par exemple pour ajouter des middlewares personnalisés à l'application interne [connect](https://github.com/senchalabs/connect)). Pour ce faire, vous devez écrire votre propre [plugin](/guide/using-plugins.html) et utiliser la fonction [configureServer](/guide/api-plugin.html#configureserver).

**Exemple :**

```js
export default defineConfig({
  server: {
    proxy: {
      // raccourci de chaine de caractère :
      // http://localhost:5173/foo
      //   -> http://localhost:4567/foo
      '/foo': 'http://localhost:4567',
      // avec options :
      // http://localhost:5173/api/bar
      //   -> http://jsonplaceholder.typicode.com/bar
      '/api': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      // avec RegExp :
      // http://localhost:5173/fallback/
      //   -> http://jsonplaceholder.typicode.com/
      '^/fallback/.*': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/fallback/, ''),
      },
      // Utilisation de l'instance de proxy
      '/api': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        configure: (proxy, options) => {
          // proxy sera une instance de 'http-proxy'
        },
      },
      // Proxy de websockets ou socket.io :
      // ws://localhost:5173/socket.io
      //   -> ws://localhost:5174/socket.io
      // Soyez prudent avec `rewriteWsOrigin` car cela peut laisser
      // le proxy ouvert aux attaques CSRF.
      '/socket.io': {
        target: 'ws://localhost:5174',
        ws: true,
        rewriteWsOrigin: true,
      },
    },
  },
})
```

## server.cors

- **Type :** `boolean | CorsOptions`
- **Défaut :** `{ origin: /^https?:\/\/(?:(?:[^:]+\.)?localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/ }` (autorise localhost, `127.0.0.1` et `::1`)

Configure les CORS pour le serveur de développement. Passez un [objet d'options](https://github.com/expressjs/cors#configuration-options) pour affiner le comportement ou `true` pour autoriser n'importe quelle origine.

::: danger

Définir `server.cors` à `true` permet à n'importe quel site web d'envoyer des requêtes à votre serveur de développement et de télécharger votre code source et votre contenu. Nous recommandons toujours d'utiliser une liste explicite d'origines autorisées.

:::

## server.headers

- **Type :** `OutgoingHttpHeaders`

Spécifie les en-têtes de réponse du serveur.

## server.hmr

- **Type :** `boolean | { protocol?: string, host?: string, port?: number, path?: string, timeout?: number, overlay?: boolean, clientPort?: number, server?: Server }`

Désactive ou configure la connexion HMR (dans les cas où le websocket HMR doit utiliser une adresse différente du serveur HTTP).

Définissez `server.hmr.overlay` à `false` pour désactiver l'overlay d'erreur du serveur.

`protocol` définit le protocole WebSocket utilisé pour la connexion HMR : `ws` (WebSocket) ou `wss` (WebSocket Secure).

`clientPort` est une option avancée qui remplace le port uniquement côté client, vous permettant de servir le websocket sur un port différent de celui que le code client recherche.

Lorsque `server.hmr.server` est défini, Vite traitera les requêtes de connexion HMR via le serveur fourni. Si ce n'est pas en mode middleware, Vite tentera de traiter les requêtes de connexion HMR via le serveur existant. Cela peut être utile lorsque vous utilisez des certificats auto-signés ou lorsque vous souhaitez exposer Vite sur un réseau via un seul port.

Consultez [`vite-setup-catalogue`](https://github.com/sapphi-red/vite-setup-catalogue) pour quelques exemples.

::: tip REMARQUE

Avec la configuration par défaut, on s'attend à ce que les reverse proxys devant Vite prennent en charge le proxy WebSocket. Si le client HMR de Vite ne parvient pas à se connecter en WebSocket, le client retombera sur une connexion WebSocket directe au serveur HMR de Vite, contournant les reverse proxys :

```
Fallback de connexion websocket directe. Consultez https://vite.dev/config/server-options.html#server-hmr pour supprimer l'erreur de connexion précédente.
```

L'erreur qui apparaît dans le navigateur lorsque le fallback se produit peut être ignorée. Pour éviter l'erreur en contournant directement les reverse proxys, vous pouvez soit :

- configurer le reverse proxy pour qu'il proxifie également WebSocket
- définir [`server.strictPort = true`](#server-strictport) et définir `server.hmr.clientPort` à la même valeur que `server.port`
- définir `server.hmr.port` à une valeur différente de [`server.port`](#server-port)

:::

## server.warmup

- **Type :** `{ clientFiles?: string[], ssrFiles?: string[] }`
- **Connexe :** [Préchauffer les fichiers fréquemment utilisés](/guide/performance.html#warm-up-frequently-used-files)

Préchauffe les fichiers pour transformer et mettre en cache les résultats à l'avance. Cela améliore le chargement initial de la page pendant les démarrages du serveur et empêche les cascades de transformation.

`clientFiles` sont des fichiers qui ne sont utilisés que dans le client, tandis que `ssrFiles` sont des fichiers qui ne sont utilisés que dans le SSR. Ils acceptent un tableau de chemins de fichiers ou de modèles [`tinyglobby`](https://github.com/SuperchupuDev/tinyglobby) relatifs à la `root`.

Assurez-vous de n'ajouter que les fichiers fréquemment utilisés pour ne pas surcharger le serveur de développement Vite au démarrage.

```js
export default defineConfig({
  server: {
    warmup: {
      clientFiles: ['./src/components/*.vue', './src/utils/big-utils.js'],
      ssrFiles: ['./src/server/modules/*.js'],
    },
  },
})
```

## server.watch

- **Type :** `object | null`

Options de surveillance du système de fichiers à transmettre à [chokidar](https://github.com/paulmillr/chokidar/tree/3.6.0#api).

Le watcher du serveur Vite surveille le répertoire `root` et ignore par défaut les répertoires `.git/`, `node_modules/`, ainsi que le `cacheDir` de Vite et le `build.outDir`. Lors de la mise à jour d'un fichier surveillé, Vite appliquera le HMR et mettra à jour la page uniquement si nécessaire.

Si défini à `null`, aucun fichier ne sera surveillé. `server.watcher` fournira un émetteur d'événements compatible, mais l'appel de `add` ou `unwatch` n'aura aucun effet.

::: warning Surveillance des fichiers dans `node_modules`

Il n'est actuellement pas possible de surveiller les fichiers et les packages dans `node_modules`. Pour plus de progression et de solutions de contournement, vous pouvez suivre [le ticket #8619](https://github.com/vitejs/vite/issues/8619).

:::

::: warning Utilisation de Vite sur Windows Subsystem for Linux (WSL) 2

Lorsque vous exécutez Vite sur WSL2, la surveillance du système de fichiers ne fonctionne pas lorsqu'un fichier est modifié par des applications Windows (processus non-WSL2). Cela est dû à [une limitation de WSL2](https://github.com/microsoft/WSL/issues/4739). Cela s'applique également à l'exécution sur Docker avec un backend WSL2.

Pour résoudre ce problème, vous pouvez soit :

- **Recommandé** : Utiliser des applications WSL2 pour éditer vos fichiers.
  - Il est également recommandé de déplacer le dossier du projet en dehors d'un système de fichiers Windows. L'accès au système de fichiers Windows depuis WSL2 est lent. Supprimer cette surcharge améliorera les performances.
- Définir `{ usePolling: true }`.
  - Notez que [`usePolling` entraîne une utilisation élevée du CPU](https://github.com/paulmillr/chokidar/tree/3.6.0#performance).

:::

## server.middlewareMode

- **Type :** `boolean`
- **Défaut :** `false`

Crée le serveur Vite en mode middleware.

- **Connexe :** [appType](./shared-options#apptype), [SSR - Configuration du serveur de développement](/guide/ssr#setting-up-the-dev-server)

- **Exemple :**

```js twoslash
import express from 'express'
import { createServer as createViteServer } from 'vite'

async function createServer() {
  const app = express()

  // Crée le serveur Vite en mode middleware
  const vite = await createViteServer({
    server: { middlewareMode: true },
    // n'inclut pas les middlewares de gestion HTML par défaut de Vite
    appType: 'custom',
  })
  // Utilise l'instance connect de vite comme middleware
  app.use(vite.middlewares)

  app.use('*', async (req, res) => {
    // Puisque `appType` est `'custom'`, il faut servir la réponse ici.
    // Note : si `appType` est `'spa'` ou `'mpa'`, Vite inclut des middlewares
    // pour gérer les requêtes HTML et les 404, donc les middlewares utilisateur
    // doivent être ajoutés avant les middlewares de Vite pour prendre effet
  })
}

createServer()
```

## server.fs.strict

- **Type :** `boolean`
- **Défaut :** `true` (activé par défaut depuis Vite 2.7)

Restreint la diffusion de fichiers en dehors de la racine de l'espace de travail.

## server.fs.allow

- **Type :** `string[]`

Restreint les fichiers qui pourraient être servis via `/@fs/`. Lorsque `server.fs.strict` est défini à `true`, l'accès aux fichiers en dehors de cette liste de répertoires qui ne sont pas importés depuis un fichier autorisé se traduira par un 403.

Des répertoires et des fichiers peuvent être fournis.

Vite recherchera la racine de l'espace de travail potentiel et l'utilisera par défaut. Un espace de travail valide répond aux conditions suivantes, sinon il se rabattra sur la [racine du projet](/guide/#index-html-and-project-root).

- contient le champ `workspaces` dans `package.json`
- contient l'un des fichiers suivants
  - `lerna.json`
  - `pnpm-workspace.yaml`

Accepte un chemin pour spécifier la racine personnalisée de l'espace de travail. Peut être un chemin absolu ou un chemin relatif à la [racine du projet](/guide/#index-html-and-project-root). Par exemple :

```js
export default defineConfig({
  server: {
    fs: {
      // Autorise la diffusion de fichiers à partir d'un niveau au-dessus de la racine du projet
      allow: ['..'],
    },
  },
})
```

Lorsque `server.fs.allow` est spécifié, la détection automatique de la racine de l'espace de travail sera désactivée. Pour étendre le comportement original, un utilitaire `searchForWorkspaceRoot` est exposé :

```js
import { defineConfig, searchForWorkspaceRoot } from 'vite'

export default defineConfig({
  server: {
    fs: {
      allow: [
        // recherche vers le haut pour la racine de l'espace de travail
        searchForWorkspaceRoot(process.cwd()),
        // vos règles personnalisées
        '/chemin/vers/repertoire_autorise_personnalise',
        '/chemin/vers/fichier_autorise_personnalise.demo',
      ],
    },
  },
})
```

## server.fs.deny

- **Type :** `string[]`
- **Défaut :** `['.env', '.env.*', '*.{crt,pem}', '**/.git/**']`

Liste noire des fichiers sensibles qui sont restreints pour être servis par le serveur de développement Vite. Cela aura une priorité plus élevée que [`server.fs.allow`](#server-fs-allow). Les [modèles picomatch](https://github.com/micromatch/picomatch#globbing-features) sont pris en charge.

::: tip NOTE

This blocklist does not apply to [the public directory](/guide/assets.md#the-public-directory). All files in the public directory are served without any filtering, since they are copied directly to the output directory during build.

:::

## server.origin

- **Type :** `string`

Définit l'origine des URL d'assets générées pendant le développement.

```js
export default defineConfig({
  server: {
    origin: 'http://127.0.0.1:8080',
  },
})
```

## server.sourcemapIgnoreList

- **Type :** `false | (sourcePath: string, sourcemapPath: string) => boolean`
- **Défaut :** `(sourcePath) => sourcePath.includes('node_modules')`

Indique s'il faut ignorer les fichiers source dans la sourcemap du serveur, utilisée pour remplir l'[extension de sourcemap `x_google_ignoreList`](https://developer.chrome.com/articles/x-google-ignore-list/).

`server.sourcemapIgnoreList` est l'équivalent de [`build.rollupOptions.output.sourcemapIgnoreList`](https://rollupjs.org/configuration-options/#output-sourcemapignorelist) pour le serveur de développement. Une différence entre les deux options de configuration est que la fonction rollup est appelée avec un chemin relatif pour `sourcePath` tandis que `server.sourcemapIgnoreList` est appelée avec un chemin absolu. Pendant le développement, la plupart des modules ont la carte et la source dans le même dossier, donc le chemin relatif pour `sourcePath` est le nom du fichier lui-même. Dans ces cas, les chemins absolus sont plus pratiques à utiliser.

Par défaut, il exclut tous les chemins contenant `node_modules`. Vous pouvez passer `false` pour désactiver ce comportement, ou, pour un contrôle total, une fonction qui prend le chemin source et le chemin sourcemap et retourne si le chemin source doit être ignoré.

```js
export default defineConfig({
  server: {
    // C'est la valeur par défaut, et elle ajoutera tous les fichiers avec node_modules
    // dans leurs chemins à la liste d'ignorés.
    sourcemapIgnoreList(sourcePath, sourcemapPath) {
      return sourcePath.includes('node_modules')
    },
  },
})
```

::: tip Note
[`server.sourcemapIgnoreList`](#server-sourcemapignorelist) et [`build.rollupOptions.output.sourcemapIgnoreList`](https://rollupjs.org/configuration-options/#output-sourcemapignorelist) doivent être définis indépendamment. `server.sourcemapIgnoreList` est une configuration uniquement pour le serveur et ne récupère pas sa valeur par défaut des options rollup définies.
:::
