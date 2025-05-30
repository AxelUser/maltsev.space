import vertexShaderSource from '$lib/shaders/nebula-vertex.glsl?raw';
import fragmentShaderSource from '$lib/shaders/nebula-fragment.glsl?raw';
import { createShader, createProgram } from '$lib/shaders/utils';

interface NebulaUniforms {
	gasColor1: [number, number, number];
	gasColor2: [number, number, number];
	gasColorDark: [number, number, number];
	flowSpeed: number;
	noiseScale: number;
	voidScale: number;
	voidDensity: number;
	voidCycleSpeed: number;
	vignetteStrength: number;
}

interface WebGLContext {
	gl: WebGLRenderingContext;
	program: WebGLProgram;
	positionBuffer: WebGLBuffer;
	positionAttributeLocation: number;
	uniformLocations: {
		resolution: WebGLUniformLocation;
		time: WebGLUniformLocation;
		gasColor1: WebGLUniformLocation;
		gasColor2: WebGLUniformLocation;
		gasColorDark: WebGLUniformLocation;
		flowSpeed: WebGLUniformLocation;
		noiseScale: WebGLUniformLocation;
		voidScale: WebGLUniformLocation;
		voidDensity: WebGLUniformLocation;
		voidCycleSpeed: WebGLUniformLocation;
		vignetteStrength: WebGLUniformLocation;
	};
}

export function createNebulaRenderer() {
	let canvas = $state<HTMLCanvasElement | null>(null);
	let context = $state<WebGLContext | null>(null);
	let animationFrameId = $state<number>(0);
	let startTime = $state<number>(0);
	let isInitialized = $state<boolean>(false);

	function initWebGL(): WebGLContext | null {
		if (!canvas) return null;

		const gl = canvas.getContext('webgl', { preserveDrawingBuffer: false, antialias: true });
		if (!gl) {
			console.error('WebGL not supported or context creation failed.');
			return null;
		}

		try {
			const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
			const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
			const program = createProgram(gl, vertexShader, fragmentShader);

			gl.enable(gl.BLEND);
			gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

			const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
			const uniformLocations = {
				resolution: gl.getUniformLocation(program, 'u_resolution')!,
				time: gl.getUniformLocation(program, 'u_time')!,
				gasColor1: gl.getUniformLocation(program, 'u_gasColor1')!,
				gasColor2: gl.getUniformLocation(program, 'u_gasColor2')!,
				gasColorDark: gl.getUniformLocation(program, 'u_gasColorDark')!,
				flowSpeed: gl.getUniformLocation(program, 'u_flowSpeed')!,
				noiseScale: gl.getUniformLocation(program, 'u_noiseScale')!,
				voidScale: gl.getUniformLocation(program, 'u_voidScale')!,
				voidDensity: gl.getUniformLocation(program, 'u_voidDensity')!,
				voidCycleSpeed: gl.getUniformLocation(program, 'u_voidCycleSpeed')!,
				vignetteStrength: gl.getUniformLocation(program, 'u_vignetteStrength')!
			};

			if (positionAttributeLocation === -1 || Object.values(uniformLocations).some((loc) => !loc)) {
				console.error('Failed to get some shader variable locations.');
				return null;
			}

			const positionBuffer = gl.createBuffer();
			if (!positionBuffer) {
				console.error('Failed to create position buffer.');
				return null;
			}

			gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
			const positions = [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1];
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

			return {
				gl,
				program,
				positionBuffer,
				positionAttributeLocation,
				uniformLocations
			};
		} catch (error) {
			console.error('Failed to initialize WebGL program:', error);
			return null;
		}
	}

	function updateUniforms(uniforms: NebulaUniforms) {
		if (!context) return;

		const { gl, program, uniformLocations } = context;
		gl.useProgram(program);

		gl.uniform3fv(uniformLocations.gasColor1, uniforms.gasColor1);
		gl.uniform3fv(uniformLocations.gasColor2, uniforms.gasColor2);
		gl.uniform3fv(uniformLocations.gasColorDark, uniforms.gasColorDark);
		gl.uniform1f(uniformLocations.flowSpeed, uniforms.flowSpeed);
		gl.uniform1f(uniformLocations.noiseScale, uniforms.noiseScale);
		gl.uniform1f(uniformLocations.voidScale, uniforms.voidScale);
		gl.uniform1f(uniformLocations.voidDensity, uniforms.voidDensity);
		gl.uniform1f(uniformLocations.voidCycleSpeed, uniforms.voidCycleSpeed);
		gl.uniform1f(uniformLocations.vignetteStrength, uniforms.vignetteStrength);
	}

	function render(time: number) {
		if (!context) {
			animationFrameId = requestAnimationFrame(render);
			return;
		}

		const { gl, program, positionBuffer, positionAttributeLocation, uniformLocations } = context;
		const now = time * 0.001;
		if (startTime === 0) startTime = now;
		const elapsedTime = now - startTime;

		gl.clearColor(0, 0, 0, 0);
		gl.clear(gl.COLOR_BUFFER_BIT);

		gl.useProgram(program);

		gl.enableVertexAttribArray(positionAttributeLocation);
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

		gl.uniform1f(uniformLocations.time, elapsedTime);
		gl.drawArrays(gl.TRIANGLES, 0, 6);

		animationFrameId = requestAnimationFrame(render);
	}

	function resize() {
		if (!canvas) return;

		const displayWidth = canvas.clientWidth;
		const displayHeight = canvas.clientHeight;

		if (canvas.width !== displayWidth || canvas.height !== displayHeight || !isInitialized) {
			canvas.width = displayWidth;
			canvas.height = displayHeight;

			if (!context || context.gl.isContextLost()) {
				context = initWebGL();
				if (!context) {
					isInitialized = false;
					return;
				}
			}

			isInitialized = true;
			const { gl, program, uniformLocations } = context;

			gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
			gl.useProgram(program);
			gl.uniform2f(uniformLocations.resolution, gl.drawingBufferWidth, gl.drawingBufferHeight);
		}
	}

	function cleanup() {
		cancelAnimationFrame(animationFrameId);
		isInitialized = false;

		if (context) {
			const { gl, program, positionBuffer } = context;

			if (positionBuffer) {
				gl.deleteBuffer(positionBuffer);
			}

			const shaders = gl.getAttachedShaders(program);
			shaders?.forEach((shader) => {
				gl.detachShader(program, shader);
				gl.deleteShader(shader);
			});
			gl.deleteProgram(program);

			const loseContextExt = gl.getExtension('WEBGL_lose_context');
			if (loseContextExt) {
				loseContextExt.loseContext();
			}
		}

		context = null;
	}

	function startRendering() {
		animationFrameId = requestAnimationFrame(render);
	}

	return {
		get canvas() {
			return canvas;
		},
		set canvas(value) {
			canvas = value;
		},
		get isInitialized() {
			return isInitialized;
		},
		updateUniforms,
		resize,
		cleanup,
		startRendering
	};
}
