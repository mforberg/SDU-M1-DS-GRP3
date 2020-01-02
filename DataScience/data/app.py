from pyspark import SparkContext, SparkFiles
from pyspark.sql import SparkSession
import os

sc = SparkContext(master='local', appName='Upload CSV files', )
ss = SparkSession(sc)
 
filePath = '/app/csv/.DS_Store'
if os.path.exists(filePath):
    os.remove(filePath)
    print("DELETED")
else:
    print("NOT DELETED")

dirPath = "/app/csv/"
files = os.listdir(dirPath)

pathToCSVFiles = "file://" + dirPath + "*.csv"
df = ss.read.csv(pathToCSVFiles)
pathToSave = "hdfs://namenode:9000/user/root/data/sofia.csv"
df.write.csv(pathToSave)

sc.stop()