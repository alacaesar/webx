export default `

uniform float time;
varying vec2 vUv;
varying vec2 vUv1;
varying vec3 vPosition;
varying float vAlpha;

uniform sampler2D texture1;
uniform sampler2D texture2;
uniform vec2 pixels;
uniform vec2 uvRate1;
uniform vec2 uMouse;

attribute float angle;
attribute float life;

void main() {
  vUv = uv;

  // looping
  float current = mod(time, life);
  float percent = current/life;

  vec3 newpos = position;

  vAlpha = smoothstep(0.,0.5,percent);
  vAlpha -= smoothstep(0.85,1.,percent);

  newpos.x += cos(angle)*current*0.2;
  newpos.y += sin(angle)*current*0.2;

  vec3 curpos = newpos;
  float mouseRadius = 0.3;
  float dist = distance(curpos.xy, uMouse);
  float strength = dist/mouseRadius;
  strength = 1. - smoothstep(0.,1.,strength);

  float dx = uMouse.x - curpos.x;
  float dy = uMouse.y - curpos.y;
  float distortionAngle = atan(dx,dy);

  newpos.x += cos(distortionAngle)*strength;
  newpos.y += sin(distortionAngle)*strength;

  
  vec4 mvPosition = modelViewMatrix * vec4( newpos, 1.0 );
  gl_PointSize = 100. * (1. / - mvPosition.z );
  gl_Position = projectionMatrix * mvPosition;
  
}

`;