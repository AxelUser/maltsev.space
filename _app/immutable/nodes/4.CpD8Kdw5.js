import{c as Pe,a as n,t as g,b as w}from"../chunks/BA34N8rq.js";import{i as $e}from"../chunks/CxTlLPdo.js";import{i as ke,j as Ae,p as oe,f as O,a as Te,b as ae,c as u,r as v,s as a,t as Z,n as $,g as c,h as X,e as j,d as me,at as De,_ as _e}from"../chunks/CMhBHpTF.js";import{s as ee,e as Ie}from"../chunks/WW_bM7uf.js";import{c as Le,r as Ne,p as I,i as ie,b as Re}from"../chunks/CnNU8nIr.js";import{o as Ue}from"../chunks/BzDwjmS4.js";import{I as Ee,e as Fe,i as Me}from"../chunks/aiSaXCzK.js";import{b as Y}from"../chunks/B1Lznyga.js";import{s as Be,O as ze}from"../chunks/BpqAtxJX.js";import{B as U,C as H}from"../chunks/kJu1BVhO.js";import{L as E}from"../chunks/Bou_RCeN.js";import{S as Ve}from"../chunks/BiXoWAqE.js";import{T as je}from"../chunks/ybF8ky47.js";function ye(s,o,m,l,C){var T;ke&&Ae();var A=(T=o.$$slots)==null?void 0:T[m],P=!1;A===!0&&(A=o.children,P=!0),A===void 0||A(s,P?()=>l:l)}function Ge(s,o){oe(o,!0);let m=Ne(o,["$$slots","$$events","$$legacy"]);Ee(s,Le({name:"external-link"},()=>m,{iconNode:[["path",{d:"M15 3h6v6"}],["path",{d:"M10 14 21 3"}],["path",{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"}]],children:(C,A)=>{var P=Pe(),T=O(P);Be(T,()=>o.children??Te),n(C,P)},$$slots:{default:!0}})),ae()}var qe=g('<div class="timeline svelte-19j4pht"><!></div>');function He(s,o){var m=qe(),l=u(m);ye(l,o,"default",{}),v(m),n(s,m)}var Oe=g('<div class="timeline-date svelte-qplifw"> </div>'),Ke=g(" <!>",1),Qe=g('<h3 class="section-title svelte-qplifw"><!></h3>'),We=g('<h3 class="section-title svelte-qplifw"> </h3>'),Ye=g('<div class="badge-container svelte-qplifw"></div>'),Je=g('<div class="timeline-item svelte-qplifw"><div class="timeline-dot svelte-qplifw"></div> <div class="timeline-content svelte-qplifw"><!> <!> <!> <!></div></div>');function J(s,o){oe(o,!1);let m=I(o,"date",8,void 0),l=I(o,"technologies",24,()=>[]),C=I(o,"title",8),A=I(o,"companyUrl",8,void 0);$e();var P=Je(),T=a(u(P),2),B=u(T);{var z=_=>{var p=Oe(),k=u(p,!0);v(p),Z(()=>ee(k,m())),n(_,p)};ie(B,_=>{m()&&_(z)})}var G=a(B,2);{var e=_=>{var p=Qe(),k=u(p);E(k,{get href(){return A()},external:!0,class:"company-link",children:(K,Q)=>{$();var W=Ke(),q=O(W),ne=a(q);Ge(ne,{size:16,class:"external-link-icon"}),Z(()=>ee(q,`${C()??""} `)),n(K,W)},$$slots:{default:!0}}),v(p),n(_,p)},t=_=>{var p=We(),k=u(p,!0);v(p),Z(()=>ee(k,C())),n(_,p)};ie(G,_=>{A()?_(e):_(t,!1)})}var h=a(G,2);ye(h,o,"default",{});var r=a(h,2);{var S=_=>{var p=Ye();Fe(p,5,l,Me,(k,K)=>{U(k,{children:(Q,W)=>{$();var q=w();Z(()=>ee(q,c(K))),n(Q,q)},$$slots:{default:!0}})}),v(p),n(_,p)};ie(r,_=>{l().length>0&&_(S)})}v(T),v(P),n(s,P),ae()}const Xe=`attribute vec2 a_position;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
} `,Ze=`/**
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
}`;function be(s,o,m){const l=s.createShader(o);if(s.shaderSource(l,m),s.compileShader(l),!s.getShaderParameter(l,s.COMPILE_STATUS))throw console.error("Shader compilation error:",s.getShaderInfoLog(l)),s.deleteShader(l),new Error("Shader compilation failed");return l}function et(s,o,m){const l=s.createProgram();if(s.attachShader(l,o),s.attachShader(l,m),s.linkProgram(l),!s.getProgramParameter(l,s.LINK_STATUS))throw console.error("Program linking error:",s.getProgramInfoLog(l)),s.deleteProgram(l),new Error("Program linking failed");return l}function tt(){let s=X(null),o=X(null),m=X(0),l=X(0),C=X(!1);function A(){if(!c(s))return null;const e=c(s).getContext("webgl",{preserveDrawingBuffer:!1,antialias:!0});if(!e)return console.error("WebGL not supported or context creation failed."),null;try{const t=be(e,e.VERTEX_SHADER,Xe),h=be(e,e.FRAGMENT_SHADER,Ze),r=et(e,t,h);e.enable(e.BLEND),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA);const S=e.getAttribLocation(r,"a_position"),_={resolution:e.getUniformLocation(r,"u_resolution"),time:e.getUniformLocation(r,"u_time"),gasColor1:e.getUniformLocation(r,"u_gasColor1"),gasColor2:e.getUniformLocation(r,"u_gasColor2"),gasColorDark:e.getUniformLocation(r,"u_gasColorDark"),flowSpeed:e.getUniformLocation(r,"u_flowSpeed"),noiseScale:e.getUniformLocation(r,"u_noiseScale"),voidScale:e.getUniformLocation(r,"u_voidScale"),voidDensity:e.getUniformLocation(r,"u_voidDensity"),voidCycleSpeed:e.getUniformLocation(r,"u_voidCycleSpeed"),vignetteStrength:e.getUniformLocation(r,"u_vignetteStrength")};if(S===-1||Object.values(_).some(K=>!K))return console.error("Failed to get some shader variable locations."),null;const p=e.createBuffer();if(!p)return console.error("Failed to create position buffer."),null;e.bindBuffer(e.ARRAY_BUFFER,p);const k=[-1,-1,1,-1,-1,1,-1,1,1,-1,1,1];return e.bufferData(e.ARRAY_BUFFER,new Float32Array(k),e.STATIC_DRAW),{gl:e,program:r,positionBuffer:p,positionAttributeLocation:S,uniformLocations:_}}catch(t){return console.error("Failed to initialize WebGL program:",t),null}}function P(e){if(!c(o))return;const{gl:t,program:h,uniformLocations:r}=c(o);t.useProgram(h),t.uniform3fv(r.gasColor1,e.gasColor1),t.uniform3fv(r.gasColor2,e.gasColor2),t.uniform3fv(r.gasColorDark,e.gasColorDark),t.uniform1f(r.flowSpeed,e.flowSpeed),t.uniform1f(r.noiseScale,e.noiseScale),t.uniform1f(r.voidScale,e.voidScale),t.uniform1f(r.voidDensity,e.voidDensity),t.uniform1f(r.voidCycleSpeed,e.voidCycleSpeed),t.uniform1f(r.vignetteStrength,e.vignetteStrength)}function T(e){if(!c(o)||!c(C))return;const{gl:t,program:h,positionBuffer:r,positionAttributeLocation:S,uniformLocations:_}=c(o),p=e*.001;c(l)===0&&j(l,p);const k=p-c(l);t.clearColor(0,0,0,0),t.clear(t.COLOR_BUFFER_BIT),t.useProgram(h),t.enableVertexAttribArray(S),t.bindBuffer(t.ARRAY_BUFFER,r),t.vertexAttribPointer(S,2,t.FLOAT,!1,0,0),t.uniform1f(_.time,k),t.drawArrays(t.TRIANGLES,0,6),j(m,requestAnimationFrame(T),!0)}function B(){if(!c(s))return;const e=c(s).clientWidth,t=c(s).clientHeight;if(c(s).width!==e||c(s).height!==t||!c(C)){if(c(s).width=e,c(s).height=t,(!c(o)||c(o).gl.isContextLost())&&(j(o,A(),!0),!c(o))){j(C,!1);return}j(C,!0);const{gl:h,program:r,uniformLocations:S}=c(o);h.viewport(0,0,h.drawingBufferWidth,h.drawingBufferHeight),h.useProgram(r),h.uniform2f(S.resolution,h.drawingBufferWidth,h.drawingBufferHeight)}}function z(){if(cancelAnimationFrame(c(m)),j(C,!1),c(o)){const{gl:e,program:t,positionBuffer:h}=c(o);h&&e.deleteBuffer(h);const r=e.getAttachedShaders(t);r==null||r.forEach(S=>{e.detachShader(t,S),e.deleteShader(S)}),e.deleteProgram(t)}j(o,null)}function G(){j(m,requestAnimationFrame(T),!0)}return{get canvas(){return c(s)},set canvas(e){j(s,e,!0)},get isInitialized(){return c(C)},updateUniforms:P,resize:B,cleanup:z,startRendering:G}}var ot=g('<canvas style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: block; z-index: 0;"></canvas>');function at(s,o){oe(o,!0);const m=I(o,"gasColor1",19,()=>[.1,.3,.7]),l=I(o,"gasColor2",19,()=>[.3,.6,.9]),C=I(o,"gasColorDark",19,()=>[.01,.02,.05]),A=I(o,"flowSpeed",3,1.5),P=I(o,"noiseScale",3,2.5),T=I(o,"voidScale",3,4),B=I(o,"voidDensity",3,.4),z=I(o,"voidCycleSpeed",3,.6),G=I(o,"vignetteStrength",3,.65);let e;const t=tt();me(()=>{t.canvas=e}),me(()=>{t.isInitialized&&t.updateUniforms({gasColor1:m(),gasColor2:l(),gasColorDark:C(),flowSpeed:A(),noiseScale:P(),voidScale:T(),voidDensity:B(),voidCycleSpeed:z(),vignetteStrength:G()})}),Ue(()=>(t.resize(),t.startRendering(),t.cleanup));var h=ot();Ie("resize",De,function(...r){var S;(S=t.resize)==null||S.apply(this,r)}),Re(h,r=>e=r,()=>e),n(s,h),ae()}var nt=g(`<p class="svelte-s640ld">As part of a distributed team, I developed and maintained over a dozen event-driven
							microservices that power real-time user segmentation. I was involved in migrating
							services and data from a MongoDB replica set to a sharded cluster, which improved
							performance significantly without any downtime. I also designed algorithms to balance
							workloads across services and independently created automation tools in Go and C# to
							support daily operations. Additionally, I contributed to documentation and led
							development on multiple segmentation-related epics.</p>`),st=g(`<p class="svelte-s640ld">At Veeam, I worked on a RESTful integration between their Azure and Backup platforms,
							ensuring real-time synchronization of entities. I developed notification systems to
							provide progress tracking for long-running operations in the UI. I also helped with
							initiatives to improve engineering workflows, including a migration from TFS to Git
							and better code review tooling.</p>`),rt=g(`<p class="svelte-s640ld">Took part in Implementing features for enterprise segment in one of the most popular
							accounting product in Russia. These features saved a lot of time for our biggest and
							richest customers, optimised user scenarios and helped in gaining success of our
							product.</p>`),it=g(`<p class="svelte-s640ld">During my time as a freelancer, I improved a Xamarin-based language learning app by
							optimizing UI rendering and implementing MVVM architecture. My changes significantly
							boosted app responsiveness. I also integrated robust local storage Realm.</p>`),lt=g(`<p class="svelte-s640ld">I worked on .NET-based enterprise software, optimizing LINQ and SQL queries to double
							request throughput in edge cases. I developed admin dashboards to streamline
							operations and created an internal framework for automated Excel report generation,
							which accelerated future development efforts.</p>`),dt=g(`<p class="svelte-s640ld">My early work involved building internal dashboards to improve SEO workflows. I
							migrated performance-heavy logic to stored procedures in Transact-SQL, resulting in
							notable speed improvements for data-intensive processes.</p>`),ct=g("<!> <!> <!> <!> <!> <!>",1),vt=g(`<div class="project-icon svelte-s640ld">✈️</div> <h3 class="section-title svelte-s640ld">CarryFit</h3> <p class="svelte-s640ld">An online tool that helps travelers check if their carry-on luggage meets size
							requirements for different airlines worldwide. Simply enter your bag's dimensions to
							instantly see which of 150+ airlines will accept it as cabin baggage.</p> <div class="badge-container svelte-s640ld"><!> <!> <!></div> <div class="project-link svelte-s640ld"><!></div>`,1),ut=g(`<div class="project-icon svelte-s640ld">🔄</div> <h3 class="section-title svelte-s640ld">MongoTransit</h3> <p class="svelte-s640ld">A tool for automatic replication of documents between MongoDB clusters. Supports
							iterative transfers, sharded collections, and configurable synchronization parameters,
							making it ideal for database migrations and data synchronization tasks.</p> <div class="badge-container svelte-s640ld"><!> <!></div> <div class="project-link svelte-s640ld"><!></div>`,1),ft=g('<div class="interest-icon books svelte-s640ld">📚</div> <h3 class="section-title svelte-s640ld">Reading</h3> <p class="svelte-s640ld">I enjoy reading books on technology, science, and other topics to learn new things.</p>',1),ht=g('<div class="interest-icon climbing svelte-s640ld">🧗</div> <h3 class="section-title svelte-s640ld">Rock Climbing</h3> <p class="svelte-s640ld">I like rock climbing to stay active and enjoy the outdoors.</p>',1),pt=g('<div class="interest-icon skiing svelte-s640ld">⛷️</div> <h3 class="section-title svelte-s640ld">Mountain Skiing</h3> <p class="svelte-s640ld">I enjoy mountain skiing in the winter.</p>',1),gt=g(`<h3 class="section-title svelte-s640ld">Advent of Code</h3> <p class="svelte-s640ld">I've completed multiple years of Advent of Code challenges:</p> <div class="badge-container svelte-s640ld"><!> <!> <!> <!> <!></div>`,1),mt=g(`<h3 class="section-title svelte-s640ld">LeetCode</h3> <p class="svelte-s640ld">I practice algorithmic problem solving on LeetCode to improve my coding efficiency and
							understanding of data structures.</p> <div class="badge-container svelte-s640ld"><!></div>`,1),_t=g(`<div class="about-page svelte-s640ld"><header class="about-header svelte-s640ld"><!> <h1 class="space-title svelte-s640ld">About Me</h1></header> <div class="about-content svelte-s640ld"><section class="section intro-section svelte-s640ld"><div class="avatar-container svelte-s640ld"><img src="/images/ava.jpg" alt="Avatar" class="avatar svelte-s640ld" loading="lazy"> <div class="avatar-ring svelte-s640ld"></div></div> <div class="intro-text svelte-s640ld"><h2 class="space-heading svelte-s640ld"> </h2> <p class="tagline svelte-s640ld">Senior Software Engineer</p> <p class="svelte-s640ld">I've been programming for fun and profit since 2014, focusing on distributed systems and
						highload applications. My main stack is <b class="svelte-s640ld">C#</b> and <b class="svelte-s640ld">.NET</b>, but I'm also
						proficient in <b class="svelte-s640ld">Kotlin, Go, and TypeScript</b>.</p> <p class="svelte-s640ld"><b class="svelte-s640ld">Fun fact:</b> I was born on the 11th of April, just a day before Yuri Gagarin's flight.
						Poehali!</p></div></section> <section class="svelte-s640ld"><h2 class="space-heading svelte-s640ld">My Journey</h2> <!></section> <section class="svelte-s640ld"><h2 class="space-heading svelte-s640ld">Professional Interests</h2> <!></section> <section class="svelte-s640ld"><h2 class="space-heading svelte-s640ld">Personal Projects</h2> <div class="card-grid svelte-s640ld"><!> <!></div></section> <section class="svelte-s640ld"><h2 class="space-heading svelte-s640ld">Hobbies & Interests</h2> <div class="card-grid svelte-s640ld"><!> <!> <!></div></section> <section class="svelte-s640ld"><h2 class="space-heading svelte-s640ld">Programming Challenges</h2> <p class="svelte-s640ld">I enjoy participating in coding challenges to sharpen my skills and explore new
					programming concepts.</p> <div class="card-grid svelte-s640ld"><!> <!></div></section> <section class="contact-section svelte-s640ld"><h2 class="space-heading svelte-s640ld">Contact</h2> <p class="svelte-s640ld">Interested in collaborating or just want to say hello? Feel free to reach out.</p> <div class="button-group svelte-s640ld"><!> <!> <!></div></section></div></div>`),bt=g("<!> <!>",1);function Nt(s,o){oe(o,!1),$e();var m=bt(),l=O(m);const C=_e(()=>`Learn about ${Y.fullName}, Senior Software Engineer at Infobip. Programming since 2014, specializing in distributed systems, C#, Go, and highload applications. Previously at Veeam and SkbKontur.`);Ve(l,{title:"About Me",get description(){return c(C)},url:"/about",keywords:["about","software engineer","career","experience","distributed systems"]});var A=a(l,2);ze(A,{children:(P,T)=>{var B=_t(),z=u(B),G=u(z);at(G,{}),$(2),v(z);var e=a(z,2),t=u(e),h=a(u(t),2),r=u(h),S=u(r);v(r),$(6),v(h),v(t);var _=a(t,2),p=a(u(_),2);He(p,{children:(b,F)=>{var f=ct(),x=O(f);J(x,{date:"2020–present",title:"Infobip",companyUrl:"https://www.infobip.com/",technologies:["C#","Kotlin","Go","TypeScript","React","ASP.NET","Spring Boot","Kafka","MongoDB"],children:(i,y)=>{var d=nt();n(i,d)},$$slots:{default:!0}});var D=a(x,2);J(D,{date:"2019–2020",title:"Veeam",companyUrl:"https://www.veeam.com/",technologies:["C#","Azure","TypeScript","React","ASP.NET","PostgreSQL"],children:(i,y)=>{var d=st();n(i,d)},$$slots:{default:!0}});var L=a(D,2);J(L,{date:"2017–2019",title:"SKB Kontur",companyUrl:"https://kontur.ru/",technologies:["C#",".NET Framework","TypeScript","React","ASP.NET","WCF","MSSQL Server"],children:(i,y)=>{var d=rt();n(i,d)},$$slots:{default:!0}});var M=a(L,2);J(M,{date:"2018",title:"Freelancer @ Upwork",companyUrl:"https://www.upwork.com/",technologies:["C#","Xamarin","Android","Realm","MVVM"],children:(i,y)=>{var d=it();n(i,d)},$$slots:{default:!0}});var N=a(M,2);J(N,{date:"2015–2017",title:"Pro IT",technologies:["C#",".NET Framework","ASP.NET","React","MSSQL Server","LINQ"],children:(i,y)=>{var d=lt();n(i,d)},$$slots:{default:!0}});var R=a(N,2);J(R,{date:"2014–2015",title:"KAI Development",companyUrl:"https://kaidev.ru/",technologies:["C#",".NET Framework","PHP","JavaScript","Java","Android","MSSQL Server","Transact-SQL"],children:(i,y)=>{var d=dt();n(i,d)},$$slots:{default:!0}}),n(b,f)},$$slots:{default:!0}}),v(_);var k=a(_,2),K=a(u(k),2);H(K,{variant:"default",children:(b,F)=>{je(b,{get tags(){return Y.interests}})},$$slots:{default:!0}}),v(k);var Q=a(k,2),W=a(u(Q),2),q=u(W);H(q,{children:(b,F)=>{var f=vt(),x=a(O(f),6),D=u(x);U(D,{children:(i,y)=>{$();var d=w("SvelteKit");n(i,d)},$$slots:{default:!0}});var L=a(D,2);U(L,{children:(i,y)=>{$();var d=w("TailwindCSS");n(i,d)},$$slots:{default:!0}});var M=a(L,2);U(M,{children:(i,y)=>{$();var d=w("TypeScript");n(i,d)},$$slots:{default:!0}}),v(x);var N=a(x,2),R=u(N);E(R,{href:"https://carryon.fit/",external:!0,children:(i,y)=>{$();var d=w("Visit Site");n(i,d)},$$slots:{default:!0}}),v(N),n(b,f)},$$slots:{default:!0}});var ne=a(q,2);H(ne,{children:(b,F)=>{var f=ut(),x=a(O(f),6),D=u(x);U(D,{children:(R,i)=>{$();var y=w("C#");n(R,y)},$$slots:{default:!0}});var L=a(D,2);U(L,{children:(R,i)=>{$();var y=w("MongoDB");n(R,y)},$$slots:{default:!0}}),v(x);var M=a(x,2),N=u(M);E(N,{href:"https://github.com/AxelUser/MongoTransit",external:!0,children:(R,i)=>{$();var y=w("View on GitHub");n(R,y)},$$slots:{default:!0}}),v(M),n(b,f)},$$slots:{default:!0}}),v(W),v(Q);var se=a(Q,2),le=a(u(se),2),de=u(le);H(de,{children:(b,F)=>{var f=ft();$(4),n(b,f)},$$slots:{default:!0}});var ce=a(de,2);H(ce,{children:(b,F)=>{var f=ht();$(4),n(b,f)},$$slots:{default:!0}});var Se=a(ce,2);H(Se,{children:(b,F)=>{var f=pt();$(4),n(b,f)},$$slots:{default:!0}}),v(le),v(se);var re=a(se,2),ve=a(u(re),4),ue=u(ve);H(ue,{variant:"default",children:(b,F)=>{var f=gt(),x=a(O(f),4),D=u(x);U(D,{interactive:!0,children:(i,y)=>{E(i,{href:"https://github.com/AxelUser/aoc-2023-kt",external:!0,children:(d,te)=>{$();var V=w("2023");n(d,V)},$$slots:{default:!0}})},$$slots:{default:!0}});var L=a(D,2);U(L,{interactive:!0,children:(i,y)=>{E(i,{href:"https://github.com/AxelUser/aoc-2022",external:!0,children:(d,te)=>{$();var V=w("2022");n(d,V)},$$slots:{default:!0}})},$$slots:{default:!0}});var M=a(L,2);U(M,{interactive:!0,children:(i,y)=>{E(i,{href:"https://github.com/AxelUser/aoc-2021",external:!0,children:(d,te)=>{$();var V=w("2021");n(d,V)},$$slots:{default:!0}})},$$slots:{default:!0}});var N=a(M,2);U(N,{interactive:!0,children:(i,y)=>{E(i,{href:"https://github.com/AxelUser/AdventOfCode2020",external:!0,children:(d,te)=>{$();var V=w("2020");n(d,V)},$$slots:{default:!0}})},$$slots:{default:!0}});var R=a(N,2);U(R,{interactive:!0,children:(i,y)=>{E(i,{href:"https://github.com/AxelUser/advent-of-code-2017",external:!0,children:(d,te)=>{$();var V=w("2017");n(d,V)},$$slots:{default:!0}})},$$slots:{default:!0}}),v(x),n(b,f)},$$slots:{default:!0}});var we=a(ue,2);H(we,{variant:"default",children:(b,F)=>{var f=mt(),x=a(O(f),4),D=u(x);U(D,{interactive:!0,children:(L,M)=>{E(L,{href:"https://github.com/AxelUser/leetcode-kt",external:!0,children:(N,R)=>{$();var i=w("View Solutions");n(N,i)},$$slots:{default:!0}})},$$slots:{default:!0}}),v(x),n(b,f)},$$slots:{default:!0}}),v(ve),v(re);var fe=a(re,2),he=a(u(fe),4),pe=u(he);const Ce=_e(()=>`mailto:${Y.social.email}`);E(pe,{get href(){return c(Ce)},external:!0,children:(b,F)=>{$();var f=w("Email");n(b,f)},$$slots:{default:!0}});var ge=a(pe,2);E(ge,{get href(){return Y.social.github},external:!0,children:(b,F)=>{$();var f=w("GitHub");n(b,f)},$$slots:{default:!0}});var xe=a(ge,2);E(xe,{get href(){return Y.social.linkedIn},external:!0,children:(b,F)=>{$();var f=w("LinkedIn");n(b,f)},$$slots:{default:!0}}),v(he),v(fe),v(e),v(B),Z(()=>ee(S,`Hello, I'm ${Y.fullName}`)),n(P,B)}}),n(s,m),ae()}export{Nt as component};
