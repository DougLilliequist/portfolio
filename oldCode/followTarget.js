import * as THREE from 'three'

export default class FollowTarget extends THREE.Vector3 {

    constructor(startPos) {

        super(startPos)

        this.init()

    }

    init() {

        this.r = 250

        this.animTime = 0

    }

    updatePos() {

        this.animTime += 0.0015

        this.x = Math.cos(this.animTime * 2.0 * Math.PI) * this.r
        
        this.z = Math.sin(this.animTime * 2.0 * Math.PI) * this.r

    }

}