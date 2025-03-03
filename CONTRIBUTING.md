# Guide de contribution à Vite

Nous sommes très heureux que vous souhaitiez contribuer à Vite ! Avant de soumettre votre contribution, veuillez lire le guide suivant. Nous vous suggérons également de lire la [Philosophie du projet](https://vitejs.dev/guide/philosophy) dans notre documentation.

Vous pouvez utiliser [StackBlitz Codeflow](https://stackblitz.com/codeflow) pour corriger les bugs ou implémenter des fonctionnalités. Vous verrez un bouton Codeflow sur les problèmes pour commencer une PR pour les corriger. Un bouton apparaîtra également sur les PR pour les revoir sans avoir besoin de vérifier la branche localement. Lorsque vous utilisez Codeflow, le dépôt Vite sera cloné pour vous dans un éditeur en ligne, avec le package Vite construit en mode watch prêt à tester vos modifications. Si vous souhaitez en savoir plus, consultez la [documentation Codeflow](https://developer.stackblitz.com/codeflow/what-is-codeflow).

[![Ouvrir dans Codeflow](https://developer.stackblitz.com/img/open_in_codeflow.svg)](https://pr.new/vitejs/vite)

## Configuration du dépôt

Pour développer localement, forkez le dépôt Vite et clonez-le dans votre machine locale. Le dépôt Vite est un monorepo utilisant pnpm workspaces. Le gestionnaire de paquets utilisé pour installer et lier les dépendances doit être [pnpm](https://pnpm.io/).

Pour développer et tester le noyau `vite`:

1. Lancez `pnpm i`dans le dossier racine de Vite.

2. Lancez `pnpm run build`dans le dossier racine de Vite.

3. Si vous développez Vite, vous pouvez aller dans `packages/vite`et lancer `pnpm run dev`pour reconstruire Vite automatiquement chaque fois que vous changez son code.

Vous pouvez également utiliser [Vite.js Docker Dev](https://github.com/nystudio107/vitejs-docker-dev) pour avoir un environnement Docker configuré pour le développement de Vite.

> Vite utilise pnpm v8. Si vous travaillez sur plusieurs projets avec différentes versions de pnpm, il est recommandé d’activer [Corepack](https://github.com/nodejs/corepack) en lançant`corepack enable`.

### Ignorer les commits lors de l’exécution de `git blame`

Nous avons un fichier `.git-blame-ignore-revs`pour ignorer les modifications de formatage.
Pour que ce fichier soit utilisé par`git blame`, vous devez lancer la commande suivante.

```sh
git config --local blame.ignoreRevsFile .git-blame-ignore-revs
```

## Débogage

Pour utiliser les points d’arrêt et explorer l’exécution du code, vous pouvez utiliser la fonctionnalité [« Run and Debug »](https://code.visualstudio.com/docs/editor/debugging) de VS Code.

1. Ajoutez une instruction `debugger`là où vous voulez arrêter l’exécution du code.

2. Cliquez sur l’icône « Run and Debug » dans la barre d’activité de l’éditeur, qui ouvre la vue [_Run and Debug_](https://code.visualstudio.com/docs/editor/debugging#_run-and-debug-view).

3. Cliquez sur le bouton « JavaScript Debug Terminal » dans la vue [_Run and Debug_](https://code.visualstudio.com/docs/editor/debugging#_run-and-debug-view), qui ouvre un terminal dans VS Code.

4. Depuis ce terminal, allez dans`playground/xxx`, et lancez`pnpm run dev`.

5. L’exécution s’arrêtera à l’instruction`debugger`, et vous pouvez utiliser la [Barre de débogage](https://code.visualstudio.com/docs/editor/debugging#_debug-actions) pour continuer, passez à l’étape suivante, et redémarrez le processus…

### Débogage des erreurs dans les tests de Vitest en utilisant Playwright (Chromium)

Certaines erreurs sont masquées et cachées en raison des couches de réabstraction et de la nature sandboxée ajoutée par Vitest, Playwright et Chromium. Afin de voir ce qui se passe réellement et le contenu de la console de devtools, suivez cette configuration :

1. Ajoutez une instruction `debugger`dans le hook `afterAll`de`playground/vitestSetup.ts`. Cela mettra en pause l’exécution avant que les tests ne quittent et l’instance de navigateur Playwright ne quitte.

2. Lancez les tests avec la commande de script`debug-serve`, qui activera le débogage distant :`pnpm run debug-serve resolve`.

3. Attendez que le devtools de l’inspecteur s’ouvre dans votre navigateur et que le débogage soit attaché.

4. Dans le panneau des sources dans la colonne de droite, cliquez sur le bouton de lecture pour reprendre l’exécution, et permettre aux tests de s’exécuter, ce qui ouvrira une instance de Chromium.

5. En focalisant l’instance de Chromium, vous pouvez ouvrir les outils de développement du navigateur et inspecter la console pour trouver les problèmes sous-jacents.

6. Pour l’arrêter, arrêtez simplement le processus de test dans votre terminal.

## Test de Vite contre des packages externes

Vous souhaiterez peut-être tester votre copie modifiée de Vite contre un autre package construit avec Vite. Pour pnpm, après avoir construit Vite, vous pouvez utiliser [`pnpm.overrides`](https://pnpm.io/package_json#pnpmoverrides)pour cela. Notez que `pnpm.overrides`cela doit être spécifié dans la `package.json`racine, et vous devez lister le package comme une dépendance dans la `package.json`racine :

```json
{
  "dependencies": {
    "vite": "^4.0.0"
  },
  "pnpm": {
    "overrides": {
      "vite": "link:../path/to/vite/packages/vite"
    }
  }
}
```

Et relancez `pnpm install`pour lier le package.

## Exécution des tests

### Tests d’intégration

Chaque package sous `playground/`contient un répertoire`__tests__`. Les tests sont exécutés en utilisant [Vitest](https://vitest.dev/) + [Playwright](https://playwright.dev/) avec des intégrations personnalisées pour rendre l’écriture de tests simple. La configuration détaillée est à l’intérieur de `vitest.config.e2e.js`et des fichiers`playground/vitest*`.

Certains playgrounds définissent des variantes pour exécuter le même appareil avec différentes configurations de setup. Par convention, lorsque vous exécutez un fichier de spécification de test dans un répertoire imbriqué dans`__tests__`, le setup tentera d’utiliser un fichier de configuration nommé `vite.config-{folderName}.js`à la racine du playground. Vous pouvez voir un exemple de variantes dans le [playground des assets](https://github.com/vitejs/vite/tree/main/playground/assets).

Avant d’exécuter les tests, assurez-vous que [Vite a été build](#repo-setup). Sur Windows, vous souhaiterez peut-être [activer le mode Développeur](https://docs.microsoft.com/en-us/windows/apps/get-started/enable-your-device-for-development) pour résoudre [les problèmes avec la création de liens symboliques pour les non-administrateurs](https://github.com/vitejs/vite/issues/7390). De plus, vous souhaiterez peut-être [définir `core.symlinks`sur `true`pour résoudre les problèmes avec les liens symboliques dans git](https://github.com/vitejs/vite/issues/5242).

Chaque test d’intégration peut être exécuté soit en mode serveur, soit en mode build.

- `pnpm test`par défaut, exécute tous les tests d’intégration dans les modes serveur et build, ainsi que les tests unitaires.

- `pnpm run test-serve`exécute les tests uniquement en mode serveur.

- `pnpm run test-build`exécute les tests uniquement en mode build.

- `pnpm run test-serve [match]`ou `pnpm run test-build [match]`exécute les tests dans des packages spécifiques qui correspondent au filtre donné. Par exemple, `pnpm run test-serve asset`exécute les tests pour les deux `playground/asset`et `vite/src/node/__tests__/asset`sous le mode serveur.

  Note : Le filtrage des packages n’est pas disponible pour le script`pnpm test`, qui exécute tous les tests.

### Tests unitaires

Outre les tests sous `playground/`pour les tests d’intégration, les packages peuvent contenir des tests unitaires sous leur répertoire`__tests__`. Les tests unitaires sont alimentés par [Vitest](https://vitest.dev/). La configuration détaillée est à l’intérieur des fichiers`vitest.config.ts`.

- `pnpm run test-unit`exécute les tests unitaires de chaque package.

- `pnpm run test-unit [match]`exécute les tests dans des packages spécifiques qui correspondent au filtre donné.

### Environnement de test et helpers

Dans les tests sous`playground/`, vous pouvez importer l’objet `page`depuis`~utils`, qui est une instance de [`Page`](https://playwright.dev/docs/api/class-page)de Playwright qui a déjà navigué vers la page servie du playground actuel. Donc, écrire un test est aussi simple que :

```js
import { page } from '~utils'

test('should work', async () => {
  expect(await page.textContent('.foo')).toMatch('foo')
})
```

Certains helpers communs (e.g.`testDir`, `isBuild`, ou`editFile`) sont également disponibles dans les utils. Le code source est situé dans`playground/test-utils.ts`.

Note : L’environnement de test de build utilise un [ensemble de configuration de Vite différent par défaut](https://github.com/vitejs/vite/blob/main/playground/vitestSetup.ts#L102-L122) pour ignorer la transpilation pendant les tests pour rendre les tests plus rapides. Cela peut produire un résultat différent par rapport au build de production par défaut.

### Étendre le jeu de tests

Pour ajouter de nouveaux tests, vous devriez trouver un playground lié à la correction ou à la fonctionnalité (ou en créer un nouveau). Par exemple, le chargement des assets statiques est testé dans le [playground des assets](https://github.com/vitejs/vite/tree/main/playground/assets). Dans cette application Vite, il y a un test pour `?raw`imports avec [une section définie dans le `index.html`pour cela](https://github.com/vitejs/vite/blob/main/playground/assets/index.html#L121) :

```html
<h2>?raw import</h2>
<code class="raw"></code>
```

Cela sera modifié [avec le résultat d’un import de fichier](https://github.com/vitejs/vite/blob/main/playground/assets/index.html#L151) :

```js
import rawSvg from './nested/fragment.svg?raw'
text('.raw', rawSvg)
```

… où la fonction `text`est définie comme :

```js
function text(el, text) {
  document.querySelector(el).textContent = text
}
```

Dans les [tests de spécification](https://github.com/vitejs/vite/blob/main/playground/assets/__tests__/assets.spec.ts#L180), les modifications apportées au DOM ci-dessus sont utilisées pour tester cette fonctionnalité :

```js
test('?raw import', async () => {
  expect(await page.textContent('.raw')).toMatch('SVG')
})
```

## Note sur les dépendances de test

Dans de nombreux cas de test, nous avons besoin de simuler des dépendances en utilisant les protocoles `link:` et `file:`. `pnpm` Traite `link:`comme des liens symboliques et `file:`comme des hardlinks. Pour tester les dépendances comme si elles étaient copiées dans`node_modules`, utilisez le protocole`file:`. Sinon, utilisez le protocole`link:`.

Pour une dépendance mockée, assurez-vous d’ajouter un préfixe `@vitejs/test-`au nom du package. Cela évitera les problèmes de faux positifs.

## Logging de débogage

Vous pouvez définir la variable d’environnement `DEBUG`pour activer les logs de débogage (e.g.`DEBUG="vite:resolve"`). Pour voir tous les logs de débogage, vous pouvez définir`DEBUG="vite:*"`, mais soyez attentif, il sera assez bruyant. Vous pouvez lancer `grep -r "createDebugger('vite:" packages/vite/src/`pour voir la liste des scopes de débogage disponibles.

## Guidelines pour les PR

- Checkout une branche avec un sujet à partir d’une branche de base (e.g.`main`), et mergez-la vers cette branche.

- Si vous ajoutez une nouvelle fonctionnalité :

  - Ajoutez un cas de test l’accompagnant.
  - Fournissez une raison convaincante pour ajouter cette fonctionnalité. Idéalement, vous devriez ouvrir un problème de suggestion d’abord, et doit avoir été approuvé avant de commencer à travailler dessus.

- Si vous corrigez un bug :

  - Si vous résolvez un problème déjà spécifié, ajoutez `(fix #xxxx[,#xxxx])`(#xxxx est l’identifiant du problème) dans le titre de votre PR pour un meilleur journal de release (e.g.`fix: update entities encoding/decoding (fix #3899)`).
  - Fournissez une description détaillée du bug dans la PR. Un live démo est préférable.
  - Ajoutez la couverture des tests si applicable.

- Il est OK de commiter plusieurs petites modifications tant que vous travaillez sur la PR. GitHub peut les squasher automatiquement avant de fusionner.

- Assurez-vous que les tests passent !

- Pas besoin de vous soucier du style de code tant que vous avez installé les dépendances de développement. Les fichiers modifiés sont automatiquement formatés avec Prettier lors du commit (en invoquant les [Git Hooks](https://git-scm.com/docs/githooks) via [simple-git-hooks](https://github.com/toplenboren/simple-git-hooks)).

- Le titre de la PR doit suivre la [convention de message de commit](./.github/commit-convention.md) pour que les journaux de release puissent être générés automatiquement.

## Guidelines pour la maintenance

> La section suivante est principalement pour les mainteneurs qui ont accès au commit, mais il est utile de la parcourir si vous souhaitez faire des contributions non triviales à la base de code.

### Workflow de tri des problèmes

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./.github/issue-workflow-dark.png">
  <img src="./.github/issue-workflow.png">
</picture>

### Workflow de revue des PR

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./.github/pr-workflow-dark.png">
  <img src="./.github/pr-workflow.png">
</picture>

## Notes sur les dépendances

Vite vise à être léger, et cela inclut le nombre de dépendances npm et leur taille.

Nous utilisons Rollup pour prébundle la plupart des dépendances avant de publier ! Par conséquent, la plupart des dépendances, même celles utilisées dans le code source en cours d’exécution, doivent être ajoutées par défaut sous`devDependencies`. Cela crée également les contraintes suivantes que nous devons être conscientes du codebase.

### Usage de `require()`

Dans certains cas, nous utilisons intentionnellement des dépendances de manière paresseuse (lazy load) pour améliorer les performances de démarrage. Cependant, notez que nous ne pouvons pas utiliser des appels simples `require('somedep')`dans les fichiers ESM, donc la dépendance ne sera pas incluse dans le bundle, et la dépendance réelle ne sera même pas là lorsqu’elle est publiée puisqu’elles sont dans`devDependencies`.

Au lieu de cela, utilisez`(await import('somedep')).default`.

### Penser avant d’ajouter une dépendance

La plupart des dépendances devraient être ajoutées à `devDependencies`même si elles sont nécessaires au runtime. Certaines exceptions sont :

- Packages de types. Exemple :`@types/*`.
- Dépendances qui ne peuvent pas être correctement bundlées en raison de fichiers binaires. Exemple :`esbuild`.
- Dépendances qui livrent leurs propres types utilisés dans les types publics de Vite. Exemple :`rollup`.

Évitez les dépendances avec de grandes dépendances transitives qui entraînent une taille excessive par rapport à la fonctionnalité qu’elles fournissent. Par exemple, `http-proxy`lui-même plus `@types/http-proxy`font un peu plus de 1 MB, mais `http-proxy-middleware`tire une tonne de dépendances qui le passent à 7 MB (!) lorsqu’un middleware personnalisé minimal sur `http-proxy`n’exige que quelques lignes de code.

### Assurer le support des types

Vite vise à être entièrement utilisable comme dépendance dans un projet TypeScript (e.g. il doit fournir des types corrects pour VitePress), et également dans`vite.config.ts`. Cela signifie techniquement que toute dépendance dont les types sont exposés doit être ajoutée à `dependencies`au lieu de`devDependencies`. Cependant, cela signifie également que nous ne pourrons pas le lier.

Pour contourner cela, nous intégrons certains types de ces dépendances dans`packages/vite/src/types`. De cette façon, nous pouvons toujours exposer les types, mais lier le code source de la dépendance.

Utilisez `pnpm run build-types-check`pour vérifier que les types liés ne dépendent pas de types dans`devDependencies`.

Pour les types partagés entre le client et node, ils doivent être ajoutés dans`packages/vite/types`. Ces types ne sont pas liés et sont publiés tels quels (bien qu’ils soient toujours considérés comme internes). Les types de dépendances dans ce répertoire (e.g.`packages/vite/types/chokidar.d.ts`) sont obsolètes et doivent être ajoutés à`packages/vite/src/types` la place.

### Penser avant d’ajouter une autre option

Nous avons déjà de nombreuses options de configuration, et nous devons éviter de résoudre un problème en ajoutant une autre option. Avant d’ajouter une option, considérez si le problème :

- est vraiment digne d’attention
- peut être résolu avec une valeur par défaut intelligente
- a une solution de contournement en utilisant des options existantes
- peut être résolu avec un plugin au lieu d’une option

## Release

Si vous avez accès à la publication, les étapes ci-dessous expliquent comment couper une release pour un package. Il y a deux phases pour la procédure de release : « Release » et « Publish ».

« Release » est fait localement pour générer les journaux de release et les tags git :

1. Assurez-vous que le remote git pour https://github.com/vitejs/vite est défini comme`origin`.
2. Dans le répertoire racine du projet`vite`, branche`main`, exécutez `git pull`et `pnpm i`pour le mettre à jour.
3. Exécutez `pnpm release`et suivez les invites pour couper une release pour un package. Il générera le journal de release, un tag git et les poussera à`origin`. Vous pouvez lancer avec le flag `--dry`pour tester.
4. Quand la commande est terminée, il fournira un lien vers https://github.com/vitejs/vite/actions/workflows/publish.yml.
5. Cliquez sur le lien pour visiter la page, et suivez les étapes ci-dessous.

« Publish » est fait sur GitHub Actions pour publier le package à npm :

1. Quelques instants après la commande, un nouveau workflow apparaîtra pour le package publié et est en attente d’approbation pour publier sur npm.
2. Cliquez sur le workflow pour ouvrir sa page.
3. Cliquez sur le bouton « Review deployments » dans la boîte jaune, une fenêtre popup apparaîtra.
4. Vérifiez « Release » et cliquez sur « Approve and deploy ».
5. Le package commencera à être publié sur npm.

## Contribution à la traduction des docs

Pour ajouter une nouvelle langue aux docs de Vite, voir[`vite-docs-template`](https://github.com/tony19/vite-docs-template/blob/main/.github/CONTRIBUTING.md).
