# Options d'optimisation de dépendances

- **Connexe :** [Pré-building des dépendances](/guide/dep-pre-bundling)

Sauf mention contraire, les options de cette section ne s'appliquent qu'à l'optimiseur de dépendances, qui n'est utilisé qu'en développement.

## optimizeDeps.entries

- **Type :** `string | string[]`

Par défaut, Vite parcourt tous vos fichiers `.html` pour détecter les dépendances qui doivent être pré-buildé (en ignorant `node_modules`, `build.outDir`, `__tests__` et `coverage`). Si `build.rollupOptions.input` est spécifié, Vite parcourra ces points d'entrée à la place.

Si aucune de ces options ne correspond à vos besoins, vous pouvez spécifier des entrées personnalisées en utilisant cette option - la valeur doit être un [modèle `tinyglobby`](https://github.com/SuperchupuDev/tinyglobby) ou un tableau de pattern relatifs à la racine du projet Vite. Cela écrasera l'inférence d'entrées par défaut. Seuls les dossiers `node_modules` et `build.outDir` seront ignorés par défaut lorsque `optimizeDeps.entries` est explicitement défini. Si d'autres dossiers doivent être ignorés, vous pouvez utiliser un modèle d'ignore dans la liste des entrées, marqué par un `!` initial. Si vous ne souhaitez pas ignorer `node_modules` et `build.outDir`, vous pouvez spécifier en utilisant des chemins de chaînes littérales (sans pattern `tinyglobby`) à la place.

## optimizeDeps.exclude

- **Type :** `string[]`

Dépendances à exclure du pré-building.

:::warning CommonJS
Les dépendances CommonJS ne doivent pas être exclues de l'optimisation. Si une dépendance ESM est exclue de l'optimisation, mais possède une dépendance CommonJS imbriquée, la dépendance CommonJS doit être ajoutée à `optimizeDeps.include`. Exemple :

```js twoslash
import { defineConfig } from 'vite'
// ---cut---
export default defineConfig({
  optimizeDeps: {
    include: ['esm-dep > cjs-dep'],
  },
})
```

:::

## optimizeDeps.include

- **Type :** `string[]`

Par défaut, les packages liés qui ne sont pas dans `node_modules` ne sont pas pré-buildés. Utilisez cette option pour forcer un package lié à être pré-buildés.

**Expérimental :** Si vous utilisez une bibliothèque avec de nombreux imports profonds, vous pouvez également spécifier un modèle glob à la fin pour pré-builder toutes les importations profondes en une seule fois. Cela évitera de constamment pré-builder chaque fois qu'un nouvel importat profond est utilisé. [Donnez votre avis](https://github.com/vitejs/vite/discussions/15833). Par exemple :

```js twoslash
import { defineConfig } from 'vite'
// ---cut---
export default defineConfig({
  optimizeDeps: {
    include: ['my-lib/components/**/*.vue'],
  },
})
```

## optimizeDeps.esbuildOptions

- **Type :** [`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)`<`[`EsbuildBuildOptions`](https://esbuild.github.io/api/#general-options)`,
| 'bundle'
| 'entryPoints'
| 'external'
| 'write'
| 'watch'
| 'outdir'
| 'outfile'
| 'outbase'
| 'outExtension'
| 'metafile'>`

Options à transmettre à esbuild pendant l'analyse et l'optimisation des dépendances.

Certaines options sont omises car leur modification ne serait pas compatible avec l'optimisation des dépendances de Vite.

- `external` est également omis, utilisez l'option `optimizeDeps.exclude` de Vite
- Les `plugins` sont fusionnés avec le plugin de dépendances de Vite

## optimizeDeps.force

- **Type :** `boolean`

Définissez sur `true` pour forcer le pré-building des dépendances, en ignorant les dépendances optimisées précédemment mises en cache.

## optimizeDeps.holdUntilCrawlEnd

- **Expérimental :** [Donnez votre avis](https://github.com/vitejs/vite/discussions/15834)
- **Type :** `boolean`
- **Défaut :** `true`

Lorsqu'elle est activée, cette option retient les premiers résultats des dépendances optimisées jusqu'à ce que toutes les importations statiques soient parcourues au démarrage à froid. Cela évite la nécessité de rechargements complets de page lorsque de nouvelles dépendances sont découvertes et qu'elles déclenchent la génération de nouveaux fragments communs. Si toutes les dépendances sont trouvées par le scanner plus celles explicitement définies dans `include`, il est préférable de désactiver cette option pour permettre au navigateur de traiter plus de requêtes en parallèle.

## optimizeDeps.disabled

- **Déprécié**
- **Expérimental :** [Donnez votre avis](https://github.com/vitejs/vite/discussions/13839)
- **Type :** `boolean | 'build' | 'dev'`
- **Défaut :** `'build'`

Cette option est dépréciée. Depuis Vite 5.1, le pré-build des dépendances pendant la construction a été supprimé. Définir `optimizeDeps.disabled` sur `true` ou `'dev'` désactive l'optimiseur, et le configurer sur `false` ou `'build'` laisse l'optimiseur activé pendant le développement.

Pour désactiver complètement l'optimiseur, utilisez `optimizeDeps.noDiscovery: true` pour interdire la découverte automatique des dépendances et laissez `optimizeDeps.include` non défini ou vide.

:::warning
L'optimisation des dépendances pendant la phase de build était une fonctionnalité **expérimentale**. Les projets essayant cette stratégie ont également supprimé `@rollup/plugin-commonjs` en utilisant `build.commonjsOptions: { include: [] }`. Si vous l'avez utilisé, un avertissement vous guidera pour le réactiver afin de prendre en charge les packages CJS uniquement pendant le build.
:::

## optimizeDeps.needsInterop

- **Expérimental**
- **Type :** `string[]`

Force l'interopérabilité ESM lors de l'importation de ces dépendances. Vite est capable de détecter correctement quand une dépendance a besoin d'interopérabilité, donc cette option n'est généralement pas nécessaire. Cependant, différentes combinaisons de dépendances pourraient amener certaines d'entre elles à être pré-buildé différemment. Ajouter ces packages à `needsInterop` peut accélérer le démarrage à froid en évitant les rechargements complets de page. Vous recevrez un avertissement si c'est le cas pour l'une de vos dépendances, suggérant d'ajouter le nom du package à ce tableau dans votre configuration.
