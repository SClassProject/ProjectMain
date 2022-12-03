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