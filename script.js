const score = document.querySelector('#score');
const startScreen = document.querySelector('#message');
const gameArea = document.querySelector('#road');
const player = document.querySelector('#player');

// Variáveis de controle
let playerStats = { speed: 5, score: 0, start: false };
let keys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false, Space: false };

// Escutar as teclas
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (e.code === 'Space' && !playerStats.start) {
        startGame();
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Função para criar e mover as faixas brancas
function moveLines() {
    let lines = document.querySelectorAll('.line');
    lines.forEach(function(item) {
        if (item.y >= 700) {
            item.y -= 750;
        }
        item.y += playerStats.speed;
        item.style.top = item.y + "px";
    });
}

function startGame() {
    playerStats.start = true;
    playerStats.score = 0;
    startScreen.classList.add('hide'); // Esconde a mensagem
    startScreen.style.display = "none";
    
    // Criar as faixas dinamicamente
    for (let x = 0; x < 5; x++) {
        let line = document.createElement('div');
        line.setAttribute('class', 'line');
        line.y = (x * 150);
        line.style.top = line.y + "px";
        document.getElementById('line-container').appendChild(line);
    }

    window.requestAnimationFrame(gamePlay);
}

function gamePlay() {
    if (playerStats.start) {
        moveLines();

        // Movimentação do jogador
        let roadPos = gameArea.getBoundingClientRect();
        let playerPos = player.getBoundingClientRect();

        if (keys.ArrowUp && player.offsetTop > 100) { player.style.top = (player.offsetTop - playerStats.speed) + "px"; }
        if (keys.ArrowDown && player.offsetTop < (roadPos.bottom - 100)) { player.style.top = (player.offsetTop + playerStats.speed) + "px"; }
        if (keys.ArrowLeft && player.offsetLeft > 0) { player.style.left = (player.offsetLeft - playerStats.speed) + "px"; }
        if (keys.ArrowRight && player.offsetLeft < (roadPos.width - playerPos.width)) { player.style.left = (player.offsetLeft + playerStats.speed) + "px"; }

        // Atualizar pontuação
        playerStats.score++;
        score.innerText = "Score: " + playerStats.score;

        window.requestAnimationFrame(gamePlay);
    }
}
