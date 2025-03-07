# Philosophie du projet

## Noyau léger et extensible


Vite ne vise pas à couvrir tous les cas d'utilisation pour tous les utilisateurs. Vite vise à soutenir les patrons les plus courants pour construire des applications Web out of the box, mais [le noyau de Vite](https://github.com/vitejs/vite) doit rester léger avec une API restreinte pour maintenir le projet pendant une longue durée. Cet objectif est possible grâce au [système de plugin basé sur Rollup de Vite](./api-plugin.md). Les fonctionnalités qui peuvent être implémentées en tant que plugins externes ne seront généralement pas ajoutées au noyau de Vite. [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) est un excellent exemple de ce que peut être atteint hors du noyau de Vite, et il existe un grand nombre de [plugins maintenus](https://github.com/vitejs/awesome-vite#plugins) pour couvrir vos besoins. Vite travaille de près avec le projet Rollup pour s'assurer que les plugins peuvent être utilisés dans les projets Rollup et Vite autant que possible, essayant de pousser les extensions nécessaires à l'API Plugin vers le haut lorsque c'est possible.

## Poussant le Web Moderne

Vite fournit des fonctionnalités avec une conviction forte qui poussent à écrire du code moderne. Par exemple :

- Le code source ne peut être écrit qu'en ESM, où les dépendances non-ESM doivent être [pré-bundlées en ESM](./dep-pre-bundling) pour fonctionner.
- Les workers web sont encouragés à être écrits avec la syntaxe [`new Worker`](./features#web-workers) pour suivre les normes modernes.
- Les modules Node.js ne peuvent pas être utilisés dans le navigateur.

Lorsque de nouvelles fonctionnalités sont ajoutées, ces patterns sont suivis pour créer une API futur-proof, qui peut ne pas toujours être compatible avec les autres outils de build.

## Une approche pragmatique pour les performances

Vite s'est concentré sur les performances depuis ses [origines](./why.md). Son architecture de serveur de développement permet un HMR qui reste rapide même lorsque les projets grandissent. Vite utilise des outils natifs comme [esbuild](https://esbuild.github.io/) et [SWC](https://github.com/vitejs/vite-plugin-react-swc) pour implémenter des tâches intensives mais garde le reste du code en JS pour équilibrer la vitesse avec la flexibilité. Lorsque nécessaire, les plugins de framework tapent sur [Babel](https://babeljs.io/) pour compiler le code utilisateur. Et pendant le build, Vite utilise actuellement [Rollup](https://rollupjs.org/) où la taille du bundling et l'accès à un large écosystème de plugins sont plus importants que la vitesse brute. Vite continuera à évoluer en interne, utilisant de nouvelles bibliothèques lorsqu'elles apparaissent pour améliorer l'expérience de développement tout en maintenant son API stable.

## Construire des frameworks sur Vite

Bien que Vite puisse être utilisé directement par les utilisateurs, il brille comme outil pour créer des frameworks. Le noyau de Vite est indépendant du framework, mais il existe des plugins élaborés pour chaque framework UI. Son [API JS](./api-javascript.md) permet aux auteurs de Framework d'utiliser les fonctionnalités de Vite pour créer des expériences adaptées à leurs utilisateurs. Vite inclut le support de [primitives SSR](./ssr.md), généralement présentes dans les outils de niveau supérieur mais fondamentales pour construire des frameworks web modernes. Les plugins Vite complètent la photo en offrant un moyen de partager entre frameworks. Vite est également un excellent fit lorsqu'il est pairé avec un [frameworks Backend](./backend-integration.md) comme [Ruby](https://vite-ruby.netlify.app/) et [Laravel](https://laravel.com/docs/10.x/vite).

## Un écosystème actif

L'évolution de Vite est une coopération entre les auteurs de framework et les mainteneurs de plugins, les utilisateurs et l'équipe Vite. Nous encouragons une participation active au développement de Vite's Core une fois que le projet adopte Vite. Nous travaillons de près avec les principaux projets de l'écosystème pour minimiser les régressions sur chaque release, aidé par des outils comme [vite-ecosystem-ci](https://github.com/vitejs/vite-ecosystem-ci). Cela nous permet de lancer le CI de projets majeurs utilisant Vite sur les PRs sélectionnés et de donner un état clair de la façon dont l'écosystème réagirait à une release. Nous nous efforçons de corriger les régressions avant qu'elles atteignent les utilisateurs et permettent aux projets de mettre à jour à la prochaine version dès qu'elles sont disponibles. Si vous travaillez avec Vite, nous vous invitons à rejoindre le [Discord de Vite](https://chat.vite.dev) et participer au projet.
