/// <reference path = "circleGen.js"/>

const main = function () {
    /** @type {HTMLCanvasElement} */
    const canvas = document.getElementById("webgl-canvas");

    const finalVals = document.getElementById('final-vals');

    canvas.addEventListener('click', function (event) {
        handleClick(event, canvas);
    });

    reloadWebGL();

    function reloadWebGL() {
        const minSliderValue = 3;
        const maxSliderValue = 8;
        const animSpeedValue = 2;
        circGen(canvas, minSliderValue, maxSliderValue, animSpeedValue, finalVals);
        document.getElementById('game-state').textContent = "Click on all the bacteria to destroy them!"
        omaeWaMou = false;
    }
};


