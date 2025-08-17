import{c as Ce,a as o,t as m,b as x}from"../chunks/Ix_iQA8O.js";import{I as Pe,d as Se,e as Ae,i as De}from"../chunks/Cbg54n8Y.js";import{h as Re,d as Te,p as ce,f as z,a as Ne,b as ve,c,r as d,s as t,t as Y,n as g,g as p,w as le,v as K,q as be,ap as Le,ah as ke}from"../chunks/Dkazavay.js";import{j as Ee,r as Ie,p as R,i as oe,s as J,e as Ue,c as Me}from"../chunks/FC-Yzx7w.js";import{o as Fe}from"../chunks/gL4yRitO.js";import{b as Z}from"../chunks/DasYoi_Y.js";import{s as Be,O as je}from"../chunks/CgpvT9E8.js";import{B as D,C as Q}from"../chunks/BBRK2HUr.js";import{L as U}from"../chunks/BhAgQEr3.js";import{S as ze}from"../chunks/1kdzElit.js";import{T as Ve}from"../chunks/CvRyeYg0.js";function $e(i,n,b,v,$){var E;Re&&Te();var C=(E=n.$$slots)==null?void 0:E[b],T=!1;C===!0&&(C=n.children,T=!0),C===void 0||C(i,T?()=>v:v)}function Oe(i,n){ce(n,!0);let b=Ie(n,["$$slots","$$events","$$legacy"]);Pe(i,Ee({name:"external-link"},()=>b,{iconNode:[["path",{d:"M15 3h6v6"}],["path",{d:"M10 14 21 3"}],["path",{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"}]],children:($,C)=>{var T=Ce(),E=z(T);Be(E,()=>n.children??Ne),o($,T)},$$slots:{default:!0}})),ve()}var He=m('<div class="timeline svelte-19j4pht"><!></div>');function Ge(i,n){var b=He(),v=c(b);$e(v,n,"default",{}),d(b),o(i,b)}var Ke=m('<span class="timeline-date svelte-1b8k43k"> </span>'),Qe=m('<span class="separator svelte-1b8k43k">•</span>'),We=m(" <!>",1),Ye=m('<span class="company-name svelte-1b8k43k"> </span>'),Je=m('<span class="separator svelte-1b8k43k">•</span> <span class="role svelte-1b8k43k"> </span>',1),Xe=m('<p class="company-description svelte-1b8k43k"> </p>'),Ze=m('<div class="badge-container svelte-1b8k43k"></div>'),et=m('<div class="timeline-item svelte-1b8k43k"><div class="timeline-dot svelte-1b8k43k"></div> <div class="timeline-content"><div class="timeline-header svelte-1b8k43k"><!> <!> <!> <!></div> <!> <div class="timeline-body svelte-1b8k43k"><!></div> <!></div></div>');function ae(i,n){ce(n,!1);let b=R(n,"date",8,void 0),v=R(n,"technologies",24,()=>[]),$=R(n,"title",8),C=R(n,"role",8,void 0),T=R(n,"companyDescription",8,void 0),E=R(n,"companyUrl",8,void 0);Se();var F=et(),j=t(c(F),2),V=c(j),e=c(V);{var a=u=>{var y=Ke(),N=c(y,!0);d(y),Y(()=>J(N,b())),o(u,y)};oe(e,u=>{b()&&u(a)})}var h=t(e,2);{var s=u=>{var y=Qe();o(u,y)};oe(h,u=>{b()&&($()||C())&&u(s)})}var w=t(h,2);{var O=u=>{U(u,{get href(){return E()},external:!0,class:"company-link",children:(y,N)=>{g();var H=We(),ee=z(H),te=t(ee);Oe(te,{size:14,class:"external-link-icon"}),Y(()=>J(ee,`${$()??""} `)),o(y,H)},$$slots:{default:!0}})},B=u=>{var y=Ye(),N=c(y,!0);d(y),Y(()=>J(N,$())),o(u,y)};oe(w,u=>{E()?u(O):u(B,!1)})}var W=t(w,2);{var ne=u=>{var y=Je(),N=t(z(y),2),H=c(N,!0);d(N),Y(()=>J(H,C())),o(u,y)};oe(W,u=>{C()&&$()&&u(ne)})}d(V);var re=t(V,2);{var ue=u=>{var y=Xe(),N=c(y,!0);d(y),Y(()=>J(N,T())),o(u,y)};oe(re,u=>{T()&&u(ue)})}var X=t(re,2),fe=c(X);$e(fe,n,"default",{}),d(X);var ie=t(X,2);{var pe=u=>{var y=Ze();Ae(y,5,v,De,(N,H)=>{D(N,{children:(ee,te)=>{g();var se=x();Y(()=>J(se,p(H))),o(ee,se)},$$slots:{default:!0}})}),d(y),o(u,y)};oe(ie,u=>{v().length>0&&u(pe)})}d(j),d(F),o(i,F),ve()}const tt=`attribute vec2 a_position;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
} `,ot=`/**
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
}`;function xe(i,n,b){const v=i.createShader(n);if(i.shaderSource(v,b),i.compileShader(v),!i.getShaderParameter(v,i.COMPILE_STATUS))throw console.error("Shader compilation error:",i.getShaderInfoLog(v)),i.deleteShader(v),new Error("Shader compilation failed");return v}function at(i,n,b){const v=i.createProgram();if(i.attachShader(v,n),i.attachShader(v,b),i.linkProgram(v),!i.getProgramParameter(v,i.LINK_STATUS))throw console.error("Program linking error:",i.getProgramInfoLog(v)),i.deleteProgram(v),new Error("Program linking failed");return v}function nt(){let i=le(null),n=le(null),b=le(0),v=le(0),$=le(!1);function C(){if(!p(i))return null;const e=p(i).getContext("webgl",{preserveDrawingBuffer:!1,antialias:!0});if(!e)return console.error("WebGL not supported or context creation failed."),null;try{const a=xe(e,e.VERTEX_SHADER,tt),h=xe(e,e.FRAGMENT_SHADER,ot),s=at(e,a,h);e.enable(e.BLEND),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA);const w=e.getAttribLocation(s,"a_position"),O={resolution:e.getUniformLocation(s,"u_resolution"),time:e.getUniformLocation(s,"u_time"),gasColor1:e.getUniformLocation(s,"u_gasColor1"),gasColor2:e.getUniformLocation(s,"u_gasColor2"),gasColorDark:e.getUniformLocation(s,"u_gasColorDark"),flowSpeed:e.getUniformLocation(s,"u_flowSpeed"),noiseScale:e.getUniformLocation(s,"u_noiseScale"),voidScale:e.getUniformLocation(s,"u_voidScale"),voidDensity:e.getUniformLocation(s,"u_voidDensity"),voidCycleSpeed:e.getUniformLocation(s,"u_voidCycleSpeed"),vignetteStrength:e.getUniformLocation(s,"u_vignetteStrength")};if(w===-1||Object.values(O).some(ne=>!ne))return console.error("Failed to get some shader variable locations."),null;const B=e.createBuffer();if(!B)return console.error("Failed to create position buffer."),null;e.bindBuffer(e.ARRAY_BUFFER,B);const W=[-1,-1,1,-1,-1,1,-1,1,1,-1,1,1];return e.bufferData(e.ARRAY_BUFFER,new Float32Array(W),e.STATIC_DRAW),{gl:e,program:s,positionBuffer:B,positionAttributeLocation:w,uniformLocations:O}}catch(a){return console.error("Failed to initialize WebGL program:",a),null}}function T(e){if(!p(n))return;const{gl:a,program:h,uniformLocations:s}=p(n);a.useProgram(h),a.uniform3fv(s.gasColor1,e.gasColor1),a.uniform3fv(s.gasColor2,e.gasColor2),a.uniform3fv(s.gasColorDark,e.gasColorDark),a.uniform1f(s.flowSpeed,e.flowSpeed),a.uniform1f(s.noiseScale,e.noiseScale),a.uniform1f(s.voidScale,e.voidScale),a.uniform1f(s.voidDensity,e.voidDensity),a.uniform1f(s.voidCycleSpeed,e.voidCycleSpeed),a.uniform1f(s.vignetteStrength,e.vignetteStrength)}function E(e){if(!p(n)||!p($))return;const{gl:a,program:h,positionBuffer:s,positionAttributeLocation:w,uniformLocations:O}=p(n),B=e*.001;p(v)===0&&K(v,B);const W=B-p(v);a.clearColor(0,0,0,0),a.clear(a.COLOR_BUFFER_BIT),a.useProgram(h),a.enableVertexAttribArray(w),a.bindBuffer(a.ARRAY_BUFFER,s),a.vertexAttribPointer(w,2,a.FLOAT,!1,0,0),a.uniform1f(O.time,W),a.drawArrays(a.TRIANGLES,0,6),K(b,requestAnimationFrame(E),!0)}function F(){if(!p(i))return;const e=p(i).clientWidth,a=p(i).clientHeight;if(p(i).width!==e||p(i).height!==a||!p($)){if(p(i).width=e,p(i).height=a,(!p(n)||p(n).gl.isContextLost())&&(K(n,C(),!0),!p(n))){K($,!1);return}K($,!0);const{gl:h,program:s,uniformLocations:w}=p(n);h.viewport(0,0,h.drawingBufferWidth,h.drawingBufferHeight),h.useProgram(s),h.uniform2f(w.resolution,h.drawingBufferWidth,h.drawingBufferHeight)}}function j(){if(cancelAnimationFrame(p(b)),K($,!1),p(n)){const{gl:e,program:a,positionBuffer:h}=p(n);h&&e.deleteBuffer(h);const s=e.getAttachedShaders(a);s==null||s.forEach(w=>{e.detachShader(a,w),e.deleteShader(w)}),e.deleteProgram(a)}K(n,null)}function V(){K(b,requestAnimationFrame(E),!0)}return{get canvas(){return p(i)},set canvas(e){K(i,e,!0)},get isInitialized(){return p($)},updateUniforms:T,resize:F,cleanup:j,startRendering:V}}var rt=m('<canvas style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: block; z-index: 0;"></canvas>');function it(i,n){ce(n,!0);const b=R(n,"gasColor1",19,()=>[.1,.3,.7]),v=R(n,"gasColor2",19,()=>[.3,.6,.9]),$=R(n,"gasColorDark",19,()=>[.01,.02,.05]),C=R(n,"flowSpeed",3,1.5),T=R(n,"noiseScale",3,2.5),E=R(n,"voidScale",3,4),F=R(n,"voidDensity",3,.4),j=R(n,"voidCycleSpeed",3,.6),V=R(n,"vignetteStrength",3,.65);let e;const a=nt();be(()=>{a.canvas=e}),be(()=>{a.isInitialized&&a.updateUniforms({gasColor1:b(),gasColor2:v(),gasColorDark:$(),flowSpeed:C(),noiseScale:T(),voidScale:E(),voidDensity:F(),voidCycleSpeed:j(),vignetteStrength:V()})}),Fe(()=>(a.resize(),a.startRendering(),a.cleanup));var h=rt();Ue("resize",Le,function(...s){var w;(w=a.resize)==null||w.apply(this,s)}),Me(h,s=>e=s,()=>e),o(i,h),ve()}var st=m(`<ul class="svelte-1vydkqx"><li class="svelte-1vydkqx">Led a zero-downtime migration of 3 microservices and approximately 1 TB of data from
								a MongoDB replica set to a sharded cluster</li> <li class="svelte-1vydkqx">Improved platform performance by optimizing bottleneck queries, reducing p95 latency
								by 5 to 10 times</li> <li class="svelte-1vydkqx">Designed and implemented a fault-tolerant architecture in Kotlin and C# for 4
								real-time audience segmentation microservices, processing ~10,000 events per second</li> <li class="svelte-1vydkqx">Delivered a segmentation feature that replaced an external product via "dogfooding".</li> <li class="svelte-1vydkqx">Developed internal CLI and CI/CD tools, replacing manual work with automation</li></ul>`),lt=m(`<ul class="svelte-1vydkqx"><li class="svelte-1vydkqx">Integrated a RESTful microservice connecting Veeam Backup for Microsoft Azure with
								Veeam Backup & Replication using C#, .NET Core 3.1, ASP.NET Core, and
								Swagger-documented APIs</li> <li class="svelte-1vydkqx">Engineered an event-driven pipeline ensuring sub-1-second for daily entity updates,
								maintaining eventual data consistency through SignalR, PostgreSQL, and Entity
								Framework Core</li> <li class="svelte-1vydkqx">Implemented a real-time notification center in the web UI, reducing status-check
								time from 6 clicks to a single click via React, TypeScript, and SignalR</li></ul>`),dt=m(`<ul class="svelte-1vydkqx"><li class="svelte-1vydkqx">Delivered 5 enterprise features for Kontur Extern using C#/.NET and React,
								supporting over 800,000 B2B clients</li> <li class="svelte-1vydkqx">Refactored the monolithic backend by replacing global context with scoped services
								in ASP.NET, enabling batch processing of 1,000+ documents per request</li> <li class="svelte-1vydkqx">Migrated legacy JavaScript UI to React, Redux, and TypeScript, cutting feature
								delivery time by 6 to 10 hours per task</li></ul>`),ct=m(`<ul class="svelte-1vydkqx"><li class="svelte-1vydkqx">Optimized the rendering pipeline of a Xamarin.Forms Android app, increasing frame
								rate from 30–35 fps to a steady 55–60 fps (+70%), significantly enhancing user
								experience</li> <li class="svelte-1vydkqx">Implemented custom caching and full offline mode using Realm database, reducing
								remote API calls and improving load times</li> <li class="svelte-1vydkqx">Refactored legacy code to clean MVVM architecture, shortening feature lead time and
								boosting unit-test coverage to nearly 90%</li></ul>`),vt=m(`<ul class="svelte-1vydkqx"><li class="svelte-1vydkqx">Engineered a push-based scheduling daemon, reducing client polling traffic by
								approximately 80%</li> <li class="svelte-1vydkqx">Developed self-service admin panels, enabling support staff to resolve ~90% of
								common tickets without engineering involvement</li> <li class="svelte-1vydkqx">Refactored a jQuery codebase to Knockout.js (MVVM), halving front-end defect rates
								and accelerating feature delivery</li> <li class="svelte-1vydkqx">Optimized heavy LINQ queries in Entity Framework for Oracle, cutting average latency
								from 1 minute to 4–5 seconds</li></ul>`),ut=m(`<ul class="svelte-1vydkqx"><li class="svelte-1vydkqx">Developed a jQuery-based WYSIWYG admin panel for the XSUD project blog and
								introduced semantic versioning of post markup in ASP.NET MVC, reducing publishing
								time and increasing click-through rates by approximately 35% within 4 months</li> <li class="svelte-1vydkqx">Designed and launched an offline-capable Android app for the Safe-Childhood Map
								project within 2 months</li> <li class="svelte-1vydkqx">Refactored CPU-heavy business logic into parameterized Microsoft SQL Server stored
								procedures, reducing p95 latency from 30 seconds to under 5 seconds</li></ul>`),ft=m("<!> <!> <!> <!> <!> <!>",1),pt=m(`<div class="project-icon svelte-1vydkqx"><img src="/images/projects/carryfit.png" alt="CarryFit icon" loading="lazy" class="svelte-1vydkqx"></div> <h3 class="section-title svelte-1vydkqx">CarryFit</h3> <p class="svelte-1vydkqx">An online tool that helps travelers check if their carry-on luggage meets size
							requirements for different airlines worldwide. Simply enter your bag's dimensions to
							instantly see which of 150+ airlines will accept it as cabin baggage.</p> <div class="badge-container svelte-1vydkqx"><!> <!> <!></div> <div class="project-link svelte-1vydkqx"><!></div>`,1),gt=m(`<div class="project-icon svelte-1vydkqx"><img src="/images/projects/humble-hire.png" alt="HumbleHire icon" loading="lazy" class="svelte-1vydkqx"></div> <h3 class="section-title svelte-1vydkqx">HumbleHire</h3> <p class="svelte-1vydkqx">A small, growing collection of helpers to make your profile look great and your
							application flow smoother.</p> <div class="badge-container svelte-1vydkqx"><!> <!> <!></div> <div class="project-link svelte-1vydkqx"><!></div>`,1),mt=m(`<div class="project-icon svelte-1vydkqx">🔄</div> <h3 class="section-title svelte-1vydkqx">MongoTransit</h3> <p class="svelte-1vydkqx">A tool for automatic replication of documents between MongoDB clusters. Supports
							iterative transfers, sharded collections, and configurable synchronization parameters,
							making it ideal for database migrations and data synchronization tasks.</p> <div class="badge-container svelte-1vydkqx"><!> <!></div> <div class="project-link svelte-1vydkqx"><!></div>`,1),ht=m('<div class="interest-icon books svelte-1vydkqx">📚</div> <h3 class="section-title svelte-1vydkqx">Reading</h3> <p class="svelte-1vydkqx">I enjoy reading books on technology, science, and other topics to learn new things.</p>',1),yt=m('<div class="interest-icon climbing svelte-1vydkqx">🧗</div> <h3 class="section-title svelte-1vydkqx">Rock Climbing</h3> <p class="svelte-1vydkqx">I like rock climbing to stay active and enjoy the outdoors.</p>',1),_t=m('<div class="interest-icon skiing svelte-1vydkqx">⛷️</div> <h3 class="section-title svelte-1vydkqx">Mountain Skiing</h3> <p class="svelte-1vydkqx">I enjoy mountain skiing in the winter.</p>',1),bt=m(`<h3 class="section-title svelte-1vydkqx">Advent of Code</h3> <p class="svelte-1vydkqx">I've completed multiple years of Advent of Code challenges:</p> <div class="badge-container svelte-1vydkqx"><!> <!> <!> <!> <!></div>`,1),kt=m(`<h3 class="section-title svelte-1vydkqx">LeetCode</h3> <p class="svelte-1vydkqx">I practice algorithmic problem solving on LeetCode to improve my coding efficiency and
							understanding of data structures.</p> <div class="badge-container svelte-1vydkqx"><!></div>`,1),xt=m(`<div class="about-page svelte-1vydkqx"><header class="about-header svelte-1vydkqx"><!> <h1 class="space-title svelte-1vydkqx">About Me</h1></header> <div class="about-content svelte-1vydkqx"><section class="intro-section svelte-1vydkqx"><div class="avatar-container svelte-1vydkqx"><img src="/images/ava.jpg" alt="Avatar" class="avatar svelte-1vydkqx" loading="lazy"> <div class="avatar-ring svelte-1vydkqx"></div></div> <div class="intro-text svelte-1vydkqx"><h2 class="space-heading svelte-1vydkqx"> </h2> <p class="tagline svelte-1vydkqx">Senior Software Engineer</p> <div class="intro-text-content svelte-1vydkqx"><p class="svelte-1vydkqx">I've been programming for fun and profit since 2014, focusing on distributed systems
							and highload applications. My main stack is <b class="svelte-1vydkqx">C#</b>, <b class="svelte-1vydkqx">Kotlin</b>, and <b class="svelte-1vydkqx">TypeScript</b>, but I'm also proficient in <b class="svelte-1vydkqx">Go</b>.</p> <p class="svelte-1vydkqx"><b class="svelte-1vydkqx">Fun fact:</b> I was born on the 11th of April, just a day before Yuri Gagarin's flight.
							Poehali! 🚀</p></div></div> <div class="contact-information svelte-1vydkqx"><div class="button-group svelte-1vydkqx"><!> <!> <!></div></div></section> <section class="svelte-1vydkqx"><h2 class="space-heading svelte-1vydkqx">My Journey</h2> <!></section> <section class="svelte-1vydkqx"><h2 class="space-heading svelte-1vydkqx">Professional Interests</h2> <!></section> <section class="svelte-1vydkqx"><h2 class="space-heading svelte-1vydkqx">Personal Projects</h2> <div class="card-grid svelte-1vydkqx"><!> <!> <!></div></section> <section class="svelte-1vydkqx"><h2 class="space-heading svelte-1vydkqx">Hobbies & Interests</h2> <div class="card-grid svelte-1vydkqx"><!> <!> <!></div></section> <section class="svelte-1vydkqx"><h2 class="space-heading svelte-1vydkqx">Programming Challenges</h2> <p class="svelte-1vydkqx">I enjoy participating in coding challenges to sharpen my skills and explore new
					programming concepts.</p> <div class="card-grid svelte-1vydkqx"><!> <!></div></section></div></div>`),St=m("<!> <!>",1);function Et(i,n){ce(n,!1),Se();var b=St(),v=z(b);const $=ke(()=>`Learn about ${Z.fullName}, Senior Software Engineer at Infobip. Programming since 2014, specializing in distributed systems, C#, Go, and highload applications. Previously at Veeam and SkbKontur.`);ze(v,{title:"About Me",get description(){return p($)},url:"/about",keywords:["about","software engineer","career","experience","distributed systems"]});var C=t(v,2);je(C,{children:(T,E)=>{var F=xt(),j=c(F),V=c(j);it(V,{}),g(2),d(j);var e=t(j,2),a=c(e),h=t(c(a),2),s=c(h),w=c(s);d(s),g(4),d(h);var O=t(h,2),B=c(O),W=c(B);const ne=ke(()=>`mailto:${Z.social.email}`);U(W,{get href(){return p(ne)},external:!0,children:(_,M)=>{g();var f=x();Y(()=>J(f,Z.social.email)),o(_,f)},$$slots:{default:!0}});var re=t(W,2);U(re,{get href(){return Z.social.github},external:!0,children:(_,M)=>{g();var f=x("GitHub");o(_,f)},$$slots:{default:!0}});var ue=t(re,2);U(ue,{get href(){return Z.social.linkedIn},external:!0,children:(_,M)=>{g();var f=x("LinkedIn");o(_,f)},$$slots:{default:!0}}),d(B),d(O),d(a);var X=t(a,2),fe=t(c(X),2);Ge(fe,{children:(_,M)=>{var f=ft(),S=z(f);ae(S,{date:"August 2020–present",title:"Infobip",role:"Senior Software Engineer",companyDescription:"Infobip is a global Communications-Platform-as-a-Service (CPaaS) provider offering APIs for messaging, voice, video, and contact center services.",companyUrl:"https://www.infobip.com/",technologies:["C#","Kotlin","Go","TypeScript","React","ASP.NET","Spring Boot","Kafka","MongoDB"],children:(r,k)=>{var l=st();o(r,l)},$$slots:{default:!0}});var q=t(S,2);ae(q,{date:"August 2019–August 2020",title:"Veeam Software",role:"Software Engineer",companyDescription:"Veeam Software is the global leader in backup and data recovery solutions for virtual machines, serving over 550,000 customers across more than 30 countries.",companyUrl:"https://www.veeam.com/",technologies:["C#","Azure","TypeScript","React","ASP.NET","PostgreSQL"],children:(r,k)=>{var l=lt();o(r,l)},$$slots:{default:!0}});var P=t(q,2);ae(P,{date:"October 2017–August 2019",title:"Kontur",role:"Software Engineer",companyDescription:"Kontur is Russia's second-largest SaaS provider, offering 70+ cloud services for accounting, compliance, and e-government to 2.2 million business customers in Russia and abroad.",companyUrl:"https://kontur.ru/",technologies:["C#",".NET Framework","TypeScript","React","ASP.NET","WCF","MSSQL Server"],children:(r,k)=>{var l=dt();o(r,l)},$$slots:{default:!0}});var I=t(P,2);ae(I,{date:"April 2018–December 2019",title:"Freelancing",role:"Software Engineer",companyDescription:"Independent contractor working on mobile application development.",companyUrl:"https://www.upwork.com/",technologies:["C#","Xamarin","Android","Realm","MVVM"],children:(r,k)=>{var l=ct();o(r,l)},$$slots:{default:!0}});var A=t(I,2);ae(A,{date:"October 2015–August 2017",title:"PRO IT",role:"Software Developer",companyDescription:"PRO IT is a Russian software company developing web-based electronic document workflow systems for government agencies, employing over 100 staff.",technologies:["C#",".NET Framework","ASP.NET","React","MSSQL Server","LINQ"],children:(r,k)=>{var l=vt();o(r,l)},$$slots:{default:!0}});var L=t(A,2);ae(L,{date:"December 2014–October 2015",title:"Kai Development",role:"Junior Software Engineer",companyDescription:"Kai Development is a Russian software engineering studio specializing in web-based business and government automation. Since 2007, the company has delivered 45+ projects, including the legal-tech spin-off XSUD for Russian ministries and major corporations.",companyUrl:"https://kaidev.ru/",technologies:["C#",".NET Framework","PHP","JavaScript","Java","Android","MSSQL Server","Transact-SQL"],children:(r,k)=>{var l=ut();o(r,l)},$$slots:{default:!0}}),o(_,f)},$$slots:{default:!0}}),d(X);var ie=t(X,2),pe=t(c(ie),2);Q(pe,{variant:"default",children:(_,M)=>{Ve(_,{get tags(){return Z.interests}})},$$slots:{default:!0}}),d(ie);var u=t(ie,2),y=t(c(u),2),N=c(y);Q(N,{children:(_,M)=>{var f=pt(),S=t(z(f),6),q=c(S);D(q,{children:(r,k)=>{g();var l=x("SvelteKit");o(r,l)},$$slots:{default:!0}});var P=t(q,2);D(P,{children:(r,k)=>{g();var l=x("TailwindCSS");o(r,l)},$$slots:{default:!0}});var I=t(P,2);D(I,{children:(r,k)=>{g();var l=x("TypeScript");o(r,l)},$$slots:{default:!0}}),d(S);var A=t(S,2),L=c(A);U(L,{href:"https://carryon.fit/",external:!0,children:(r,k)=>{g();var l=x("Visit Site");o(r,l)},$$slots:{default:!0}}),d(A),o(_,f)},$$slots:{default:!0}});var H=t(N,2);Q(H,{children:(_,M)=>{var f=gt(),S=t(z(f),6),q=c(S);D(q,{children:(r,k)=>{g();var l=x("Svelte 5");o(r,l)},$$slots:{default:!0}});var P=t(q,2);D(P,{children:(r,k)=>{g();var l=x("TailwindCSS");o(r,l)},$$slots:{default:!0}});var I=t(P,2);D(I,{children:(r,k)=>{g();var l=x("TypeScript");o(r,l)},$$slots:{default:!0}}),d(S);var A=t(S,2),L=c(A);U(L,{href:"http://humblehire.maltsev.space/",external:!0,children:(r,k)=>{g();var l=x("Visit Site");o(r,l)},$$slots:{default:!0}}),d(A),o(_,f)},$$slots:{default:!0}});var ee=t(H,2);Q(ee,{children:(_,M)=>{var f=mt(),S=t(z(f),6),q=c(S);D(q,{children:(L,r)=>{g();var k=x("C#");o(L,k)},$$slots:{default:!0}});var P=t(q,2);D(P,{children:(L,r)=>{g();var k=x("MongoDB");o(L,k)},$$slots:{default:!0}}),d(S);var I=t(S,2),A=c(I);U(A,{href:"https://github.com/AxelUser/MongoTransit",external:!0,children:(L,r)=>{g();var k=x("View on GitHub");o(L,k)},$$slots:{default:!0}}),d(I),o(_,f)},$$slots:{default:!0}}),d(y),d(u);var te=t(u,2),se=t(c(te),2),ge=c(se);Q(ge,{children:(_,M)=>{var f=ht();g(4),o(_,f)},$$slots:{default:!0}});var me=t(ge,2);Q(me,{children:(_,M)=>{var f=yt();g(4),o(_,f)},$$slots:{default:!0}});var we=t(me,2);Q(we,{children:(_,M)=>{var f=_t();g(4),o(_,f)},$$slots:{default:!0}}),d(se),d(te);var he=t(te,2),ye=t(c(he),4),_e=c(ye);Q(_e,{variant:"default",children:(_,M)=>{var f=bt(),S=t(z(f),4),q=c(S);D(q,{interactive:!0,children:(r,k)=>{U(r,{href:"https://github.com/AxelUser/aoc-2023-kt",external:!0,children:(l,de)=>{g();var G=x("2023");o(l,G)},$$slots:{default:!0}})},$$slots:{default:!0}});var P=t(q,2);D(P,{interactive:!0,children:(r,k)=>{U(r,{href:"https://github.com/AxelUser/aoc-2022",external:!0,children:(l,de)=>{g();var G=x("2022");o(l,G)},$$slots:{default:!0}})},$$slots:{default:!0}});var I=t(P,2);D(I,{interactive:!0,children:(r,k)=>{U(r,{href:"https://github.com/AxelUser/aoc-2021",external:!0,children:(l,de)=>{g();var G=x("2021");o(l,G)},$$slots:{default:!0}})},$$slots:{default:!0}});var A=t(I,2);D(A,{interactive:!0,children:(r,k)=>{U(r,{href:"https://github.com/AxelUser/AdventOfCode2020",external:!0,children:(l,de)=>{g();var G=x("2020");o(l,G)},$$slots:{default:!0}})},$$slots:{default:!0}});var L=t(A,2);D(L,{interactive:!0,children:(r,k)=>{U(r,{href:"https://github.com/AxelUser/advent-of-code-2017",external:!0,children:(l,de)=>{g();var G=x("2017");o(l,G)},$$slots:{default:!0}})},$$slots:{default:!0}}),d(S),o(_,f)},$$slots:{default:!0}});var qe=t(_e,2);Q(qe,{variant:"default",children:(_,M)=>{var f=kt(),S=t(z(f),4),q=c(S);D(q,{interactive:!0,children:(P,I)=>{U(P,{href:"https://github.com/AxelUser/leetcode-kt",external:!0,children:(A,L)=>{g();var r=x("View Solutions");o(A,r)},$$slots:{default:!0}})},$$slots:{default:!0}}),d(S),o(_,f)},$$slots:{default:!0}}),d(ye),d(he),d(e),d(F),Y(()=>J(w,`Hello, I'm ${Z.fullName}`)),o(T,F)}}),o(i,b),ve()}export{Et as component};
