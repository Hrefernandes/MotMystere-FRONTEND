# Mot Mystère FRONTEND <https://mot-mystere-frontend.vercel.app/>

Projet collectif réalisé pendant la semaine Frontend de Sup de Vinci.

Membres du projet :

- Fernandes Hadrien
- Berger-Terrasse Corentin

## Paliers visés

- Palier 1 : validé
- Palier 2 : validé
- Palier 3 : validé
- Palier 4 : validé
- Palier 5 : validé

## Lancer l'application

Pour lancer l'application en local, récupérez le code du dépôt GitHub, puis exécutez la commande suivante dans un terminal :

```bash
npm install
```

Ensuite, exécutez la commande suivante pour lancer l'application :

```bash
npm run dev
```

L'application est également accessible en ligne via <https://mot-mystere-frontend.vercel.app/>

## Tester l'application

Lancez la commande suivante pour tester l'application :

```bash
npm run test
```

## Bibliothèques

- GSAP Draggable et InertiaPlugin : animations d'entrée et tuiles déplaçables (accueil, règles, stats), mais ajouter plus d'animation sur les pages

## Difficultés rencontrées et résolution

- Pour vérifier qu'un mot est bien un mot français, j'ai utilisé la requête : <https://fr.wiktionary.org/w/api.php?action=query&list=search&srsearch=ecole&format=json> qui permet de récupérer tout les mots du wiktionnaire proche du mot donné par l'utilisateur ce qui permet de passer outre le problème des accents. Par exemple si l'utilisateur entre "ecole", on veut récupérer "école". Mais cette requête récupère des mots qu'on ne voulait pas comme "auto-école". Pour corriger cela, on ne garde que les mots qui normalisés (suppression des accents et caractères spéciaux ) correspondent au mot de l'utilisateur. Ensuite pour vérifier que ces mots sont des mots français, on utilise la requête : <https://fr.wiktionary.org/w/api.php?action=query&titles=%C3%A9cole|%C3%A9col%C3%A9&prop=categories&format=json> ce qui nous permet de voir les catégories comme Exemples en français, Formes de verbes en français, ou Lemmes en français. Ca nous permet de valider que c'est un mot français en vérifiant que ca contient "en français".



Les listes de mots de longueur 6 et 7 ont été récupérées grâce à l'API du site <https://trouve-mot.fr/>, le programme faisant la récupération est `src/data/getWordList`. Vous pouvez l'exécuter et générer de nouvelles listes avec la commande `npm run generate:words`

Ajout après le passage à l'oral :

- Gestion des liens invalides
- Ajout des fichiers `src/hooks/useGameKeyboard`, `src/utils/gameBoard` et `src/utils/gameBoard` contenant des fonctions anciennement dans `src/hooks/inputs`
- Modes difficile et longueur 6 et 7

## React + Vite + API