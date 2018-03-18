uniform sampler2D positions;
uniform sampler2D velocity;
uniform sampler2D steer;
uniform sampler2D shape;

uniform vec3 mousePos;
uniform float delta;
uniform float radius;
uniform float animTime;

uniform vec3 minForce;
uniform vec3 maxForce;
uniform float maxSpeed;

uniform sampler2D predictVelocity;
uniform vec3 pointA;
uniform vec3 pointB;
uniform vec3 path[90];

uniform vec2 resolution;

float range(float val, float valMin, float valMax, float destMin, float destMax) {

    float oldVal = valMax - valMin;
    float newVal = destMax - destMin;

    return(((val - valMin) * newVal) / oldVal) + destMin;

    // float normVal = (val - valMin) / (valMax - valMin);

    // return mix(destMin, destMax, normVal);

}

vec3 normalPoint(vec3 loc, vec3 pA, vec3 pB) {

    vec3 vecA = loc - pA;

    vec3 vecB = pB - pA;

    vecB = normalize(vecB);

    vecB *= dot(vecA, vecB);

    vec3 normPoint = pA;

    normPoint += vecB;

    return normPoint;

}

// vec3 pathTarget(vec3 p, vec3 pA, vec3 pB) {

//     vec3 predict = texture2D(predictVelocity, uv).xyz;

//     predict = normalize(predict);

//     predict *= 25.0;

//     vec3 preLoc = p;

//     preLoc += predict;

//     vec3 normPoint = normalPoint(preLoc, pA, pB);

//     vec3 dir = pB - pA;

//     dir = normalize(dir);

//     dir *= 10.0;

//     vec3 target = normPoint + dir;

// }


void main() {

    vec2 uv = gl_FragCoord.xy / resolution.xy;

    vec3 pos = texture2D(positions, uv).xyz;
    
    vec3 vel = texture2D(velocity, uv).xyz;

    vec3 targetShape = texture2D(shape, uv).xyz;
    
    vec3 steerForce = texture2D(steer, uv).xyz;

    float mass = texture2D(steer, uv).w;

    vec3 desired = vec3(0.0);

    vec3 target = vec3(0.0);

    float record = 10000.0;

    vec3 predict = texture2D(predictVelocity, uv).xyz;

    predict = normalize(predict);

    predict *= 5.0;

    vec3 preLoc = pos;

    preLoc += predict;

    for(int i = 0; i < 90; i++) {
        
        vec3 a = path[i];

        vec3 b = path[i + 1];

        vec3 normPoint = normalPoint(preLoc, a, b);

        if(normPoint.x < a.x || normPoint.x > b.x) {

            normPoint = b;

        }

        float dist = distance(preLoc, normPoint);

        if(dist < record) {

            record = dist;

            target = normPoint;

            desired = target - pos;

            desired = normalize(desired);

            desired *= maxSpeed;

            steerForce *= vec3(0.0);

            steerForce += desired - vel;

            steerForce = clamp(steerForce, minForce * 0.3, maxForce * 0.3);

            gl_FragColor = vec4(steerForce, 1.0);

        }

    }

    // vec3 normPoint = normalPoint(preLoc, pointA, pointB);

    // vec3 dir = pointB - pointA;

    // dir = normalize(dir);

    // dir *= 10.0;

    // target = normPoint + dir;

    // if(distance(normPoint, preLoc) > 5.0 * 2.0) {

    //     desired = target - pos;

    //     desired = normalize(desired);

    //     desired *= maxSpeed;

    //     steerForce *= vec3(0.0);

    //     steerForce += desired - vel;

    //     steerForce = clamp(steerForce, minForce * 0.5, maxForce * .5);

    //     gl_FragColor = vec4(steerForce, 1.0);

    // } else {

    // // desired = mousePos - pos;

    // // float dist = length(desired);

    // // desired = normalize(desired);

    // // if(dist < 5.0) {

    // //     // desired *= smoothstep(-10.0, maxSpeed, dist);
    // //     // desired *= -0.001;
    // //     desired *= -10.0;

    // // } else {

    // // desired *= maxSpeed;

    // // }
        
    // // steerForce *= vec3(0.0);
    
    // // steerForce += (desired - vel);

    // // steerForce = clamp(steerForce, minForce, maxForce);

    // // gl_FragColor = vec4(steerForce, 1.0);
    // // // gl_FragColor = vec4(steerForce, mass);

    // }

}