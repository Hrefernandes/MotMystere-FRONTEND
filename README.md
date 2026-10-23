# MotMystere-FRONTEND <https://mot-mystere-frontend.vercel.app/>

Projet collectif semaine FRONTEND Sup de Vinci

Fernandes Hadrien
Berger-Terrasse Corentin

Palier visé :

Palier 1 : Validé
Palier 2 : Validé
Palier 3 : Validé
Palier 4 : Validé
Palier 5 : En cours

Pour lancer l'application en local, récupérer le code du dépôt GitHub, exécuter `npm install` en ligne de commande puis `npm run dev`. L'application est également accessible en ligne via <https://mot-mystere-frontend.vercel.app/>

Pour la tester : `npm run test` lance les tests automatisés (coloration des lettres dont les lettres en double, statistiques, compte à rebours et mot du jour).

Bibliothèques :

- React et React Router : interface et navigation entre les écrans
- Vite : lancer et construire le projet
- GSAP Draggable et InertiaPlugin : animations d'entrée et tuiles déplaçables (accueil, règles), but ajouter plus d'animation sur les pages
- Vitest : tests automatisés
- API du Wiktionnaire : vérifier qu'un mot est français

Choix techniques :

- Pas de serveur : les parties sont enregistrées dans le `localStorage` du navigateur.
- Le mode de jeu est dans l'adresse (`/partie?mode=free` ou `/partie?mode=daily`).
- Le mot du jour est calculé à partir de la date de Paris, donc il est identique pour tous et change à minuit. La partie est sauvegardée à chaque coup pour reprendre après un rechargement.
- Les appels à l'API sont regroupés dans un seul fichier : `src/utils/wiktionary.js`.

Difficultés rencontrées et résolution :

- Pour vérifier qu'un mot est bien un mot français, nous avons utilisé la requête : <https://fr.wiktionary.org/w/api.php?action=query&list=search&srsearch=ecole&format=json> qui permet de récupérer tous les mots du Wiktionnaire proches du mot donné par l'utilisateur, ce qui permet de passer outre le problème des accents. Par exemple si l'utilisateur entre ecole, on veut récupérer école. Mais cette requête récupère des mots qu'on ne voulait pas comme auto-école. Pour corriger ça, on ne garde que les mots qui, normalisés (suppression des accents et caractères spéciaux), correspondent au mot de l'utilisateur. Ensuite pour vérifier que ces mots sont des mots français, on utilise la requête : <https://fr.wiktionary.org/w/api.php?action=query&titles=%C3%A9cole|%C3%A9col%C3%A9&prop=categories&format=json> ce qui nous permet de voir les catégories comme Exemples en français, Formes de verbes en français, ou Lemmes en français. Ça nous permet de valider que c'est un mot français en vérifiant que ça contient "en français".
- Lettres en double (par exemple ERRER contre ARBRE) : on colore d'abord les lettres bien placées, puis les lettres mal placées en comptant celles qui restent. Deux tests automatisés couvrent ce cas.

Si l'API est indisponible :

L'application affiche « La vérification du mot est impossible pour le moment. Réessaie. ». Le mot n'est pas accepté et l'essai n'est pas compté. Justification : accepter les mots sans vérification permettrait d'essayer des lettres au hasard, ce qui est injuste, surtout pour le mot du jour. Ne pas compter l'essai évite de pénaliser le joueur à cause d'une panne.

## React + Vite + API
