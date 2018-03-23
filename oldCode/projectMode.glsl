uniform sampler2D positions;
uniform sampler2D velocity;
uniform sampler2D steer;
uniform sampler2D shape;

uniform vec3 mousePos;
uniform float delta;
uniform float radius;
uniform float scrollDirection;
uniform float animTime;


uniform float maxForce;
uniform float maxSpeed;

uniform bool mode;

uniform vec2 resolution;

varying vec2 vUv;

const float PI = 3.141592657;

#pragma glslify: map = require(../../utils/glsl/map)

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

void main() {

    vec2 uv = gl_FragCoord.xy / resolution.xy;

    vec3 pos = texture2D(positions, uv).xyz;
    
    vec3 vel = texture2D(velocity, uv).xyz;

    vec3 targetShape = texture2D(shape, uv).xyz;
    
    vec3 steerForce = texture2D(steer, uv).xyz;

    float life = texture2D(positions, uv).w;

    float offSet = texture2D(shape, uv).w;

    float mass = texture2D(steer, uv).w;

    vec3 desired = vec3(0.0);

    vec3 desired2 = vec3(0.0);

    desired = targetShape - pos;
    // desired = targetShape + (normalize(mousePos) * 1.0) - pos;
    
    float dist = length(desired);
    // float dist = distance(targetShape, pos);

    desired = normalize(desired);

    desired2 = mousePos - pos;
    
    float dist2 = length(desired2);

    // float dist2 = distance(mousePos, pos);

    desired2 = normalize(desired2);

    desired *= mix(maxSpeed, map(dist, 0.0, 50.0, 0.01, maxSpeed * 0.025), 1.0 - (step(0.0, dist) * step(50.0, dist)));

    // if(dist2 < 50.0 * smoothstep(0.1, 2.0, delta)) { //kindoff works, glitches out after a while...

    //     desired2 *= -20.0;

    //     desired *= maxSpeed * 1.5;

    //     steerForce *= vec3(0.0);

    //     steerForce += (desired2 - vel);
        
    //     steerForce += (desired - vel);

    //     } else {

    //     desired *= maxSpeed;
        
    //     steerForce *= vec3(0.0);
        
    //     steerForce += (desired - vel);

    // }

    // float speed = map(dist, 0.0, 50.0, 0.0001, maxSpeed * 1.0);

    float avoid = 1.0 - step(50.0 * smoothstep(0.1, 2.0, delta), dist2);

    desired *= mix(maxSpeed, maxSpeed * 1.5, avoid);

    desired2 *= mix(0.0, -20.0, avoid);

    // desired *= (1.0 - step(50.0 * smoothstep(0.1, 2.0, delta), dist2)) * (maxSpeed * 1.5) + step(50.0 * smoothstep(0.1, 2.0, delta), dist2) * maxSpeed;

    // desired2 *= (1.0 - step(50.0 * smoothstep(0.1, 2.0, delta), dist2)) * -20.0;    

    steerForce *= vec3(0.0);

    steerForce += (desired - vel);

    steerForce += (desired2 - vel);

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

    }
