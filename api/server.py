from flask import Flask, redirect, url_for, jsonify, request, make_response

app = Flask(__name__)

#GET all contests
@app.route("/contests", methods=['GET'])
def get_all_contests():
	return

#Get specific contest
@app.route("/contests/<param>", methods=['GET'])
def get_contest():
	return

#GET user
@app.route('/user/<param>', methods=['GET'])
def get_user(param):
	return

#CREATE contest
@app.route('/contest/new', methods=['POST'])
def create_contest():
	return

#CREATE user
@app.route('/user/new', methods=['POST'])
def create_user():
	return


#UPDATE sign up user to contest
@app.route('/user/entercontest', methdos=['POST'])
def update_user():
	return

@app.route('/user/addpoints')


#UPDATE (bet )




"""
User signs up
User registers for contest
User bets on question
User answers question
	It gets graded, bets cleared

User searches for contests
User looks at user's info

Admin creates contest
"""

if __name__ == "__main__":
	app.run()