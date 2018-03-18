uniform sampler2D acceleration;
uniform sampler2D positions;
uniform sampler2D masses;

uniform vec3 mousePos;

uniform float force;

uniform vec2 resolution;

varying vec2 vUv;

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}


void main() {

    vec2 uv = gl_FragCoord.xy / resolution.xy;

    vec3 acc = texture2D(acceleration, uv).xyz;

    vec3 pos = texture2D(positions, uv).xyz;

    vec3 mass = texture2D(masses, uv).xyz;

    float particleMass = texture2D(acceleration, uv).w;

    acc.xyz *= vec3(0.0);    

    vec3 delta = mousePos - pos;

    delta = normalize(delta);

    float dist = sqrt((delta.x * delta.x) + (delta.y * delta.y) + (delta.z * delta.z));

    if(dist < 0.1) {

        delta = delta * -1.0;

    } else {

        delta = delta * 0.08;

    }

    delta = delta * particleMass;

    acc.xyz += delta;

    // float force = -0.001 * particleMass;

    // acc.xyz = acc.xyz + (delta * acc.w);

    // acc.y += force; 

    // gl_FragColor = vec4(acc.rgb, acc.a);
    gl_FragColor = vec4(acc.xyz, 1.0);

}