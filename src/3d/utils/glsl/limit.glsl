vec3 limit(vec3 v, float maxVal) {

    if(length(v) > maxVal) {

        v = normalize(v);

        v *= maxVal

        return v;

    }

}