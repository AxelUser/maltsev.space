import{c as Ne,a as s,t as m,b as A}from"../chunks/Ix_iQA8O.js";import{I as Ee,e as Ce,i as xe,b as ye,d as Pe}from"../chunks/BPJPTjn0.js";import{h as Le,d as Ie,p as ce,f as te,a as Ue,b as de,c,s as a,n as S,t as U,r as l,g as d,u as Me,w as le,v as W,q as Se,ap as Fe,ah as $e}from"../chunks/Dkazavay.js";import{j as Be,r as je,p as D,i as K,s as j,e as ze,c as Ve}from"../chunks/FC-Yzx7w.js";import{o as Oe}from"../chunks/gL4yRitO.js";import{b as Z}from"../chunks/DasYoi_Y.js";import{s as Ae,O as Ge}from"../chunks/CgpvT9E8.js";import{C as ee,B as q}from"../chunks/BACHWMu4.js";import{L as B}from"../chunks/CpUWo3nr.js";import{S as He}from"../chunks/Q4gVeNUW.js";import{T as We}from"../chunks/BTyz992E.js";function De(n,t,g,r,b){var P;Le&&Ie();var $=(P=t.$$slots)==null?void 0:P[g],C=!1;$===!0&&($=t.children,C=!0),$===void 0||$(n,C?()=>r:r)}function Ke(n,t){ce(t,!0);let g=je(t,["$$slots","$$events","$$legacy"]);Ee(n,Be({name:"external-link"},()=>g,{iconNode:[["path",{d:"M15 3h6v6"}],["path",{d:"M10 14 21 3"}],["path",{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"}]],children:(b,$)=>{var C=Ne(),P=te(C);Ae(P,()=>t.children??Ue),s(b,C)},$$slots:{default:!0}})),de()}var Qe=m('<img loading="lazy" class="svelte-rtno8s">'),qe=m('<div class="project-icon svelte-rtno8s"><!></div>'),Ye=m('<div class="project-card-footer svelte-rtno8s"><div class="badge-container svelte-rtno8s"></div></div>'),Je=m('<div class="project-card-body svelte-rtno8s"><!> <h3 class="project-title svelte-rtno8s"><!></h3> <p class="project-description svelte-rtno8s"><!></p> <!></div>');function ge(n,t){ce(t,!0);const g=D(t,"technologies",19,()=>[]),r=Me(()=>{var b,$;return!((b=t.icon)!=null&&b.startsWith("/"))&&!(($=t.icon)!=null&&$.startsWith("http"))});ee(n,{class:"project-card",children:(b,$)=>{var C=Je(),P=c(C);{var E=f=>{var x=qe(),k=c(x);{var L=T=>{var F=A();U(()=>j(F,t.icon)),s(T,F)},O=T=>{var F=Qe();U(()=>{ye(F,"src",t.icon),ye(F,"alt",`${t.title??""} icon`)}),s(T,F)};K(k,T=>{d(r)?T(L):T(O,!1)})}l(x),s(f,x)};K(P,f=>{t.icon&&f(E)})}var R=a(P,2),M=c(R);B(M,{get href(){return t.href},external:!0,children:(f,x)=>{S();var k=A();U(()=>j(k,t.title)),s(f,k)},$$slots:{default:!0}}),l(R);var e=a(R,2),o=c(e);Ae(o,()=>t.children),l(e);var u=a(e,2);{var i=f=>{var x=Ye(),k=c(x);Ce(k,21,g,xe,(L,O)=>{q(L,{children:(T,F)=>{S();var z=A();U(()=>j(z,d(O))),s(T,z)},$$slots:{default:!0}})}),l(k),l(x),s(f,x)};K(u,f=>{g().length>0&&f(i)})}l(C),s(b,C)},$$slots:{default:!0}}),de()}var Xe=m('<div class="timeline svelte-19j4pht"><!></div>');function Ze(n,t){var g=Xe(),r=c(g);De(r,t,"default",{}),l(g),s(n,g)}var et=m('<span class="timeline-date svelte-1b8k43k"> </span>'),tt=m('<span class="separator svelte-1b8k43k">•</span>'),ot=m(" <!>",1),st=m('<span class="company-name svelte-1b8k43k"> </span>'),at=m('<span class="separator svelte-1b8k43k">•</span> <span class="role svelte-1b8k43k"> </span>',1),nt=m('<p class="company-description svelte-1b8k43k"> </p>'),it=m('<div class="badge-container svelte-1b8k43k"></div>'),rt=m('<div class="timeline-item svelte-1b8k43k"><div class="timeline-dot svelte-1b8k43k"></div> <div class="timeline-content"><div class="timeline-header svelte-1b8k43k"><!> <!> <!> <!></div> <!> <div class="timeline-body svelte-1b8k43k"><!></div> <!></div></div>');function ne(n,t){ce(t,!1);let g=D(t,"date",8,void 0),r=D(t,"technologies",24,()=>[]),b=D(t,"title",8),$=D(t,"role",8,void 0),C=D(t,"companyDescription",8,void 0),P=D(t,"companyUrl",8,void 0);Pe();var E=rt(),R=a(c(E),2),M=c(R),e=c(M);{var o=v=>{var h=et(),N=c(h,!0);l(h),U(()=>j(N,g())),s(v,h)};K(e,v=>{g()&&v(o)})}var u=a(e,2);{var i=v=>{var h=tt();s(v,h)};K(u,v=>{g()&&(b()||$())&&v(i)})}var f=a(u,2);{var x=v=>{B(v,{get href(){return P()},external:!0,class:"company-link",children:(h,N)=>{S();var G=ot(),oe=te(G),se=a(oe);Ke(se,{size:14,class:"external-link-icon"}),U(()=>j(oe,`${b()??""} `)),s(h,G)},$$slots:{default:!0}})},k=v=>{var h=st(),N=c(h,!0);l(h),U(()=>j(N,b())),s(v,h)};K(f,v=>{P()?v(x):v(k,!1)})}var L=a(f,2);{var O=v=>{var h=at(),N=a(te(h),2),G=c(N,!0);l(N),U(()=>j(G,$())),s(v,h)};K(L,v=>{$()&&b()&&v(O)})}l(M);var T=a(M,2);{var F=v=>{var h=nt(),N=c(h,!0);l(h),U(()=>j(N,C())),s(v,h)};K(T,v=>{C()&&v(F)})}var z=a(T,2),fe=c(z);De(fe,t,"default",{}),l(z);var ie=a(z,2);{var me=v=>{var h=it();Ce(h,5,r,xe,(N,G)=>{q(N,{children:(oe,se)=>{S();var re=A();U(()=>j(re,d(G))),s(oe,re)},$$slots:{default:!0}})}),l(h),s(v,h)};K(ie,v=>{r().length>0&&v(me)})}l(R),l(E),s(n,E),de()}const lt=`attribute vec2 a_position;

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
}`;function ke(n,t,g){const r=n.createShader(t);if(n.shaderSource(r,g),n.compileShader(r),!n.getShaderParameter(r,n.COMPILE_STATUS))throw console.error("Shader compilation error:",n.getShaderInfoLog(r)),n.deleteShader(r),new Error("Shader compilation failed");return r}function dt(n,t,g){const r=n.createProgram();if(n.attachShader(r,t),n.attachShader(r,g),n.linkProgram(r),!n.getProgramParameter(r,n.LINK_STATUS))throw console.error("Program linking error:",n.getProgramInfoLog(r)),n.deleteProgram(r),new Error("Program linking failed");return r}function vt(){let n=le(null),t=le(null),g=le(0),r=le(0),b=le(!1);function $(){if(!d(n))return null;const e=d(n).getContext("webgl",{preserveDrawingBuffer:!1,antialias:!0});if(!e)return console.error("WebGL not supported or context creation failed."),null;try{const o=ke(e,e.VERTEX_SHADER,lt),u=ke(e,e.FRAGMENT_SHADER,ct),i=dt(e,o,u);e.enable(e.BLEND),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA);const f=e.getAttribLocation(i,"a_position"),x={resolution:e.getUniformLocation(i,"u_resolution"),time:e.getUniformLocation(i,"u_time"),gasColor1:e.getUniformLocation(i,"u_gasColor1"),gasColor2:e.getUniformLocation(i,"u_gasColor2"),gasColorDark:e.getUniformLocation(i,"u_gasColorDark"),flowSpeed:e.getUniformLocation(i,"u_flowSpeed"),noiseScale:e.getUniformLocation(i,"u_noiseScale"),voidScale:e.getUniformLocation(i,"u_voidScale"),voidDensity:e.getUniformLocation(i,"u_voidDensity"),voidCycleSpeed:e.getUniformLocation(i,"u_voidCycleSpeed"),vignetteStrength:e.getUniformLocation(i,"u_vignetteStrength")};if(f===-1||Object.values(x).some(O=>!O))return console.error("Failed to get some shader variable locations."),null;const k=e.createBuffer();if(!k)return console.error("Failed to create position buffer."),null;e.bindBuffer(e.ARRAY_BUFFER,k);const L=[-1,-1,1,-1,-1,1,-1,1,1,-1,1,1];return e.bufferData(e.ARRAY_BUFFER,new Float32Array(L),e.STATIC_DRAW),{gl:e,program:i,positionBuffer:k,positionAttributeLocation:f,uniformLocations:x}}catch(o){return console.error("Failed to initialize WebGL program:",o),null}}function C(e){if(!d(t))return;const{gl:o,program:u,uniformLocations:i}=d(t);o.useProgram(u),o.uniform3fv(i.gasColor1,e.gasColor1),o.uniform3fv(i.gasColor2,e.gasColor2),o.uniform3fv(i.gasColorDark,e.gasColorDark),o.uniform1f(i.flowSpeed,e.flowSpeed),o.uniform1f(i.noiseScale,e.noiseScale),o.uniform1f(i.voidScale,e.voidScale),o.uniform1f(i.voidDensity,e.voidDensity),o.uniform1f(i.voidCycleSpeed,e.voidCycleSpeed),o.uniform1f(i.vignetteStrength,e.vignetteStrength)}function P(e){if(!d(t)||!d(b))return;const{gl:o,program:u,positionBuffer:i,positionAttributeLocation:f,uniformLocations:x}=d(t),k=e*.001;d(r)===0&&W(r,k);const L=k-d(r);o.clearColor(0,0,0,0),o.clear(o.COLOR_BUFFER_BIT),o.useProgram(u),o.enableVertexAttribArray(f),o.bindBuffer(o.ARRAY_BUFFER,i),o.vertexAttribPointer(f,2,o.FLOAT,!1,0,0),o.uniform1f(x.time,L),o.drawArrays(o.TRIANGLES,0,6),W(g,requestAnimationFrame(P),!0)}function E(){if(!d(n))return;const e=d(n).clientWidth,o=d(n).clientHeight;if(d(n).width!==e||d(n).height!==o||!d(b)){if(d(n).width=e,d(n).height=o,(!d(t)||d(t).gl.isContextLost())&&(W(t,$(),!0),!d(t))){W(b,!1);return}W(b,!0);const{gl:u,program:i,uniformLocations:f}=d(t);u.viewport(0,0,u.drawingBufferWidth,u.drawingBufferHeight),u.useProgram(i),u.uniform2f(f.resolution,u.drawingBufferWidth,u.drawingBufferHeight)}}function R(){if(cancelAnimationFrame(d(g)),W(b,!1),d(t)){const{gl:e,program:o,positionBuffer:u}=d(t);u&&e.deleteBuffer(u);const i=e.getAttachedShaders(o);i==null||i.forEach(f=>{e.detachShader(o,f),e.deleteShader(f)}),e.deleteProgram(o)}W(t,null)}function M(){W(g,requestAnimationFrame(P),!0)}return{get canvas(){return d(n)},set canvas(e){W(n,e,!0)},get isInitialized(){return d(b)},updateUniforms:C,resize:E,cleanup:R,startRendering:M}}var ut=m('<canvas style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: block; z-index: 0;"></canvas>');function ft(n,t){ce(t,!0);const g=D(t,"gasColor1",19,()=>[.1,.3,.7]),r=D(t,"gasColor2",19,()=>[.3,.6,.9]),b=D(t,"gasColorDark",19,()=>[.01,.02,.05]),$=D(t,"flowSpeed",3,1.5),C=D(t,"noiseScale",3,2.5),P=D(t,"voidScale",3,4),E=D(t,"voidDensity",3,.4),R=D(t,"voidCycleSpeed",3,.6),M=D(t,"vignetteStrength",3,.65);let e;const o=vt();Se(()=>{o.canvas=e}),Se(()=>{o.isInitialized&&o.updateUniforms({gasColor1:g(),gasColor2:r(),gasColorDark:b(),flowSpeed:$(),noiseScale:C(),voidScale:P(),voidDensity:E(),voidCycleSpeed:R(),vignetteStrength:M()})}),Oe(()=>(o.resize(),o.startRendering(),o.cleanup));var u=ut();ze("resize",Fe,function(...i){var f;(f=o.resize)==null||f.apply(this,i)}),Ve(u,i=>e=i,()=>e),s(n,u),de()}var mt=m(`<ul class="svelte-swsm47"><li class="svelte-swsm47">Led a zero-downtime migration of 3 microservices and approximately 1 TB of data from
								a MongoDB replica set to a sharded cluster</li> <li class="svelte-swsm47">Improved platform performance by optimizing bottleneck queries, reducing p95 latency
								by 5 to 10 times</li> <li class="svelte-swsm47">Designed and implemented a fault-tolerant architecture in Kotlin and C# for 4
								real-time audience segmentation microservices, processing ~10,000 events per second</li> <li class="svelte-swsm47">Delivered a segmentation feature that replaced an external product via "dogfooding".</li> <li class="svelte-swsm47">Developed internal CLI and CI/CD tools, replacing manual work with automation</li></ul>`),gt=m(`<ul class="svelte-swsm47"><li class="svelte-swsm47">Integrated a RESTful microservice connecting Veeam Backup for Microsoft Azure with
								Veeam Backup & Replication using C#, .NET Core 3.1, ASP.NET Core, and
								Swagger-documented APIs</li> <li class="svelte-swsm47">Engineered an event-driven pipeline ensuring sub-1-second for daily entity updates,
								maintaining eventual data consistency through SignalR, PostgreSQL, and Entity
								Framework Core</li> <li class="svelte-swsm47">Implemented a real-time notification center in the web UI, reducing status-check
								time from 6 clicks to a single click via React, TypeScript, and SignalR</li></ul>`),pt=m(`<ul class="svelte-swsm47"><li class="svelte-swsm47">Delivered 5 enterprise features for Kontur Extern using C#/.NET and React,
								supporting over 800,000 B2B clients</li> <li class="svelte-swsm47">Refactored the monolithic backend by replacing global context with scoped services
								in ASP.NET, enabling batch processing of 1,000+ documents per request</li> <li class="svelte-swsm47">Migrated legacy JavaScript UI to React, Redux, and TypeScript, cutting feature
								delivery time by 6 to 10 hours per task</li></ul>`),ht=m(`<ul class="svelte-swsm47"><li class="svelte-swsm47">Optimized the rendering pipeline of a Xamarin.Forms Android app, increasing frame
								rate from 30–35 fps to a steady 55–60 fps (+70%), significantly enhancing user
								experience</li> <li class="svelte-swsm47">Implemented custom caching and full offline mode using Realm database, reducing
								remote API calls and improving load times</li> <li class="svelte-swsm47">Refactored legacy code to clean MVVM architecture, shortening feature lead time and
								boosting unit-test coverage to nearly 90%</li></ul>`),_t=m(`<ul class="svelte-swsm47"><li class="svelte-swsm47">Engineered a push-based scheduling daemon, reducing client polling traffic by
								approximately 80%</li> <li class="svelte-swsm47">Developed self-service admin panels, enabling support staff to resolve ~90% of
								common tickets without engineering involvement</li> <li class="svelte-swsm47">Refactored a jQuery codebase to Knockout.js (MVVM), halving front-end defect rates
								and accelerating feature delivery</li> <li class="svelte-swsm47">Optimized heavy LINQ queries in Entity Framework for Oracle, cutting average latency
								from 1 minute to 4–5 seconds</li></ul>`),bt=m(`<ul class="svelte-swsm47"><li class="svelte-swsm47">Developed a jQuery-based WYSIWYG admin panel for the XSUD project blog and
								introduced semantic versioning of post markup in ASP.NET MVC, reducing publishing
								time and increasing click-through rates by approximately 35% within 4 months</li> <li class="svelte-swsm47">Designed and launched an offline-capable Android app for the Safe-Childhood Map
								project within 2 months</li> <li class="svelte-swsm47">Refactored CPU-heavy business logic into parameterized Microsoft SQL Server stored
								procedures, reducing p95 latency from 30 seconds to under 5 seconds</li></ul>`),wt=m("<!> <!> <!> <!> <!> <!>",1),yt=m('<div class="interest-icon books svelte-swsm47">📚</div> <h3 class="section-title svelte-swsm47">Reading</h3> <p class="svelte-swsm47">I enjoy reading books on technology, science, and other topics to learn new things.</p>',1),St=m('<div class="interest-icon climbing svelte-swsm47">🧗</div> <h3 class="section-title svelte-swsm47">Rock Climbing</h3> <p class="svelte-swsm47">I like rock climbing to stay active and enjoy the outdoors.</p>',1),$t=m('<div class="interest-icon skiing svelte-swsm47">⛷️</div> <h3 class="section-title svelte-swsm47">Mountain Skiing</h3> <p class="svelte-swsm47">I enjoy mountain skiing in the winter.</p>',1),kt=m(`<h3 class="section-title svelte-swsm47">Advent of Code</h3> <p class="svelte-swsm47">I've completed multiple years of Advent of Code challenges:</p> <div class="badge-container svelte-swsm47"><!> <!> <!> <!> <!></div>`,1),Ct=m(`<h3 class="section-title svelte-swsm47">LeetCode</h3> <p class="svelte-swsm47">I practice algorithmic problem solving on LeetCode to improve my coding efficiency and
							understanding of data structures.</p> <div class="badge-container svelte-swsm47"><!></div>`,1),xt=m(`<div class="about-page svelte-swsm47"><header class="about-header svelte-swsm47"><!> <h1 class="space-title svelte-swsm47">About Me</h1></header> <div class="about-content svelte-swsm47"><section class="intro-section svelte-swsm47"><div class="avatar-container svelte-swsm47"><img src="/images/ava.jpg" alt="Avatar" class="avatar svelte-swsm47" loading="lazy"> <div class="avatar-ring svelte-swsm47"></div></div> <div class="intro-text svelte-swsm47"><h2 class="space-heading svelte-swsm47"> </h2> <p class="tagline svelte-swsm47">Senior Software Engineer</p> <div class="intro-text-content svelte-swsm47"><p class="svelte-swsm47">I've been programming for fun and profit since 2014, focusing on distributed systems
							and highload applications. My main stack is <b class="svelte-swsm47">C#</b>, <b class="svelte-swsm47">Kotlin</b>, and <b class="svelte-swsm47">TypeScript</b>, but I'm also proficient in <b class="svelte-swsm47">Go</b>.</p> <p class="svelte-swsm47"><b class="svelte-swsm47">Fun fact:</b> I was born on the 11th of April, just a day before Yuri Gagarin's flight.
							Poehali! 🚀</p></div></div> <div class="contact-information svelte-swsm47"><div class="button-group svelte-swsm47"><!> <!> <!></div></div></section> <section class="svelte-swsm47"><h2 class="space-heading svelte-swsm47">My Journey</h2> <!></section> <section class="svelte-swsm47"><h2 class="space-heading svelte-swsm47">Professional Interests</h2> <!></section> <section class="svelte-swsm47"><h2 class="space-heading svelte-swsm47">Personal Projects</h2> <div class="card-grid svelte-swsm47"><!> <!> <!></div></section> <section class="svelte-swsm47"><h2 class="space-heading svelte-swsm47">Hobbies & Interests</h2> <div class="card-grid svelte-swsm47"><!> <!> <!></div></section> <section class="svelte-swsm47"><h2 class="space-heading svelte-swsm47">Programming Challenges</h2> <p class="svelte-swsm47">I enjoy participating in coding challenges to sharpen my skills and explore new
					programming concepts.</p> <div class="card-grid svelte-swsm47"><!> <!></div></section></div></div>`),Pt=m("<!> <!>",1);function Bt(n,t){ce(t,!1),Pe();var g=Pt(),r=te(g);const b=$e(()=>`Learn about ${Z.fullName}, Senior Software Engineer at Infobip. Programming since 2014, specializing in distributed systems, C#, Go, and highload applications. Previously at Veeam and SkbKontur.`);He(r,{title:"About Me",get description(){return d(b)},url:"/about",keywords:["about","software engineer","career","experience","distributed systems"]});var $=a(r,2);Ge($,{children:(C,P)=>{var E=xt(),R=c(E),M=c(R);ft(M,{}),S(2),l(R);var e=a(R,2),o=c(e),u=a(c(o),2),i=c(u),f=c(i);l(i),S(4),l(u);var x=a(u,2),k=c(x),L=c(k);const O=$e(()=>`mailto:${Z.social.email}`);B(L,{get href(){return d(O)},external:!0,children:(_,I)=>{S();var p=A();U(()=>j(p,Z.social.email)),s(_,p)},$$slots:{default:!0}});var T=a(L,2);B(T,{get href(){return Z.social.github},external:!0,children:(_,I)=>{S();var p=A("GitHub");s(_,p)},$$slots:{default:!0}});var F=a(T,2);B(F,{get href(){return Z.social.linkedIn},external:!0,children:(_,I)=>{S();var p=A("LinkedIn");s(_,p)},$$slots:{default:!0}}),l(k),l(x),l(o);var z=a(o,2),fe=a(c(z),2);Ze(fe,{children:(_,I)=>{var p=wt(),Q=te(p);ne(Q,{date:"August 2020–present",title:"Infobip",role:"Senior Software Engineer",companyDescription:"Infobip is a global Communications-Platform-as-a-Service (CPaaS) provider offering APIs for messaging, voice, video, and contact center services.",companyUrl:"https://www.infobip.com/",technologies:["C#","Kotlin","Go","TypeScript","React","ASP.NET","Spring Boot","Kafka","MongoDB"],children:(w,V)=>{var y=mt();s(w,y)},$$slots:{default:!0}});var Y=a(Q,2);ne(Y,{date:"August 2019–August 2020",title:"Veeam Software",role:"Software Engineer",companyDescription:"Veeam Software is the global leader in backup and data recovery solutions for virtual machines, serving over 550,000 customers across more than 30 countries.",companyUrl:"https://www.veeam.com/",technologies:["C#","Azure","TypeScript","React","ASP.NET","PostgreSQL"],children:(w,V)=>{var y=gt();s(w,y)},$$slots:{default:!0}});var J=a(Y,2);ne(J,{date:"October 2017–August 2019",title:"Kontur",role:"Software Engineer",companyDescription:"Kontur is Russia's second-largest SaaS provider, offering 70+ cloud services for accounting, compliance, and e-government to 2.2 million business customers in Russia and abroad.",companyUrl:"https://kontur.ru/",technologies:["C#",".NET Framework","TypeScript","React","ASP.NET","WCF","MSSQL Server"],children:(w,V)=>{var y=pt();s(w,y)},$$slots:{default:!0}});var ae=a(J,2);ne(ae,{date:"April 2018–December 2019",title:"Freelancing",role:"Software Engineer",companyDescription:"Independent contractor working on mobile application development.",companyUrl:"https://www.upwork.com/",technologies:["C#","Xamarin","Android","Realm","MVVM"],children:(w,V)=>{var y=ht();s(w,y)},$$slots:{default:!0}});var X=a(ae,2);ne(X,{date:"October 2015–August 2017",title:"PRO IT",role:"Software Developer",companyDescription:"PRO IT is a Russian software company developing web-based electronic document workflow systems for government agencies, employing over 100 staff.",technologies:["C#",".NET Framework","ASP.NET","React","MSSQL Server","LINQ"],children:(w,V)=>{var y=_t();s(w,y)},$$slots:{default:!0}});var ve=a(X,2);ne(ve,{date:"December 2014–October 2015",title:"Kai Development",role:"Junior Software Engineer",companyDescription:"Kai Development is a Russian software engineering studio specializing in web-based business and government automation. Since 2007, the company has delivered 45+ projects, including the legal-tech spin-off XSUD for Russian ministries and major corporations.",companyUrl:"https://kaidev.ru/",technologies:["C#",".NET Framework","PHP","JavaScript","Java","Android","MSSQL Server","Transact-SQL"],children:(w,V)=>{var y=bt();s(w,y)},$$slots:{default:!0}}),s(_,p)},$$slots:{default:!0}}),l(z);var ie=a(z,2),me=a(c(ie),2);ee(me,{variant:"default",children:(_,I)=>{We(_,{get tags(){return Z.interests}})},$$slots:{default:!0}}),l(ie);var v=a(ie,2),h=a(c(v),2),N=c(h);ge(N,{title:"CarryFit",href:"https://carryon.fit/",icon:"/images/projects/carryfit.png",technologies:["Svelte 5","TailwindCSS","TypeScript"],children:(_,I)=>{S();var p=A(`An online tool that helps travelers check if their carry-on luggage meets size
						requirements for different airlines worldwide. Simply enter your bag's dimensions to
						instantly see which of 150+ airlines will accept it as cabin baggage.`);s(_,p)},$$slots:{default:!0}});var G=a(N,2);ge(G,{title:"HumbleHire",href:"http://humblehire.maltsev.space/",icon:"/images/projects/humble-hire.png",technologies:["Svelte 5","TailwindCSS","TypeScript"],children:(_,I)=>{S();var p=A(`A small, growing collection of helpers to make your profile look great and your
						application flow smoother.`);s(_,p)},$$slots:{default:!0}});var oe=a(G,2);ge(oe,{title:"MongoTransit",href:"https://github.com/AxelUser/MongoTransit",icon:"🔄",technologies:["C#","MongoDB"],children:(_,I)=>{S();var p=A(`A tool for automatic replication of documents between MongoDB clusters. Supports
						iterative transfers, sharded collections, and configurable synchronization parameters,
						making it ideal for database migrations and data synchronization tasks.`);s(_,p)},$$slots:{default:!0}}),l(h),l(v);var se=a(v,2),re=a(c(se),2),pe=c(re);ee(pe,{children:(_,I)=>{var p=yt();S(4),s(_,p)},$$slots:{default:!0}});var he=a(pe,2);ee(he,{children:(_,I)=>{var p=St();S(4),s(_,p)},$$slots:{default:!0}});var Re=a(he,2);ee(Re,{children:(_,I)=>{var p=$t();S(4),s(_,p)},$$slots:{default:!0}}),l(re),l(se);var _e=a(se,2),be=a(c(_e),4),we=c(be);ee(we,{variant:"default",children:(_,I)=>{var p=kt(),Q=a(te(p),4),Y=c(Q);q(Y,{interactive:!0,children:(w,V)=>{B(w,{href:"https://github.com/AxelUser/aoc-2023-kt",external:!0,children:(y,ue)=>{S();var H=A("2023");s(y,H)},$$slots:{default:!0}})},$$slots:{default:!0}});var J=a(Y,2);q(J,{interactive:!0,children:(w,V)=>{B(w,{href:"https://github.com/AxelUser/aoc-2022",external:!0,children:(y,ue)=>{S();var H=A("2022");s(y,H)},$$slots:{default:!0}})},$$slots:{default:!0}});var ae=a(J,2);q(ae,{interactive:!0,children:(w,V)=>{B(w,{href:"https://github.com/AxelUser/aoc-2021",external:!0,children:(y,ue)=>{S();var H=A("2021");s(y,H)},$$slots:{default:!0}})},$$slots:{default:!0}});var X=a(ae,2);q(X,{interactive:!0,children:(w,V)=>{B(w,{href:"https://github.com/AxelUser/AdventOfCode2020",external:!0,children:(y,ue)=>{S();var H=A("2020");s(y,H)},$$slots:{default:!0}})},$$slots:{default:!0}});var ve=a(X,2);q(ve,{interactive:!0,children:(w,V)=>{B(w,{href:"https://github.com/AxelUser/advent-of-code-2017",external:!0,children:(y,ue)=>{S();var H=A("2017");s(y,H)},$$slots:{default:!0}})},$$slots:{default:!0}}),l(Q),s(_,p)},$$slots:{default:!0}});var Te=a(we,2);ee(Te,{variant:"default",children:(_,I)=>{var p=Ct(),Q=a(te(p),4),Y=c(Q);q(Y,{interactive:!0,children:(J,ae)=>{B(J,{href:"https://github.com/AxelUser/leetcode-kt",external:!0,children:(X,ve)=>{S();var w=A("View Solutions");s(X,w)},$$slots:{default:!0}})},$$slots:{default:!0}}),l(Q),s(_,p)},$$slots:{default:!0}}),l(be),l(_e),l(e),l(E),U(()=>j(f,`Hello, I'm ${Z.fullName}`)),s(C,E)}}),s(n,g),de()}export{Bt as component};
