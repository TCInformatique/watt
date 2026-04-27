#!/bin/bash

CONTAINER_NAME="db-dev-postgres"
IMAGE="timescale/timescaledb:latest-pg17"
NO_SECURE_PASS="dev-password"

if [ "$(docker ps -q -f name=^/${CONTAINER_NAME}$)" ]; then
    echo "Le container '$CONTAINER_NAME' est déjà prêt."
    exit 0
fi

if [ ! "$(docker ps -aq -f name=^/${CONTAINER_NAME}$)" ]; then
    echo "Création du container '$CONTAINER_NAME'"
    docker run --name $CONTAINER_NAME -e POSTGRES_PASSWORD=$NO_SECURE_PASS -dp 5432:5432 $IMAGE
    exit 0
fi
    
echo "Démarrage du container '$CONTAINER_NAME'..."
docker start $CONTAINER_NAME

