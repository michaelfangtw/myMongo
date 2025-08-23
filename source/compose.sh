chown 1000:1000 -R logs
docker image prune -f
docker compose down 
docker compose up -d  --build --remove-orphans 
