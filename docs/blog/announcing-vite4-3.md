---
title: Vite 4.3 est sorti !
author:
  name: L'équipe Vite
date: 2023-04-20
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Annonce de Vite 4.3
  - - meta
    - property: og:image
      content: https://fr.vite.dev/og-image-announcing-vite4-3.png
  - - meta
    - property: og:url
      content: https://fr.vite.dev/blog/announcing-vite4-3
  - - meta
    - property: og:description
      content: Annonce de la sortie de Vite 4.3
  - - meta
    - name: twitter:card
      content: summary_large_image
---

# Vite 4.3 est sorti !

_20 avril 2023_

![Image de couverture de l'annonce de Vite 4.3](/og-image-announcing-vite4-3.png)

Liens rapides :

- Docs: [English](/), [简体中文](https://cn.vite.dev/), [日本語](https://ja.vite.dev/), [Español](https://es.vite.dev/), [Português](https://pt.vite.dev/)
- [Vite 4.3 Changelog](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#430-2023-04-20)

## Améliorations des performances

Dans cette majeure, nous nous sommes concentrés sur l'amélioration des performances du serveur de développement. La logique de résolution a été simplifiée, améliorant les chemins de hot path et implémentant un cache plus intelligent pour trouver `package.json`, les fichiers de configuration TS et les URL résolues en général.

Vous pouvez lire un guide détaillé de l'amélioration des performances dans cet article de blog par un contributeur de Vite : [Comment nous avons rendu Vite 4.3 plus rapide 🚀](https://sun0day.github.io/blog/vite/why-vite4_3-is-faster.html).

Ce sprint a abouti à des améliorations de performances sur tous les tableaux comparé à Vite 4.2.

Ces sont les améliorations de performances mesurées par [sapphi-red/performance-compare](https://github.com/sapphi-red/performance-compare), qui teste une application avec 1000 composants React froids et chauds et les temps de démarrage du serveur de développement ainsi que les temps de HMR pour un composant racine et un composant feuille :

| **Vite (babel)**   |  Vite 4.2 | Vite 4.3 | Amélioration |
| :----------------- | --------: | -------: | ----------: |
| **dev cold start** | 17249.0ms | 5132.4ms |      -70.2% |
| **dev warm start** |  6027.8ms | 4536.1ms |      -24.7% |
| **Root HMR**       |    46.8ms |   26.7ms |      -42.9% |
| **Leaf HMR**       |    27.0ms |   12.9ms |      -52.2% |

| **Vite (swc)**     |  Vite 4.2 | Vite 4.3 | Amélioration |
| :----------------- | --------: | -------: | ----------: |
| **dev cold start** | 13552.5ms | 3201.0ms |      -76.4% |
| **dev warm start** |  4625.5ms | 2834.4ms |      -38.7% |
| **Root HMR**       |    30.5ms |   24.0ms |      -21.3% |
| **Leaf HMR**       |    16.9ms |   10.0ms |      -40.8% |

![Comparaison des temps de démarrage de Vite 4.3 vs 4.2](/vite4-3-startup-time.png)

![Comparaison des temps de HMR de Vite 4.3 vs 4.2](/vite4-3-hmr-time.png)

Vous pouvez en savoir plus sur le benchmark [ici](https://gist.github.com/sapphi-red/25be97327ee64a3c1dce793444afdf6e). Spécifications et versions pour cette exécution de performance :

- CPU: Ryzen 9 5900X, Memory: DDR4-3600 32GB, SSD: WD Blue SN550 NVME SSD
- Windows 10 Pro 21H2 19044.2846
- Node.js 18.16.0
- Vite and React Plugin versions
  - Vite 4.2 (babel): Vite 4.2.1 + plugin-react 3.1.0
  - Vite 4.3 (babel): Vite 4.3.0 + plugin-react 4.0.0-beta.1
  - Vite 4.2 (swc): Vite 4.2.1 + plugin-react-swc 3.2.0
  - Vite 4.3 (swc): Vite 4.3.0 + plugin-react-swc 3.3.0

Les early adopters ont également signalé une amélioration des temps de démarrage du serveur de développement de 1.5x à 2x sur les applications réelles lors de la mise à jour vers la version bêta de Vite 4.3. Nous aimerions connaître les résultats pour vos applications.

## Profiling

Nous continuerons à travailler sur les performances de Vite. Nous travaillons sur une [outil de benchmark officiel](https://github.com/vitejs/vite-benchmark) pour Vite qui nous permet de mesurer les performances pour chaque Pull Request.

Et [vite-plugin-inspect](https://github.com/antfu/vite-plugin-inspect) a maintenant plus de fonctionnalités liées aux performances pour vous aider à identifier quels plugins ou middlewares sont le goulot d'étranglement pour vos applications.

Utiliser `vite --profile` (et appuyer sur `p` une fois que la page est chargée) enregistrera un profil CPU du démarrage du serveur de développement. Vous pouvez les ouvrir dans une application comme [speedscope](https://www.speedscope.app/) pour identifier les problèmes de performances. Et vous pouvez partager vos retombées avec l'équipe Vite dans un [Discussion](https://github.com/vitejs/vite/discussions) ou dans [Vite's Discord](https://chat.vite.dev).

## Next Steps

Nous avons décidé de faire une seule majeure Vite cette année en alignant avec la [EOL de Node.js 16](https://endoflife.date/nodejs) en septembre, abandonnant le support pour les deux versions de Node.js 14 et 16. Si vous souhaitez participer, nous avons commencé un [Discussion sur Vite 5](https://github.com/vitejs/vite/discussions/12466) pour collecter des retombées.
