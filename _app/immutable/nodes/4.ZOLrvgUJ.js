import{c as Ne,a,t as m,b as A}from"../chunks/Ix_iQA8O.js";import{I as Ee,e as ke,i as xe,b as ye,d as Pe}from"../chunks/BFMWjHdR.js";import{h as Ie,d as Le,p as ve,f as se,a as Ue,b as ue,c,s,n as w,t as F,r as l,g as d,u as Me,w as de,v as W,q as Se,ap as Fe,ah as $e}from"../chunks/Dkazavay.js";import{j as Be,r as je,p as D,i as q,s as V,e as ze,c as Ve}from"../chunks/FC-Yzx7w.js";import{o as Oe}from"../chunks/gL4yRitO.js";import{b as ee}from"../chunks/DasYoi_Y.js";import{s as Ae,O as Ge}from"../chunks/CgpvT9E8.js";import{C as oe,B as Q}from"../chunks/qVslmP2n.js";import{L as z}from"../chunks/Ck2_y4Ae.js";import{S as He}from"../chunks/DFzxSP7l.js";import{T as Ke}from"../chunks/CINb6Raz.js";function De(n,t,g,i,b){var k;Ie&&Le();var y=(k=t.$$slots)==null?void 0:k[g],$=!1;y===!0&&(y=t.children,$=!0),y===void 0||y(n,$?()=>i:i)}function We(n,t){ve(t,!0);let g=je(t,["$$slots","$$events","$$legacy"]);Ee(n,Be({name:"external-link"},()=>g,{iconNode:[["path",{d:"M15 3h6v6"}],["path",{d:"M10 14 21 3"}],["path",{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"}]],children:(b,y)=>{var $=Ne(),k=se($);Ae(k,()=>t.children??Ue),a(b,$)},$$slots:{default:!0}})),ue()}var qe=m('<img loading="lazy" class="svelte-rtno8s">'),Je=m('<div class="project-icon svelte-rtno8s"><!></div>'),Qe=m('<div class="project-card-footer svelte-rtno8s"><div class="badge-container svelte-rtno8s"></div></div>'),Ye=m('<div class="project-card-body svelte-rtno8s"><!> <h3 class="project-title svelte-rtno8s"><!></h3> <p class="project-description svelte-rtno8s"><!></p> <!></div>');function ge(n,t){ve(t,!0);const g=D(t,"technologies",19,()=>[]),i=Me(()=>{var b,y;return!((b=t.icon)!=null&&b.startsWith("/"))&&!((y=t.icon)!=null&&y.startsWith("http"))});oe(n,{class:"project-card",children:(b,y)=>{var $=Ye(),k=c($);{var I=f=>{var C=Je(),S=c(C);{var U=N=>{var j=A();F(()=>V(j,t.icon)),a(N,j)},G=N=>{var j=qe();F(()=>{ye(j,"src",t.icon),ye(j,"alt",`${t.title??""} icon`)}),a(N,j)};q(S,N=>{d(i)?N(U):N(G,!1)})}l(C),a(f,C)};q(k,f=>{t.icon&&f(I)})}var T=s(k,2),B=c(T);z(B,{get href(){return t.href},external:!0,children:(f,C)=>{w();var S=A();F(()=>V(S,t.title)),a(f,S)},$$slots:{default:!0}}),l(T);var e=s(T,2),o=c(e);Ae(o,()=>t.children),l(e);var u=s(e,2);{var r=f=>{var C=Qe(),S=c(C);ke(S,21,g,xe,(U,G)=>{Q(U,{children:(N,j)=>{w();var O=A();F(()=>V(O,d(G))),a(N,O)},$$slots:{default:!0}})}),l(S),l(C),a(f,C)};q(u,f=>{g().length>0&&f(r)})}l($),a(b,$)},$$slots:{default:!0}}),ue()}var Xe=m('<div class="timeline svelte-19j4pht"><!></div>');function Ze(n,t){var g=Xe(),i=c(g);De(i,t,"default",{}),l(g),a(n,g)}var et=m('<span class="timeline-date svelte-1b8k43k"> </span>'),tt=m('<span class="separator svelte-1b8k43k">•</span>'),ot=m(" <!>",1),st=m('<span class="company-name svelte-1b8k43k"> </span>'),at=m('<span class="separator svelte-1b8k43k">•</span> <span class="role svelte-1b8k43k"> </span>',1),nt=m('<p class="company-description svelte-1b8k43k"> </p>'),rt=m('<div class="badge-container svelte-1b8k43k"></div>'),it=m('<div class="timeline-item svelte-1b8k43k"><div class="timeline-dot svelte-1b8k43k"></div> <div class="timeline-content"><div class="timeline-header svelte-1b8k43k"><!> <!> <!> <!></div> <!> <div class="timeline-body svelte-1b8k43k"><!></div> <!></div></div>');function te(n,t){ve(t,!1);let g=D(t,"date",8,void 0),i=D(t,"technologies",24,()=>[]),b=D(t,"title",8),y=D(t,"role",8,void 0),$=D(t,"companyDescription",8,void 0),k=D(t,"companyUrl",8,void 0);Pe();var I=it(),T=s(c(I),2),B=c(T),e=c(B);{var o=v=>{var p=et(),E=c(p,!0);l(p),F(()=>V(E,g())),a(v,p)};q(e,v=>{g()&&v(o)})}var u=s(e,2);{var r=v=>{var p=tt();a(v,p)};q(u,v=>{g()&&(b()||y())&&v(r)})}var f=s(u,2);{var C=v=>{z(v,{get href(){return k()},external:!0,class:"company-link",children:(p,E)=>{w();var H=ot(),ae=se(H),ne=s(ae);We(ne,{size:14,class:"external-link-icon"}),F(()=>V(ae,`${b()??""} `)),a(p,H)},$$slots:{default:!0}})},S=v=>{var p=st(),E=c(p,!0);l(p),F(()=>V(E,b())),a(v,p)};q(f,v=>{k()?v(C):v(S,!1)})}var U=s(f,2);{var G=v=>{var p=at(),E=s(se(p),2),H=c(E,!0);l(E),F(()=>V(H,y())),a(v,p)};q(U,v=>{y()&&b()&&v(G)})}l(B);var N=s(B,2);{var j=v=>{var p=nt(),E=c(p,!0);l(p),F(()=>V(E,$())),a(v,p)};q(N,v=>{$()&&v(j)})}var O=s(N,2),fe=c(O);De(fe,t,"default",{}),l(O);var ie=s(O,2);{var me=v=>{var p=rt();ke(p,5,i,xe,(E,H)=>{Q(E,{children:(ae,ne)=>{w();var le=A();F(()=>V(le,d(H))),a(ae,le)},$$slots:{default:!0}})}),l(p),a(v,p)};q(ie,v=>{i().length>0&&v(me)})}l(T),l(I),a(n,I),ue()}const lt=`attribute vec2 a_position;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
} `,ct=`/**
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
}`;function Ce(n,t,g){const i=n.createShader(t);if(n.shaderSource(i,g),n.compileShader(i),!n.getShaderParameter(i,n.COMPILE_STATUS))throw console.error("Shader compilation error:",n.getShaderInfoLog(i)),n.deleteShader(i),new Error("Shader compilation failed");return i}function dt(n,t,g){const i=n.createProgram();if(n.attachShader(i,t),n.attachShader(i,g),n.linkProgram(i),!n.getProgramParameter(i,n.LINK_STATUS))throw console.error("Program linking error:",n.getProgramInfoLog(i)),n.deleteProgram(i),new Error("Program linking failed");return i}function vt(){let n=de(null),t=de(null),g=de(0),i=de(0),b=de(!1);function y(){if(!d(n))return null;const e=d(n).getContext("webgl",{preserveDrawingBuffer:!1,antialias:!0});if(!e)return console.error("WebGL not supported or context creation failed."),null;try{const o=Ce(e,e.VERTEX_SHADER,lt),u=Ce(e,e.FRAGMENT_SHADER,ct),r=dt(e,o,u);e.enable(e.BLEND),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA);const f=e.getAttribLocation(r,"a_position"),C={resolution:e.getUniformLocation(r,"u_resolution"),time:e.getUniformLocation(r,"u_time"),gasColor1:e.getUniformLocation(r,"u_gasColor1"),gasColor2:e.getUniformLocation(r,"u_gasColor2"),gasColorDark:e.getUniformLocation(r,"u_gasColorDark"),flowSpeed:e.getUniformLocation(r,"u_flowSpeed"),noiseScale:e.getUniformLocation(r,"u_noiseScale"),voidScale:e.getUniformLocation(r,"u_voidScale"),voidDensity:e.getUniformLocation(r,"u_voidDensity"),voidCycleSpeed:e.getUniformLocation(r,"u_voidCycleSpeed"),vignetteStrength:e.getUniformLocation(r,"u_vignetteStrength")};if(f===-1||Object.values(C).some(G=>!G))return console.error("Failed to get some shader variable locations."),null;const S=e.createBuffer();if(!S)return console.error("Failed to create position buffer."),null;e.bindBuffer(e.ARRAY_BUFFER,S);const U=[-1,-1,1,-1,-1,1,-1,1,1,-1,1,1];return e.bufferData(e.ARRAY_BUFFER,new Float32Array(U),e.STATIC_DRAW),{gl:e,program:r,positionBuffer:S,positionAttributeLocation:f,uniformLocations:C}}catch(o){return console.error("Failed to initialize WebGL program:",o),null}}function $(e){if(!d(t))return;const{gl:o,program:u,uniformLocations:r}=d(t);o.useProgram(u),o.uniform3fv(r.gasColor1,e.gasColor1),o.uniform3fv(r.gasColor2,e.gasColor2),o.uniform3fv(r.gasColorDark,e.gasColorDark),o.uniform1f(r.flowSpeed,e.flowSpeed),o.uniform1f(r.noiseScale,e.noiseScale),o.uniform1f(r.voidScale,e.voidScale),o.uniform1f(r.voidDensity,e.voidDensity),o.uniform1f(r.voidCycleSpeed,e.voidCycleSpeed),o.uniform1f(r.vignetteStrength,e.vignetteStrength)}function k(e){if(!d(t)||!d(b))return;const{gl:o,program:u,positionBuffer:r,positionAttributeLocation:f,uniformLocations:C}=d(t),S=e*.001;d(i)===0&&W(i,S);const U=S-d(i);o.clearColor(0,0,0,0),o.clear(o.COLOR_BUFFER_BIT),o.useProgram(u),o.enableVertexAttribArray(f),o.bindBuffer(o.ARRAY_BUFFER,r),o.vertexAttribPointer(f,2,o.FLOAT,!1,0,0),o.uniform1f(C.time,U),o.drawArrays(o.TRIANGLES,0,6),W(g,requestAnimationFrame(k),!0)}function I(){if(!d(n))return;const e=d(n).clientWidth,o=d(n).clientHeight;if(d(n).width!==e||d(n).height!==o||!d(b)){if(d(n).width=e,d(n).height=o,(!d(t)||d(t).gl.isContextLost())&&(W(t,y(),!0),!d(t))){W(b,!1);return}W(b,!0);const{gl:u,program:r,uniformLocations:f}=d(t);u.viewport(0,0,u.drawingBufferWidth,u.drawingBufferHeight),u.useProgram(r),u.uniform2f(f.resolution,u.drawingBufferWidth,u.drawingBufferHeight)}}function T(){if(cancelAnimationFrame(d(g)),W(b,!1),d(t)){const{gl:e,program:o,positionBuffer:u}=d(t);u&&e.deleteBuffer(u);const r=e.getAttachedShaders(o);r==null||r.forEach(f=>{e.detachShader(o,f),e.deleteShader(f)}),e.deleteProgram(o)}W(t,null)}function B(){W(g,requestAnimationFrame(k),!0)}return{get canvas(){return d(n)},set canvas(e){W(n,e,!0)},get isInitialized(){return d(b)},updateUniforms:$,resize:I,cleanup:T,startRendering:B}}var ut=m('<canvas style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: block; z-index: 0;"></canvas>');function ft(n,t){ve(t,!0);const g=D(t,"gasColor1",19,()=>[.1,.3,.7]),i=D(t,"gasColor2",19,()=>[.3,.6,.9]),b=D(t,"gasColorDark",19,()=>[.01,.02,.05]),y=D(t,"flowSpeed",3,1.5),$=D(t,"noiseScale",3,2.5),k=D(t,"voidScale",3,4),I=D(t,"voidDensity",3,.4),T=D(t,"voidCycleSpeed",3,.6),B=D(t,"vignetteStrength",3,.65);let e;const o=vt();Se(()=>{o.canvas=e}),Se(()=>{o.isInitialized&&o.updateUniforms({gasColor1:g(),gasColor2:i(),gasColorDark:b(),flowSpeed:y(),noiseScale:$(),voidScale:k(),voidDensity:I(),voidCycleSpeed:T(),vignetteStrength:B()})}),Oe(()=>(o.resize(),o.startRendering(),o.cleanup));var u=ut();ze("resize",Fe,function(...r){var f;(f=o.resize)==null||f.apply(this,r)}),Ve(u,r=>e=r,()=>e),a(n,u),ue()}var mt=m(`<ul class="svelte-swsm47"><li class="svelte-swsm47">Designed and implemented fault-tolerant architecture in Kotlin and C# for 4
								real-time audience-segmentation services, processing up to 50,000 events per second.
								One delivered feature replaced an external product through internal dogfooding.</li> <li class="svelte-swsm47">Led a zero-downtime migration of 3 microservices and ~1 TB of data from a MongoDB
								replica set to a sharded cluster.</li> <li class="svelte-swsm47">Improved platform performance by optimizing MongoDB query p95 latency and
								redesigning the leader-election algorithm, achieving a 5–10× improvement in key
								technical metrics.</li> <li class="svelte-swsm47">Developed internal tools in C# and Go to automate maintenance and troubleshooting.</li></ul>`),gt=m(`<ul class="svelte-swsm47"><li class="svelte-swsm47">Built a RESTful integration between Veeam Backup for Azure and Veeam Backup &
								Replication using C#, ASP.NET Core, and Swagger-documented APIs.</li> <li class="svelte-swsm47">Implemented a real-time notification center in Veeam Backup for Azure using
								WebSockets.</li> <li class="svelte-swsm47">Engineered an event-driven data synchronization pipeline handling thousands of daily
								entity updates, ensuring eventual consistency between two major products.</li></ul>`),ht=m(`<ul class="svelte-swsm47"><li class="svelte-swsm47">Delivered 5 enterprise features for Kontur Extern using C#/.NET and React for B2B
								clients.</li> <li class="svelte-swsm47">Refactored the monolithic backend by replacing the global context with scoped
								services in ASP.NET, enabling batch document processing per request.</li> <li class="svelte-swsm47">Migrated a legacy JavaScript UI to React, Redux, and TypeScript.</li></ul>`),pt=m(`<ul class="svelte-swsm47"><li class="svelte-swsm47">Optimized the rendering pipeline of a Xamarin.Forms Android app, increasing frame
								rate from 30–35 FPS to a steady 55–60 FPS (+70%), significantly improving the user
								experience.</li> <li class="svelte-swsm47">Implemented custom caching and a full offline mode using the Realm database,
								reducing remote API calls and improving load times.</li> <li class="svelte-swsm47">Refactored legacy code into a clean MVVM architecture, shortening feature lead time
								and boosting unit-test coverage to nearly 90%.</li></ul>`),_t=m(`<ul class="svelte-swsm47"><li class="svelte-swsm47">Engineered a push-based scheduling daemon, reducing client polling traffic by
								approximately 80%.</li> <li class="svelte-swsm47">Developed self-service admin panels, enabling support staff to resolve ~90% of
								common tickets without involving engineers.</li> <li class="svelte-swsm47">Refactored a jQuery codebase to Knockout.js (MVVM), halving front-end defect rates
								and speeding up feature delivery.</li> <li class="svelte-swsm47">Optimized heavy LINQ queries in Entity Framework for Oracle, cutting average query
								latency from 1 minute to 4–5 seconds.</li></ul>`),bt=m(`<ul class="svelte-swsm47"><li class="svelte-swsm47">Developed a jQuery-based WYSIWYG admin panel for the XSUD project blog and
								introduced semantic versioning for post markup in ASP.NET MVC, reducing publishing
								time and increasing click-through rates by ~35% within 4 months.</li> <li class="svelte-swsm47">Designed and launched an offline-capable Android app for the Safe-Childhood Map
								project within 2 months.</li> <li class="svelte-swsm47">Refactored CPU-heavy business logic into parameterized Microsoft SQL Server stored
								procedures, reducing p95 latency from 30 seconds to under 5 seconds.</li></ul>`),wt=m("<!> <!> <!> <!> <!> <!> <!>",1),yt=m('<div class="interest-icon books svelte-swsm47">📚</div> <h3 class="section-title svelte-swsm47">Reading</h3> <p class="svelte-swsm47">I enjoy reading books on technology, science, and other topics to learn new things.</p>',1),St=m('<div class="interest-icon climbing svelte-swsm47">🧗</div> <h3 class="section-title svelte-swsm47">Rock Climbing</h3> <p class="svelte-swsm47">I like rock climbing to stay active and enjoy the outdoors.</p>',1),$t=m('<div class="interest-icon skiing svelte-swsm47">⛷️</div> <h3 class="section-title svelte-swsm47">Mountain Skiing</h3> <p class="svelte-swsm47">I enjoy mountain skiing in the winter.</p>',1),Ct=m(`<h3 class="section-title svelte-swsm47">Advent of Code</h3> <p class="svelte-swsm47">I've completed multiple years of Advent of Code challenges:</p> <div class="badge-container svelte-swsm47"><!> <!> <!> <!> <!></div>`,1),kt=m(`<h3 class="section-title svelte-swsm47">LeetCode</h3> <p class="svelte-swsm47">I practice algorithmic problem solving on LeetCode to improve my coding efficiency and
							understanding of data structures.</p> <div class="badge-container svelte-swsm47"><!></div>`,1),xt=m(`<div class="about-page svelte-swsm47"><header class="about-header svelte-swsm47"><!> <h1 class="space-title svelte-swsm47">About Me</h1></header> <div class="about-content svelte-swsm47"><section class="intro-section svelte-swsm47"><div class="avatar-container svelte-swsm47"><img src="/images/ava.jpg" alt="Avatar" class="avatar svelte-swsm47" loading="lazy"> <div class="avatar-ring svelte-swsm47"></div></div> <div class="intro-text svelte-swsm47"><h2 class="space-heading svelte-swsm47"> </h2> <p class="tagline svelte-swsm47">Senior Software Engineer</p> <div class="intro-text-content svelte-swsm47"><p class="svelte-swsm47">I've been programming for fun and profit since 2014, focusing on distributed systems
							and highload applications. My main stack is <b class="svelte-swsm47">C#</b>, <b class="svelte-swsm47">Kotlin</b>, and <b class="svelte-swsm47">TypeScript</b>, but I'm also proficient in <b class="svelte-swsm47">Go</b>.</p> <p class="svelte-swsm47"><b class="svelte-swsm47">Fun fact:</b> I was born on the 11th of April, just a day before Yuri Gagarin's flight.
							Poehali! 🚀</p></div></div> <div class="contact-information svelte-swsm47"><div class="button-group svelte-swsm47"><!> <!> <!></div></div></section> <section class="svelte-swsm47"><h2 class="space-heading svelte-swsm47">My Journey</h2> <!></section> <section class="svelte-swsm47"><h2 class="space-heading svelte-swsm47">Professional Interests</h2> <!></section> <section class="svelte-swsm47"><h2 class="space-heading svelte-swsm47">Personal Projects</h2> <div class="card-grid svelte-swsm47"><!> <!> <!></div></section> <section class="svelte-swsm47"><h2 class="space-heading svelte-swsm47">Hobbies & Interests</h2> <div class="card-grid svelte-swsm47"><!> <!> <!></div></section> <section class="svelte-swsm47"><h2 class="space-heading svelte-swsm47">Programming Challenges</h2> <p class="svelte-swsm47">I enjoy participating in coding challenges to sharpen my skills and explore new
					programming concepts.</p> <div class="card-grid svelte-swsm47"><!> <!></div></section></div></div>`),Pt=m("<!> <!>",1);function Bt(n,t){ve(t,!1),Pe();var g=Pt(),i=se(g);const b=$e(()=>`Learn about ${ee.fullName}, Software Developer at JetBrains. Programming since 2014, specializing in distributed systems, C#, Go, and highload applications. Previously at Infobip, Veeam and SkbKontur.`);He(i,{title:"About Me",get description(){return d(b)},url:"/about",keywords:["about","software engineer","career","experience","distributed systems"]});var y=s(i,2);Ge(y,{children:($,k)=>{var I=xt(),T=c(I),B=c(T);ft(B,{}),w(2),l(T);var e=s(T,2),o=c(e),u=s(c(o),2),r=c(u),f=c(r);l(r),w(4),l(u);var C=s(u,2),S=c(C),U=c(S);const G=$e(()=>`mailto:${ee.social.email}`);z(U,{get href(){return d(G)},external:!0,children:(_,M)=>{w();var h=A();F(()=>V(h,ee.social.email)),a(_,h)},$$slots:{default:!0}});var N=s(U,2);z(N,{get href(){return ee.social.github},external:!0,children:(_,M)=>{w();var h=A("GitHub");a(_,h)},$$slots:{default:!0}});var j=s(N,2);z(j,{get href(){return ee.social.linkedIn},external:!0,children:(_,M)=>{w();var h=A("LinkedIn");a(_,h)},$$slots:{default:!0}}),l(S),l(C),l(o);var O=s(o,2),fe=s(c(O),2);Ze(fe,{children:(_,M)=>{var h=wt(),J=se(h);te(J,{date:"June 2026–present",title:"JetBrains",role:"Software Developer",companyDescription:"JetBrains is a global software company that builds developer tools and IDEs, including IntelliJ IDEA, PyCharm, Rider, and the Kotlin programming language.",companyUrl:"https://www.jetbrains.com/",technologies:["C#","Kotlin"]});var Y=s(J,2);te(Y,{date:"August 2020–June 2026",title:"Infobip",role:"Senior Software Engineer",companyDescription:"Infobip is a global Communications Platform as a Service (CPaaS) provider offering APIs for messaging, voice, video, and contact center services.",companyUrl:"https://www.infobip.com/",technologies:["C#","Kotlin","Go (Golang)","TypeScript","React","ASP.NET","Spring Boot","Kafka","MongoDB"],children:(x,R)=>{var P=mt();a(x,P)},$$slots:{default:!0}});var X=s(Y,2);te(X,{date:"August 2019–August 2020",title:"Veeam Software",role:"Software Engineer",companyDescription:"Veeam Software is the global leader in backup and data recovery solutions for virtual machines, serving over 550,000 customers across more than 30 countries.",companyUrl:"https://www.veeam.com/",technologies:["C#","Azure","TypeScript","React","ASP.NET","PostgreSQL"],children:(x,R)=>{var P=gt();a(x,P)},$$slots:{default:!0}});var re=s(X,2);te(re,{date:"October 2017–August 2019",title:"Kontur",role:"Software Engineer",companyDescription:"Kontur is Russia's second-largest SaaS provider, offering 70+ cloud services for accounting, compliance, and e-government to 2.2 million business customers in Russia and abroad.",companyUrl:"https://kontur.ru/",technologies:["C#",".NET Framework","TypeScript","React","ASP.NET","WCF","MSSQL Server"],children:(x,R)=>{var P=ht();a(x,P)},$$slots:{default:!0}});var Z=s(re,2);te(Z,{date:"April 2018–December 2019",title:"Freelancing",role:"Software Engineer",companyDescription:"Independent contractor working on mobile application development.",companyUrl:"https://www.upwork.com/",technologies:["C#","Xamarin","Android","Realm","MVVM"],children:(x,R)=>{var P=pt();a(x,P)},$$slots:{default:!0}});var ce=s(Z,2);te(ce,{date:"October 2015–August 2017",title:"PRO IT",role:"Software Developer",companyDescription:"PRO IT is a Russian software company developing web-based electronic document workflow systems for government agencies, with over 100 employees.",technologies:["C#",".NET Framework","ASP.NET","React","MSSQL Server","LINQ"],children:(x,R)=>{var P=_t();a(x,P)},$$slots:{default:!0}});var L=s(ce,2);te(L,{date:"December 2014–October 2015",title:"Kai Development",role:"Junior Software Engineer",companyDescription:"Kai Development is a Russian software engineering studio specializing in web-based business and government automation. Since 2007, the company has delivered 45+ projects, including the legal-tech spin-off XSUD for Russian ministries and major corporations.",companyUrl:"https://kaidev.ru/",technologies:["C#",".NET Framework","PHP","JavaScript","Java","Android","MSSQL Server","Transact-SQL"],children:(x,R)=>{var P=bt();a(x,P)},$$slots:{default:!0}}),a(_,h)},$$slots:{default:!0}}),l(O);var ie=s(O,2),me=s(c(ie),2);oe(me,{variant:"default",children:(_,M)=>{Ke(_,{get tags(){return ee.interests}})},$$slots:{default:!0}}),l(ie);var v=s(ie,2),p=s(c(v),2),E=c(p);ge(E,{title:"CarryFit",href:"https://carryon.fit/",icon:"/images/projects/carryfit.png",technologies:["Svelte 5","TailwindCSS","TypeScript"],children:(_,M)=>{w();var h=A(`An online tool that helps travelers check if their carry-on luggage meets size
						requirements for different airlines worldwide. Simply enter your bag's dimensions to
						instantly see which of 150+ airlines will accept it as cabin baggage.`);a(_,h)},$$slots:{default:!0}});var H=s(E,2);ge(H,{title:"HumbleHire",href:"https://humblehire.cv/",icon:"/images/projects/humble-hire.png",technologies:["Svelte 5","TailwindCSS","TypeScript"],children:(_,M)=>{w();var h=A(`HumbleHire is a free, open-source CV builder that runs entirely in your browser. You
						keep one master CV with your whole history in it, branch a tailored copy for each job
						you apply to, and export a clean PDF to send.`);a(_,h)},$$slots:{default:!0}});var ae=s(H,2);ge(ae,{title:"MongoTransit",href:"https://github.com/AxelUser/MongoTransit",icon:"🔄",technologies:["C#","MongoDB"],children:(_,M)=>{w();var h=A(`A tool for automatic replication of documents between MongoDB clusters. Supports
						iterative transfers, sharded collections, and configurable synchronization parameters,
						making it ideal for database migrations and data synchronization tasks.`);a(_,h)},$$slots:{default:!0}}),l(p),l(v);var ne=s(v,2),le=s(c(ne),2),he=c(le);oe(he,{children:(_,M)=>{var h=yt();w(4),a(_,h)},$$slots:{default:!0}});var pe=s(he,2);oe(pe,{children:(_,M)=>{var h=St();w(4),a(_,h)},$$slots:{default:!0}});var Re=s(pe,2);oe(Re,{children:(_,M)=>{var h=$t();w(4),a(_,h)},$$slots:{default:!0}}),l(le),l(ne);var _e=s(ne,2),be=s(c(_e),4),we=c(be);oe(we,{variant:"default",children:(_,M)=>{var h=Ct(),J=s(se(h),4),Y=c(J);Q(Y,{interactive:!0,children:(L,x)=>{z(L,{href:"https://github.com/AxelUser/aoc-2023-kt",external:!0,children:(R,P)=>{w();var K=A("2023");a(R,K)},$$slots:{default:!0}})},$$slots:{default:!0}});var X=s(Y,2);Q(X,{interactive:!0,children:(L,x)=>{z(L,{href:"https://github.com/AxelUser/aoc-2022",external:!0,children:(R,P)=>{w();var K=A("2022");a(R,K)},$$slots:{default:!0}})},$$slots:{default:!0}});var re=s(X,2);Q(re,{interactive:!0,children:(L,x)=>{z(L,{href:"https://github.com/AxelUser/aoc-2021",external:!0,children:(R,P)=>{w();var K=A("2021");a(R,K)},$$slots:{default:!0}})},$$slots:{default:!0}});var Z=s(re,2);Q(Z,{interactive:!0,children:(L,x)=>{z(L,{href:"https://github.com/AxelUser/AdventOfCode2020",external:!0,children:(R,P)=>{w();var K=A("2020");a(R,K)},$$slots:{default:!0}})},$$slots:{default:!0}});var ce=s(Z,2);Q(ce,{interactive:!0,children:(L,x)=>{z(L,{href:"https://github.com/AxelUser/advent-of-code-2017",external:!0,children:(R,P)=>{w();var K=A("2017");a(R,K)},$$slots:{default:!0}})},$$slots:{default:!0}}),l(J),a(_,h)},$$slots:{default:!0}});var Te=s(we,2);oe(Te,{variant:"default",children:(_,M)=>{var h=kt(),J=s(se(h),4),Y=c(J);Q(Y,{interactive:!0,children:(X,re)=>{z(X,{href:"https://github.com/AxelUser/leetcode-kt",external:!0,children:(Z,ce)=>{w();var L=A("View Solutions");a(Z,L)},$$slots:{default:!0}})},$$slots:{default:!0}}),l(J),a(_,h)},$$slots:{default:!0}}),l(be),l(_e),l(e),l(I),F(()=>V(f,`Hello, I'm ${ee.fullName}`)),a($,I)}}),a(n,g),ue()}export{Bt as component};
