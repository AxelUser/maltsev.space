import{e as we,a as n,t as b,s as X,b as C,i as Ce}from"../chunks/Bd1eUZv1.js";import{i as me}from"../chunks/BXHWvYr9.js";import{h as xe,d as Pe,p as ae,f as K,b as ke,a as ne,c as u,r as v,s as a,t as Z,n as _,g as c,D as J,E as G,w as he,ad as Ae,au as Te,a1 as pe}from"../chunks/DMdOKcQ-.js";import{c as De,r as Ie,p as I,i as re,b as Le}from"../chunks/yPNQ-H0b.js";import{I as Ne,a as Re,e as Ue,i as Ee}from"../chunks/8r4m7sgN.js";import{b as W}from"../chunks/B1Lznyga.js";import{C as O}from"../chunks/9g-fVF35.js";import{B as U}from"../chunks/DWbSCrA3.js";import{L as E}from"../chunks/X7pQSJ5f.js";import{S as Fe}from"../chunks/Cco9vZIB.js";import{T as Me}from"../chunks/_AWG_ZX4.js";function _e(s,o,g,l,x){var A;xe&&Pe();var k=(A=o.$$slots)==null?void 0:A[g],w=!1;k===!0&&(k=o.children,w=!0),k===void 0||k(s,w?()=>l:l)}function Be(s,o){ae(o,!0);let g=Ie(o,["$$slots","$$events","$$legacy"]);Ne(s,De({name:"external-link"},()=>g,{iconNode:[["path",{d:"M15 3h6v6"}],["path",{d:"M10 14 21 3"}],["path",{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"}]],children:(x,k)=>{var w=we(),A=K(w);Re(A,()=>o.children??ke),n(x,w)},$$slots:{default:!0}})),ne()}var ze=b('<div class="timeline svelte-19j4pht"><!></div>');function Ve(s,o){var g=ze(),l=u(g);_e(l,o,"default",{}),v(g),n(s,g)}var je=b('<div class="timeline-date svelte-qplifw"> </div>'),Ge=b(" <!>",1),qe=b('<h3 class="section-title svelte-qplifw"><!></h3>'),He=b('<h3 class="section-title svelte-qplifw"> </h3>'),Oe=b('<div class="badge-container svelte-qplifw"></div>'),Ke=b('<div class="timeline-item svelte-qplifw"><div class="timeline-dot svelte-qplifw"></div> <div class="timeline-content svelte-qplifw"><!> <!> <!> <!></div></div>');function Y(s,o){ae(o,!1);let g=I(o,"date",8,void 0),l=I(o,"technologies",24,()=>[]),x=I(o,"title",8),k=I(o,"companyUrl",8,void 0);me();var w=Ke(),A=a(u(w),2),B=u(A);{var z=$=>{var h=je(),T=u(h,!0);v(h),Z(()=>X(T,g())),n($,h)};re(B,$=>{g()&&$(z)})}var V=a(B,2);{var e=$=>{var h=qe(),T=u(h);E(T,{get href(){return k()},external:!0,class:"company-link",children:(q,ee)=>{_();var Q=Ge(),H=K(Q),te=a(H);Be(te,{size:16,class:"external-link-icon"}),Z(()=>X(H,`${x()??""} `)),n(q,Q)},$$slots:{default:!0}}),v(h),n($,h)},t=$=>{var h=He(),T=u(h,!0);v(h),Z(()=>X(T,x())),n($,h)};re(V,$=>{k()?$(e):$(t,!1)})}var f=a(V,2);_e(f,o,"default",{});var r=a(f,2);{var S=$=>{var h=Oe();Ue(h,5,l,Ee,(T,q)=>{U(T,{children:(ee,Q)=>{_();var H=C();Z(()=>X(H,c(q))),n(ee,H)},$$slots:{default:!0}})}),v(h),n($,h)};re(r,$=>{l().length>0&&$(S)})}v(A),v(w),n(s,w),ne()}const Qe=`attribute vec2 a_position;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
} `,We=`/**
 * Generates a dynamic, multi-layered nebula effect.
 *
 * Mechanics:
 * 1.  Base UV coordinates are adjusted for aspect ratio.
 * 2.  Overall Nebula Shape:
 *     -   A low-frequency Fractional Brownian Motion (fbm) noise (\`shapeNoise\`) defines the
 *         nebula's general form and presence. It evolves slowly over time.
 *     -   This shape is sharpened using \`smoothstep\` to create more defined boundaries.
 * 3.  Turbulent Gas Flow:
 *     -   UV coordinates (\`flow_uv\`) are distorted by sinusoidal functions modulated by
 *         time (\`u_time\`), flow speed (\`u_flowSpeed\`), and noise scale (\`u_noiseScale\`).
 *     -   A \`localChaosFactor\`, derived from \`random2\` noise, introduces localized variations
 *         in turbulence strength, making the flow appear more chaotic and less uniform.
 * 4.  Detailed Gas Density:
 *     -   A higher-frequency fbm noise (\`gasNoise\`) is generated using the turbulent UVs.
 *         This creates the fine, wispy details of the gas clouds.
 * 5.  Void Generation:
 *     -   Another fbm noise (\`voidNoiseRaw\`) is used to define empty spaces or "voids"
 *         within the nebula.
 *     -   \`voidCycle\` animates these voids, making them appear to open and close over time,
 *         controlled by \`u_voidCycleSpeed\` and \`u_voidDensity\`.
 *     -   \`voidRegion\` is calculated using \`smoothstep\` to define the extent of these voids.
 * 6.  Combining Densities:
 *     -   \`detailedDensity\` is calculated by subtracting the \`voidRegion\` from the \`gasNoise\`,
 *         effectively carving out the voids from the detailed gas.
 *     -   \`finalDensity\` is obtained by multiplying \`detailedDensity\` with \`shapeNoise\`. This
 *         ensures that the detailed gas and voids only appear within the larger nebula form.
 * 7.  Coloring:
 *     -   The \`finalDensity\` is used to interpolate between dark gas color (\`u_gasColorDark\`),
 *         primary gas color (\`u_gasColor1\`), and highlight color (\`u_gasColor2\`) using \`smoothstep\`
 *         to create smooth color transitions.
 * 8.  Alpha and Edge Fading:
 *     -   The alpha value is determined by \`finalDensity\` using \`smoothstep\`, creating soft,
 *         gaseous edges where the density falls off.
 * 9.  Vignette:
 *     -   A vignette effect darkens the edges of the canvas.
 *     -   The distance from the center (\`dist_from_center\`) is calculated.
 *     -   The strength and falloff of the vignette are controlled by \`u_vignetteStrength\`.
 *     -   The final alpha is multiplied by this vignette factor.
 * 10. Output:
 *     -   The final color and alpha are outputted as \`gl_FragColor\`.
 */
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;

// Props from component
uniform vec3 u_gasColor1;
uniform vec3 u_gasColor2;
uniform vec3 u_gasColorDark;
uniform float u_flowSpeed;
uniform float u_noiseScale;
uniform float u_voidScale;
uniform float u_voidDensity;
uniform float u_voidCycleSpeed;
uniform float u_vignetteStrength;

// Noise functions

// 2D vector with random values between -1.0 and 1.0
vec2 random2(vec2 st) {
    st = vec2(dot(st, vec2(127.1, 311.7)), dot(st, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(st) * 43758.5453123);
}

// https://en.wikipedia.org/wiki/Perlin_noise
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

// Fractional Brownian Motion (fbm) - https://thebookofshaders.com/13/
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
    vec2 st = gl_FragCoord.xy / u_resolution.xy; // Normalized pixel coordinates (0.0 to 1.0)
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

    // Main gas density (detailed noise) - with added local turbulence for more transformation
    vec2 turbulent_flow_uv = flow_uv;
    float turbulenceEffectSpeed = u_flowSpeed * 0.7;
    float turbulenceDistortionScale = u_noiseScale * 1.5;
    float baseTurbulenceMagnitude = 0.05;

    // Modulate turbulence strength locally for more chaos
    float localChaosFactor = 0.7 + ((random2(floor(flow_uv * 5.5)).x + 1.0) * 0.5) * 0.6; // Varies from 0.7 to 1.3

    turbulent_flow_uv.x += sin(u_time * turbulenceEffectSpeed + flow_uv.y * turbulenceDistortionScale) * baseTurbulenceMagnitude * localChaosFactor;
    turbulent_flow_uv.y += cos(u_time * turbulenceEffectSpeed + flow_uv.x * turbulenceDistortionScale + 0.5) * baseTurbulenceMagnitude * localChaosFactor; // Used shared speed and scale

    float gasNoise = fbm(turbulent_flow_uv * u_noiseScale);
    gasNoise = (gasNoise + 1.0) * 0.5; // Remap to 0-1

    // Voids (blank spots) - they flow with the gas
    float voidNoiseRaw = fbm(flow_uv * u_voidScale); // Use the same flowing uv
    float voidNoise = (voidNoiseRaw + 1.0) * 0.5; // Remap to 0-1

    float voidCycle = (sin(u_time * u_voidCycleSpeed + voidNoiseRaw * 3.0) + 1.0) * 0.5;
    float voidRegion = smoothstep(0.6, 0.6 + u_voidDensity, voidNoise * voidCycle);

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

    // Vignette effect controlled by u_vignetteStrength
    vec2 centered_st = st - 0.5;

    // Removed explicit aspect ratio correction for vignette distance to make it oval
    float dist_from_center = length(centered_st);

    // Adjust vignette falloff based on u_vignetteStrength. 
    // dist_from_center ranges from 0 (center) up to 0.5 (mid-edge) or ~0.707 (corner)
    float vignetteStart = 0.1 + u_vignetteStrength * 0.3; // Max start is 0.4 (closer to mid-edge)
    float vignetteEnd = vignetteStart + 0.2; // Max end is 0.6, ensuring fade covers edges

    float vignette = 1.0 - smoothstep(vignetteStart, vignetteEnd, dist_from_center); // Use original distance for smooth vignette

    alpha *= vignette;

    gl_FragColor = vec4(color, alpha);
}`;function ge(s,o,g){const l=s.createShader(o);if(s.shaderSource(l,g),s.compileShader(l),!s.getShaderParameter(l,s.COMPILE_STATUS))throw console.error("Shader compilation error:",s.getShaderInfoLog(l)),s.deleteShader(l),new Error("Shader compilation failed");return l}function Ye(s,o,g){const l=s.createProgram();if(s.attachShader(l,o),s.attachShader(l,g),s.linkProgram(l),!s.getProgramParameter(l,s.LINK_STATUS))throw console.error("Program linking error:",s.getProgramInfoLog(l)),s.deleteProgram(l),new Error("Program linking failed");return l}function Je(){let s=J(null),o=J(null),g=J(0),l=J(0),x=J(!1);function k(){if(!c(s))return null;const e=c(s).getContext("webgl",{preserveDrawingBuffer:!1,antialias:!0});if(!e)return console.error("WebGL not supported or context creation failed."),null;try{const t=ge(e,e.VERTEX_SHADER,Qe),f=ge(e,e.FRAGMENT_SHADER,We),r=Ye(e,t,f);e.enable(e.BLEND),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA);const S=e.getAttribLocation(r,"a_position"),$={resolution:e.getUniformLocation(r,"u_resolution"),time:e.getUniformLocation(r,"u_time"),gasColor1:e.getUniformLocation(r,"u_gasColor1"),gasColor2:e.getUniformLocation(r,"u_gasColor2"),gasColorDark:e.getUniformLocation(r,"u_gasColorDark"),flowSpeed:e.getUniformLocation(r,"u_flowSpeed"),noiseScale:e.getUniformLocation(r,"u_noiseScale"),voidScale:e.getUniformLocation(r,"u_voidScale"),voidDensity:e.getUniformLocation(r,"u_voidDensity"),voidCycleSpeed:e.getUniformLocation(r,"u_voidCycleSpeed"),vignetteStrength:e.getUniformLocation(r,"u_vignetteStrength")};if(S===-1||Object.values($).some(q=>!q))return console.error("Failed to get some shader variable locations."),null;const h=e.createBuffer();if(!h)return console.error("Failed to create position buffer."),null;e.bindBuffer(e.ARRAY_BUFFER,h);const T=[-1,-1,1,-1,-1,1,-1,1,1,-1,1,1];return e.bufferData(e.ARRAY_BUFFER,new Float32Array(T),e.STATIC_DRAW),{gl:e,program:r,positionBuffer:h,positionAttributeLocation:S,uniformLocations:$}}catch(t){return console.error("Failed to initialize WebGL program:",t),null}}function w(e){if(!c(o))return;const{gl:t,program:f,uniformLocations:r}=c(o);t.useProgram(f),t.uniform3fv(r.gasColor1,e.gasColor1),t.uniform3fv(r.gasColor2,e.gasColor2),t.uniform3fv(r.gasColorDark,e.gasColorDark),t.uniform1f(r.flowSpeed,e.flowSpeed),t.uniform1f(r.noiseScale,e.noiseScale),t.uniform1f(r.voidScale,e.voidScale),t.uniform1f(r.voidDensity,e.voidDensity),t.uniform1f(r.voidCycleSpeed,e.voidCycleSpeed),t.uniform1f(r.vignetteStrength,e.vignetteStrength)}function A(e){if(!c(o)||!c(x))return;const{gl:t,program:f,positionBuffer:r,positionAttributeLocation:S,uniformLocations:$}=c(o),h=e*.001;c(l)===0&&G(l,h);const T=h-c(l);t.clearColor(0,0,0,0),t.clear(t.COLOR_BUFFER_BIT),t.useProgram(f),t.enableVertexAttribArray(S),t.bindBuffer(t.ARRAY_BUFFER,r),t.vertexAttribPointer(S,2,t.FLOAT,!1,0,0),t.uniform1f($.time,T),t.drawArrays(t.TRIANGLES,0,6),G(g,requestAnimationFrame(A),!0)}function B(){if(!c(s))return;const e=c(s).clientWidth,t=c(s).clientHeight;if(c(s).width!==e||c(s).height!==t||!c(x)){if(c(s).width=e,c(s).height=t,(!c(o)||c(o).gl.isContextLost())&&(G(o,k(),!0),!c(o))){G(x,!1);return}G(x,!0);const{gl:f,program:r,uniformLocations:S}=c(o);f.viewport(0,0,f.drawingBufferWidth,f.drawingBufferHeight),f.useProgram(r),f.uniform2f(S.resolution,f.drawingBufferWidth,f.drawingBufferHeight)}}function z(){if(cancelAnimationFrame(c(g)),G(x,!1),c(o)){const{gl:e,program:t,positionBuffer:f}=c(o);f&&e.deleteBuffer(f);const r=e.getAttachedShaders(t);r==null||r.forEach(S=>{e.detachShader(t,S),e.deleteShader(S)}),e.deleteProgram(t)}G(o,null)}function V(){G(g,requestAnimationFrame(A),!0)}return{get canvas(){return c(s)},set canvas(e){G(s,e,!0)},get isInitialized(){return c(x)},updateUniforms:w,resize:B,cleanup:z,startRendering:V}}var Xe=b('<canvas style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: block; z-index: 0;"></canvas>');function Ze(s,o){ae(o,!0);const g=I(o,"gasColor1",19,()=>[.1,.3,.7]),l=I(o,"gasColor2",19,()=>[.3,.6,.9]),x=I(o,"gasColorDark",19,()=>[.01,.02,.05]),k=I(o,"flowSpeed",3,1.5),w=I(o,"noiseScale",3,2.5),A=I(o,"voidScale",3,4),B=I(o,"voidDensity",3,.4),z=I(o,"voidCycleSpeed",3,.6),V=I(o,"vignetteStrength",3,.65);let e;const t=Je();he(()=>{t.canvas=e}),he(()=>{t.isInitialized&&t.updateUniforms({gasColor1:g(),gasColor2:l(),gasColorDark:x(),flowSpeed:k(),noiseScale:w(),voidScale:A(),voidDensity:B(),voidCycleSpeed:z(),vignetteStrength:V()})}),Ae(()=>(t.resize(),t.startRendering(),t.cleanup));var f=Xe();Ce("resize",Te,function(...r){var S;(S=t.resize)==null||S.apply(this,r)}),Le(f,r=>e=r,()=>e),n(s,f),ne()}var et=b(`<p class="svelte-s640ld">As part of a distributed team, I developed and maintained over a dozen event-driven
						microservices that power real-time user segmentation. I was involved in migrating
						services and data from a MongoDB replica set to a sharded cluster, which improved
						performance significantly without any downtime. I also designed algorithms to balance
						workloads across services and independently created automation tools in Go and C# to
						support daily operations. Additionally, I contributed to documentation and led
						development on multiple segmentation-related epics.</p>`),tt=b(`<p class="svelte-s640ld">At Veeam, I worked on a RESTful integration between their Azure and Backup platforms,
						ensuring real-time synchronization of entities. I developed notification systems to
						provide progress tracking for long-running operations in the UI. I also helped with
						initiatives to improve engineering workflows, including a migration from TFS to Git and
						better code review tooling.</p>`),ot=b(`<p class="svelte-s640ld">Took part in Implementing features for enterprise segment in one of the most popular
						accounting product in Russia. These features saved a lot of time for our biggest and
						richest customers, optimised user scenarios and helped in gaining success of our
						product.</p>`),at=b(`<p class="svelte-s640ld">During my time as a freelancer, I improved a Xamarin-based language learning app by
						optimizing UI rendering and implementing MVVM architecture. My changes significantly
						boosted app responsiveness. I also integrated robust local storage Realm.</p>`),nt=b(`<p class="svelte-s640ld">I worked on .NET-based enterprise software, optimizing LINQ and SQL queries to double
						request throughput in edge cases. I developed admin dashboards to streamline operations
						and created an internal framework for automated Excel report generation, which
						accelerated future development efforts.</p>`),st=b(`<p class="svelte-s640ld">My early work involved building internal dashboards to improve SEO workflows. I migrated
						performance-heavy logic to stored procedures in Transact-SQL, resulting in notable speed
						improvements for data-intensive processes.</p>`),rt=b("<!> <!> <!> <!> <!> <!>",1),it=b(`<div class="project-icon svelte-s640ld">✈️</div> <h3 class="section-title svelte-s640ld">CarryFit</h3> <p class="svelte-s640ld">An online tool that helps travelers check if their carry-on luggage meets size
						requirements for different airlines worldwide. Simply enter your bag's dimensions to
						instantly see which of 150+ airlines will accept it as cabin baggage.</p> <div class="badge-container svelte-s640ld"><!> <!> <!></div> <div class="project-link svelte-s640ld"><!></div>`,1),lt=b(`<div class="project-icon svelte-s640ld">🔄</div> <h3 class="section-title svelte-s640ld">MongoTransit</h3> <p class="svelte-s640ld">A tool for automatic replication of documents between MongoDB clusters. Supports
						iterative transfers, sharded collections, and configurable synchronization parameters,
						making it ideal for database migrations and data synchronization tasks.</p> <div class="badge-container svelte-s640ld"><!> <!></div> <div class="project-link svelte-s640ld"><!></div>`,1),dt=b('<div class="interest-icon books svelte-s640ld">📚</div> <h3 class="section-title svelte-s640ld">Reading</h3> <p class="svelte-s640ld">I enjoy reading books on technology, science, and other topics to learn new things.</p>',1),ct=b('<div class="interest-icon climbing svelte-s640ld">🧗</div> <h3 class="section-title svelte-s640ld">Rock Climbing</h3> <p class="svelte-s640ld">I like rock climbing to stay active and enjoy the outdoors.</p>',1),vt=b('<div class="interest-icon skiing svelte-s640ld">⛷️</div> <h3 class="section-title svelte-s640ld">Mountain Skiing</h3> <p class="svelte-s640ld">I enjoy mountain skiing in the winter.</p>',1),ut=b(`<h3 class="section-title svelte-s640ld">Advent of Code</h3> <p class="svelte-s640ld">I've completed multiple years of Advent of Code challenges:</p> <div class="badge-container svelte-s640ld"><!> <!> <!> <!> <!></div>`,1),ft=b(`<h3 class="section-title svelte-s640ld">LeetCode</h3> <p class="svelte-s640ld">I practice algorithmic problem solving on LeetCode to improve my coding efficiency and
						understanding of data structures.</p> <div class="badge-container svelte-s640ld"><!></div>`,1),ht=b(`<!> <div class="about-page svelte-s640ld"><header class="about-header svelte-s640ld"><!> <h1 class="space-title svelte-s640ld">About Me</h1></header> <div class="about-content svelte-s640ld"><section class="section intro-section svelte-s640ld"><div class="avatar-container svelte-s640ld"><img src="/images/ava.jpg" alt="Avatar" class="avatar svelte-s640ld" loading="lazy"> <div class="avatar-ring svelte-s640ld"></div></div> <div class="intro-text svelte-s640ld"><h2 class="space-heading svelte-s640ld"> </h2> <p class="tagline svelte-s640ld">Senior Software Engineer</p> <p class="svelte-s640ld">I've been programming for fun and profit since 2014, focusing on distributed systems and
					highload applications. My main stack is <b class="svelte-s640ld">C#</b> and <b class="svelte-s640ld">.NET</b>, but I'm also proficient
					in <b class="svelte-s640ld">Kotlin, Go, and TypeScript</b>.</p> <p class="svelte-s640ld"><b class="svelte-s640ld">Fun fact:</b> I was born on the 11th of April, just a day before Yuri Gagarin's flight.
					Poehali!</p></div></section> <section class="svelte-s640ld"><h2 class="space-heading svelte-s640ld">My Journey</h2> <!></section> <section class="svelte-s640ld"><h2 class="space-heading svelte-s640ld">Professional Interests</h2> <!></section> <section class="svelte-s640ld"><h2 class="space-heading svelte-s640ld">Personal Projects</h2> <div class="card-grid svelte-s640ld"><!> <!></div></section> <section class="svelte-s640ld"><h2 class="space-heading svelte-s640ld">Hobbies & Interests</h2> <div class="card-grid svelte-s640ld"><!> <!> <!></div></section> <section class="svelte-s640ld"><h2 class="space-heading svelte-s640ld">Programming Challenges</h2> <p class="svelte-s640ld">I enjoy participating in coding challenges to sharpen my skills and explore new programming
				concepts.</p> <div class="card-grid svelte-s640ld"><!> <!></div></section> <section class="contact-section svelte-s640ld"><h2 class="space-heading svelte-s640ld">Contact</h2> <p class="svelte-s640ld">Interested in collaborating or just want to say hello? Feel free to reach out.</p> <div class="button-group svelte-s640ld"><!> <!> <!></div></section></div></div>`,1);function Pt(s,o){ae(o,!1),me();var g=ht(),l=K(g);const x=pe(()=>`Learn about ${W.fullName}, Senior Software Engineer at Infobip. Programming since 2014, specializing in distributed systems, C#, Go, and highload applications. Previously at Veeam and SkbKontur.`);Fe(l,{title:"About Me",get description(){return c(x)},url:"/about",keywords:["about","software engineer","career","experience","distributed systems"]});var k=a(l,2),w=u(k),A=u(w);Ze(A,{}),_(2),v(w);var B=a(w,2),z=u(B),V=a(u(z),2),e=u(V),t=u(e);v(e),_(6),v(V),v(z);var f=a(z,2),r=a(u(f),2);Ve(r,{children:(m,F)=>{var p=rt(),P=K(p);Y(P,{date:"2020–present",title:"Infobip",companyUrl:"https://www.infobip.com/",technologies:["C#","Kotlin","Go","TypeScript","React","ASP.NET","Spring Boot","Kafka","MongoDB"],children:(i,y)=>{var d=et();n(i,d)},$$slots:{default:!0}});var D=a(P,2);Y(D,{date:"2019–2020",title:"Veeam",companyUrl:"https://www.veeam.com/",technologies:["C#","Azure","TypeScript","React","ASP.NET","PostgreSQL"],children:(i,y)=>{var d=tt();n(i,d)},$$slots:{default:!0}});var L=a(D,2);Y(L,{date:"2017–2019",title:"SKB Kontur",companyUrl:"https://kontur.ru/",technologies:["C#",".NET Framework","TypeScript","React","ASP.NET","WCF","MSSQL Server"],children:(i,y)=>{var d=ot();n(i,d)},$$slots:{default:!0}});var M=a(L,2);Y(M,{date:"2018",title:"Freelancer @ Upwork",companyUrl:"https://www.upwork.com/",technologies:["C#","Xamarin","Android","Realm","MVVM"],children:(i,y)=>{var d=at();n(i,d)},$$slots:{default:!0}});var N=a(M,2);Y(N,{date:"2015–2017",title:"Pro IT",technologies:["C#",".NET Framework","ASP.NET","React","MSSQL Server","LINQ"],children:(i,y)=>{var d=nt();n(i,d)},$$slots:{default:!0}});var R=a(N,2);Y(R,{date:"2014–2015",title:"KAI Development",companyUrl:"https://kaidev.ru/",technologies:["C#",".NET Framework","PHP","JavaScript","Java","Android","MSSQL Server","Transact-SQL"],children:(i,y)=>{var d=st();n(i,d)},$$slots:{default:!0}}),n(m,p)},$$slots:{default:!0}}),v(f);var S=a(f,2),$=a(u(S),2);O($,{variant:"default",children:(m,F)=>{Me(m,{get tags(){return W.interests}})},$$slots:{default:!0}}),v(S);var h=a(S,2),T=a(u(h),2),q=u(T);O(q,{children:(m,F)=>{var p=it(),P=a(K(p),6),D=u(P);U(D,{children:(i,y)=>{_();var d=C("SvelteKit");n(i,d)},$$slots:{default:!0}});var L=a(D,2);U(L,{children:(i,y)=>{_();var d=C("TailwindCSS");n(i,d)},$$slots:{default:!0}});var M=a(L,2);U(M,{children:(i,y)=>{_();var d=C("TypeScript");n(i,d)},$$slots:{default:!0}}),v(P);var N=a(P,2),R=u(N);E(R,{href:"https://carryon.fit/",external:!0,children:(i,y)=>{_();var d=C("Visit Site");n(i,d)},$$slots:{default:!0}}),v(N),n(m,p)},$$slots:{default:!0}});var ee=a(q,2);O(ee,{children:(m,F)=>{var p=lt(),P=a(K(p),6),D=u(P);U(D,{children:(R,i)=>{_();var y=C("C#");n(R,y)},$$slots:{default:!0}});var L=a(D,2);U(L,{children:(R,i)=>{_();var y=C("MongoDB");n(R,y)},$$slots:{default:!0}}),v(P);var M=a(P,2),N=u(M);E(N,{href:"https://github.com/AxelUser/MongoTransit",external:!0,children:(R,i)=>{_();var y=C("View on GitHub");n(R,y)},$$slots:{default:!0}}),v(M),n(m,p)},$$slots:{default:!0}}),v(T),v(h);var Q=a(h,2),H=a(u(Q),2),te=u(H);O(te,{children:(m,F)=>{var p=dt();_(4),n(m,p)},$$slots:{default:!0}});var ie=a(te,2);O(ie,{children:(m,F)=>{var p=ct();_(4),n(m,p)},$$slots:{default:!0}});var be=a(ie,2);O(be,{children:(m,F)=>{var p=vt();_(4),n(m,p)},$$slots:{default:!0}}),v(H),v(Q);var se=a(Q,2),le=a(u(se),4),de=u(le);O(de,{variant:"default",children:(m,F)=>{var p=ut(),P=a(K(p),4),D=u(P);U(D,{interactive:!0,children:(i,y)=>{E(i,{href:"https://github.com/AxelUser/aoc-2023-kt",external:!0,children:(d,oe)=>{_();var j=C("2023");n(d,j)},$$slots:{default:!0}})},$$slots:{default:!0}});var L=a(D,2);U(L,{interactive:!0,children:(i,y)=>{E(i,{href:"https://github.com/AxelUser/aoc-2022",external:!0,children:(d,oe)=>{_();var j=C("2022");n(d,j)},$$slots:{default:!0}})},$$slots:{default:!0}});var M=a(L,2);U(M,{interactive:!0,children:(i,y)=>{E(i,{href:"https://github.com/AxelUser/aoc-2021",external:!0,children:(d,oe)=>{_();var j=C("2021");n(d,j)},$$slots:{default:!0}})},$$slots:{default:!0}});var N=a(M,2);U(N,{interactive:!0,children:(i,y)=>{E(i,{href:"https://github.com/AxelUser/AdventOfCode2020",external:!0,children:(d,oe)=>{_();var j=C("2020");n(d,j)},$$slots:{default:!0}})},$$slots:{default:!0}});var R=a(N,2);U(R,{interactive:!0,children:(i,y)=>{E(i,{href:"https://github.com/AxelUser/advent-of-code-2017",external:!0,children:(d,oe)=>{_();var j=C("2017");n(d,j)},$$slots:{default:!0}})},$$slots:{default:!0}}),v(P),n(m,p)},$$slots:{default:!0}});var $e=a(de,2);O($e,{variant:"default",children:(m,F)=>{var p=ft(),P=a(K(p),4),D=u(P);U(D,{interactive:!0,children:(L,M)=>{E(L,{href:"https://github.com/AxelUser/leetcode-kt",external:!0,children:(N,R)=>{_();var i=C("View Solutions");n(N,i)},$$slots:{default:!0}})},$$slots:{default:!0}}),v(P),n(m,p)},$$slots:{default:!0}}),v(le),v(se);var ce=a(se,2),ve=a(u(ce),4),ue=u(ve);const ye=pe(()=>`mailto:${W.social.email}`);E(ue,{get href(){return c(ye)},external:!0,children:(m,F)=>{_();var p=C("Email");n(m,p)},$$slots:{default:!0}});var fe=a(ue,2);E(fe,{get href(){return W.social.github},external:!0,children:(m,F)=>{_();var p=C("GitHub");n(m,p)},$$slots:{default:!0}});var Se=a(fe,2);E(Se,{get href(){return W.social.linkedIn},external:!0,children:(m,F)=>{_();var p=C("LinkedIn");n(m,p)},$$slots:{default:!0}}),v(ve),v(ce),v(B),v(k),Z(()=>X(t,`Hello, I'm ${W.fullName}`)),n(s,g),ne()}export{Pt as component};
