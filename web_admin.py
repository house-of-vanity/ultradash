from flask import Flask
from flask import render_template
from flask import jsonify
from flask import request

app = Flask(__name__)

@app.route("/")
def admin():
    return "Web admin is going to be here."

if __name__ == '__main__':
    app.run(port=5050)
