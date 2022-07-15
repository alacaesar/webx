export default `

uniform float time;
uniform sampler2D iTexture1;
uniform sampler2D iTexture2;
uniform sampler2D mTexture;
uniform float resolution;
varying vec2 vUv;
varying vec2 vCoordinates;
varying vec3 vPos;

uniform float transition;

void main()	{

	vec2 nUv = vec2(vCoordinates.x/resolution,vCoordinates.y/resolution);
	
	vec4 tex1 = texture2D(iTexture1, nUv);
	vec4 tex2 = texture2D(iTexture2, nUv);

	vec4 finalTex = mix(tex1, tex2, smoothstep(0.,1.,(transition)));
	
	vec4 mask = texture2D(mTexture, gl_PointCoord);

	float alpha = 1. - clamp(0.,1.,abs(vPos.z/900.));

	gl_FragColor = finalTex;
	gl_FragColor.a *= mask.r * alpha;

}

`;