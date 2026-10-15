// Pós-processamento: onda de tinta no clique (rp = x, y, instante), lente no
// mouse, aberração cromática, vinheta, grão e scanlines.
uniform sampler2D tD;
uniform vec2 m;
uniform float t, v, asp;
uniform vec3 rp;
varying vec2 vU;

void main() {
  vec2 uv = vU, a = vec2(asp, 1.);
  float age = t - rp.z;
  vec2 dv = (uv - rp.xy) * a;
  float dd = length(dv);
  float w = sin(dd * 36. - age * 11.) * exp(-age * 1.4) * (1. - smoothstep(age * .6 - .2, age * .6 + .04, dd)) * .04 * step(0., age);
  uv += normalize(dv + 1e-5) / a * w;

  vec2 dm = (uv - m) * a;
  uv -= dm / a * smoothstep(.28, 0., length(dm)) * .07;

  float ca = .0015 + .008 * v + length(vU - .5) * .006 + abs(w) * .5;
  vec2 dir = normalize(uv - .5 + 1e-5);
  vec3 c = vec3(texture2D(tD, uv + dir * ca).r, texture2D(tD, uv).g, texture2D(tD, uv - dir * ca).b);
  c += vec3(.75, .05, .1) * abs(w) * 7.;
  c *= 1. - smoothstep(.35, 1.05, length((vU - .5) * vec2(asp * .75, 1.))) * .75;
  c += (fract(sin(dot(vU + fract(t), vec2(12.9898, 78.233))) * 43758.5453) - .5) * .045;
  c *= .97 + .03 * sin(vU.y * 900.);
  gl_FragColor = vec4(c, 1.);
}
