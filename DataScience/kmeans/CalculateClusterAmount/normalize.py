from pyspark.sql.functions import udf
from pyspark.sql.types import DoubleType
from pyspark.sql.functions import UserDefinedFunction


def get_min_max(min, max):
    current_min = min[0]
    current_max = max[0]
    for x in range(1, 2):
        if min[x] < current_min:
            current_min = x
        if max[x] > current_max:
            current_max = x
    return (current_min, current_max)

