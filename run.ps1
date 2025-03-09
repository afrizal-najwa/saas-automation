# stop running docker service 
docker compose down

# delete old image 
docker rmi saas-automation_app

# run and build new image
docker compose up --build -d