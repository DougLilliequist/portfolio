uniform sampler2D positions;
uniform sampler2D velocity;
uniform sampler2D steer;
uniform sampler2D shape;

uniform vec3 mousePos;
uniform vec2 resolution;

uniform float delta;
uniform float radius;
uniform float animTime;
uniform float mode;

uniform float maxForce;
uniform float maxSpeed;

#pragma glslify: map = require(../../utils/glsl/map)

void main() {

    vec2 uv = gl_FragCoord.xy / resolution.xy;
    
    vec3 pos = texture2D(positions, uv).xyz;
    vec3 targetShape = texture2D(shape, uv).xyz;
    vec3 vel = texture2D(velocity, uv).xyz;
    vec3 steerForce = texture2D(steer, uv).xyz;
    float mass = texture2D(steer, uv).w;

    //seek without target shape
    vec3 desired = mousePos - pos;
    float dist = length(desired);

    desired = normalize(desired);
    desired *= mix(maxSpeed, map(dist, 0.0, 5.0, 0.0, maxSpeed), 1.0 - smoothstep(0.0, 5.0, dist));
        
    vec3 force1 = vec3(0.0);
    force1 += (desired - vel);
    float force1Limit = step(maxForce, length(force1));
    force1 = mix(force1, normalize(force1), force1Limit);
    force1 *= mix(1.0, maxForce, force1Limit);
    ///

    //seek with targetShape and flee from mouse
    vec3 desired2 = mousePos - pos;
    vec3 desired3 = targetShape - pos;
    float dist2 = length(desired2);
    float dist3 = length(desired3);
    desired2 = normalize(desired2);
    desired3 = normalize(desired3);

    desired3 *= mix(maxSpeed, map(dist3, 0.0, 150.0, 0.0, maxSpeed), 1.0 - smoothstep(0.0, 150.0, dist3));

    float avoid = 1.0 - step(20.0 * smoothstep(0.1, 1.0, delta), dist2);

    desired2 *= mix(0.0, -20.0, avoid);
    desired3 *= mix(maxSpeed, maxSpeed * 1.5, avoid); //maybe this is causing the glitching

    vec3 force2 = vec3(0.0);
    force2 += desired2 - vel;
    force2 += desired3 - vel;

    // float force2Limit = step(maxForce, length(force2));
    float force2Limit = step(maxForce, length(force2));
    force2 = mix(force2, normalize(force2), force2Limit);
    force2 *= mix(1.0, maxForce, force2Limit);
    ////

    steerForce = mix(force1, force2, mode); //replace the 1.0 with a lerp value

    gl_FragColor = vec4(steerForce, 1.0);

}