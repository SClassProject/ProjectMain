from flask import Flask
from flask_socketio import SocketIO

socketio = SocketIO(logger=True, engineio_logger=True, async_mode=None)


def create_app(debug=False):
    app = Flask(__name__)

    socketio.init_app(app)
    
    # 이벤트 핸들러 적용
    from app.events import socketio_init
    socketio_init(socketio)

    from app.character import socketio_character
    socketio_character(socketio)

    # 라우팅 적용
    from app.routes import bp as main_blueprint
    app.register_blueprint(main_blueprint)

    return app
