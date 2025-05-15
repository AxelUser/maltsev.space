/**
 * Creates and compiles a WebGL shader.
 */
export function createShader(
	gl: WebGLRenderingContext,
	type: WebGLRenderingContext['VERTEX_SHADER'] | WebGLRenderingContext['FRAGMENT_SHADER'],
	source: string
): WebGLShader {
	const shader = gl.createShader(type)!;
	gl.shaderSource(shader, source);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
		throw new Error('Shader compilation failed');
	}

	return shader;
}

export function createProgram(
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
