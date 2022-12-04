from flask import session
from flask_socketio import emit #, Namespace, join_room, leave_room, close_room, rooms, connect, disconnect
from time import time
import threading

socketTime = {}
state = {}
pre_state= {}
index = 0

def checkAttendence():
    now = time()
    print(now)
    global state
    global pre_state
    global socketTime
    for key in socketTime:
        print(key)
        print(state[key])
        print(pre_state[key])
        pre_state[key] = state[key] # 기존 상태를 이전 상태로 저장
        if state[key]=="on":
            if now-socketTime[key] > 5: # 현재시간부터 소켓 받은 시간까지 차이가 5분 초과면 자리비움
                state[key]="off"
        elif state[key]=="off":
            if now-socketTime[key] < 5: # 현재시간부터 소켓 받은 시간까지 차이가 5분 미만이면 다시 왔음
                state[key]="on"
    threading.Timer(5, checkAttendence).start()

def socketio_init(socketio):
    @socketio.on('join', namespace='/room')
    def join(message) :
        id = message['id']
        room_id = message['room_id']
        print(id + "님이 " + room_id + "번 방에 입장하셨습니다.")
    
    @socketio.on('attend', namespace='/room')
    def attend(message) :
        global index
        global socketTime
        global state
        global pre_state
        print(message['msg']) #1928030:attend
        id = message['msg'].split(':')[0]
        socketTime[id] = time() #socket 전송받은 시간 저장
        if index == 0: #초기화
            state[id] = "on"
            pre_state[id] = "on"
            index = 1

        if state[id] != pre_state[id]: # 상태 변화되면 emit
            if state[id]=="on":
                socketio.emit('onalert', id)
            elif state[id]=="off":
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

checkAttendence()