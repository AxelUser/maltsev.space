import{g as be,a as s,t as b,s as te,b as C,i as $e,h as ye}from"../chunks/DwkwZOj8.js";import"../chunks/DdpBA4fd.js";import{w as Se,x as we,p as ae,f as Q,b as Ce,a as ne,c as u,r as c,s as a,t as J,n as _,g as v,I as Z,J as j,k as ue,at as xe,$ as Pe,a2 as ke}from"../chunks/CWHDacXY.js";import{i as he}from"../chunks/D52XjXQU.js";import{b as Ae}from"../chunks/t-Jmizco.js";import{b as Te,r as De,p as I,i as se}from"../chunks/DbInc6KC.js";import{o as Ie}from"../chunks/CIT_ucYj.js";import{I as Re,e as Le,i as Ne}from"../chunks/D3bmhAul.js";import{b as ee}from"../chunks/BCQ5r3qw.js";import{a as Ue,d as Fe}from"../chunks/C-w_mhOk.js";import{C as q}from"../chunks/BSXX02MK.js";import{B as U}from"../chunks/CuA2fllH.js";import{L as F}from"../chunks/oTaK_h9O.js";import{T as Me}from"../chunks/BcwWx2EH.js";function pe(r,o,h,l,x){var A;Se&&we();var k=(A=o.$$slots)==null?void 0:A[h],w=!1;k===!0&&(k=o.children,w=!0),k===void 0||k(r,w?()=>l:l)}function Ee(r,o){ae(o,!0);let h=De(o,["$$slots","$$events","$$legacy"]);Re(r,Te({name:"external-link"},()=>h,{iconNode:[["path",{d:"M15 3h6v6"}],["path",{d:"M10 14 21 3"}],["path",{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"}]],children:(x,k)=>{var w=be(),A=Q(w);Ue(A,()=>o.children??Ce),s(x,w)},$$slots:{default:!0}})),ne()}var Be=b('<div class="timeline svelte-19j4pht"><!></div>');function ze(r,o){var h=Be(),l=u(h);pe(l,o,"default",{}),c(h),s(r,h)}var Ve=b('<div class="timeline-date svelte-qplifw"> </div>'),je=b(" <!>",1),Ge=b('<h3 class="section-title svelte-qplifw"><!></h3>'),qe=b('<h3 class="section-title svelte-qplifw"> </h3>'),He=b('<div class="badge-container svelte-qplifw"></div>'),Oe=b('<div class="timeline-item svelte-qplifw"><div class="timeline-dot svelte-qplifw"></div> <div class="timeline-content svelte-qplifw"><!> <!> <!> <!></div></div>');function K(r,o){ae(o,!1);let h=I(o,"date",8,void 0),l=I(o,"technologies",24,()=>[]),x=I(o,"title",8),k=I(o,"companyUrl",8,void 0);he();var w=Oe(),A=a(u(w),2),z=u(A);{var H=$=>{var g=Ve(),T=u(g,!0);c(g),J(()=>te(T,h())),s($,g)};se(z,$=>{h()&&$(H)})}var B=a(z,2);{var e=$=>{var g=Ge(),T=u(g);F(T,{get href(){return k()},external:!0,class:"company-link",children:(G,Y)=>{_();var W=je(),O=Q(W),X=a(O);Ee(X,{size:16,class:"external-link-icon"}),J(()=>te(O,`${x()??""} `)),s(G,W)},$$slots:{default:!0}}),c(g),s($,g)},t=$=>{var g=qe(),T=u(g,!0);c(g),J(()=>te(T,x())),s($,g)};se(B,$=>{k()?$(e):$(t,!1)})}var p=a(B,2);pe(p,o,"default",{});var n=a(p,2);{var S=$=>{var g=He();Le(g,5,l,Ne,(T,G)=>{U(T,{children:(Y,W)=>{_();var O=C();J(()=>te(O,v(G))),s(Y,O)},$$slots:{default:!0}})}),c(g),s($,g)};se(n,$=>{l().length>0&&$(S)})}c(A),c(w),s(r,w),ne()}const Qe=`attribute vec2 a_position;

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
}`;function fe(r,o,h){const l=r.createShader(o);if(r.shaderSource(l,h),r.compileShader(l),!r.getShaderParameter(l,r.COMPILE_STATUS))throw console.error("Shader compilation error:",r.getShaderInfoLog(l)),r.deleteShader(l),new Error("Shader compilation failed");return l}function Ke(r,o,h){const l=r.createProgram();if(r.attachShader(l,o),r.attachShader(l,h),r.linkProgram(l),!r.getProgramParameter(l,r.LINK_STATUS))throw console.error("Program linking error:",r.getProgramInfoLog(l)),r.deleteProgram(l),new Error("Program linking failed");return l}function Je(){let r=Z(null),o=Z(null),h=Z(0),l=Z(0),x=Z(!1);function k(){if(!v(r))return null;const e=v(r).getContext("webgl",{preserveDrawingBuffer:!1,antialias:!0});if(!e)return console.error("WebGL not supported or context creation failed."),null;try{const t=fe(e,e.VERTEX_SHADER,Qe),p=fe(e,e.FRAGMENT_SHADER,We),n=Ke(e,t,p);e.enable(e.BLEND),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA);const S=e.getAttribLocation(n,"a_position"),$={resolution:e.getUniformLocation(n,"u_resolution"),time:e.getUniformLocation(n,"u_time"),gasColor1:e.getUniformLocation(n,"u_gasColor1"),gasColor2:e.getUniformLocation(n,"u_gasColor2"),gasColorDark:e.getUniformLocation(n,"u_gasColorDark"),flowSpeed:e.getUniformLocation(n,"u_flowSpeed"),noiseScale:e.getUniformLocation(n,"u_noiseScale"),voidScale:e.getUniformLocation(n,"u_voidScale"),voidDensity:e.getUniformLocation(n,"u_voidDensity"),voidCycleSpeed:e.getUniformLocation(n,"u_voidCycleSpeed"),vignetteStrength:e.getUniformLocation(n,"u_vignetteStrength")};if(S===-1||Object.values($).some(G=>!G))return console.error("Failed to get some shader variable locations."),null;const g=e.createBuffer();if(!g)return console.error("Failed to create position buffer."),null;e.bindBuffer(e.ARRAY_BUFFER,g);const T=[-1,-1,1,-1,-1,1,-1,1,1,-1,1,1];return e.bufferData(e.ARRAY_BUFFER,new Float32Array(T),e.STATIC_DRAW),{gl:e,program:n,positionBuffer:g,positionAttributeLocation:S,uniformLocations:$}}catch(t){return console.error("Failed to initialize WebGL program:",t),null}}function w(e){if(!v(o))return;const{gl:t,program:p,uniformLocations:n}=v(o);t.useProgram(p),t.uniform3fv(n.gasColor1,e.gasColor1),t.uniform3fv(n.gasColor2,e.gasColor2),t.uniform3fv(n.gasColorDark,e.gasColorDark),t.uniform1f(n.flowSpeed,e.flowSpeed),t.uniform1f(n.noiseScale,e.noiseScale),t.uniform1f(n.voidScale,e.voidScale),t.uniform1f(n.voidDensity,e.voidDensity),t.uniform1f(n.voidCycleSpeed,e.voidCycleSpeed),t.uniform1f(n.vignetteStrength,e.vignetteStrength)}function A(e){if(!v(o)||!v(x))return;const{gl:t,program:p,positionBuffer:n,positionAttributeLocation:S,uniformLocations:$}=v(o),g=e*.001;v(l)===0&&j(l,g);const T=g-v(l);t.clearColor(0,0,0,0),t.clear(t.COLOR_BUFFER_BIT),t.useProgram(p),t.enableVertexAttribArray(S),t.bindBuffer(t.ARRAY_BUFFER,n),t.vertexAttribPointer(S,2,t.FLOAT,!1,0,0),t.uniform1f($.time,T),t.drawArrays(t.TRIANGLES,0,6),j(h,requestAnimationFrame(A),!0)}function z(){if(!v(r))return;const e=v(r).clientWidth,t=v(r).clientHeight;if(v(r).width!==e||v(r).height!==t||!v(x)){if(v(r).width=e,v(r).height=t,(!v(o)||v(o).gl.isContextLost())&&(j(o,k(),!0),!v(o))){j(x,!1);return}j(x,!0);const{gl:p,program:n,uniformLocations:S}=v(o);p.viewport(0,0,p.drawingBufferWidth,p.drawingBufferHeight),p.useProgram(n),p.uniform2f(S.resolution,p.drawingBufferWidth,p.drawingBufferHeight)}}function H(){if(cancelAnimationFrame(v(h)),j(x,!1),v(o)){const{gl:e,program:t,positionBuffer:p}=v(o);p&&e.deleteBuffer(p);const n=e.getAttachedShaders(t);n==null||n.forEach(S=>{e.detachShader(t,S),e.deleteShader(S)}),e.deleteProgram(t)}j(o,null)}function B(){j(h,requestAnimationFrame(A),!0)}return{get canvas(){return v(r)},set canvas(e){j(r,e,!0)},get isInitialized(){return v(x)},updateUniforms:w,resize:z,cleanup:H,startRendering:B}}var Ye=b('<canvas style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: block; z-index: 0;"></canvas>');function Xe(r,o){ae(o,!0);const h=I(o,"gasColor1",19,()=>[.1,.3,.7]),l=I(o,"gasColor2",19,()=>[.3,.6,.9]),x=I(o,"gasColorDark",19,()=>[.01,.02,.05]),k=I(o,"flowSpeed",3,1.5),w=I(o,"noiseScale",3,2.5),A=I(o,"voidScale",3,4),z=I(o,"voidDensity",3,.4),H=I(o,"voidCycleSpeed",3,.6),B=I(o,"vignetteStrength",3,.65);let e;const t=Je();ue(()=>{t.canvas=e}),ue(()=>{t.isInitialized&&t.updateUniforms({gasColor1:h(),gasColor2:l(),gasColorDark:x(),flowSpeed:k(),noiseScale:w(),voidScale:A(),voidDensity:z(),voidCycleSpeed:H(),vignetteStrength:B()})}),Ie(()=>(t.resize(),t.startRendering(),t.cleanup));var p=Ye();$e("resize",xe,function(...n){var S;(S=t.resize)==null||S.apply(this,n)}),Ae(p,n=>e=n,()=>e),s(r,p),ne()}var Ze=b(`<p class="svelte-s640ld">As part of a distributed team, I developed and maintained over a dozen event-driven
						microservices that power real-time user segmentation. I was involved in migrating
						services and data from a MongoDB replica set to a sharded cluster, which improved
						performance significantly without any downtime. I also designed algorithms to balance
						workloads across services and independently created automation tools in Go and C# to
						support daily operations. Additionally, I contributed to documentation and led
						development on multiple segmentation-related epics.</p>`),et=b(`<p class="svelte-s640ld">At Veeam, I worked on a RESTful integration between their Azure and Backup platforms,
						ensuring real-time synchronization of entities. I developed notification systems to
						provide progress tracking for long-running operations in the UI. I also helped with
						initiatives to improve engineering workflows, including a migration from TFS to Git and
						better code review tooling.</p>`),tt=b(`<p class="svelte-s640ld">Took part in Implementing features for enterprise segment in one of the most popular
						accounting product in Russia. These features saved a lot of time for our biggest and
						richest customers, optimised user scenarios and helped in gaining success of our
						product.</p>`),ot=b(`<p class="svelte-s640ld">During my time as a freelancer, I improved a Xamarin-based language learning app by
						optimizing UI rendering and implementing MVVM architecture. My changes significantly
						boosted app responsiveness. I also integrated robust local storage Realm.</p>`),at=b(`<p class="svelte-s640ld">I worked on .NET-based enterprise software, optimizing LINQ and SQL queries to double
						request throughput in edge cases. I developed admin dashboards to streamline operations
						and created an internal framework for automated Excel report generation, which
						accelerated future development efforts.</p>`),nt=b(`<p class="svelte-s640ld">My early work involved building internal dashboards to improve SEO workflows. I migrated
						performance-heavy logic to stored procedures in Transact-SQL, resulting in notable speed
						improvements for data-intensive processes.</p>`),st=b("<!> <!> <!> <!> <!> <!>",1),rt=b(`<div class="project-icon svelte-s640ld">✈️</div> <h3 class="section-title svelte-s640ld">CarryFit</h3> <p class="svelte-s640ld">An online tool that helps travelers check if their carry-on luggage meets size
						requirements for different airlines worldwide. Simply enter your bag's dimensions to
						instantly see which of 150+ airlines will accept it as cabin baggage.</p> <div class="badge-container svelte-s640ld"><!> <!> <!></div> <div class="project-link svelte-s640ld"><!></div>`,1),it=b(`<div class="project-icon svelte-s640ld">🔄</div> <h3 class="section-title svelte-s640ld">MongoTransit</h3> <p class="svelte-s640ld">A tool for automatic replication of documents between MongoDB clusters. Supports
						iterative transfers, sharded collections, and configurable synchronization parameters,
						making it ideal for database migrations and data synchronization tasks.</p> <div class="badge-container svelte-s640ld"><!> <!></div> <div class="project-link svelte-s640ld"><!></div>`,1),lt=b('<div class="interest-icon books svelte-s640ld">📚</div> <h3 class="section-title svelte-s640ld">Reading</h3> <p class="svelte-s640ld">I enjoy reading books on technology, science, and other topics to learn new things.</p>',1),dt=b('<div class="interest-icon climbing svelte-s640ld">🧗</div> <h3 class="section-title svelte-s640ld">Rock Climbing</h3> <p class="svelte-s640ld">I like rock climbing to stay active and enjoy the outdoors.</p>',1),ct=b('<div class="interest-icon skiing svelte-s640ld">⛷️</div> <h3 class="section-title svelte-s640ld">Mountain Skiing</h3> <p class="svelte-s640ld">I enjoy mountain skiing in the winter.</p>',1),vt=b(`<h3 class="section-title svelte-s640ld">Advent of Code</h3> <p class="svelte-s640ld">I've completed multiple years of Advent of Code challenges:</p> <div class="badge-container svelte-s640ld"><!> <!> <!> <!> <!></div>`,1),ut=b(`<h3 class="section-title svelte-s640ld">LeetCode</h3> <p class="svelte-s640ld">I practice algorithmic problem solving on LeetCode to improve my coding efficiency and
						understanding of data structures.</p> <div class="badge-container svelte-s640ld"><!></div>`,1),ft=b(`<div class="about-page svelte-s640ld"><header class="about-header svelte-s640ld"><!> <h1 class="space-title svelte-s640ld">About Me</h1></header> <div class="about-content svelte-s640ld"><section class="section intro-section svelte-s640ld"><div class="avatar-container svelte-s640ld"><img src="/images/ava.jpg" alt="Avatar" class="avatar svelte-s640ld" loading="lazy"> <div class="avatar-ring svelte-s640ld"></div></div> <div class="intro-text svelte-s640ld"><h2 class="space-heading svelte-s640ld"> </h2> <p class="tagline svelte-s640ld">Senior Software Engineer</p> <p class="svelte-s640ld">I've been programming for fun and profit since 2014, focusing on distributed systems and
					highload applications. My main stack is <b class="svelte-s640ld">C#</b> and <b class="svelte-s640ld">.NET</b>, but I'm also proficient
					in <b class="svelte-s640ld">Kotlin, Go, and TypeScript</b>.</p> <p class="svelte-s640ld"><b class="svelte-s640ld">Fun fact:</b> I was born on the 11th of April, just a day before Yuri Gagarin's flight.
					Poehali!</p></div></section> <section class="svelte-s640ld"><h2 class="space-heading svelte-s640ld">My Journey</h2> <!></section> <section class="svelte-s640ld"><h2 class="space-heading svelte-s640ld">Professional Interests</h2> <!></section> <section class="svelte-s640ld"><h2 class="space-heading svelte-s640ld">Personal Projects</h2> <div class="card-grid svelte-s640ld"><!> <!></div></section> <section class="svelte-s640ld"><h2 class="space-heading svelte-s640ld">Hobbies & Interests</h2> <div class="card-grid svelte-s640ld"><!> <!> <!></div></section> <section class="svelte-s640ld"><h2 class="space-heading svelte-s640ld">Programming Challenges</h2> <p class="svelte-s640ld">I enjoy participating in coding challenges to sharpen my skills and explore new programming
				concepts.</p> <div class="card-grid svelte-s640ld"><!> <!></div></section> <section class="contact-section svelte-s640ld"><h2 class="space-heading svelte-s640ld">Contact</h2> <p class="svelte-s640ld">Interested in collaborating or just want to say hello? Feel free to reach out.</p> <div class="button-group svelte-s640ld"><!> <!> <!></div></section></div></div>`);function At(r,o){ae(o,!1),he();var h=ft();ye(m=>{J(()=>Pe.title=`About Me | ${Fe.websiteTitle}`)});var l=u(h),x=u(l);Xe(x,{}),_(2),c(l);var k=a(l,2),w=u(k),A=a(u(w),2),z=u(A),H=u(z);c(z),_(6),c(A),c(w);var B=a(w,2),e=a(u(B),2);ze(e,{children:(m,M)=>{var f=st(),P=Q(f);K(P,{date:"2020–present",title:"Infobip",companyUrl:"https://www.infobip.com/",technologies:["C#","Kotlin","Go","TypeScript","React","ASP.NET","Spring Boot","Kafka","MongoDB"],children:(i,y)=>{var d=Ze();s(i,d)},$$slots:{default:!0}});var D=a(P,2);K(D,{date:"2019–2020",title:"Veeam",companyUrl:"https://www.veeam.com/",technologies:["C#","Azure","TypeScript","React","ASP.NET","PostgreSQL"],children:(i,y)=>{var d=et();s(i,d)},$$slots:{default:!0}});var R=a(D,2);K(R,{date:"2017–2019",title:"SKB Kontur",companyUrl:"https://kontur.ru/",technologies:["C#",".NET Framework","TypeScript","React","ASP.NET","WCF","MSSQL Server"],children:(i,y)=>{var d=tt();s(i,d)},$$slots:{default:!0}});var E=a(R,2);K(E,{date:"2018",title:"Freelancer @ Upwork",companyUrl:"https://www.upwork.com/",technologies:["C#","Xamarin","Android","Realm","MVVM"],children:(i,y)=>{var d=ot();s(i,d)},$$slots:{default:!0}});var L=a(E,2);K(L,{date:"2015–2017",title:"Pro IT",technologies:["C#",".NET Framework","ASP.NET","React","MSSQL Server","LINQ"],children:(i,y)=>{var d=at();s(i,d)},$$slots:{default:!0}});var N=a(L,2);K(N,{date:"2014–2015",title:"KAI Development",companyUrl:"https://kaidev.ru/",technologies:["C#",".NET Framework","PHP","JavaScript","Java","Android","MSSQL Server","Transact-SQL"],children:(i,y)=>{var d=nt();s(i,d)},$$slots:{default:!0}}),s(m,f)},$$slots:{default:!0}}),c(B);var t=a(B,2),p=a(u(t),2);q(p,{variant:"default",children:(m,M)=>{Me(m,{get tags(){return ee.interests}})},$$slots:{default:!0}}),c(t);var n=a(t,2),S=a(u(n),2),$=u(S);q($,{children:(m,M)=>{var f=rt(),P=a(Q(f),6),D=u(P);U(D,{children:(i,y)=>{_();var d=C("SvelteKit");s(i,d)},$$slots:{default:!0}});var R=a(D,2);U(R,{children:(i,y)=>{_();var d=C("TailwindCSS");s(i,d)},$$slots:{default:!0}});var E=a(R,2);U(E,{children:(i,y)=>{_();var d=C("TypeScript");s(i,d)},$$slots:{default:!0}}),c(P);var L=a(P,2),N=u(L);F(N,{href:"https://carryon.fit/",external:!0,children:(i,y)=>{_();var d=C("Visit Site");s(i,d)},$$slots:{default:!0}}),c(L),s(m,f)},$$slots:{default:!0}});var g=a($,2);q(g,{children:(m,M)=>{var f=it(),P=a(Q(f),6),D=u(P);U(D,{children:(N,i)=>{_();var y=C("C#");s(N,y)},$$slots:{default:!0}});var R=a(D,2);U(R,{children:(N,i)=>{_();var y=C("MongoDB");s(N,y)},$$slots:{default:!0}}),c(P);var E=a(P,2),L=u(E);F(L,{href:"https://github.com/AxelUser/MongoTransit",external:!0,children:(N,i)=>{_();var y=C("View on GitHub");s(N,y)},$$slots:{default:!0}}),c(E),s(m,f)},$$slots:{default:!0}}),c(S),c(n);var T=a(n,2),G=a(u(T),2),Y=u(G);q(Y,{children:(m,M)=>{var f=lt();_(4),s(m,f)},$$slots:{default:!0}});var W=a(Y,2);q(W,{children:(m,M)=>{var f=dt();_(4),s(m,f)},$$slots:{default:!0}});var O=a(W,2);q(O,{children:(m,M)=>{var f=ct();_(4),s(m,f)},$$slots:{default:!0}}),c(G),c(T);var X=a(T,2),re=a(u(X),4),ie=u(re);q(ie,{variant:"default",children:(m,M)=>{var f=vt(),P=a(Q(f),4),D=u(P);U(D,{interactive:!0,children:(i,y)=>{F(i,{href:"https://github.com/AxelUser/aoc-2023-kt",external:!0,children:(d,oe)=>{_();var V=C("2023");s(d,V)},$$slots:{default:!0}})},$$slots:{default:!0}});var R=a(D,2);U(R,{interactive:!0,children:(i,y)=>{F(i,{href:"https://github.com/AxelUser/aoc-2022",external:!0,children:(d,oe)=>{_();var V=C("2022");s(d,V)},$$slots:{default:!0}})},$$slots:{default:!0}});var E=a(R,2);U(E,{interactive:!0,children:(i,y)=>{F(i,{href:"https://github.com/AxelUser/aoc-2021",external:!0,children:(d,oe)=>{_();var V=C("2021");s(d,V)},$$slots:{default:!0}})},$$slots:{default:!0}});var L=a(E,2);U(L,{interactive:!0,children:(i,y)=>{F(i,{href:"https://github.com/AxelUser/AdventOfCode2020",external:!0,children:(d,oe)=>{_();var V=C("2020");s(d,V)},$$slots:{default:!0}})},$$slots:{default:!0}});var N=a(L,2);U(N,{interactive:!0,children:(i,y)=>{F(i,{href:"https://github.com/AxelUser/advent-of-code-2017",external:!0,children:(d,oe)=>{_();var V=C("2017");s(d,V)},$$slots:{default:!0}})},$$slots:{default:!0}}),c(P),s(m,f)},$$slots:{default:!0}});var ge=a(ie,2);q(ge,{variant:"default",children:(m,M)=>{var f=ut(),P=a(Q(f),4),D=u(P);U(D,{interactive:!0,children:(R,E)=>{F(R,{href:"https://github.com/AxelUser/leetcode-kt",external:!0,children:(L,N)=>{_();var i=C("View Solutions");s(L,i)},$$slots:{default:!0}})},$$slots:{default:!0}}),c(P),s(m,f)},$$slots:{default:!0}}),c(re),c(X);var le=a(X,2),de=a(u(le),4),ce=u(de);const me=ke(()=>`mailto:${ee.social.email}`);F(ce,{get href(){return v(me)},external:!0,children:(m,M)=>{_();var f=C("Email");s(m,f)},$$slots:{default:!0}});var ve=a(ce,2);F(ve,{get href(){return ee.social.github},external:!0,children:(m,M)=>{_();var f=C("GitHub");s(m,f)},$$slots:{default:!0}});var _e=a(ve,2);F(_e,{get href(){return ee.social.linkedIn},external:!0,children:(m,M)=>{_();var f=C("LinkedIn");s(m,f)},$$slots:{default:!0}}),c(de),c(le),c(k),c(h),J(()=>te(H,`Hello, I'm ${ee.fullName}`)),s(r,h),ne()}export{At as component};
