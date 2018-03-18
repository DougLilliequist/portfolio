mat4 computeRotationX(float x) {

  return mat4(

  1.0, 0.0, 0.0, 0.0,
  0.0, cos(x), -sin(x), 0.0,
  0.0, sin(x), cos(x), 0.0,
  0.0, 0.0, 0.0, 1.0

  );

}

mat4 computeRotationY(float y) {

  return mat4(

    cos(y), 0.0, sin(y), 0.0,
    0.0, 1.0, 0.0, 0.0,
    -sin(y), 0.0, cos(y), 0.0,
    0.0, 0.0, 0.0, 1.0

  );

}

mat4 computeRotationZ(float z) {

  return mat4(

    cos(z), -sin(z), 0.0, 0.0,
    sin(z), cos(z), 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, 1.0

  );

}

mat4 rotate(vec3 v) {

  return(computeRotationX(v.x) * computeRotationY(v.y) * computeRotationZ(v.z));

}

#pragma glslify: export(rotate)