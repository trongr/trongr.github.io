from __future__ import print_function

import matplotlib.pyplot as plt
import pandas as pd
print(pd.__version__)

city_names = pd.Series(['San Francisco', 'San Jose', 'Sacramento'])
population = pd.Series([852469, 1015785, 485199])

dataFrame = pd.DataFrame({'City name': city_names, 'Population': population})
print(dataFrame.describe())

california_housing_dataframe = pd.read_csv("https://download.mlcc.google.com/mledu-datasets/california_housing_train.csv", sep=",")
print(california_housing_dataframe.describe())

california_housing_dataframe.hist('housing_median_age')
# plt.show()
