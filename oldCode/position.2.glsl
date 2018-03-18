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
        // float randomLifeSpan = map(snoise((pos * 0.84) + animTime * 0.054), -1.0, 1.0, 0.1, 1.5);

    // float randomLifeSpan = map(snoise((pos * 0.84) + animTime * 0.54), -1.0, 1.0, 0.095, 1.85);

    if(mode == true) {
      
      vec3 curl = curlNoise(pos * (mix(1.0, posOffset.x , 0.2) * 0.01) + animTime * 0.1);
      // vec3 curl = curlNoise(pos * 0.1 * (mix(1.0, posOffset.x , 0.2) * 0.1) + animTime * 0.1);

      // vec3 noise = curl * 2.2 * 0.5;
      // vec3 noise = curl * 0.2 * (0.5 + 0.5);
      vec3 noise = curl * 0.02 * (5.0 + 0.0);
      // vec3 noise = curl * 0.02 * (5.0 + 0.0);
      // vec3 noise = curl * 0.02 * (5.0 + 5.0);
      // noise *= 5.8
      // vel += noise * 5.0;

      // pos.x += map(transitionTime, 0.0, 1.0, 0.0, cos(transitionTime * PI * 2.0) * mix(-1.0, 1.0, posOffset.x)) * map(transitionTime, 0.0, 1.0, 0.0, 15.0);
      // pos.y += map(transitionTime, 0.0, 1.0, 0.0, sin(transitionTime * PI * 2.0) * mix(-1.0, 1.0, posOffset.x)) * map(transitionTime, 0.0, 1.0, 0.0, 15.0);
      
      pos += mix(noise, vel, transitionTime);

      pos.x += map(transitionTime, 0.0, 1.0, 0.0, 
      cos((transitionTime * PI * 2.0) * mix(-1.0, 1.0, posOffset.x))) 
      * map(transitionTime, 0.0, 1.0, 0.0, 15.0 * mix(0.5, 1.5, posOffset.y));
      
      pos.y += map(transitionTime, 0.0, 1.0, 0.0, 
      sin((transitionTime * PI * 2.0) * mix(-1.0, 1.0, posOffset.x))) 
      * map(transitionTime, 0.0, 1.0, 0.0, 15.0 * mix(0.5, 1.5, posOffset.y));
      
      pos.z += map(transitionTime, 0.0, 1.0, 0.0, 
      cos((transitionTime * PI * 2.0) * mix(-1.0, 1.0, posOffset.x)) * cos((transitionTime * PI * 2.0)) 
      * mix(-1.0, 1.0, posOffset.x)) * map(transitionTime, 0.0, 1.0, 0.0, 15.0 * mix(-1.5, 1.5, posOffset.y));

      float maxRad = 100.0;

      float dist = length(pos);

      // if(dist > maxRad) {

      //   float force = (dist - maxRad) * 0.1;

      //   pos -= normalize(pos) * force;

      // }

      //reflect on the difference between these two conditions
      
      //try instead of time, using a float that represents mouse travel distance
      //which will be a float that increases when moving the mouse and when there is no movement,
      //it reduces back to zero

      float seekLife = sin((animTime + mix(0.0, 1.0, uv.y)) * mix(10.0, 1.35, uv.x)) * 8.0; //slowing down time increases the duration of particle existence (which makes sense as slowing time means longer duration)
      
      // float seekLife = sin((animTime * 0.8 * mix(5.0, 1.35, uv.x)) + mix(0.0, 1.0, uv.y)) * 18.0;

      ////////////////////////////////////////////////

      
      float projectLife = 1.0;
      
      // life = mix(seekLife, projectLife, 1.0);
      
      life = mix(seekLife, projectLife, transitionTime);
      
      if(life <= 0.0) {
        
        pos = mousePos;

        // pos += (origPos * 1.15 + mix(1.0, posOffset.x, 0.2)) * fract(origPos.x * noise * 1.5 + animTime) * 1.75;
        pos += (origPos * 1.15 + mix(1.0, posOffset.x, 0.2)) * fract(origPos.x * noise * 1.5) * 1.75;

        // pos += curlNoise(pos * (mix(1.0, posOffset.x , 0.7) * 0.2) + animTime * 0.3) * 15.0;

        pos.y = pos.y + sin((animTime * 0.5) * 2.0 * PI) * 10.0;

        pos.z = pos.z + cos((animTime * 0.5) * 2.0 * PI) * 10.0;
         
      }

    } else {

      float dir = map(sign(scrollDirection), 0.0, 1.0, 1.0, -1.0);
      
      life += map(uv.y, 0.0, 1.0, 0.1, 0.035) * randomLifeSpan * dir; //this
      // life += map(uv.y, 0.0, 1.0, 0.5, 0.085) * randomLifeSpan * dir; //this

      state = (life > 0.0) ? 1.0 : 0.0;

      vec3 curl = curlNoise(pos * 0.02 * (mix(1.0, posOffset.x , 0.7) * 0.1) + animTime * 0.3);

      vec3 noise = curl * 0.8 * (5.0 + 5.0);

      if(scrollDirection > 0.0) {

      pos.y += 1.0 * posOffset.x;

      } else {

        // pos += vel;
        // pos += (state == 0.0 && transitionTime == 1.0) ? vel * map((normalize(distance(origPos, pos))), 0.0, 1.0, 0.1, 0.001) : vel;
        pos += (state == 0.0 && transitionTime == 1.0) ? vel * map(uv.y, 0.0, 1.0, 0.5, 0.1) : vel * map(uv.y, 0.0, 1.0, 1.0, 0.75) * life;


      }


        if(state <= 0.0) {
          
          // pos.y = (origPos.y < 0.0) ? origPos.y + 30.0 * posOffset.x * 10.0 * -1.0: origPos.y + 0.1 * posOffset.x * 30.0 * -1.0;

          pos.y -= 3.25 * posOffset.x;
          // pos.y -= 3.25 * posOffset.x * abs(life);

        }

        // pos += vel;
        
        // pos += (transitionTime == 1.0) ? vel * map((normalize(distance(origPos, pos))), 0.0, 1.0, 0.8, 0.1) : vel;
        // pos += (state == 0.0 && transitionTime == 1.0) ? vel * map((normalize(distance(origPos, pos))), 0.0, 1.0, 0.8, 0.001) : vel;
        // pos += (state == 0.0 && transitionTime == 1.0) ? vel * map(uv.y, 0.0, 1.0, 0.5, 0.1) : vel * map(uv.y, 0.0, 1.0, 1.5, 0.87);
        
        // life = clamp(life, (randlf * 1.0) * -1.0, randlf);
        life = clamp(life, (randlf * 1.0) * -1.0, 1.0);
        // life = clamp(life, -1.0, 1.0);

    }

    gl_FragColor = vec4(pos, life);

}