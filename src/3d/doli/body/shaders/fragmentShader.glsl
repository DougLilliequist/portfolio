// #extension GL_OES_standard_derivatives : enable

precision highp float;

varying vec3 vNormal;
varying vec3 vDir;
varying vec3 vPosition;
varying vec3 vViewPosition;
varying vec2 vUv;

// varying mat4 vModelViewMatrix;

// varying float life;
varying float vEaseTime;
varying float vAngle;

uniform mat4 modelViewMatrix;
uniform mat4 viewMatrix;
uniform sampler2D tex;

uniform float animTime;
uniform float projectEase;
uniform float mode;
uniform float alpha;

uniform vec2 resolution;

#pragma glslify: map = require(../../../utils/glsl/map)

vec3 computeWorldLight(vec3 lightSrc, vec3 v) {

    vec4 mvPos = modelViewMatrix * vec4(v, 1.0);

    vec4 worldPos = viewMatrix * vec4(lightSrc, 1.0);

    return normalize((worldPos - mvPos)).xyz;

}

vec3 computeLight(vec3 normal, vec3 p) {

    vec3 l = computeWorldLight(vec3(0.0, 0.0, 0.0), p);

    float volume = max(dot(l, normal), 0.0);

    // vec3 col = mix(vec3(0.56, 0.2, 0.89), vec3(1.0), volume);
    vec3 col = mix(vec3(207.0, 217.0, 223.0) / 255.0, vec3(1.0), volume);
    // lowp vec3 col = mix(vec3(0.921, 0.929, 0.933), vec3(1.0), volume);
    // vec3 col = mix(vec3(195.0, 207.0, 226.0) / 255.0, vec3(1.0), volume);
    // vec3 col = mix(vec3(0.0, 0.0, 0.0) / 255.0, vec3(1.0), volume);

    col *= map(volume, 0.0, 1.0, 0.9, 1.0);

    return col;

}

lowp vec3 computeFaceNormal(vec3 v) {

    return cross(dFdx(v), dFdy(v));

}

void main() {

    // vec2 uv = gl_FragCoord.xy / resolution.xy;

    // vec3 diffuse = texture2D(tex, vUv).rgb;

    //send an interpolation value when hovering over a project

    // float stVal = mix(0.0, 0.2, projectEase); //horrible name

    // diffuse = mix(diffuse, diffuse * step(stVal, vUv.y) * step(stVal, 1.0 - vUv.y), 1.0);

    // vec3 vidTexture = mix(diffuse, vec3(1.0), 1.0 - smoothstep(0.0, 1.0, life));

    vec3 normal = normalize(computeFaceNormal(vViewPosition));
    
    vec3 col = computeLight(normal, vPosition); //rename

    col = mix(col, vNormal, mode);
    // col = mix(vec3(0.0), vNormal, mode);

    //add bloomColoring as well
    
    // vec3 finalCol = mix(normalize(computeFaceNormal(vPosition)), vidTexture, vEaseTime);
    // vec3 finalCol = mix(col, vidTexture, vEaseTime);
    // vec3 finalCol = mix(vNormal, vidTexture, vEaseTime);
    
    // gl_FragColor = vec4(finalCol, alpha);
    gl_FragColor = vec4(col, alpha);
    // gl_FragColor = vec4(vNormal, 1.0);
    // gl_FragColor = vec4(vec3(0.0), 1.0);

}