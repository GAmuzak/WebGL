/// <reference path = "utils.js"/>

var vertexShaderText;
var fragmentShaderText;
const minimumCircles = 3;
const maximumCircles = 10;
const animationSpeed = 2;
const mainCircleRadius = 0.9;
const mainCircleSegments = 160;

const SetupShaders = async function()
{
    vertexShaderText = await loadShaderFile("vertex.glsl");
    fragmentShaderText = await loadShaderFile("fragment.glsl");
}

const CircleGenerator = function () 
{
    
    /** @type {HTMLCanvasElement} */
    const canvas = document.getElementById("gl-Canvas");
    /** @type {WebGLRenderingContext} */
    const gl = canvas.getContext("webgl");
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    const compiledShader = SetupVertexAndFragment(gl, vertexShaderText, fragmentShaderText);
    const bacteriaArray = GenerateBacteria(mainCircleRadius, minimumCircles, maximumCircles);
    const vertexAttributeLocation = gl.getAttribLocation(compiledShader, "vertPosition");
    gl.enableVertexAttribArray(vertexAttributeLocation);
    const startTime = performance.now();

    function animate() 
    {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.useProgram(compiledShader);
        InitiateMainCircle(gl, vertexAttributeLocation, compiledShader, mainCircleRadius, mainCircleSegments);
        const currentTime = performance.now();
        const timeElapsed = (currentTime - startTime) / 1000 * animationSpeed;
        bacteriaArray.forEach((randomCircle) => 
        {
            //GrowBacteria(timeElapsed, randomCircle, mainCircleRadius, mainCircleSegments, gl, vertexAttributeLocation, compiledShader);
        });
        if (timeElapsed < 5) 
        {
            requestAnimationFrame(animate);
        }
    }
    animate();
};

function GenerateBacteria(mainCircleRadius, minimumCircles, maximumCircles) 
{
    const randomCircles = [];
    const randomCircleCount = GetRandomInt(minimumCircles, maximumCircles);
    
    for (let i = 0; i < randomCircleCount; i++) 
    {
        const randomRadius = 0.1;
        const randomColor = GetRandomColor();
        const randomAngle = Math.random() * 2 * Math.PI;
        const centerX = mainCircleRadius * Math.cos(randomAngle);
        const centerY = mainCircleRadius * Math.sin(randomAngle);
        const randomCircle = { centerX: centerX, centerY: centerY, radius: randomRadius, color: randomColor, };

        randomCircles.push(randomCircle);
    }
    return randomCircles;
}

function GrowBacteria(timeElapsed, randomCircle, mainCircleRadius, mainCircleSegments, gl, posnAttribLoc, program) 
{
    const growingRadius = Math.min(timeElapsed / 5, 1.0) * 0.2 + 0.0;
    randomCircle.radius = growingRadius;

    const randomCirclePositions = MainCirclePosition(mainCircleRadius, mainCircleSegments);

    for (let j = 0; j < randomCirclePositions.length; j += 2) 
    {
        randomCirclePositions[j] = randomCircle.centerX + randomCircle.radius * randomCirclePositions[j];
        randomCirclePositions[j + 1] = randomCircle.centerY + randomCircle.radius * randomCirclePositions[j + 1];
    }

    const randomCircleBuffer = CreateBuffer(gl, randomCirclePositions);

    gl.bindBuffer(gl.ARRAY_BUFFER, randomCircleBuffer);
    gl.vertexAttribPointer(posnAttribLoc, 2, gl.FLOAT, false, 0, 0);

    const uCol = gl.getUniformLocation(program, "uColor");
    gl.uniform4fv(uCol, randomCircle.color);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, mainCircleSegments);
}

function InitiateMainCircle(gl, positionAttribute, program, radius, segments) 
{
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    const positions = MainCirclePosition(radius, segments);
    const mainCircleBuffer = CreateBuffer(gl, positions);
    gl.bindBuffer(gl.ARRAY_BUFFER, mainCircleBuffer);
    gl.vertexAttribPointer(positionAttribute, 2, gl.FLOAT, false, 0, 0);
    const mainCircleColor = [1.0, 1.0, 1.0, 1.0];
    gl.uniform4fv(gl.getUniformLocation(program, "uColor"), mainCircleColor);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, segments);
}


function MainCirclePosition(radius, segments)
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

