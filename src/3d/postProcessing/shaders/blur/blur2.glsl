uniform sampler2D tex;
uniform vec2 resolution;
uniform vec2 direction;

varying vec2 vUv;

#pragma glslify: blur = require('glsl-fast-gaussian-blur/9')

void main() {

    vec2 uv = gl_FragCoord.xy / resolution.xy;

    gl_FragColor = blur(tex, vUv, resolution, direction);

}