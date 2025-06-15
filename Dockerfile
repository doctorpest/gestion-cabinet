FROM nginx:alpine

COPY frontend/gestion-cabinet-front/dist/spa /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]