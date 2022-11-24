const root = document.getElementById('root');
const gameoverUI = document.getElementById('gameover');
const resetButton = document.getElementById('reset');
const scoreText = document.getElementById('score');
let gameSpeed = 250;
const cells = [];
const foodX = [];
const foodY = [];
let gameOver = false;
let gameRunning = false;
let foodCountDown = 0;
let score = 0;

function init() {
    for (i=0; i<20; i++) {
        cells[i] = [];
        let row = document.createElement('div');
        row.className = 'row';
        for (j=0; j<20; j++) {
            cells[i][j] = document.createElement('div');
            cells[i][j].className = 'cell';
            row.appendChild(cells[i][j]);
        }
        root.appendChild(row);
    }
}

function update() {
    snake.advance();
    if (foodCountDown == 0) {
        let foodPositionAvailable = false;
        let x, y;
        while (!foodPositionAvailable) {
            x = Math.floor(Math.random() * 20);
            y = Math.floor(Math.random() * 20);
            if (findIndex(x, y, snake.x, snake.y) != -1) continue;
            if (findIndex(x, y, foodX, foodY) != -1) continue;
            foodPositionAvailable = true;
        }
        foodX.push(x);
        foodY.push(y);
        console.log(`new food: ${x}, ${y}`);
        cells[y][x].className = 'cell food';
        foodCountDown = Math.floor(Math.random() * 26) + 4;
    } else foodCountDown -= 1;
    updateGameSpeed();
}

function updateGameSpeed() {
    if (score == 10 && gameSpeed != 230) gameSpeed = 230;
    else if (score == 20 && gameSpeed != 210) gameSpeed = 210;
    else if (score == 30 && gameSpeed != 190) gameSpeed = 190;
    else if (score == 40 && gameSpeed != 170) gameSpeed = 170;
    else if (score == 50 && gameSpeed != 150) gameSpeed = 150;
    else if (score == 60 && gameSpeed != 130) gameSpeed = 130;
    else if (score == 70 && gameSpeed != 110) gameSpeed = 110;
    else return;
    gameController.updateSpeed(gameSpeed);
}

class GameController {
    constructor() {
        this.interval = 0;
    }

    start() {
        gameRunning = true;
        this.interval = setInterval(update, gameSpeed);
    }

    updateSpeed(speed) {
        clearInterval(this.interval);
        this.interval = setInterval(update, speed);
    }

    gameOver() {
        gameRunning = false;
        gameOver = true;
        clearInterval(this.interval);
        gameoverUI.className = '';
    }
}

class Snake {
    constructor(x=-1, y=-1) {
        this.dead = false;
        this.x = [];
        this.y = [];
        this.velX = 0;
        this.velY = 0;
        this.initialX = 0;
        this.initialY = 0;
        if (x = -1) {
            this.x[0] = Math.floor(Math.random() * 20);
            console.log(this.x);
        } else this.x[0] = x;
        if (y = -1) {
            this.y[0] = Math.floor(Math.random() * 20);
            console.log(this.y);
        } else this.y[0] = y;
        cells[this.y[0]][this.x[0]].className = 'cell active'
    }

    advance() {
        try {
            this.initialX = this.velX;
            this.initialY = this.velY;
            let newX = this.x[0] + this.velX;
            let newY = this.y[0] + this.velY;
            /*
            if (newX < 0) {
                this.velX = 0;
                this.velY = -1;
                newX = this.x[0];
                newY = this.y[0] - 1;
            } else if (newX > 19) {
                this.velX = 0;
                this.velY = 1;
                newX = this.x[0];
                newY = this.y[0] + 1;
            } else if (newY < 0) {
                this.velX = 1;
                this.velY = 0;
                newX = this.x[0] + 1;
                newY = this.y[0];
            } else if (newY > 19) {
                this.velX = -1;
                this.velY = 0;
                newX = this.x[0] - 1;
                newY = this.y[0];
            }
            */
            if (newX < 0 || newX > 19) {
                throw 'X out of bound';
            }
            if (newY < 0 || newY > 19) {
                throw 'Y out of bound';
            }
            if (findIndex(newX, newY, this.x, this.y) != -1) {
                throw 'collision onto self';
            }
            this.x.unshift(newX);
            this.y.unshift(newY);
            cells[newY][newX].className = 'cell active';
            const foodIndex = findIndex(newX, newY, foodX, foodY);
            if (foodIndex != -1) {
                foodX.splice(foodIndex, 1);
                foodY.splice(foodIndex, 1);
                score = this.x.length;
                scoreText.innerHTML = score;
            } else cells[this.y.pop()][this.x.pop()].className = 'cell';
        } catch (e) {
            console.log(e);
            gameController.gameOver();
        }
    }
}

function findIndex(x, y, arrayX, arrayY) {
    index = -1;
    for (const [arrayIndex, item] of arrayX.entries()) {
        if (item == x) {
            if (arrayY[arrayIndex] == y) {
                index = arrayIndex;
                break;
            }
        }
    }
    return index;
}

init();
let snake = new Snake();
const gameController = new GameController();

document.addEventListener('keydown', (e) => {
    if (!gameOver) {
        const key = e.key;
        switch (key) {
            case "ArrowUp":
                if (snake.initialY == 1 && snake.x.length > 1) break;
                snake.velX = 0;
                snake.velY = -1;
                if (!gameRunning) gameController.start();
                break;
            case "ArrowRight":
                if (snake.initialX == -1 && snake.x.length > 1) break;
                snake.velX = 1;
                snake.velY = 0;
                if (!gameRunning) gameController.start();
                break;
            case "ArrowDown":
                if (snake.initialY == -1 && snake.x.length > 1) break;
                snake.velX = 0;
                snake.velY = 1;
                if (!gameRunning) gameController.start();
                break;
            case "ArrowLeft":
                if (snake.initialX == 1 && snake.x.length > 1) break;
                snake.velX = -1;
                snake.velY = 0;
                if (!gameRunning) gameController.start();
                break;
            default:
                return;
        }
    }
});

resetButton.addEventListener('click', () => {
    for (i=0; i<20; i++) {
        for (j=0; j<20; j++) {
            cells[i][j].className = 'cell';
        }
    }
    snake = new Snake();
    gameoverUI.className = 'hidden';
    score = 0;
    scoreText.innerHTML = '0';
    foodCountDown = 0;
    gameSpeed = 250;
    gameOver = false;
});