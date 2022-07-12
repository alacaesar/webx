export default `

uniform float time;
varying vec2 vUv;
varying vec3 vPosition;

uniform sampler2D uTexture;
uniform sampler2D iTexture;
uniform vec2 pixels;
uniform vec2 uvRate1;

void main() {
  vUv = uv;

  vec4 tex = texture2D(uTexture, vUv);

	float vx = -(tex.r * 2. - 1.);
	float vy = -(tex.g * 2. - 1.);

	float intensity = tex.b;
	float maxAmplitude = 0.2;

	vUv.x += vx * intensity * maxAmplitude;
	vUv.y += vy * intensity * maxAmplitude;
  
  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

  gl_PointSize = 100. * (1. / - mvPosition.z );
  gl_Position = projectionMatrix * mvPosition;
  
}

`;