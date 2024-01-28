/// <reference path = "utils.js"/>
/// <reference path = "shaders.js"/>

const ShaderMain = function () {
    /** @type {HTMLCanvasElement} */
    const canvas = document.getElementById("webgl-canvas");
    /** @type {WebGLRenderingContext} */
    const gl = canvas.getContext("webgl");

    checkGLLoad(gl);

    gl.clearColor(0.4, 0.4, 0.4, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Making shaders

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderText);
    const fragmentShader = createShader(
        gl,
        gl.FRAGMENT_SHADER,
        fragmentShaderText
    );
    const program = setGLProgram(vertexShader, fragmentShader, gl);

    // Create buffer

    // Each one of these are basically X,Y,R,G,B
    const triangleVertices = [
        0.0, 0.5, 1.0, 0.0, 0.0, -0.5, -0.5, 0.0, 1.0, 0.0, 0.5, -0.5, 0.0, 0.0,
        1.0,
    ];
    const trianlgeVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, trianlgeVertexBufferObject);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(triangleVertices),
        gl.STATIC_DRAW
    );

    const positionAttribLocation = gl.getAttribLocation(program, "vertPosition");
    const colorAttribLocation = gl.getAttribLocation(program, "vertColor");
    gl.vertexAttribPointer(
        positionAttribLocation,
        2,
        gl.FLOAT,
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT,
        0
    );

    gl.vertexAttribPointer(
        colorAttribLocation,
        3,
        gl.FLOAT,
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT,
        2 * Float32Array.BYTES_PER_ELEMENT
    );

    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);

    // Main render loop

    gl.useProgram(program);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
};
