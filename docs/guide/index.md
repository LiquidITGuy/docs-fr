# Bien démarrer

<audio id="vite-audio">
  <source src="/vite.mp3" type="audio/mpeg">
</audio>

## Vue d'ensemble

Vite est un outil de build qui vise à offrir une expérience de développement plus rapide et plus légère pour les projets web modernes. Il se compose de deux parties principales :

- Un serveur de développement qui propose [des améliorations riches en fonctionnalités](./features) par rapport aux [modules ES natifs](https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Modules), par exemple un [Remplacement de Module à Chaud (HMR)](./features#hot-module-replacement) extrêmement rapide.

- Une commande de build qui bundle votre code avec [Rollup](https://rollupjs.org), préconfigurée pour produire des ressources statiques hautement optimisées pour la production.

Vite est opiniâtre et propose des valeurs par défaut sensées dès le départ. Découvrez ce qui est possible dans le [Guide des Fonctionnalités](./features). Le support pour les frameworks ou l'intégration avec d'autres outils est possible grâce aux [Plugins](./using-plugins). La [Section de Configuration](../config/) explique comment adapter Vite à votre projet si nécessaire.

Vite est également hautement extensible via son [API de Plugin](./api-plugin) et son [API JavaScript](./api-javascript) avec un support complet des types.

Vous pouvez en apprendre davantage sur la logique derrière le projet dans la section [Pourquoi Vite](./why).

## Compatibilité avec les navigateurs

Pendant le développement, Vite définit [`esnext` comme cible de transformation](https://esbuild.github.io/api/#target), car nous supposons qu'un navigateur moderne est utilisé et qu'il prend en charge toutes les dernières fonctionnalités JavaScript et CSS. Cela évite la réduction de la syntaxe, permettant à Vite de servir les modules aussi près que possible du code source original.

Pour le build de production, par défaut, Vite cible les navigateurs qui prennent en charge le JavaScript moderne, tels que les [modules ES natifs](https://caniuse.com/es6-module), [l'importation dynamique de modules ES natifs](https://caniuse.com/es6-module-dynamic-import), [`import.meta`](https://caniuse.com/mdn-javascript_operators_import_meta), [les Opérateurs de coalescence des nuls (Nullish coalescing operator)](https://caniuse.com/mdn-javascript_operators_nullish_coalescing) et [BigInt](https://caniuse.com/bigint). Les navigateurs plus anciens peuvent être pris en charge via le plugin officiel [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy). Voir la section [Build pour la Production](./build) pour plus de détails.

## Essayer Vite en ligne

Vous pouvez essayer Vite en ligne sur [StackBlitz](https://vite.new/). Il exécute la configuration de build basée sur Vite directement dans le navigateur, elle est donc presque identique à la configuration locale mais ne nécessite pas d'installer quoi que ce soit sur votre machine. Vous pouvez naviguer vers `vite.new/{template}` pour sélectionner le framework à utiliser.

Les modèles prédéfinis pris en charge sont :

|             JavaScript              |                TypeScript                 |
| :---------------------------------: | :---------------------------------------: |
| [vanilla](https://vite.new/vanilla) | [vanilla-ts](https://vite.new/vanilla-ts) |
|     [vue](https://vite.new/vue)     |     [vue-ts](https://vite.new/vue-ts)     |
|   [react](https://vite.new/react)   |   [react-ts](https://vite.new/react-ts)   |
|  [preact](https://vite.new/preact)  |  [preact-ts](https://vite.new/preact-ts)  |
|     [lit](https://vite.new/lit)     |     [lit-ts](https://vite.new/lit-ts)     |
|  [svelte](https://vite.new/svelte)  |  [svelte-ts](https://vite.new/svelte-ts)  |
|   [solid](https://vite.new/solid)   |   [solid-ts](https://vite.new/solid-ts)   |
|    [qwik](https://vite.new/qwik)    |    [qwik-ts](https://vite.new/qwik-ts)    |

## Créer votre premier projet Vite

::: tip Note de compatibilité
Vite nécessite [Node.js](https://nodejs.org/fr/) version 18+ ou 20+. Cependant, certains modèles nécessitent une version Node.js supérieure pour fonctionner, veuillez effectuer une mise à niveau si votre gestionnaire de paquets vous en avertit.
:::

::: code-group

```bash [npm]
$ npm create vite@latest
```

```bash [Yarn]
$ yarn create vite
```

```bash [pnpm]
$ pnpm create vite
```

```bash [Bun]
$ bun create vite
```

```bash [Deno]
$ deno init --npm vite
```

:::

Puis suivez les instructions !

Vous pouvez également spécifier directement le nom du projet et le modèle que vous souhaitez utiliser via des options supplémentaires en ligne de commande. Par exemple, pour créer un projet Vite + Vue, exécutez :

::: code-group

```bash [npm]
# npm 7+, double tiret supplémentaire nécessaire :
$ npm create vite@latest my-vue-app -- --template vue
```

```bash [Yarn]
$ yarn create vite my-vue-app --template vue
```

```bash [pnpm]
$ pnpm create vite my-vue-app --template vue
```

```bash [Bun]
$ bun create vite my-vue-app --template vue
```

```bash [Deno]
$ deno init --npm vite my-vue-app --template vue
```

:::

Voir [create-vite](https://github.com/vitejs/vite/tree/main/packages/create-vite) pour plus de détails sur chaque modèle pris en charge : `vanilla`, `vanilla-ts`, `vue`, `vue-ts`, `react`, `react-ts`, `react-swc`, `react-swc-ts`, `preact`, `preact-ts`, `lit`, `lit-ts`, `svelte`, `svelte-ts`, `solid`, `solid-ts`, `qwik`, `qwik-ts`.

Vous pouvez utiliser `.` comme nom de projet pour créer le projet dans le répertoire courant.

## Templates de la communauté

create-vite est un outil pour démarrer rapidement un projet à partir d'un modèle de base pour les frameworks populaires. Consultez Awesome Vite pour les [modèles maintenus par la communauté](https://github.com/vitejs/awesome-vite#templates) qui incluent d'autres outils ou ciblent différents frameworks.

Pour un modèle situé sur `https://github.com/user/project`, vous pouvez l'essayer en ligne en utilisant `https://github.stackblitz.com/user/project` (en ajoutant `.stackblitz` après `github` à l'URL du projet).

Vous pouvez également utiliser un outil comme [degit](https://github.com/Rich-Harris/degit) pour créer votre projet avec l'un des modèles. En supposant que le projet soit sur GitHub et utilise `main` comme branche par défaut, vous pouvez créer une copie locale en utilisant :

```bash
npx degit user/project#main my-project
cd my-project

npm install
npm run dev
```

## Installation manuelle

Dans votre projet, vous pouvez installer l'interface en ligne de commande `vite` en utilisant :

::: code-group

```bash [npm]
$ npm install -D vite
```

```bash [Yarn]
$ yarn add -D vite
```

```bash [pnpm]
$ pnpm add -D vite
```

```bash [Bun]
$ bun add -D vite
```

```bash [Deno]
$ deno add -D npm:vite
```

:::

Et créer un fichier `index.html` comme celui-ci :

```html
<p>Hello Vite!</p>
```

Ensuite, exécutez la commande CLI appropriée dans votre terminal :

::: code-group

```bash [npm]
$ npx vite
```

```bash [Yarn]
$ yarn vite
```

```bash [pnpm]
$ pnpm vite
```

```bash [Bun]
$ bunx vite
```

```bash [Deno]
$ deno run -A npm:vite
```

:::

Le fichier `index.html` sera servi sur `http://localhost:5173`.

## `index.html` et racine du projet

Une chose que vous avez peut-être remarquée est que dans un projet Vite, `index.html` est au centre de l'attention au lieu d'être caché dans `public`. C'est intentionnel : pendant le développement, Vite est un serveur, et `index.html` est le point d'entrée de votre application.

Vite traite `index.html` comme du code source et fait partie du graphe de modules. Il résout les `<script type="module" src="...">` qui référencent votre code source JavaScript. Même les `<script type="module">` en ligne et les CSS référencés via `<link href>` bénéficient également des fonctionnalités spécifiques à Vite. De plus, les URL à l'intérieur de `index.html` sont automatiquement rebasées, donc il n'est pas nécessaire d'utiliser des espaces réservés spéciaux comme `%PUBLIC_URL%`.

Comme les serveurs http statiques, Vite a le concept d'un "répertoire racine" à partir duquel vos fichiers sont servis. Vous le verrez référencé comme `<root>` dans le reste de la documentation. Les URL absolues dans votre code source seront résolues en utilisant la racine du projet comme base, vous pouvez donc écrire du code comme si vous travailliez avec un serveur de fichiers statiques normal (sauf qu'il est beaucoup plus puissant !). Vite est également capable de gérer des dépendances qui se résolvent vers des emplacements de système de fichiers en dehors de la racine, ce qui le rend utilisable même dans une configuration basée sur un monorepo.

Vite prend également en charge les [applications multi-pages](./build#multi-page-app) avec plusieurs points d'entrée `.html`.

#### Spécifier une racine alternative

L'exécution de `vite` démarre le serveur de développement en utilisant le répertoire de travail courant comme racine. Vous pouvez spécifier une racine alternative avec `vite serve some/sub/dir`.
Notez que Vite résoudra également [son fichier de configuration (par exemple `vite.config.js`)](/config/#configuring-vite) à l'intérieur de la racine du projet, donc vous devrez le déplacer si la racine est modifiée.

## Interface en ligne de commande

Dans un projet où Vite est installé, vous pouvez utiliser le binaire `vite` dans vos scripts npm, ou l'exécuter directement avec `npx vite`. Voici les scripts npm par défaut dans un projet Vite scaffoldé :

<!-- prettier-ignore -->
```json [package.json]
{
  "scripts": {
    "dev": "vite", // démarrer le serveur de développement, alias : `vite dev`, `vite serve`
    "build": "vite build", // construire pour la production
    "preview": "vite preview" // prévisualiser localement le build de production
  }
}
```

Vous pouvez spécifier des options CLI supplémentaires comme `--port` ou `--open`. Pour une liste complète des options CLI, exécutez `npx vite --help` dans votre projet.

En savoir plus sur l'[Interface en Ligne de Commande](./cli.md)

## Utilisation des commits non publiés

Si vous ne pouvez pas attendre une nouvelle version pour tester les dernières fonctionnalités, vous pouvez installer un commit spécifique de Vite avec https://pkg.pr.new :

::: code-group

```bash [npm]
$ npm install -D https://pkg.pr.new/vite@SHA
```

```bash [Yarn]
$ yarn add -D https://pkg.pr.new/vite@SHA
```

```bash [pnpm]
$ pnpm add -D https://pkg.pr.new/vite@SHA
```

```bash [Bun]
$ bun add -D https://pkg.pr.new/vite@SHA
```

:::

Remplacez `SHA` par l'un des [SHAs de commit de Vite](https://github.com/vitejs/vite/commits/main/). Notez que seuls les commits du dernier mois fonctionneront, car les versions de commits plus anciennes sont purgées.

Alternativement, vous pouvez également cloner le [dépôt vite](https://github.com/vitejs/vite) sur votre machine locale, puis le construire et le lier vous-même ([pnpm](https://pnpm.io/) est requis) :

```bash
git clone https://github.com/vitejs/vite.git
cd vite
pnpm install
cd packages/vite
pnpm run build
pnpm link --global # utilisez votre gestionnaire de paquets préféré pour cette étape
```

Ensuite, allez dans votre projet basé sur Vite et exécutez `pnpm link --global vite` (ou le gestionnaire de paquets que vous avez utilisé pour lier `vite` globalement). Redémarrez maintenant le serveur de développement pour profiter de la version de pointe !

::: tip Dépendances utilisant Vite
Pour remplacer la version de Vite utilisée par les dépendances de manière transitive, vous devriez utiliser [les surcharges npm](https://docs.npmjs.com/cli/v11/configuring-npm/package-json#overrides) ou [les surcharges pnpm](https://pnpm.io/package_json#pnpmoverrides).
:::

## Communauté

Si vous avez des questions ou besoin d'aide, contactez la communauté sur [Discord](https://chat.vite.dev) et [GitHub Discussions](https://github.com/vitejs/vite/discussions).
