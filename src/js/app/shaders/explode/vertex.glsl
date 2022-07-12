export default `

varying vec2 vUv;
varying vec3 vPosition;
varying vec2 vCoordinates;
varying vec3 vPos;

attribute vec3 aCoordinates;
attribute float aSpeed;
attribute float aOffset;

uniform float move;
uniform float time;

void main() {
  vUv = position.xy;

  vec3 pos = position;
  pos.z = mod(position.z + move * aSpeed + aOffset, 2000.) - 1000.;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.);
  gl_PointSize = 3000. * (1. / - mvPosition.z ); 
  gl_Position = projectionMatrix * mvPosition;

  vCoordinates = aCoordinates.xy;
  vPos = pos;
  
}

`;