export default `

varying vec2 vUv;
varying vec3 vPosition;
varying vec2 vCoordinates;
varying vec3 vPos;

uniform sampler2D iTexture1;
uniform sampler2D iTexture2;

attribute vec3 aCoordinates;
attribute float aSpeed;
attribute float aOffset;

uniform float move;
uniform float time;
uniform vec3 uMouse;
uniform float resolution;

// random rotation
mat3 rotateY3D(float theta) {
  float c = cos(theta);
  float s = sin(theta);
  return mat3(
      vec3(c, 0, s),
      vec3(0, 1, 0),
      vec3(-s, 0, c)
  );
}

void main() {
  vUv = position.xy;

  vec2 nUv = vec2(aCoordinates.x/resolution,aCoordinates.y/resolution);
  vec4 tex = texture2D(iTexture1, nUv);

  vec3 pos = position;
  pos.z = 0.;
  pos.z = mod(position.z + move * 1000. * aSpeed + (800. + move * 400. * tex.r), 2000.) - 1000.;

  pos.x += sin(move * tex.r * 50.) * 100.;
  pos.y += cos(move * tex.g * 50.) * 100.;

  vec3 stable = position;
  float direction = 1.;
  float press = tex.g * 0.01 + 0.01;
  if(tex.r > 0.5){
    direction = -1.;
  }
  float distanceToPoint = distance(stable.xy, uMouse.xy);
  float area = 1. - smoothstep(0.,500.,distanceToPoint);
  stable.z += 50. * sin(time*press)*direction*area;
  stable.y += 50. * sin(time*press)*direction*area;
  stable.z += 100. * cos(time*press)*direction*area;

  //stable += rotateY3D(time*press)*stable*area*direction;

  // mouse Interaction
  float distanceToMouse = pow(1. - clamp(length(uMouse.xy - position.xy)-0.3, 0.,10.),2.);
  pos.z += distanceToMouse;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.);
  gl_PointSize = 4000. * (1. / - mvPosition.z ); 
  gl_Position = projectionMatrix * mvPosition;

  vCoordinates = aCoordinates.xy;
  vPos = pos;
  
}

`;