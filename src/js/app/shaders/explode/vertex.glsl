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
uniform float distortion;

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

//	Classic Perlin 2D Noise 
//	by Stefan Gustavson
//
vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}

float cnoise(vec2 P){
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);
  vec4 norm = 1.79284291400159 - 0.85373472095314 * 
    vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}

void main() {
  vUv = position.xy;

  vec2 nUv = vec2(aCoordinates.x/resolution,aCoordinates.y/resolution);
  vec4 tex = texture2D(iTexture1, nUv);

  vec3 pos = position;
  // pos.z = 0.;
  //pos.z = mod(position.z + move * 1000. * aSpeed + (1000. + move * 400. * tex.r), 2000.) - 1000.;
  pos.z = mod(position.z + move * 1000. * aSpeed + (move * 400. * tex.r), 1200.);
  // pos.z = position.z + move * 300. * aSpeed + (move * tex.r * 300.);


  pos.x += sin(move * tex.r * 20.) * 100.;
  //pos.y += cos(move * tex.g * 20.) * 10.;
  
  vec3 stable = position;
  float direction = 1.;
  float press = tex.r * 0.01 + 0.01;
  if(tex.r > 0.5){
    direction = -1.;
  }
  float distanceToPoint = distance(stable.xy, uMouse.xy);
  float area = 1. - smoothstep(0.,50.,distanceToPoint);
  stable.z += 50. * sin(time*press)*direction*area * distortion;
  stable.y += 50. * sin(time*press)*direction*area * distortion;
  stable.z += 100. * cos(time*press)*direction*area * distortion;

  //stable += rotateY3D(time*press)*stable*area*direction;

  vec3 finalPos;
  if(move == 0.){ 
    finalPos = stable;
  }else{
    finalPos = pos;
  }

  vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.);
  gl_PointSize = 4000. * (1. / - mvPosition.z );
  gl_Position = projectionMatrix * mvPosition;

  vCoordinates = aCoordinates.xy;
  vPos = pos;
  
}

`;