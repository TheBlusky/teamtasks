#!/bin/sh
sleep 10 && # Wait postgres
python manage.py makemigrations &&
python manage.py migrate