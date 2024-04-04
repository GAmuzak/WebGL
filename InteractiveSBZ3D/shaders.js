/// <reference path = "sphereUtils.js"/>

var vertexShaderData =
    'attribute vec4 a_Position;\n' +
    'uniform mat4 Pmatrix;' +
    'uniform mat4 Vmatrix;' +
    'uniform mat4 Mmatrix;' +
    'attribute vec4 a_Color;\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '  gl_Position = Pmatrix * Vmatrix * Mmatrix * a_Position;\n' +
    '  v_Color = a_Color;' +
    '}\n';


var fragmentShaderData =
    '#ifdef GL_ES\n' +
    'precision mediump float;\n' +
    '#endif\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '  gl_FragColor = v_Color;\n' +
    '}\n';
