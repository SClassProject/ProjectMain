from flask import session
from flask_socketio import emit, join_room, leave_room, Namespace

# 클래스 기반 Namespace
class MessageNamepsace(Namespace):

    def on_connect(self):
        pass

    def on_disconnect(self):
        pass

    def on_joined(self, data):
        id = session.get('id')
        room_id = session.get('room_id')
        # join_room(room_id)
        print(id + "님이 " + room_id + "번 방에 입장하셨습니다.")

    def on_handle_message(self, data):
        emit('text', {'msg': data})

    def on_text(self, data) :
        print(data['msg'])

    def on_left(self, data):
        id = session.get('id')
        room_id = session.get('room_id')
        leave_room(room_id)
        print(id + "님이 " + room_id + "번 방에서 퇴장하셨습니다.")


def socketio_init(socketio):
    @socketio.on('joined', namespace='/room')
    def joined(data) :
        id = session.get('id')
        room_id = session.get('room_id')
        join_room(room_id)
        print(id + "님이 " + room_id + "번 방에 입장하셨습니다.")
        
    @socketio.on('message', namespace='/room')
    def handle_message(data):
        emit('text', {'msg': data})

    @socketio.on('text', namespace='/room')
    def text(data):
        print(data['msg'])

    @socketio.on('left', namespace='/room')
    def left(data):
        id = session.get('id')
        room_id = session.get('room_id')
        leave_room(room_id)
        print(id + "님이 " + room_id + "번 방에서 퇴장하셨습니다.")