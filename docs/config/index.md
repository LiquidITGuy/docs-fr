---
title: Configurer Vite
---

# Configurer Vite

Lorsque vous exécutez `vite` depuis la ligne de commande, Vite essaiera automatiquement de trouver un fichier de configuration nommé `vite.config.js` dans la [racine du projet](/guide/#index-html-and-project-root) (les autres extensions JS et TS sont également prises en charge).

Le fichier de configuration le plus basique ressemble à ceci :

```js [vite.config.js]
export default {
  // options de configuration
}
```

Notez que Vite prend en charge l'utilisation de la syntaxe des modules ES dans le fichier de configuration, même si le projet n'utilise pas les modules ESM natifs de Node, par exemple `type: "module"` dans `package.json`. Dans ce cas, le fichier de configuration est automatiquement prétraité avant d'être chargé.

Vous pouvez également spécifier explicitement un fichier de configuration à utiliser avec l'option CLI `--config` (résolu de manière relative à `cwd`) :

```bash
vite --config ma-config.js
```

::: tip CHARGEMENT DE LA CONFIGURATION
Par défaut, Vite utilise `esbuild` pour empaqueter la configuration dans un fichier temporaire et le charger. Cela peut causer des problèmes lors de l'importation de fichiers TypeScript dans un monorepo. Si vous rencontrez des problèmes avec cette approche, vous pouvez spécifier `--configLoader runner` pour utiliser le [module runner](/guide/api-environment-runtimes.html#modulerunner) à la place, qui ne créera pas de configuration temporaire et transformera les fichiers à la volée. Notez que le module runner ne prend pas en charge CJS dans les fichiers de configuration, mais les paquets CJS externes devraient fonctionner comme d'habitude.

Alternativement, si vous utilisez un environnement qui prend en charge TypeScript (par exemple `node --experimental-strip-types`), ou si vous n'écrivez que du JavaScript simple, vous pouvez spécifier `--configLoader native` pour utiliser l'environnement d'exécution natif pour charger le fichier de configuration. Notez que les mises à jour des modules importés par le fichier de configuration ne sont pas détectées et ne redémarreront donc pas automatiquement le serveur Vite.
:::

## Configurer Intellisense

Comme Vite est livré avec des typages TypeScript, vous pouvez profiter de l'intellisense de votre IDE avec des indications de type jsdoc :

```js
/** @type {import('vite').UserConfig} */
export default {
  // ...
}
```

Alternativement, vous pouvez utiliser l'assistant `defineConfig` qui devrait fournir l'intellisense sans avoir besoin d'annotations jsdoc :

```js
import { defineConfig } from 'vite'

export default defineConfig({
  // ...
})
```

Vite prend également en charge les fichiers de configuration TypeScript. Vous pouvez utiliser `vite.config.ts` avec la fonction d'assistance `defineConfig` ci-dessus, ou avec l'opérateur `satisfies` :

```ts
import type { UserConfig } from 'vite'

export default {
  // ...
} satisfies UserConfig
```

## Configuration conditionnelle

Si la configuration doit déterminer conditionnellement des options en fonction de la commande (`serve` ou `build`), du [mode](/guide/env-and-mode#modes) utilisé, s'il s'agit d'une construction SSR (`isSsrBuild`), ou de la prévisualisation de la construction (`isPreview`), elle peut exporter une fonction à la place :

```js twoslash
import { defineConfig } from 'vite'
// ---cut---
export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
  if (command === 'serve') {
    return {
      // configuration spécifique au développement
    }
  } else {
    // command === 'build'
    return {
      // configuration spécifique à la construction
    }
  }
})
```

Il est important de noter que dans l'API de Vite, la valeur de `command` est `serve` pendant le développement (dans la CLI [`vite`](/guide/cli#vite), `vite dev`, et `vite serve` sont des alias), et `build` lors de la construction pour la production ([`vite build`](/guide/cli#vite-build)).

`isSsrBuild` et `isPreview` sont des arguments optionnels supplémentaires pour différencier le type de commandes `build` et `serve` respectivement. Certains outils qui chargent la configuration Vite peuvent ne pas prendre en charge ces arguments et passeront `undefined` à la place. Par conséquent, il est recommandé d'utiliser une comparaison explicite avec `true` et `false`.

## Configuration asynchrone

Si la configuration doit appeler des fonctions asynchrones, elle peut exporter une fonction asynchrone à la place. Cette fonction asynchrone peut également être passée par `defineConfig` pour une meilleure prise en charge de l'intellisense :

```js twoslash
import { defineConfig } from 'vite'
// ---cut---
export default defineConfig(async ({ command, mode }) => {
  const data = await asyncFunction()
  return {
    // configuration vite
  }
})
```

## Utilisation des variables d'environnement dans la configuration

Les variables d'environnement peuvent être obtenues à partir de `process.env` comme d'habitude.

Notez que Vite ne charge pas les fichiers `.env` par défaut car les fichiers à charger ne peuvent être déterminés qu'après avoir évalué la configuration Vite, par exemple, les options `root` et `envDir` affectent le comportement de chargement. Cependant, vous pouvez utiliser l'assistant exporté `loadEnv` pour charger le fichier `.env` spécifique si nécessaire.

```js twoslash
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  // Charge le fichier d'environnement basé sur `mode` dans le répertoire de travail actuel.
  // Définit le troisième paramètre à '' pour charger tous les env indépendamment
  // du préfixe `VITE_`.
  const env = loadEnv(mode, process.cwd(), '')
  return {
    // configuration vite
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },
  }
})
```

## Debugging the Config File on VS Code

With the default `--configLoader bundle` behavior, Vite writes the generated temporary configuration file to the `node_modules/.vite-temp` folder and a file not found error will occur when setting breakpoint debugging in the Vite config file. To fix the issue, add the following configuration to `.vscode/settings.json`:

```json
{
  "debug.javascript.terminalOptions": {
    "resolveSourceMapLocations": [
      "${workspaceFolder}/**",
      "!**/node_modules/**",
      "**/node_modules/.vite-temp/**"
    ]
  }
}
```
