from pyspark.ml.clustering import KMeans
from pyspark.ml.evaluation import ClusteringEvaluator

from pyspark.context import SparkContext
from pyspark.sql.session import SparkSession

from pyspark.ml.feature import VectorAssembler



sc = SparkContext(appName='Clustering').getOrCreate()
spark = SparkSession(sc)


df = spark.read.option("header", "true").csv("/user/root/data/sofia.csv")
df.printSchema()

df.groupBy('sensor_id').agg({'P1' : 'mean'}).orderBy('sensor_id').show(100)
test = df.select('lat', 'lon', 'P1').groupBy('lat', 'lon').show(100)
#assembler = VectorAssembler(inputCols=[2, 3], outputCol="Coordinate")

#output = assembler.transform(df)

#output.select("Coordinate", )

# # Loads data.
# dataset = spark.read.format("libsvm").load("data/mllib/sample_kmeans_data.txt")

# # Trains a k-means model.
# kmeans = KMeans().setK(2).setSeed(1)
# model = kmeans.fit(dataset)

# # Make predictions
# predictions = model.transform(dataset)

# # Evaluate clustering by computing Silhouette score
# evaluator = ClusteringEvaluator()

# silhouette = evaluator.evaluate(predictions)
# print("Silhouette with squared euclidean distance = " + str(silhouette))

# # Shows the result.
# centers = model.clusterCenters()
# print("Cluster Centers: ")
# for center in centers:
#     print(center)
