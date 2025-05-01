# Server-Side Rendering (SSR)

:::tip Note
SSR spécifiquement fait référence aux frameworks front-end (par exemple React, Preact, Vue et Svelte) qui prennent en charge l’exécution de la même application dans Node.js, le pré-rendu en HTML et enfin le hydratation sur le client. Si vous cherchez une intégration avec des serveurs traditionnels, consultez le guide [Backend Integration](./backend-integration) à la place.

Le guide suivant suppose une expérience préalable avec SSR dans votre framework de choix, et ne se concentrera que sur les détails d’intégration spécifiques à Vite.
:::

:::warning API bas niveau
Cette API est destinée aux auteurs de bibliothèques et de frameworks. Si votre objectif est de créer une application, assurez-vous de vérifier les plugins et outils SSR de niveau supérieur dans la section [Awesome Vite SSR](https://github.com/vitejs/awesome-vite#ssr) d’abord. Cela dit, de nombreuses applications sont créées avec succès directement sur la base de l’API bas niveau native de Vite.

Actuellement, Vite travaille sur une API SSR améliorée avec l’[API Environment](https://github.com/vitejs/vite/discussions/16358). Voir le lien pour plus de détails.
:::

## Exemples de projets

Vite fournit un support intégré pour le rendu côté serveur (SSR). [`create-vite-extra`](https://github.com/bluwy/create-vite-extra)contient des exemples de configurations SSR que vous pouvez utiliser comme référence pour ce guide :

- [Vanilla](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-vanilla)
- [Vue](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-vue)
- [React](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-react)
- [Preact](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-preact)
- [Svelte](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-svelte)
- [Solid](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-solid)

Vous pouvez également créer ces projets localement en [exécutant `create-vite`](./index.md#scaffolding-your-first-vite-project)et en choisissant `Others > create-vite-extra`sous l’option de framework.

## Structure du code source

Une application typique SSR aura la structure de fichiers suivante :

```
- index.html
- server.js # main application server
- src/
  - main.js          # exports env-agnostic (universal) app code
  - entry-client.js  # mounts the app to a DOM element
  - entry-server.js  # renders the app using the framework's SSR API
```

Le `index.html`doit faire référence à `entry-client.js`et inclure un espace réservé où le rendu HTML du serveur doit être injecté :

```html [index.html]
<div id="app"><!--ssr-outlet--></div>
<script type="module" src="/src/entry-client.js"></script>
```

Vous pouvez utiliser n’importe quel espace réservé que vous préférez à la place de`<!--ssr-outlet-->`, tant que cela peut être exactement remplacé.

## Logique conditionnelle

Si vous avez besoin de faire une logique conditionnelle basée sur SSR vs. client, vous pouvez utiliser

```js twoslash
import 'vite/client'
// ---cut---
if (import.meta.env.SSR) {
  // ... server only logic
}
```

Cela est statiquement remplacé lors de la construction, ce qui permet le balayage de l’arbre pour les branches non utilisées.

## Configuration du serveur de développement

Lors de la construction d’une application SSR, vous souhaiterez probablement avoir un contrôle total sur votre serveur principal et découpler Vite de l’environnement de production. Il est donc recommandé d’utiliser Vite en mode middleware. Voici un exemple avec [express](https://expressjs.com/) :

```js{15-18} twoslash [server.js]
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import { createServer as createViteServer } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function createServer() {
  const app = express()

  // Create Vite server in middleware mode and configure the app type as
  // 'custom', disabling Vite's own HTML serving logic so parent server
  // can take control
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom'
  })

  // Use vite's connect instance as middleware. If you use your own
  // express router (express.Router()), you should use router.use
  // When the server restarts (for example after the user modifies
  // vite.config.js), `vite.middlewares` is still going to be the same
  // reference (with a new internal stack of Vite and plugin-injected
  // middlewares). The following is valid even after restarts.
  app.use(vite.middlewares)

  app.use('*all', async (req, res) => {
    // serve index.html - we will tackle this next
  })

  app.listen(5173)
}

createServer()
```

Ici, `vite`est une instance de [ViteDevServer](./api-javascript#vitedevserver). `vite.middlewares`est une instance de [Connect](https://github.com/senchalabs/connect) qui peut être utilisée comme middleware dans n’importe quel framework Node.js compatible connect.

La prochaine étape est d’implémenter le gestionnaire `*`pour servir le HTML rendu côté serveur :

```js twoslash [server.js]
// @noErrors
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/** @type {import('express').Express} */
var app
/** @type {import('vite').ViteDevServer}  */
var vite

// ---cut---
app.use('*all', async (req, res, next) => {
  const url = req.originalUrl

  try {
    // 1. Read index.html
    let template = fs.readFileSync(
      path.resolve(__dirname, 'index.html'),
      'utf-8',
    )

    // 2. Apply Vite HTML transforms. This injects the Vite HMR client,
    //    and also applies HTML transforms from Vite plugins, e.g. global
    //    preambles from @vitejs/plugin-react
    template = await vite.transformIndexHtml(url, template)

    // 3. Load the server entry. ssrLoadModule automatically transforms
    //    ESM source code to be usable in Node.js! There is no bundling
    //    required, and provides efficient invalidation similar to HMR.
    const { render } = await vite.ssrLoadModule('/src/entry-server.js')

    // 4. render the app HTML. This assumes entry-server.js's exported
    //     `render` function calls appropriate framework SSR APIs,
    //    e.g. ReactDOMServer.renderToString()
    const appHtml = await render(url)

    // 5. Inject the app-rendered HTML into the template.
    const html = template.replace(`<!--ssr-outlet-->`, () => appHtml)

    // 6. Send the rendered HTML back.
    res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
  } catch (e) {
    // If an error is caught, let Vite fix the stack trace so it maps back
    // to your actual source code.
    vite.ssrFixStacktrace(e)
    next(e)
  }
})
```

Le script `dev`dans `package.json`doit également être modifié pour utiliser le script serveur à la place :

```diff [package.json]
  "scripts": {
-   "dev": "vite"
+   "dev": "node server"
  }
```

## Construction pour la production

Pour envoyer un projet SSR pour la production, nous avons besoin de :

1. Produire un build client normal ;
2. Produire un build SSR, qui peut être directement chargé via `import()`afin de ne pas passer par `ssrLoadModule`de Vite ;

Nos scripts dans `package.json`ressembleront à ceci :

```json [package.json]
{
  "scripts": {
    "dev": "node server",
    "build:client": "vite build --outDir dist/client",
    "build:server": "vite build --outDir dist/server --ssr src/entry-server.js"
  }
}
```

Notez le drapeau `--ssr`qui indique que c’est un build SSR. Il doit également spécifier l’entrée SSR.

Ensuite, dans `server.js`nous devons ajouter une logique spécifique à la production en vérifiant `process.env.NODE_ENV`:

- Au lieu de lire la `index.html`racine, utilisez-le `dist/client/index.html`comme template, car il contient les liens de ressources corrects vers le build client.

- Au lieu de`await vite.ssrLoadModule('/src/entry-server.js')`, utilisez `import('./dist/server/entry-server.js')`(ce fichier est le résultat du build SSR).

- Déplacez la création et toutes les utilisations de l’instance `vite`du serveur de développement derrière des branches conditionnelles dev-only, puis ajoutez des middlewares de serveur de fichiers statiques pour servir les fichiers de`dist/client`.

Consultez les [exemples de projets](#exemples-de-projets) pour un exemple de configuration.

## Génération de directives de préchargement

`vite build` Prend en charge le flag `--ssrManifest`qui générera `dist/client/.vite/ssr-manifest.json`pour le build client (oui, le manifeste SSR est généré à partir du build client, car nous voulons mapper les identifiants de module aux fichiers clients). Le manifeste contient des mappages des identifiants de module à leurs chunks et fichiers d’actifs associés.
- "build:client": "vite build --outDir dist/client",
+ "build:client": "vite build --outDir dist/client --ssrManifest",
```

Le script ci-dessus générera maintenant `dist/client/.vite/ssr-manifest.json` pour le build client (Oui, le manifeste SSR est généré à partir du build client car nous voulons mapper les identifiants de module aux fichiers clients). Le manifeste contient des mappages des identifiants de module à leurs chunks et fichiers d’actifs associés.

Pour tirer parti du manifeste, les frameworks doivent fournir une façon de collecter les identifiants de module des composants utilisés lors d’un appel de rendu côté serveur.

`@vitejs/plugin-vue` prend en charge cela de manière intégrée et enregistre automatiquement les identifiants de module des composants utilisés lors d’un appel de rendu côté serveur sur le contexte SSR associé à Vue:

```js [src/entry-server.js]
const ctx = {}
const html = await vueServerRenderer.renderToString(app, ctx)
// ctx.modules est maintenant un Set d’identifiants de module qui ont été utilisés lors du rendu
```

Dans la branche de production de `server.js` nous devons lire et passer le manifeste à la fonction `render` exportée par `src/entry-server.js`. Cela nous fournira suffisamment d’informations pour rendre les directives de préchargement pour les fichiers utilisés par les routes asynchrones ! Voir [source de démo](https://github.com/vitejs/vite-plugin-vue/blob/main/playground/ssr-vue/src/entry-server.js) pour un exemple complet. Vous pouvez également utiliser ces informations pour le code de statut [103 Early Hints](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/103).

## Pré-rendu / SSG

Si les routes et les données nécessaires pour certaines routes sont connues à l’avance, nous pouvons pré-rendre ces routes en HTML statique en utilisant la même logique que le SSR de production. Cela peut également être considéré comme une forme de génération de site statique (SSG). Voir [script de pré-rendu de démo](https://github.com/vitejs/vite-plugin-vue/blob/main/playground/ssr-vue/prerender.js) pour un exemple de travail.

## SSR Externals

Les dépendances sont « externalisées » par défaut du système de transformation de module SSR de Vite lors de l’exécution du SSR. Cela accélère à la fois le développement et le build.

Si une dépendance doit être transformée par le pipeline de Vite, par exemple, parce que des fonctionnalités Vite sont utilisées non transpilées dans celles-ci, elles peuvent être ajoutées à [`ssr.noExternal`](../config/ssr-options.md#ssr-noexternal).

Pour les dépendances liées, elles ne sont pas externalisées par défaut pour tirer parti de Vite's HMR. Si cela n'est pas souhaité, par exemple, pour tester les dépendances comme si elles ne sont pas liées, vous pouvez l'ajouter à [`ssr.external`](../config/ssr-options.md#ssr-external).

:::warning Travailler avec des alias
Si vous avez configuré des alias qui redirigent un package vers un autre, vous souhaiterez peut-être aliaser les packages `node_modules` réels au lieu de cela pour que cela fonctionne pour les dépendances externalisées SSR. Les deux [Yarn](https://classic.yarnpkg.com/en/docs/cli/add/#toc-yarn-add-alias) et [pnpm](https://pnpm.io/aliases/) prennent en charge l'aliasage via le préfixe `npm:`.
:::

## Logique de plugin SSR spécifique

Certains frameworks tels que Vue ou Svelte compilent les composants en différents formats en fonction du client vs. SSR. Pour prendre en charge les transformations conditionnelles, Vite passe une propriété supplémentaire `ssr` dans l'objet `options` des hooks de plugin suivants :

- `resolveId`
- `load`
- `transform`

**Exemple:**

```js twoslash
/** @type {() => import('vite').Plugin} */
// ---cut---
export function mySSRPlugin() {
  return {
    name: 'my-ssr',
    transform(code, id, options) {
      if (options?.ssr) {
        // perform ssr-specific transform...
      }
    },
  }
}
```

L'objet `options` dans `load` et `transform` est optionnel, rollup n'utilise pas actuellement cet objet mais pourrait étendre ces hooks avec des métadonnées supplémentaires dans le futur.

:::tip Note
Avant Vite 2.7, cela était informé aux hooks de plugin avec un paramètre positionnel `ssr` au lieu de l'objet `options`. Tous les principaux frameworks et plugins sont mis à jour mais vous pouvez trouver des articles obsolètes utilisant l'API précédente.
:::

## Cible SSR

La cible par défaut pour le build SSR est un environnement node, mais vous pouvez également exécuter le serveur dans un Web Worker. La résolution des entrées des packages est différente pour chaque plateforme. Vous pouvez configurer la cible pour être un Web Worker en définissant `ssr.target` à `'webworker'`.

## Bundle SSR

Dans certains cas comme les runtimes `webworker`, vous souhaiterez peut-être regrouper votre build SSR en un seul fichier JavaScript. Vous pouvez activer ce comportement en définissant `ssr.noExternal` à `true`. Cela fera deux choses :

- Traiter toutes les dépendances comme `noExternal`
- Lancer une erreur si des built-ins Node.js sont importés

## Conditions de résolution SSR

La résolution des entrées des packages utilisera par défaut les conditions définies dans [`resolve.conditions`](../config/shared-options.md#resolve-conditions) pour le build SSR. Vous pouvez utiliser [`ssr.resolve.conditions`](../config/ssr-options.md#ssr-resolve-conditions) et [`ssr.resolve.externalConditions`](../config/ssr-options.md#ssr-resolve-externalconditions) pour personnaliser ce comportement.

## CLI Vite

Les commandes CLI `$ vite dev` et `$ vite preview` peuvent également être utilisées pour les applications SSR. Vous pouvez ajouter vos middlewares SSR au serveur de développement avec [`configureServer`](/guide/api-plugin#configureserver) et au serveur de prévisualisation avec [`configurePreviewServer`](/guide/api-plugin#configurepreviewserver).

:::tip Note
Utilisez un hook post pour que votre middleware SSR s'exécute _après_ les middlewares de Vite.
:::
