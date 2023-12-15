FROM node:20.9.0-slim

# Docker ImageのDebianバージョンが古いのでバージョンを上げる
RUN echo "deb http://archive.debian.org/debian/ stretch main" > /etc/apt/sources.list \
    && echo "deb http://archive.debian.org/debian-security stretch/updates main" >> /etc/apt/sources.list \
    && apt update -y

# 必要なパッケージ群をインストール
RUN apt install -y openssh-client curl rsync procps git ca-certificates
RUN npm install -g npm@latest

WORKDIR /mysite-next
