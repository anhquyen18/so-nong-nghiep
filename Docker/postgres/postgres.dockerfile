FROM postgres:16.6-bullseye
# Các extention nên chọn version phù hợp với postgres được yêu cầu
RUN apt-get update && \
    apt-get install -y postgis postgresql-16-postgis-3 postgresql-16-pgrouting

COPY ./init.sql /docker-entrypoint-initdb.d/
EXPOSE 5432