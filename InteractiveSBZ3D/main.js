/// <reference path = "sphereUtils.js"/>

var isDragging = false;
var prevX, prevY;
var diffX = 0, diffY = 0;
var growthRate = 2;

var uModelMatrix = [];
var uViewMatrix = [];
var uProjectionMatrix = [];

let randomAlpha = []
let randomBeta = []
let randomColorR = []
let randomColorG = []
let randomColorB = []
var mouseClickLoc = [];
var result = "";
var currentSize = 1;

for (let j = 0; j < 7; j++) {
	randomAlpha.push(Math.floor(Math.random() * 360));
	randomBeta.push(Math.floor(Math.random() * 360));
	var randCols = randomCol();
	randomColorR.push(randCols[0]);
	randomColorG.push(randCols[1]);
	randomColorB.push(randCols[2]);
}

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

	uModelMatrix = gl.getUniformLocation(gl.program, "Mmatrix");
	uViewMatrix = gl.getUniformLocation(gl.program, "Vmatrix");
	uProjectionMatrix = gl.getUniformLocation(gl.program, "Pmatrix");

	if (!uModelMatrix || !uViewMatrix || !uProjectionMatrix) {
		console.log('Failed to get the storage location');
		return;
	}

	var gamescore = 0.0;
	result = "O";

	var frameCounter = 0;
	var tick = function () {

		if (result == "O") {
			document.getElementById("score").innerHTML = gamescore;
			gamescore = gamescore + 1;
		}

		currentSize = animate(currentSize);

		canvas.onmousedown = function (ev) { click(ev, gl, canvas, currentSize); };

		if (currentSize > 30 && randomAlpha.length > 1) {
			document.getElementById("result").innerHTML = "You Lose";
			result = "L"
		} else if (randomAlpha.length < 1) {
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
		draw(gl, modelMatrix, viewMatrix, projMatrix, n);

		for (var i = 0; i < 360; i += 36) {
			for (var j = 0; j < 360; j += 36) {
				var n = initVertexBuffers(gl, 3 + 0.001, 1, i, j, 1, 1, 1);
				draw(gl, modelMatrix, viewMatrix, projMatrix, n);
			}
		}

		var growth = Math.floor(currentSize);

		for (let i = 0; i < randomAlpha.length; i++) {
			var n = initVertexBuffers(gl, (3 + 0.002 * (i + 1)), growth, randomAlpha[i], randomBeta[i], randomColorR[i], randomColorG[i], randomColorB[i]);
			draw(gl, modelMatrix, viewMatrix, projMatrix, n);
		}

		frameCounter += 1;
		requestAnimationFrame(tick, canvas);
	};
	tick();
}

function mouseSetup(canvas) {
	var mouseDown = function (e) {
		isDragging = true;
		prevX = e.pageX, prevY = e.pageY;

		e.preventDefault();
		return false;
	};

	var mouseUp = function () {
		isDragging = false;
	};

	var mouseMove = function (e) {
		if (!isDragging) return false;
		diffX = (e.pageX - prevX) * 2 * Math.PI / canvas.width,
			diffY = (e.pageY - prevY) * 2 * Math.PI / canvas.height;
		THETA += diffX;
		PHI += diffY;
		prevX = e.pageX, prevY = e.pageY;
		e.preventDefault();
	};

	canvas.addEventListener("mousedown", mouseDown, false);
	canvas.addEventListener("mouseup", mouseUp, false);
	canvas.addEventListener("mouseout", mouseUp, false);
	canvas.addEventListener("mousemove", mouseMove, false);
}

var prevTime = Date.now();
function animate(size) {
	if (result == "L" || result == "W") return size;
	var now = Date.now();
	var elapsed = now - prevTime;
	prevTime = now;
	var newSize = size + (growthRate * elapsed) / 1000.0;
	return newSize;
}

function draw(gl, modelMatrix, viewMatrix, projMatrix, n) {
	gl.uniformMatrix4fv(uModelMatrix, false, modelMatrix);

	gl.uniformMatrix4fv(uViewMatrix, false, viewMatrix.elements);
	gl.uniformMatrix4fv(uProjectionMatrix, false, projMatrix.elements);

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

	for (let i = randomAlpha.length; i >= 0; i--) {
		r = randomColorR[i] * 255
		g = randomColorG[i] * 255
		b = randomColorB[i] * 255

		if (approximatelyEqual(pixels[0], r, 0.6) && approximatelyEqual(pixels[1], g, 0.6) && approximatelyEqual(pixels[2], b, 0.6)) {
			if (currentSize < 30) {
				randomAlpha.splice(i, 1);
				randomBeta.splice(i, 1);
				randomColorR.splice(i, 1);
				randomColorG.splice(i, 1);
				randomColorB.splice(i, 1);
			}
		}
	}
}

function randomCol(scale = 1) {
	const min = 0.03;
	const max = 0.98;
	let value;
	do {
		value = [Math.random() * scale, Math.random() * scale, Math.random() * scale];
	} while (value.some(val => val <= min || val >= max || val === 0.5));
	return value;
}
