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

#pragma glslify: snoise = require(./utils/noise3D.glsl)
#pragma glslify: curlNoise = require(./utils/curlNoise.glsl)
#pragma glslify: random = require(./utils/random.glsl)
#pragma glslify: map = require(./utils/map.glsl)


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

    life -= 0.05;
      
    vec3 dreamCurl = curlNoise(pos * 0.01 * (mix(1.0, posOffset.x , 0.2) * 0.81) + animTime * 0.1); //dream state

    vec3 seekCurl = curlNoise(pos * 0.35 * (mix(1.0, posOffset.y, 0.4) * 0.1) + animTime * 0.3);
    // vec3 seekCurl = curlNoise(pos * smoothstep(0.5, 0.1, life) * (mix(1.0, posOffset.y, 0.2) * 0.1) + animTime * 0.1);

    // vec3 dreamNoise = dreamCurl * map(dreamLife, 0.0, 8.0, 0.01, 1.1) * (0.5 + 0.5);

    vec3 seekNoise = seekCurl * 0.08 * (mix(3.5, 7.0, smoothstep(0.0, 1.0, life)));

    pos += seekNoise;
  
    // float maxRad = 200.0 * map(life, 0.0, 8.0, 1.25, 1.0);
    
    // float dist = length(mousePos - pos);
    
    // if(dist > maxRad && activityCoef <= 0.0) {

    //     float force = (dist - maxRad) * 0.1;

    //     pos += normalize(mousePos - pos) * force;

    // }
        
    pos.x += map(transitionTime, 0.0, 1.0, 0.0, 
    cos((transitionTime * PI * 2.0) * mix(-1.0, 1.0, posOffset.x))) 
    * map(transitionTime, 0.0, 1.0, 0.0, 15.0 * mix(0.5, 1.5, posOffset.y));
      
    pos.y += map(transitionTime, 0.0, 1.0, 0.0, 
    sin((transitionTime * PI * 2.0) * mix(-1.0, 1.0, posOffset.x))) 
    * map(transitionTime, 0.0, 1.0, 0.0, 15.0 * mix(0.5, 1.5, posOffset.y));
      
    pos.z += map(transitionTime, 0.0, 1.0, 0.0, 
    cos((transitionTime * PI * 2.0) * mix(-1.0, 1.0, posOffset.x)) * cos((transitionTime * PI * 2.0)) 
    * mix(-1.0, 1.0, posOffset.x)) * map(transitionTime, 0.0, 1.0, 0.0, 15.0 * mix(-1.5, 1.5, posOffset.y));
      
    if(life <= 0.0) {
        
        // pos = mousePos;        
        pos = vec3(0.0);

        vec3 curl = curlNoise(pos * (mix(1.0, posOffset.x , 0.7) * 0.2) + animTime * 0.3);

        vec3 noise = curl * 7.1 * (1.8 + map(uv.y, 0.0, 1.0, 0.1, 1.8));

        pos.xyz += noise;

        // pos = pos.xyz * sin((animTime * 0.5) * 2.0 * PI) * 30.0;

        // pos += mousePos;

        life = randlf;

        // pos.z = pos.z + cos((animTime * 0.5) * 2.0 * PI) * 30.0;
         
    }

    gl_FragColor = vec4(pos, life);

}