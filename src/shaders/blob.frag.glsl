// Iridescência + fresnel vermelho; `dis` corta a superfície com ruído e
// acende uma borda de brasa onde a tinta está se desfazendo.
uniform float t, p, dis;
varying vec3 vN, vP, vO;
varying float vD;

float h(vec3 q) { return fract(sin(dot(q, vec3(12.9898, 78.233, 37.719))) * 43758.5453); }

float vn(vec3 q) {
  vec3 i = floor(q), f = fract(q);
  f = f * f * (3. - 2. * f);
  return mix(
    mix(mix(h(i), h(i + vec3(1., 0., 0.)), f.x), mix(h(i + vec3(0., 1., 0.)), h(i + vec3(1., 1., 0.)), f.x), f.y),
    mix(mix(h(i + vec3(0., 0., 1.)), h(i + vec3(1., 0., 1.)), f.x), mix(h(i + vec3(0., 1., 1.)), h(i + vec3(1., 1., 1.)), f.x), f.y),
    f.z);
}

void main() {
  float k = vn(vO * 3.5) * .65 + vn(vO * 9.) * .35;
  float cut = dis * 1.15 - .08;
  if (k < cut) discard;

  vec3 N = normalize(vN + vec3(sin(vD * 14. + t) * .3, cos(vD * 12.) * .3, 0.));
  vec3 V = normalize(vP);
  float fr = pow(1. - max(dot(N, V), 0.), 2.4);
  float sp = pow(max(dot(reflect(-normalize(vec3(.6, .8, .7)), N), V), 0.), 40.);
  float sp2 = pow(max(dot(reflect(-normalize(vec3(-.8, -.3, .4)), N), V), 0.), 18.);
  vec3 ir = .5 + .5 * cos(6.28 * (vD * 1.5 + fr * .6 + vec3(0., .33, .67)));
  vec3 c = vec3(.015) + vec3(.72, .06, .12) * fr * 1.4 + vec3(.97, .94, .9) * sp + ir * sp2 * .25 + vec3(.75, .08, .12) * p * fr;

  float edge = 1. - smoothstep(0., .07, k - cut);
  c = mix(c, vec3(.92, .14, .2), edge * step(.001, dis));
  gl_FragColor = vec4(c, 1.);
}
