Bugs :
	Ajouter un shoot ne rafraichit pas le menu navbar
	Ajouter une image en drag&drop affiche un thumb cassé (fix refresh)
	Les références doivent etre triées par + récent dans Mongo
	Le check mot de passe n'est pas actif sur le login
	Le logout n'est pas actif sur le menu

Todo :
	- Options de tri (filters ?) sur les références
	- Pagination sur les références
	- Meilleure gestion des droits,
		ex: un user ne peut cliquer que son job
			mode spectateur
			admin peut tout cocher/supprimer
	- Socket.io . Bitch.
	- Update de la config d'un shoot
		ex: changer le nom
			ajouter/enlever des jobs
	- Simplifier le fonctionnement de Job._linkUsers, c'est trop compliqué du fait qu'un
	  user devrait pouvoir etre worker sur plusieurs Jobs.
		ex: @param users Array [{ <mail@tld> : <jobid> }] pourrait etre
		ex: @param users Array [{ <mail@tld> : [ <jobid>, <jobid> ] }]
	  et éviter des boucles peu agréables à relire.
	- Meilleure invitation d'utilisateurs, un compte 'vide' devrait être créé pour le user invité,
      ca simplifierait de beaucoup le process de workers/observers/invitations et serait
      plus tranquille pour la base de données (pas besoin de rechercher l'appartenance d'un user a l'inscription)


Misc :
	Voir https://github.com/angular/angular.js/issues/1937 pour les problemes de urlencode en POST