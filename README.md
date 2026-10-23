# MotMystere-FRONTEND <https://mot-mystere-frontend.vercel.app/>

Projet collectif semaine FRONTEND sup de vinci

Fernandes Hadrien
Berger-Terrasse Corentin

Palier visé :

Palier 1 : Validé
Palier 2 : Validé
Palier 3 : Validé
Palier 4 : En cours

Pour lancer l'application en local, récuperer le code du depot github, exécutter npm install en ligne de commande puis npm run dev. L'application est également accessbile en ligne via https://mot-mystere-frontend.vercel.app/
Pour la tester : 

Difficultées rencontrées et resolution : 
    - Pour verifier qu'un mot est bien un mot francais, j'ai utilisé la requete : <https://fr.wiktionary.org/w/api.php?action=query&list=search&srsearch=ecole&format=json> qui permet de récuperer tout les mots du wiktionnaire proche du mot donné par l'utilisateur ce qui permet de passer outre le probleme des accents. Par exemple si l'utilisateur entre ecole, on veut récuperer école. Mais cette requete recupere des mots qu'on ne voulait pas comme auto-école. Pour corriger ca, on ne garde que les mots qui normalisés (suppression des accents et caractéres spéciaux ) correspondent au mot de l'utilisateur. Ensuite pour verifier que ces mots sont des mots francais, on utilise la requete : <https://fr.wiktionary.org/w/api.php?action=query&titles=%C3%A9cole|%C3%A9col%C3%A9&prop=categories&format=json> ce qui nous permet de voir les categories comme Exemples en français, Formes de verbes en français, ou Lemmes en français. Ca nous permet de valider que c'est un mot francais en vérifiant que ca contient "en francais".

## React + Vite + API