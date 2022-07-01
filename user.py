def add_user(con,user):
  cur = con.cursor()
  cur.execute("INSERT INTO Users(username, password, email) VALUES (?,?,?)", user)
  con.commit()
  return cur.lastrowid

def get_user(con, id = "", username = "", email = ""):
  cur = con.cursor()
  query = "SELECT * FROM Users "
  if id :
    query += f"WHERE id = '{id}'"
  elif username:
    query += f"WHERE username = '{username}'"
  elif email:
    query += f"WHERE email = '{email}'"
  cur.execute(query)
  
  if id or username or email:
     return cur.fetchone()
  return cur.fetchall()

def delete_user(con, id = "", username = "", email = ""):
  cur = con.cursor()
  query = "DELETE FROM Users "
  if id :
    query += f"WHERE id = '{id}'"
  elif username:
    query += f"WHERE username = '{username}'"
  elif email:
    query += f"WHERE email = '{email}'"
  
  if id or username or email:
    return cur.execute(query)
  return None

def is_user_unique(con, username, email):
  cur = con.cursor()
  users = cur.execute("SELECT id FROM Users WHERE username = ? AND email = ?", [username, email]).fetchall()
  return len(users)