from flask import session
from flask_socketio import Namespace, SocketIO, emit, join_room, leave_room, close_room, rooms, disconnect

id = 1871054

class InputData :
    def __init__(self) :
        self.w = False
        self.s = False
        self.a = False
        self.d = False

class Character :
    def __init__(self, socket) :
        self.socket = socket
        self.x = 0
        self.y = 0

def socketio_init(socketio):
    @socketio.on('join', namespace='/room')
    def join(message):
        id = session.get('u_id')
        print(id + "님이 입장하셨습니다.")

    @socketio.on('move', namespace='/room')
    def move(message):