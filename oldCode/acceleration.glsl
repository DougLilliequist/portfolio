uniform sampler2D acceleration;
uniform sampler2D separation;
uniform sampler2D seek;

uniform vec3 minForce;
uniform vec3 maxForce;

uniform vec2 resolution;

void main() {

    vec2 uv = gl_FragCoord.xy / resolution.xy;

    vec3 acc = texture2D(acceleration, uv).xyz;

    vec3 sepForce = texture2D(separation, uv).xyz;

    vec3 seekForce = texture2D(seek, uv).xyz;

    float mass = texture2D(acceleration, uv).w;

    sepForce *= 1.0;

    seekForce *= 1.0;

    acc.xyz *= 0.0;    

    // acc.xyz += sepForce;

    acc.xyz += seekForce;

    //It seems I need to add a limit to acceleration as well

    // acc = clamp(acc, minForce, maxForce);
    

    gl_FragColor = vec4(acc.xyz, 1.0);
    // gl_FragColor = vec4(acc.xyz, mass);

}