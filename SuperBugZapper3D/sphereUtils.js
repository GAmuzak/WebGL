/// <reference path = "main.js"/>

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

    var aAttribute = gl.getAttribLocation(gl.program, attribute);
    if (aAttribute < 0) {
        console.log('Failed to get the storage location of ' + attribute);
        return false;
    }
    gl.vertexAttribPointer(aAttribute, num, type, false, 0, 0);

    gl.enableVertexAttribArray(aAttribute);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return true;
}
function giveCloseCol(val) {
    const range = 0.01;
    const newVal = Math.max(0, Math.min(1, val + (Math.random() * range * 2 - range)));
    return newVal;
}

function getRandomVal(scale = 1) {
    return Math.random() * scale;
}
