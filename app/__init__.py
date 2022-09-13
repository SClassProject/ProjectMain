from flask import Flask
from flask_socketio import SocketIO

socketio = SocketIO(logger=True, engineio_logger=True)


def create_app(debug=False):
    app = Flask(__name__)

    socketio.init_app(app)
    
    from app.events import MessageNamepsace
    socketio.on_namespace(MessageNamepsace('/room'))

    from app.routes import bp as main_blueprint
    app.register_blueprint(main_blueprint)

    
    return app
