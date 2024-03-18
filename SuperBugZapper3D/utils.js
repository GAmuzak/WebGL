/// <reference path = "shaders.js"/>

function webGLSetup(gl) {
    checkGLLoad(gl);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const vertexShaderText = vertexShaderData;
    const fragmentShaderText = fragmentShaderData;

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderText);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderText);
    const program = setGLProgram(vertexShader, fragmentShader, gl);
    gl.useProgram(program);
    gl.program = program;
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
