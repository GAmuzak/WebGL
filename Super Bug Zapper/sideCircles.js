/// <reference path = "utils.js"/>
/// <reference path = "shaders.js"/>

const sideCirlces = function () {
  /** @type {HTMLCanvasElement} */
  const canvas = document.getElementById("webgl-canvas");
  /** @type {WebGLRenderingContext} */
  const gl = canvas.getContext("webgl");

  checkGLLoad(gl);

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderText);
  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderText
  );
  const program = setGLProgram(vertexShader, fragmentShader, gl);

  const mainCircleRadius = 0.8;
  const mainCircleSegments = 100;

  const posnAttribLoc = gl.getAttribLocation(program, "vertPosition");
  gl.enableVertexAttribArray(posnAttribLoc);
  gl.vertexAttribPointer(posnAttribLoc, 2, gl.FLOAT, false, 0, 0);

  gl.useProgram(program);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, mainCircleSegments);

  // Generate and draw random circles on the circumference
  const numRandomCircles = getRandomInt(5, 10); // Adjust the range as needed

  for (let i = 0; i < numRandomCircles; i++) {
    const randomRadius = Math.random() * 0.2 + 0.1; // Random radius between 0.1 and 0.3
    const randomColor = getRandomColor();
    const randomAngle = Math.random() * 2 * Math.PI; // Random angle for the center position

    const centerX = mainCircleRadius * Math.cos(randomAngle);
    const centerY = mainCircleRadius * Math.sin(randomAngle);

    const randomCirclePositions = generateMainCirclePositions(
      mainCircleRadius,
      mainCircleSegments
    );

    // Translate the random circle positions to the circumference
    for (let j = 0; j < randomCirclePositions.length; j += 2) {
      randomCirclePositions[j] =
        centerX + randomRadius * randomCirclePositions[j];
      randomCirclePositions[j + 1] =
        centerY + randomRadius * randomCirclePositions[j + 1];
    }

    const randomCircleBuffer = createBuffer(gl, randomCirclePositions);

    // Use the correct buffer for drawing
    gl.bindBuffer(gl.ARRAY_BUFFER, randomCircleBuffer);
    gl.vertexAttribPointer(posnAttribLoc, 2, gl.FLOAT, false, 0, 0);

    // Set the random circle color as a uniform variable
    gl.uniform4fv(gl.getUniformLocation(program, "uColor"), randomColor);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, mainCircleSegments);
  }
};
