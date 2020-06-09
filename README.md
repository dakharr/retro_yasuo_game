# Yasuo game

![yasuo logo](resources/chibi_yasuo.jpg)

## Synopsis

Vous devez aider yasuo à rejoindre le concert de DJ Sona qui est **l'endroit où aller**. 

Vous allez devoir bravez les collines vallonées de ionia et ses dangereux poros.

Bon jeu ! 

## Commandes

Commande | Action
-------------- | ----------------
qd | déplacement gauche-droite
z | saut
spacebar | attaque

*(pour un clavier azerty)*

## Le jeu

le jeu est disponible sur ce lien : https://dakharr.itch.io/yasuo

## Détails techniques

Voici quelques détails sur les techniques que nous avons mis en place dans le jeu.

### Editeur de niveau

Nous avons mis en place un editeur de niveau pour accélérer la production ainsi que la qualité des niveaux pour le jeu.
Cet editeur se présente sous la forme d'une page html qui va nous permettre de faire notre niveau puis va nous générer une chaine de caractère à ajouter dans la liste des niveaux.

on peut accéder a l'éditeur a partir en ajoutant /editor au chemin du jeu sur le navigateur.

### Mecanique de saut

Calcul spécifique pour atteindre une certaine hauteur...

### l'Audio

Nous avons porté une attention toute particulière a l'audio du jeu. Nottament grace à la participation de Nathan Miniere qui a produit les musiques du jeu mais aussi sur les bruitages avec de multiples sons pour les sauts et attaques du personnage.

### Optimisation de l'affichage des blocks

Grace à l'utilisation de block on peut optimiser drastiquement l'affichage du jeu le permettant d'être potentiellement "jouable" sur mobile (avec l'ajout de commande adapté à la platforme).

### Fonds parallax

Pour rendre nos niveaux plus dynamique nous avons utilisé l'effet de parallax. Cela consiste a mettre plusieurs fond qui défilent a des vitesses différentes pour donner une illusion de profondeur. Pour notre jeu nous avons fait un paralax pour le monde des plaines et pour la grotte chacun composé de 3 couches.
