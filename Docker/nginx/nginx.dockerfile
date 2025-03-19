FROM nginx:stable-alpine

ADD ./default.conf /etc/nginx/conf.d/default.conf
# RUN mkdir -p /var/www/vuejs-app

#RUN mkdir -p /etc/nginx/certs/mkcert

#ADD /certs/ /etc/nginx/certs/mkcert