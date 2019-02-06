#!/bin/sh
black --check . &&
# piprot &&
coverage run manage.py test &&
coverage report -m && echo -m
