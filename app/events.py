from flask import session
from flask_socketio import emit #, Namespace, join_room, leave_room, close_room, rooms, connect, disconnect
from time import time
import schedule

socketTime = {}
state = {}
pre_state= {}
index = 0

def checkAttendence():
    now = time()
    for key in socketTime:
        pre_state[key] == state[key] # 기존 상태를 이전 상태로 저장
        if state[key]=="on":
            if now-socketTime[key] > 300: # 현재시간부터 소켓 받은 시간까지 차이가 5분 초과면 자리비움
                state[key]=="off"
        elif state[key]=="off":
            if now-socketTime[key] < 300: # 현재시간부터 소켓 받은 시간까지 차이가 5분 미만이면 다시 왔음
                state[key]=="on"
    threading.Timer(300, checkAttendence).start()

schedule.every(5).minutes.do(checkAttendence) # 5분마다 state 검사
while True:
    schedule.run_pending()
    time.sleep(1)

def socketio_init(socketio):
    @socketio.on('join', namespace='/room')
    def join(message) :
        id = message['id']
        room_id = message['room_id']
        print(id + "님이 " + room_id + "번 방에 입장하셨습니다.")
    
    @socketio.on('attend', namespace='/room')
    def attend(message) :
        # print(message['msg'])
        id = message['id']
        socketTime[id] = time() #socket 전송받은 시간 저장
        if index == 0: #초기화
            state[id] = "on"
            pre_state[id] = "on"
            index = 1

        if state[id] != pre_state[id]: # 상태 변화되면 emit
            if state[id]=="on":
                socketio.emit('onalert', id)
            else state[id]=="off":
                socketio.emit('offalert',id)

    @socketio.on('hand', namespace='/room')
    def raiseHand(message) :
        # print(message['msg'])
        socketio.emit('handalert', message['msg'])

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