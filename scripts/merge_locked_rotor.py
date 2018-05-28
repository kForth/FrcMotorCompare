from glob import glob
import codecs
import json

motor = 'bag'
files = glob('motor_data/{}-locked-rotor-data-*.csv'.format(motor))
data_dict = {}
for file in files:
	import chardet
	open_file = open(file, "rb")
	encoding = chardet.detect(open_file.read())['encoding']
	voltage = file.split("-")[-2]
	data = [[f.strip() for f in e.split(",")] for e in codecs.open(file, 'r', encoding=encoding).read().strip().split("\n")]
	data_dict[voltage] = [{ 'x': e[0],  'y': e[-1]}  for e in data[1:]]

json.dump(data_dict, open('motor_data/{}-locked-rotor-data.json'.format(motor), 'w+'))

