import random
import threading
from time import time
from flask import session
from flask_socketio import Namespace, SocketIO, emit, join_room, leave_room, close_room, rooms, disconnect
from app import socketio

def getRandomColor() :
    letters = '0123456789ABCDEF'
    color = '#'
    for i in range(6) :
        color += random.choice(letters)
    return color

class InputData :
    def __init__(self, num) :
        self.num = num
        self.w = False
        self.s = False
        self.a = False
        self.d = False

class Ball :
    def __init__(self, id) :
        self.id = id
        self.x = 850
        self.y = 650
        self.color = getRandomColor()
        self.inputMap = {}
        self.inputBuffer = []
        self.lastInputNum = 0

    def checkKey(self, key) :
        return self.inputMap[key]

    def pushInput(self, inputData) :
        self.inputBuffer.append(inputData)

    def applyInputs(self) :
        left = len(self.inputBuffer)
        self.inputBuffer.reverse()

        while left > 0 :
            left -= 1
            input = self.inputBuffer.pop()

            if input.num > self.lastInputNum :
                self.lastInputNum = input.num

                self.inputMap.w = input.w
                self.inputMap.s = input.s
                self.inputMap.a = input.a
                self.inputMap.d = input.d


    def handleInput(self, timeRate) :
        vx = 0
        vy = 0
        if self.checkKey('w') :
            vy = -4
        if self.checkKey('s') :
            vy = 4
        if self.checkKey('a') :
            vx = -4
        if self.checkKey('d') :
            vx = 4

        self.x += vx * timeRate
        self.y += vy * timeRate
        
balls = []
ballMap = {}

def joinGame(id) :
    ball = Ball(id)

    if ball not in balls :
        balls.append(ball)
        ballMap[ball.id] = ball

    return ball

def leaveGame(id) :
    for i in range(len(balls)) :
        if balls[i].id == id :
            balls.splice(i, 1)
            break

    del ballMap[id]

def onInput(id, data) :
    ball = ballMap[id]

    inputData = InputData(data['num'])
    
    if data['w'] != -1 :
        inputData.w = data['w'] | False
    if data['s'] != -1 :
        inputData.s = data['s'] | False
    if data['a'] != -1 :
        inputData.a = data['a'] | False
    if data['d'] != -1 :
        inputData.d = data['d'] | False
    
    ball.pushInput(inputData)


def socketio_character(socketio):
    @socketio.on('joined', namespace='/move')
    def connection(message) :
        # global balls
        newBall = joinGame(session.get('u_id'))

        join_room(session.get('room'))

        emit('user_id', newBall.id)
        print(newBall.color)

        for i in range(len(balls)) :
            ball = balls[i]

            emit('join_user', {'id' : ball.id, 'x' : ball.x, 'y' : ball.y, 'color' : ball.color}, broadcast=True, include_self=False, namespace='/move')
        emit('join_user', {'id' : ball.id, 'x' : ball.x, 'y' : ball.y, 'color' : ball.color}, broadcast=True, namespace='/move')


    @socketio.on('disconnect', namespace='/move')
    def disconnect(message) :
        id = session.get('u_id')
        leaveGame(id)

        leave_room(session.get('room'))

        emit('leave_user', id)

    @socketio.on('input', namespace='/move')
    def on_input(message) :
        onInput(session.get('u_id'), message)

prevUpdateTime = time()
stateNum = 0

def updateGame() :
    global prevUpdateTime
    currentUpdateTime = time()
    deltaTime = currentUpdateTime - prevUpdateTime
    prevUpdateTime = currentUpdateTime

    timeRate = deltaTime / (1000 / 60)

    for i in range(len(balls)) :
        ball = balls[i]
        
        ball.applyInputs()

        ball.handleInput(timeRate)

    updateGame()

def broadcastState() :
    global stateNum
    stateNum += 1

    data = {}

    data['state_num'] = stateNum
    
    for i in range(len(balls)) :
        ball = balls[i]

        data[ball.id] = {'last_input_num': ball.lastInputNum, 'x': ball.x, 'y': ball.y}

    print("hi")

    emit('update_state', data, broadcast=True, include_self=True, namespace='/move')

    broadcastState()


t1 = threading.Thread(target=updateGame, args=())
t2 = threading.Thread(target=broadcastState, args=())

t1.start()
t2.start()

# t1.join()
# t2.join()

