from pyspark.context import SparkContext
from pyspark.sql.session import SparkSession
from pyspark.sql import functions as F
import numpy as np
import json



sc = SparkContext(appName='Get Sensors').getOrCreate()
spark = SparkSession(sc)

# Read from cluster
df = spark.read.option("header", "true").option("inferSchema", "true").csv("/user/root/data/sofia.csv")

# Drop nulls
df_notnull = df.filter(F.col("lon").isNotNull() & F.col("lat").isNotNull() & F.col("timestamp").isNotNull())
df = df_notnull
df_timestamp = df.withColumn('timestamp', df['timestamp'].substr(1, 7))
df = df_timestamp
df.printSchema()

unique_sensors = df.select('timestamp', 'lat', 'lon').distinct()
unique_sensors.printSchema()
print(unique_sensors.count())

sensors = list()
for row in unique_sensors.collect():
    sensor = [row.timestamp, row.lat, row.lon]
    sensors.append(sensor)
print(json.dumps(sensors))

#print(spaghetti.toJSON())