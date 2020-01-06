from pyspark.ml.clustering import KMeans
from pyspark.ml.evaluation import ClusteringEvaluator
from pyspark.context import SparkContext
from pyspark.sql.session import SparkSession
from pyspark.ml.feature import VectorAssembler
from pyspark.sql import functions as F
from normalize import get_min_max
#from pyspark.sql.functions import udf
from pyspark.sql.types import DoubleType
from pyspark.sql.functions import UserDefinedFunction
import json
import os


sc = SparkContext(appName='Clustering').getOrCreate()
spark = SparkSession(sc)



# Loads data.
#dataset = spark.read.format("libsvm").load("data/mllib/sample_kmeans_data.txt")
df = spark.read.option("header", "true").csv("/user/root/data/*.csv")
df_timestamp = df.withColumn('timestamp', df['timestamp'].substr(1, 7))
df = df_timestamp
timestamp = df.collect()[0][5]
df_notnull = df.filter(F.col("lon").isNotNull() & F.col("lat").isNotNull() & F.col('P1').isNotNull())
df = df_notnull


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


min_max_avg_df = df_joined.groupBy('lat', 'lon' ).agg(F.avg(df_joined.P1)).withColumnRenamed('avg(P1)', 'avg').orderBy('lat')
df_cloned = spark.createDataFrame(min_max_avg_df.rdd, min_max_avg_df.schema)

# max[0] = max avg, [1] max lon, [2] max lat
# min[0] = min avg, [1] min lon, [2] min lat
max = df_cloned.agg(F.max(df_cloned.avg),F.max(df_cloned.lon),F.max(df_cloned.lat)).collect()[0]
min = df_cloned.agg(F.min(df_cloned.avg),F.min(df_cloned.lon),F.min(df_cloned.lat)).collect()[0]

tuple = get_min_max(min, max)

# UDF that normalizes values
udf = UserDefinedFunction(lambda x: (x - tuple[0]) / (tuple[1] - tuple[0]), DoubleType())

# Normalize one column at a time, because python sucks...
# Also lat, lon, and avg has to be normalized.
df_normalize_lat = df_cloned.select(*[udf(column).alias('lat') if column == 'lat' else column for column in df_cloned.columns])
df_normalize_lon = df_normalize_lat.select(*[udf(column).alias('lon') if column == 'lon' else column for column in df_normalize_lat.columns])
df_normalize_p1 = df_normalize_lon.select(*[udf(column).alias('avg') if column == 'avg' else column for column in df_normalize_lat.columns])

# Better naming
df_complete = df_normalize_p1

features_normalized = ['lat', 'lon', 'avg']
vector_assembler_normalized = VectorAssembler(inputCols=features_normalized, outputCol="features")

dataframe_t_normalized = vector_assembler_normalized.transform(df_complete)

dataframe_t_normalized = dataframe_t_normalized.withColumn("id", F.monotonically_increasing_id())


# Trains a k-means model.
k_list = []
min_clusters = 2
max_clusters = 4
for k in range (min_clusters, max_clusters):

    kmeans = KMeans().setK(k).setSeed(123).setFeaturesCol("features")
    model = kmeans.fit(dataframe_t_normalized) # was dataset

    # Make predictions
    predictions = model.transform(dataframe_t_normalized) # was dataset

    # Evaluate clustering by computing Silhouette score
    evaluator = ClusteringEvaluator()

    silhouette = evaluator.evaluate(predictions)
    #print("Silhouette with squared euclidean distance = " + str(silhouette))
    k_list.append((k, str(silhouette)))


highest_k = max(k_list[1])

print("OPTIMAL K: " + str(highest_k[0][0]) + " WITH A SILHOUETTE SCORE OF: " + str(highest_k[0][1]))


centers = model.clusterCenters()
min = tuple[0]
max = tuple[1]
ts = timestamp 
values = list()
values.append(min)
values.append(max)
values.append(ts)

for center in centers:
    temp_list = list()
    temp_list.append(center[0])
    temp_list.append(center[1])
    temp_list.append(center[2])
    values.append(temp_list)

print(json.dumps(values))

# Doesn't work, fix later.
os.system('echo "%s" | hadoop fs -put - /user/root/json/%s.txt' %(json.dumps(values), ts))
os.system('echo | hdfs dfs -copyToLocal -f /user/root/json/%s.txt Users/forberg/developer' %(ts))
# Super functional kmeans