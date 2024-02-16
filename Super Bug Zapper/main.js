/// <reference path = "circleGen.js"/>

const main = function () {
    /** @type {HTMLCanvasElement} */
    const canvas = document.getElementById("webgl-canvas");
    const minSlider = document.getElementById('min-circ');
    const minSliderText = document.getElementById('min-circ-value');
    const maxSlider = document.getElementById('max-circ');
    const maxSliderText = document.getElementById('max-circ-value');
    const animSpeed = document.getElementById('anim-speed');
    const animSpeedText = document.getElementById('anim-speed-value');
    const button = document.getElementById('reload');
    const finalVals = document.getElementById('final-vals');

    minSlider.addEventListener('input', reloadWebGL);
    maxSlider.addEventListener('input', reloadWebGL);
    animSpeed.addEventListener('input', reloadWebGL);
    button.addEventListener("click", reloadWebGL);

    canvas.addEventListener('click', function (event) {
        handleClick(event, canvas);
    });

    setGameData();

    circGen(canvas, minSliderValue, maxSliderValue, animSpeedValue, finalVals);
    document.getElementById('game-state').textContent = "Click on all the bacteria to destroy them!"
    omaeWaMou = false;


    function setGameData() {
        minSliderValue = gameData.minCircleCount;
        maxSliderValue = gameData.maxCircleCount;
        animSpeedValue = gameData.animSpeed;

        minSlider.value = minSliderValue;
        maxSlider.value = maxSliderValue;
        animSpeed.value = animSpeedValue;

        minSliderText.textContent = "Min circle count: " + minSliderValue;
        maxSliderText.textContent = "Max circle count: " + maxSliderValue;
        animSpeedText.textContent = "Animation Speed: " + animSpeedValue;

    }
};




function reloadWebGL() {

    //reload webpage
}
