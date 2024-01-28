/// <reference path = "utils.js"/>
/// <reference path = "shaders.js"/>

const sideCirc = function () {
  /** @type {HTMLCanvasElement} */
  const canvas = document.getElementById("webgl-canvas");
  /** @type {WebGLRenderingContext} */
  const gl = canvas.getContext("webgl");

  checkGLLoad(gl);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderText);
  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderText
  );
  const program = setGLProgram(vertexShader, fragmentShader, gl);

  const mainCircleRadius = 0.8;
  const mainCircleSegments = 360;

  const posnAttribLoc = gl.getAttribLocation(program, "vertPosition");
  gl.enableVertexAttribArray(posnAttribLoc);
  gl.vertexAttribPointer(posnAttribLoc, 2, gl.FLOAT, false, 0, 0);

  gl.useProgram(program);

  const randomCircles = generateRandomCircles(mainCircleRadius);

  const startTime = performance.now();

  function animate() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    generateMainCircle(
      gl,
      posnAttribLoc,
      program,
      mainCircleRadius,
      mainCircleSegments
    );
    const currentTime = performance.now();
    const elapsed = (currentTime - startTime) / 1000;
    randomCircles.forEach((randomCircle) => {
      const growingRadius = Math.min(elapsed / 5, 1.0) * 0.2 + 0.0;
      randomCircle.radius = growingRadius;

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

      gl.bindBuffer(gl.ARRAY_BUFFER, randomCircleBuffer);
      gl.vertexAttribPointer(posnAttribLoc, 2, gl.FLOAT, false, 0, 0);

      const uCol = gl.getUniformLocation(program, "uColor");
      gl.uniform4fv(uCol, randomCircle.color);

      gl.drawArrays(gl.TRIANGLE_FAN, 0, mainCircleSegments);
    });
    if (elapsed < 5) {
      requestAnimationFrame(animate);
    }
  }

  animate();
};

function generateRandomCircles(mainCircleRadius) {
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
  return randomCircles;
}

function generateMainCircle(gl, posnAttribLoc, program, radius, segments) {
  const positions = generateMainCirclePositions(radius, segments);
  const mainCircleBuffer = createBuffer(gl, positions);
  gl.bindBuffer(gl.ARRAY_BUFFER, mainCircleBuffer);
  gl.vertexAttribPointer(posnAttribLoc, 2, gl.FLOAT, false, 0, 0);
  const mainCircleColor = [1.0, 1.0, 1.0, 1.0];
  gl.uniform4fv(gl.getUniformLocation(program, "uColor"), mainCircleColor);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, segments);
}
