from app import create_app, socketio
from database import mysql
from app.routes import bp
from flask_socketio import emit
# import ssl

app = create_app(debug=False)

app.secret_key = "ABCDEFG"
app.config['MYSQL_DATABASE_USER'] = 'choi'
app.config['MYSQL_DATABASE_PASSWORD'] = 'P@ssw0rd'
app.config['MYSQL_DATABASE_DB'] = 'sclass'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
mysql.init_app(app)

app.register_blueprint(bp)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=443, debug=True, certfile='cert.pem', keyfile='key.pem')