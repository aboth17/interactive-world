uniform sampler2D dayTexture;
uniform sampler2D nightTexture;
uniform sampler2D bumpTexture;
uniform sampler2D visitedMask;
uniform vec3 sunDirection;
uniform float time;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

// --- Simplex 3D noise (Ashima Arts) ---
vec4 permute(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 1.0 / 7.0;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

float fbm(vec3 p) {
  float value = 0.0;
  float amp = 0.5;
  float freq = 1.0;
  for (int i = 0; i < 4; i++) {
    value += amp * snoise(p * freq);
    amp *= 0.5;
    freq *= 2.0;
  }
  return value;
}

void main() {
  vec3 dayColor = texture2D(dayTexture, vUv).rgb;
  vec3 nightColor = texture2D(nightTexture, vUv).rgb;
  float maskVal = texture2D(visitedMask, vUv).r;

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

  // --- Organic animated fog ---
  // 3D noise using view-space position to avoid UV seam artifacts
  vec3 noisePos = vPosition * 0.7;
  vec3 drift = vec3(time * 0.012, time * 0.008, time * -0.01);
  float noise = fbm(noisePos + drift);

  float visited = step(0.5, maskVal);

  // Fog depth variation — subtle density differences across unvisited areas
  float fogDepth = 1.0 + noise * 0.06;

  // --- VISITED: vivid satellite imagery ---
  float vDiffuse = max(0.0, sunDot) * 0.4 + 0.65;
  vec3 visitedDay = correctedDay * vDiffuse * 1.7 * dayFactor;
  vec3 visitedNight = nightColor * 0.35 * (1.0 - dayFactor);
  vec3 visitedColor = visitedDay + visitedNight;

  // --- UNVISITED: cinematic living fog ---
  vec3 terrainDark = mix(vec3(correctedLum), correctedDay, 0.45) * 0.12 * dayFactor;
  vec3 fogFloor = vec3(0.014, 0.013, 0.012);
  vec3 unvisitedColor = (terrainDark + fogFloor * dayFactor) * fogDepth;
  vec3 nightWhisper = nightColor * 0.10 * (1.0 - dayFactor);
  unvisitedColor += nightWhisper;

  vec3 baseColor = mix(unvisitedColor, visitedColor, visited);

  gl_FragColor = vec4(baseColor, 1.0);
}
