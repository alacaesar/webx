export default `

uniform float time;
uniform float progress;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform vec4 resolution;
varying vec2 vUv;
varying vec3 vPosition;

varying float vAlpha;

void main()	{

	// calculating distance from the center of each particle
	float distance = length(gl_PointCoord - vec2(0.5,0.5));

	// building transparency
	float alpha = 1. - smoothstep(0.0,0.5,distance);

	gl_FragColor = vec4(1.,0.,0.,alpha*vAlpha);
}

`;