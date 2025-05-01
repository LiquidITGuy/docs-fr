# Guide de contribution à la traduction de la documentation

Ce dépôt est un modèle pour les [dépôts de traduction de la documentation Vite.js](https://github.com/vitejs?q=docs).

## Création d'un dépôt de traduction

1. Cliquez sur [*Utiliser ce modèle*](https://github.com/tony19/vite-docs-template/generate) pour créer un nouveau dépôt de traduction dans votre compte GitHub personnel.

2. Configurez les permissions de workflow (requis) :

   - Allez dans les "Paramètres" > "Actions" > "Général" > "Permissions des workflows" de votre dépôt
   - Sélectionnez "Permissions de lecture et d'écriture"
   - Cliquez sur "Enregistrer"

   Il s'agit d'une exigence standard pour toutes les Actions GitHub qui doivent créer des issues ou apporter des modifications au dépôt. Sans ces permissions, l'action échouera avec une erreur `403 "Resource not accessible by integration"` lors de la création d'issues ou de la gestion des labels.

3. Ce dépôt utilise l'[Action GitHub `yuki-no`](https://github.com/Gumball12/yuki-no) pour le maintenir synchronisé avec les changements de la [documentation de Vite](https://github.com/vitejs/vite/tree/main/docs). Elle crée des issues dans ce dépôt pour suivre les modifications en amont qui doivent être traduites.

   Vous devez configurer le champ suivant dans [`/.github/workflows/yuki-no.yml`](/.github/workflows/yuki-no.yml) :

    * `track-from` : définissez-le sur un hash de commit récent du dépôt principal (vitejs/vite). C'est le point de départ pour suivre les changements - Yuki-no ne suivra que les commits après ce hash. L'utilisation d'un ancien hash de commit ralentira considérablement l'exécution initiale de l'action, car elle devra traiter chaque commit historique. (Après la première exécution réussie, Yuki-no ignore automatiquement les commits déjà traités.)

   Par défaut, `yuki-no` utilise le bot `github-actions`. Si vous souhaitez utiliser un bot personnalisé :

    * `username` - le nom d'utilisateur GitHub d'un [utilisateur machine](https://docs.github.com/en/developers/overview/managing-deploy-keys#machine-users) (par exemple, `ci-bot`)
    * `email` - l'e-mail associé au nom d'utilisateur GitHub ci-dessus
    * `access-token` - un [jeton d'accès personnel](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) de l'utilisateur machine (stocké dans un [secret de dépôt](https://docs.github.com/en/actions/security-guides/encrypted-secrets#creating-encrypted-secrets-for-a-repository), permettant `access-token: ${{ secrets.MY_SECRET_TOKEN }}`)

   Pour plus d'options de configuration, consultez la [documentation de `yuki-no`](https://github.com/Gumball12/yuki-no).

4. Traduisez toutes les chaînes visibles par l'utilisateur (sauf indication contraire) dans les fichiers suivants vers la langue cible :

    * [`/docs/.vitepress/config.ts`](/docs/.vitepress/config.ts) (les champs `og*`, `footer.*`, `text` et `link`)
    * [`/docs/.vitepress/theme/components/HomeSponsors.vue`](/docs/.vitepress/theme/components/HomeSponsors.vue)
    * [`/docs/.vitepress/theme/composables/sponsor.ts`](https://github.com/tony19/vite-docs-template/blob/acea14e/docs/.vitepress/theme/composables/sponsor.ts#L44) (les champs `tier`)
    * [`/docs/_data/team.js`](/docs/_data/team.js) (les champs `title` et `desc`)
    * `/docs/**/*.md`
    * [`/CONTRIBUTING.md`](/CONTRIBUTING.md)
    * [`/README.md`](/README.md)
    * `/docs/images/*.svg`

   💡 *Tips :*

    * *Contactez le [canal `#docs`](https://discord.com/channels/804011606160703521/855049073157341234) sur [Discord](https://chat.vitejs.dev) ou les [Discussions GitHub](https://github.com/vitejs/vite/discussions/categories/general) pour trouver d'autres personnes qui peuvent aider aux traductions.*
    * *Soumettez des pull requests dans votre dépôt pour ce travail afin que les collaborateurs puissent relire les traductions.*

5. Créez une [pull request dans le dépôt principal de Vite](https://github.com/vitejs/vite/pulls) pour mettre à jour les [liens de localisation dans `docs/.vitepress/config.ts`](https://github.com/vitejs/vite/blob/1e078ad1902ae980741d6920fc3a72d182fcf179/docs/.vitepress/config.ts#L55-L62), ce qui ajouterait la nouvelle langue au menu déroulant sur la page d'accueil de Vite. Plus précisément, ajoutez à `localeLinks.items[]` un objet avec ces clés :

    - `text` - le nom de la langue dans son orthographe native (par exemple, `Español`)
    - `link` - l'URL du site cible, composée du [code ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) de la langue comme sous-domaine de `https://vitejs.dev` (par exemple, `https://es.vitejs.dev`)

    *Exemple pour le français :*

    ```js
    localeLinks: {
      items: [
        { text: 'Française', link: 'https://fr.vitejs.dev' },
      ]
    },
    ```

6. Dans la description de la pull request, incluez l'URL de votre dépôt de traduction. Soyez prêt à [transférer le dépôt](https://docs.github.com/en/repositories/creating-and-managing-repositories/transferring-a-repository) à l'[organisation `vitejs`](https://github.com/vitejs) à la demande de l'[équipe Vite](https://github.com/orgs/vitejs/people). Le transfert vous ajoute automatiquement en tant que collaborateur sur le dépôt. Le dépôt sera renommé en `docs-CODE_DE_LANGUE` (par exemple, `docs-fr`) après le transfert.

   **Merci pour votre contribution !** ❤️
