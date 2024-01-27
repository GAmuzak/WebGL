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

function generateMainCirclePositions(radius, segments) {
  const positions = [];
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * 2 * Math.PI;
    const x = radius * Math.cos(theta);
    const y = radius * Math.sin(theta);
    positions.push(x, y);
  }
  return positions;
}

function createBuffer(gl, data) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
  return buffer;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomColor() {
  const r = Math.random();
  const g = Math.random();
  const b = Math.random();
  return [r, g, b, 1.0];
}
