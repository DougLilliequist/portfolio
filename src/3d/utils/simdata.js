'use strict'

import * as THREE from 'three'

export default class SimData extends THREE.DataTexture {

    constructor(data, width, height) {

        super(data, width, height, THREE.RGBAFormat, THREE.FloatType)

        this.minFilter = THREE.NearestFilter

        this.magFilter = THREE.NearestFilter

        this.generateMipmaps = false

        this.flipY = false

        this.needsUpdate = true

    }

}