// let userLabel = document.querySelector("#login_user_id");
        // let user = userLabel.innerText;
    
        // let img = new Image();
        // img.src = `../static/img/phantoms/${user}.png`;
        
        function Ball(id) {
            this.id = id;
            this.color = "#000000";
            this.x = 0;
            this.y = 0;
        }
        
        var balls = [];
        var ballMap = {};
        var myId;
        
        function joinUser(id, color, x, y) {
            let ball = new Ball(id);
            ball.color = color;
            ball.x = x;
            ball.y = y;
            
            balls.push(ball);
            ballMap[id] = ball;
            
            return ball;
        }
        
        function leaveUser(id) {
            for (let i = 0; i < balls.length; ++i) {
                if (balls[i].id == id) {
                    balls.splice(i, 1);
                    break;
                }
            }
            
            delete ballMap[id];
        }
        
        function updateState(id, x, y) {
            let ball = ballMap[id];
            
            if (!ball) {
                return;
            }
            
            ball.x = x;
            ball.y = y;
        }
        
        
        var socket = io();
        var lastInputNum = 0;
        var lastStateNum = 0;
        var stateBuffer = [];
        
        $(document).ready(function(){
            socket = io.connect('https://' + document.domain + ':443/move');
    
            socket.on('connect', function() {
                socket.emit('joined', {});
            })
    
            socket.on('user_id', function(data) {
                myId = data;
            });
            
            socket.on('join_user', function(data) {
                joinUser(data.id, data.color, data.x, data.y);
            });
            
            socket.on('leave_user', function(data) {
                leaveUser(data);
            });
            
            socket.on('update_state', function(data) {
                let stateNum = data.state_num;
                
                if (stateNum > lastStateNum) {
                    lastStateNum = stateNum;
                    
                    // Store server states if valid.
                    let time = new Date().getTime();
                    if (stateBuffer.length == 0 || stateBuffer[stateBuffer.length - 1][1] < time) {
                        stateBuffer.push([data, time]);
                        if (stateBuffer.length > 256) {
                            stateBuffer.shift();
                        }
                    }
                    else if (stateBuffer.length > 0) {
                        stateBuffer[stateBuffer.length - 1] = [data, time];
                    }
                    
                    // Update my state if last input state
                    if (myId) {
                        let myBall = data[myId];
                        if (myBall && myBall.last_input_num >= lastInputNum) {
                            updateState(myId, myBall.x, myBall.y);
                        }
                    }
                }
            });
        });
        
        
        // Input Cache
        // inputMap[KEY] : Press(true), Up(false), None(undefined)
        var inputMap = {};
        
        function sendInput() {
            let inputs = "wsad";
            
            let anyInput = false;
            let inputData = {'w': -1, 's' : -1, 'a' : -1, 'd' : -1};
            
            // Copy input map
            for (let i = 0; i < inputs.length; ++i) {
                let key = inputs.charAt(i);
                
                if (key in inputMap) {
                    anyInput = true;
                    inputData[key] = inputMap[key];
                }
            }
            
            // Send input map if exists
            if (anyInput) {
                lastInputNum += 1;
                inputData.num = lastInputNum;
                
                socket.emit('input', inputData);
            }
        }
        
        function handleInput(timeRate) {
            if (!myId) {
                return;
            }
            
            let ball = ballMap[myId];
            
            if (!ball) {
                return;
            }
            
            
            sendInput();
            
            
            // Delete none key and Predict client state.
            let vx = 0;
            let vy = 0;
            
            if (inputMap['w']) {
                vy = -4;
            }
            else {
                delete inputMap['w'];
            }
            
            if (inputMap['s']) {
                vy = 4;
            }
            else {
                delete inputMap['s'];
            }
            
            if (inputMap['a']) {
                vx = -4;
            }
            else {
                delete inputMap['a'];
            }
            
            if (inputMap['d']) {
                vx = 4;
            }
            else {
                delete inputMap['d'];
            }
            
            ball.x += vx * timeRate;
            ball.y += vy * timeRate;
        }
        
        function interpolate(now) {
            if (stateBuffer.length < 2) {
                return;
            }
            
            let renderTime = now - 33;
            
            // Find state contains time for render.
            let t0Index = -1;
            for (let i = stateBuffer.length - 1; i >= 0; --i) {
                let time = stateBuffer[i][1];
                if (renderTime >= time) {
                    t0Index = i;
                    break;
                }
            }
            
            if (t0Index < 0 || t0Index + 1 >= stateBuffer.length) {
                return;
            }
            
            let s0 = stateBuffer[t0Index][0];
            let s1 = stateBuffer[t0Index + 1][0];
            let t0 = stateBuffer[t0Index][1];
            let t1 = stateBuffer[t0Index + 1][1];
            let deltaState = s1.state_num - s0.state_num;
            
            if (deltaState <= 0 || t0 >= t1) {
                return;
            }
            
            for (let i = 0; i < balls.length; ++i) {
                let ball = balls[i];
                
                if (ball.id == myId) {
                    continue;
                }
                
                if (ball.id in s0 && ball.id in s1) {
                    let b0 = s0[ball.id];
                    let b1 = s1[ball.id];
                    
                    // Interpolation
                    ball.x = b0.x + (b1.x - b0.x) * (renderTime - t0) / (t1 - t0);
                    ball.y = b0.y + (b1.y - b0.y) * (renderTime - t0) / (t1 - t0);
                }
            }
        }
        
        
        var prevUpdateTime = new Date().getTime();
    
        function updateGame() {
            let currentUpdateTime = new Date().getTime();
            let deltaTime = currentUpdateTime - prevUpdateTime;
            prevUpdateTime = currentUpdateTime;
    
            let timeRate = deltaTime / (1000 / 60);
            
            handleInput(timeRate);
            
            interpolate(currentUpdateTime);
        }

        // 이미지 로딩

    // let userLabel = document.querySelector("#login_user_id");
    // let user = userLabel.innerText;

    // let img = new Image();
    // img.src = `../static/img/phantoms/${user}.png`;

    // 캐릭터 스케일 설정

    const WIDTH = 128;
    const HEIGHT = 128;
        
        function renderGame() {
            ctx.clearRect(0, 0, board.width, board.height);
            
            // Draw balls
            for (let i = 0; i < balls.length; ++i) {
                let ball = balls[i];
                let img = new Image();
                img.src = `../static/img/phantoms/${ball.id}.png`;

                ctx.drawImage(img,0,0,WIDTH,HEIGHT,ball.x,ball.y,WIDTH,HEIGHT);
                
                // ctx.fillStyle = ball.color;
                
                // ctx.beginPath();
                // ctx.arc(ball.x, ball.y, 16, 0, Math.PI * 2, false);
                // // ctx.drawImage(img, ball.x, ball.y)
                // ctx.closePath();
                // ctx.fill();
            }
            
            //ctx.font = "16px serif";
            //ctx.fillStyle = "black";
            //ctx.fillText("Last S : " + lastStateNum, 8, 24);
        }
        
        function update() {
            updateGame();
            renderGame();
            
            window.requestAnimationFrame(update);
        }
        
        
        var board;
        var ctx;
        
        function initGame() {
            board = document.getElementById('canvas');
            console.log(board);
            ctx = board.getContext('2d');
            
            document.addEventListener('keydown', function(event) {
                if (!inputMap[event.key]) {
                    inputMap[event.key] = true;
                }
            });
            document.addEventListener('keyup', function(event) {
                inputMap[event.key] = false;
            });
            
            update();
        }

        window.addEventListener('DOMContentLoaded',initGame);