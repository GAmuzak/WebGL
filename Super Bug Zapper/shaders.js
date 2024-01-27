const vertexShaderText = [
  "precision mediump float;",
  "",
  "attribute vec2 vertPosition;",
  "void main()",
  "{",
  "   gl_Position = vec4(vertPosition, 0.0, 1.0);",
  "}",
].join("\n");

const fragmentShaderText = [
  "precision mediump float;",
  "uniform vec4 uColor;",
  "void main()",
  "{",
  "   gl_FragColor = uColor;",
  "}",
].join("\n");
