/// <reference path = "utils.js"/>

const circGen = async function (minCircCount, maxCircCount, animSpeed, finalVals) 
{
    /** @type {HTMLCanvasElement} */
    const canvas = document.getElementById("webgl-canvas");
    /** @type {WebGLRenderingContext} */
    const gl = canvas.getContext("webgl");

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const program = await webGLSetup(gl);
    const mainCircleRadius = 0.8;
    const mainCircleSegments = 360;

    const randomCircles = generateRandomCircles(mainCircleRadius, minCircCount, maxCircCount, finalVals);
    const posnAttribLoc = gl.getAttribLocation(program, "vertPosition");
    gl.enableVertexAttribArray(posnAttribLoc);

    const startTime = performance.now();

    function animate() 
    {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.useProgram(program);
        generateMainCircle(gl, posnAttribLoc, program, mainCircleRadius, mainCircleSegments);
        const currentTime = performance.now();
        const elapsed = (currentTime - startTime) / 1000 * animSpeed;
        randomCircles.forEach((randomCircle) => {
            drawAndGrowCircle(elapsed, randomCircle, mainCircleRadius, mainCircleSegments, gl, posnAttribLoc, program);
        });
        if (elapsed < 5) 
        {
            requestAnimationFrame(animate);
        }
    }
    animate();
};

function drawAndGrowCircle(elapsed, randomCircle, mainCircleRadius, mainCircleSegments, gl, posnAttribLoc, program) 
{
    const growingRadius = Math.min(elapsed / 5, 1.0) * 0.2 + 0.0;
    randomCircle.radius = growingRadius;

    const randomCirclePositions = generateMainCirclePositions(mainCircleRadius, mainCircleSegments);

    for (let j = 0; j < randomCirclePositions.length; j += 2) {
        randomCirclePositions[j] = randomCircle.centerX + randomCircle.radius * randomCirclePositions[j];
        randomCirclePositions[j + 1] = randomCircle.centerY + randomCircle.radius * randomCirclePositions[j + 1];
    }

    const randomCircleBuffer = createBuffer(gl, randomCirclePositions);

    gl.bindBuffer(gl.ARRAY_BUFFER, randomCircleBuffer);
    gl.vertexAttribPointer(posnAttribLoc, 2, gl.FLOAT, false, 0, 0);

    const uCol = gl.getUniformLocation(program, "uColor");
    gl.uniform4fv(uCol, randomCircle.color);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, mainCircleSegments);
}


function generateMainCirclePositions(radius, segments) 
{
    const positions = [];
    for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * 2 * Math.PI;
        const x = radius * Math.cos(theta);
        const y = radius * Math.sin(theta);
        positions.push(x, y);
    }
    return positions;
}

function generateMainCircle(gl, posnAttribLoc, program, radius, segments) 
{
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    const positions = generateMainCirclePositions(radius, segments);
    const mainCircleBuffer = createBuffer(gl, positions);
    gl.bindBuffer(gl.ARRAY_BUFFER, mainCircleBuffer);
    gl.vertexAttribPointer(posnAttribLoc, 2, gl.FLOAT, false, 0, 0);
    const mainCircleColor = [1.0, 1.0, 1.0, 1.0];
    gl.uniform4fv(gl.getUniformLocation(program, "uColor"), mainCircleColor);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, segments);
}

function generateRandomCircles(mainCircleRadius, minCircCount, maxCircCount, finalVals) 
{
    const randomCircles = [];
    const numRandomCircles = getRandomInt(minCircCount, maxCircCount);
    finalVals.textContent = 'Loaded program with circle count: ' + numRandomCircles;
    for (let i = 0; i < numRandomCircles; i++) 
    {
        const randomRadius = 0.1;
        const randomColor = getRandomColor();
        const randomAngle = Math.random() * 2 * Math.PI;

        const centerX = mainCircleRadius * Math.cos(randomAngle);
        const centerY = mainCircleRadius * Math.sin(randomAngle);

        const randomCircle = { centerX: centerX, centerY: centerY, radius: randomRadius, color: randomColor, };

        randomCircles.push(randomCircle);
    }
    return randomCircles;
}
