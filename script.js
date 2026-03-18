const player = document.getElementById('player');
const road = document.getElementById('road');
const message = document.getElementById('message');
const scoreElement = document.getElementById('score');

let gameActive = false;
let score = 0;
let playerPos = { x: 150, y: 500 };
let keys = {};

// Captura teclas pressionadas
document.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    if (e.code === 'Space' && !gameActive) startGame();
});
document.addEventListener('keyup', (e) => keys[e.code] = false);

function startGame() {
    gameActive = true;
    score = 0;
    playerPos = { x: 150, y: 500 };
    message.style.display = 'none';
    player.style.display = 'block';
    road.style.display = 'block';
    
    // Limpar inimigos antigos
    document.querySelectorAll('.enemy').forEach(e => e.remove());
    
    spawnEnemy();
    gameLoop();
}

function gameLoop() {
    if (!gameActive) return;

    // Movimentação
    if (keys['ArrowLeft'] && playerPos.x > 0) playerPos.x -= 5;
    if (keys['ArrowRight'] && playerPos.x < 300) playerPos.x += 5;

    player.style.left = playerPos.x + 'px';

    // Movimentar inimigos e checar colisão
    const enemies = document.querySelectorAll('.enemy');
    enemies.forEach(enemy => {
        let top = parseInt(enemy.style.top);
        if (top > 700) {
            enemy.remove();
            score++;
            scoreElement.innerText = `Score: ${score}`;
            spawnEnemy();
        } else {
            enemy.style.top = (top + 5) + 'px';
        }

        // Lógica de Colisão simples
        if (isColliding(player, enemy)) {
            gameOver();
        }
    });

    requestAnimationFrame(gameLoop);
}

function spawnEnemy() {
    const enemy = document.createElement('div');
    enemy.classList.add('enemy');
    enemy.style.left = Math.floor(Math.random() * 300) + 'px';
    enemy.style.top = '-100px';
    document.getElementById('game-container').appendChild(enemy);
}

function isColliding(a, b) {
    let aRect = a.getBoundingClientRect();
    let bRect = b.getBoundingClientRect();
    return !(aRect.bottom < bRect.top || aRect.top > bRect.bottom || 
             aRect.right < bRect.left || aRect.left > bRect.right);
}

function gameOver() {
    gameActive = false;
    message.innerHTML = `GAME OVER!<br>Score: ${score}<br>Pressione ESPAÇO para reiniciar`;
    message.style.display = 'block';
}