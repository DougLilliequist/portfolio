// uniform sampler2D separation;
uniform sampler2D seek;
uniform sampler2D velocity;
uniform sampler2D positions;

uniform float maxVel;
uniform vec2 resolution;

vec3 acc;

uniform float animTime;

#pragma glslify: map = require(../../utils/glsl/map)

void main() {

    vec2 uv = gl_FragCoord.xy / resolution.xy;

    // vec3 sepForce = texture2D(separation, uv).xyz;
    
    vec3 seekForce = texture2D(seek, uv).xyz;

    vec3 vel = texture2D(velocity, uv).xyz;

    vec3 pos = texture2D(positions, uv).xyz;

    float life = texture2D(positions, uv).w;

    // sepForce *= 1.0;

    seekForce *= 1.0;

    acc += seekForce;

    vel += acc.xyz;

    vel *= 1.0 - smoothstep(3.0, 8.0, life);
    
    float limitVel = step(maxVel, length(vel));

    vel = mix(vel, normalize(vel), limitVel);

    vel *= mix(1.0, maxVel, limitVel);

    acc *= 0.0;

    gl_FragColor = vec4(vel, 1.0);

}