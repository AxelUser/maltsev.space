attribute vec2 position;
attribute float size;
attribute float speed;
attribute vec3 color;

uniform float time;
uniform vec2 resolution;
uniform float speedMultiplier;

varying float vSize;
varying vec3 vColor;

void main() {
	float xOffset = sin(position.y * 0.01 + time * 0.5) * 20.0;
	float yOffset = cos(position.x * 0.01 + time * 0.3) * 10.0;
	
	float x = mod(position.x - (speed * time * speedMultiplier) + xOffset, resolution.x);
	float y = mod(position.y + yOffset, resolution.y);
	
	vec2 pos = vec2(x, y);
	
	vec2 zeroToOne = pos / resolution;
	vec2 zeroToTwo = zeroToOne * 2.0;
	vec2 clipSpace = zeroToTwo - 1.0;
	
	float sizePulse = sin(time * 2.0 + position.x * 0.1) * 0.2 + 1.0;
	
	gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
	gl_PointSize = size * sizePulse * 2.0;
	vSize = size * sizePulse;
	vColor = color;
} 