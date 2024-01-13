var ShaderMain = function () {
  console.log("This is working");

  /** @type {HTMLCanvasElement} */
  var canvas = document.getElementById("webgl-canvas");
  /** @type {WebGLRenderingContext} */
  var gl = canvas.getContext("webgl");

  checkGLLoad(gl);

  gl.clearColor(0.4, 0.4, 0.4, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Making shaders

  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

  gl.shaderSource(vertexShader, vertexShaderText);
  gl.shaderSource(fragmentShader, fragmentShaderText);

  gl.compileShader(vertexShader);
  checkShaderValidity(vertexShader, gl, "vertex shader");

  gl.compileShader(fragmentShader);
  checkShaderValidity(fragmentShader, gl, "fragment shader");
  var program = gl.createProgram();
  setGLProgram(program, vertexShader, fragmentShader, gl);

  // Create buffer

  // Each one of these are basically X,Y,R,G,B
  var triangleVertices = [
    0.0, 0.5, 1.0, 0.0, 0.0, -0.5, -0.5, 0.0, 1.0, 0.0, 0.5, -0.5, 0.0, 0.0,
    1.0,
  ];
  var trianlgeVertexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, trianlgeVertexBufferObject);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(triangleVertices),
    gl.STATIC_DRAW
  );

  var positionAttribLocation = gl.getAttribLocation(program, "vertPosition");
  var colorAttribLocation = gl.getAttribLocation(program, "vertColor");
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

/*
x--------------------------------------------------------------------------x
Shaders
x--------------------------------------------------------------------------x
*/

var vertexShaderText = [
  "precision mediump float;",
  "",
  "attribute vec2 vertPosition;",
  "attribute vec3 vertColor;",
  "varying vec3 fragColor;",
  "",
  "void main()",
  "{",
  "   fragColor = vertColor;",
  "   gl_Position = vec4(vertPosition, 0.0, 1.0);",
  "}",
].join("\n");

var fragmentShaderText = [
  "precision mediump float;",
  "",
  "varying vec3 fragColor;",
  "void main()",
  "{",
  "   gl_FragColor = vec4(fragColor, 1.0);",
  "}",
].join("\n");

/*
x--------------------------------------------------------------------------x
Setting up helper functions here to keep code clean
x--------------------------------------------------------------------------x
*/

function checkGLLoad(gl) {
  if (!gl) {
    console.log("WebGL not supported, using experimental");
    gl = canvas.getContext("experimental-webgl");
    if (!gl) {
      alert("Your browser does not support WebGL");
      return;
    }
  } else {
    console.log("WebGL loaded!");
  }
}

function checkShaderValidity(shader, gl, shaderType) {
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(
      "Error Compiling: " + shaderType + "!\n",
      gl.getShaderInfoLog(shader)
    );
  }
}

function setGLProgram(program, vertexShader, fragmentShader, gl) {
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
}
