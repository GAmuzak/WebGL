"use strict";

const ShaderMain = function () {
  /** @type {HTMLCanvasElement} */
  const canvas = document.getElementById("webgl-canvas");
  /** @type {WebGLRenderingContext} */
  const gl = canvas.getContext("webgl");

  const recursiveSlider = document.getElementById("recursionSlider");
  const depthValue = document.getElementById("depthValue");

  checkGLLoad(gl);

  gl.clearColor(0.4, 0.4, 0.4, 1.0);

  // Making shaders

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderText);
  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderText
  );

  const program = setGLProgram(vertexShader, fragmentShader, gl);

  const positionAttribLocation = gl.getAttribLocation(program, "vertPosition");
  gl.useProgram(program);

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.enableVertexAttribArray(positionAttribLocation);
  gl.vertexAttribPointer(positionAttribLocation, 2, gl.FLOAT, false, 0, 0);

  // Create buffer

  const EDGE_POINTS = [
    [-1, -1],
    [1, -1],
    [0, 1],
  ];

  const pointList = [];

  function mix(pointA, pointB, mix) {
    const newPointA = pointA[0] * mix + pointB[0] * (1 - mix);
    const newPointB = pointA[1] * mix + pointB[1] * (1 - mix);
    return [newPointA, newPointB];
  }

  function generateTriangles(edgePoints, depth) {
    if (depth === 0) {
      pointList.push(...edgePoints[0]);
      pointList.push(...edgePoints[1]);
      return pointList.push(...edgePoints[2]);
    }
    const middlePointList = [
      mix(edgePoints[0], edgePoints[1], 0.5),
      mix(edgePoints[0], edgePoints[2], 0.5),
      mix(edgePoints[1], edgePoints[2], 0.5),
    ];
    depth--;
    generateTriangles(
      [edgePoints[0], middlePointList[0], middlePointList[1]],
      depth
    );
    generateTriangles(
      [edgePoints[1], middlePointList[0], middlePointList[2]],
      depth
    );
    generateTriangles(
      [edgePoints[2], middlePointList[1], middlePointList[2]],
      depth
    );
  }
  // Main render loop

  let recursiveDepth = parseInt(recursiveSlider.value);
  depthValue.textContent = recursiveDepth;

  recursiveSlider.addEventListener("input", function () {
    recursiveDepth = parseInt(recursiveSlider.value);
    depthValue.textContent = recursiveDepth;
    updateCanvas();
  });

  function updateCanvas() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    pointList.length = 0;
    generateTriangles(EDGE_POINTS, recursiveDepth);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pointList), gl.STATIC_DRAW);
    gl.drawArrays(gl.TRIANGLES, 0, pointList.length / 2);
  }
  updateCanvas();
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
  "",
  "void main()",
  "{",
  "   gl_Position = vec4(vertPosition, 0.0, 1.0);",
  "}",
].join("\n");

const fragmentShaderText = [
  "precision mediump float;",
  "",
  "void main()",
  "{",
  "   gl_FragColor = vec4(0.7, 0.7, 0.9, 1.0);",
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
