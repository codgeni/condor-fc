# Plateforme du Club Condor

## Cahier de modifications

Ce document liste les modifications demandées pour la plateforme du club, section par section. Il est mis à jour au fur et à mesure de la réception des éléments bruts et des visites du site existant, puis sert de référence pour l'équipe de développement.

**Version : 1.1**
**Date : 17 juin 2026**

---

# 1. Page d'accueil (Accueil)

## 1.1. Bannière principale (Hero)

### Modifications demandées

* Supprimer l'animation actuelle (île + oiseaux).
* La remplacer par un slider de 6 à 7 photos de l'équipe.

### Administration

Ajouter une fonctionnalité permettant :

* d'ajouter les photos ;
* de supprimer des photos ;
* de modifier leur ordre d'affichage.

---

## 1.2. Message de bienvenue

### Modifications demandées

* Ajouter le slogan officiel du club.
* Ajuster l'affichage afin que l'image de fond reste bien visible derrière le texte.

### À supprimer

* Billetterie
* Découvrir le club

---

## 1.3. Prochain match

### À conserver

* Le compte à rebours.

### À ajouter

* Le logo du club.
* Le logo de l'équipe adverse.
* Prévoir un emplacement dédié de chaque côté des informations du match.

---

## 1.4. Section « À la Une »

### Cette section doit présenter

* l'actualité principale ;
* la boutique ;
* les communiqués du club.

### Correction graphique

* Toutes les cartes doivent avoir exactement la même hauteur afin que leur base soit parfaitement alignée.

---

## 1.5. Joueurs mis en avant

### Ajouter une nouvelle section présentant

* les meilleurs joueurs de la saison ;
* les joueurs du mois.

### Fonctionnalités

Le système doit permettre :

* d'afficher 3 ou 4 joueurs simultanément ;
* de faire défiler les autres joueurs avec un slider.

### Administration

Les joueurs seront sélectionnés depuis l'administration.

---

## 1.6. Vidéos / Highlights

### À conserver

* les sponsors.

### À supprimer

* la section Fondation.

### À ajouter

Une section permettant d'afficher :

* les derniers résumés de matchs ;
* les meilleurs moments (highlights) ;
* des vidéos YouTube via lien.

---

## 1.7. Logo

### Comportement attendu

Lorsque l'utilisateur clique sur le logo du club :

* retour automatique tout en haut de la page d'accueil.

---

# 2. Actualités

## Organisation

Afficher toutes les actualités de toutes les catégories dans une seule liste.

### Supprimer complètement

* Académie Jeunesse ;
* Santé médicale ;
* Communiqués médicaux.

### Conserver

* Une seule grande rubrique « Actualités ».

### Supprimer

* la grande carte principale ;
* les deux cartes latérales.

### Remplacer par

* afficher les dernières actualités sous forme d'une liste homogène ;
* permettre le défilement des anciennes actualités.

---

# 3. Équipes

Au clic sur « Équipe », ouvrir un menu permettant de choisir une catégorie :

* Équipe Première
* U17
* U15
* U13
* etc.

Une fois la catégorie sélectionnée, afficher automatiquement :

* Gardiens
* Défenseurs
* Milieux
* Attaquants

### Informations à afficher pour chaque joueur

* photo ;
* nom ;
* numéro ;
* poste.

---

## 3.1. Fiche détaillée des joueurs

Lorsqu'un utilisateur clique sur un joueur depuis une catégorie, il doit accéder à une page de profil complète.

### Design

Modifier complètement la présentation actuelle.

### À supprimer

* La double photo (photo d'arrière-plan + petite photo).
* La section « Derniers matchs ».

### Nouveau design

* Une seule photo officielle du joueur.
* Une photo de grande taille occupant une place importante dans la page afin de bien mettre le joueur en valeur.
* À proximité de la photo, afficher les informations essentielles.

### Informations du joueur

Chaque fiche devra afficher au minimum :

* Nom complet
* Numéro de maillot
* Poste
* Date de naissance
* Lieu de naissance
* Taille
* Poids
* Pied fort (droit ou gauche)
* Nationalité (si applicable)

### Administration

Le système devra permettre d'ajouter ou modifier ces informations depuis l'administration.

### Statistiques

Conserver une section dédiée aux statistiques comprenant notamment :

* Matchs joués
* Buts
* Passes décisives
* Autres statistiques qui pourront être ajoutées ultérieurement

### Biographie

Ajouter une section Biographie entre les statistiques et le palmarès.

Cette biographie présentera un court texte décrivant :

* le parcours du joueur ;
* son profil ;
* son évolution au sein du club.

Le contenu sera entièrement modifiable depuis l'administration.

### Palmarès

Conserver la section Palmarès, placée après la biographie.

Elle permettra d'afficher les trophées, distinctions ou récompenses du joueur.

### Ordre final de la page

1. Grande photo du joueur
2. Informations personnelles
3. Statistiques
4. Biographie
5. Palmarès

Cette modification complète la partie Équipes en définissant une fiche joueur plus moderne, plus lisible et plus valorisante pour chaque joueur du club.

---

# 4. Condor TV

### Conserver

* la grande vidéo principale ;
* Résumés des matchs ;
* Coulisses ;
* Documentaires.

### Supprimer

* la section Cofruffor.

---

# 5. Le Club

### Conserver

* l'histoire du club (texte fourni ultérieurement).

### Supprimer

* Notre philosophie ;
* Fondation Condor.

### Remplacer la section « Recrutement » par

## Staff

Afficher pour chaque membre :

* photo ;
* nom ;
* fonction.

---

# 6. Boutique

### Conserver

* la collection 2027.

### Modifications

* remplacer les images actuelles par les vraies photos ;
* ajouter un texte fourni par les dirigeants.

### Supprimer

* Personnalisation ;
* Collection Héritage.

### Afficher uniquement

* la liste des équipements disponibles.

### Limitation d'affichage

* Limiter le nombre de produits affichés simultanément (1 ou 2 maximum).

---

# 7. Billetterie

### Action demandée

* Supprimer entièrement la section Billetterie.

---

# 8. Comptes supporters

Créer un système de compte « Supporter ».

### Le supporter pourra

* créer un compte ;
* renseigner son nom ;
* saisir son adresse e-mail.

### Après inscription, il recevra automatiquement

* les nouvelles actualités ;
* les communiqués ;
* les annonces importantes.

### Notifications e-mail en temps réel

Ajouter également des notifications e-mail pour les matchs :

* début du match ;
* buts ;
* score à la mi-temps ;
* score final.

---

# 9. Stages et inscriptions

Créer une nouvelle rubrique.

S'inspirer du fonctionnement du site du FC Toronto (adapté au club).

---

## Informations

Afficher :

* prochains stages ;
* dates ;
* catégories concernées.

---

## Pré-inscription

Créer un formulaire contenant notamment :

* nom ;
* prénom ;
* date de naissance ;
* numéro de téléphone ;
* photo ;
* autres informations nécessaires.

### Administration

Le club pourra consulter toutes les inscriptions depuis l'administration.

### Ajouter également

* prise de rendez-vous ;
* formulaire de contact.

### Afficher

* les coordonnées du club.

---

# 10. Pied de page

Les sections suivantes seront réorganisées ultérieurement :

* Le Club
* L'Équipe
* Contact
* Liens utiles

---

# 11. Administration

Prévoir une gestion complète permettant notamment :

* gérer le slider de la page d'accueil ;
* gérer les actualités ;
* gérer les joueurs ;
* gérer les joueurs du mois ;
* gérer les meilleurs joueurs ;
* gérer les vidéos ;
* gérer les produits de la boutique ;
* gérer les stages ;
* consulter les inscriptions ;
* gérer les membres supporters ;
* envoyer automatiquement les notifications par e-mail.

---

# Documents à fournir ultérieurement

Les dirigeants fourniront :

* les textes de l'histoire du club ;
* le slogan officiel ;
* les photos officielles ;
* les photos du staff ;
* les photos des joueurs ;
* les produits de la boutique ;
* les vidéos ;
* les textes de présentation ;
* les logos nécessaires.

---

Ce document est structuré comme un cahier des charges fonctionnel et pourra être utilisé directement par l'équipe de développement comme liste de modifications à implémenter. Il sera complété au fur et à mesure des prochains éléments transmis.
