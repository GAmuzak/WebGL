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

var uniformModelMatrix = [];
var uniformViewMatrix = [];
var uniformProjectionMatrix = [];

var currrentTime = Date.now();
const start_time = currrentTime;

var rBG = 0;
var gBG = 0;
var bBG = 0;

function main() {
    /** @type {HTMLCanvasElement} */
    const canvas = document.getElementById('webgl');
    /** @type {WebGLRenderingContext} */
    const gl = canvas.getContext("webgl");
    webGLSetup(gl);

    var view_matrix = new Matrix4();
    var projection_matrix = new Matrix4();

    view_matrix.elements[14] = view_matrix.elements[14] - 6;
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

    };

    var mouse_up = function () {
        isDragging = false;
    };

    canvas.addEventListener("mousedown", mouse_down, false);
    canvas.addEventListener("mousemove", mouse_move, false);
    canvas.addEventListener("mouseup", mouse_up, false);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clearColor(rBG, gBG, bBG, 1.0);
    gl.enable(gl.DEPTH_TEST);

    var tick = function () {
        currrentTime = Date.now();

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.clearColor(rBG, gBG, bBG, 1.0);
        gl.enable(gl.DEPTH_TEST);

        var model_matrix = new Matrix4();

        model_matrix.rotate((180 * matrixPhi) / Math.PI, 1, 0, 0);
        model_matrix.rotate((180 * matrixTheta) / Math.PI, 0, 1, 0);

        var sphere_resolution = 45;
        var drawing_area = Math.floor(0.05 * sphere_resolution);

        var n = initVertexBuffers(gl, 3, sphere_resolution, 0, 0, 1,1, 1);

        draw(gl, model_matrix, view_matrix, projection_matrix, n);

        var n = initVertexBuffers(gl, 3.03, drawing_area, 20, 20, 0, 1, 0);
        draw(gl, model_matrix, view_matrix, projection_matrix, n);
        var n = initVertexBuffers(gl, 3.03, drawing_area, 40, 30, 0, 1, 0);
        draw(gl, model_matrix, view_matrix, projection_matrix, n);
        var n = initVertexBuffers(gl, 3.03, drawing_area, 20, 60, 0, 1, 0);
        draw(gl, model_matrix, view_matrix, projection_matrix, n);
        var n = initVertexBuffers(gl, 3.03, drawing_area, 80, 70, 0, 1, 0);
        draw(gl, model_matrix, view_matrix, projection_matrix, n);


        var n = initVertexBuffers(gl, 3, sphere_resolution, 0, 0, 0, 0, 0);

        gl.uniformMatrix4fv(uniformModelMatrix, false, model_matrix.elements);
        gl.uniformMatrix4fv(uniformViewMatrix, false, view_matrix.elements);
        gl.uniformMatrix4fv(uniformProjectionMatrix, false, projection_matrix.elements);
        gl.drawArrays(gl.POINTS, 0, n);

        requestAnimationFrame(tick, canvas);
    };
    tick();
}

