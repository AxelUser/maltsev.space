import{f as ye,a as n,t as g,s as ce,b as j,g as ke,h as we}from"../chunks/C7MaNpgc.js";import"../chunks/H9wuWRTD.js";import{w as Se,x as xe,p as ve,v as ae,a as Pe,b as pe,c as p,r as u,s as a,t as se,n as m,g as e,au as Z,av as je,ae as Ce,J as w,V as M,m as ee,aw as _e,$ as Ae,a2 as Te}from"../chunks/D5usNJhD.js";import{i as ge}from"../chunks/Bp2Dm2TW.js";import{b as Le}from"../chunks/tIEfHnyc.js";import{s as Ue,r as Ie,p as B,i as me}from"../chunks/DmikqdVb.js";import{o as Ne}from"../chunks/atb5tliA.js";import{I as De,e as Re,i as Ee}from"../chunks/Clzlhha8.js";import{b as de}from"../chunks/BCQ5r3qw.js";import{s as Fe,d as Me}from"../chunks/CJpBXX6n.js";import{C as te}from"../chunks/BxW7COlu.js";import{B as G}from"../chunks/C8uCUTQB.js";import{L as z}from"../chunks/BgLUtFZr.js";import{T as Be}from"../chunks/CKyjdIT3.js";function $e(f,s,_,l,q){var I;Se&&xe();var C=(I=s.$$slots)==null?void 0:I[_],x=!1;C===!0&&(C=s.children,x=!0),C===void 0||C(f,x?()=>l:l)}function Ve(f,s){ve(s,!0);let _=Ie(s,["$$slots","$$events","$$legacy"]);De(f,Ue({name:"external-link"},()=>_,{iconNode:[["path",{d:"M15 3h6v6"}],["path",{d:"M10 14 21 3"}],["path",{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"}]],children:(q,C)=>{var x=ye(),I=ae(x);Fe(I,()=>s.children??Pe),n(q,x)},$$slots:{default:!0}})),pe()}var Ge=g('<div class="timeline svelte-19j4pht"><!></div>');function ze(f,s){var _=Ge(),l=p(_);$e(l,s,"default",{}),u(_),n(f,_)}var qe=g('<div class="timeline-date svelte-qplifw"> </div>'),He=g(" <!>",1),We=g('<h3 class="section-title svelte-qplifw"><!></h3>'),Oe=g('<h3 class="section-title svelte-qplifw"> </h3>'),Qe=g('<div class="badge-container svelte-qplifw"></div>'),Ke=g('<div class="timeline-item svelte-qplifw"><div class="timeline-dot svelte-qplifw"></div> <div class="timeline-content svelte-qplifw"><!> <!> <!> <!></div></div>');function ie(f,s){ve(s,!1);let _=B(s,"date",8,void 0),l=B(s,"technologies",24,()=>[]),q=B(s,"title",8),C=B(s,"companyUrl",8,void 0);ge();var x=Ke(),I=a(p(x),2),K=p(I);{var oe=b=>{var $=qe(),k=p($,!0);u($),se(()=>ce(k,_())),n(b,$)};me(K,b=>{_()&&b(oe)})}var W=a(K,2);{var P=b=>{var $=We(),k=p($);z(k,{get href(){return C()},external:!0,class:"company-link",children:(N,E)=>{m();var D=He(),A=ae(D),F=a(A);Ve(F,{size:16,class:"external-link-icon"}),se(()=>ce(A,`${q()??""} `)),n(N,D)},$$slots:{default:!0}}),u($),n(b,$)},t=b=>{var $=Oe(),k=p($,!0);u($),se(()=>ce(k,q())),n(b,$)};me(W,b=>{C()?b(P):b(t,!1)})}var o=a(W,2);$e(o,s,"default",{});var H=a(o,2);{var J=b=>{var $=Qe();Re($,5,l,Ee,(k,N)=>{G(k,{children:(E,D)=>{m();var A=j();se(()=>ce(A,e(N))),n(E,A)},$$slots:{default:!0}})}),u($),n(b,$)};me(H,b=>{l().length>0&&b(J)})}u(I),u(x),n(f,x),pe()}const Je=`attribute vec2 a_position;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
} `,Ye=`/**
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
}`;function be(f,s,_){const l=f.createShader(s);if(f.shaderSource(l,_),f.compileShader(l),!f.getShaderParameter(l,f.COMPILE_STATUS))throw console.error("Shader compilation error:",f.getShaderInfoLog(l)),f.deleteShader(l),new Error("Shader compilation failed");return l}function Xe(f,s,_){const l=f.createProgram();if(f.attachShader(l,s),f.attachShader(l,_),f.linkProgram(l),!f.getProgramParameter(l,f.LINK_STATUS))throw console.error("Program linking error:",f.getProgramInfoLog(l)),f.deleteProgram(l),new Error("Program linking failed");return l}var Ze=g('<canvas style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: block; z-index: 0;"></canvas>');function et(f,s){ve(s,!1);let _=B(s,"gasColor1",24,()=>[.1,.3,.7]),l=B(s,"gasColor2",24,()=>[.3,.6,.9]),q=B(s,"gasColorDark",24,()=>[.01,.02,.05]),C=B(s,"flowSpeed",8,1.5),x=B(s,"noiseScale",8,2.5),I=B(s,"voidScale",8,4),K=B(s,"voidDensity",8,.4),oe=B(s,"voidCycleSpeed",8,.6),W=B(s,"vignetteStrength",8,.65),P=M(),t=M(null),o=M(null),H=null,J=-1,b=null,$=null,k=M(null),N=M(null),E=M(null),D=M(null),A=M(null),F=M(null),O=M(null),Q=M(null),Y=M(null),re,ne=0,v=M(!1);function he(){if(!e(P))return!1;if(w(t,e(P).getContext("webgl",{preserveDrawingBuffer:!1,antialias:!0})),!e(t))return console.error("WebGL not supported or context creation failed."),!1;try{const r=be(e(t),e(t).VERTEX_SHADER,Je),d=be(e(t),e(t).FRAGMENT_SHADER,Ye);w(o,Xe(e(t),r,d))}catch(r){return console.error("Failed to initialize WebGL program:",r),w(t,null),!1}return e(t).enable(e(t).BLEND),e(t).blendFunc(e(t).SRC_ALPHA,e(t).ONE_MINUS_SRC_ALPHA),!0}function ue(){if(!e(t)||!e(o))return!1;if(J=e(t).getAttribLocation(e(o),"a_position"),b=e(t).getUniformLocation(e(o),"u_resolution"),$=e(t).getUniformLocation(e(o),"u_time"),w(k,e(t).getUniformLocation(e(o),"u_gasColor1")),w(N,e(t).getUniformLocation(e(o),"u_gasColor2")),w(E,e(t).getUniformLocation(e(o),"u_gasColorDark")),w(D,e(t).getUniformLocation(e(o),"u_flowSpeed")),w(A,e(t).getUniformLocation(e(o),"u_noiseScale")),w(F,e(t).getUniformLocation(e(o),"u_voidScale")),w(O,e(t).getUniformLocation(e(o),"u_voidDensity")),w(Q,e(t).getUniformLocation(e(o),"u_voidCycleSpeed")),w(Y,e(t).getUniformLocation(e(o),"u_vignetteStrength")),J===-1||!b||!$||!e(k)||!e(N)||!e(E)||!e(D)||!e(A)||!e(F)||!e(O)||!e(Q)||!e(Y))return console.error("Failed to get some shader variable locations."),!1;H=e(t).createBuffer(),e(t).bindBuffer(e(t).ARRAY_BUFFER,H);const r=[-1,-1,1,-1,-1,1,-1,1,1,-1,1,1];return e(t).bufferData(e(t).ARRAY_BUFFER,new Float32Array(r),e(t).STATIC_DRAW),!0}function le(r){if(!e(t)||!e(o)||!e(v)){re=requestAnimationFrame(le);return}const d=r*.001;ne===0&&(ne=d);const S=d-ne;e(t).clearColor(0,0,0,0),e(t).clear(e(t).COLOR_BUFFER_BIT),e(t).useProgram(e(o)),e(t).enableVertexAttribArray(J),e(t).bindBuffer(e(t).ARRAY_BUFFER,H),e(t).vertexAttribPointer(J,2,e(t).FLOAT,!1,0,0),e(t).uniform1f($,S),e(t).drawArrays(e(t).TRIANGLES,0,6),re=requestAnimationFrame(le)}function h(){if(!e(P))return;const r=e(P).clientWidth,d=e(P).clientHeight;if(e(P).width!==r||e(P).height!==d||!e(v)){if(_e(P,e(P).width=r),_e(P,e(P).height=d),(!e(t)||e(t).isContextLost())&&!he()){w(v,!1);return}if(!e(v)&&!ue()){w(v,!1);return}w(v,!0),e(t)&&e(o)&&(e(t).viewport(0,0,e(t).drawingBufferWidth,e(t).drawingBufferHeight),e(t).useProgram(e(o)),b&&e(t).uniform2f(b,e(t).drawingBufferWidth,e(t).drawingBufferHeight),e(k)&&e(t).uniform3fv(e(k),_()),e(N)&&e(t).uniform3fv(e(N),l()),e(E)&&e(t).uniform3fv(e(E),q()),e(D)&&e(t).uniform1f(e(D),C()),e(A)&&e(t).uniform1f(e(A),x()),e(F)&&e(t).uniform1f(e(F),I()),e(O)&&e(t).uniform1f(e(O),K()),e(Q)&&e(t).uniform1f(e(Q),oe()),e(Y)&&e(t).uniform1f(e(Y),W()))}}Ne(()=>(h(),re=requestAnimationFrame(le),()=>{cancelAnimationFrame(re),w(v,!1);const r=e(t),d=e(o),S=H;if(r){if(S&&r.deleteBuffer(S),d){const L=r.getAttachedShaders(d);L==null||L.forEach(U=>{r.detachShader(d,U),r.deleteShader(U)}),r.deleteProgram(d)}const T=r.getExtension("WEBGL_lose_context");T&&T.loseContext()}w(t,null),w(o,null),H=null})),Z(()=>(e(v),e(t),e(o),e(k),ee(_())),()=>{e(v)&&e(t)&&e(o)&&e(k)&&(e(t).useProgram(e(o)),e(t).uniform3fv(e(k),_()))}),Z(()=>(e(v),e(t),e(o),e(N),ee(l())),()=>{e(v)&&e(t)&&e(o)&&e(N)&&(e(t).useProgram(e(o)),e(t).uniform3fv(e(N),l()))}),Z(()=>(e(v),e(t),e(o),e(E),ee(q())),()=>{e(v)&&e(t)&&e(o)&&e(E)&&(e(t).useProgram(e(o)),e(t).uniform3fv(e(E),q()))}),Z(()=>(e(v),e(t),e(o),e(D),ee(C())),()=>{e(v)&&e(t)&&e(o)&&e(D)&&(e(t).useProgram(e(o)),e(t).uniform1f(e(D),C()))}),Z(()=>(e(v),e(t),e(o),e(A),ee(x())),()=>{e(v)&&e(t)&&e(o)&&e(A)&&(e(t).useProgram(e(o)),e(t).uniform1f(e(A),x()))}),Z(()=>(e(v),e(t),e(o),e(F),ee(I())),()=>{e(v)&&e(t)&&e(o)&&e(F)&&(e(t).useProgram(e(o)),e(t).uniform1f(e(F),I()))}),Z(()=>(e(v),e(t),e(o),e(O),ee(K())),()=>{e(v)&&e(t)&&e(o)&&e(O)&&(e(t).useProgram(e(o)),e(t).uniform1f(e(O),K()))}),Z(()=>(e(v),e(t),e(o),e(Q),ee(oe())),()=>{e(v)&&e(t)&&e(o)&&e(Q)&&(e(t).useProgram(e(o)),e(t).uniform1f(e(Q),oe()))}),Z(()=>(e(v),e(t),e(o),e(Y),ee(W())),()=>{e(v)&&e(t)&&e(o)&&e(Y)&&(e(t).useProgram(e(o)),e(t).uniform1f(e(Y),W()))}),je(),ge();var R=Ze();ke("resize",Ce,h),Le(R,r=>w(P,r),()=>e(P)),n(f,R),pe()}var tt=g(`<p class="svelte-dkp7rj">As part of a distributed team, I developed and maintained over a dozen event-driven
						microservices that power real-time user segmentation. I was involved in migrating
						services and data from a MongoDB replica set to a sharded cluster, which improved
						performance significantly without any downtime. I also designed algorithms to balance
						workloads across services and independently created automation tools in Go and C# to
						support daily operations. Additionally, I contributed to documentation and led
						development on multiple segmentation-related epics.</p>`),ot=g(`<p class="svelte-dkp7rj">At Veeam, I worked on a RESTful integration between their Azure and Backup platforms,
						ensuring real-time synchronization of entities. I developed notification systems to
						provide progress tracking for long-running operations in the UI. I also helped with
						initiatives to improve engineering workflows, including a migration from TFS to Git and
						better code review tooling.</p>`),rt=g(`<p class="svelte-dkp7rj">Took part in Implementing features for enterprise segment in one of the most popular
						accounting product in Russia. These features saved a lot of time for our biggest and
						richest customers, optimised user scenarios and helped in gaining success of our
						product.</p>`),at=g(`<p class="svelte-dkp7rj">During my time as a freelancer, I improved a Xamarin-based language learning app by
						optimizing UI rendering and implementing MVVM architecture. My changes significantly
						boosted app responsiveness. I also integrated robust local storage Realm.</p>`),nt=g(`<p class="svelte-dkp7rj">I worked on .NET-based enterprise software, optimizing LINQ and SQL queries to double
						request throughput in edge cases. I developed admin dashboards to streamline operations
						and created an internal framework for automated Excel report generation, which
						accelerated future development efforts.</p>`),it=g(`<p class="svelte-dkp7rj">My early work involved building internal dashboards to improve SEO workflows. I migrated
						performance-heavy logic to stored procedures in Transact-SQL, resulting in notable speed
						improvements for data-intensive processes.</p>`),st=g("<!> <!> <!> <!> <!> <!>",1),lt=g(`<div class="project-icon svelte-dkp7rj">✈️</div> <h3 class="section-title svelte-dkp7rj">CarryFit</h3> <p class="svelte-dkp7rj">An online tool that helps travelers check if their carry-on luggage meets size
						requirements for different airlines worldwide. Simply enter your bag's dimensions to
						instantly see which of 150+ airlines will accept it as cabin baggage.</p> <div class="badge-container svelte-dkp7rj"><!> <!> <!></div> <div class="project-link svelte-dkp7rj"><!></div>`,1),dt=g(`<div class="project-icon svelte-dkp7rj">🔄</div> <h3 class="section-title svelte-dkp7rj">MongoTransit</h3> <p class="svelte-dkp7rj">A tool for automatic replication of documents between MongoDB clusters. Supports
						iterative transfers, sharded collections, and configurable synchronization parameters,
						making it ideal for database migrations and data synchronization tasks.</p> <div class="badge-container svelte-dkp7rj"><!> <!></div> <div class="project-link svelte-dkp7rj"><!></div>`,1),ct=g('<div class="interest-icon books svelte-dkp7rj">📚</div> <h3 class="section-title svelte-dkp7rj">Reading</h3> <p class="svelte-dkp7rj">I enjoy reading books on technology, science, and other topics to learn new things.</p>',1),ut=g('<div class="interest-icon climbing svelte-dkp7rj">🧗</div> <h3 class="section-title svelte-dkp7rj">Rock Climbing</h3> <p class="svelte-dkp7rj">I like rock climbing to stay active and enjoy the outdoors.</p>',1),ft=g('<div class="interest-icon skiing svelte-dkp7rj">⛷️</div> <h3 class="section-title svelte-dkp7rj">Mountain Skiing</h3> <p class="svelte-dkp7rj">I enjoy mountain skiing in the winter.</p>',1),vt=g(`<h3 class="section-title svelte-dkp7rj">Advent of Code</h3> <p class="svelte-dkp7rj">I've completed multiple years of Advent of Code challenges:</p> <div class="badge-container svelte-dkp7rj"><!> <!> <!> <!> <!></div>`,1),pt=g(`<h3 class="section-title svelte-dkp7rj">LeetCode</h3> <p class="svelte-dkp7rj">I practice algorithmic problem solving on LeetCode to improve my coding efficiency and
						understanding of data structures.</p> <div class="badge-container svelte-dkp7rj"><!></div>`,1),ht=g(`<div class="about-page svelte-dkp7rj"><header class="about-header svelte-dkp7rj"><!> <h1 class="space-title svelte-dkp7rj">About Me</h1></header> <div class="about-content svelte-dkp7rj"><section class="section intro-section svelte-dkp7rj"><div class="avatar-container svelte-dkp7rj"><div class="avatar svelte-dkp7rj"></div> <div class="avatar-ring svelte-dkp7rj"></div></div> <div class="intro-text svelte-dkp7rj"><h2 class="space-heading svelte-dkp7rj"> </h2> <p class="tagline svelte-dkp7rj">Senior Software Engineer</p> <p class="svelte-dkp7rj">I've been programming for fun and profit since 2014, focusing on distributed systems and
					highload applications. My main stack is <b class="svelte-dkp7rj">C#</b> and <b class="svelte-dkp7rj">.NET</b>, but I'm also proficient
					in <b class="svelte-dkp7rj">Kotlin, Go, and TypeScript</b>.</p> <p class="svelte-dkp7rj"><b class="svelte-dkp7rj">Fun fact:</b> I was born on the 11th of April, just a day before Yuri Gagarin's flight.
					Poehali!</p></div></section> <section class="svelte-dkp7rj"><h2 class="space-heading svelte-dkp7rj">My Journey</h2> <!></section> <section class="svelte-dkp7rj"><h2 class="space-heading svelte-dkp7rj">Professional Interests</h2> <!></section> <section class="svelte-dkp7rj"><h2 class="space-heading svelte-dkp7rj">Personal Projects</h2> <div class="card-grid svelte-dkp7rj"><!> <!></div></section> <section class="svelte-dkp7rj"><h2 class="space-heading svelte-dkp7rj">Hobbies & Interests</h2> <div class="card-grid svelte-dkp7rj"><!> <!> <!></div></section> <section class="svelte-dkp7rj"><h2 class="space-heading svelte-dkp7rj">Programming Challenges</h2> <p class="svelte-dkp7rj">I enjoy participating in coding challenges to sharpen my skills and explore new programming
				concepts.</p> <div class="card-grid svelte-dkp7rj"><!> <!></div></section> <section class="contact-section svelte-dkp7rj"><h2 class="space-heading svelte-dkp7rj">Contact</h2> <p class="svelte-dkp7rj">Interested in collaborating or just want to say hello? Feel free to reach out.</p> <div class="button-group svelte-dkp7rj"><!> <!> <!></div></section></div></div>`);function Tt(f,s){ve(s,!1),ge();var _=ht();we(h=>{se(()=>Ae.title=`About Me | ${Me.websiteTitle}`)});var l=p(_),q=p(l);et(q,{}),m(2),u(l);var C=a(l,2),x=p(C),I=a(p(x),2),K=p(I),oe=p(K);u(K),m(6),u(I),u(x);var W=a(x,2),P=a(p(W),2);ze(P,{children:(h,R)=>{var r=st(),d=ae(r);ie(d,{date:"2020–present",title:"Infobip",companyUrl:"https://www.infobip.com/",technologies:["C#","Kotlin","Go","TypeScript","React","ASP.NET","Spring Boot","Kafka","MongoDB"],children:(i,y)=>{var c=tt();n(i,c)},$$slots:{default:!0}});var S=a(d,2);ie(S,{date:"2019–2020",title:"Veeam",companyUrl:"https://www.veeam.com/",technologies:["C#","Azure","TypeScript","React","ASP.NET","PostgreSQL"],children:(i,y)=>{var c=ot();n(i,c)},$$slots:{default:!0}});var T=a(S,2);ie(T,{date:"2017–2019",title:"SKB Kontur",companyUrl:"https://kontur.ru/",technologies:["C#",".NET Framework","TypeScript","React","ASP.NET","WCF","MSSQL Server"],children:(i,y)=>{var c=rt();n(i,c)},$$slots:{default:!0}});var L=a(T,2);ie(L,{date:"2018",title:"Freelancer @ Upwork",companyUrl:"https://www.upwork.com/",technologies:["C#","Xamarin","Android","Realm","MVVM"],children:(i,y)=>{var c=at();n(i,c)},$$slots:{default:!0}});var U=a(L,2);ie(U,{date:"2015–2017",title:"Pro IT",technologies:["C#",".NET Framework","ASP.NET","React","MSSQL Server","LINQ"],children:(i,y)=>{var c=nt();n(i,c)},$$slots:{default:!0}});var V=a(U,2);ie(V,{date:"2014–2015",title:"KAI Development",companyUrl:"https://kaidev.ru/",technologies:["C#",".NET Framework","PHP","JavaScript","Java","Android","MSSQL Server","Transact-SQL"],children:(i,y)=>{var c=it();n(i,c)},$$slots:{default:!0}}),n(h,r)},$$slots:{default:!0}}),u(W);var t=a(W,2),o=a(p(t),2);te(o,{variant:"default",children:(h,R)=>{Be(h,{get tags(){return de.interests}})},$$slots:{default:!0}}),u(t);var H=a(t,2),J=a(p(H),2),b=p(J);te(b,{children:(h,R)=>{var r=lt(),d=a(ae(r),6),S=p(d);G(S,{children:(i,y)=>{m();var c=j("SvelteKit");n(i,c)},$$slots:{default:!0}});var T=a(S,2);G(T,{children:(i,y)=>{m();var c=j("TailwindCSS");n(i,c)},$$slots:{default:!0}});var L=a(T,2);G(L,{children:(i,y)=>{m();var c=j("TypeScript");n(i,c)},$$slots:{default:!0}}),u(d);var U=a(d,2),V=p(U);z(V,{href:"https://carryon.fit/",external:!0,children:(i,y)=>{m();var c=j("Visit Site");n(i,c)},$$slots:{default:!0}}),u(U),n(h,r)},$$slots:{default:!0}});var $=a(b,2);te($,{children:(h,R)=>{var r=dt(),d=a(ae(r),6),S=p(d);G(S,{children:(V,i)=>{m();var y=j("C#");n(V,y)},$$slots:{default:!0}});var T=a(S,2);G(T,{children:(V,i)=>{m();var y=j("MongoDB");n(V,y)},$$slots:{default:!0}}),u(d);var L=a(d,2),U=p(L);z(U,{href:"https://github.com/AxelUser/MongoTransit",external:!0,children:(V,i)=>{m();var y=j("View on GitHub");n(V,y)},$$slots:{default:!0}}),u(L),n(h,r)},$$slots:{default:!0}}),u(J),u(H);var k=a(H,2),N=a(p(k),2),E=p(N);te(E,{children:(h,R)=>{var r=ct();m(4),n(h,r)},$$slots:{default:!0}});var D=a(E,2);te(D,{children:(h,R)=>{var r=ut();m(4),n(h,r)},$$slots:{default:!0}});var A=a(D,2);te(A,{children:(h,R)=>{var r=ft();m(4),n(h,r)},$$slots:{default:!0}}),u(N),u(k);var F=a(k,2),O=a(p(F),4),Q=p(O);te(Q,{variant:"default",children:(h,R)=>{var r=vt(),d=a(ae(r),4),S=p(d);G(S,{interactive:!0,children:(i,y)=>{z(i,{href:"https://github.com/AxelUser/aoc-2023-kt",external:!0,children:(c,fe)=>{m();var X=j("2023");n(c,X)},$$slots:{default:!0}})},$$slots:{default:!0}});var T=a(S,2);G(T,{interactive:!0,children:(i,y)=>{z(i,{href:"https://github.com/AxelUser/aoc-2022",external:!0,children:(c,fe)=>{m();var X=j("2022");n(c,X)},$$slots:{default:!0}})},$$slots:{default:!0}});var L=a(T,2);G(L,{interactive:!0,children:(i,y)=>{z(i,{href:"https://github.com/AxelUser/aoc-2021",external:!0,children:(c,fe)=>{m();var X=j("2021");n(c,X)},$$slots:{default:!0}})},$$slots:{default:!0}});var U=a(L,2);G(U,{interactive:!0,children:(i,y)=>{z(i,{href:"https://github.com/AxelUser/AdventOfCode2020",external:!0,children:(c,fe)=>{m();var X=j("2020");n(c,X)},$$slots:{default:!0}})},$$slots:{default:!0}});var V=a(U,2);G(V,{interactive:!0,children:(i,y)=>{z(i,{href:"https://github.com/AxelUser/advent-of-code-2017",external:!0,children:(c,fe)=>{m();var X=j("2017");n(c,X)},$$slots:{default:!0}})},$$slots:{default:!0}}),u(d),n(h,r)},$$slots:{default:!0}});var Y=a(Q,2);te(Y,{variant:"default",children:(h,R)=>{var r=pt(),d=a(ae(r),4),S=p(d);G(S,{interactive:!0,children:(T,L)=>{z(T,{href:"https://github.com/AxelUser/leetcode-kt",external:!0,children:(U,V)=>{m();var i=j("View Solutions");n(U,i)},$$slots:{default:!0}})},$$slots:{default:!0}}),u(d),n(h,r)},$$slots:{default:!0}}),u(O),u(F);var re=a(F,2),ne=a(p(re),4),v=p(ne);const he=Te(()=>`mailto:${de.social.email}`);z(v,{get href(){return e(he)},external:!0,children:(h,R)=>{m();var r=j("Email");n(h,r)},$$slots:{default:!0}});var ue=a(v,2);z(ue,{get href(){return de.social.github},external:!0,children:(h,R)=>{m();var r=j("GitHub");n(h,r)},$$slots:{default:!0}});var le=a(ue,2);z(le,{get href(){return de.social.linkedIn},external:!0,children:(h,R)=>{m();var r=j("LinkedIn");n(h,r)},$$slots:{default:!0}}),u(ne),u(re),u(C),u(_),se(()=>ce(oe,`Hello, I'm ${de.fullName}`)),n(f,_),pe()}export{Tt as component};
