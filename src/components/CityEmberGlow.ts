import * as THREE from 'three';
import { VISITED_CITIES } from '../data/visitedCities';
import { latLngToVector3 } from '../utils/coordinates';

export function createCityEmberPoints(globeRadius: number): THREE.Points {
  const count = VISITED_CITIES.length;
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const city = VISITED_CITIES[i];
    const pos = latLngToVector3(city.lat, city.lng, globeRadius + 0.02);
    positions[i * 3] = pos.x;
    positions[i * 3 + 1] = pos.y;
    positions[i * 3 + 2] = pos.z;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.ShaderMaterial({
    uniforms: {
      pixelRatio: { value: window.devicePixelRatio },
      cameraDistance: { value: 18.0 },
      time: { value: 0.0 },
    },
    vertexShader: `
      uniform float pixelRatio;
      uniform float cameraDistance;
      void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        float size = pixelRatio * (200.0 / cameraDistance);
        size = clamp(size, 4.0, 30.0);
        gl_PointSize = size;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform float time;
      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;

        // Multi-layered ember glow
        float core = 1.0 - smoothstep(0.0, 0.15, dist);
        float inner = 1.0 - smoothstep(0.0, 0.3, dist);
        float outer = 1.0 - smoothstep(0.0, 0.5, dist);

        // Subtle pulse
        float pulse = 0.9 + 0.1 * sin(time * 2.0);

        // Hot white core, amber inner, dim orange outer
        vec3 coreColor = vec3(1.0, 0.95, 0.8);
        vec3 innerColor = vec3(1.0, 0.7, 0.3);
        vec3 outerColor = vec3(0.9, 0.4, 0.1);

        vec3 color = coreColor * core + innerColor * inner * 0.6 + outerColor * outer * 0.3;
        float alpha = (core + inner * 0.5 + outer * 0.2) * pulse;

        gl_FragColor = vec4(color * alpha, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  return new THREE.Points(geometry, material);
}
