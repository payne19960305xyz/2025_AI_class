class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 400;
        this.canvas.height = 400;
        
        this.gridSize = 20;
        this.snake = [{x: 5, y: 5}];
        this.food = this.generateFood();
        this.direction = 'right';
        this.score = 0;
        this.gameOver = false;
        this.gameLoop = null;

        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('restartBtn').addEventListener('click', () => this.restartGame());
        
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowUp':
                    if (this.direction !== 'down') this.direction = 'up';
                    break;
                case 'ArrowDown':
                    if (this.direction !== 'up') this.direction = 'down';
                    break;
                case 'ArrowLeft':
                    if (this.direction !== 'right') this.direction = 'left';
                    break;
                case 'ArrowRight':
                    if (this.direction !== 'left') this.direction = 'right';
                    break;
            }
        });
    }

    generateFood() {
        const x = Math.floor(Math.random() * (this.canvas.width / this.gridSize));
        const y = Math.floor(Math.random() * (this.canvas.height / this.gridSize));
        return {x, y};
    }

    draw() {
        // 清除畫布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 繪製蛇
        this.ctx.fillStyle = '#4CAF50';
        this.snake.forEach(segment => {
            this.ctx.fillRect(
                segment.x * this.gridSize,
                segment.y * this.gridSize,
                this.gridSize - 2,
                this.gridSize - 2
            );
        });

        // 繪製食物
        this.ctx.fillStyle = '#ff0000';
        this.ctx.fillRect(
            this.food.x * this.gridSize,
            this.food.y * this.gridSize,
            this.gridSize - 2,
            this.gridSize - 2
        );
    }

    move() {
        const head = {...this.snake[0]};

        switch(this.direction) {
            case 'up':
                head.y = (head.y - 1 + this.canvas.height / this.gridSize) % (this.canvas.height / this.gridSize);
                break;
            case 'down':
                head.y = (head.y + 1) % (this.canvas.height / this.gridSize);
                break;
            case 'left':
                head.x = (head.x - 1 + this.canvas.width / this.gridSize) % (this.canvas.width / this.gridSize);
                break;
            case 'right':
                head.x = (head.x + 1) % (this.canvas.width / this.gridSize);
                break;
        }

        // 檢查是否吃到食物
        if (head.x === this.food.x && head.y === this.food.y) {
            this.food = this.generateFood();
            this.score += 10;
            document.getElementById('score').textContent = this.score;
        } else {
            this.snake.pop();
        }

        // 檢查碰撞
        if (this.checkCollision(head)) {
            this.gameOver = true;
            clearInterval(this.gameLoop);
            document.getElementById('restartBtn').style.display = 'inline-block';
            document.getElementById('startBtn').style.display = 'none';
            return;
        }

        this.snake.unshift(head);
    }

    checkCollision(head) {
        // 只檢查自身碰撞
        return this.snake.some(segment => segment.x === head.x && segment.y === head.y);
    }

    startGame() {
        if (!this.gameLoop) {
            document.getElementById('startBtn').style.display = 'none';
            this.gameLoop = setInterval(() => {
                this.move();
                this.draw();
            }, 100);
        }
    }

    restartGame() {
        this.snake = [{x: 5, y: 5}];
        this.food = this.generateFood();
        this.direction = 'right';
        this.score = 0;
        this.gameOver = false;
        document.getElementById('score').textContent = this.score;
        document.getElementById('restartBtn').style.display = 'none';
        document.getElementById('startBtn').style.display = 'inline-block';
        clearInterval(this.gameLoop);
        this.gameLoop = null;
        this.draw();
    }
}

// 初始化遊戲
window.onload = () => {
    const game = new SnakeGame();
    game.draw();
};
