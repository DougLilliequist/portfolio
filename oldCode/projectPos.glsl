uniform sampler2D velocity;
uniform sampler2D positions;
uniform sampler2D state;
uniform sampler2D originPos;
uniform sampler2D offSets;

uniform vec3 mousePos;

uniform float transitionTime;
uniform float animTime;
uniform bool mode;
uniform float scrollDirection;
uniform vec2 resolution;

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

    float dir = map(sign(scrollDirection), 0.0, 1.0, 1.0, -1.0);
      
      life += map(uv.y, 0.0, 1.0, 0.5, 0.085) * randomLifeSpan * dir; //this

      state = (life > 0.0) ? 1.0 : 0.0;

      vec3 curl = curlNoise(pos * 0.02 * (mix(1.0, posOffset.x , 0.7) * 0.1) + animTime * 0.3);

      vec3 noise = curl * 0.8 * (5.0 + 0.0);

      if(state <= 0.0) {
          
          pos += noise * 3.5;

      float maxRad = 80.0;
    // float maxRad = map(uv.y, 0.0, 1.0, 200.0, 100.0);

      float dist = length(pos);

      if(dist > maxRad) {

        // float force = (dist - maxRad) * map(uv.y, 0.0, 1.0, 0.01, 0.1);
        float force = (dist - maxRad) * map(uv.y, 0.0, 1.0, 0.1, 0.01);
        // float force = (dist - maxRad) * 0.1;

        pos -= normalize(pos) * force;

            }

        }

        // pos += vel;
        // pos += (transitionTime == 1.0) ? vel * map((normalize(distance(origPos, pos))), 0.0, 1.0, 0.8, 0.1) : vel;
     
        // pos += (state == 0.0 && transitionTime == 1.0) ? vel * map((normalize(distance(origPos, pos))), 0.0, 1.0, 0.8, 0.001) : vel;
        pos += (state == 0.0 && transitionTime == 1.0) ? vel * map(uv.y, 0.0, 1.0, 0.1, 0.001) : vel * map(uv.y, 0.0, 1.0, 1.0, 0.87);
        
        // life = clamp(life, (randlf * 1.0) * -1.0, randlf);
        life = clamp(life, (randlf * 1.0) * -1.0, 1.0);
        // life = clamp(life, -1.0, 1.0);

    gl_FragColor = vec4(pos, life);

}