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
    vec3 vel = texture2D(velocity, uv).xyz;
    vec3 pos = texture2D(positions, uv).xyz;
    vec3 origPos = texture2D(originPos, uv).xyz;
    vec3 posOffset = texture2D(offSets, uv).xyz;
    float life = texture2D(positions, uv).w;
  
    life = sin(((animTime * posOffset.z * 0.025) + mix(0.0, 10.0, uv.y)) * mix(1.0, 3.0, 1.0 - smoothstep(0.0, 1.0, uv.x))) * 8.0; //gonna change this

    vec3 dreamCurl = curlNoise(pos * 0.01 * (mix(1.0, 0.5 * posOffset.x + 0.15, 0.3) * 0.41) + animTime * 0.1); //dream state
    
    // lowp vec3 dreamNoise = dreamCurl * 0.8 * posOffset.z * map(life, 0.0, 8.0, 1.0, 0.1 * posOffset.z + 0.5) * (3.0 + 1.0);
    lowp vec3 dreamNoise = dreamCurl * 0.8 * map(life, 0.0, 8.0, 1.0, 0.1) * (1.5 + 1.0);

    vec3 finalNoise = dreamNoise; //rename
    
    pos += finalNoise;
  
    float maxRad = 120.0 * map(life, 0.0, 8.0, 1.25, 1.0);
    lowp float dist = length(pos);
    // float distSt = smoothstep(0.0, maxRad, dist);
    float distSt = step(maxRad, dist);
    float force = distSt * ((dist - maxRad) * 0.1 * 5.0);

    pos += normalize(vec3(0.0) - pos) * force;

    lowp float dist2 = length(mousePos - pos);
    float dist2St = 1.0 - smoothstep(30.0, 70.0, dist2);
    float force2 = dist2St * ((dist2 - 70.0) * 0.1 * 5.0);
    
    pos += normalize(mousePos - pos) * force2;

    pos += vel;
      
    if(life <= 0.0) {

        pos = vec3(0.0);

        pos += (origPos * 10.0 + mix(1.0, posOffset.x, 0.2)) * fract(origPos.x * 2.5) * 1.15;

        pos.x += cos(radians(animTime) * PI) * cos(radians(animTime) * 2.0 * PI) * 20.0;

        pos.y += sin(radians(animTime) * PI) * 20.0;
        
        pos.z += cos(radians(animTime)* PI) * sin(radians(animTime) * 2.0 * PI) * 20.0;
         
      }

    gl_FragColor = vec4(pos, life);

}