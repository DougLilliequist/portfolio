'use strict'

import * as THREE from 'three'

export default class RenderTarget extends THREE.WebGLRenderTarget {

    constructor(width, height) {

        super(width || 1, height || 1)

        this.texture.format = THREE.RGBAFormat
        
        this.texture.minFilter = THREE.LinearFilter
        
        this.texture.magFilter = THREE.LinearFilter

        this.texture.wrapS = THREE.ClampToEdgeWrapping

        this.texture.wrapT = THREE.ClampToEdgeWrapping

        this.texture.type = THREE.UnsignedByteType
        
        this.texture.generateMipmaps = false
        
        this.texture.stencilBuffer = false
        
        this.texture.depthBuffer = false

    }

}