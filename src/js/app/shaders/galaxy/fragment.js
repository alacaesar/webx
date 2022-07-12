export default `

uniform float time;
uniform float progress;
uniform vec4 resolution;
uniform sampler2D iTexture;
varying vec2 vUv;
varying vec3 vPosition;

void main()	{

	vec4 color = texture2D(iTexture, vUv);
	//gl_FragColor = vec4(color);

	gl_FragColor = vec4(vec3(1.),color.r);
}

`;