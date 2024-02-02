const main = function () {
    const minSlider = document.getElementById('min-circ');
    const minSliderText = document.getElementById('min-circ-value');
    const maxSlider = document.getElementById('max-circ');
    const maxSliderText = document.getElementById('max-circ-value');
    const animSpeed = document.getElementById('anim-speed');
    const animSpeedText = document.getElementById('anim-speed-value');
    function reloadWebGL() {
        const minSliderValue = minSlider.value;
        const maxSliderValue = maxSlider.value;
        const animSpeedValue = animSpeed.value;
        minSliderText.textContent = 'Min circle count: ' + minSliderValue;
        maxSliderText.textContent = 'Max circle count: ' + maxSliderValue;
        animSpeedText.textContent = 'Animation Speed: ' + animSpeedValue;
        circGen(minSliderValue, maxSliderValue, animSpeedValue);
    }
    minSlider.addEventListener('input', reloadWebGL);
    maxSlider.addEventListener('input', reloadWebGL);
    animSpeed.addEventListener('input', reloadWebGL);
    reloadWebGL();
};
