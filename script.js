const player = document.getElementById('player');
const road = document.getElementById('road');
const message = document.getElementById('message');
const scoreElement = document.getElementById('score');

let gameActive = false;
let score = 0;
let playerX = 130;
let enemySpeed = 5;
let keys = {};

document.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    if (e.code === 'Space' && !gameActive) startGame();
});
document.addEventListener('keyup', (e) => keys[e.code] = false);

function startGame() {
    gameActive = true;
    score = 0;
    enemySpeed = 5;
    playerX = 130;
    scoreElement.innerText = "Score: 0";
    message.style.display = 'none';
    player.style.display = 'block';
    road.style.display = 'block';
    
    document.querySelectorAll('.enemy').forEach(e => e.remove());
    
    spawnEnemy();
    requestAnimationFrame(gameLoop);
}

function gameLoop() {
    if (!gameActive) return;

    // Movimento do Jogador
    if (keys['ArrowLeft'] && playerX > 0) playerX -= 5;
    if (keys['ArrowRight'] && playerX < 260) playerX += 5;
    player.style.left = playerX + 'px';

    const enemies = document.querySelectorAll('.enemy');
    enemies.forEach(enemy => {
        let top = parseInt(enemy.style.top);
        
        if (top > window.innerHeight) {
            enemy.remove();
            score++;
            scoreElement.innerText = `Score: ${score}`;
            if (score % 5 === 0) enemySpeed += 0.5; // Aumenta dificuldade
            spawnEnemy();
        } else {
            enemy.style.top = (top + enemySpeed) + 'px';
        }

        // Detecção de Colisão
        if (isColliding(player, enemy)) gameOver();
    });

    requestAnimationFrame(gameLoop);
}

function spawnEnemy() {
    if (!gameActive) return;
    const enemy = document.createElement('div');
    enemy.classList.add('enemy');
    enemy.style.left = Math.floor(Math.random() * 260) + 'px';
    enemy.style.top = '-100px';
    document.getElementById('game-container').appendChild(enemy);
}

function isColliding(a, b) {
    let aRect = a.getBoundingClientRect();
    let bRect = b.getBoundingClientRect();
    return !(
        aRect.bottom < bRect.top || 
        aRect.top > bRect.bottom || 
        aRect.right < bRect.left || 
        aRect.left > bRect.right
    );
}

function gameOver() {
    gameActive = false;
    road.style.display = 'none';
    message.innerHTML = `<h2>BATIDA!</h2><p>Pontos: ${score}</p><p>Aperte ESPAÇO</p>`;
    message.style.display = 'block';
}