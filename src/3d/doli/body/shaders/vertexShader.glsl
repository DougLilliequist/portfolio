attribute vec3 position;
attribute vec3 translation;
attribute vec3 rotation;
attribute vec3 scale;
attribute vec3 normal;
attribute vec3 forward;

attribute vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 modelMatrix;

uniform vec3 prevMousePos;
uniform vec3 mousePos;

uniform sampler2D currentPos;
uniform sampler2D targetPos;
uniform sampler2D direction;
uniform sampler2D state;

uniform float size;
uniform float easeTime;
uniform float rotationEaseTime;
uniform float percent;
uniform float animTime;

varying vec3 vPosition;
varying vec3 vViewPosition;
varying vec3 vNormal;

#pragma glslify: computeTranslation = require(../../../utils/glsl/matrixTransform/translate)
#pragma glslify: computeRotation = require(../../../utils/glsl/matrixTransform/rotate)
#pragma glslify: computeScale = require(../../../utils/glsl/matrixTransform/scale)

lowp float range(float val, float valMin, float valMax, float destMin, float destMax) {

    float oldVal = valMax - valMin;
    float newVal = destMax - destMin;

    return(((val - valMin) * newVal) / oldVal) + destMin;


}

float angleBetween(vec3 a, vec3 b) {

  float angle = acos(dot(a, b));

  return angle;

}

mat4 computeAxisRotation(vec3 axis, float angle) {

  vec3 rotationAxis = normalize(axis);

  float c = cos(angle);

  float s = sin(angle);

  float t = 1.0 - cos(angle);

  return mat4(

    t * pow(rotationAxis.x, 2.0) + c, t * rotationAxis.x * rotationAxis.y - s * rotationAxis.z, t * rotationAxis.x * rotationAxis.z + s * rotationAxis.y, 0.0,
    
    t * rotationAxis.x * rotationAxis.y + s * rotationAxis.z, t * pow(rotationAxis.y, 2.0) + c, t * rotationAxis.y * rotationAxis.z - s * rotationAxis.x, 0.0,
    
    t * rotationAxis.x * rotationAxis.z - s * rotationAxis.y, t * rotationAxis.y * rotationAxis.z + s * rotationAxis.x, t * pow(rotationAxis.z, 2.0) + c, 0.0,
    
    0.0, 0.0, 0.0, 1.0

  );

}

vec3 lookAt(vec3 pos, mat4 m) {

  return (m * vec4(pos, 1.0)).xyz;

}

void main() {

    vec4 posCurrent = texture2D(currentPos, translation.xy);
    
    vec4 posTarget = texture2D(targetPos, translation.xy);

    float life = posTarget.w;

    life = max(life, 0.0);

    vec4 _pos = mix(posCurrent, posTarget, percent);
    
    vec4 worldPos = modelMatrix * _pos;
    
    vNormal = normal;

    vPosition = worldPos.xyz;

    mat4 translate = computeTranslation(worldPos.xyz);

    mat4 rotate = computeRotation(vec3(0.0, 0.0, 0.0));
        
    mat4 scale = computeScale(vec3(0.15 * life, 0.5 * life, 1.5 * life));

    vec3 pos = position.xyz;
    
    vec3 dir = normalize(posTarget.xyz - posCurrent.xyz);
    
    vec3 rotaAxis = normalize(cross(forward, dir));
    
    float angle = angleBetween(forward, dir);

    mat4 rotationMatrix = computeAxisRotation(rotaAxis, angle);

    // vec3 lookAtOffset = lookAt(pos, rotationMatrix);

    // pos += (normalize(lookAtOffset) * length(pos));
    
    vec4 finalPos = translate * rotationMatrix * scale * vec4(pos, 1.0);
    
    gl_Position = projectionMatrix * modelViewMatrix * finalPos;
    
    vViewPosition = (modelViewMatrix * vec4(pos, 1.0)).xyz;

    vViewPosition = vViewPosition * -1.0;
    
}