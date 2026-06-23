import * as THREE from "three";

/* ============================================================
   Lightweight starfield background.
   Stripped-down version of the full bloom/composer scene:
   keeps drift, twinkle, barrel-roll spin, scroll-dive, and
   cursor-repel, but renders with a single pass (no bloom,
   no multi-composer pipeline) so it's cheap enough to sit
   behind an entire content-heavy page on a budget phone.
   ============================================================ */

const isTouch = matchMedia("(hover: none), (pointer: coarse)").matches;
const prefersReducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

const CONFIG = {
  colorA: "#aef6cf", // mint
  colorB: "#5fe6a0", // jade
  colorC: "#eafff2", // bone
  pointSize: 42,
  brightness: 1.6,
  drift: 1.6,
  twinkle: 1,
  spin: 0.02,
  repelRadius: 4,
  repelStrength: isTouch ? 0 : 0.3,
  scrollPush: 6,
  scrollDrift: 4,
  scrollSpin: 0.06,
  parallax: 0.35,
};

function hexToVec3(hex) {
  const n = parseInt(hex.slice(1), 16);
  return new THREE.Vector3(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
}

const canvas = document.getElementById("starfield");

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: false,
  alpha: false,
  powerPreference: "low-power",
});

// Cap pixel ratio harder on touch/small screens to protect battery + perf.
const dpr = isTouch ? Math.min(window.devicePixelRatio, 1.5) : Math.min(window.devicePixelRatio, 2);
renderer.setPixelRatio(dpr);
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b1120);
scene.fog = new THREE.Fog(0x0b1120, 0, 22);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 80);
camera.position.set(0, 0, 5);
scene.add(camera);

/* ---------------- Geometry ---------------- */
const COUNT = isTouch ? 900 : 1800; // lighter than the 4200 in the full scene
const DEPTH = 30;

const positions = new Float32Array(COUNT * 3);
const palette = new Float32Array(COUNT);
const bright = new Float32Array(COUNT);
const scales = new Float32Array(COUNT);
const phases = new Float32Array(COUNT);

for (let i = 0; i < COUNT; i++) {
  const i3 = i * 3;
  positions[i3] = (Math.random() - 0.5) * 24;
  positions[i3 + 1] = (Math.random() - 0.5) * 16;
  positions[i3 + 2] = (Math.random() - 0.5) * DEPTH;
  palette[i] = Math.floor(Math.random() * 3);
  bright[i] = 0.7 + Math.random() * 0.6;
  scales[i] = 0.5 + Math.pow(Math.random(), 1.4) * 2.5;
  phases[i] = Math.random();
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
geometry.setAttribute("aScale", new THREE.Float32BufferAttribute(scales, 1));
geometry.setAttribute("aPhase", new THREE.Float32BufferAttribute(phases, 1));
geometry.setAttribute("aPalette", new THREE.Float32BufferAttribute(palette, 1));
geometry.setAttribute("aBright", new THREE.Float32BufferAttribute(bright, 1));

/* ---------------- Material / shaders ---------------- */
const material = new THREE.ShaderMaterial({
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  uniforms: {
    uTime: { value: 0 },
    uSize: { value: CONFIG.pointSize },
    uOpacity: { value: 0 },
    uDrift: { value: 0 },
    uDepth: { value: DEPTH },
    uTwinkle: { value: CONFIG.twinkle },
    uCursor: { value: new THREE.Vector3() },
    uRepelRadius: { value: CONFIG.repelRadius },
    uRepelStrength: { value: CONFIG.repelStrength },
    uActivity: { value: 0 },
    uColorA: { value: hexToVec3(CONFIG.colorA) },
    uColorB: { value: hexToVec3(CONFIG.colorB) },
    uColorC: { value: hexToVec3(CONFIG.colorC) },
    uBrightness: { value: CONFIG.brightness },
  },
  vertexShader: `
    uniform float uTime; uniform float uSize; uniform float uDrift; uniform float uDepth; uniform float uTwinkle;
    uniform vec3 uCursor; uniform float uRepelRadius; uniform float uRepelStrength; uniform float uActivity;
    uniform vec3 uColorA; uniform vec3 uColorB; uniform vec3 uColorC;
    attribute float aScale; attribute float aPhase; attribute float aPalette; attribute float aBright;
    varying vec3 vColor; varying float vTwinkle;
    void main() {
      vec3 pos = position;
      pos.z = mod(pos.z + uDrift + (uDepth * 0.5), uDepth) - (uDepth * 0.5);

      float tw = sin(uTime * 1.6 + aPhase * 6.2831);
      vTwinkle = (1.0 - uTwinkle) + uTwinkle * (0.55 + 0.45 * tw);

      vec4 modelPosition = modelMatrix * vec4(pos, 1.0);

      vec3 toParticle = modelPosition.xyz - uCursor;
      float dist = length(toParticle);
      float falloff = smoothstep(uRepelRadius, 0.0, dist);
      modelPosition.xyz += normalize(toParticle + vec3(0.0001)) * falloff * uRepelStrength * uActivity;

      vec4 viewPosition = viewMatrix * modelPosition;
      gl_Position = projectionMatrix * viewPosition;
      gl_PointSize = uSize * aScale;
      gl_PointSize *= (1.0 / -viewPosition.z);

      vec3 base = aPalette < 0.5 ? uColorA : (aPalette < 1.5 ? uColorB : uColorC);
      vColor = base * aBright;
    }
  `,
  fragmentShader: `
    uniform float uOpacity; uniform float uBrightness;
    varying vec3 vColor; varying float vTwinkle;
    void main() {
      vec2 uv = gl_PointCoord - 0.5;
      float d = length(uv);
      if (d > 0.5) discard;
      float strength = pow(1.0 - d * 2.0, 4.0);
      vec3 color = mix(vec3(0.0), vColor, strength);
      gl_FragColor = vec4(color * uBrightness, strength * uOpacity * vTwinkle);
    }
  `,
});

const points = new THREE.Points(geometry, material);
const group = new THREE.Group();
group.add(points);
scene.add(group);

/* ---------------- Pointer tracking ---------------- */
const POINTER = {
  ndc: new THREE.Vector2(0, 0),
  world: new THREE.Vector3(),
  active: false,
  activity: 0,
  lastMove: 0,
};

const mouseSmooth = { x: 0, y: 0 };
let scrollTarget = 0;
let scrollSmooth = 0;
let scrollCurrent = 0;

if (!isTouch) {
  window.addEventListener("mousemove", (e) => {
    POINTER.ndc.x = (e.clientX / window.innerWidth) * 2 - 1;
    POINTER.ndc.y = -((e.clientY / window.innerHeight) * 2 - 1);
    POINTER.active = true;
    POINTER.lastMove = performance.now();
  });

  window.addEventListener("mouseout", () => {
    POINTER.active = false;
  });
}

function updatePointer() {
  if (POINTER.active) {
    const dir = new THREE.Vector3(POINTER.ndc.x, POINTER.ndc.y, 0.5).unproject(camera).sub(camera.position).normalize();
    const t = -camera.position.z / dir.z;
    if (Math.abs(dir.z) > 1e-4 && t > 0 && Number.isFinite(t)) {
      const target = camera.position.clone().add(dir.multiplyScalar(t));
      POINTER.world.lerp(target, 0.12);
    }
  } else {
    POINTER.world.lerp(new THREE.Vector3(0, 0, 0), 0.12);
  }

  const idleMs = performance.now() - POINTER.lastMove;
  const want = POINTER.active && idleMs < 3000 ? 1 : 0;
  POINTER.activity += (want - POINTER.activity) * 0.06;

  material.uniforms.uCursor.value.copy(POINTER.world);
  material.uniforms.uActivity.value = POINTER.activity;

  mouseSmooth.x += (POINTER.ndc.x - mouseSmooth.x) * 0.06;
  mouseSmooth.y += (POINTER.ndc.y - mouseSmooth.y) * 0.06;
}

/* ---------------- Scroll tracking ---------------- */
function onScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  scrollTarget = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ---------------- Resize ---------------- */
function onResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  onScroll();
}
window.addEventListener("resize", onResize);

/* ---------------- Animation loop ---------------- */
let t0 = performance.now() / 1000;
const appearStart = performance.now();

function tick() {
  requestAnimationFrame(tick);

  const t = performance.now() / 1000;
  const dt = Math.min(0.05, t - t0);
  t0 = t;

  scrollSmooth += (scrollTarget - scrollSmooth) * 0.1;
  scrollCurrent += (scrollSmooth - scrollCurrent) * 0.06;
  const scroll = scrollCurrent;

  updatePointer();

  material.uniforms.uTime.value = t;
  material.uniforms.uDrift.value += dt * (CONFIG.drift + scroll * CONFIG.scrollDrift);

  const m = mouseSmooth;
  const px = isTouch ? 0 : m.x * CONFIG.parallax;
  const py = isTouch ? 0 : m.y * CONFIG.parallax;
  camera.position.set(px, py, 5 - scroll * CONFIG.scrollPush);
  camera.lookAt(px, py, -10);

  const elapsed = performance.now() - appearStart;
  const fade = Math.min(Math.max((elapsed - 200) / 1200, 0), 1);
  material.uniforms.uOpacity.value = prefersReducedMotion ? 0.85 : fade * 0.9;

  if (!prefersReducedMotion) {
    group.rotation.z += dt * (CONFIG.spin + scroll * CONFIG.scrollSpin);
  }

  renderer.render(scene, camera);
}

tick();