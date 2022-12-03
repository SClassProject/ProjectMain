from multiprocessing.dummy import JoinableQueue
from flask import session
from flask_socketio import Namespace, SocketIO, emit, join_room, leave_room, close_room, rooms, disconnect
import random

def getRandomColor() :
    letters = '0123456789ABCDEF'
    color = '#'
    color += [random.choice(letters) for i in range(6)]

class InputData :
    def __init__(self, num) :
        self.num = num
        self.w = False
        self.s = False
        self.a = False
        self.d = False

class Ball :
    def __init__(self, socket) :
        self.socket = socket
        self.x = 0
        self.y = 0
        self.color = getRandomColor()
        self.inputMap = {}
        self.inputBuffer = []
        self.lastInputNum = 0

    def get_id(self) :
        return self.socket.id

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
        self.y = vy * timeRate
        
balls = []
ballMap = {}

def joinGame(socket) :
    ball = Ball(socket)

    balls.append(ball)
    ballMap[socket.id] = ball

    return ball

def leaveGame(socket) :
    for i in range(len(balls)) :
        if balls[i].id == socket.id :
            balls.splice(i, 1)
            break

    del ballMap[socket.id]

def socketio_character(socketio):
    @socketio.on('connection', namespace='/room')
    def connection(message) :
        newBall = joinGame(socketio)
        
        


# def socketio_init(socketio):
#     @socketio.on('join', namespace='/room')
#     def join(message):
#         id = session.get('u_id')
#         print(id + "님이 입장하셨습니다.")

#     @socketio.on('move', namespace='/room')
#     def move(message):