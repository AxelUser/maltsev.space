<script lang="ts">
	import { onMount } from 'svelte';
	import { createShader } from '$lib/shaders/utils';

	import vertexShaderSource from '$lib/shaders/stars-vertex.glsl?raw';
	import fragmentShaderSource from '$lib/shaders/stars-fragment.glsl?raw';

	interface Props {
		height?: number;
		speedMultiplier?: number;
	}

	const { height = 300, speedMultiplier = 500.0 }: Props = $props();
	const maxStars = 200;

	let canvas: HTMLCanvasElement;
	let gl: WebGLRenderingContext;
	let program: WebGLProgram;
	let animationId: number;
	let starCount: number;
	let startTime: number;
	let starPositions: Float32Array;
	let starSizes: Float32Array;
	let starSpeeds: Float32Array;
	let starColors: Float32Array;

	let innerWidth = $state(0);

	function createProgram(
		gl: WebGLRenderingContext,
		vertexShader: WebGLShader,
		fragmentShader: WebGLShader
	): WebGLProgram {
		const program = gl.createProgram()!;
		gl.attachShader(program, vertexShader);
		gl.attachShader(program, fragmentShader);
		gl.linkProgram(program);

		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			console.error('Program linking error:', gl.getProgramInfoLog(program));
			gl.deleteProgram(program);
			throw new Error('Program linking failed');
		}

		return program;
	}

	function initWebGL() {
		gl = canvas.getContext('webgl', {
			alpha: true,
			antialias: true,
			preserveDrawingBuffer: false
		}) as WebGLRenderingContext;

		if (!gl) {
			console.error('WebGL not supported');
			return false;
		}

		const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
		const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

		program = createProgram(gl, vertexShader, fragmentShader);
		gl.useProgram(program);

		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		return true;
	}

	function initStars() {
		starCount = Math.min(Math.floor(canvas.width / 4), maxStars);

		starPositions = new Float32Array(starCount * 2);
		starSizes = new Float32Array(starCount);
		starSpeeds = new Float32Array(starCount);
		starColors = new Float32Array(starCount * 3);

		for (let i = 0; i < starCount; i++) {
			starPositions[i * 2] = Math.random() * canvas.width;
			starPositions[i * 2 + 1] = Math.random() * canvas.height;
			starSizes[i] = Math.random() * 2.5 + 1.0;
			starSpeeds[i] = Math.random() * 0.3 + 0.05;

			const brightness = 0.7 + Math.random() * 0.3;
			starColors[i * 3] = brightness - Math.random() * 0.3; // Red
			starColors[i * 3 + 1] = brightness - Math.random() * 0.3; // Green
			starColors[i * 3 + 2] = brightness; // Blue (keeping blue strong for a cooler look)
		}

		const positionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, starPositions, gl.STATIC_DRAW);

		const positionLocation = gl.getAttribLocation(program, 'position');
		gl.enableVertexAttribArray(positionLocation);
		gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

		const sizeBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, starSizes, gl.STATIC_DRAW);

		const sizeLocation = gl.getAttribLocation(program, 'size');
		gl.enableVertexAttribArray(sizeLocation);
		gl.vertexAttribPointer(sizeLocation, 1, gl.FLOAT, false, 0, 0);

		const speedBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, speedBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, starSpeeds, gl.STATIC_DRAW);

		const speedLocation = gl.getAttribLocation(program, 'speed');
		gl.enableVertexAttribArray(speedLocation);
		gl.vertexAttribPointer(speedLocation, 1, gl.FLOAT, false, 0, 0);

		const colorBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, starColors, gl.STATIC_DRAW);

		const colorLocation = gl.getAttribLocation(program, 'color');
		gl.enableVertexAttribArray(colorLocation);
		gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

		const resolutionLocation = gl.getUniformLocation(program, 'resolution');
		gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

		const speedMultiplierLocation = gl.getUniformLocation(program, 'speedMultiplier');
		gl.uniform1f(speedMultiplierLocation, speedMultiplier);

		startTime = performance.now() / 1000;
	}

	function animate(timestamp: number) {
		gl.clearColor(0, 0, 0, 0);
		gl.clear(gl.COLOR_BUFFER_BIT);

		const currentTime = timestamp / 1000;
		const timeElapsed = currentTime - startTime;
		const timeLocation = gl.getUniformLocation(program, 'time');
		gl.uniform1f(timeLocation, timeElapsed);

		const speedMultiplierLocation = gl.getUniformLocation(program, 'speedMultiplier');
		gl.uniform1f(speedMultiplierLocation, speedMultiplier);

		gl.drawArrays(gl.POINTS, 0, starCount);

		animationId = requestAnimationFrame(animate);
	}

	const resize = () => {
		canvas.width = innerWidth;
		canvas.height = height;

		if (initWebGL()) {
			initStars();

			gl.viewport(0, 0, canvas.width, canvas.height);

			const resolutionLocation = gl.getUniformLocation(program, 'resolution');
			gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
		}
	};

	onMount(() => {
		if (canvas) {
			resize();

			if (gl) {
				startTime = performance.now() / 1000;
				animate(startTime * 1000);
			}

			return () => {
				cancelAnimationFrame(animationId);
			};
		}
	});
</script>

<svelte:window bind:innerWidth onresize={resize} />

<canvas bind:this={canvas} class="floating-stars-canvas" style="height: {height}px;"></canvas>

<style>
	.floating-stars-canvas {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		z-index: -1;
	}
</style>
