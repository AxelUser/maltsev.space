precision mediump float;

varying vec3 vColor;

void main() {
	vec2 center = vec2(0.5, 0.5);
	float dist = distance(gl_PointCoord, center);

	if(dist > 0.5) {
		discard;
	}

	float alpha = smoothstep(0.5, 0.0, dist);
	gl_FragColor = vec4(vColor, alpha);
}