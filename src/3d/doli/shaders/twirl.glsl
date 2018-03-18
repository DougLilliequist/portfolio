#pragma glslify: map = require(../../utils/glsl/map)

vec3 twirl(vec3 v, transitionTime, offSet) {

    const float PI = 3.141592657;

    vec3 twirl = v;
   
    twirl.x += map(transitionTime, 0.0, 1.0, 0.0, 
    cos((transitionTime * PI * 2.0) * mix(-1.0, 1.0, posOffset.x))) 
    * map(transitionTime, 0.0, 1.0, 0.0, 15.0 * mix(0.5, 1.5, posOffset.y));
      
    twirl.y += map(transitionTime, 0.0, 1.0, 0.0, 
    sin((transitionTime * PI * 2.0) * mix(-1.0, 1.0, posOffset.x))) 
    * map(transitionTime, 0.0, 1.0, 0.0, 15.0 * mix(0.5, 1.5, posOffset.y));
      
    twirl.z += map(transitionTime, 0.0, 1.0, 0.0, 
    cos((transitionTime * PI * 2.0) * mix(-1.0, 1.0, posOffset.x)) * cos((transitionTime * PI * 2.0)) 
    * mix(-1.0, 1.0, posOffset.x)) * map(transitionTime, 0.0, 1.0, 0.0, 15.0 * mix(-1.5, 1.5, posOffset.y));

    return twirl;

}

#pragma glslify: export(twirl)
    