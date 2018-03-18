export const lerp = (t, min, max) => {

    return (max - min) * t + min

}

export const map = (val, sourceMin, sourceMax, destMin, destMax) => {

    let normVal = (val - sourceMin) / (sourceMax - sourceMin)

    return lerp(normVal, destMin, destMax)

}