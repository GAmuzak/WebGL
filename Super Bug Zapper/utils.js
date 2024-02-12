// general webgl utils


async function loadShaderFile(filePath) {
    const response = await fetch(filePath);
    if (!response.ok) {
        throw new Error(`Failed to load shader file: ${filePath}`);
    }
    return await response.text();
}

function checkGLLoad(gl) {
    if (!gl) {
        console.log("WebGL not supported, using experimental");
        gl = canvas.getContext("experimental-webgl");
        if (!gl) {
            alert("Your browser does not support WebGL");
            return;
        }
    }
}
function createShader(gl, type, shaderSource) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);
    const shaderType =
        type === gl.VERTEX_SHADER ? "Vertex Shader" : "Fragment Shader";
    checkShaderValidity(shader, gl, shaderType);
    return shader;
}
function checkShaderValidity(shader, gl, shaderType) {
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(
            "Error Compiling: " + shaderType + "!\n",
            gl.getShaderInfoLog(shader)
        );
        gl.deleteShader(shader);
    }
}
function setGLProgram(vertexShader, fragmentShader, gl) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Error linking program!\n", gl.getProgramInfoLog(program));
        return;
    }
    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.error("Error validating program!\n", gl.getProgramInfoLog(program));
        return;
    }
    return program;
}

// project specifc

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
    const randomCircles = [];
    const numRandomCircles = getRandomInt(minCircCount, maxCircCount);
    finalVals.textContent = 'Loaded program with circle count: ' + numRandomCircles;
    for (let i = 0; i < numRandomCircles; i++) {
        const randomRadius = 0.1;
        const randomColor = getRandomColor();
        const randomAngle = Math.random() * 2 * Math.PI;

        const centerX = mainCircleRadius * Math.cos(randomAngle);
        const centerY = mainCircleRadius * Math.sin(randomAngle);

        const randomCircle = { centerX: centerX, centerY: centerY, radius: randomRadius, color: randomColor, };

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
