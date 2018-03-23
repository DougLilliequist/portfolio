uniform sampler2D velocity;
uniform sampler2D positions;
uniform sampler2D state;
uniform sampler2D originPos;
uniform sampler2D offSets;

uniform vec3 mousePos;

uniform float transitionTime;
uniform float animTime;
uniform bool mode;
uniform float activityCoef;
uniform float scrollDirection;
uniform vec2 resolution;

const float PI = 3.141592657;

#pragma glslify: snoise = require(../../utils/glsl/noise/noise3D.glsl)
#pragma glslify: curlNoise = require(../../utils/glsl/noise/curlNoise.glsl)
#pragma glslify: random = require(../../utils/glsl/random)
#pragma glslify: map = require(../../utils/glsl/map)


void main() {
    
    vec2 uv = gl_FragCoord.xy / resolution.xy;

    vec3 vel = texture2D(velocity, uv).rgb;

    vec3 pos = texture2D(positions, uv).rgb;

    vec3 origPos = texture2D(originPos, uv).rgb;

    vec3 posOffset = texture2D(offSets, uv).xyz;

    float life = texture2D(positions, uv).w;
  
    float randlf = map(snoise((pos * 0.84) * 0.54), -1.0, 1.0, 1.0, 3.0);

    float state = 1.0;

    float randomLifeSpan = map(snoise((pos * 0.84) + animTime * 0.054), -1.0, 1.0, 0.085, 1.0);

    // bool mode = true;

    if(mode == true) {

    float seekLife = sin((animTime + mix(0.0, 1.0, uv.y)) * (mix(10.0, 2.35, uv.x))) * 8.0;
    
    float dreamLife = sin((animTime * 0.025 + mix(0.0, 1.0, uv.y)) * mix(3.0, 1.0, uv.x)) * 8.0;
    
    float finalLife = mix(dreamLife, seekLife, smoothstep(0.0, 1.0, activityCoef)); //rename later
           
    float projectLife = 1.0;
    
    life = mix(finalLife, projectLife, transitionTime);
      
    vec3 dreamCurl = curlNoise(pos * 0.01 * (mix(1.0, posOffset.x , 0.2) * 0.81) + animTime * 0.1); //dream state

    vec3 seekCurl = curlNoise(pos * 0.35 * (mix(1.0, posOffset.y, 0.4) * 0.1) + animTime * 0.3);
    // vec3 seekCurl = curlNoise(pos * smoothstep(0.5, 0.1, life) * (mix(1.0, posOffset.y, 0.2) * 0.1) + animTime * 0.1);

    vec3 dreamNoise = dreamCurl * map(dreamLife, 0.0, 8.0, 0.01, 1.1) * (0.5 + 0.5);

    vec3 seekNoise = seekCurl * 0.08 * (mix(3.5, 7.0, smoothstep(0.0, 1.0, life)));

    //   vec3 finalNoise = mix(noise, seekNoise, map(activityCoef, 0.0, 1.0, 0.0, 1.0)); //rename later
    vec3 finalNoise = mix(dreamNoise, seekNoise, smoothstep(0.0, 1.0, activityCoef)); //rename later
    // vec3 finalNoise = mix(dreamNoise, seekNoise, 1.0); //rename later

    pos += mix(finalNoise, vel, transitionTime);
  
    float maxRad = 200.0 * map(life, 0.0, 8.0, 1.25, 1.0);
    
    // float dist = length(mousePos - pos);
    float dist = length(pos);

    float distSt = step(maxRad, dist);

    float force = distSt * ((dist - maxRad) * 0.1);

    // pos += mix(vec3(0.0), normalize(mousePos - pos) * force, distSt);
    pos += mix(vec3(0.0), normalize(vec3(0.0) - pos) * force, distSt);

    // float dist2 = length(mousePos - pos);

    //howcome this repels?
    ////////////////////////////////////////////////////////////////////////
    
    // float dist2St = step(30.0, dist2) * 1.0 - step(150.0, dist2);

    // float force2 = dist2St * ((dist2 - 150.0) * 0.1);

    // pos += mix(vec3(0.0), normalize(mousePos - pos) * force2, dist2St);

    ////////////////////////////////////////////////////////////////////////
    
    // if(dist > maxRad && activityCoef <= 0.0) {

    //     float force = (dist - maxRad) * 0.1;

    //     pos += normalize(mousePos - pos) * force;

    // }
    
    //move this animation to it's own glslify module
   ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   
    pos.x += map(transitionTime, 0.0, 1.0, 0.0, 
    cos((transitionTime * PI * 2.0) * mix(-1.0, 1.0, posOffset.x))) 
    * map(transitionTime, 0.0, 1.0, 0.0, 15.0 * mix(0.5, 1.5, posOffset.y));
      
    pos.y += map(transitionTime, 0.0, 1.0, 0.0, 
    sin((transitionTime * PI * 2.0) * mix(-1.0, 1.0, posOffset.x))) 
    * map(transitionTime, 0.0, 1.0, 0.0, 15.0 * mix(0.5, 1.5, posOffset.y));
      
    pos.z += map(transitionTime, 0.0, 1.0, 0.0, 
    cos((transitionTime * PI * 2.0) * mix(-1.0, 1.0, posOffset.x)) * cos((transitionTime * PI * 2.0)) 
    * mix(-1.0, 1.0, posOffset.x)) * map(transitionTime, 0.0, 1.0, 0.0, 15.0 * mix(-1.5, 1.5, posOffset.y));
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      
    if(life <= 0.0) {
        
        pos = mousePos;
        
        // pos = vec3(0.0);

        vec3 curl = curlNoise(pos * (mix(1.0, posOffset.x , 0.7) * 0.2) + animTime * 0.3);

        vec3 noise = curl * 7.1 * (1.8 + map(uv.y, 0.0, 1.0, 0.1, 1.8));

        pos += noise;

        pos.y = pos.y + sin((animTime * 0.5) * 2.0 * PI) * 10.0;

        pos.z = pos.z + cos((animTime * 0.5) * 2.0 * PI) * 10.0;
         
      }

    } else {

    float dir = map(sign(scrollDirection), 0.0, 1.0, 1.0, -1.0);
      
    life += map(uv.y, 0.0, 1.0, 0.5, 0.1) * randomLifeSpan * dir; //this

    life = clamp(life, randlf * -1.0, 1.0);

    state = (life <= 0.0) ? 0.0 : 1.0;

    vec3 curl = curlNoise(pos * 0.02 * (mix(1.0, posOffset.x , 0.7) * 0.1) + animTime * 0.3);

    vec3 noise = curl * 0.8 * (5.0 + 5.0);
    //   vec3 noise = curl * 0.8 * (3.5 + 3.5);

    if(state <= 0.0) {
          
      pos += noise * 2.5;

      float maxRad = 80.0;
    // float maxRad = map(uv.y, 0.0, 1.0, 200.0, 100.0);

      float dist = length(pos);

        if(dist > maxRad) {

            float force = (dist - maxRad) * map(uv.y, 0.0, 1.0, 0.1, 0.01);
            // float force = (dist - maxRad) * map(uv.y, 0.0, 1.0, 0.05, 0.1);
            // float force = smoothstep((dist - maxRad) * map(uv.y, 0.0, 1.0, 0.085, 0.01), (dist - maxRad) * 0.095, 0.7 - life);
            // float force = (dist - maxRad) * 0.1;

            pos -= normalize(pos) * force;
            // pos -= (normalize(pos) * force) * (step(dist, 0.0) * step(dist, maxRad));

        }

    } else {

        pos += vel * 0.8;
        // pos += smoothstep(0.0, 1.0, scrollDirection) * (curl * 1.8 * (5.0 + 5.0));
        pos += mix(vec3(0.0), curl * 1.8 * (5.0 + 5.0), scrollDirection);
        // pos += mix(vec3(0.0), curl * 1.8 * (5.0 + 5.0), sign(scrollDirection));

    }

    }

    gl_FragColor = vec4(pos, life);

}