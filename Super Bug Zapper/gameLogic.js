/// <reference path = "circleGen.js"/>

var omaeWaMou = false;

const gameState = document.getElementById('game-state');

function handleClick(event, canvas) {
    const canvasRect = canvas.getBoundingClientRect();

    const mouseX = event.clientX - canvasRect.left;
    const mouseY = event.clientY - canvasRect.top;

    const webglX = (mouseX / canvas.width) * 2 - 1;
    const webglY = 1 - (mouseY / canvas.height) * 2;

    killBacteria(webglX, webglY);
}

function killBacteria(clickX, clickY) {
    if (omaeWaMou) return;
    randomCircles.forEach(randomCircle => {
        const xDist = Math.pow(clickX - randomCircle.centerX, 2);
        const yDist = Math.pow(clickY - randomCircle.centerY, 2);

        if (Math.sqrt(xDist + yDist) < randomCircle.radius) {
            const targetcircle = randomCircles.indexOf(randomCircle);
            randomCircles.splice(targetcircle, 1);
        }
    });
    checkWinCriteria();
}

function checkWinCriteria() {
    if (randomCircles.length <= 0) {
        gameState.textContent = "You WIN!";
    }
}

function checkLoseCriteria() {
    if (randomCircles.length > 0) {
        gameState.textContent = "You LOSE!";
    }
    omaeWaMou = true;
}
