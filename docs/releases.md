# Releases

Vite suit le [Versioning sémantique](https://semver.org/). Vous pouvez voir la dernière version stable de Vite dans la [page du package npm de Vite](https://www.npmjs.com/package/vite).

Un journal complet des releases passées est [disponible sur GitHub](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md).

## Cycle de release

Vite n’a pas de cycle de release fixe.

- Les releases de **Patch** sont publiés quand cela est nécessaire (généralement toutes les semaines).
- Les releases **Mineures** contiennent de nouvelles fonctionnalités et sont publiées quand cela est nécessaire. Les releases **Mineures** ont toujours une phase de prérelease bêta (généralement tous les deux mois).
- Les releases **Majeures** sont généralement alignées avec le [calendrier de fin de vie de Node.js](https://endoflife.date/nodejs) et seront annoncées à l’avance. Ces releases passeront par des discussions longues avec l’écosystème et auront une phase de prérelease alpha et bêta (généralement tous les ans).

Les plages de versions de Vite supportées par l’équipe Vite sont déterminées automatiquement par :

- **Mineur actuel** reçoit des correctifs réguliers.
- **Majeur précédent** (seulement pour sa dernière mineure) et **Mineur précédent** reçoivent des correctifs importants et des correctifs de sécurité.
- **Avant dernière Majeure** (seulement pour sa dernière mineure) et **Avant dernière Mineure** reçoivent des correctifs de sécurité.
- Toutes les versions avant ces dernières sont plus supportées.

Par exemple, si la dernière version de Vite est 5.3.10 :

- Les correctifs réguliers sont publiés pour`vite@5.3`.
- Les correctifs importants et les correctifs de sécurité sont apportés à `vite@4`et`vite@5.2`.
- Les correctifs de sécurité sont également apportés à`vite@3`, et`vite@5.1`.
- `vite@2`et `vite@5.0`ne sont plus supportés. Les utilisateurs doivent mettre à jour pour recevoir des mises à jour.

Nous recommandons de mettre à jour Vite régulièrement. Consultez les [guides de migration](https://vite.dev/guide/migration.html) lorsque vous mettez à jour vers chaque Majeur. L’équipe Vite travaille de près avec les principaux projets de l’écosystème pour garantir la qualité des nouvelles versions. Nous testons les nouvelles versions de Vite avant de les publier via le projet [vite-ecosystem-ci](https://github.com/vitejs/vite-ecosystem-ci). La plupart des projets utilisant Vite devraient être en mesure de proposer un support ou de migrer vers de nouvelles versions dès qu’elles sont publiées.

## Edge Cases du versionning sémantique

### Définitions TypeScript

Nous pouvons publier des modifications incompatibles entre les versions mineures. Cela est dû au fait que :

- Parfois, TypeScript lui-même publie des modifications incompatibles entre les versions mineures, et nous devons ajuster les types pour supporter de nouvelles versions de TypeScript.
- Parfois, nous devons adopter des fonctionnalités qui ne sont disponibles que dans une nouvelle version de TypeScript, ce qui augmente la version minimale requise de TypeScript.
- Si vous utilisez TypeScript, vous pouvez utiliser une plage semver qui verrouille la dernière version mineure et mettre à jour manuellement lorsqu’une nouvelle version mineure de Vite est publiée.

### esbuild

[Esbuild](https://esbuild.github.io/) est pre-1.0.0 et parfois il a un changement cassant que nous devons inclure pour avoir accès aux nouvelles fonctionnalités et améliorations de performance. Nous pouvons augmenter la version d’esbuild dans une version mineure de Vite.

### Versions de Node.js non LTS

Les versions de Node.js non LTS (les numéros impairs) ne sont pas testées comme partie de Vite's CI, mais elles devraient encore fonctionner avant leur [fin de vie](https://endoflife.date/nodejs).

## Préreleases

Les releases mineures passent généralement par un nombre non fixe de bêta. Les releases majeures passeront par une phase alpha et une phase bêta.

Les préreleases permettent aux utilisateurs et aux contributeurs de l’écosystème de faire des tests d’intégration et de stabilité, et de fournir des retours. Ne pas utiliser les préreleases en production. Toutes les préreleases sont considérées comme instables et peuvent contenir des changements cassants entre les versions. Toujours utiliser une version exacte lorsque vous utilisez les préreleases.

## Dépréciations

Nous déprécions périodiquement des fonctionnalités qui ont été remplacées par des alternatives meilleures dans les releases mineures. Les fonctionnalités dépréciées continueront à fonctionner avec un avertissement de type ou un message de journalisation. Elles seront supprimées dans la prochaine version majeure après avoir été dépréciées. Le [Guide de migration](https://vite.dev/guide/migration.html) pour chaque majeur listera ces suppressions et documentera un chemin de migration pour chacune d’elles.

## Fonctionnalités expérimentales

Certaines fonctionnalités sont marquées comme expérimentales lorsqu’elles sont publiées dans une version stable de Vite. Les fonctionnalités expérimentales permettent de collecter des retours d’utilisation dans le monde réel pour influencer leur conception finale. Le but est de permettre aux utilisateurs de fournir des retours en testant ces fonctionnalités en production. Les fonctionnalités expérimentales sont considérées comme instables et ne doivent être utilisées que dans un environnement contrôlé. Ces fonctionnalités peuvent changer entre les releases mineures, donc les utilisateurs doivent verrouiller la version de Vite lorsqu’ils en dépendent. Nous créerons une [discussion GitHub](https://github.com/vitejs/vite/discussions/categories/feedback?discussions_q=is%3Aopen+label%3Aexperimental+category%3AFeedback) pour chaque fonctionnalité expérimentale.
