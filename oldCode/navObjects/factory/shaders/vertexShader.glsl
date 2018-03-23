precision highp float;

attribute vec3 position;
attribute vec3 translation;
attribute vec3 rotation;
attribute vec3 scale;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform float direction;
uniform float speed;
uniform float radiusScalar;
uniform float animTime;

#pragma glslify: computeTranslation = require(../../../utils/glsl/matrixTransform/translate)
#pragma glslify: computeRotation = require(../../../utils/glsl/matrixTransform/rotate)
#pragma glslify: computeScale = require(../../../utils/glsl/matrixTransform/scale)
#pragma glslify: snoise = require(../../../utils/glsl/noise/noise3D)
#pragma glslify: map = require(../../../utils/glsl/map)

void main() {

  float radian = radians(animTime);

  float noise = map((snoise(translation * 0.035) + animTime * 0.3), 0.0, 1.0, -1.0, 1.0);

  noise = noise * 20.0;

  vec3 defaultTranslate = translation;

  vec3 selectTranslate = translation + (normalize(translation) * radiusScalar);
  
  mat4 translateObj = computeTranslation(translation + (normalize(translation) * radiusScalar));
  
  // mat4 translateObj = computeTranslation(translation + (normalize(translation) * 1.0 * noise));

  mat4 rotate = computeRotation(vec3(radian * 10.5 + rotation.x, radian * 20.5 + rotation.y, radian * 8.5 + rotation.z));

  mat4 rotationObj = computeRotation(vec3(radian * 2.5 + rotation.x, radian * 2.5 + rotation.y, radian * 2.5 + rotation.z));

  mat4 scaleObj = computeScale(scale);

  vec4 pos = rotate * translateObj * rotationObj * scaleObj * vec4(position, 1.0);

  gl_Position = projectionMatrix * modelViewMatrix * pos;

}
