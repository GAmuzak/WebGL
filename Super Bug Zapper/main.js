document.addEventListener('DOMContentLoaded', function () {
    const minSlider = document.getElementById('min-circ');
    const maxSlider = document.getElementById('max-circ');
    const animSpeed = document.getElementById('anim-speed');
    function reloadWebGL() {
        const minSliderValue = minSlider.value;
        const maxSliderValue = maxSlider.value;
        const animSpeedValue = animSpeed.value;
    }
    minSlider.addEventListener('input', reloadWebGL);
    maxSlider.addEventListener('input', reloadWebGL);
    animSpeed.addEventListener('input', reloadWebGL);
    reloadWebGL();
});
