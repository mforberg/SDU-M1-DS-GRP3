from pyspark.ml.clustering import KMeans
from pyspark.ml.evaluation import ClusteringEvaluator

from pyspark.context import SparkContext
from pyspark.sql.session import SparkSession

from pyspark.ml.feature import VectorAssembler
from pyspark.sql import functions as F



sc = SparkContext(appName='Clustering').getOrCreate()
spark = SparkSession(sc)


df = spark.read.option("header", "true").csv("/user/root/data/sofia.csv")
df.printSchema()

changedTypedf = df.withColumn('P1', df['P1'].cast('double'))
df = changedTypedf
df.printSchema()

#df.select('P2').orderBy('P2', ascending=False).show(100)
#test = df.groupBy('sensor_id').agg({'P1' : 'min'}).orderBy('sensor_id')
min_max_avg_df = df.groupBy('sensor_id').agg(F.min(df.P1),F.max(df.P1),F.avg(df.P1)).orderBy('sensor_id')
min_max_avg_df.show(100)
#print(test.show(100))
