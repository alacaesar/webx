export default `
uniform sampler2D Texture1;
varying vec2 vUv;
uniform float shift;
uniform float blur;

varying vec3 pp;

void main() {
    float distance = length(gl_PointCoord - vec2(0.5,0.5));
    float alpha = 1. - step(0.5,distance);

    vec4 tex = texture2D(Texture1, vUv);
    gl_FragColor = vec4(tex.xyz, shift);
}
`