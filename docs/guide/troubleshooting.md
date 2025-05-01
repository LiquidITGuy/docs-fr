# Résolution des problèmes

Consultez également le [guide de résolution des problèmes de Rollup](https://rollupjs.org/troubleshooting/) pour plus d'informations.

Si les suggestions présentées ici ne fonctionnent pas, essayez de poser vos questions sur [GitHub Discussions](https://github.com/vitejs/vite/discussions) ou dans le canal `#help` du [Discord Vite Land](https://chat.vite.dev).

## CJS

### API Node CJS de Vite dépréciée

La version CJS de l'API Node de Vite est dépréciée et sera supprimée dans Vite 6. Consultez la [discussion GitHub](https://github.com/vitejs/vite/discussions/13928) pour plus de contexte. Vous devriez mettre à jour vos fichiers ou frameworks pour importer plutôt la version ESM de Vite.

Dans un projet Vite de base, assurez-vous que :

1. Le contenu du fichier `vite.config.js` utilise la syntaxe ESM.
2. Le fichier `package.json` le plus proche contient `"type": "module"`, ou utilisez l'extension `.mjs`/`.mts`, par exemple `vite.config.mjs` ou `vite.config.mts`.

Pour les autres projets, il existe quelques approches générales :

- **Configurer ESM par défaut, avec opt-in pour CJS si nécessaire :** Ajoutez `"type": "module"` dans le `package.json` du projet. Tous les fichiers `*.js` sont désormais interprétés comme ESM et doivent utiliser la syntaxe ESM. Vous pouvez renommer un fichier avec l'extension `.cjs` pour continuer à utiliser CJS.
- **Conserver CJS par défaut, avec opt-in pour ESM si nécessaire :** Si le `package.json` du projet ne contient pas `"type": "module"`, tous les fichiers `*.js` sont interprétés comme CJS. Vous pouvez renommer un fichier avec l'extension `.mjs` pour utiliser ESM à la place.
- **Importer Vite dynamiquement :** Si vous devez continuer à utiliser CJS, vous pouvez importer Vite dynamiquement en utilisant `import('vite')`. Cela nécessite que votre code soit écrit dans un contexte `async`, mais cela devrait rester gérable car l'API de Vite est principalement asynchrone.

Si vous ne savez pas d'où provient l'avertissement, vous pouvez exécuter votre script avec le flag `VITE_CJS_TRACE=true` pour enregistrer la trace de la pile :

```bash
VITE_CJS_TRACE=true vite dev
```

Si vous souhaitez ignorer temporairement l'avertissement, vous pouvez exécuter votre script avec le flag `VITE_CJS_IGNORE_WARNING=true` :

```bash
VITE_CJS_IGNORE_WARNING=true vite dev
```

Notez que les fichiers de configuration postcss ne prennent pas encore en charge ESM + TypeScript (`.mts` ou `.ts` dans `"type": "module"`). Si vous avez des configurations postcss avec `.ts` et que vous avez ajouté `"type": "module"` au package.json, vous devrez également renommer la configuration postcss pour utiliser `.cts`.

## CLI

### `Error: Cannot find module 'C:\foo\bar&baz\vite\bin\vite.js'`

Le chemin vers votre dossier de projet peut contenir `&`, ce qui ne fonctionne pas avec `npm` sur Windows ([npm/cmd-shim#45](https://github.com/npm/cmd-shim/issues/45)).

Vous devrez soit :

- Passer à un autre gestionnaire de paquets (par exemple `pnpm`, `yarn`)
- Supprimer `&` du chemin de votre projet

## Configuration

### Ce package est ESM uniquement

Lors de l'importation d'un package ESM uniquement par `require`, l'erreur suivante se produit.

> Failed to resolve "foo". This package is ESM only but it was tried to load by `require`.

> Error [ERR_REQUIRE_ESM]: require() of ES Module /path/to/dependency.js from /path/to/vite.config.js not supported.
> Instead change the require of index.js in /path/to/vite.config.js to a dynamic import() which is available in all CommonJS modules.

Dans Node.js <=22, les fichiers ESM ne peuvent pas être chargés par [`require`](https://nodejs.org/docs/latest-v22.x/api/esm.html#require) par défaut.

Bien que cela puisse fonctionner en utilisant [`--experimental-require-module`](https://nodejs.org/docs/latest-v22.x/api/modules.html#loading-ecmascript-modules-using-require), ou Node.js >22, ou dans d'autres environnements d'exécution, nous recommandons toujours de convertir votre configuration en ESM en :

- ajoutant `"type": "module"` au `package.json` le plus proche
- renommant `vite.config.js`/`vite.config.ts` en `vite.config.mjs`/`vite.config.mts`

## Serveur de développement

### Les requêtes sont bloquées indéfiniment

Si vous utilisez Linux, les limites de descripteurs de fichiers et les limites d'inotify pourraient être à l'origine du problème. Comme Vite ne regroupe pas la plupart des fichiers, les navigateurs peuvent demander de nombreux fichiers qui nécessitent de nombreux descripteurs de fichiers, dépassant la limite.

Pour résoudre ce problème :

- Augmentez la limite de descripteurs de fichiers avec `ulimit`

  ```shell
  # Vérifiez la limite actuelle
  $ ulimit -Sn
  # Changez la limite (temporaire)
  $ ulimit -Sn 10000 # Vous pourriez avoir besoin de changer aussi la limite dure
  # Redémarrez votre navigateur
  ```

- Augmentez les limites d'inotify suivantes avec `sysctl`

  ```shell
  # Vérifiez les limites actuelles
  $ sysctl fs.inotify
  # Changez les limites (temporaire)
  $ sudo sysctl fs.inotify.max_queued_events=16384
  $ sudo sysctl fs.inotify.max_user_instances=8192
  $ sudo sysctl fs.inotify.max_user_watches=524288
  ```

Si les étapes ci-dessus ne fonctionnent pas, vous pouvez essayer d'ajouter `DefaultLimitNOFILE=65536` comme configuration non commentée aux fichiers suivants :

- /etc/systemd/system.conf
- /etc/systemd/user.conf

Pour Ubuntu Linux, vous devrez peut-être ajouter la ligne `* - nofile 65536` au fichier `/etc/security/limits.conf` au lieu de mettre à jour les fichiers de configuration systemd.

Notez que ces paramètres sont persistants mais un **redémarrage est nécessaire**.

Sinon, si le serveur s'exécute à l'intérieur d'un Dev Container VS Code, la requêtre peut sembler bloquée. Pour corriger ce problème, voir [Dev Containers / Redirection de ports dans VS Code](#dev-containers-vs-code-port-forwarding).

### Les requêtes réseau arretent de se charger

Lorsque vous utilisez un certificat SSL auto-signé, Chrome ignore toutes les directives de mise en cache et recharge le contenu. Vite s'appuie sur ces directives de mise en cache.

Pour résoudre le problème, utilisez un certificat SSL de confiance.

Voir : [Problèmes de cache](https://helpx.adobe.com/mt/experience-manager/kb/cache-problems-on-chrome-with-SSL-certificate-errors.html), [Problème Chrome](https://bugs.chromium.org/p/chromium/issues/detail?id=110649#c8)

#### macOS

Vous pouvez installer un certificat de confiance via la ligne de commande avec cette commande :

```
security add-trusted-cert -d -r trustRoot -k ~/Library/Keychains/login.keychain-db your-cert.cer
```

Ou en l'important dans l'application Keychain Access et en mettant à jour la confiance de votre certificat à "Toujours approuver".

### 431 Request Header Fields Too Large

Lorsque le serveur / serveur WebSocket reçoit un en-tête HTTP volumineux, la requête sera abandonnée et l'avertissement suivant s'affichera.

> Server responded with status code 431. See https://vite.dev/guide/troubleshooting.html#_431-request-header-fields-too-large.

Cela est dû au fait que Node.js limite la taille des en-têtes de requête pour mitiger [CVE-2018-12121](https://www.cve.org/CVERecord?id=CVE-2018-12121).

Pour éviter cela, essayez de réduire la taille de votre en-tête de requête. Par exemple, si le cookie est long, supprimez-le. Ou vous pouvez utiliser [`--max-http-header-size`](https://nodejs.org/api/cli.html#--max-http-header-sizesize) pour modifier la taille maximale de l'en-tête.

### Dev Containers / Transfert de port VS Code

Si vous utilisez un Dev Container ou la fonctionnalité de transfert de port dans VS Code, vous devrez peut-être définir l'option [`server.host`](/config/server-options.md#server-host) sur `127.0.0.1` dans la configuration pour que cela fonctionne.

C'est parce que [la fonction de transfert de port dans VS Code ne prend pas en charge IPv6](https://github.com/microsoft/vscode-remote-release/issues/7029).

Voir [#16522](https://github.com/vitejs/vite/issues/16522) pour plus de détails.

## HMR

### Vite détecte un changement de fichier mais le HMR ne fonctionne pas

Vous importez peut-être un fichier avec une casse différente. Par exemple, `src/foo.js` existe et `src/bar.js` contient :

```js
import './Foo.js' // devrait être './foo.js'
```

Ticket associé : [#964](https://github.com/vitejs/vite/issues/964)

### Vite ne détecte pas un changement de fichier

Si vous exécutez Vite avec WSL2, Vite ne peut pas surveiller les changements de fichiers dans certaines conditions. Voir l'option [`server.watch`](/config/server-options.md#server-watch).

### Un rechargement complet se produit au lieu du HMR

Si le HMR n'est pas géré par Vite ou un plugin, un rechargement complet se produira car c'est la seule façon de rafraîchir l'état.

Si le HMR est géré mais qu'il se trouve dans une dépendance circulaire, un rechargement complet se produira également pour récupérer l'ordre d'exécution. Pour résoudre ce problème, essayez de rompre la boucle. Vous pouvez exécuter `vite --debug hmr` pour enregistrer le chemin de dépendance circulaire si un changement de fichier l'a déclenché.

## Build

### Le fichier construit ne fonctionne pas à cause d'une erreur CORS

Si le fichier HTML de sortie a été ouvert avec le protocole `file`, les scripts ne s'exécuteront pas avec l'erreur suivante.

> Access to script at 'file:///foo/bar.js' from origin 'null' has been blocked by CORS policy: Cross origin requests are only supported for protocol schemes: http, data, isolated-app, chrome-extension, chrome, https, chrome-untrusted.

> Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at file:///foo/bar.js. (Reason: CORS request not http).

Voir [Reason: CORS request not HTTP - HTTP | MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/Errors/CORSRequestNotHttp) pour plus d'informations sur les raisons de ce problème.

Vous devrez accéder au fichier avec le protocole `http`. La façon la plus simple d'y parvenir est d'exécuter `npx vite preview`.

## Dépendances optimisées

### Dépendances pré-bundlée obsolètes lors de la liaison à un package local

La clef de hash utilisée pour invalider les dépendances optimisées dépend du contenu du verrouillage de package, des correctifs appliqués aux dépendances et des options dans le fichier de configuration Vite qui affectent le regroupement des modules Node. Cela signifie que Vite détectera quand une dépendance est remplacée à l'aide d'une fonctionnalité comme [les remplacements npm](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#overrides), et regroupera à nouveau vos dépendances au prochain démarrage du serveur. Vite n'invalidera pas les dépendances lorsque vous utilisez une fonctionnalité comme [npm link](https://docs.npmjs.com/cli/v9/commands/npm-link). Si vous liez ou déliez une dépendance, vous devrez forcer la réoptimisation au prochain démarrage du serveur en utilisant `vite --force`. Nous vous recommandons d'utiliser des remplacements à la place, qui sont désormais pris en charge par tous les gestionnaires de packages (voir aussi [pnpm overrides](https://pnpm.io/package_json#pnpmoverrides) et [yarn resolutions](https://yarnpkg.com/configuration/manifest/#resolutions)).

## Goulets d'étranglement de performance

Si vous rencontrez des goulets d'étranglement de performance dans votre application entraînant des temps de chargement lents, vous pouvez démarrer l'inspecteur Node.js intégré avec votre serveur de développement Vite ou lors de la construction de votre application pour créer le profil CPU :

::: code-group

```bash [dev server]
vite --profile --open
```

```bash [build]
vite build --profile
```

:::

::: tip Serveur de développement Vite
Une fois votre application ouverte dans le navigateur, attendez simplement qu'elle finisse de se charger, puis retournez au terminal et appuyez sur la touche `p` (cela arrêtera l'inspecteur Node.js), puis appuyez sur la touche `q` pour arrêter le serveur de développement.
:::

L'inspecteur Node.js générera `vite-profile-0.cpuprofile` dans le dossier racine, allez sur https://www.speedscope.app/ et téléchargez le profil CPU à l'aide du bouton `BROWSE` pour examiner le résultat.

Vous pouvez installer [vite-plugin-inspect](https://github.com/antfu/vite-plugin-inspect), qui vous permet d'inspecter l'état intermédiaire des plugins Vite et peut également vous aider à identifier quels plugins ou middlewares sont le goulet d'étranglement dans vos applications. Le plugin peut être utilisé à la fois en mode développement et en mode construction. Consultez le fichier readme pour plus de détails.

## Autres

### Module externalisé pour la compatibilité avec le navigateur

Lorsque vous utilisez un module Node.js dans le navigateur, Vite affichera l'avertissement suivant.

> Module "fs" has been externalized for browser compatibility. Cannot access "fs.readFile" in client code.

Cela est dû au fait que Vite ne fournit pas automatiquement de polyfills pour les modules Node.js.

Nous recommandons d'éviter les modules Node.js pour le code du navigateur afin de réduire la taille du bundle, bien que vous puissiez ajouter manuellement des polyfills. Si le module est importé depuis une bibliothèque tierce (destinée à être utilisée dans le navigateur), il est conseillé de signaler le problème à la bibliothèque concernée.

### Une erreur de syntaxe / erreur de type se produit

Vite ne peut pas gérer et ne prend pas en charge le code qui ne s'exécute qu'en mode non strict (mode laxiste). Cela est dû au fait que Vite utilise ESM et qu'il est toujours en [mode strict](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode) à l'intérieur des ESM.

Par exemple, vous pourriez voir ces erreurs.

> [ERROR] With statements cannot be used with the "esm" output format due to strict mode

> TypeError: Cannot create property 'foo' on boolean 'false'

Si ces codes sont utilisés dans des dépendances, vous pouvez utiliser [`patch-package`](https://github.com/ds300/patch-package) (ou [`yarn patch`](https://yarnpkg.com/cli/patch) ou [`pnpm patch`](https://pnpm.io/cli/patch)) comme solution de contournement.

### Extensions de navigateur

Certaines extensions de navigateur (comme les bloqueurs de publicités) peuvent empêcher le client Vite d'envoyer des requêtes au serveur de développement Vite. Vous pourriez voir un écran blanc sans erreurs enregistrées dans ce cas. Essayez de désactiver les extensions si vous rencontrez ce problème.

### Liens entre lecteurs sur Windows

S'il y a des liens entre lecteurs dans votre projet sur Windows, Vite pourrait ne pas fonctionner.

Exemples de liens entre lecteurs :

- un lecteur virtuel lié à un dossier par la commande `subst`
- un lien symbolique/jonction vers un lecteur différent par la commande `mklink` (par exemple, le cache global de Yarn)

Ticket associé : [#10802](https://github.com/vitejs/vite/issues/10802)
