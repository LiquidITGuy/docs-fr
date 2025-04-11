# Options de prévisualisation

Sauf indication contraire, les options de cette section ne s'appliquent qu'à la prévisualisation.

## preview.host

- **Type :** `string | boolean`
- **Défaut :** [`server.host`](./server-options#server-host)

Spécifie les adresses IP sur lesquelles le serveur doit écouter.
Définissez cette option sur `0.0.0.0` ou `true` pour écouter sur toutes les adresses, y compris les réseaux locaux et les adresses publiques.

Cette option peut être définie via la CLI en utilisant `--host 0.0.0.0` ou `--host`.

::: tip REMARQUE

Il existe des cas où d'autres serveurs pourraient répondre à la place de Vite.
Consultez [`server.host`](./server-options#server-host) pour plus de détails.

:::

## preview.allowedHosts

- **Type :** `string | true`
- **Défaut :** [`server.allowedHosts`](./server-options#server-allowedhosts)

Les hostnames auxquels Vite est autorisé à répondre.

Consultez [`server.allowedHosts`](./server-options#server-allowedhosts) pour plus de détails.

## preview.port

- **Type :** `number`
- **Défaut :** `4173`

Spécifie le port du serveur. Notez que si le port est déjà utilisé, Vite essaiera automatiquement le prochain port disponible, ce ne sera donc pas forcement le port réel sur lequel le serveur finira par écouter.

**Exemple :**

```js
export default defineConfig({
  server: {
    port: 3030,
  },
  preview: {
    port: 8080,
  },
})
```

## preview.strictPort

- **Type :** `boolean`
- **Défaut :** [`server.strictPort`](./server-options#server-strictport)

Définissez sur `true` pour quitter si le port est déjà utilisé, au lieu d'essayer automatiquement le prochain port disponible.

## preview.https

- **Type :** `https.ServerOptions`
- **Défaut :** [`server.https`](./server-options#server-https)

Active TLS + HTTP/2.

Voir [`server.https`](./server-options#server-https) pour plus de détails.

## preview.open

- **Type :** `boolean | string`
- **Défaut :** [`server.open`](./server-options#server-open)

Ouvre automatiquement l'application dans le navigateur au démarrage du serveur. Lorsque la valeur est une chaîne de caractères, elle sera utilisée comme chemin de l'URL. Si vous souhaitez ouvrir le serveur dans un navigateur spécifique, vous pouvez définir la variable d'environnement `process.env.BROWSER` (par exemple `firefox`). Vous pouvez également définir `process.env.BROWSER_ARGS` pour passer des arguments supplémentaires (par exemple `--incognito`).

`BROWSER` et `BROWSER_ARGS` sont également des variables d'environnement spéciales que vous pouvez définir dans le fichier `.env` pour les configurer. Consultez [le package `open`](https://github.com/sindresorhus/open#app) pour plus de détails.

## preview.proxy

- **Type :** `Record<string, string | ProxyOptions>`
- **Défaut :** [`server.proxy`](./server-options#server-proxy)

Configure des règles de proxy personnalisées pour le serveur de prévisualisation. S'attend à un objet de paires `{ clef: options }`. Si la clef commence par `^`, elle sera interprétée comme une `RegExp`. L'option `configure` peut être utilisée pour accéder à l'instance de proxy.

Utilise [`http-proxy`](https://github.com/http-party/node-http-proxy). Options complètes [ici](https://github.com/http-party/node-http-proxy#options).

## preview.cors

- **Type :** `boolean | CorsOptions`
- **Défaut :** [`server.cors`](./server-options#server-cors)

Configure les CORS pour le serveur de prévisualisation.

Consultez [`server.cors`](./server-options#server-cors) pour plus de détails.

## preview.headers

- **Type :** `OutgoingHttpHeaders`

Spécifie les en-têtes de réponse du serveur.
