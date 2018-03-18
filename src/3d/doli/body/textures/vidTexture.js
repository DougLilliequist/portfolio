import * as THREE from 'three'

class VideoTexture {

    constructor() {}

    get(media, res) {

        const src = document.createElement('source')

        src.setAttribute('src', media)

        src.setAttribute('type', 'video/mp4')

        const vid = document.createElement('video')

        vid.appendChild(src)

        vid.autoplay = true

        vid.loop = true

        vid.width = res.w

        vid.height = res.h

        vid.style.display = 'none'

        vid.crossOrigin = 'Anonymous'

        document.body.appendChild(vid)

        const tex = new THREE.VideoTexture(vid)

        tex.minFilter = THREE.LinearFilter

        tex.magFilter = THREE.LinearFilter

        tex.format = THREE.RGBAFormat

        return tex

    }

}

const videoTexture = new VideoTexture()

export default videoTexture