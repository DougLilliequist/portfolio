uniform sampler2D tex;
uniform vec2 resolution;

void main() {

    vec2 uv = gl_FragCoord.xy / resolution.xy;

    vec4 diffuse = texture2D(tex, uv);

    gl_FragColor = diffuse;

}