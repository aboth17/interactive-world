import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import {
  earthVertexShader,
  earthFragmentShader,
  atmosphereVertexShader,
  atmosphereFragmentShader,
} from '../shaders';
import { loadVisitedCountryFeatures } from '../utils/geoData';
import { generateVisitedMask } from '../utils/visitedMaskTexture';
import { createCityEmberPoints } from './CityEmberGlow';
import { AudioManager } from '../audio/AudioManager';
import { visitedStore } from '../stores/visitedStore';
import { latLngToVector3 } from '../utils/coordinates';

const GLOBE_RADIUS = 5;
const ATMOSPHERE_RADIUS = 5.15;
const STAR_COUNT = 8000;
const MIN_DISTANCE = 7;
const MAX_DISTANCE = 40;
const FLY_DURATION = 1.5;

function getSunDirection(): THREE.Vector3 {
  const now = new Date();
  const dayOfYear =
    (Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) -
      Date.UTC(now.getFullYear(), 0, 0)) /
    86400000;
  const hourUTC = now.getUTCHours() + now.getUTCMinutes() / 60;

  const solarLongitude = ((12 - hourUTC) / 24) * Math.PI * 2;
  const declination = -23.44 * Math.cos((2 * Math.PI * (dayOfYear + 10)) / 365);
  const decRad = (declination * Math.PI) / 180;

  return new THREE.Vector3(
    Math.cos(decRad) * Math.cos(solarLongitude),
    Math.sin(decRad),
    Math.cos(decRad) * Math.sin(solarLongitude)
  ).normalize();
}

function latLngToCameraPos(lat: number, lng: number, distance: number, earthRotationY: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const dir = new THREE.Vector3(
    -Math.sin(phi) * Math.cos(theta),
    Math.cos(phi),
    Math.sin(phi) * Math.sin(theta)
  );
  dir.applyAxisAngle(new THREE.Vector3(0, 1, 0), earthRotationY);
  return dir.multiplyScalar(distance);
}

function createStarField(): THREE.Points {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(STAR_COUNT * 3);
  const sizes = new Float32Array(STAR_COUNT);
  const colors = new Float32Array(STAR_COUNT * 3);

  for (let i = 0; i < STAR_COUNT; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const radius = 80 + Math.random() * 40;

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);

    sizes[i] = Math.random() < 0.05 ? 2.0 + Math.random() * 1.5 : 0.5 + Math.random() * 1.0;

    const temp = Math.random();
    if (temp < 0.15) {
      colors[i * 3] = 1.0;
      colors[i * 3 + 1] = 0.85 + Math.random() * 0.15;
      colors[i * 3 + 2] = 0.7 + Math.random() * 0.2;
    } else if (temp < 0.3) {
      colors[i * 3] = 0.7 + Math.random() * 0.2;
      colors[i * 3 + 1] = 0.8 + Math.random() * 0.2;
      colors[i * 3 + 2] = 1.0;
    } else {
      const brightness = 0.85 + Math.random() * 0.15;
      colors[i * 3] = brightness;
      colors[i * 3 + 1] = brightness;
      colors[i * 3 + 2] = brightness;
    }
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.ShaderMaterial({
    uniforms: {
      pixelRatio: { value: window.devicePixelRatio },
    },
    vertexShader: `
      attribute float size;
      varying vec3 vColor;
      uniform float pixelRatio;
      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * pixelRatio * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;
        float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
        alpha = pow(alpha, 1.5);
        gl_FragColor = vec4(vColor, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    vertexColors: true,
  });

  return new THREE.Points(geometry, material);
}

interface GlobeProps {
  onCityClick?: (lat: number, lng: number, name: string) => void;
}

export default function Globe({ onCityClick }: GlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    renderer: THREE.WebGLRenderer;
    composer: EffectComposer;
    controls: OrbitControls;
    animationId: number;
  } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x010108);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      200
    );
    camera.position.set(0, 0, 18);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.zoomSpeed = 0.8;
    controls.minDistance = MIN_DISTANCE;
    controls.maxDistance = MAX_DISTANCE;
    controls.enablePan = false;

    // Texture loader
    const textureLoader = new THREE.TextureLoader();

    // Sun direction (real-time)
    const sunDirection = getSunDirection();

    // Earth — start with a placeholder 1x1 black mask, replaced once geo data loads
    const earthGeometry = new THREE.SphereGeometry(GLOBE_RADIUS, 128, 64);

    const dayTexture = textureLoader.load('/textures/earth_daymap.jpg');
    const nightTexture = textureLoader.load('/textures/earth_nightmap.jpg');
    const bumpTexture = textureLoader.load('/textures/earth_topology.png');

    dayTexture.colorSpace = THREE.SRGBColorSpace;
    nightTexture.colorSpace = THREE.SRGBColorSpace;

    // Placeholder 1x1 black texture until mask loads
    const placeholderCanvas = document.createElement('canvas');
    placeholderCanvas.width = 1;
    placeholderCanvas.height = 1;
    const placeholderCtx = placeholderCanvas.getContext('2d')!;
    placeholderCtx.fillStyle = '#000';
    placeholderCtx.fillRect(0, 0, 1, 1);
    const placeholderMask = new THREE.CanvasTexture(placeholderCanvas);

    const earthMaterial = new THREE.ShaderMaterial({
      uniforms: {
        dayTexture: { value: dayTexture },
        nightTexture: { value: nightTexture },
        bumpTexture: { value: bumpTexture },
        visitedMask: { value: placeholderMask },
        sunDirection: { value: sunDirection },
        time: { value: 0.0 },
      },
      vertexShader: earthVertexShader,
      fragmentShader: earthFragmentShader,
    });

    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);

    // --- Dynamic visited mask + embers ---
    let currentEmbers: THREE.Points = createCityEmberPoints(GLOBE_RADIUS, visitedStore.getCities());
    earth.add(currentEmbers);

    async function updateMask() {
      const features = await loadVisitedCountryFeatures(visitedStore.getCountryCodes());
      const newMask = generateVisitedMask(features);
      const oldMask = earthMaterial.uniforms.visitedMask.value;
      earthMaterial.uniforms.visitedMask.value = newMask;
      if (oldMask) oldMask.dispose();
    }

    function updateEmbers() {
      earth.remove(currentEmbers);
      currentEmbers.geometry.dispose();
      (currentEmbers.material as THREE.Material).dispose();
      currentEmbers = createCityEmberPoints(GLOBE_RADIUS, visitedStore.getCities());
      earth.add(currentEmbers);
    }

    // Initial load
    updateMask();

    // Subscribe to store changes
    const unsubscribeStore = visitedStore.subscribe(() => {
      updateMask();
      updateEmbers();
    });

    // --- Fly-to animation ---
    let flyTarget: THREE.Vector3 | null = null;
    let flyStart: THREE.Vector3 | null = null;
    let flyStartTime = 0;
    let isFlying = false;

    function onFlyTo(e: Event) {
      const { lat, lng } = (e as CustomEvent).detail;
      const dist = camera.position.length();
      flyTarget = latLngToCameraPos(lat, lng, dist, earth.rotation.y);
      flyStart = camera.position.clone();
      flyStartTime = clock.getElapsedTime();
      isFlying = true;
      userInteracting = true;
      clearTimeout(interactionTimeout);
    }

    window.addEventListener('globe:flyto', onFlyTo);

    // --- City click detection (for Street View) ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let mouseDownPos = new THREE.Vector2();

    function onMouseDown(e: MouseEvent) {
      mouseDownPos.set(e.clientX, e.clientY);
    }

    function onMouseUp(e: MouseEvent) {
      // Only treat as click if mouse didn't move much (not a drag)
      const dx = e.clientX - mouseDownPos.x;
      const dy = e.clientY - mouseDownPos.y;
      if (Math.sqrt(dx * dx + dy * dy) > 5) return;

      const cities = visitedStore.getCities();
      if (cities.length === 0) return;

      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);

      // Check distance from ray to each city position
      const camDist = camera.position.length();
      const threshold = 0.15 + (camDist / MAX_DISTANCE) * 0.3; // Larger hit area when zoomed out

      let closestDist = Infinity;
      let closestCity: typeof cities[0] | null = null;

      for (const city of cities) {
        const worldPos = latLngToVector3(city.lat, city.lng, GLOBE_RADIUS + 0.02);
        // Apply earth rotation
        worldPos.applyAxisAngle(new THREE.Vector3(0, 1, 0), earth.rotation.y);
        const dist = raycaster.ray.distanceToPoint(worldPos);
        if (dist < threshold && dist < closestDist) {
          closestDist = dist;
          closestCity = city;
        }
      }

      if (closestCity && onCityClick) {
        onCityClick(closestCity.lat, closestCity.lng, closestCity.name);
      }
    }

    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mouseup', onMouseUp);

    // Atmosphere
    const atmosphereGeometry = new THREE.SphereGeometry(ATMOSPHERE_RADIUS, 128, 64);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      uniforms: {
        sunDirection: { value: sunDirection },
      },
      vertexShader: atmosphereVertexShader,
      fragmentShader: atmosphereFragmentShader,
      transparent: true,
      side: THREE.BackSide,
      depthWrite: false,
    });

    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphere);

    // Inner atmosphere
    const innerAtmosMaterial = new THREE.ShaderMaterial({
      uniforms: {
        sunDirection: { value: sunDirection },
      },
      vertexShader: atmosphereVertexShader,
      fragmentShader: `
        uniform vec3 sunDirection;
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vec3 viewDir = normalize(-vPosition);
          vec3 normal = normalize(vNormal);
          float fresnel = 1.0 - dot(viewDir, normal);
          fresnel = pow(fresnel, 5.0);
          float sunInfluence = dot(normal, sunDirection) * 0.5 + 0.5;
          vec3 color = vec3(0.3, 0.5, 1.0);
          float intensity = fresnel * sunInfluence * 0.4;
          gl_FragColor = vec4(color, intensity);
        }
      `,
      transparent: true,
      side: THREE.FrontSide,
      depthWrite: false,
    });

    const innerAtmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(GLOBE_RADIUS + 0.01, 128, 64),
      innerAtmosMaterial
    );
    scene.add(innerAtmosphere);

    // Stars
    const stars = createStarField();
    scene.add(stars);

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x111122, 0.5);
    scene.add(ambientLight);

    // Post-processing
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.4,
      0.8,
      0.6
    );
    composer.addPass(bloomPass);

    // Slow auto-rotation
    let userInteracting = false;
    let interactionTimeout: ReturnType<typeof setTimeout>;

    controls.addEventListener('start', () => {
      userInteracting = true;
      clearTimeout(interactionTimeout);
    });

    controls.addEventListener('end', () => {
      interactionTimeout = setTimeout(() => {
        userInteracting = false;
      }, 3000);
    });

    // Audio manager reference
    const audioManager = AudioManager.getInstance();

    // Animation loop
    const clock = new THREE.Clock();

    function animate() {
      const animationId = requestAnimationFrame(animate);
      sceneRef.current!.animationId = animationId;

      const elapsed = clock.getElapsedTime();

      // Fly-to animation
      if (isFlying && flyTarget && flyStart) {
        const t = Math.min((elapsed - flyStartTime) / FLY_DURATION, 1);
        // Ease in-out cubic
        const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

        // Slerp for natural globe rotation arc
        const startDir = flyStart.clone().normalize();
        const endDir = flyTarget.clone().normalize();
        const dist = flyStart.length();

        const q1 = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), startDir);
        const q2 = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), endDir);
        const qInterp = q1.clone().slerp(q2, ease);

        const newDir = new THREE.Vector3(0, 0, 1).applyQuaternion(qInterp);
        camera.position.copy(newDir.multiplyScalar(dist));
        camera.lookAt(0, 0, 0);

        if (t >= 1) {
          isFlying = false;
          interactionTimeout = setTimeout(() => {
            userInteracting = false;
          }, 2000);
        }
      } else {
        // Slow auto-rotation
        if (!userInteracting) {
          earth.rotation.y += 0.0005;
          innerAtmosphere.rotation.y = earth.rotation.y;
        }
        controls.update();
      }

      // Update sun direction every ~60 seconds
      if (Math.floor(elapsed) % 60 === 0 && elapsed > 1) {
        const newSunDir = getSunDirection();
        earthMaterial.uniforms.sunDirection.value.copy(newSunDir);
        atmosphereMaterial.uniforms.sunDirection.value.copy(newSunDir);
        innerAtmosMaterial.uniforms.sunDirection.value.copy(newSunDir);
      }

      // Update city ember uniforms
      const camDist = camera.position.length();
      const emberMat = currentEmbers.material as THREE.ShaderMaterial;
      emberMat.uniforms.cameraDistance.value = camDist;
      emberMat.uniforms.time.value = elapsed;

      // Update fog animation
      earthMaterial.uniforms.time.value = elapsed;

      // Update audio zoom crossfade
      const zoomFactor = 1.0 - (camDist - MIN_DISTANCE) / (MAX_DISTANCE - MIN_DISTANCE);
      audioManager.updateZoom(Math.max(0, Math.min(1, zoomFactor)));

      composer.render();
    }

    sceneRef.current = { renderer, composer, controls, animationId: 0 };
    animate();

    // Resize handler
    function onResize() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      composer.setSize(width, height);
      bloomPass.resolution.set(width, height);
    }

    window.addEventListener('resize', onResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('globe:flyto', onFlyTo);
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      renderer.domElement.removeEventListener('mouseup', onMouseUp);
      unsubscribeStore();
      clearTimeout(interactionTimeout);
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId);
      }
      controls.dispose();
      renderer.dispose();
      container.removeChild(renderer.domElement);
      earthGeometry.dispose();
      earthMaterial.dispose();
      atmosphereGeometry.dispose();
      atmosphereMaterial.dispose();
      innerAtmosMaterial.dispose();
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100vw', height: '100vh', overflow: 'hidden' }} />;
}
