// Partículas que nascem da superfície da forma e se espalham conforme `dis`
// (0 = forma inteira, 1 = tudo virou pó). Filho do blob: herda rotação e posição.
attribute float rnd;
uniform float t, dis;
varying float vA, vR;

void main() {
  vec3 dir = normalize(position);
  float k = smoothstep(rnd * .55, rnd * .55 + .45, dis);
  vec3 drift = vec3(sin(t + rnd * 30.), cos(t * .8 + rnd * 20.), sin(t * .6 + rnd * 10.));
  vec3 q = position + dir * k * (1.2 + rnd * 2.6) + drift * k * .35;
  q.y += k * k * rnd * 1.4;
  vec4 mv = modelViewMatrix * vec4(q, 1.);
  gl_PointSize = (1.2 + rnd * 3.2) * (4. / -mv.z);
  vA = k * (1. - smoothstep(.7, 1., dis) * .75);
  vR = rnd;
  gl_Position = projectionMatrix * mv;
}
