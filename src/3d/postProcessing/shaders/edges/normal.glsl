precision highp float;

uniform sampler2D tNormal;
uniform sampler2D tDepth;

uniform float cameraNear;
uniform float cameraFar;

varying vec2 vUv;

float readDepth(vec2 texCoords) {

    float cameraFarPlusNear = cameraFar + cameraNear;

    float cameraFarMinusNear = cameraFar - cameraNear;

    float cameraCoef = 2.0 * cameraNear;

    return cameraCoef / (cameraFarPlusNear - texture2D(tDepth, texCoords).x * cameraFarMinusNear);

}

void main() {

    vec4 normal = texture2D(tNormal, vUv);

    float depth = readDepth(vUv);

    vec3 col = vec3(normal.r, normal.b, log(depth));

    gl_FragColor = vec4(col, 1.0);

}