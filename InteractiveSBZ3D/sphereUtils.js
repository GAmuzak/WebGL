/// <reference path = "main.js"/>
/// <reference path = "shaders.js"/>


function initVertexBuffers(gl, radius, growth, alpha, beta, r, g, b) { // Create a sphere
    var sin_a = Math.sin(alpha * Math.PI / 180.0);
    var cos_a = Math.cos(alpha * Math.PI / 180.0);
    var sin_b = Math.sin(beta * Math.PI / 180.0);
    var cos_b = Math.cos(beta * Math.PI / 180.0);
    var SPHERE_DIV = 180;

    var i, ai, si, ci;
    var j, aj, sj, cj;
    var p1, p2;

    var positions = [];
    var indices = [];
    var colors = [];

    for (j = 0; j <= growth; j++) {
        aj = j * Math.PI / SPHERE_DIV;
        sj = Math.sin(aj);
        cj = Math.cos(aj);
        for (i = 0; i <= SPHERE_DIV; i++) {
            ai = i * 2 * Math.PI / SPHERE_DIV;
            si = Math.sin(ai);
            ci = Math.cos(ai);
            x_ = si * sj;
            y_ = cj;
            z_ = ci * sj;
            x__ = x_;
            y__ = y_ * cos_a - z_ * sin_a;
            z__ = y_ * sin_a + z_ * cos_a;
            x = x__ * cos_b + z__ * sin_b;
            y = y__;
            z = -x__ * sin_b + z__ * cos_b

            positions.push(radius * x);
            positions.push(radius * y);
            positions.push(radius * z);

            colors.push(r);
            colors.push(g);
            colors.push(b);
        }
    }

    for (j = 0; j < growth; j++) {
        for (i = 0; i < SPHERE_DIV; i++) {
            p1 = j * (SPHERE_DIV + 1) + i;
            p2 = p1 + (SPHERE_DIV + 1);

            indices.push(p1);
            indices.push(p2);
            indices.push(p1 + 1);

            indices.push(p1 + 1);
            indices.push(p2);
            indices.push(p2 + 1);
        }
    }

    if (!initArrayBuffer(gl, 'a_Position', new Float32Array(positions), gl.FLOAT, 3)) return -1;
    if (!initArrayBuffer(gl, 'a_Color', new Float32Array(colors), gl.FLOAT, 3)) return -1;

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    var indexBuffer = gl.createBuffer();
    if (!indexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    return indices.length;
}

function initArrayBuffer(gl, attribute, data, type, num) {
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    var a_attribute = gl.getAttribLocation(gl.program, attribute);
    gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
    gl.enableVertexAttribArray(a_attribute);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    return true;
}

function rotateX(m, angle) {
    var c = Math.cos(angle);
    var s = Math.sin(angle);
    var mv1 = m[1], mv5 = m[5], mv9 = m[9];

    m[1] = m[1] * c - m[2] * s;
    m[5] = m[5] * c - m[6] * s;
    m[9] = m[9] * c - m[10] * s;

    m[2] = m[2] * c + mv1 * s;
    m[6] = m[6] * c + mv5 * s;
    m[10] = m[10] * c + mv9 * s;
}

function rotateY(m, angle) {
    var c = Math.cos(angle);
    var s = Math.sin(angle);
    var mv0 = m[0], mv4 = m[4], mv8 = m[8];

    m[0] = c * m[0] + s * m[2];
    m[4] = c * m[4] + s * m[6];
    m[8] = c * m[8] + s * m[10];

    m[2] = c * m[2] - s * mv0;
    m[6] = c * m[6] - s * mv4;
    m[10] = c * m[10] - s * mv8;
}

function webGLSetup(canvas) {
    gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });

    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    if (!initShaders(gl, vertexShaderData, fragmentShaderData)) {
        console.log('Failed to intialize shaders.');
        return;
    }
    return gl;
}

function approximatelyEqual(a, b, epsilon) {
    return Math.abs(a - b) < epsilon;
}
