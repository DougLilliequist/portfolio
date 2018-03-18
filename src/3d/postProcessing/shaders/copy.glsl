uniform sampler2D tex;
uniform float opacity;
uniform vec2 resolution;

varying vec2 vUv;

void main() {

// vec2 uv = gl_FragCoord.xy / resolution.xy;

// gl_FragColor = opacity * texture2D(tex, uv);
gl_FragColor = opacity * texture2D(tex, vUv);

}