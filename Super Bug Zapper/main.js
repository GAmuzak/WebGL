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

    reloadWebGL();

    function reloadWebGL() {
        const minSliderValue = minSlider.value;
        const maxSliderValue = maxSlider.value;
        const animSpeedValue = animSpeed.value;
        minSliderText.textContent = 'Min circle count: ' + minSliderValue;
        maxSliderText.textContent = 'Max circle count: ' + maxSliderValue;
        animSpeedText.textContent = 'Animation Speed: ' + animSpeedValue;
        circGen(canvas, minSliderValue, maxSliderValue, animSpeedValue, finalVals);
    }
};


function handleClick(event, canvas) {
    const canvasRect = canvas.getBoundingClientRect();

    const mouseX = event.clientX - canvasRect.left;
    const mouseY = event.clientY - canvasRect.top;

    const webglX = (mouseX / canvas.width) * 2 - 1;
    const webglY = 1 - (mouseY / canvas.height) * 2;

    console.log("WebGL click at (x:", webglX, ", y:", webglY, ")");

    console.log(randomCircles[2].radius);
}
