from pyspark.ml.clustering import KMeans
from pyspark.ml.evaluation import ClusteringEvaluator

from pyspark.context import SparkContext
from pyspark.sql.session import SparkSession

from pyspark.ml.feature import VectorAssembler
from pyspark.sql import functions as F



sc = SparkContext(appName='Clustering').getOrCreate()
spark = SparkSession(sc)

# Read from cluster
df = spark.read.option("header", "true").csv("/user/root/data/sofia.csv")

# Drop nulls
df_notnull = df.filter(F.col("lon").isNotNull() & F.col("lat").isNotNull() & F.col('P1').isNotNull())
df = df_notnull

#Choose columns for casting
cols = ['P1', 'lon', 'lat']

#Cast to double
for col_name in cols:
    df = df.withColumn(col_name, F.col(col_name).cast('double'))

df.printSchema()

df.printSchema()

#df.select('P2').orderBy('P2', ascending=False).show(100)
#test = df.groupBy('sensor_id').agg({'P1' : 'min'}).orderBy('sensor_id')
min_max_avg_df = df.groupBy('sensor_id').agg(F.min(df.P1),F.max(df.P1),F.avg(df.P1)).orderBy('sensor_id')
min_max_avg_df.printSchema()
max = min_max_avg_df.agg(F.max(df.P1),F.max(df.lon),F.max(df.lat)).collect()[0]
min = min_max_avg_df.agg(F.min(df.P1),F.min(df.lon),F.min(df.lat)).collect()[0]
print(max)
print(min)
min_max_avg_df.show(10)
#print(test.show(100))
