export default `
varying vec2 vUv;
uniform sampler2D Texture1;
uniform float resolution;
uniform float shift;
uniform float blur;

void main() {
    vUv = uv;
    vec4 tex = texture2D(Texture1, vUv);

    vec3 pos = position;

    float ss = mod(((1.-shift) + tex.r * (1.-shift)) * 20. * tex.b, 10.);
    pos.z -= ss;

    /*
    pos.z -= cnoise(pos.xy + shift);
    float noise = smoothstep(0.,1.,cnoise(pos.xy + shift));
    if(noise < (1.-shift)){
        pos.z -= 1000.;
    }
    */

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.);
    gl_PointSize = ((resolution * 0.0068)/blur) * (1. / - mvPosition.z );
    gl_Position = projectionMatrix * mvPosition;
}
`;