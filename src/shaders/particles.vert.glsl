// Poeira ao redor da forma; foge do mouse (mw) e expande com o clique (p).
attribute float sz;
uniform float t, p;
uniform vec3 mw;
varying float vA;

void main() {
  vec3 q = position;
  q.y += sin(t * .4 + sz * 20.) * .15;
  vec4 w = modelMatrix * vec4(q, 1.);
  vec2 d = w.xy - mw.xy;
  float l = length(d);
  w.xy += normalize(d + 1e-4) * smoothstep(1.3, 0., l) * .9;
  w.xyz *= 1. + p * .25 * sz;
  vec4 mv = viewMatrix * w;
  gl_PointSize = (1.4 + sz * 3.6) * (4. / -mv.z);
  vA = .2 + sz * .6 + smoothstep(1.3, 0., l) * .5;
  gl_Position = projectionMatrix * mv;
}
