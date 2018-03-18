uniform sampler2D states;

uniform vec2 resolution;

void main() {

    vec2 uv = gl_FragCoord.xy / resolution.xy;

    vec4 state = texture2D(states, uv);
    
    gl_FragColor = state;

}