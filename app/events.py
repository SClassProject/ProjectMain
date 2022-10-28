from flask import session
from flask_socketio import emit #, Namespace, join_room, leave_room, close_room, rooms, connect, disconnect

def socketio_init(socketio):
    @socketio.on('join', namespace='/room')
    def join(message) :
        id = message['id']
        room_id = message['room_id']
        print(id + "님이 " + room_id + "번 방에 입장하셨습니다.")
    
    @socketio.on('attend', namespace='/room')
    def attend(message) :
        print(message['msg'])

    @socketio.on('hand', namespace='/room')
    def raiseHand(message) :
        print(message['msg'])

    @socketio.on('leave', namespace='/room')
    def leave(message) :
        id = message['id']
        room_id = message['room_id']
        print(id + "님이 " + room_id + "번 방에서 퇴장하셨습니다.")


# 클래스 기반 Namespace
# class MessageNamepsace(Namespace):

#     def on_connect(self):
#         pass

#     def on_disconnect(self):
#         pass

#     def on_joined(self, data):
#         id = session.get('id')
#         room_id = session.get('room_id')
#         # join_room(room_id)
#         print(id + "님이 " + room_id + "번 방에 입장하셨습니다.")

#     def on_handle_message(self, data):
#         emit('text', {'msg': data})

#     def on_text(self, data) :
#         print(data['msg'])

#     def on_left(self, data):
#         id = session.get('id')
#         room_id = session.get('room_id')
#         leave_room(room_id)
#         print(id + "님이 " + room_id + "번 방에서 퇴장하셨습니다.")