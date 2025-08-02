import{c as xe,a as n,t as g,b as k}from"../chunks/Ix_iQA8O.js";import{I as Pe,d as $e,e as Ae,i as De}from"../chunks/Cbg54n8Y.js";import{h as Re,d as Te,p as de,f as K,a as Ne,b as ve,c as d,r as c,s as a,t as J,n as y,g as f,w as le,v as H,q as be,ap as Le,ah as ye}from"../chunks/Dkazavay.js";import{j as Ee,r as Ie,p as P,i as te,s as X,e as Ue,c as Me}from"../chunks/FC-Yzx7w.js";import{o as Fe}from"../chunks/gL4yRitO.js";import{b as ee}from"../chunks/DasYoi_Y.js";import{s as Be,O as Ve}from"../chunks/CgpvT9E8.js";import{B as I,C as Y}from"../chunks/BBRK2HUr.js";import{L as U}from"../chunks/BhAgQEr3.js";import{S as ze}from"../chunks/1kdzElit.js";import{T as je}from"../chunks/CvRyeYg0.js";function we(r,o,_,l,$){var R;Re&&Te();var x=(R=o.$$slots)==null?void 0:R[_],A=!1;x===!0&&(x=o.children,A=!0),x===void 0||x(r,A?()=>l:l)}function Oe(r,o){de(o,!0);let _=Ie(o,["$$slots","$$events","$$legacy"]);Pe(r,Ee({name:"external-link"},()=>_,{iconNode:[["path",{d:"M15 3h6v6"}],["path",{d:"M10 14 21 3"}],["path",{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"}]],children:($,x)=>{var A=xe(),R=K(A);Be(R,()=>o.children??Ne),n($,A)},$$slots:{default:!0}})),ve()}var Ge=g('<div class="timeline svelte-19j4pht"><!></div>');function He(r,o){var _=Ge(),l=d(_);we(l,o,"default",{}),c(_),n(r,_)}var Ke=g('<span class="timeline-date svelte-1b8k43k"> </span>'),Qe=g('<span class="separator svelte-1b8k43k">•</span>'),We=g(" <!>",1),qe=g('<span class="company-name svelte-1b8k43k"> </span>'),Ye=g('<span class="separator svelte-1b8k43k">•</span> <span class="role svelte-1b8k43k"> </span>',1),Je=g('<p class="company-description svelte-1b8k43k"> </p>'),Xe=g('<div class="badge-container svelte-1b8k43k"></div>'),Ze=g('<div class="timeline-item svelte-1b8k43k"><div class="timeline-dot svelte-1b8k43k"></div> <div class="timeline-content"><div class="timeline-header svelte-1b8k43k"><!> <!> <!> <!></div> <!> <div class="timeline-body svelte-1b8k43k"><!></div> <!></div></div>');function oe(r,o){de(o,!1);let _=P(o,"date",8,void 0),l=P(o,"technologies",24,()=>[]),$=P(o,"title",8),x=P(o,"role",8,void 0),A=P(o,"companyDescription",8,void 0),R=P(o,"companyUrl",8,void 0);$e();var M=Ze(),z=a(d(M),2),j=d(z),e=d(j);{var t=v=>{var h=Ke(),D=d(h,!0);c(h),J(()=>X(D,_())),n(v,h)};te(e,v=>{_()&&v(t)})}var p=a(e,2);{var i=v=>{var h=Qe();n(v,h)};te(p,v=>{_()&&($()||x())&&v(i)})}var w=a(p,2);{var O=v=>{U(v,{get href(){return R()},external:!0,class:"company-link",children:(h,D)=>{y();var W=We(),q=K(W),ie=a(q);Oe(ie,{size:14,class:"external-link-icon"}),J(()=>X(q,`${$()??""} `)),n(h,W)},$$slots:{default:!0}})},F=v=>{var h=qe(),D=d(h,!0);c(h),J(()=>X(D,$())),n(v,h)};te(w,v=>{R()?v(O):v(F,!1)})}var Q=a(w,2);{var ae=v=>{var h=Ye(),D=a(K(h),2),W=d(D,!0);c(D),J(()=>X(W,x())),n(v,h)};te(Q,v=>{x()&&$()&&v(ae)})}c(j);var ne=a(j,2);{var ue=v=>{var h=Je(),D=d(h,!0);c(h),J(()=>X(D,A())),n(v,h)};te(ne,v=>{A()&&v(ue)})}var Z=a(ne,2),fe=d(Z);we(fe,o,"default",{}),c(Z);var re=a(Z,2);{var me=v=>{var h=Xe();Ae(h,5,l,De,(D,W)=>{I(D,{children:(q,ie)=>{y();var se=k();J(()=>X(se,f(W))),n(q,se)},$$slots:{default:!0}})}),c(h),n(v,h)};te(re,v=>{l().length>0&&v(me)})}c(z),c(M),n(r,M),ve()}const et=`attribute vec2 a_position;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
} `,tt=`/**
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
}`;function Se(r,o,_){const l=r.createShader(o);if(r.shaderSource(l,_),r.compileShader(l),!r.getShaderParameter(l,r.COMPILE_STATUS))throw console.error("Shader compilation error:",r.getShaderInfoLog(l)),r.deleteShader(l),new Error("Shader compilation failed");return l}function ot(r,o,_){const l=r.createProgram();if(r.attachShader(l,o),r.attachShader(l,_),r.linkProgram(l),!r.getProgramParameter(l,r.LINK_STATUS))throw console.error("Program linking error:",r.getProgramInfoLog(l)),r.deleteProgram(l),new Error("Program linking failed");return l}function at(){let r=le(null),o=le(null),_=le(0),l=le(0),$=le(!1);function x(){if(!f(r))return null;const e=f(r).getContext("webgl",{preserveDrawingBuffer:!1,antialias:!0});if(!e)return console.error("WebGL not supported or context creation failed."),null;try{const t=Se(e,e.VERTEX_SHADER,et),p=Se(e,e.FRAGMENT_SHADER,tt),i=ot(e,t,p);e.enable(e.BLEND),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA);const w=e.getAttribLocation(i,"a_position"),O={resolution:e.getUniformLocation(i,"u_resolution"),time:e.getUniformLocation(i,"u_time"),gasColor1:e.getUniformLocation(i,"u_gasColor1"),gasColor2:e.getUniformLocation(i,"u_gasColor2"),gasColorDark:e.getUniformLocation(i,"u_gasColorDark"),flowSpeed:e.getUniformLocation(i,"u_flowSpeed"),noiseScale:e.getUniformLocation(i,"u_noiseScale"),voidScale:e.getUniformLocation(i,"u_voidScale"),voidDensity:e.getUniformLocation(i,"u_voidDensity"),voidCycleSpeed:e.getUniformLocation(i,"u_voidCycleSpeed"),vignetteStrength:e.getUniformLocation(i,"u_vignetteStrength")};if(w===-1||Object.values(O).some(ae=>!ae))return console.error("Failed to get some shader variable locations."),null;const F=e.createBuffer();if(!F)return console.error("Failed to create position buffer."),null;e.bindBuffer(e.ARRAY_BUFFER,F);const Q=[-1,-1,1,-1,-1,1,-1,1,1,-1,1,1];return e.bufferData(e.ARRAY_BUFFER,new Float32Array(Q),e.STATIC_DRAW),{gl:e,program:i,positionBuffer:F,positionAttributeLocation:w,uniformLocations:O}}catch(t){return console.error("Failed to initialize WebGL program:",t),null}}function A(e){if(!f(o))return;const{gl:t,program:p,uniformLocations:i}=f(o);t.useProgram(p),t.uniform3fv(i.gasColor1,e.gasColor1),t.uniform3fv(i.gasColor2,e.gasColor2),t.uniform3fv(i.gasColorDark,e.gasColorDark),t.uniform1f(i.flowSpeed,e.flowSpeed),t.uniform1f(i.noiseScale,e.noiseScale),t.uniform1f(i.voidScale,e.voidScale),t.uniform1f(i.voidDensity,e.voidDensity),t.uniform1f(i.voidCycleSpeed,e.voidCycleSpeed),t.uniform1f(i.vignetteStrength,e.vignetteStrength)}function R(e){if(!f(o)||!f($))return;const{gl:t,program:p,positionBuffer:i,positionAttributeLocation:w,uniformLocations:O}=f(o),F=e*.001;f(l)===0&&H(l,F);const Q=F-f(l);t.clearColor(0,0,0,0),t.clear(t.COLOR_BUFFER_BIT),t.useProgram(p),t.enableVertexAttribArray(w),t.bindBuffer(t.ARRAY_BUFFER,i),t.vertexAttribPointer(w,2,t.FLOAT,!1,0,0),t.uniform1f(O.time,Q),t.drawArrays(t.TRIANGLES,0,6),H(_,requestAnimationFrame(R),!0)}function M(){if(!f(r))return;const e=f(r).clientWidth,t=f(r).clientHeight;if(f(r).width!==e||f(r).height!==t||!f($)){if(f(r).width=e,f(r).height=t,(!f(o)||f(o).gl.isContextLost())&&(H(o,x(),!0),!f(o))){H($,!1);return}H($,!0);const{gl:p,program:i,uniformLocations:w}=f(o);p.viewport(0,0,p.drawingBufferWidth,p.drawingBufferHeight),p.useProgram(i),p.uniform2f(w.resolution,p.drawingBufferWidth,p.drawingBufferHeight)}}function z(){if(cancelAnimationFrame(f(_)),H($,!1),f(o)){const{gl:e,program:t,positionBuffer:p}=f(o);p&&e.deleteBuffer(p);const i=e.getAttachedShaders(t);i==null||i.forEach(w=>{e.detachShader(t,w),e.deleteShader(w)}),e.deleteProgram(t)}H(o,null)}function j(){H(_,requestAnimationFrame(R),!0)}return{get canvas(){return f(r)},set canvas(e){H(r,e,!0)},get isInitialized(){return f($)},updateUniforms:A,resize:M,cleanup:z,startRendering:j}}var nt=g('<canvas style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: block; z-index: 0;"></canvas>');function rt(r,o){de(o,!0);const _=P(o,"gasColor1",19,()=>[.1,.3,.7]),l=P(o,"gasColor2",19,()=>[.3,.6,.9]),$=P(o,"gasColorDark",19,()=>[.01,.02,.05]),x=P(o,"flowSpeed",3,1.5),A=P(o,"noiseScale",3,2.5),R=P(o,"voidScale",3,4),M=P(o,"voidDensity",3,.4),z=P(o,"voidCycleSpeed",3,.6),j=P(o,"vignetteStrength",3,.65);let e;const t=at();be(()=>{t.canvas=e}),be(()=>{t.isInitialized&&t.updateUniforms({gasColor1:_(),gasColor2:l(),gasColorDark:$(),flowSpeed:x(),noiseScale:A(),voidScale:R(),voidDensity:M(),voidCycleSpeed:z(),vignetteStrength:j()})}),Fe(()=>(t.resize(),t.startRendering(),t.cleanup));var p=nt();Ue("resize",Le,function(...i){var w;(w=t.resize)==null||w.apply(this,i)}),Me(p,i=>e=i,()=>e),n(r,p),ve()}var it=g(`<ul class="svelte-6lo7m5"><li class="svelte-6lo7m5">Led a zero-downtime migration of 3 microservices and approximately 1 TB of data from
								a MongoDB replica set to a sharded cluster</li> <li class="svelte-6lo7m5">Improved platform performance by optimizing bottleneck queries, reducing p95 latency
								by 5 to 10 times</li> <li class="svelte-6lo7m5">Designed and implemented a fault-tolerant architecture in Kotlin and C# for 4
								real-time audience segmentation microservices, processing ~10,000 events per second</li> <li class="svelte-6lo7m5">Delivered a segmentation feature that replaced an external product via "dogfooding".</li> <li class="svelte-6lo7m5">Developed internal CLI and CI/CD tools, replacing manual work with automation</li></ul>`),st=g(`<ul class="svelte-6lo7m5"><li class="svelte-6lo7m5">Integrated a RESTful microservice connecting Veeam Backup for Microsoft Azure with
								Veeam Backup & Replication using C#, .NET Core 3.1, ASP.NET Core, and
								Swagger-documented APIs</li> <li class="svelte-6lo7m5">Engineered an event-driven pipeline ensuring sub-1-second for daily entity updates,
								maintaining eventual data consistency through SignalR, PostgreSQL, and Entity
								Framework Core</li> <li class="svelte-6lo7m5">Implemented a real-time notification center in the web UI, reducing status-check
								time from 6 clicks to a single click via React, TypeScript, and SignalR</li></ul>`),lt=g(`<ul class="svelte-6lo7m5"><li class="svelte-6lo7m5">Delivered 5 enterprise features for Kontur Extern using C#/.NET and React,
								supporting over 800,000 B2B clients</li> <li class="svelte-6lo7m5">Refactored the monolithic backend by replacing global context with scoped services
								in ASP.NET, enabling batch processing of 1,000+ documents per request</li> <li class="svelte-6lo7m5">Migrated legacy JavaScript UI to React, Redux, and TypeScript, cutting feature
								delivery time by 6 to 10 hours per task</li></ul>`),ct=g(`<ul class="svelte-6lo7m5"><li class="svelte-6lo7m5">Optimized the rendering pipeline of a Xamarin.Forms Android app, increasing frame
								rate from 30–35 fps to a steady 55–60 fps (+70%), significantly enhancing user
								experience</li> <li class="svelte-6lo7m5">Implemented custom caching and full offline mode using Realm database, reducing
								remote API calls and improving load times</li> <li class="svelte-6lo7m5">Refactored legacy code to clean MVVM architecture, shortening feature lead time and
								boosting unit-test coverage to nearly 90%</li></ul>`),dt=g(`<ul class="svelte-6lo7m5"><li class="svelte-6lo7m5">Engineered a push-based scheduling daemon, reducing client polling traffic by
								approximately 80%</li> <li class="svelte-6lo7m5">Developed self-service admin panels, enabling support staff to resolve ~90% of
								common tickets without engineering involvement</li> <li class="svelte-6lo7m5">Refactored a jQuery codebase to Knockout.js (MVVM), halving front-end defect rates
								and accelerating feature delivery</li> <li class="svelte-6lo7m5">Optimized heavy LINQ queries in Entity Framework for Oracle, cutting average latency
								from 1 minute to 4–5 seconds</li></ul>`),vt=g(`<ul class="svelte-6lo7m5"><li class="svelte-6lo7m5">Developed a jQuery-based WYSIWYG admin panel for the XSUD project blog and
								introduced semantic versioning of post markup in ASP.NET MVC, reducing publishing
								time and increasing click-through rates by approximately 35% within 4 months</li> <li class="svelte-6lo7m5">Designed and launched an offline-capable Android app for the Safe-Childhood Map
								project within 2 months</li> <li class="svelte-6lo7m5">Refactored CPU-heavy business logic into parameterized Microsoft SQL Server stored
								procedures, reducing p95 latency from 30 seconds to under 5 seconds</li></ul>`),ut=g("<!> <!> <!> <!> <!> <!>",1),ft=g(`<div class="project-icon svelte-6lo7m5">✈️</div> <h3 class="section-title svelte-6lo7m5">CarryFit</h3> <p class="svelte-6lo7m5">An online tool that helps travelers check if their carry-on luggage meets size
							requirements for different airlines worldwide. Simply enter your bag's dimensions to
							instantly see which of 150+ airlines will accept it as cabin baggage.</p> <div class="badge-container svelte-6lo7m5"><!> <!> <!></div> <div class="project-link svelte-6lo7m5"><!></div>`,1),mt=g(`<div class="project-icon svelte-6lo7m5">🔄</div> <h3 class="section-title svelte-6lo7m5">MongoTransit</h3> <p class="svelte-6lo7m5">A tool for automatic replication of documents between MongoDB clusters. Supports
							iterative transfers, sharded collections, and configurable synchronization parameters,
							making it ideal for database migrations and data synchronization tasks.</p> <div class="badge-container svelte-6lo7m5"><!> <!></div> <div class="project-link svelte-6lo7m5"><!></div>`,1),pt=g('<div class="interest-icon books svelte-6lo7m5">📚</div> <h3 class="section-title svelte-6lo7m5">Reading</h3> <p class="svelte-6lo7m5">I enjoy reading books on technology, science, and other topics to learn new things.</p>',1),gt=g('<div class="interest-icon climbing svelte-6lo7m5">🧗</div> <h3 class="section-title svelte-6lo7m5">Rock Climbing</h3> <p class="svelte-6lo7m5">I like rock climbing to stay active and enjoy the outdoors.</p>',1),ht=g('<div class="interest-icon skiing svelte-6lo7m5">⛷️</div> <h3 class="section-title svelte-6lo7m5">Mountain Skiing</h3> <p class="svelte-6lo7m5">I enjoy mountain skiing in the winter.</p>',1),_t=g(`<h3 class="section-title svelte-6lo7m5">Advent of Code</h3> <p class="svelte-6lo7m5">I've completed multiple years of Advent of Code challenges:</p> <div class="badge-container svelte-6lo7m5"><!> <!> <!> <!> <!></div>`,1),bt=g(`<h3 class="section-title svelte-6lo7m5">LeetCode</h3> <p class="svelte-6lo7m5">I practice algorithmic problem solving on LeetCode to improve my coding efficiency and
							understanding of data structures.</p> <div class="badge-container svelte-6lo7m5"><!></div>`,1),yt=g(`<div class="about-page svelte-6lo7m5"><header class="about-header svelte-6lo7m5"><!> <h1 class="space-title svelte-6lo7m5">About Me</h1></header> <div class="about-content svelte-6lo7m5"><section class="intro-section svelte-6lo7m5"><div class="avatar-container svelte-6lo7m5"><img src="/images/ava.jpg" alt="Avatar" class="avatar svelte-6lo7m5" loading="lazy"> <div class="avatar-ring svelte-6lo7m5"></div></div> <div class="intro-text svelte-6lo7m5"><h2 class="space-heading svelte-6lo7m5"> </h2> <p class="tagline svelte-6lo7m5">Senior Software Engineer</p> <div class="intro-text-content svelte-6lo7m5"><p class="svelte-6lo7m5">I've been programming for fun and profit since 2014, focusing on distributed systems
							and highload applications. My main stack is <b class="svelte-6lo7m5">C#</b>, <b class="svelte-6lo7m5">Kotlin</b>, and <b class="svelte-6lo7m5">TypeScript</b>, but I'm also proficient in <b class="svelte-6lo7m5">Go</b>.</p> <p class="svelte-6lo7m5"><b class="svelte-6lo7m5">Fun fact:</b> I was born on the 11th of April, just a day before Yuri Gagarin's flight.
							Poehali! 🚀</p></div></div> <div class="contact-information svelte-6lo7m5"><div class="button-group svelte-6lo7m5"><!> <!> <!></div></div></section> <section class="svelte-6lo7m5"><h2 class="space-heading svelte-6lo7m5">My Journey</h2> <!></section> <section class="svelte-6lo7m5"><h2 class="space-heading svelte-6lo7m5">Professional Interests</h2> <!></section> <section class="svelte-6lo7m5"><h2 class="space-heading svelte-6lo7m5">Personal Projects</h2> <div class="card-grid svelte-6lo7m5"><!> <!></div></section> <section class="svelte-6lo7m5"><h2 class="space-heading svelte-6lo7m5">Hobbies & Interests</h2> <div class="card-grid svelte-6lo7m5"><!> <!> <!></div></section> <section class="svelte-6lo7m5"><h2 class="space-heading svelte-6lo7m5">Programming Challenges</h2> <p class="svelte-6lo7m5">I enjoy participating in coding challenges to sharpen my skills and explore new
					programming concepts.</p> <div class="card-grid svelte-6lo7m5"><!> <!></div></section></div></div>`),St=g("<!> <!>",1);function Lt(r,o){de(o,!1),$e();var _=St(),l=K(_);const $=ye(()=>`Learn about ${ee.fullName}, Senior Software Engineer at Infobip. Programming since 2014, specializing in distributed systems, C#, Go, and highload applications. Previously at Veeam and SkbKontur.`);ze(l,{title:"About Me",get description(){return f($)},url:"/about",keywords:["about","software engineer","career","experience","distributed systems"]});var x=a(l,2);Ve(x,{children:(A,R)=>{var M=yt(),z=d(M),j=d(z);rt(j,{}),y(2),c(z);var e=a(z,2),t=d(e),p=a(d(t),2),i=d(p),w=d(i);c(i),y(4),c(p);var O=a(p,2),F=d(O),Q=d(F);const ae=ye(()=>`mailto:${ee.social.email}`);U(Q,{get href(){return f(ae)},external:!0,children:(b,B)=>{y();var m=k();J(()=>X(m,ee.social.email)),n(b,m)},$$slots:{default:!0}});var ne=a(Q,2);U(ne,{get href(){return ee.social.github},external:!0,children:(b,B)=>{y();var m=k("GitHub");n(b,m)},$$slots:{default:!0}});var ue=a(ne,2);U(ue,{get href(){return ee.social.linkedIn},external:!0,children:(b,B)=>{y();var m=k("LinkedIn");n(b,m)},$$slots:{default:!0}}),c(F),c(O),c(t);var Z=a(t,2),fe=a(d(Z),2);He(fe,{children:(b,B)=>{var m=ut(),C=K(m);oe(C,{date:"August 2020–present",title:"Infobip",role:"Senior Software Engineer",companyDescription:"Infobip is a global Communications-Platform-as-a-Service (CPaaS) provider offering APIs for messaging, voice, video, and contact center services.",companyUrl:"https://www.infobip.com/",technologies:["C#","Kotlin","Go","TypeScript","React","ASP.NET","Spring Boot","Kafka","MongoDB"],children:(s,S)=>{var u=it();n(s,u)},$$slots:{default:!0}});var T=a(C,2);oe(T,{date:"August 2019–August 2020",title:"Veeam Software",role:"Software Engineer",companyDescription:"Veeam Software is the global leader in backup and data recovery solutions for virtual machines, serving over 550,000 customers across more than 30 countries.",companyUrl:"https://www.veeam.com/",technologies:["C#","Azure","TypeScript","React","ASP.NET","PostgreSQL"],children:(s,S)=>{var u=st();n(s,u)},$$slots:{default:!0}});var N=a(T,2);oe(N,{date:"October 2017–August 2019",title:"Kontur",role:"Software Engineer",companyDescription:"Kontur is Russia's second-largest SaaS provider, offering 70+ cloud services for accounting, compliance, and e-government to 2.2 million business customers in Russia and abroad.",companyUrl:"https://kontur.ru/",technologies:["C#",".NET Framework","TypeScript","React","ASP.NET","WCF","MSSQL Server"],children:(s,S)=>{var u=lt();n(s,u)},$$slots:{default:!0}});var V=a(N,2);oe(V,{date:"April 2018–December 2019",title:"Freelancing",role:"Software Engineer",companyDescription:"Independent contractor working on mobile application development.",companyUrl:"https://www.upwork.com/",technologies:["C#","Xamarin","Android","Realm","MVVM"],children:(s,S)=>{var u=ct();n(s,u)},$$slots:{default:!0}});var L=a(V,2);oe(L,{date:"October 2015–August 2017",title:"PRO IT",role:"Software Developer",companyDescription:"PRO IT is a Russian software company developing web-based electronic document workflow systems for government agencies, employing over 100 staff.",technologies:["C#",".NET Framework","ASP.NET","React","MSSQL Server","LINQ"],children:(s,S)=>{var u=dt();n(s,u)},$$slots:{default:!0}});var E=a(L,2);oe(E,{date:"December 2014–October 2015",title:"Kai Development",role:"Junior Software Engineer",companyDescription:"Kai Development is a Russian software engineering studio specializing in web-based business and government automation. Since 2007, the company has delivered 45+ projects, including the legal-tech spin-off XSUD for Russian ministries and major corporations.",companyUrl:"https://kaidev.ru/",technologies:["C#",".NET Framework","PHP","JavaScript","Java","Android","MSSQL Server","Transact-SQL"],children:(s,S)=>{var u=vt();n(s,u)},$$slots:{default:!0}}),n(b,m)},$$slots:{default:!0}}),c(Z);var re=a(Z,2),me=a(d(re),2);Y(me,{variant:"default",children:(b,B)=>{je(b,{get tags(){return ee.interests}})},$$slots:{default:!0}}),c(re);var v=a(re,2),h=a(d(v),2),D=d(h);Y(D,{children:(b,B)=>{var m=ft(),C=a(K(m),6),T=d(C);I(T,{children:(s,S)=>{y();var u=k("SvelteKit");n(s,u)},$$slots:{default:!0}});var N=a(T,2);I(N,{children:(s,S)=>{y();var u=k("TailwindCSS");n(s,u)},$$slots:{default:!0}});var V=a(N,2);I(V,{children:(s,S)=>{y();var u=k("TypeScript");n(s,u)},$$slots:{default:!0}}),c(C);var L=a(C,2),E=d(L);U(E,{href:"https://carryon.fit/",external:!0,children:(s,S)=>{y();var u=k("Visit Site");n(s,u)},$$slots:{default:!0}}),c(L),n(b,m)},$$slots:{default:!0}});var W=a(D,2);Y(W,{children:(b,B)=>{var m=mt(),C=a(K(m),6),T=d(C);I(T,{children:(E,s)=>{y();var S=k("C#");n(E,S)},$$slots:{default:!0}});var N=a(T,2);I(N,{children:(E,s)=>{y();var S=k("MongoDB");n(E,S)},$$slots:{default:!0}}),c(C);var V=a(C,2),L=d(V);U(L,{href:"https://github.com/AxelUser/MongoTransit",external:!0,children:(E,s)=>{y();var S=k("View on GitHub");n(E,S)},$$slots:{default:!0}}),c(V),n(b,m)},$$slots:{default:!0}}),c(h),c(v);var q=a(v,2),ie=a(d(q),2),se=d(ie);Y(se,{children:(b,B)=>{var m=pt();y(4),n(b,m)},$$slots:{default:!0}});var pe=a(se,2);Y(pe,{children:(b,B)=>{var m=gt();y(4),n(b,m)},$$slots:{default:!0}});var ke=a(pe,2);Y(ke,{children:(b,B)=>{var m=ht();y(4),n(b,m)},$$slots:{default:!0}}),c(ie),c(q);var ge=a(q,2),he=a(d(ge),4),_e=d(he);Y(_e,{variant:"default",children:(b,B)=>{var m=_t(),C=a(K(m),4),T=d(C);I(T,{interactive:!0,children:(s,S)=>{U(s,{href:"https://github.com/AxelUser/aoc-2023-kt",external:!0,children:(u,ce)=>{y();var G=k("2023");n(u,G)},$$slots:{default:!0}})},$$slots:{default:!0}});var N=a(T,2);I(N,{interactive:!0,children:(s,S)=>{U(s,{href:"https://github.com/AxelUser/aoc-2022",external:!0,children:(u,ce)=>{y();var G=k("2022");n(u,G)},$$slots:{default:!0}})},$$slots:{default:!0}});var V=a(N,2);I(V,{interactive:!0,children:(s,S)=>{U(s,{href:"https://github.com/AxelUser/aoc-2021",external:!0,children:(u,ce)=>{y();var G=k("2021");n(u,G)},$$slots:{default:!0}})},$$slots:{default:!0}});var L=a(V,2);I(L,{interactive:!0,children:(s,S)=>{U(s,{href:"https://github.com/AxelUser/AdventOfCode2020",external:!0,children:(u,ce)=>{y();var G=k("2020");n(u,G)},$$slots:{default:!0}})},$$slots:{default:!0}});var E=a(L,2);I(E,{interactive:!0,children:(s,S)=>{U(s,{href:"https://github.com/AxelUser/advent-of-code-2017",external:!0,children:(u,ce)=>{y();var G=k("2017");n(u,G)},$$slots:{default:!0}})},$$slots:{default:!0}}),c(C),n(b,m)},$$slots:{default:!0}});var Ce=a(_e,2);Y(Ce,{variant:"default",children:(b,B)=>{var m=bt(),C=a(K(m),4),T=d(C);I(T,{interactive:!0,children:(N,V)=>{U(N,{href:"https://github.com/AxelUser/leetcode-kt",external:!0,children:(L,E)=>{y();var s=k("View Solutions");n(L,s)},$$slots:{default:!0}})},$$slots:{default:!0}}),c(C),n(b,m)},$$slots:{default:!0}}),c(he),c(ge),c(e),c(M),J(()=>X(w,`Hello, I'm ${ee.fullName}`)),n(A,M)}}),n(r,_),ve()}export{Lt as component};
