uniform sampler2D dayTexture;
uniform sampler2D nightTexture;
uniform sampler2D bumpTexture;
uniform sampler2D visitedMask;
uniform vec3 sunDirection;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vec3 dayColor = texture2D(dayTexture, vUv).rgb;
  vec3 nightColor = texture2D(nightTexture, vUv).rgb;
  float visited = step(0.5, texture2D(visitedMask, vUv).r);

  // Sun-based lighting
  vec3 worldNormal = normalize(vNormal);
  float sunDot = dot(worldNormal, sunDirection);
  float dayFactor = smoothstep(-0.15, 0.25, sunDot);

  float luminance = dot(dayColor, vec3(0.299, 0.587, 0.114));
  float saturation = length(dayColor - vec3(luminance));

  // Darken snow/ice without imposing color — preserve natural texture
  float whiteness = smoothstep(0.55, 0.85, luminance) * (1.0 - smoothstep(0.0, 0.10, saturation));
  vec3 correctedDay = dayColor * mix(1.0, 0.30, whiteness);
  float correctedLum = dot(correctedDay, vec3(0.299, 0.587, 0.114));

  // --- VISITED: vivid satellite imagery ---
  float vDiffuse = max(0.0, sunDot) * 0.4 + 0.65;
  vec3 visitedDay = correctedDay * vDiffuse * 1.7 * dayFactor;
  vec3 visitedNight = nightColor * 0.35 * (1.0 - dayFactor);
  vec3 visitedColor = visitedDay + visitedNight;

  // --- UNVISITED: cinematic darkened terrain with subtle fog ---
  vec3 terrainDark = mix(vec3(correctedLum), correctedDay, 0.45) * 0.12 * dayFactor;
  vec3 fogFloor = vec3(0.014, 0.013, 0.012);
  vec3 unvisitedColor = terrainDark + fogFloor * dayFactor;
  vec3 nightWhisper = nightColor * 0.10 * (1.0 - dayFactor);
  unvisitedColor += nightWhisper;

  vec3 baseColor = mix(unvisitedColor, visitedColor, visited);

  gl_FragColor = vec4(baseColor, 1.0);
}
