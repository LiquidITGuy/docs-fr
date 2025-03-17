# Plugins

:::tip NOTE
Vite fournit un support intégré pour les cas de figure courants de développement web. Avant de rechercher un plugin Vite ou compatible avec Rollup, consultez le [Guide des fonctionnalités](../guide/features.md). La plupart des cas où un plugin serait nécessaire dans un projet Rollup sont déjà couverts dans Vite.
:::

Consultez le [Guide sur l'utilisation des plugins](../guide/using-plugins) pour plus d'informations sur l'utilisation des plugins.

## Plugins officiels

### [@vitejs/plugin-vue](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue)

- Fournit le support des composants de fichier unique Vue 3.

### [@vitejs/plugin-vue-jsx](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue-jsx)

- Fournit le support des JSX Vue 3 (via [transformateur Babel dédié](https://github.com/vuejs/jsx-next)).

### [@vitejs/plugin-vue2](https://github.com/vitejs/vite-plugin-vue2)

- Fournit le support des composants de fichier unique Vue 2.7.

### [@vitejs/plugin-vue2-jsx](https://github.com/vitejs/vite-plugin-vue2-jsx)

- Fournit le support des JSX Vue 2.7 (via [transformateur Babel dédié](https://github.com/vuejs/jsx-vue2/)).

### [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react)

- Utilise esbuild et Babel, atteignant un HMR rapide avec une faible empreinte de package et la flexibilité de pouvoir utiliser le pipeline de transformation Babel. Sans plugins Babel supplémentaires, seul esbuild est utilisé lors des builds.

### [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc)

- Remplace Babel par SWC lors du développement. Lors des builds en production, SWC+esbuild sont utilisés lorsque des plugins sont utilisés, et esbuild seulement sinon. Pour les gros projets qui n'ont pas besoin d'extensions React non standard, le démarrage froid et le Hot Module Replacement (HMR) peuvent être significativement plus rapides.

### [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy)

- Fournit le support des navigateurs obsolètes pour le build en production.

## Plugins de la communauté

Consultez [awesome-vite](https://github.com/vitejs/awesome-vite#plugins) - vous pouvez également soumettre une PR pour lister vos plugins là-bas.

## Plugins Rollup

Les [plugins Vite](../guide/api-plugin) sont une extension de l'interface de plugin Rollup. Consultez la section [Compatibilité des plugins Rollup](../guide/api-plugin#compatibilité-des-plugins-rollup) pour plus d'informations.
