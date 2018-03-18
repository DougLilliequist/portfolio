uniform sampler2D tex;
uniform sampler2D blur;
uniform float strength;
uniform vec2 resolution;

varying vec2 vUv;

void main() {

    vec2 uv = gl_FragCoord.xy / resolution.xy;

    vec4 blr = texture2D(blur, vUv);
    // vec4 blr = texture2D(blur, uv);

    blr *= strength;

    vec4 tDiffuse = texture2D(tex, vUv);
    // vec4 tDiffuse = texture2D(tex, uv);

    // tDiffuse.rgb *= 0.02;

    tDiffuse.rgb += blr.rgb;

    float bloom = length(tDiffuse.rgb) / length(vec3(1.0));
    
    vec3 col = mix(tDiffuse.rgb, blr.rgb, bloom);
    // tDiffuse.rgb = mix(vec3(4.0, 4.0, 25.0)/255.0, vec3(255.0, 254.0, 246.0)/255.0, bloom);
    gl_FragColor = vec4(col, 1.0);
    // gl_FragColor = tDiffuse;

}