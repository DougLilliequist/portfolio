precision highp float;

uniform vec3 colr;
uniform float alpha;

varying vec2 vUv;

void main() {

    // vec3 colr = vec3(1.0);

    // gl_FragColor = vec4(vec3(1.0), alpha);
    gl_FragColor = vec4(colr, alpha);

}