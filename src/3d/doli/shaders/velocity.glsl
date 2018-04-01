uniform sampler2D velocity;
uniform sampler2D positions;
uniform sampler2D offSets;

uniform float maxVel;
uniform vec2 resolution;

lowp vec3 acc;

uniform float animTime;

#pragma glslify: snoise = require(../../utils/glsl/noise/noise3D.glsl)
#pragma glslify: curlNoise = require(../../utils/glsl/noise/curlNoise.glsl)
#pragma glslify: map = require(../../utils/glsl/map)

void main() {

    vec2 uv = gl_FragCoord.xy / resolution.xy;
    
    vec3 vel = texture2D(velocity, uv).xyz;
    vec3 pos = texture2D(positions, uv).xyz;
    vec3 posOffset = texture2D(offSets, uv).xyz;

    float life = texture2D(positions, uv).w;

    vec3 dreamCurl = curlNoise(pos * 0.15 * posOffset.x * 0.41 + animTime * 0.1); //dream state
    
    vec3 acc = dreamCurl * 0.002 * (5.0 + 1.0);

    vel += acc;

    // vel *= mix(0.1, 1.0, life);
    
    float limitVel = step(maxVel, length(vel));

    vel = mix(vel, normalize(vel) * maxVel, limitVel);

    float maxRad = 120.0 * map(life, 0.0, 8.0, 1.25, 1.0);
    lowp float dist = length(pos);
    // float distSt = smoothstep(0.0, maxRad, dist);
    float distSt = step(maxRad, dist);
    float force = ((dist - maxRad) * 0.1 * 5.0);

    vel += normalize(vec3(0.0) - pos) * force * distSt;

    // lowp float dist2 = length(mousePos - pos);
    // float dist2St = 1.0 - smoothstep(30.0, 70.0, dist2);
    // float force2 = ((dist2 - 70.0) * 0.1 * 5.0);
    
    // vel += normalize(mousePos - pos) * force2 * dist2St;

    // vel *= mix(1.0, maxVel, limitVel);

    // acc *= 0.0;

    gl_FragColor = vec4(vel, 1.0);

}