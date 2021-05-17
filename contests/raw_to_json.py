# Python 3.6
# Converts raw questionnaire to json questionnaire
# Written by Roberto Soto

from os import path
from sys import argv
from sys import exit as sys_exit
import json

#raw_file = path.join("raw","template.txt")		#hard-coded input
#json_file = path.join("json", "template.json")	#hard-coded output

if len(argv)<3:
	print(f"Usage:\n\t{argv[0]} path_to_raw_file path_to_output_json")
	sys_exit(1)

#This is not tested in linux/unix systems
raw_file = argv[1]		#dynamic input
json_file = argv[2]		#dynamic output

contest = {"questions":[]}

with open(raw_file, 'r') as f:
	raw_data = [line.strip() for line in f if len(line.strip())>2]

getting_question = False
answer_counter = 0

for each in raw_data:
	if not getting_question:
		if each[0]=='@':
			contest["title"] = each[1:]
		elif each[0] == '#':
			contest["category"] = each[1:]
		elif each[0] == '?':
			q_obj = {}
			q_obj["answers"] = []
			q_obj["question"] = each[1:]
			getting_question = True
			answer_counter = 0
		else:
			print("SKIPPED LINE: "+each)
			continue
	else:
		if answer_counter == 3:
			if each[0] == '+':
				q_obj["answers"].append({"eval":"correct", "answer":each[1:]})
			else:
				q_obj["answers"].append({"eval":"incorrect", "answer":each[1:]})
			getting_question = False
			contest["questions"].append(q_obj)
		else:
			if each[0] == '+':
				q_obj["answers"].append({"eval":"correct", "answer":each[1:]})
			else:
				q_obj["answers"].append({"eval":"incorrect", "answer":each[1:]})
			answer_counter+=1


with open(json_file, 'w') as f:
	f.write(json.dumps(contest))
