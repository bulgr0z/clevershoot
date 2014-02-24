Bugs :
	Ajouter un shoot ne rafraichit pas le menu navbar
	Ajouter une image en drag&drop affiche un thumb cassé (fix refresh)
	Les références doivent etre triées par + récent dans Mongo
	Le check mot de passe n'est pas actif sur le login
	Le logout n'est pas actif sur le menu

Todo :
	Options de tri (filters ?) sur les références
	Pagination sur les références
	Meilleure gestion des droits,
		ex: un user ne peut cliquer que son job
			mode spectateur
			admin peut tout cocher/supprimer
	Socket.io . Bitch.
	Update de la config d'un shoot
		ex: changer le nom
			ajouter/enlever des jobs

Misc :
	Voir https://github.com/angular/angular.js/issues/1937 pour les problemes de urlencode en POST