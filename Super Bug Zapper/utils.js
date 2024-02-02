// general webgl utils
async function loadShaderFile(filePath) 
{
    const response = await fetch(filePath);
    if (!response.ok) 
    {
      throw new Error(`Failed to load shader file: ${filePath}`);
    }
    return await response.text();
}

function setGLProgram(vertexShader, fragmentShader, gl) 
{
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
  
function checkGLLoad(gl) 
{
    if (!gl) 
    {
        console.log("WebGL not supported, using experimental");
        gl = canvas.getContext("experimental-webgl");
        if (!gl) 
        {
            alert("Your browser does not support WebGL");
            return;
        }
    }
}
function createShader(gl, type, shaderSource)
{
    const shader = gl.createShader(type);
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);
    const shaderType =
        type === gl.VERTEX_SHADER ? "Vertex Shader" : "Fragment Shader";
    checkShaderValidity(shader, gl, shaderType);
    return shader;
}

function checkShaderValidity(shader, gl, shaderType) 
{
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(
            "Error Compiling: " + shaderType + "!\n",
            gl.getShaderInfoLog(shader)
        );
        gl.deleteShader(shader);
    }
}


// project specifc

async function webGLSetup(gl) 
{
    checkGLLoad(gl);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    var vertexShaderText;
    var fragmentShaderText;
    try
    {
        vertexShaderText = await loadShaderFile("vertex.glsl");
        fragmentShaderText = await loadShaderFile("fragment.glsl");
    }
    catch(e)
    {
        console.error(e)
    }
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderText);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderText);
    const program = setGLProgram(vertexShader, fragmentShader, gl);
    return program;
}


function createBuffer(gl, data) 
{
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    return buffer;
}

function getRandomInt(min, max) 
{
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomColor()
{
    const r = Math.random();
    const g = Math.random();
    const b = Math.random();
    return [r, g, b, 1.0];
}

function showError(errorText) 
{
    const errorBoxDiv = document.getElementById('error-box');
    const errorSpan = document.createElement('p');
    errorSpan.innerText = errorText;
    errorBoxDiv.appendChild(errorSpan);
    console.error(errorText);
}
  
