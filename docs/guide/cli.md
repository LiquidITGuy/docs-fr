# Interface en ligne de commande

## Serveur de développement

### `vite`

Démarrer le serveur de développement Vite dans le répertoire courant. `vite dev` et `vite serve` sont des alias pour `vite`.

#### Utilisation

```bash
vite [root]
```

#### Options

| Options                   |                                                                                                                                                                                                     |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--host [host]`           | Spécifier le nom d'hôte (`string`)                                                                                                                                                                  |
| `--port <port>`           | Spécifier le port (`number`)                                                                                                                                                                        |
| `--open [path]`           | Ouvrir le navigateur au démarrage (`boolean \| string`)                                                                                                                                             |
| `--cors`                  | Activer CORS (`boolean`)                                                                                                                                                                            |
| `--strictPort`            | Quitter si le port spécifié est déjà utilisé (`boolean`)                                                                                                                                            |
| `--force`                 | Forcer l'optimiseur à ignorer le cache et refaire le regroupement (`boolean`)                                                                                                                       |
| `-c, --config <file>`     | Utiliser le fichier de configuration spécifié (`string`)                                                                                                                                            |
| `--base <path>`           | Chemin de base public (par défaut : `/`) (`string`)                                                                                                                                                 |
| `-l, --logLevel <level>`  | info \| warn \| error \| silent (`string`)                                                                                                                                                          |
| `--clearScreen`           | Autoriser/désactiver l'effacement de l'écran lors de la journalisation (`boolean`)                                                                                                                  |
| `--configLoader <loader>` | Utiliser `bundle` pour regrouper la configuration avec esbuild, ou `runner` (expérimental) pour la traiter à la volée, ou `native` (expérimental) pour la charger en utilisant le runtime natif (par défaut : `bundle`) |
| `--profile`               | Démarrer l'inspecteur Node.js intégré (vérifier [Goulets d'étranglement de performance](/guide/troubleshooting#performance-bottlenecks))                                                            |
| `-d, --debug [feat]`      | Afficher les logs de débogage (`string \| boolean`)                                                                                                                                                 |
| `-f, --filter <filter>`   | Filtrer les logs de débogage (`string`)                                                                                                                                                             |
| `-m, --mode <mode>`       | Définir le mode d'environnement (`string`)                                                                                                                                                          |
| `-h, --help`              | Afficher les options CLI disponibles                                                                                                                                                                |
| `-v, --version`           | Afficher le numéro de version                                                                                                                                                                       |

## Build

### `vite build`

Construction pour la production.

#### Utilisation

```bash
vite build [root]
```

#### Options

| Options                        |                                                                                                                                                 |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `--target <target>`            | Cible de transpilation (par défaut : `"modules"`) (`string`)                                                                                    |
| `--outDir <dir>`               | Répertoire de sortie (par défaut : `dist`) (`string`)                                                                                           |
| `--assetsDir <dir>`            | Répertoire sous outDir pour placer les assets (par défaut : `"assets"`) (`string`)                                                              |
| `--assetsInlineLimit <number>` | Seuil d'intégration en base64 des assets statiques en octets (par défaut : `4096`) (`number`)                                                   |
| `--ssr [entry]`                | Compiler l'entrée spécifiée pour le rendu côté serveur (`string`)                                                                               |
| `--sourcemap [output]`         | Générer des source maps pour le build (par défaut : `false`) (`boolean \| "inline" \| "hidden"`)                                                |
| `--minify [minifier]`          | Activer/désactiver la minification, ou spécifier le minifieur à utiliser (par défaut : `"esbuild"`) (`boolean \| "terser" \| "esbuild"`)        |
| `--manifest [name]`            | Émettre un manifeste de build en json (`boolean \| string`)                                                                                     |
| `--ssrManifest [name]`         | Émettre un manifeste ssr en json (`boolean \| string`)                                                                                          |
| `--emptyOutDir`                | Forcer le vidage de outDir quand il est en dehors de root (`boolean`)                                                                           |
| `-w, --watch`                  | Recompiler lorsque les modules ont changé sur le disque (`boolean`)                                                                             |
| `-c, --config <file>`          | Utiliser le fichier de configuration spécifié (`string`)                                                                                        |
| `--base <path>`                | Chemin de base public (par défaut : `/`) (`string`)                                                                                             |
| `-l, --logLevel <level>`       | Info \| warn \| error \| silent (`string`)                                                                                                      |
| `--clearScreen`                | Autoriser/désactiver l'effacement de l'écran lors de la journalisation (`boolean`)                                                              |
| `--configLoader <loader>`      | Utiliser `bundle` pour regrouper la configuration avec esbuild ou `runner` (expérimental) pour la traiter à la volée (par défaut : `bundle`)    |
| `--profile`                    | Démarrer l'inspecteur Node.js intégré (vérifier [Goulets d'étranglement de performance](/guide/troubleshooting#performance-bottlenecks))        |
| `-d, --debug [feat]`           | Afficher les logs de débogage (`string \| boolean`)                                                                                             |
| `-f, --filter <filter>`        | Filtrer les logs de débogage (`string`)                                                                                                         |
| `-m, --mode <mode>`            | Définir le mode d'environnement (`string`)                                                                                                      |
| `-h, --help`                   | Afficher les options CLI disponibles                                                                                                            |
| `--app`                        | Compiler tous les environnements, équivalent à `builder: {}` (`boolean`, expérimental)                                                         |

## Autres

### `vite optimize`

Pré-regrouper les dépendances.

**Déprécié** : le processus de pré-regroupement s'exécute automatiquement et n'a pas besoin d'être appelé.

#### Utilisation

```bash
vite optimize [root]
```

#### Options

| Options                   |                                                                                                                                              |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `--force`                 | Forcer l'optimiseur à ignorer le cache et refaire le regroupement (`boolean`)                                                                |
| `-c, --config <file>`     | Utiliser le fichier de configuration spécifié (`string`)                                                                                     |
| `--base <path>`           | Chemin de base public (par défaut : `/`) (`string`)                                                                                          |
| `-l, --logLevel <level>`  | Info \| warn \| error \| silent (`string`)                                                                                                   |
| `--clearScreen`           | Autoriser/désactiver l'effacement de l'écran lors de la journalisation (`boolean`)                                                           |
| `--configLoader <loader>` | Utiliser `bundle` pour regrouper la configuration avec esbuild ou `runner` (expérimental) pour la traiter à la volée (par défaut : `bundle`) |
| `-d, --debug [feat]`      | Afficher les logs de débogage (`string \| boolean`)                                                                                          |
| `-f, --filter <filter>`   | Filtrer les logs de débogage (`string`)                                                                                                      |
| `-m, --mode <mode>`       | Définir le mode d'environnement (`string`)                                                                                                   |
| `-h, --help`              | Afficher les options CLI disponibles                                                                                                         |

### `vite preview`

Prévisualiser localement le build de production. Ne pas utiliser ceci comme serveur de production car il n'est pas conçu pour cela.

#### Utilisation

```bash
vite preview [root]
```

#### Options

| Options                   |                                                                                                                                              |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `--host [host]`           | Spécifier le nom d'hôte (`string`)                                                                                                           |
| `--port <port>`           | Spécifier le port (`number`)                                                                                                                 |
| `--strictPort`            | Quitter si le port spécifié est déjà utilisé (`boolean`)                                                                                     |
| `--open [path]`           | Ouvrir le navigateur au démarrage (`boolean \| string`)                                                                                      |
| `--outDir <dir>`          | Répertoire de sortie (par défaut : `dist`)(`string`)                                                                                         |
| `-c, --config <file>`     | Utiliser le fichier de configuration spécifié (`string`)                                                                                     |
| `--base <path>`           | Chemin de base public (par défaut : `/`) (`string`)                                                                                          |
| `-l, --logLevel <level>`  | Info \| warn \| error \| silent (`string`)                                                                                                   |
| `--clearScreen`           | Autoriser/désactiver l'effacement de l'écran lors de la journalisation (`boolean`)                                                           |
| `--configLoader <loader>` | Utiliser `bundle` pour regrouper la configuration avec esbuild ou `runner` (expérimental) pour la traiter à la volée (par défaut : `bundle`) |
| `-d, --debug [feat]`      | Afficher les logs de débogage (`string \| boolean`)                                                                                          |
| `-f, --filter <filter>`   | Filtrer les logs de débogage (`string`)                                                                                                      |
| `-m, --mode <mode>`       | Définir le mode d'environnement (`string`)                                                                                                   |
| `-h, --help`              | Afficher les options CLI disponibles                                                                                                         |
