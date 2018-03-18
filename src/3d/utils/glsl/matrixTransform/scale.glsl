mat4 scale(vec3 v) {

    return mat4(
    
    v.x, 0.0, 0.0, 0.0,
    0.0, v.y, 0.0, 0.0,
    0.0, 0.0, v.z, 0.0,
    0.0, 0.0, 0.0, 1.0

    );

}

#pragma glslify: export(scale)