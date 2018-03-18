uniform sampler2D positions;
uniform sampler2D velocity;
uniform sampler2D separation;

uniform bool mode;
uniform float animTime;
uniform vec2 resolution;
uniform float radius;

uniform float maxForce;
uniform float maxSpeed;

void main() {

    vec2 uv = gl_FragCoord.xy / resolution.xy;

    // const float w = 32.0;
    const float w = 64.0;

    // const float h = 32.0;
    const float h = 64.0;

    vec3 pos = texture2D(positions, uv).xyz;

    vec3 vel = texture2D(velocity, uv).xyz;

    vec3 sep = texture2D(separation, uv).xyz;

    vec3 sum = vec3(0.0, 0.0, 0.0);

    // float life = texture2D(positions, uv).a;

    float rad = radius;

    // rad = (sin(animTime) * (radius * 10.0)) + 2.0;

    float count = 0.0;

    if(mode == true) {

    for(float x = 0.0; x < w; x++) {

        for(float y = 0.0; y < h; y++) {

            // other = texture2D(positions, vec2(x / resolution.x, y / resolution.y)).xyz;
            vec3 other = texture2D(positions, vec2(x / w,  y / h)).xyz;

            vec3 delta = pos - other;

            float dist = length(delta);

            if(dist > 0.0 && dist < rad) {

                vec3 diff = pos - other;

                diff = normalize(diff);

                diff = diff / vec3(dist);

                sum += diff;

                count ++;

            }

        }

    }

    if(count > 0.0) {

    sum /= vec3(count);

    sum = normalize(sum);

    sum *= maxSpeed;
    // sum *= smoothStep(0.0, maxSpeed, dist);

    sep *= vec3(0.0);

    sep = sum - vel;

    if(length(sep) > maxForce) {

        sep = normalize(sep);

        sep *= maxForce;

    }
        
    gl_FragColor = vec4(sep, 1.0);

    } else {

    gl_FragColor = vec4(vec3(0.0), 1.0);

    }
    
} else {

    gl_FragColor = vec4(vec3(0.0), 1.0);

}

}
