precision highp float;

uniform sampler2D velocity;
uniform sampler2D positions;
uniform sampler2D state;
uniform sampler2D originPos;
uniform sampler2D offSets;

uniform vec3 mousePos;

uniform float transitionTime;
uniform float animTime;
uniform float mode;
uniform float activityCoef;
uniform float scrollDirection;
uniform vec2 resolution;

const float PI = 3.141592657;

#pragma glslify: snoise = require(../../utils/glsl/noise/noise3D.glsl)
#pragma glslify: curlNoise = require(../../utils/glsl/noise/curlNoise.glsl)
// #pragma glslify: twirl = require(./twirl.glsl)
#pragma glslify: random = require(../../utils/glsl/random)
#pragma glslify: map = require(../../utils/glsl/map)


void main() {
    
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec3 vel = texture2D(velocity, uv).rgb;
    vec3 pos = texture2D(positions, uv).rgb;
    vec3 origPos = texture2D(originPos, uv).rgb;
    vec3 posOffset = texture2D(offSets, uv).xyz;
    float life = texture2D(positions, uv).w;
  
    float dreamLife = sin(((animTime * 0.025) + mix(0.0, 1.0, uv.y)) * mix(3.0, 1.0, uv.x)) * 8.0 * 1.0 - step(0.0, mode); //gonna change this
    // float dreamLife = 1.0 - step(0.0, mode) * (sin(((animTime * 0.025) + mix(0.0, 1.0, uv.y)) * mix(3.0, 1.0, uv.x)) * 8.0); //gonna change this
    // dreamLife *= 1.0 - smoothstep(0.0, 1.0, mode);

    float seekLife = sin((animTime + mix(0.0, 1.0, uv.y)) * (mix(10.0, 2.35, uv.x))) * 8.0 * step(1.0, mode) * 1.0 - (1.0, mode);    
    // float seekLife = sin((animTime * 0.35 + mix(0.0, 1.0, uv.y)) * (mix(10.0, 5.35, uv.x))) * 8.0;    
    // seekLife *= smoothstep(0.0, 1.0, mode) * 1.0 - smoothstep(1.0, 1.1, mode);
    
    float projectLife = 1.0;
    projectLife *= smoothstep(0.0, 2.0, mode) * 1.0 - smoothstep(2.0, 2.1, mode);
    
    life = dreamLife + seekLife + projectLife;
    // life = dreamLife;
      
    vec3 dreamCurl = curlNoise(pos * 0.01 * (mix(1.0, posOffset.x , 0.2) * 0.81) + animTime * 0.1); //dream state
    // vec3 seekCurl = curlNoise(pos * 0.7 * (mix(posOffset.y, 1.0, 0.4) * 0.1) + animTime * 0.3);
    vec3 seekCurl = curlNoise(pos * 0.35 * (mix(1.0, posOffset.y, 0.4) * 0.1) + animTime * 0.3);
    // vec3 seekCurl = curlNoise(((pos * 0.1) * (posOffset.y * 0.1)) + animTime * 0.3);
    // vec3 seekCurl = curlNoise(pos * smoothstep(0.5, 0.1, life) * (mix(1.0, posOffset.y, 0.2) * 0.1) + animTime * 0.1);

    vec3 dreamNoise = dreamCurl * 0.8 * map(dreamLife, 0.0, 8.0, 0.01, 1.1) * (0.5 + 0.5);
    // vec3 dreamNoise = dreamCurl * map(dreamLife, 0.0, 8.0, 0.01, 1.1) * (0.5 + 0.5);
    // vec3 seekNoise = seekCurl * 12.08 * (mix(1.5, 4.0, smoothstep(0.1, 1.0, life))) * 0.03;
    vec3 seekNoise = seekCurl * 0.08 * (mix(3.5, 7.0, smoothstep(0.0, 1.0, life)));
    // vec3 seekNoise = seekCurl * 0.8 * map(seekLife, 0.0, 8.0, 0.01, 1.1);

    dreamNoise *= 1.0 - smoothstep(0.0, 1.0, mode);
    seekNoise *= smoothstep(0.0, 1.0, mode) * 1.0 - smoothstep(1.0, 1.1, mode);

    // dreamNoise *= 1.0 - step(0.0, mode);
    // seekNoise *= step(1.0, mode) * 1.0 - step(1.1, mode);

    // vec3 finalNoise = seekNoise;
    vec3 finalNoise = dreamNoise + seekNoise;
    // vec3 finalNoise = dreamNoise;
    pos += finalNoise;
  
    float maxRad = 200.0 * map(life, 0.0, 8.0, 1.25, 1.0);
    // // float dist = length(mousePos - pos);
    float dist = length(pos);
    float distSt = step(maxRad, dist);
    float force = distSt * ((dist - maxRad) * 0.1);
    force *= 1.0 - smoothstep(0.0, 0.1, mode);

    pos += mix(vec3(0.0), normalize(vec3(0.0) - pos) * force, distSt);

    // //howcome this repels?
    // ////////////////////////////////////////////////////////////////////////
    float dist2 = length(mousePos - pos);
    float dist2St = step(30.0, dist2) * 1.0 - step(70.0, dist2);
    float force2 = dist2St * ((dist2 - 70.0) * 0.1);
    force2 *= 1.0 - smoothstep(0.0, 0.1, mode);
    
    pos += mix(vec3(0.0), normalize(mousePos - pos) * force2 * activityCoef, dist2St);
    // ////////////////////////////////////////////////////////////////////////

    vel *= step(2.0, mode);

    pos += vel;

    //     pos.x += map(transitionTime, 0.0, 1.0, 0.0, 
    // cos((transitionTime * PI * 2.0) * mix(-1.0, 1.0, posOffset.x))) 
    // * map(transitionTime, 0.0, 1.0, 0.0, 15.0 * mix(0.5, 1.5, posOffset.y));
      
    // pos.y += map(transitionTime, 0.0, 1.0, 0.0, 
    // sin((transitionTime * PI * 2.0) * mix(-1.0, 1.0, posOffset.x))) 
    // * map(transitionTime, 0.0, 1.0, 0.0, 15.0 * mix(0.5, 1.5, posOffset.y));
      
    // pos.z += map(transitionTime, 0.0, 1.0, 0.0, 
    // cos((transitionTime * PI * 2.0) * mix(-1.0, 1.0, posOffset.x)) * cos((transitionTime * PI * 2.0)) 
    // * mix(-1.0, 1.0, posOffset.x)) * map(transitionTime, 0.0, 1.0, 0.0, 15.0 * mix(-1.5, 1.5, posOffset.y));
      
    if(life <= 0.0) {
        
        // pos = mousePos;
        // pos = mix(vec3(0.0), mousePos, mode);

        pos = 1.0 - step(0.0, mode) * vec3(0.0) + step(1.0, mode) * mousePos;

        // pos = vec3(0.0);

        // vec3 curl = curlNoise(pos * 0.3 * (mix(1.0, posOffset.x , 0.7) * 0.2) + animTime * 0.3);

        // vec3 noise = curl * 7.1 * (1.8 + map(uv.y, 0.0, 1.0, 0.1, 1.8));

        // pos += noise;

        // pos.y = pos.y + sin(radians(animTime * 0.5) * 2.0 * PI) * 10.0;

        // pos.z = pos.z + cos(radians(animTime * 0.5) * 2.0 * PI) * 10.0;

        pos.y = pos.y + sin((radians(animTime * 0.5)) * 2.0 * PI) * 10.0;

        pos.z = pos.z + cos((radians(animTime * 0.5)) * 2.0 * PI) * 10.0;
         
      }

    gl_FragColor = vec4(pos, life);

}