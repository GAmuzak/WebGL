/// <reference path = "utils.js"/>

async function webGLSetup(gl) {
    checkGLLoad(gl);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const vertexShaderText = await loadShaderFile("vertexShader.glsl");
    const fragmentShaderText = await loadShaderFile("fragmentShader.glsl");

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderText);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderText);
    const program = setGLProgram(vertexShader, fragmentShader, gl);
    return program;
}

function generateMainCirclePositions(radius, segments) {
    const positions = [];
    for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * 2 * Math.PI;
        const x = radius * Math.cos(theta);
        const y = radius * Math.sin(theta);
        positions.push(x, y);
    }
    return positions;
}

function generateMainCircle(gl, posnAttribLoc, program, radius, segments) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    const positions = generateMainCirclePositions(radius, segments);
    const mainCircleBuffer = createBuffer(gl, positions);
    gl.bindBuffer(gl.ARRAY_BUFFER, mainCircleBuffer);
    gl.vertexAttribPointer(posnAttribLoc, 2, gl.FLOAT, false, 0, 0);
    const mainCircleColor = [1.0, 1.0, 1.0, 1.0];
    gl.uniform4fv(gl.getUniformLocation(program, "uColor"), mainCircleColor);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, segments);
}

function generateRandomCircles(mainCircleRadius, minCircCount, maxCircCount, finalVals) {
    var randomCircles = [];
    const maxRadius = 0.2;
    const numRandomCircles = getRandomInt(minCircCount, maxCircCount);
    finalVals.textContent = 'Loaded program with circle count: ' + numRandomCircles;
    for (let i = 0; i < numRandomCircles; i++) {
        const randomColor = getRandomColor();
        const randomAngle = Math.random() * 2 * Math.PI;

        const centerX = mainCircleRadius * Math.cos(randomAngle);
        const centerY = mainCircleRadius * Math.sin(randomAngle);

        const randomCircle = { centerX: centerX, centerY: centerY, color: randomColor, maxRadius: maxRadius };

        randomCircles.push(randomCircle);
    }
    return randomCircles;
}

function createBuffer(gl, data) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    return buffer;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomColor() {
    const r = Math.random();
    const g = Math.random();
    const b = Math.random();
    return [r, g, b, 1.0];
}

function checkCollision(circle1, circle2) {
    var dx = circle1.centerX - circle2.centerX;
    var dy = circle1.centerY - circle2.centerY;
    var distance = Math.sqrt(dx * dx + dy * dy);
    return distance < circle1.radius + circle2.radius;
}

function handleCollisions() {
    for (i = 0; i < randomCircles.length; i++) {
        for (j = i + 1; j < randomCircles.length; j++) {
            if (checkCollision(randomCircles[i], randomCircles[j])) {
                firstCircle = randomCircles.indexOf(randomCircles[i]);
                secondCircle = randomCircles.indexOf(randomCircles[j]);
                randomCircles.splice(firstCircle < secondCircle ? secondCircle : firstCircle, 1);
            }
        }
    }
}
