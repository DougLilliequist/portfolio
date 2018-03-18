uniform sampler2D acceleration;
uniform sampler2D velocity;
uniform sampler2D positions;
uniform vec3 mousePos;
uniform float animTime;
uniform vec2 resolution;

varying vec2 vUv;

void main() {

    vec2 uv = gl_FragCoord.xy / resolution;

    vec3 acc = texture2D(acceleration, uv).rgb;
    
    vec3 vel = texture2D(velocity, uv).rgb;
    
    vec3 pos = texture2D(positions, uv).rgb;

    vec3 delta = mousePos - pos;

    vec3 force = (normalize(delta) * 10.7) / texture2D(acceleration, uv).w;
    
    // vec3 force = vec3(0.01, 0.0, 0.0);

    acc += mix(vec3(0.0), force / texture2D(acceleration, uv).w, smoothstep(0.1, 0.7, animTime * 0.15));

    vel += mix(vec3(0.0), acc, smoothstep(0.1, 0.7,animTime * 0.15));

    pos += mix(vec3(0.0), vel, smoothstep(0.1, 0.7, animTime * 0.15));

    acc *= mix(acc, vec3(0.0), animTime);

    // vel += acc;

    // pos += vel;

    // if(pos.y < -30.0) {

    //     pos.y = 30.0;

    // }

    // acc *= vec3(0.0);

    // finalPos += delta * 0.05;

    gl_FragColor = vec4(pos, 1.0);

}