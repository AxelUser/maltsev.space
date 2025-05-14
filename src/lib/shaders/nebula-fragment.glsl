/**
 * @file nebula-fragment.glsl
 * @brief Generates a dynamic, multi-layered nebula effect.
 *
 * Mechanics:
 * 1.  Base UV coordinates are adjusted for aspect ratio.
 * 2.  Overall Nebula Shape:
 *     -   A low-frequency Fractional Brownian Motion (fbm) noise (`shapeNoise`) defines the
 *         nebula's general form and presence. It evolves slowly over time.
 *     -   This shape is sharpened using `smoothstep` to create more defined boundaries.
 * 3.  Turbulent Gas Flow:
 *     -   UV coordinates (`flow_uv`) are distorted by sinusoidal functions modulated by
 *         time (`u_time`), flow speed (`u_flowSpeed`), and noise scale (`u_noiseScale`).
 *     -   A `localChaosFactor`, derived from `random2` noise, introduces localized variations
 *         in turbulence strength, making the flow appear more chaotic and less uniform.
 * 4.  Detailed Gas Density:
 *     -   A higher-frequency fbm noise (`gasNoise`) is generated using the turbulent UVs.
 *         This creates the fine, wispy details of the gas clouds.
 * 5.  Void Generation:
 *     -   Another fbm noise (`voidNoiseRaw`) is used to define empty spaces or "voids"
 *         within the nebula.
 *     -   `voidCycle` animates these voids, making them appear to open and close over time,
 *         controlled by `u_voidCycleSpeed` and `u_voidDensity`.
 *     -   `voidRegion` is calculated using `smoothstep` to define the extent of these voids.
 * 6.  Combining Densities:
 *     -   `detailedDensity` is calculated by subtracting the `voidRegion` from the `gasNoise`,
 *         effectively carving out the voids from the detailed gas.
 *     -   `finalDensity` is obtained by multiplying `detailedDensity` with `shapeNoise`. This
 *         ensures that the detailed gas and voids only appear within the larger nebula form.
 * 7.  Coloring:
 *     -   The `finalDensity` is used to interpolate between dark gas color (`u_gasColorDark`),
 *         primary gas color (`u_gasColor1`), and highlight color (`u_gasColor2`) using `smoothstep`
 *         to create smooth color transitions.
 * 8.  Alpha and Edge Fading:
 *     -   The alpha value is determined by `finalDensity` using `smoothstep`, creating soft,
 *         gaseous edges where the density falls off.
 * 9.  Vignette with Rough Edges:
 *     -   A vignette effect darkens the edges of the canvas.
 *     -   The distance from the center (`dist_from_center`) is calculated.
 *     -   `vignette_edge_noise` (fbm) is added to this distance to create a rough, irregular
 *         edge for the vignette, making it look less artificial.
 *     -   The strength and falloff of the vignette are controlled by `u_vignetteStrength`.
 *     -   The final alpha is multiplied by this vignette factor.
 * 10. Output:
 *     -   The final color and alpha are outputted as `gl_FragColor`.
 */
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;

// Repurposed/New Props from component
uniform vec3 u_gasColor1;
uniform vec3 u_gasColor2;
uniform vec3 u_gasColorDark;
uniform float u_flowSpeed;
uniform float u_noiseScale;
uniform float u_voidScale;
uniform float u_voidDensity;
uniform float u_voidCycleSpeed;
uniform float u_vignetteStrength; // New uniform for vignette control

// Noise functions
vec2 random2(vec2 st) {
    st = vec2(dot(st, vec2(127.1, 311.7)), dot(st, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(st) * 43758.5453123);
}

float perlinNoise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    vec2 u = f * f * (3.0 - 2.0 * f); // Smoothstep
    float a = dot(random2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0));
    float b = dot(random2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0));
    float c = dot(random2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0));
    float d = dot(random2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    for(int i = 0; i < 6; i++) {
        value += amplitude * perlinNoise(st);
        st *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    float aspectRatio = u_resolution.x / u_resolution.y;

    vec2 shape_uv = st;
    if(aspectRatio > 1.0) {
        shape_uv.x = (shape_uv.x - 0.5) * aspectRatio + 0.5;
    } else {
        shape_uv.y = (shape_uv.y - 0.5) / aspectRatio + 0.5;
    }

    // Larger scale noise for overall nebula shape/presence
    // Uses a very slow time component for a subtly evolving main shape.
    float shapeNoise = fbm(shape_uv * 0.9 + u_time * 0.01);
    shapeNoise = (shapeNoise + 1.0) * 0.5; // Remap to 0-1
    // Make the general shape more defined, concentrated towards the center of the noise
    shapeNoise = smoothstep(0.38, 0.62, shapeNoise); // Adjusted thresholds for more coverage

    vec2 flow_uv = st; 
    // Apply flow: u_flowSpeed controls magnitude, vec2 defines base direction.
    // flow_uv += u_time * u_flowSpeed * vec2(0.07, 0.025); // Increased base flow vector

    // Main gas density (detailed noise) - with added local turbulence for more transformation
    vec2 turbulent_flow_uv = flow_uv;
    float turbulenceEffectSpeedX = u_flowSpeed * 0.75;
    float turbulenceEffectSpeedY = u_flowSpeed * 0.65;
    float turbulenceDistortionScaleX = u_noiseScale * 1.7;
    float turbulenceDistortionScaleY = u_noiseScale * 1.3;
    float baseTurbulenceMagnitude = 0.05; // Base magnitude, slightly increased

    // Modulate turbulence strength locally for more chaos
    float localChaosFactor = (random2(floor(flow_uv * 5.5)).x + 1.0) * 0.5; // range 0-1
    localChaosFactor = 0.7 + localChaosFactor * 0.6; // Varies from 0.7 to 1.3

    turbulent_flow_uv.x += sin(u_time * turbulenceEffectSpeedX + flow_uv.y * turbulenceDistortionScaleX) * baseTurbulenceMagnitude * localChaosFactor;
    turbulent_flow_uv.y += cos(u_time * turbulenceEffectSpeedY + flow_uv.x * turbulenceDistortionScaleY + 0.5) * baseTurbulenceMagnitude * localChaosFactor; // Added small phase shift to Y

    float gasNoise = fbm(turbulent_flow_uv * u_noiseScale);
    gasNoise = (gasNoise + 1.0) * 0.5; // Remap to 0-1

    // Voids (blank spots) - they flow with the gas
    float voidNoiseRaw = fbm(flow_uv * u_voidScale); // Use the same flowing uv
    float voidNoise = (voidNoiseRaw + 1.0) * 0.5; // Remap to 0-1

    float voidCycle = (sin(u_time * u_voidCycleSpeed + voidNoiseRaw * 3.0) + 1.0) * 0.5;
    float voidRegion = smoothstep(0.6, 0.6 + u_voidDensity, voidNoise * voidCycle);
    voidRegion = clamp(voidRegion, 0.0, 1.0);

    // Combine gas and voids to get detailed structure
    float detailedDensity = gasNoise * (1.0 - voidRegion * 0.95);
    detailedDensity = clamp(detailedDensity, 0.0, 1.0);

    // Modulate detailed density by the overall shape noise
    // This makes the detailed gas appear only within the larger nebula form
    float finalDensity = detailedDensity * shapeNoise;

    // Coloring the gas
    vec3 color = mix(u_gasColorDark, u_gasColor1, smoothstep(0.0, 0.5, finalDensity));
    color = mix(color, u_gasColor2, smoothstep(0.4, 0.8, finalDensity)); 

    // Alpha for gaseous look with rough edges based on finalDensity
    // The smoothstep here creates the fading at the edges of the noise.
    // The range (e.g., 0.01 to 0.5) controls how soft or sharp the falloff is.
    // A lower first value means more of the faint details become visible.
    float alpha = smoothstep(0.15, 0.6, finalDensity); 
    // The geometric vignette is now removed. Edges are defined by noise.

    // New Vignette effect controlled by u_vignetteStrength
    vec2 centered_st = st - 0.5;

    // Removed explicit aspect ratio correction for vignette distance to make it oval
    float dist_from_center = length(centered_st);

    // --- Rough Edges for Vignette ---
    float edge_noise_scale = 15.0; // Controls the detail level of the roughness
    float edge_noise_strength = 0.07; // Controls how much the noise displaces the vignette edge
    float vignette_edge_noise = fbm(st * edge_noise_scale + u_time * 0.03); // Slowly evolving, screen-aligned noise
    float noisy_dist_from_center = dist_from_center + vignette_edge_noise * edge_noise_strength;
    // --- End Rough Edges ---

    // Adjust vignette falloff based on u_vignetteStrength. 
    // dist_from_center ranges from 0 (center) up to 0.5 (mid-edge) or ~0.707 (corner)
    float vignetteStart = 0.1 + u_vignetteStrength * 0.3; // Max start is 0.4 (closer to mid-edge)
    float vignetteEnd = vignetteStart + 0.2; // Max end is 0.6, ensuring fade covers edges

    float vignette = 1.0 - smoothstep(vignetteStart, vignetteEnd, noisy_dist_from_center); // Use noisy distance

    alpha *= vignette;

    gl_FragColor = vec4(color, alpha);
}