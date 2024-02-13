/// <reference path = "utils.js"/>
/// <reference path = "circleGenHelpers.js"/>

var randomCircles;

const circGen = async function (canvas, minCircCount, maxCircCount, animSpeed, finalVals) {
    // /** @type {HTMLCanvasElement} */
    // const canvas = document.getElementById("webgl-canvas");
    /** @type {WebGLRenderingContext} */
    const gl = canvas.getContext("webgl");

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const program = await webGLSetup(gl);

    const mainCircleRadius = 0.8;
    const mainCircleSegments = 360;

    randomCircles = generateRandomCircles(mainCircleRadius, minCircCount, maxCircCount, finalVals);

    const posnAttribLoc = gl.getAttribLocation(program, "vertPosition");
    gl.enableVertexAttribArray(posnAttribLoc);

    const startTime = performance.now();

    function animate() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.useProgram(program);
        generateMainCircle(gl, posnAttribLoc, program, mainCircleRadius, mainCircleSegments);
        const currentTime = performance.now();
        const elapsed = (currentTime - startTime) / 1000 * animSpeed;
        randomCircles.forEach((randomCircle) => {
            drawAndGrowCircle(elapsed, randomCircle, mainCircleRadius, mainCircleSegments, gl, posnAttribLoc, program);
        });
        if (elapsed < 5) {
            requestAnimationFrame(animate);
        }
    }
    animate();
};

function drawAndGrowCircle(elapsed, randomCircle, mainCircleRadius, mainCircleSegments, gl, posnAttribLoc, program) {
    const growingRadius = Math.min(elapsed / 5, 1.0) * randomCircle.maxRadius + 0.0;
    randomCircle.radius = growingRadius;

    const randomCirclePositions = generateMainCirclePositions(mainCircleRadius, mainCircleSegments);

    for (let i = 0; i < randomCirclePositions.length; i += 2) {
        randomCirclePositions[i] = randomCircle.centerX + randomCircle.radius * randomCirclePositions[i];
        randomCirclePositions[i + 1] = randomCircle.centerY + randomCircle.radius * randomCirclePositions[i + 1];
    }


    const randomCircleBuffer = createBuffer(gl, randomCirclePositions);

    gl.bindBuffer(gl.ARRAY_BUFFER, randomCircleBuffer);
    gl.vertexAttribPointer(posnAttribLoc, 2, gl.FLOAT, false, 0, 0);

    const uCol = gl.getUniformLocation(program, "uColor");
    gl.uniform4fv(uCol, randomCircle.color);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, mainCircleSegments);
}
