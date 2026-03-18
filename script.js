const player = document.getElementById('player');
const road = document.getElementById('road');
const message = document.getElementById('message');
const scoreElement = document.getElementById('score');

let gameActive = false;
let score = 0;
let playerPos = { x: 150 };
let keys = {};
let enemySpeed = 5;

// Controles
document.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    if (e.code === 'Space' && !gameActive) startGame();
});
document.addEventListener('keyup', (e) => keys[e.code] = false);
const player = document.getElementById('player');
const road = document.getElementById('road');
const message = document.getElementById('message');
const scoreElement = document.getElementById('score');

let gameActive = false;
let score = 0;
let playerPos = { x: 150 };
let keys = {};
let enemySpeed = 5;

// Controles
document.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    if (e.code === 'Space' && !gameActive) startGame();
});
document.addEventListener('keyup', (e) => keys[e.code] = false);

function startGame() {
    gameActive = true;
    score = 0;
    enemySpeed = 5;
    playerPos.x = 150;
    scoreElement.innerText = `Score: 0`;
    message.style.display = 'none';
    player.style.display = 'block';
    road.style.display = 'block';
    
    // Remove inimigos de partidas anteriores
    document.querySelectorAll('.enemy').forEach(e => e.remove());
    
    spawnEnemy();
    gameLoop();
}

function gameLoop() {
    if (!gameActive) return;

    // Movimentação com setas
    if (keys['ArrowLeft'] && playerPos.x > 5) playerPos.x -= 7;
    if (keys['ArrowRight'] && playerPos.x < 295) playerPos.x += 7;

    player.style.left = playerPos.x + 'px';

    const enemies = document.querySelectorAll('.enemy');
    enemies.forEach(enemy => {
        let top = parseInt(enemy.style.top);
        
        if (top > window.innerHeight) {
            enemy.remove();
            score++;
            scoreElement.innerText = `Score: ${score}`;
            // Aumenta a velocidade a cada 5 pontos
            if (score % 5 === 0) enemySpeed += 0.5;
            spawnEnemy();
        } else {
            enemy.style.top = (top + enemySpeed) + 'px';
        }

        // Detecção de batida
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
    enemy.style.top = '-150px';
    document.getElementById('game-container').appendChild(enemy);
}

function isColliding(a, b) {
    let aRect = a.getBoundingClientRect();
    let bRect = b.getBoundingClientRect();
    
    // Margem de erro para a colisão ficar mais justa com a imagem
    return !(
        aRect.bottom < bRect.top + 10 || 
        aRect.top > bRect.bottom - 10 || 
        aRect.right < bRect.left + 5 || 
        aRect.left > bRect.right - 5
    );
}

function gameOver() {
    gameActive = false;
    message.innerHTML = `<h1>BATIDA!</h1><p>Score Final: ${score}</p><p>Pressione ESPAÇO para tentar de novo</p>`;
    message.style.display = 'block';
    road.style.display = 'none';
}