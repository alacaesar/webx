export default `

uniform float time;
uniform sampler2D iTexture;
uniform sampler2D mTexture;
varying vec2 vUv;
varying vec2 vCoordinates;
varying vec3 vPos;

void main()	{

	vec2 nUv = vec2(vCoordinates.x/512.,vCoordinates.y/512.);
	vec4 tex = texture2D(iTexture, nUv);
	vec4 mask = texture2D(mTexture, gl_PointCoord);

	float alpha = 1. - clamp(0.,1.,abs(vPos.z/900.));

	gl_FragColor = tex;
	gl_FragColor.a *= mask.r * alpha;

}

`;