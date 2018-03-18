float map(float val, float valMin, float valMax, float destMin, float destMax) {

    float oldVal = valMax - valMin;
    float newVal = destMax - destMin;

    return(((val - valMin) * newVal) / oldVal) + destMin;

    // float normVal = (val - valMin) / (valMax - valMin);

    // return mix(destMin, destMax, normVal);

}

#pragma glslify: export(map)