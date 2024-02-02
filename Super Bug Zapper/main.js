/// <reference path = "circleGen.js"/>

const main = function () 
{
    const minSlider = document.getElementById('min-circ');
    const minSliderText = document.getElementById('min-circ-value');
    const maxSlider = document.getElementById('max-circ');
    const maxSliderText = document.getElementById('max-circ-value');
    const animSpeed = document.getElementById('anim-speed');
    const animSpeedText = document.getElementById('anim-speed-value');
    const button = document.getElementById('reload');
    const finalVals = document.getElementById('final-vals');
    function reloadWebGL() {
        const minSliderValue = minSlider.value;
        const maxSliderValue = maxSlider.value;
        const animSpeedValue = animSpeed.value;
        minSliderText.textContent = 'Min circle count: ' + minSliderValue;
        maxSliderText.textContent = 'Max circle count: ' + maxSliderValue;
        animSpeedText.textContent = 'Animation Speed: ' + animSpeedValue;
        circGen(minSliderValue, maxSliderValue, animSpeedValue, finalVals);
    }
    minSlider.addEventListener('input', reloadWebGL);
    maxSlider.addEventListener('input', reloadWebGL);
    animSpeed.addEventListener('input', reloadWebGL);
    button.addEventListener("click", reloadWebGL);
    reloadWebGL();
};
