mat4 translate(vec3 v) {

    return mat4(
    
    1.0, 0.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    v.x, v.y, v.z, 1.0

    );

}

#pragma glslify: export(translate)