uniform sampler2D mainTex;
uniform sampler2D bloom;
uniform sampler2D blur;
uniform sampler2D fxaa;

uniform float lerp;
uniform float modePercent;
uniform float blurPercent;

varying vec2 vUv;
uniform vec2 resolution;

void main() {

    vec2 uv = gl_FragCoord.xy / resolution.xy;

    vec4 tDiffuse = texture2D(mainTex, vUv);

    vec4 fxaaPass = texture2D(fxaa, vUv);

    vec4 blm = texture2D(bloom, vUv);

    vec4 blur = texture2D(blur, vUv);

    vec4 bloom = vec4(tDiffuse.rgb, 0.0) + vec4(blm.rgb, 0.0);

    // vec4 projectCol = mix(tDiffuse, blur * 0.8, blurPercent);
    // vec4 projectCol = tDiffuse;

    // vec4 col = mix(bloom, projectCol, 1.0 - modePercent);
    // vec4 col = vec4(tDiffuse);
    vec4 col = vec4(bloom.rgb, 0.0);

    gl_FragColor = col;

}