/// <reference path = "utils.js"/>
/// <reference path = "shaders.js"/>

const sideCirc = function () {
  /** @type {HTMLCanvasElement} */
  const canvas = document.getElementById("webgl-canvas");
  /** @type {WebGLRenderingContext} */
  const gl = canvas.getContext("webgl");

  checkGLLoad(gl);

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderText);
  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderTextSmallerCircle
  );
  const program = setGLProgram(vertexShader, fragmentShader, gl);

  const mainCircleRadius = 0.8;
  const mainCircleSegments = 100;

  const posnAttribLoc = gl.getAttribLocation(program, "vertPosition");
  gl.enableVertexAttribArray(posnAttribLoc);
  gl.vertexAttribPointer(posnAttribLoc, 2, gl.FLOAT, false, 0, 0);

  gl.useProgram(program);

  const randomCircles = []; // Array to store information about random circles
  const numRandomCircles = getRandomInt(5, 10);

  for (let i = 0; i < numRandomCircles; i++) {
    const randomRadius = 0.1; // Initial radius, can be adjusted
    const randomColor = getRandomColor();
    const randomAngle = Math.random() * 2 * Math.PI;

    const centerX = mainCircleRadius * Math.cos(randomAngle);
    const centerY = mainCircleRadius * Math.sin(randomAngle);

    const randomCircle = {
      centerX: centerX,
      centerY: centerY,
      radius: randomRadius,
      color: randomColor,
    };

    randomCircles.push(randomCircle);
  }

  const startTime = performance.now();

  function animate() {
    const currentTime = performance.now();
    const elapsed = (currentTime - startTime) / 1000;
    // Draw each random circle with its growing radius
    randomCircles.forEach(function (randomCircle) {
      const growingRadius = Math.min(elapsed / 5, 1.0) * 0.2 + 0.0;
      randomCircle.radius = growingRadius;

      // Translate the positions of the main circle to create the positions for the random circle on the circumference
      const randomCirclePositions = generateMainCirclePositions(
        mainCircleRadius,
        mainCircleSegments
      );

      for (let j = 0; j < randomCirclePositions.length; j += 2) {
        randomCirclePositions[j] =
          randomCircle.centerX + randomCircle.radius * randomCirclePositions[j];
        randomCirclePositions[j + 1] =
          randomCircle.centerY +
          randomCircle.radius * randomCirclePositions[j + 1];
      }

      const randomCircleBuffer = createBuffer(gl, randomCirclePositions);

      // Use the correct buffer for drawing
      gl.bindBuffer(gl.ARRAY_BUFFER, randomCircleBuffer);
      gl.vertexAttribPointer(posnAttribLoc, 2, gl.FLOAT, false, 0, 0);

      const uLoc = gl.getUniformLocation(program, "uColor2");
      // Set the random circle color as a uniform variable
      gl.uniform4fv(uLoc, randomCircle.color);

      gl.drawArrays(gl.TRIANGLE_FAN, 0, mainCircleSegments);
    });
    if (elapsed < 5) {
      requestAnimationFrame(animate); // Continue the animation loop
    }
  }

  animate(); // Start the animation loop
};
