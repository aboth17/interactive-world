uniform sampler2D dayTexture;
uniform sampler2D nightTexture;
uniform sampler2D bumpTexture;
uniform vec3 sunDirection;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vec3 dayColor = texture2D(dayTexture, vUv).rgb;
  vec3 nightColor = texture2D(nightTexture, vUv).rgb;

  // Desaturate and darken the day texture for the base "unexplored" look
  float luminance = dot(dayColor, vec3(0.299, 0.587, 0.114));
  vec3 desaturated = mix(vec3(luminance), dayColor, 0.15); // mostly desaturated
  vec3 darkened = desaturated * 0.25; // significantly darkened

  // Sun-based lighting for day/night terminator
  vec3 worldNormal = normalize(vNormal);
  float sunDot = dot(worldNormal, sunDirection);

  // Smooth terminator transition
  float dayFactor = smoothstep(-0.15, 0.25, sunDot);

  // Base diffuse lighting (subtle, not full bright)
  float diffuse = max(0.0, sunDot) * 0.3 + 0.7; // ambient 0.7, diffuse adds 0.3

  // Combine: darkened day on the lit side, night lights on the dark side
  // Night lights are very faint — just a whisper
  vec3 nightGlow = nightColor * 0.4 * (1.0 - dayFactor);
  vec3 baseColor = darkened * diffuse + nightGlow;

  gl_FragColor = vec4(baseColor, 1.0);
}
