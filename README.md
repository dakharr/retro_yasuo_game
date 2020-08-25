# Yasuo game

![yasuo logo](resources/chibi_yasuo.jpg)

## Synopsis

Vous devez aider yasuo à rejoindre le concert de DJ Sona qui est **l'endroit où aller**. 

Vous allez devoir bravez les collines vallonées de Ionia et ses dangereux poros.

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

## La vidéo

Une vidéo de présentation du jeu est disponible [ici](https://youtu.be/qOd6T5icWsk)

## Détails techniques

Voici quelques détails sur les techniques que nous avons mises en place dans le jeu.

### Éditeur de niveau

Nous avons mis en place un éditeur de niveau pour accélérer la production et améliorer la qualité des niveaux du jeu.
Cet éditeur se présente sous la forme d'une page html qui va nous permettre de faire notre niveau puis va nous générer une chaine de caractère à ajouter dans la liste des niveaux.

On peut accéder à l'éditeur en ajoutant /editor au chemin du jeu sur le navigateur (ne fonctionne pas sur itch.io).

### Mécanique de saut

Pour le saut nous utilisons une formule qui nous permet de sauter à une hauteur prédéfinie. De plus pour éviter de frustrer le joueur s'il saute trop tard d'une platforme, nous avons ajouté un petit délai où le joueur peut encore sauter même s'il n'est plus sur la platforme.

### Audio

Nous avons porté une attention toute particulière à l'audio du jeu. Notamment grâce à la participation de Nathan Miniere qui a produit les musiques du jeu. Nous avons aussi utilisé des bruitages pour les sauts et attaques du personnage.

### Optimisation de l'affichage des blocks

Grâce à l'utilisation de block on peut optimiser drastiquement l'affichage du jeu lui permettant d'être potentiellement "jouable" sur mobile (avec l'ajout de commande adapté à la platforme).

### Fonds parallax

Pour rendre nos niveaux plus dynamiques nous avons utilisé l'effet de parallax. Cela consiste à mettre plusieurs fonds qui défilent à des vitesses différentes pour donner une illusion de profondeur. Pour notre jeu nous avons fait un parallax pour le monde des plaines et un pour celui de la grotte, chacun composé de 3 couches.

## Remerciements

Nous tenons à remercier les organisateurs de Games on Web 2020 pour avoir organisé ce concours, Michel Buffa et Sebastien Vandenberghe pour leurs aides et leurs conseils.

Nous tenons à remercier tout particulièrement Nathan Miniere qui a composé les musiques du jeu.

## Liens utiles

https://www.babylonjs.com

https://www.cgi.fr/fr-fr/event/games-on-web-2020

https://www.nathanminiere.com
