/// <reference path = "cuon-matrix.js"/>
/// <reference path = "utils.js"/>
/// <reference path = "sphereUtils.js"/>

var matrixTheta = 0;
var matrixPhi = 0;
var prevX;
var prevY;
var dOfX = 0;
var dOfY = 0;
var isDragging = false;
var bacteriaCount = 30;

var uniformModelMatrix = [];
var uniformViewMatrix = [];
var uniformProjectionMatrix = [];

var currrentTime = Date.now();
const start_time = currrentTime;

var redBackground = 0;
var greenBackground = 0;
var blueBackground = 0;

function main() {
    /** @type {HTMLCanvasElement} */
    const canvas = document.getElementById('webgl');
    /** @type {WebGLRenderingContext} */
    const gl = canvas.getContext("webgl");
    webGLSetup(gl);

    var viewMatrix = new Matrix4();
    var projection_matrix = new Matrix4();

    viewMatrix.elements[14] = viewMatrix.elements[14] - 6;
    projection_matrix.setPerspective(80, canvas.width / canvas.height, 1, 100);

    uniformModelMatrix = gl.getUniformLocation(gl.program, "mmatrix");
    uniformViewMatrix = gl.getUniformLocation(gl.program, "vmatrix");
    uniformProjectionMatrix = gl.getUniformLocation(gl.program, "pmatrix");

    if (!uniformModelMatrix || !uniformViewMatrix || !uniformProjectionMatrix) {
        console.log('Failed to get the uniform location');
        return -1;
    }

    var mouse_down = function (ev) {
        ev.preventDefault();
        isDragging = true;

        prevX = ev.pageX;
        prevY = ev.pageY;

        return false;
    };

    var mouse_move = function (ev) {
        if (!isDragging) return false;
        ev.preventDefault();

        speed_factor = 1.2;

        dOfX = (ev.pageX - prevX) / canvas.width,
            dOfY = (ev.pageY - prevY) / canvas.height;

        matrixTheta += (speed_factor * dOfX);
        matrixPhi += (speed_factor * dOfY);

        prevX = ev.pageX;
        prevY = ev.pageY;
        redBackground = giveCloseCol(redBackground);
        blueBackground = giveCloseCol(blueBackground);
        greenBackground = giveCloseCol(greenBackground);

    };

    var mouse_up = function () {
        isDragging = false;
    };

    canvas.addEventListener("mousedown", mouse_down, false);
    canvas.addEventListener("mousemove", mouse_move, false);
    canvas.addEventListener("mouseup", mouse_up, false);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clearColor(redBackground, greenBackground, blueBackground, 1.0);
    gl.enable(gl.DEPTH_TEST);

    var sphereResolution = 100;

    var randomTheta = [];
    var randomPhi = [];
    var randomR = [];
    var randomG = [];
    var randomB = [];
    var bacteriaSizes = []

    for (let i = 0; i < bacteriaCount; i++) {
        randomTheta.push(getRandomVal(360));
        randomPhi.push(getRandomVal(360));
        randomR.push(getRandomVal());
        randomG.push(getRandomVal());
        randomB.push(getRandomVal());
        bacteriaSizes.push(getRandomVal(0.05 * sphereResolution));
    }

    var tick = function () {
        currrentTime = Date.now();

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.clearColor(redBackground, greenBackground, blueBackground, 1.0);
        gl.enable(gl.DEPTH_TEST);

        var modelMatrix = new Matrix4();

        modelMatrix.rotate((180 * matrixPhi) / Math.PI, 1, 0, 0);
        modelMatrix.rotate((180 * matrixTheta) / Math.PI, 0, 1, 0);

        var n = initVertexBuffers(gl, 3, sphereResolution, 0, 0, 1, 1, 1);

        draw(gl, modelMatrix, viewMatrix, projection_matrix, n);

        for (let i = 0; i < bacteriaCount; i++) {
            var n = initVertexBuffers(gl, (3.02 + 0.002 * i), bacteriaSizes[i], randomTheta[i], randomPhi[i], randomR[i], randomG[i], randomB[i]);
            draw(gl, modelMatrix, viewMatrix, projection_matrix, n);
        }

        var n = initVertexBuffers(gl, 3, sphereResolution, 0, 0, 0, 0, 0);

        gl.uniformMatrix4fv(uniformModelMatrix, false, modelMatrix.elements);
        gl.uniformMatrix4fv(uniformViewMatrix, false, viewMatrix.elements);
        gl.uniformMatrix4fv(uniformProjectionMatrix, false, projection_matrix.elements);
        gl.drawArrays(gl.POINTS, 0, n);

        requestAnimationFrame(tick, canvas);
    };
    tick();
}

