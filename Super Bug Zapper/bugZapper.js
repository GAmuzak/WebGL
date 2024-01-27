const ShaderMain = function () {
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

  const posnAttribLoc = gl.getAttribLocation(program, "vertPosition");

  // Create buffer
  const posnBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, posnBuffer);

  const radius = 0.8;
  const segments = 100;
  const positions = [];

  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * 2 * Math.PI;
    const x = radius * Math.cos(theta);
    const y = radius * Math.sin(theta);
    positions.push(x, y);
  }

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  gl.enableVertexAttribArray(posnAttribLoc);

  gl.vertexAttribPointer(posnAttribLoc, 2, gl.FLOAT, false, 0, 0);

  // Main render loop

  gl.useProgram(program);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, segments);
};

/*
x--------------------------------------------------------------------------x
Shaders
x--------------------------------------------------------------------------x
*/

const vertexShaderText = [
  "precision mediump float;",
  "",
  "attribute vec2 vertPosition;",
  "void main()",
  "{",
  "   gl_Position = vec4(vertPosition, 0.0, 1.0);",
  "}",
].join("\n");

const fragmentShaderText = [
  "precision mediump float;",
  "void main()",
  "{",
  "   gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);",
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
