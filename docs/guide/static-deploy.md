# Déploiement d'un site statique

Les guides suivants partent d'hypothèses communes :

- Vous utilisez l'emplacement de destination de build par défaut (`dist`). Cet emplacement [peut être modifié en utilisant `build.outDir`](/config/build-options.md#build-outdir), et vous pouvez extrapoler les instructions de ces guides dans ce cas.
- Vous utilisez npm. Vous pouvez utiliser des commandes équivalentes pour exécuter les scripts si vous utilisez Yarn ou d'autres gestionnaires de paquets.
- Vite est installé en tant que dépendance de développement locale dans votre projet, et vous avez configuré les scripts npm suivants :

```json [package.json]
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

Il est important de noter que `vite preview` est destiné à prévisualiser le build localement et n'est pas conçu pour être un serveur de production.

::: tip REMARQUE
Ces guides fournissent des instructions pour effectuer un déploiement statique de votre site Vite. Vite prend également en charge le Server Side Rendering (SSR). Le SSR fait référence aux frameworks frontend qui permettent d'exécuter la même application dans Node.js, de la pré-rendre en HTML, puis de l'hydrater côté client. Consultez le [Guide SSR](./ssr) pour en savoir plus sur cette fonctionnalité. D'autre part, si vous recherchez une intégration avec des frameworks serveur traditionnels, consultez plutôt le [guide d'intégration backend](./backend-integration).
:::

## Construire l'application

Vous pouvez exécuter la commande `npm run build` pour construire l'application.

```bash
$ npm run build
```

Par défaut, la sortie du build sera placée dans le dossier `dist`. Vous pouvez déployer ce dossier `dist` sur n'importe quelle plateforme de votre choix.

### Tester l'application localement

Une fois que vous avez construit l'application, vous pouvez la tester localement en exécutant la commande `npm run preview`.

```bash
$ npm run preview
```

La commande `vite preview` lancera un serveur web statique local qui sert les fichiers de `dist` à l'adresse `http://localhost:4173`. C'est un moyen simple de vérifier si le build de production semble correct dans votre environnement local.

Vous pouvez configurer le port du serveur en passant l'argument `--port`.

```json [package.json]
{
  "scripts": {
    "preview": "vite preview --port 8080"
  }
}
```

Dorénavant, la commande `preview` lancera le serveur à l'adresse `http://localhost:8080`.

## GitHub Pages

1. Définissez correctement `base` dans `vite.config.js`.

   Si vous déployez vers `https://<USERNAME>.github.io/`, ou vers un domaine personnalisé via GitHub Pages (par exemple `www.example.com`), définissez `base` à `'/'`. Comme alternative, vous pouvez supprimer `base` de la configuration, car sa valeur par défaut est `'/'`.

   Si vous déployez vers `https://<USERNAME>.github.io/<REPO>/` (par exemple, votre dépôt est à `https://github.com/<USERNAME>/<REPO>`), alors définissez `base` à `'/<REPO>/'`.

2. Accédez à la configuration de GitHub Pages dans la page des paramètres du dépôt et choisissez "GitHub Actions" comme source de déploiement. Cela vous amènera à créer un workflow qui va construire et déployer votre projet. Un exemple de workflow qui installe les dépendances et build en utilisant npm est fourni :

   <<< ./static-deploy-github-pages.yaml#content

## GitLab Pages et GitLab CI

1. Définissez correctement `base` dans `vite.config.js`.

   Si vous déployez vers `https://<USERNAME or GROUP>.gitlab.io/`, vous pouvez omettre `base` car sa valeur par défaut est `'/'`.

   Si vous déployez vers `https://<USERNAME or GROUP>.gitlab.io/<REPO>/`, par exemple si votre dépôt est à `https://gitlab.com/<USERNAME>/<REPO>`, alors définissez `base` à `'/<REPO>/'`.

2. Créez un fichier nommé `.gitlab-ci.yml` à la racine de votre projet avec le contenu ci-dessous. Cela construira et déploiera votre site chaque fois que vous apporterez des modifications à votre contenu :

   ```yaml [.gitlab-ci.yml]
   image: node:lts
   pages:
     stage: deploy
     cache:
       key:
         files:
           - package-lock.json
         prefix: npm
       paths:
         - node_modules/
     script:
       - npm install
       - npm run build
       - cp -a dist/. public/
     artifacts:
       paths:
         - public
     rules:
       - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
   ```

## Netlify

### Netlify CLI

1. Installez la [Netlify CLI](https://cli.netlify.com/).
2. Créez un nouveau site en utilisant `ntl init`.
3. Déployez en utilisant `ntl deploy`.

```bash
# Installer la Netlify CLI
$ npm install -g netlify-cli

# Créer un nouveau site dans Netlify
$ ntl init

# Déployer vers une URL de prévisualisation unique
$ ntl deploy
```

La CLI Netlify partagera avec vous une URL de prévisualisation à inspecter. Lorsque vous êtes prêt à passer en production, utilisez le flag `prod` :

```bash
# Déployer le site en production
$ ntl deploy --prod
```

### Netlify avec Git

1. Poussez votre code vers un dépôt git (GitHub, GitLab, BitBucket, Azure DevOps).
2. [Importez le projet](https://app.netlify.com/start) dans Netlify.
3. Choisissez la branche, le répertoire de sortie et configurez les variables d'environnement si nécessaire.
4. Cliquez sur **Deploy**.
5. Votre application Vite est déployée !

Après l'importation et le déploiement de votre projet, tous les push ultérieurs vers des branches autres que la branche de production ainsi que les pull requests généreront des [Déploiements de prévisualisation](https://docs.netlify.com/site-deploys/deploy-previews/), et tous les changements apportés à la branche de production (généralement "main") entraîneront un [Déploiement de production](https://docs.netlify.com/site-deploys/overview/#definitions).

## Vercel

### Vercel CLI

1. Installez la [Vercel CLI](https://vercel.com/cli) et exécutez `vercel` pour déployer.
2. Vercel détectera que vous utilisez Vite et activera les paramètres corrects pour votre déploiement.
3. Votre application est déployée ! (par exemple [vite-vue-template.vercel.app](https://vite-vue-template.vercel.app/))

```bash
$ npm i -g vercel
$ vercel init vite
Vercel CLI
> Success! Initialized "vite" example in ~/your-folder.
- To deploy, `cd vite` and run `vercel`.
```

### Vercel pour Git

1. Poussez votre code vers votre dépôt git (GitHub, GitLab, Bitbucket).
2. [Importez votre projet Vite](https://vercel.com/new) dans Vercel.
3. Vercel détectera que vous utilisez Vite et activera les paramètres corrects pour votre déploiement.
4. Votre application est déployée ! (par exemple [vite-vue-template.vercel.app](https://vite-vue-template.vercel.app/))

Après l'importation et le déploiement de votre projet, tous les push ultérieurs vers des branches généreront des [Déploiements de prévisualisation](https://vercel.com/docs/concepts/deployments/environments#preview), et tous les changements apportés à la branche de production (généralement "main") entraîneront un [Déploiement de production](https://vercel.com/docs/concepts/deployments/environments#production).

En savoir plus sur l'[Intégration Git](https://vercel.com/docs/concepts/git) de Vercel.

## Cloudflare Pages

### Cloudflare Pages via Wrangler

1. Installez [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/get-started/).
2. Authentifiez Wrangler avec votre compte Cloudflare en utilisant `wrangler login`.
3. Exécutez votre commande de build.
4. Déployez en utilisant `npx wrangler pages deploy dist`.

```bash
# Installer Wrangler CLI
$ npm install -g wrangler

# Se connecter au compte Cloudflare depuis la CLI
$ wrangler login

# Exécuter votre commande de build
$ npm run build

# Créer un nouveau déploiement
$ npx wrangler pages deploy dist
```

Après le téléchargement de vos ressources, Wrangler vous donnera une URL de prévisualisation pour inspecter votre site. Lorsque vous vous connecterez au tableau de bord Cloudflare Pages, vous verrez votre nouveau projet.

### Cloudflare Pages avec Git

1. Poussez votre code vers votre dépôt git (GitHub, GitLab).
2. Connectez-vous au tableau de bord Cloudflare et sélectionnez votre compte dans **Account Home** > **Pages**.
3. Sélectionnez **Create a new Project** et l'option **Connect Git**.
4. Sélectionnez le projet git que vous souhaitez déployer et cliquez sur **Begin setup**
5. Sélectionnez le preset de framework correspondant dans les paramètres de build selon le framework Vite que vous avez choisi.
6. Ensuite, sauvegardez et déployez !
7. Votre application est déployée ! (par exemple `https://<PROJECTNAME>.pages.dev/`)

Après l'importation et le déploiement de votre projet, tous les push ultérieurs vers des branches généreront des [Déploiements de prévisualisation](https://developers.cloudflare.com/pages/platform/preview-deployments/) sauf indication contraire dans vos [contrôles de build de branche](https://developers.cloudflare.com/pages/platform/branch-build-controls/). Tous les changements apportés à la branche de production (généralement "main") entraîneront un déploiement de production.

Vous pouvez également ajouter des domaines personnalisés et gérer des paramètres de build personnalisés sur Pages. En savoir plus sur [l'intégration Git de Cloudflare Pages](https://developers.cloudflare.com/pages/get-started/#manage-your-site).

## Google Firebase

1. Assurez-vous d'avoir [firebase-tools](https://www.npmjs.com/package/firebase-tools) installé.

2. Créez les fichiers `firebase.json` et `.firebaserc` à la racine de votre projet avec le contenu suivant :

   ```json [firebase.json]
   {
     "hosting": {
       "public": "dist",
       "ignore": [],
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ]
     }
   }
   ```

   ```js [.firebaserc]
   {
     "projects": {
       "default": "<YOUR_FIREBASE_ID>"
     }
   }
   ```

3. Après avoir exécuté `npm run build`, déployez en utilisant la commande `firebase deploy`.

## Surge

1. D'abord, installez [surge](https://www.npmjs.com/package/surge) si vous ne l'avez pas déjà fait.

2. Exécutez `npm run build`.

3. Déployez sur surge en tapant `surge dist`.

Vous pouvez également déployer sur un [domaine personnalisé](http://surge.sh/help/adding-a-custom-domain) en ajoutant `surge dist yourdomain.com`.

## Azure Static Web Apps

Vous pouvez rapidement déployer votre application Vite avec le service [Static Web Apps](https://aka.ms/staticwebapps) de Microsoft Azure. Vous avez besoin de :

- Un compte Azure et une clé d'abonnement. Vous pouvez créer un [compte Azure gratuit ici](https://azure.microsoft.com/free).
- Votre code d'application poussé sur [GitHub](https://github.com).
- L'[extension SWA](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestaticwebapps) dans [Visual Studio Code](https://code.visualstudio.com).

Installez l'extension dans VS Code et naviguez jusqu'à la racine de votre application. Ouvrez l'extension Static Web Apps, connectez-vous à Azure et cliquez sur le signe '+' pour créer une nouvelle Static Web App. Vous serez invité à désigner quelle clé d'abonnement utiliser.

Suivez l'assistant lancé par l'extension pour donner un nom à votre application, choisir un preset de framework et désigner la racine de l'application (généralement `/`) et l'emplacement des fichiers construits `/dist`. L'assistant créera une GitHub Action dans votre dépôt dans un dossier `.github`.

L'action travaillera pour déployer votre application (regardez sa progression dans l'onglet Actions de votre dépôt) et, une fois terminée avec succès, vous pourrez voir votre application à l'adresse fournie dans la fenêtre de progression de l'extension en cliquant sur le bouton 'Browse Website' qui apparaît lorsque l'action GitHub a été exécutée.

## Render

Vous pouvez déployer votre application Vite en tant que site statique sur [Render](https://render.com/).

1. Créez un [compte Render](https://dashboard.render.com/register).

2. Dans le [Dashboard](https://dashboard.render.com/), cliquez sur le bouton **New** et sélectionnez **Static Site**.

3. Connectez votre compte GitHub/GitLab ou utilisez un dépôt public.

4. Spécifiez un nom de projet et une branche.

   - **Build Command** : `npm install && npm run build`
   - **Publish Directory** : `dist`

5. Cliquez sur **Create Static Site**.

   Votre application devrait être déployée à l'adresse `https://<PROJECTNAME>.onrender.com/`.

Par défaut, tout nouveau commit poussé vers la branche spécifiée déclenchera automatiquement un nouveau déploiement. [Auto-Deploy](https://render.com/docs/deploys#toggling-auto-deploy-for-a-service) peut être configuré dans les paramètres du projet.

Vous pouvez également ajouter un [domaine personnalisé](https://render.com/docs/custom-domains) à votre projet.

<!--
  REMARQUE : Les sections ci-dessous sont réservées à d'autres plateformes de déploiement non listées ci-dessus.
  N'hésitez pas à soumettre une PR qui ajoute une nouvelle section avec un lien vers le guide de déploiement
  de votre plateforme, tant qu'il répond à ces critères :

  1. Les utilisateurs doivent pouvoir déployer leur site gratuitement.
  2. Les offres du niveau gratuit doivent héberger le site indéfiniment et ne pas être limitées dans le temps.
     Offrir un nombre limité de ressources de calcul ou un nombre limité de sites en échange est acceptable.
  3. Les guides liés ne doivent pas contenir de contenu malveillant.

  L'équipe Vite peut modifier ces critères et auditer la liste actuelle de temps en temps.
  Si une section est supprimée, nous contacterons les auteurs de la PR d'origine avant de le faire.
-->

## Flightcontrol

Déployez votre site statique en utilisant [Flightcontrol](https://www.flightcontrol.dev/?ref=docs-vite) en suivant ces [instructions](https://www.flightcontrol.dev/docs/reference/examples/vite?ref=docs-vite).

## Kinsta Static Site Hosting

Déployez votre site statique en utilisant [Kinsta](https://kinsta.com/static-site-hosting/) en suivant ces [instructions](https://kinsta.com/docs/react-vite-example/).

## xmit Static Site Hosting

Déployez votre site statique en utilisant [xmit](https://xmit.co) en suivant ce [guide](https://xmit.dev/posts/vite-quickstart/).
