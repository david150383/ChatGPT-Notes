# Env setup
* don't put .env file withing your code otherwise variable or this can override variable set in docker-compose


# In case you want to see what Variables container using, you can run below command
```
docker compose exec api env | grep DB_
```
replace api with your container name