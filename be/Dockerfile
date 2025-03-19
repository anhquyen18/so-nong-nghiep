FROM php:8.2-fpm-alpine3.19

WORKDIR /var/www/html

COPY composer.json composer.lock /var/www/html/

RUN apk --no-cache add \
    shadow \
    git \
    bash \
    postgresql-dev \
    pcre-dev \
    ${PHPIZE_DEPS} \
    && usermod -u 1000 www-data \
    && docker-php-ext-install pdo pdo_pgsql \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apk del pcre-dev ${PHPIZE_DEPS}

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer \
    && composer install --optimize-autoloader --no-interaction --no-scripts
COPY . /var/www/html/

RUN chown -R www-data:www-data \
    /var/www/html/storage \
    /var/www/html/bootstrap/cache
RUN php artisan route:clear

EXPOSE 9000
CMD ["php-fpm"]

