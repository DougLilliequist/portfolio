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
uniform sampler2D previousPos;
uniform sampler2D direction;
uniform sampler2D state;

uniform float size;
uniform float easeTime;
uniform float rotationEaseTime;
uniform float animTime;

varying mat4 vModelViewMatrix;
varying vec3 vPosition;
varying vec3 vViewPosition;
varying vec3 vNormal;
varying vec3 vDir;
varying vec2 vUv;

varying float vAngle;
varying float vEaseTime;
varying float life;

#pragma glslify: computeTranslation = require(../../../utils/glsl/matrixTransform/translate)
#pragma glslify: computeRotation = require(../../../utils/glsl/matrixTransform/rotate)
#pragma glslify: computeScale = require(../../../utils/glsl/matrixTransform/scale)

float range(float val, float valMin, float valMax, float destMin, float destMax) {

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

    vec4 prevPos = texture2D(previousPos, translation.xy);
    
    vec4 currPos = texture2D(currentPos, translation.xy);

    // vec3 lastPos = vec3(0.0);

    // float delta = length(currPos - prevPos);

    life = currPos.w;

    life = max(life, 0.0);
    
    vec4 worldPos = modelMatrix * currPos;
    
    vNormal = normal;

    vPosition = worldPos.xyz;

    mat4 translate = computeTranslation(worldPos.xyz);

    // mat4 translate = computeTranslation(currPos.xyz);

    mat4 rotate = computeRotation(vec3(0.0, 0.0, 0.0));
    // mat4 rotate = computeRotation(vec3(0.0, 0.0, animTime * 2.25));

    // vec3 seekModeScale = vec3(1.0 * life); //temporary name
    vec3 seekModeScale = vec3(0.15 * life, 0.75 * life, 2.25 * life); //temporary name
    // vec3 seekModeScale = vec3(2.75 * life, 0.5 * life, 0.5 * life); //temporary name

    // vec3 projectScale = vec3(5.0);
    // vec3 projectScale = vec3(5.0) * range(life, 0.1, 1.0, 10.0, 1.0);
    vec3 projectScale = vec3(5.0, 5.0, 0.5) * range(life, 0.0, 1.0, 0.25, 1.2);
    
    // vec3 projectScale = vec3(5.0) * life;
    
    mat4 scale = computeScale(mix(seekModeScale, projectScale, easeTime)); //apply the rectangular scale whenever there is movement

    vec3 pos = position.xyz;


    //In simple terms: When the particle has been created, I want
    //it's lookAt to be towards the point where the mouse was located
    //at the frame the particle was created untill it dies

    // if(life <= 0.0) {

    //   lastPos = mousePos.xyz;

    //   dir = normalize(lastPos - currPos.xyz);

    //   rotaAxis = normalize(cross(forward, dir));

    //   angle = angleBetween(forward, dir);



    // }

  //need to fix this mess as well...

    vec3 dir = normalize(mousePos.xyz - currPos.xyz);
    
    vec3 dir2 = normalize(currPos.xyz - prevPos.xyz);

    vec3 dir3 = texture2D(direction, translation.xy).xyz;

    // vec3 seekDir = dir2;
    // vec3 seekDir = mix(dir2, dir3, range(life, 0.0, 8.0, 0.0, 1.0));
    vec3 seekDir = mix(dir2, dir3, 0.0);

    // vec3 projectDir = normalize(currPos.xyz - prevPos.xyz);
    
    vec3 projectDir = mix(dir2, normalize((modelViewMatrix * vec4(vec3(0.0, 0.0, -1.0), 1.0)).xyz - currPos.xyz), life);

    vec3 finalDir = mix(seekDir, projectDir, rotationEaseTime);


    // vec3 finalDir = mix(dir2, dir3, range(life, 0.0, 5.0, 0.2, 1.0));

    vec3 rotaAxis = normalize(cross(forward, finalDir));
    
    float angle = angleBetween(forward, finalDir);

    mat4 rotationMatrix = computeAxisRotation(rotaAxis, angle);

    // vec3 lookAtOffset = lookAt(pos, rotationMatrix);

    // pos += normalize(pos) + normalize(lookAtOffset) * length(pos);

    vec4 finalPos = translate * rotate * rotationMatrix * scale * vec4(pos, 1.0);
    
    gl_Position = projectionMatrix * modelViewMatrix * finalPos;
    
    vModelViewMatrix = modelViewMatrix;

    vViewPosition = (modelViewMatrix * vec4(pos, 1.0)).xyz;

    vViewPosition = vViewPosition * -1.0;

    vEaseTime = easeTime;
    
}