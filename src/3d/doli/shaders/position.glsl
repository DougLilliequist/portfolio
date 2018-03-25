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
#pragma glslify: random = require(../../utils/glsl/random)
#pragma glslify: map = require(../../utils/glsl/map)


void main() {
    
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec3 vel = texture2D(velocity, uv).rgb;
    vec3 pos = texture2D(positions, uv).rgb;
    vec3 origPos = texture2D(originPos, uv).rgb;
    vec3 posOffset = texture2D(offSets, uv).xyz;
    float life = texture2D(positions, uv).w;
  
    float dreamLife = sin(((animTime * 0.025) + mix(0.0, 10.0, uv.y)) * mix(1.0, 3.0, 1.0 - smoothstep(0.0, 1.0, uv.x))) * 8.0; //gonna change this
    // dreamLife *= 1.0 - smoothstep(0.0, 1.0, mode);

    // float seekLife = sin((animTime * 0.9 + smoothstep(0.0, 1.0, uv.y)) * mix(1.85, 7.0, smoothstep(0.0, 1.0, uv.x))) * 8.0;    
    // seekLife *= smoothstep(0.0, 1.0, mode) * 1.0 - smoothstep(1.0, 1.1, mode);
    
    float projectLife = 1.0;
    projectLife *= smoothstep(0.0, 2.0, mode) * 1.0 - smoothstep(2.0, 2.1, mode);
    
    // life = dreamLife + seekLife + projectLife;
    life = dreamLife + projectLife;

      
    vec3 dreamCurl = curlNoise(pos * 0.01 * (mix(1.0, 0.5 * posOffset.x + 0.5, 0.3) * 0.41) + animTime * 0.1); //dream state
    
    // vec3 seekCurl1 = curlNoise(pos * 0.8 * (mix(1.0, posOffset.y , 0.7) * 0.2) + animTime * 0.1);
    
    // vec3 seekCurl2 = curlNoise(pos * (mix(1.0, posOffset.z , 0.4) * 0.04) + animTime * 0.1);
    
    // vec3 seekCurl = curlNoise(pos * 0.35 * (mix(1.0, posOffset.z , 0.4) * 0.1) + animTime * 0.1);
    
    // vec3 dreamNoise = dreamCurl * 0.8 * map(dreamLife, 0.0, 8.0, 0.01, 1.1) * (0.5 + 0.5);
    vec3 dreamNoise = dreamCurl * 0.8 * map(dreamLife, 0.0, 8.0, 0.01, 0.8) * (0.5 + 1.5);

    // vec3 seekNoise = seekCurl * 0.035 * (mix(3.5, 7.0, smoothstep(0.0, 1.0, life)));    
    
    // vec3 seekNoise = mix(seekCurl1, seekCurl2, 1.0 - smoothstep(3.5, 8.0, life));

    // seekNoise *= mix(0.25, 3.0, 1.0 - smoothstep(0.0, 8.0, life)) * 1.25 + 0.5;
    
    // vec3 seekNoise = seekCurl * 0.8 * (0.5 + 0.1);

    // dreamNoise *= 1.0 - smoothstep(0.0, 1.0, mode);
    
    // seekNoise *= smoothstep(0.0, 1.0, mode) * 1.0 - smoothstep(1.0, 1.1, mode);

    vec3 finalNoise = dreamNoise; //rename

    // vec3 finalNoise = mix(dreamNoise, seekNoise, smoothstep(0.0, 1.0, mode));
    
    pos += finalNoise;
  
    float maxRad = 120.0 * map(life, 0.0, 8.0, 1.25, 1.0);
    // float maxRad = 100.0;
    float dist = length(pos);
    // float distSt = smoothstep(0.0, maxRad, dist);
    float distSt = step(maxRad, dist);
    float force = distSt * ((dist - maxRad) * 0.1);
    // force *= 1.0 - smoothstep(0.0, 0.1, mode);

    pos += mix(vec3(0.0), normalize(vec3(0.0) - pos) * force, distSt);

    float dist2 = length(mousePos - pos);
    float dist2St = 1.0 - smoothstep(30.0, 70.0, dist2);
    float force2 = dist2St * ((dist2 - 70.0) * 0.1);
    // force2 *= 1.0 - smoothstep(0.0, 0.1, mode);
    
    pos += mix(vec3(0.0), normalize(mousePos - pos) * force2, dist2St);

    // pos += vel;

    //had a previous condition based on mode, check on the solo doli project and check what condition I set again
      
    if(life <= 0.0) {

        pos = smoothstep(0.0, 1.0, mode) * vec3(0.0) + smoothstep(0.0, 1.0, mode) * mousePos;

        pos += (origPos * 10.0 + mix(1.0, posOffset.x, 0.2)) * fract(origPos.x * 2.5) * 1.15;

        pos.y = pos.y + sin((animTime * 0.5) * 2.0 * PI) * 20.0;
        
        pos.z = pos.z + cos((animTime * 0.5) * 2.0 * PI) * 20.0;
         
      }

    gl_FragColor = vec4(pos, life);

}