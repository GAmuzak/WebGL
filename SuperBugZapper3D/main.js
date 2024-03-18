/// <reference path = "cuon-matrix.js"/>
/// <reference path = "utils.js"/>

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
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    var tick = function () {
        currrentTime = Date.now();

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.clearColor(0, 0, 0, 1);
        gl.enable(gl.DEPTH_TEST);

        var model_matrix = new Matrix4();

        model_matrix.rotate((180 * matrixPhi) / Math.PI, 1, 0, 0);
        model_matrix.rotate((180 * matrixTheta) / Math.PI, 0, 1, 0);

        var sphere_resolution = 45;
        var drawing_area = Math.floor(0.05 * sphere_resolution);

        var n = initVertexBuffers(gl, 3, sphere_resolution, 0, 0, 0.4, 0.4, 0.5);
        if (n < 0) {
            console.log('Failed to set the vertex information');
            return;
        }
        draw(gl, model_matrix, view_matrix, projection_matrix, n);

        var n = initVertexBuffers(gl, 3.02, drawing_area, 0, 0, 0, 1, 0);
        if (n < 0) {
            console.log('Failed to set the vertex information');
            return;
        }
        draw(gl, model_matrix, view_matrix, projection_matrix, n);

        var n = initVertexBuffers(gl, 3, sphere_resolution, 0, 0, 0, 1, 0);
        if (n < 0) {
            console.log('Failed to set the vertex information');
            return;
        }
        gl.uniformMatrix4fv(uniformModelMatrix, false, model_matrix.elements);
        gl.uniformMatrix4fv(uniformViewMatrix, false, view_matrix.elements);
        gl.uniformMatrix4fv(uniformProjectionMatrix, false, projection_matrix.elements);
        gl.drawArrays(gl.POINTS, 0, n);

        requestAnimationFrame(tick, canvas);
    };
    tick();
}
function draw(gl, modelMatrix, viewMatrix, projectionMatrix, n) {
    gl.uniformMatrix4fv(uniformModelMatrix, false, modelMatrix.elements);
    gl.uniformMatrix4fv(uniformViewMatrix, false, viewMatrix.elements);
    gl.uniformMatrix4fv(uniformProjectionMatrix, false, projectionMatrix.elements);
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_SHORT, 0);
}

function initArrayBuffer(gl, attribute, data, type, num) {
    var buffer = gl.createBuffer();
    if (!buffer) {
        console.log('Failed to create the buffer object');
        return false;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    var a_attribute = gl.getAttribLocation(gl.program, attribute);
    if (a_attribute < 0) {
        console.log('Failed to get the storage location of ' + attribute);
        return false;
    }
    gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);

    gl.enableVertexAttribArray(a_attribute);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return true;
}

function initVertexBuffers(gl, radius, drawingAngle, startTheta, startPhi, r, g, b) {

    var sphere_resolution = 45;

    var positions = [];
    var indices = [];
    var colors = [];

    var i, angle_i, sin_i, cos_i;
    var j, angle_j, sin_j, cos_j;
    var p1, p2;

    for (j = 0; j <= drawingAngle; j++) {
        angle_j = j * Math.PI / sphere_resolution;
        sin_j = Math.sin(angle_j);
        cos_j = Math.cos(angle_j);

        for (i = 0; i <= sphere_resolution; i++) {
            angle_i = i * 2 * Math.PI / sphere_resolution;
            sin_i = Math.sin(angle_i);
            cos_i = Math.cos(angle_i);

            var sin_a = Math.sin(startPhi * Math.PI / 180.0);
            var cos_a = Math.cos(startPhi * Math.PI / 180.0);
            var sin_b = Math.sin(startTheta * Math.PI / 180.0);
            var cos_b = Math.cos(startTheta * Math.PI / 180.0);

            var orig_z = cos_i * sin_j;
            var orig_x = sin_i * sin_j;
            var orig_y = cos_j;

            var after_phi_x = orig_x;
            var after_phi_y = orig_y * cos_a - orig_z * sin_a;
            var after_phi_z = orig_y * sin_a + orig_z * cos_a;

            var x = after_phi_x * cos_b + after_phi_z * sin_b;
            var y = after_phi_y;
            var z = -after_phi_x * sin_b + after_phi_z * cos_b

            positions.push(radius * x);
            positions.push(radius * y);
            positions.push(radius * z);

            colors.push(r);
            colors.push(g);
            colors.push(b);
        }
    }

    for (j = 0; j < drawingAngle; j++) {
        for (i = 0; i < sphere_resolution; i++) {
            p1 = j * (sphere_resolution + 1) + i;
            p2 = p1 + (sphere_resolution + 1);

            indices.push(p1);
            indices.push(p2);
            indices.push(p1 + 1);

            indices.push(p1 + 1);
            indices.push(p2);
            indices.push(p2 + 1);
        }
    }

    if (!initArrayBuffer(gl, 'a_position', new Float32Array(positions), gl.FLOAT, 3))
        return -1;
    if (!initArrayBuffer(gl, 'a_color', new Float32Array(colors), gl.FLOAT, 3))
        return -1;

    var indexBuffer = gl.createBuffer();
    if (!indexBuffer) {
        console.log('Failed to create the buffer');
        return -1;
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    return indices.length;
}

function normalizeAngle(angle) {
    while (angle > Math.PI) {
        angle -= 2 * Math.PI;
    }
    while (angle < -Math.PI) {
        angle += 2 * Math.PI;
    }
    return angle;
}
