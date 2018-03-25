precision highp float;

uniform sampler2D tDiffuse;
uniform sampler2D tNormDepth;

uniform vec2 resolution;

varying vec2 vUv;


void main() {

    vec4 diffuse = texture2D(tDiffuse, vUv);

    // vec3 edgeTest = texture2D(tNormal, vUv);

    vec2 pxSize = vec2(1.0 / resolution.x, 1.0 / resolution.y);

    vec4 edgeTestA = texture2D(tNormDepth, vUv + vec2(0.0, 0.0) * pxSize);
    
    vec4 edgeTestB = texture2D(tNormDepth, vUv + vec2(1.0, 1.0) * pxSize);
    
    vec4 edgeTestC = texture2D(tNormDepth, vUv + vec2(-1.0, 1.0) * pxSize);
    
    vec4 edgeTestD = texture2D(tNormDepth, vUv + vec2(-1.0, -1.0) * pxSize);
    
    vec4 edgeTestE = texture2D(tNormDepth, vUv + vec2(1.0, -1.0) * pxSize);

    float depthTest =  edgeTestA.b - ((edgeTestB.b + edgeTestC.b + edgeTestD.b + edgeTestE.b) * 0.25);

    float depthSt = step(0.001, depthTest);

    // vec3 edge = step()
    //psuedo: 1.0 - smoothstep(0.0, edgeTestB.r, edgeTestA.r) //more performant than step
    float edgeAB = 1.0 - step(edgeTestA.r, edgeTestB.r) + 1.0 - step(edgeTestA.g, edgeTestB.g) + 1.0 - step(edgeTestA.b, edgeTestB.b);
    float edgeAC = 1.0 - step(edgeTestA.r, edgeTestC.r) + 1.0 - step(edgeTestA.g, edgeTestC.g) + 1.0 - step(edgeTestA.b, edgeTestC.b);
    float edgeAD = 1.0 - step(edgeTestA.r, edgeTestD.r) + 1.0 - step(edgeTestA.g, edgeTestD.g) + 1.0 - step(edgeTestA.b, edgeTestD.b);
    float edgeAE = 1.0 - step(edgeTestA.r, edgeTestE.r) + 1.0 - step(edgeTestA.g, edgeTestE.g) + 1.0 - step(edgeTestA.b, edgeTestE.b);
    
    vec4 col = (diffuse - depthTest) * (edgeAB + edgeAC + edgeAD + edgeAE);

    // vec4 col = diffuse * edgeAB;

    // vec3 edge = vec3(0.0) * edgeAB + edgeAC + edgeAD + edgeAE;
    
    //check smoothstep with vectors is possible
    //psuedeo code
    //1.0 - smoothstep(0.0, 1.0, tNormDepth.rgb)

    gl_FragColor = col;
    // gl_FragColor = diffuse;

}