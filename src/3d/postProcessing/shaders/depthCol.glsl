precision highp float;

uniform sampler2D tDiffuse;
uniform sampler2D tDepth;

uniform float near;
uniform float far;

varying vec2 vUv;

float readDepth(vec2 texCoord) {

    float cameraFarPlusNear = far + near;
    
    float cameraFarMinusNear = far - near;
    
    float cameraCoef = 2.0 * near;

    return cameraCoef / (cameraFarPlusNear - texture2D(tDepth, texCoord).x * cameraFarMinusNear);

}

void main() {

    vec4 diffuse = texture2D(tDiffuse, vUv);
    
    float depth = readDepth(vUv);

    // vec3 col = (diffuse.rgb * 0.001) 

    gl_FragColor = vec4(col, 1.0);

}