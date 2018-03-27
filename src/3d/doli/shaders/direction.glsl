uniform sampler2D directions;
uniform sampler2D currentPos;
uniform sampler2D previousPos;

uniform vec3 mousePos;
uniform vec3 prevMousePos;
uniform vec2 resolution;

void main() {

    vec2 uv = gl_FragCoord.xy / resolution.xy;

    vec3 direction = texture2D(directions, uv).xyz;

    vec3 prevPos = texture2D(previousPos, uv).xyz;

    vec3 currPos = texture2D(currentPos, uv).xyz;

    float life = texture2D(currentPos, uv).w;

        direction = normalize(mousePos - prevMousePos);

        direction *= 1.0 - smoothstep(0.0, 8.0, life);

    gl_FragColor = vec4(direction, 1.0);

}