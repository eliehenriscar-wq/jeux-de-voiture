const score = document.querySelector('#score');
const startScreen = document.querySelector('#message');
const gameArea = document.querySelector('#road');

let playerStats = { speed: 5, score: 0, start: false };
let keys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false, Space: false };

// Controles
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (e.code === 'Space' && !playerStats.start) startGame();
});
document.addEventListener('keyup', (e) => { keys[e.key] = false; });
startScreen.addEventListener('click', () => { if (!playerStats.start) startGame(); });

// Detectar Batida
function isCollide(a, b) {
    let aRect = a.getBoundingClientRect();
    let bRect = b.getBoundingClientRect();
    return !( (aRect.bottom < bRect.top) || (aRect.top > bRect.bottom) || (aRect.right < bRect.left) || (aRect.left > bRect.right) );
}

function moveLines() {
    let lines = document.querySelectorAll('.line');
    lines.forEach(item => {
        if (item.y >= 750) item.y -= 800;
        item.y += playerStats.speed;
        item.style.top = item.y + "px";
    });
}

function moveEnemies(player) {
    let enemies = document.querySelectorAll('.enemy');
    enemies.forEach(item => {
        if (isCollide(player, item)) endGame();
        if (item.y >= 750) {
            item.y = -300;
            item.style.left = Math.floor(Math.random() * 240) + "px";
        }
        item.y += playerStats.speed;
        item.style.top = item.y + "px";
    });
}

function startGame() {
    playerStats.start = true;
    playerStats.score = 0;
    startScreen.style.display = "none";
    gameArea.innerHTML = '<div class="side-walk left"></div><div class="side-walk right"></div><div id="line-container"></div><div id="player"></div>';
    
    // Criar Faixas
    for (let x = 0; x < 5; x++) {
        let line = document.createElement('div');
        line.classList.add('line');
        line.y = (x * 150);
        line.style.top = line.y + "px";
        document.getElementById('line-container').appendChild(line);
    }

    // Criar Inimigos
    for (let x = 0; x < 3; x++) {
        let enemy = document.createElement('div');
        enemy.classList.add('enemy');
        enemy.y = ((x + 1) * 350) * -1;
        enemy.style.top = enemy.y + "px";
        enemy.style.left = Math.floor(Math.random() * 240) + "px";
        gameArea.appendChild(enemy);
    }

    window.requestAnimationFrame(gamePlay);
}

function gamePlay() {
    let player = document.getElementById('player');
    let roadPos = gameArea.getBoundingClientRect();

    if (playerStats.start && player) {
        moveLines();
        moveEnemies(player);

        if (keys.ArrowUp && player.offsetTop > 70) player.style.top = (player.offsetTop - playerStats.speed) + "px";
        if (keys.ArrowDown && player.offsetTop < (roadPos.height - 90)) player.style.top = (player.offsetTop + playerStats.speed) + "px";
        if (keys.ArrowLeft && player.offsetLeft > 20) player.style.left = (player.offsetLeft - playerStats.speed) + "px";
        if (keys.ArrowRight && player.offsetLeft < (roadPos.width - 70)) player.style.left = (player.offsetLeft + playerStats.speed) + "px";

        playerStats.score++;
        score.innerText = "Score: " + playerStats.score;
        window.requestAnimationFrame(gamePlay);
    }
}

function endGame() {
    playerStats.start = false;
    startScreen.style.display = "block";
    startScreen.innerHTML = `GAME OVER!<br>Pontuação: ${playerStats.score}<br><b>Clique para Reiniciar</b>`;
}
