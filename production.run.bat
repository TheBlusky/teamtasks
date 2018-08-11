docker-compose -p teamtasks  -f docker/docker-compose.yml run --rm backend python manage.py migrate
docker-compose -p teamtasks  -f docker/docker-compose.yml up -d frontend
