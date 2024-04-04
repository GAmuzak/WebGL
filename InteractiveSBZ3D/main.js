/// <reference path = "sphereUtils.js"/>

var drag = false;
var old_x, old_y;
var dX = 0, dY = 0;
var GROWING_RATE = 2;

var u_ModelMatrix = [];
var u_ViewMatrix = [];
var u_ProjectionMatrix = [];

let rand_alpha = []
let rand_beta = []
let rand_col_r = []
let rand_col_g = []
let rand_col_b = []
var mouseClickLoc = [];
var result = "";
var currentSize = 1;

for (let j = 0; j < 7; j++) {
	rand_alpha.push(Math.floor(Math.random() * 360));
	rand_beta.push(Math.floor(Math.random() * 360));
	randCols = getRandomCol();
	rand_col_r.push(randCols[0]);
	rand_col_g.push(randCols[1]);
	rand_col_b.push(randCols[2]);
}
console.log(rand_alpha);
console.log(rand_beta);


function main() {

	var canvas = document.getElementById('webgl');
	gl = webGLSetup(canvas);

	mouseSetup(canvas);


	var viewMatrix = new Matrix4();
	var projMatrix = new Matrix4();

	projMatrix.setPerspective(80, canvas.width / canvas.height, 1, 100);
	viewMatrix.elements[14] = viewMatrix.elements[14] - 6;

	THETA = 0,
		PHI = 0;

	u_ModelMatrix = gl.getUniformLocation(gl.program, "Mmatrix");
	u_ViewMatrix = gl.getUniformLocation(gl.program, "Vmatrix");
	u_ProjectionMatrix = gl.getUniformLocation(gl.program, "Pmatrix");

	if (!u_ModelMatrix || !u_ViewMatrix || !u_ProjectionMatrix) {
		console.log('Failed to get the storage location');
		return;
	}

	var gamescore = 0.0;
	result = "O";

	var frame_counter = 0;
	var tick = function () {

		if (result == "O") {
			document.getElementById("score").innerHTML = gamescore;
			gamescore = gamescore + 1;
		}

		currentSize = animate(currentSize);

		canvas.onmousedown = function (ev) { click(ev, gl, canvas, currentSize); };

		if (currentSize > 30 && rand_alpha.length > 1) {
			document.getElementById("result").innerHTML = "You Lose";
			result = "L"
		} else if (rand_alpha.length < 1) {
			document.getElementById("result").innerHTML = "You Win";
			result = "W"
		}

		gl.clearColor(0, 0, 0, 1);
		gl.enable(gl.DEPTH_TEST);

		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		var modelMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
		rotateY(modelMatrix, THETA);
		rotateX(modelMatrix, PHI);

		var n = initVertexBuffers(gl, 3, 180, 0, 0, 0.2, 0.2, 0.2);
		if (n < 0) {
			console.log('Failed to set the vertex information');
			return;
		}
		draw(gl, modelMatrix, viewMatrix, projMatrix, n);

		for (var i = 0; i < 360; i += 36) {
			for (var j = 0; j < 360; j += 36) {
				var n = initVertexBuffers(gl, 3 + 0.001, 1, i, j, 1, 1, 1);
				draw(gl, modelMatrix, viewMatrix, projMatrix, n);
			}
		}

		var growth = Math.floor(currentSize);

		for (let i = 0; i < rand_alpha.length; i++) {
			var n = initVertexBuffers(gl, (3 + 0.002 * (i + 1)), growth, rand_alpha[i], rand_beta[i], rand_col_r[i], rand_col_g[i], rand_col_b[i]);
			if (n < 0) {
				console.log('Failed to set the vertex information');
				return;
			}
			draw(gl, modelMatrix, viewMatrix, projMatrix, n);
		}

		frame_counter += 1;
		requestAnimationFrame(tick, canvas);
	};
	tick();
}

function mouseSetup(canvas) {
	var mouseDown = function (e) {
		drag = true;
		old_x = e.pageX, old_y = e.pageY;

		e.preventDefault();
		return false;
	};

	var mouseUp = function () {
		drag = false;
	};

	var mouseMove = function (e) {
		if (!drag) return false;
		dX = (e.pageX - old_x) * 2 * Math.PI / canvas.width,
			dY = (e.pageY - old_y) * 2 * Math.PI / canvas.height;
		THETA += dX;
		PHI += dY;
		old_x = e.pageX, old_y = e.pageY;
		e.preventDefault();
	};

	canvas.addEventListener("mousedown", mouseDown, false);
	canvas.addEventListener("mouseup", mouseUp, false);
	canvas.addEventListener("mouseout", mouseUp, false);
	canvas.addEventListener("mousemove", mouseMove, false);
}

function webGLSetup(canvas) {
	gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });

	if (!gl) {
		console.log('Failed to get the rendering context for WebGL');
		return;
	}

	if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
		console.log('Failed to intialize shaders.');
		return;
	}
	return gl;
}


var g_last = Date.now();
function animate(size) {
	if (result == "L" || result == "W") return size;
	var now = Date.now();
	var elapsed = now - g_last;
	g_last = now;
	var newSize = size + (GROWING_RATE * elapsed) / 1000.0;
	return newSize;
}

function draw(gl, modelMatrix, viewMatrix, projMatrix, n) {
	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix);

	gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
	gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMatrix.elements);

	gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_SHORT, 0);
}


function click(ev, gl, canvas, currentSize) {

	var rect = canvas.getBoundingClientRect();
	var x = ev.clientX - rect.left;
	var y = rect.bottom - ev.clientY;

	var pixels = new Uint8Array(4);

	gl.readPixels(
		x,
		y,
		1,
		1,
		gl.RGBA,
		gl.UNSIGNED_BYTE,
		pixels
	);

	for (let i = rand_alpha.length; i >= 0; i--) {
		r = rand_col_r[i] * 255
		g = rand_col_g[i] * 255
		b = rand_col_b[i] * 255

		if (approximatelyEqual(pixels[0], r, 0.6) && approximatelyEqual(pixels[1], g, 0.6) && approximatelyEqual(pixels[2], b, 0.6)) {
			if (currentSize < 30) {
				rand_alpha.splice(i, 1);
				rand_beta.splice(i, 1);
				rand_col_r.splice(i, 1);
				rand_col_g.splice(i, 1);
				rand_col_b.splice(i, 1);
			}
		}
	}
}

function getRandomCol(scale = 1) {
	const min = 0.03;
	const max = 0.98;
	let value;
	do {
		value = [Math.random() * scale, Math.random() * scale, Math.random() * scale];
	} while (value.some(val => val <= min || val >= max || val === 0.5));
	return value;
}


function approximatelyEqual(a, b, epsilon) {
	return Math.abs(a - b) < epsilon;
}
