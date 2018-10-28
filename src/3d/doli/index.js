//The core that will init DOLI's body
//and call the apropriate animation and simulation methods

import * as THREE from 'three'

import Soul from './soul/index.js'

import Body from './body/index.js'

import {
    TweenLite
} from 'gsap'

import {config} from './config.js'

import eventEmitter from 'eventEmitter'

const emitter = eventEmitter.emitter

export default class DOLI extends THREE.Object3D {

    constructor() {

        super()

        this.init()

        this.initSoul()

        this.initBody()

    }

    init() {

        this.isInteracting = false

        this.isCurious = false

        this.activityTime = 0.0

        this.activityCoef = 0.0

        this.skipCount = config.skipCount

        this.skipCounter = 0

        this.percent = 0

        this.prevPos = new THREE.Vector3(0.0, 0.0, 0.0)

        this.currPos = new THREE.Vector3(0.0, 0.0, 0.0)

        this.isScrolling = false

        this.scrollDirection = 0.0

    }

    initSoul() {

        this.soul = new Soul()

    }

    initBody() {

        this.body = new Body()

        this.add(this.body)

    }

    onMouseMove() {

        this.isInteracting = true

        this.activityTime = 0

        this.activityCoef += (this.activityCoef <= 1.0) ? 0.5 : 0.0 //play with increment

    }

    animate(deltaTime, mousePos, rayCaster) {

        this.activityTime += deltaTime

        if (this.activityTime <= 0) {

            this.isInteracting = false

        }

        this.activityCoef -= (this.activityCoef > 0.0 && this.isInteracting) ? 0.25 : 0.0;

        this.skipCounter ++

        if(this.skipCounter % this.skipCount === 0) {

            this.skipCounter = 0

            this.soul.animate(deltaTime, mousePos, this.activityCoef, this.scrollDirection)

        }

        this.percent = this.skipCounter / this.skipCount

        this.body.mesh.material.uniforms['currentPos'].value = this.soul.position.rtt2
        
        this.body.mesh.material.uniforms['targetPos'].value = this.soul.position.rtt

        this.body.mesh.material.uniforms['percent'].value = this.percent

        this.prevPos.copy(this.currPos)

        this.currPos.copy(mousePos)

        this.body.mesh.material.uniforms.prevMousePos.value.copy(this.prevPos)

        this.body.mesh.material.uniforms.mousePos.value.copy(this.currPos)

        this.body.mesh.material.uniforms.animTime.value += deltaTime

    }

}