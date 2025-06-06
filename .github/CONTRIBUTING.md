# Docs Translation Contributing Guide

This repo is a template for [Vite.js docs translation repositories](https://github.com/vitejs?q=docs).

## Creating a Translation Repo

1. Click [*Use this template*](https://github.com/tony19/vite-docs-template/generate) to scaffold a new translation repo in your personal GitHub.

2. Configure workflow permissions (required):

   - Go to your repository's "Settings" > "Actions" > "General" > "Workflow permissions"
   - Select "Read and write permissions"
   - Click "Save"

   This is a standard requirement for any GitHub Actions that need to create issues or make repository changes. Without these permissions, the action will fail with a `403 "Resource not accessible by integration"` error when trying to create issues or manage labels.

3. This repo uses the [`yuki-no` GitHub Action](https://github.com/Gumball12/yuki-no) to keep it in sync with changes from [Vite's `docs`](https://github.com/vitejs/vite/tree/main/docs). It creates issues in this repo to track upstream changes that need to be translated.

   You must configure the following field in [`/.github/workflows/yuki-no.yml`](/.github/workflows/yuki-no.yml):

    * `track-from`: Set this to a recent commit hash from the head repository (vitejs/vite). This is the starting point for tracking changes - Yuki-no will only track commits after this hash. Using an old commit hash will significantly slow down the initial action run as it needs to process each historical commit. (After the first successful run, Yuki-no automatically skips previously processed commits.)

   By default, `yuki-no` uses the `github-actions` bot. If you want to use a custom bot:

    * `username` - the GitHub username of a [machine user](https://docs.github.com/en/developers/overview/managing-deploy-keys#machine-users) (e.g., `ci-bot`)
    * `email` - the email associated with the GitHub username above
    * `access-token` - a [personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) of the machine user (stored in a [repository secret](https://docs.github.com/en/actions/security-guides/encrypted-secrets#creating-encrypted-secrets-for-a-repository), enabling `access-token: ${{ secrets.MY_SECRET_TOKEN }}`)

   For more configuration options, see the [`yuki-no` documentation](https://github.com/Gumball12/yuki-no).

4. Translate all user-visible strings (unless specified otherwise) in the following files to the target language:

    * [`/docs/.vitepress/config.ts`](/docs/.vitepress/config.ts) (the `og*`, `footer.*`, `text`, and `link` fields)
    * [`/docs/.vitepress/theme/components/HomeSponsors.vue`](/docs/.vitepress/theme/components/HomeSponsors.vue)
    * [`/docs/.vitepress/theme/composables/sponsor.ts`](https://github.com/tony19/vite-docs-template/blob/acea14e/docs/.vitepress/theme/composables/sponsor.ts#L44) (the `tier` fields)
    * [`/docs/_data/team.js`](/docs/_data/team.js) (the `title` and `desc` fields)
    * `/docs/**/*.md`
    * [`/CONTRIBUTING.md`](/CONTRIBUTING.md)
    * [`/README.md`](/README.md)
    * `/docs/images/*.svg`

   💡 *Tips:*

    * *Ping the [`#docs` channel](https://discord.com/channels/804011606160703521/855049073157341234) in [Discord](https://chat.vitejs.dev) or [GitHub Discussions](https://github.com/vitejs/vite/discussions/categories/general) for others who can help with translations.*
    * *Submit pull requests in your repo for this work so that collaborators can proofread the translations.*

5. Create a [pull request in Vite's main repo](https://github.com/vitejs/vite/pulls) to update the [locale links in `docs/.vitepress/config.ts`](https://github.com/vitejs/vite/blob/1e078ad1902ae980741d6920fc3a72d182fcf179/docs/.vitepress/config.ts#L55-L62), which would add the new language to the dropdown on the Vite homepage. Specifically, append to `localeLinks.items[]` an object with these keys:

    - `text` - the language name in its native spelling (e.g., `Español`)
    - `link` - the URL to the target site, composed of the language's [ISO 639-1 code](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) as a subdomain of `https://vitejs.dev` (e.g., `https://es.vitejs.dev`)

    *Example for French:*

    ```js
    localeLinks: {
      items: [
        { text: 'Française', link: 'https://fr.vitejs.dev' },
      ]
    },
    ```

6. In the pull request's description, include the URL to your translation repo. Be prepared to [transfer the repo](https://docs.github.com/en/repositories/creating-and-managing-repositories/transferring-a-repository) to the [`vitejs` organization](https://github.com/vitejs) upon request by the [Vite team](https://github.com/orgs/vitejs/people). The transfer automatically adds you as a collaborator on the repo. The repo will be renamed to `docs-LANGUAGE_CODE` (e.g., `docs-fr`) after the transfer.

   **Thank you for your contribution!** ❤️
