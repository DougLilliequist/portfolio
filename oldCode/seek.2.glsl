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

vec2 uv;
vec3 pos;
vec3 vel;
vec3 targetShape;
float mass;

vec3 steerForce;
vec3 force1;
vec3 force2;
vec3 outputSteerForce; //rename
vec3 desired;
vec3 desired2;
vec3 desired3;

const float PI = 3.141592657;

#pragma glslify: map = require(../../utils/glsl/map)

void main() {

    uv = gl_FragCoord.xy / resolution.xy;
    
    pos = texture2D(positions, uv).xyz;
    targetShape = texture2D(shape, uv).xyz;
    vel = texture2D(velocity, uv).xyz;
    steerForce = texture2D(steer, uv).xyz;
    mass = texture2D(steer, uv).w;


    desired = vec3(0.0);
    desired = mousePos - pos;
    float dist = length(desired);

    desired = normalize(desired);
    desired *= mix(maxSpeed, map(dist, 0.0, 5.0, 0.0, maxSpeed), 1.0 - (step(0.0, dist) * step(5.0, dist)));
        
    steerForce *= vec3(0.0);
    steerForce += (desired - vel);
    float force1Limit = step(maxForce, length(steerForce));
    steerForce = mix(steerForce, normalize(steerForce), force1Limit);
    steerForce *= mix(1.0, maxForce, force1Limit);

    // steerForce *= 1.0 - step(0.0, mode);
    steerForce *= 1.0 - smoothstep(0.0, 1.0, mode);

    desired2 = vec3(0.0);
    desired3 = vec3(0.0);
    desired2 = mousePos - pos;
    desired3 = targetShape - pos;
    float dist2 = length(desired2);
    float dist3 = length(desired3);
    desired2 = normalize(desired2);
    desired3 = normalize(desired3);

    desired3 *= mix(maxSpeed, map(dist3, 0.0, 150.0, 0.0, maxSpeed), 1.0 - (step(0.0, dist3) * step(150.0, dist3)));

    float avoid = 1.0 - step(50.0 * smoothstep(0.1, 2.0, delta), dist2);

    desired2 *= mix(0.0, -20.0, avoid);
    desired3 *= mix(maxSpeed, maxSpeed * 1.5, avoid); //maybe this is causing the glitching

    steerForce *= vec3(0.0);
    steerForce += desired2 - vel;
    steerForce += desired3 - vel;

    // maxForce *= map(dist3, 0.0, 150.0, 1.0, 4.0);

    float force2Limit = step(maxForce, length(steerForce));
    steerForce = mix(steerForce, normalize(steerForce), force2Limit);
    steerForce *= mix(1.0, maxForce, force2Limit);

    // steerForce *= step(1.0, mode);
    steerForce *= smoothstep(0.0, 1.0, mode);

    // steerForce = mix(force1, force2, 1.0);

    // gl_FragColor = vec4(steerForce, 1.0);
    gl_FragColor = vec4(steerForce, 1.0);
    // gl_FragColor = vec4(steerForce, mass);

}