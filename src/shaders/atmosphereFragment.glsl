uniform vec3 sunDirection;

varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vec3 viewDir = normalize(-vPosition);
  vec3 normal = normalize(vNormal);

  // Fresnel effect — stronger glow at edges
  float fresnel = 1.0 - dot(viewDir, normal);
  fresnel = pow(fresnel, 3.0);

  // Atmospheric scattering color — blue-white with subtle warmth on the sun side
  vec3 coldColor = vec3(0.4, 0.6, 1.0);  // blue
  vec3 warmColor = vec3(0.6, 0.7, 1.0);  // slightly warmer blue-white

  float sunInfluence = dot(normal, sunDirection) * 0.5 + 0.5;
  vec3 atmosColor = mix(coldColor, warmColor, sunInfluence);

  // Intensity varies with sun angle — brighter on the lit side
  float intensity = fresnel * (0.5 + 0.5 * sunInfluence);

  // Fade out the atmosphere on the very edge to avoid hard cutoff
  float edgeFade = smoothstep(0.0, 0.15, dot(viewDir, normal));

  gl_FragColor = vec4(atmosColor, intensity * edgeFade * 0.8);
}
