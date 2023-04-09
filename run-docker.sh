#!/bin/bash

if [ "$1" == "api" ]; then
  cd api && docker-compose up
elif [ "$1" == "frontend" ]; then
  cd frontend && docker-compose up
else
  echo "Running both frontend and API services..."
  cd api && docker-compose up -d
  cd ../frontend && docker-compose up
fi