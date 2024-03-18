var vertexShaderData =
    'attribute vec4 a_position;\n' +
    'attribute vec4 a_color;\n' +
    'varying vec4 v_color;\n' +

    'uniform mat4 pmatrix;' +
    'uniform mat4 vmatrix;' +
    'uniform mat4 mmatrix;' +

    'void main() {\n' +
    'gl_Position = pmatrix * vmatrix * mmatrix * a_position;\n' +
    'gl_PointSize = 2.0;\n' +
    '    v_color = a_color;\n' +
    '}\n';



var fragmentShaderData =
    'precision mediump float;\n' +
    'varying vec4 v_color; \n' +

    'void main() {\n' +
    'gl_FragColor = v_color;\n' +
    '}\n';
