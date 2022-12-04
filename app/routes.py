import base64
import app.character
import threading
from flask import session, redirect, url_for, render_template, request, Blueprint
from forms import RegistrationForm, roomRegistration, loginRegistration
from database import mysql
import json

bp = Blueprint('bp', __name__)

@bp.route('/', methods=["GET","POST"])
def login():
    error = None
    session.pop('register_id',None)
    session.pop('u_id', None)
    if request.method == 'POST':
        id = request.form['id']
        pw = request.form['pw']

        conn = mysql.connect()
        cursor = conn.cursor()
        sql = "SELECT u_id, u_name FROM user WHERE u_id = %s AND u_password = %s"
        value = (id, pw)
        cursor.execute("set names utf8")
        cursor.execute(sql, value)

        data = cursor.fetchall()
        cursor.close()
        conn.close()

        if data:
            u_id = data[0][0]
            u_name = data[0][1]
            
            session['u_id'] = u_id
            session['u_name'] = u_name
            return redirect(url_for('bp.main'))
        else:
            error = 'invalid input data detected !'
    return render_template("login.html")

    

@bp.route('/register', methods=["GET","POST"])
def register():
    form = RegistrationForm()
    if form.validate_on_submit() :
        id = request.form['userNumber']
        pw = request.form['password']
        name = request.form['name']
        email = request.form['email']

        conn = mysql.connect()
        cursor = conn.cursor()

        sql = "INSERT INTO user VALUES ('%s', '%s', '%s', '%s')" % (id, pw, name, email)
        cursor.execute(sql)

        data = cursor.fetchall()

        if not data:
            conn.commit()
            session['register_id'] = request.form['userNumber']
            return render_template("getImg.html")
        else:
            conn.rollback()
            return render_template("register.html", form=form)

        cursor.close()
        conn.close()
            
    return render_template("register.html", form=form)

@bp.route('/upload', methods=["GET","POST"])
def upload():
    if request.method == 'POST':
        f = request.files['file']

        fileName = f.filename
        imageData = base64.b64decode(f.read()+'='*(4-len(f.read())%4))
        with open('static/uploads/'+ fileName, 'wb') as file:  
            file.write(imageData)
        session.pop('register_id',None)
        return str(f)
    return 0

@bp.route('/uploadPhantom', methods=["GET","POST"])
def uploadPhantom():
    if request.method == 'POST':
        f = request.files['file']

        fileName = f.filename
        imageData = base64.b64decode(f.read().decode('utf-8')+'='*(4-len(f.read())%4))
        with open('static/img/phantoms/'+ fileName, 'wb') as file:  
            file.write(imageData)
        return str(f)
    return "0"

@bp.route('/getInfo')
def getInfo():
    return render_template("getInfo.html")  

@bp.route('/getImg')
def getCapture():
    return render_template("getImg.html")    
    
@bp.route('/getCharacter', methods=["GET","POST"])
def getCharacter():
    return render_template("getCharacter.html")

@bp.route('/home', methods=["GET","POST"])
def home():
    return render_template("home.html")

@bp.route('/main', methods=["GET","POST"])
def main():
    return render_template("main.html")

@bp.route('/newroom',methods=["GET","POST"])
def newroom():
    form = roomRegistration()
    if form.validate_on_submit():
        id = session['u_id']
        name = request.form['className']
        pw = request.form['classpwd']

        conn = mysql.connect()
        cursor = conn.cursor()

        sql = "INSERT INTO class(u_id, c_name, c_password) VALUES('%s', '%s', '%s')" % (id, name, pw)
        cursor.execute(sql)

        data = cursor.fetchall()

        if not data:
            conn.commit()

            sql = "SELECT c_num FROM class WHERE u_id = %s AND c_name = %s"
            value = (id, name)
            cursor.execute("set names utf8")
            cursor.execute(sql, value)

            data = cursor.fetchall()
            cursor.close()
            conn.close()

            for row in data:
                data = row[0]

            print(data)

            if data:
                classNum = str(data)
                return render_template("roomInfo.html",roomNum = classNum, roomName = name)
            else:
                error = 'invalid input data detected !'
                return render_template("newroom.html",form=form)

        else:
            conn.rollback()
            return render_template("newroom.html",form=form)

        cursor.close()
        conn.close()    
        
    return render_template("newroom.html",form=form)


@bp.route('/newroom/roomInfo', methods=["GET","POST"])
def roomInfo():
    roomname="클래스이름"
    roomAddress="0"
    return render_template("roomInfo.html",roomName=roomname,roomNum=roomAddress)

@bp.route('/enter',methods=["GET","POST"])
def enter():
    if request.method == 'POST':
        roomNum=request.form['classNum']
        roomPw=request.form['classPw']

        conn = mysql.connect()
        cursor = conn.cursor()
        sql = "SELECT c_num FROM class WHERE c_num = %s AND c_password = %s"
        value = (roomNum, roomPw)
        cursor.execute("set names utf8")
        cursor.execute(sql, value)

        data = cursor.fetchall()
        cursor.close()
        conn.close()

        for row in data:
            data = row[0]

        if data:
            return redirect(url_for('bp.room',room_id=roomNum))
        else:
            error = 'invalid input data detected !'

    return render_template("enter.html")

@bp.route('/<int:room_id>',methods=["GET","POST"])
def room(room_id):
    u_id = session['u_id']
    u_id = str(u_id)
    room_id = str(room_id)
    # session['id'] = id
    session['room_id'] = room_id
    return render_template("room.html", room_id=room_id, u_id=u_id)

@bp.route('/move')
def move():
    u_id = session['u_id']
    u_id = str(u_id)
    room_id = session['room_id']
    room_id = str(room_id)
    # t1 = threading.Thread(target=updateGame, args=())
    # t2 = threading.Thread(target=broadcastState, args=())
    return render_template("move.html", id=u_id, room=room_id)

@bp.route('/quiz_stu')
def quiz_stu():
    return render_template("quiz_stu.html")

@bp.route('/quiz_host')
def quiz_host():
    return render_template("quiz_host.html")

@bp.route('/save_quiz',methods=["GET","POST"])
def save_quiz():
    if request.method == 'POST':
        # data = request.form
        data = request.get_json()
        print(data[0])

        with open('./app/static/quiz/'+session["room_id"]+'.json', "w") as file:
            json.dump(data, file)
        return str(data)
    return "0"

# if request.method == 'POST':
#         f = request.files['file']

#         fileName = f.filename
#         imageData = base64.b64decode(f.read().decode('utf-8')+'='*(4-len(f.read())%4))
#         with open('static/img/phantoms/'+ fileName, 'wb') as file:  
#             file.write(imageData)
#         return str(f)
#     return "0"