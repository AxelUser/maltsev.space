<script lang="ts">
	import { onMount } from 'svelte';
	import vertexShaderSource from '$lib/shaders/nebula-vertex.glsl?raw';
	import fragmentShaderSource from '$lib/shaders/nebula-fragment.glsl?raw';
	import { createShader, createProgram } from '$lib/shaders/utils';

	interface Props {
		gasColor1?: [number, number, number];
		gasColor2?: [number, number, number];
		gasColorDark?: [number, number, number];
		flowSpeed?: number;
		noiseScale?: number;
		voidScale?: number;
		voidDensity?: number;
		voidCycleSpeed?: number;
		vignetteStrength?: number;
	}

	const {
		gasColor1 = [0.1, 0.3, 0.7], // Cool Blue
		gasColor2 = [0.3, 0.6, 0.9], // Lighter Blue/Cyan highlight
		gasColorDark = [0.01, 0.02, 0.05], // Very Dark Blue
		flowSpeed = 1.5,
		noiseScale = 2.5,
		voidScale = 4.0,
		voidDensity = 0.4, // 0 to 1, controls how "strong" or "carved out" voids are
		voidCycleSpeed = 0.6,
		vignetteStrength = 0.65 // 0 (strong vignette) to 1 (weak vignette/edges visible)
	}: Props = $props();

	let canvas: HTMLCanvasElement;
	let gl = $state<WebGLRenderingContext | null>(null);
	let program = $state<WebGLProgram | null>(null);

	let positionBuffer = $state<WebGLBuffer | null>(null);
	let positionAttributeLocation = $state(-1);
	let resolutionUniformLocation = $state<WebGLUniformLocation | null>(null);
	let timeUniformLocation = $state<WebGLUniformLocation | null>(null);

	// Uniform locations for new props
	let gasColor1UniformLocation = $state<WebGLUniformLocation | null>(null);
	let gasColor2UniformLocation = $state<WebGLUniformLocation | null>(null);
	let gasColorDarkUniformLocation = $state<WebGLUniformLocation | null>(null);
	let flowSpeedUniformLocation = $state<WebGLUniformLocation | null>(null);
	let noiseScaleUniformLocation = $state<WebGLUniformLocation | null>(null);
	let voidScaleUniformLocation = $state<WebGLUniformLocation | null>(null);
	let voidDensityUniformLocation = $state<WebGLUniformLocation | null>(null);
	let voidCycleSpeedUniformLocation = $state<WebGLUniformLocation | null>(null);
	let vignetteStrengthUniformLocation = $state<WebGLUniformLocation | null>(null);

	let animationFrameId = $state<number>(0);
	let startTime = $state(0);
	let isInitialized = $state(false);

	$effect(() => {
		if (isInitialized && gl && program && gasColor1UniformLocation) {
			gl.useProgram(program);
			gl.uniform3fv(gasColor1UniformLocation, gasColor1);
		}
	});

	$effect(() => {
		if (isInitialized && gl && program && gasColor2UniformLocation) {
			gl.useProgram(program);
			gl.uniform3fv(gasColor2UniformLocation, gasColor2);
		}
	});

	$effect(() => {
		if (isInitialized && gl && program && gasColorDarkUniformLocation) {
			gl.useProgram(program);
			gl.uniform3fv(gasColorDarkUniformLocation, gasColorDark);
		}
	});

	$effect(() => {
		if (isInitialized && gl && program && flowSpeedUniformLocation) {
			gl.useProgram(program);
			gl.uniform1f(flowSpeedUniformLocation, flowSpeed);
		}
	});

	$effect(() => {
		if (isInitialized && gl && program && noiseScaleUniformLocation) {
			gl.useProgram(program);
			gl.uniform1f(noiseScaleUniformLocation, noiseScale);
		}
	});

	$effect(() => {
		if (isInitialized && gl && program && voidScaleUniformLocation) {
			gl.useProgram(program);
			gl.uniform1f(voidScaleUniformLocation, voidScale);
		}
	});

	$effect(() => {
		if (isInitialized && gl && program && voidDensityUniformLocation) {
			gl.useProgram(program);
			gl.uniform1f(voidDensityUniformLocation, voidDensity);
		}
	});

	$effect(() => {
		if (isInitialized && gl && program && voidCycleSpeedUniformLocation) {
			gl.useProgram(program);
			gl.uniform1f(voidCycleSpeedUniformLocation, voidCycleSpeed);
		}
	});

	$effect(() => {
		if (isInitialized && gl && program && vignetteStrengthUniformLocation) {
			gl.useProgram(program);
			gl.uniform1f(vignetteStrengthUniformLocation, vignetteStrength);
		}
	});

	function initWebGL() {
		if (!canvas) return false;
		gl = canvas.getContext('webgl', { preserveDrawingBuffer: false, antialias: true });
		if (!gl) {
			console.error('WebGL not supported or context creation failed.');
			return false;
		}

		try {
			const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
			const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
			program = createProgram(gl, vertexShader, fragmentShader);
		} catch (error) {
			console.error('Failed to initialize WebGL program:', error);
			gl = null; // Invalidate context if program creation failed
			return false;
		}

		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		return true;
	}

	function initNebula() {
		if (!gl || !program) return false;

		positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
		resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');
		timeUniformLocation = gl.getUniformLocation(program, 'u_time');

		// Get locations for new uniforms
		gasColor1UniformLocation = gl.getUniformLocation(program, 'u_gasColor1');
		gasColor2UniformLocation = gl.getUniformLocation(program, 'u_gasColor2');
		gasColorDarkUniformLocation = gl.getUniformLocation(program, 'u_gasColorDark');
		flowSpeedUniformLocation = gl.getUniformLocation(program, 'u_flowSpeed');
		noiseScaleUniformLocation = gl.getUniformLocation(program, 'u_noiseScale');
		voidScaleUniformLocation = gl.getUniformLocation(program, 'u_voidScale');
		voidDensityUniformLocation = gl.getUniformLocation(program, 'u_voidDensity');
		voidCycleSpeedUniformLocation = gl.getUniformLocation(program, 'u_voidCycleSpeed');
		vignetteStrengthUniformLocation = gl.getUniformLocation(program, 'u_vignetteStrength');

		if (
			positionAttributeLocation === -1 ||
			!resolutionUniformLocation ||
			!timeUniformLocation ||
			!gasColor1UniformLocation ||
			!gasColor2UniformLocation ||
			!gasColorDarkUniformLocation ||
			!flowSpeedUniformLocation ||
			!noiseScaleUniformLocation ||
			!voidScaleUniformLocation ||
			!voidDensityUniformLocation ||
			!voidCycleSpeedUniformLocation ||
			!vignetteStrengthUniformLocation
		) {
			console.error('Failed to get some shader variable locations.');
			return false;
		}

		positionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		const positions = [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1];
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

		return true;
	}

	function renderNebula(time: number) {
		if (!gl || !program || !isInitialized) {
			animationFrameId = requestAnimationFrame(renderNebula);
			return;
		}

		const now = time * 0.001;
		if (startTime === 0) startTime = now;
		const elapsedTime = now - startTime;

		gl.clearColor(0, 0, 0, 0);
		gl.clear(gl.COLOR_BUFFER_BIT);

		gl.useProgram(program);

		gl.enableVertexAttribArray(positionAttributeLocation);
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

		// u_resolution is updated in resize()
		gl.uniform1f(timeUniformLocation, elapsedTime);

		gl.drawArrays(gl.TRIANGLES, 0, 6);

		animationFrameId = requestAnimationFrame(renderNebula);
	}

	function resize() {
		if (!canvas) return;

		const displayWidth = canvas.clientWidth;
		const displayHeight = canvas.clientHeight;

		if (canvas.width !== displayWidth || canvas.height !== displayHeight || !isInitialized) {
			canvas.width = displayWidth;
			canvas.height = displayHeight;

			if (!gl || gl.isContextLost()) {
				if (!initWebGL()) {
					isInitialized = false;
					return;
				}
			}
			// gl is guaranteed to be non-null here if initWebGL succeeded or was already valid
			if (!isInitialized) {
				// Only run initNebula if it's the first time or after context loss
				if (!initNebula()) {
					isInitialized = false;
					return;
				}
			}
			isInitialized = true;

			if (gl && program) {
				// Ensure gl and program are valid before using them
				gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
				gl.useProgram(program); // Important to use program before setting uniforms
				if (resolutionUniformLocation) {
					gl.uniform2f(resolutionUniformLocation, gl.drawingBufferWidth, gl.drawingBufferHeight);
				}
				// Set new uniforms (initial values on resize/init)
				if (gasColor1UniformLocation) gl.uniform3fv(gasColor1UniformLocation, gasColor1);
				if (gasColor2UniformLocation) gl.uniform3fv(gasColor2UniformLocation, gasColor2);
				if (gasColorDarkUniformLocation) gl.uniform3fv(gasColorDarkUniformLocation, gasColorDark);
				if (flowSpeedUniformLocation) gl.uniform1f(flowSpeedUniformLocation, flowSpeed);
				if (noiseScaleUniformLocation) gl.uniform1f(noiseScaleUniformLocation, noiseScale);
				if (voidScaleUniformLocation) gl.uniform1f(voidScaleUniformLocation, voidScale);
				if (voidDensityUniformLocation) gl.uniform1f(voidDensityUniformLocation, voidDensity);
				if (voidCycleSpeedUniformLocation)
					gl.uniform1f(voidCycleSpeedUniformLocation, voidCycleSpeed);
				if (vignetteStrengthUniformLocation)
					gl.uniform1f(vignetteStrengthUniformLocation, vignetteStrength);
			}
		}
	}

	onMount(() => {
		resize(); // Initial setup of canvas size, WebGL, and Nebula uniforms
		animationFrameId = requestAnimationFrame(renderNebula);

		return () => {
			cancelAnimationFrame(animationFrameId);
			isInitialized = false;

			const currentGl = gl;
			const currentProgram = program;
			const currentPositionBuffer = positionBuffer;

			if (currentGl) {
				if (currentPositionBuffer) {
					currentGl.deleteBuffer(currentPositionBuffer);
				}
				if (currentProgram) {
					const shaders = currentGl.getAttachedShaders(currentProgram);
					shaders?.forEach((shader) => {
						currentGl.detachShader(currentProgram, shader);
						currentGl.deleteShader(shader);
					});
					currentGl.deleteProgram(currentProgram);
				}
				const loseContextExt = currentGl.getExtension('WEBGL_lose_context');
				if (loseContextExt) {
					loseContextExt.loseContext();
				}
			}
			gl = null;
			program = null;
			positionBuffer = null;
		};
	});
</script>

<svelte:window onresize={resize} />
<canvas
	bind:this={canvas}
	style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: block; z-index: 0;"
></canvas>
