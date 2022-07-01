from flask import Flask, render_template, request, jsonify, session,redirect, url_for
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
import user
from botwtvoice import chat

app = Flask(__name__)
app.secret_key = "2a27c138e5e15e30bc1fb5be3b4fcb90aafdd211a6a3a33741874235261ec04f"

con = sqlite3.connect("database.db", check_same_thread=False)
con.row_factory = sqlite3.Row

@app.route("/")
def index():
  if "user_id" in session:
    return redirect(url_for("home"))
  return render_template("index.html")

@app.route("/home")
def home():
  return render_template("home.html")
@app.route("/lougout")
def logout():
    session.pop("user_id")
    return redirect(url_for("index"))

@app.post("/auth/login")
def login():
  if not verfiy_input(["username", "password"], request.form):
    return jsonify_error("Please fill all Fields")
  #username existe
  user_data = user.get_user(con, username = request.form["username"])

  if not user_data or not check_password_hash(user_data['password'], request.form['password']):
    return jsonify_error("Password Or Username wrong")
  session["user_id"] = user_data['id']
  return jsonify({
    "status": "success"
  })


@app.get("/api/user/<int:id>")
def get_user(id):
  user_data = user.get_user(con, id = id)
  if not user_data:
    return jsonify({
      'status': "fail",
      'message': "User not Found"
    })
  return jsonify({
    "status": "success",
    "data" : {
      "username" : user_data['username'],
      "email" : user_data['email']
    }
  })

@app.post("/auth/register")
def add_user():
  #check inputs
  if not verfiy_input(["username", "password", "email"], request.form):
    return jsonify_error("Please fill all Fields")

  #username & email must be unique
  user_unique = user.is_user_unique(con, request.form["username"], request.form['email'])

  if user_unique != 0:
    return jsonify_error("Username or Password already used")
  
  password = generate_password_hash(request.form["password"]) #hash password
  user_id = user.add_user(con, (request.form['username'], password, request.form['email'])) #insert to database
  session["user_id"] = user_id
  return jsonify({
    "status": "success",
    "data" : user_id
  })

@app.get("/api/bot/<string:message>")
def chatBot(message):
  return jsonify({
    "message": chat(message)
  })


def verfiy_input(inputs, form_data):
  for field in inputs:
  
    if field not in form_data or form_data[field] == "":
      return False
  return True

def jsonify_error(message):
  return jsonify({
    "status" : "fail",
    "message" : message
  })
if __name__ == "__main__":
  app.run(debug=True)