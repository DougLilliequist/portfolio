uniform sampler2D tex;
uniform vec2 resolution;

#pragma glslify: fxaa = require('glsl-fxaa')

void main() {

    gl_FragColor = fxaa(tex, gl_FragCoord.xy, resolution);

}