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

  // --- VISITED: vivid full-color satellite imagery ---
  float vDiffuse = max(0.0, sunDot) * 0.5 + 0.5;
  float luminance = dot(dayColor, vec3(0.299, 0.587, 0.114));

  // Tint white/snowy areas toward amber so Alaska looks consistent
  float saturation = length(dayColor - vec3(luminance));
  float whiteness = smoothstep(0.4, 0.8, luminance) * (1.0 - smoothstep(0.0, 0.15, saturation));
  vec3 amber = vec3(1.0, 0.7, 0.3);
  vec3 tintedDay = mix(dayColor, amber * luminance, whiteness * 0.7);

  vec3 visitedDay = tintedDay * vDiffuse * dayFactor;
  vec3 visitedNight = nightColor * 0.35 * (1.0 - dayFactor);
  vec3 visitedColor = visitedDay + visitedNight;

  // --- UNVISITED: dark fog, terrain hints visible ---
  float foggedLum = luminance * 0.12;
  vec3 unvisitedColor = vec3(foggedLum) * dayFactor;
  vec3 nightWhisper = nightColor * 0.15 * (1.0 - dayFactor);
  unvisitedColor += nightWhisper;

  vec3 baseColor = mix(unvisitedColor, visitedColor, visited);

  gl_FragColor = vec4(baseColor, 1.0);
}
