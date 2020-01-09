docker build . -t get_sensors:latest 
docker run --rm --ip 172.200.0.240 --hostname pyspark --env-file hadoop.env --network hadoop get_sensors