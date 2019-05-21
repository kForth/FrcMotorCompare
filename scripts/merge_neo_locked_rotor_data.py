from glob import glob
import codecs
import json

voltages = {
	"40": "6v",
	"50": "8v",
	"60": "10v",
	"80": "12v",
}

files = glob('motor_data/NEO Locked-rotor Testing - Raw Data - *A Limit.csv')
data_dict = {}
for file in files:
	import chardet
	open_file = open(file, "rb")
	encoding = chardet.detect(open_file.read())['encoding']
	voltage = voltages[file.split(" ")[-2].strip("A")]
	data = [[f.strip() for f in e.split(",")] for e in codecs.open(file, 'r', encoding=encoding).read().strip().split("\n")]
	data_dict[voltage] = [{ 'x': e[0],  'y': float(e[-1])}  for e in data[1:]]

json.dump(data_dict, open('motor_data/neo-locked-data.json', 'w+'))

