uniform sampler2D positions;
uniform sampler2D velocity;
uniform sampler2D steer;
uniform sampler2D shape;

uniform vec3 mousePos;
uniform float delta;
uniform float radius;
uniform float animTime;

uniform float maxForce;
uniform float maxSpeed;

uniform vec2 resolution;

const float PI = 3.141592657;

#pragma glslify: map = require(../../../utils/glsl/map)

void main() {

    vec2 uv = gl_FragCoord.xy / resolution.xy;

    vec3 pos = texture2D(positions, uv).xyz;
    
    vec3 vel = texture2D(velocity, uv).xyz;
    
    vec3 steerForce = texture2D(steer, uv).xyz;

    float mass = texture2D(steer, uv).w;

    vec3 desired = vec3(0.0);

    //apply condition for seektarget when transitioninig and when simply interacting (even if seeking is not used)

    // target = mix(mousePos, vec3(0.0), clamp(1.0 - animTime * 0.08, 0.0, 1.0));

    // desired = t - pos;
    
    desired = mousePos - pos;

    float dist = length(desired);

    desired = normalize(desired);

    desired *= mix(maxSpeed, map(dist, 0.0, 5.0, 0.0, maxSpeed), 1.0 - (step(0.0, dist) * step(5.0, dist)));
        
    steerForce *= vec3(0.0);
    
    steerForce += (desired - vel);
    
    // if(length(steerForce) > maxForce) {

    //     steerForce = normalize(steerForce);

    //     steerForce *= maxForce;

    // }

    float steerForceLimit = step(maxForce, length(steerForce));

    steerForce = mix(steerForce, normalize(steerForce), steerForceLimit);

    steerForce *= mix(1.0, maxForce, steerForceLimit);

    // steerForce = step(maxForce, length(steerForce)) * normalize(steerForce) + (1.0 - step(maxForce, length(steerForce))) * steerForce;
    
    // steerForce *= step(maxForce, length(steerForce)) * maxForce + (1.0 - step(maxForce, length(steerForce))) * 1.0;

    gl_FragColor = vec4(steerForce, 1.0);
    // gl_FragColor = vec4(steerForce, mass);

}