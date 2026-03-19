const player = document.getElementById('player');
const road = document.getElementById('road');
const message = document.getElementById('message');
const scoreElement = document.getElementById('score');

let gameActive = false;
let score = 0;
let playerPos = { x: 150 };
let keys = {};
let enemySpeed = 5;
let animationFrameId;

// Gerenciamento de teclas
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
    road.classList.add('animate-road');
    
    // Limpa inimigos antigos
    document.querySelectorAll('.enemy').forEach(e => e.remove());
    
    spawnEnemy();
    gameLoop();
}

function gameLoop() {
    if (!gameActive) return;

    // Movimentação suave
    if (keys['ArrowLeft'] && playerPos.x > 5) playerPos.x -= 7;
    if (keys['ArrowRight'] && playerPos.x < 295) playerPos.x += 7;

    player.style.left = playerPos.x + 'px';

    const enemies = document.querySelectorAll('.enemy');
    enemies.forEach(enemy => {
        let top = parseInt(enemy.style.top);
        
        // Se o inimigo sair da tela
        if (top > window.innerHeight) {
            enemy.remove();
            score++;
            scoreElement.innerText = `Score: ${score}`;
            
            // Dificuldade progressiva
            if (score % 5 === 0) enemySpeed += 0.5;
            
            spawnEnemy();
        } else {
            enemy.style.top = (top + enemySpeed) + 'px';
        }

        // Checar colisão
        if (isColliding(player, enemy)) {
            gameOver();
        }
    });

    animationFrameId = requestAnimationFrame(gameLoop);
}

function spawnEnemy() {
    if (!gameActive) return;
    const enemy = document.createElement('div');
    enemy.classList.add('enemy');
    // Garante que o inimigo apareça dentro da estrada (350px largura - 50px do carro)
    enemy.style.left = Math.floor(Math.random() * 300) + 'px';
    enemy.style.top = '-100px';
    document.getElementById('game-container').appendChild(enemy);
}

function isColliding(a, b) {
    let aRect = a.getBoundingClientRect();
    let bRect = b.getBoundingClientRect();
    
    // Colisão com "hitbox" reduzida para parecer mais justo
    return !(
        aRect.bottom < bRect.top + 15 || 
        aRect.top > bRect.bottom - 15 || 
        aRect.right < bRect.left + 10 || 
        aRect.left > bRect.right - 10
    );
}

function gameOver() {
    gameActive = false;
    cancelAnimationFrame(animationFrameId);
    road.classList.remove('animate-road');
    
    message.innerHTML = `
        <h1 style="color: #ff4d4d; margin: 0;">BATIDA!</h1>
        <p>Score Final: <b>${score}</b></p>
        <p>Pressione <b>ESPAÇO</b> para tentar de novo</p>
    `;
    message.style.display = 'block';
}