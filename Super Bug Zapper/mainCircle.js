/// <reference path = "utils.js"/>
/// <reference path = "shaders.js"/>

const mainCirc = function () {
  /** @type {HTMLCanvasElement} */
  const canvas = document.getElementById("webgl-canvas");
  /** @type {WebGLRenderingContext} */
  const gl = canvas.getContext("webgl");

  checkGLLoad(gl);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Making shaders

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderText);
  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderText
  );
  const program = setGLProgram(vertexShader, fragmentShader, gl);

  // Circle Logic
  const posnBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, posnBuffer);

  const radius = 0.8;
  const segments = 100;
  const positions = generateMainCirclePositions(radius, segments);

  //setting buffer data
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  const posnAttribLoc = gl.getAttribLocation(program, "vertPosition");

  gl.enableVertexAttribArray(posnAttribLoc);

  gl.vertexAttribPointer(posnAttribLoc, 2, gl.FLOAT, false, 0, 0);

  // setting color
  const mainCircleColor = [1.0, 1.0, 1.0, 1.0]; // Set your desired color here
  // Main render loop
  gl.useProgram(program);
  gl.uniform4fv(gl.getUniformLocation(program, "uColor"), mainCircleColor);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, segments);
};
