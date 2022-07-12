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

void main() {
  vUv = uv;
  
  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
  //gl_PointSize = 50. * (1. / - mvPosition.z );

  vec4 color1 = texture2D(texture1, vUv);

  float lum = (299. * color1.x + 587. * color1.y + 114. * color1.z ) / 1000.;

  // looping
  float current = mod(time*.1, lum*0.3);
  float percent = current/lum;

  vAlpha = smoothstep(0.,0.5,percent);
  vAlpha -= smoothstep(0.75,1.,percent);


  vec4 newpos = mvPosition;
  newpos.z += current;

  gl_PointSize = 10. * (1. / - mvPosition.z );
  gl_Position = projectionMatrix * newpos;
  
}

`;