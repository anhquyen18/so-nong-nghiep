FROM php:8.3.7RC1-fpm-alpine3.19

# Set working directory
WORKDIR /var/www/html/

RUN mkdir -p /var/www/html

COPY ./be /var/www/html

RUN apk --no-cache add shadow && usermod -u 1000 www-data

RUN docker-php-ext-install pdo pdo_mysql

RUN apk --no-cache add pcre-dev ${PHPIZE_DEPS} \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apk del pcre-dev ${PHPIZE_DEPS}

RUN set -ex \
    && apk --no-cache add \
    postgresql-dev \
    php-pgsql

RUN docker-php-ext-install pdo pdo_pgsql
