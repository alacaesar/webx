export default `

uniform float time;
uniform float progress;
uniform sampler2D iTexture;
uniform sampler2D uTexture;
uniform vec4 resolution;
varying vec2 vUv;
varying vec2 vUv1;
varying vec3 vPosition;

void main()	{

	vec4 color = texture2D(iTexture, vUv);
	gl_FragColor = vec4(color);
}

`;