# Dockerfile
FROM nginx:alpine

# Copie les fichiers Quasar déjà buildés
COPY gestion-cabinet/frontend/gestion-cabinet-front/dist/spa /usr/share/nginx/html

# Optionnel : suppression du fichier de conf par défaut NGINX
RUN rm /etc/nginx/conf.d/default.conf

# Ajout de ta propre config (si nécessaire)
# COPY nginx.conf /etc/nginx/conf.d

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]