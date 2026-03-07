varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vec3 viewDir = normalize(-vPosition);
  vec3 normal = normalize(vNormal);

  // Fresnel effect — stronger glow at edges
  float fresnel = 1.0 - dot(viewDir, normal);
  fresnel = pow(fresnel, 3.0);

  vec3 atmosColor = vec3(0.5, 0.65, 1.0);

  float intensity = fresnel * 0.75;

  // Fade out the atmosphere on the very edge to avoid hard cutoff
  float edgeFade = smoothstep(0.0, 0.15, dot(viewDir, normal));

  gl_FragColor = vec4(atmosColor, intensity * edgeFade * 0.8);
}
