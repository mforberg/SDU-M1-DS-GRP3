from pyspark.ml.clustering import KMeans
from pyspark.ml.evaluation import ClusteringEvaluator
from pyspark.context import SparkContext
from pyspark.sql.session import SparkSession
from pyspark.ml.feature import VectorAssembler
from pyspark.sql import functions as F
#from pyspark.sql.functions import *
from pyspark.sql.types import DoubleType


sc = SparkContext(appName='Clustering').getOrCreate()
spark = SparkSession(sc)



# Loads data.
#dataset = spark.read.format("libsvm").load("data/mllib/sample_kmeans_data.txt")
df = spark.read.option("header", "true").csv("/user/root/data/sofia.csv")
df_notnull = df.filter(F.col("lon").isNotNull() & F.col("lat").isNotNull() & F.col('P1').isNotNull())
df = df_notnull
print("COUNT:" + str(df.count()))

features = ['P1', 'lon', 'lat']
vector_assembler = VectorAssembler(inputCols=features, outputCol="features")

# Cast feature columns to double
expression = [F.col(c).cast("Double").alias(c) for c in vector_assembler.getInputCols()]

dataframe_v = df.select(*expression)
dataframe_t = vector_assembler.transform(dataframe_v)

dataframe_t = dataframe_t.withColumn("id", F.monotonically_increasing_id())
df = df.withColumn("id", F.monotonically_increasing_id()).drop("P1").drop("lon").drop("lat")

df_joined = df.join(dataframe_t, "id", "inner").drop("id")
df_joined.cache()

# Trains a k-means model.
kmeans = KMeans().setK(20).setSeed(123).setFeaturesCol("features")
model = kmeans.fit(dataframe_t) # was dataset

# Make predictions
predictions = model.transform(dataframe_t) # was dataset

# Evaluate clustering by computing Silhouette score
evaluator = ClusteringEvaluator()

silhouette = evaluator.evaluate(predictions)
print("Silhouette with squared euclidean distance = " + str(silhouette))

# Shows the result.
centers = model.clusterCenters()
print("Cluster Centers: ")
for center in centers:
    print(center)

dataframe_t.printSchema()
print(model.summary.clusterSizes)
predictions.printSchema()