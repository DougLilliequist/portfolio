uniform sampler2D tex;
uniform vec2 resolution;
uniform vec2 blurRes;
uniform vec2 direction;

#pragma glslify: blur = require('glsl-fast-gaussian-blur')

void main() {

    vec2 uv = gl_FragCoord.xy / resolution.xy;

    // vec4 b = blur(tex, uv, resolution * 0.5, direction);
    vec4 b = blur(tex, uv, blurRes, direction);
    // vec4 b = blur(tex, uv, resolution, direction);

    gl_FragColor = b;

}