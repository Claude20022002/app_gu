#	=====	ÉTAPE	1	:	construction	(build)	avec	Node	=====
FROM node:20-alpine	AS build
WORKDIR	/app

#	Copie	des	fichiers	de	dépendances	puis	installation	(cache).
COPY package.json package-lock.json*	./
RUN	npm	install

#	Copie	du	reste	du	code	et	compilation	en	fichiers	statiques.
COPY . .
RUN	npm	run	build		

#	produit	le	dossier	/app/dist
#	=====	ÉTAPE	2	:	service	(serve)	avec	Nginx	=====
FROM nginx:1.27-alpine

#	On	copie	SEULEMENT	le	résultat	compilé	depuis	l'étape	"build".
COPY --from=build /app/dist /usr/share/nginx/html

#	Notre	configuration	Nginx	(gère	le	routage	d'une	"single	page	app").
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
