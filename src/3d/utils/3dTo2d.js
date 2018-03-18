import * as THREE from 'three'

export const threeDtoTwoD = (w, h, v, camera) => {

    console.log(v)

    const width = w / 2
    
    const height = h / 2

    const pos = v.clone()
    
    // const pos = v

    pos.project(camera)

    pos.x = Math.round((pos.x * width) + width)

    pos.y = Math.round( - (pos.y * height) + height)

    return pos

}