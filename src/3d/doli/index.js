//The core that will init DOLI's body
//and call the apropriate animation and simulation methods

import * as THREE from 'three'

import Soul from './soul/index.js'

import Body from './body/index.js'

import {
    TweenLite
} from 'gsap'

import eventEmitter from 'eventEmitter'

const emitter = eventEmitter.emitter

export default class DOLI extends THREE.Object3D {

    constructor() {

        super()

        this.init()

        this.initSoul()

        this.initBody()

        this.initEvents()

    }

    init() {

        this.isInteracting = false

        this.isCurious = false

        this.activityTime = 0.0

        this.activityCoef = 0.0 //might be more reliable than using mouse delta

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

    initEvents() {

        emitter.on('morphDOLI', this.morph.bind(this))

    }

    onMouseMove() {

        this.isInteracting = true

        this.activityTime = 0

        // this.activityCoef += (this.activityCoef <= 1.0) ? 0.5 : 0.0 //play with increment
        this.activityCoef += (this.activityCoef <= 1.0) ? 0.5 : 0.0 //play with increment

    }

    morph(mode) {

        switch (mode) {

            case 'home':
                {

                    this.initSpiritMode()

                }

                break

            case 'curious':
                {
                    
                    this.initSpiritMode()

                }

                break

            case 'work':
                {

                    this.initProjectMode()

                }

                break

        }


    }

    initSpiritMode() {

        TweenLite.to(this.body.mesh.material.uniforms.easeTime, 1.5 * 2, {

            value: 0.0

        })

        TweenLite.to(this.body.mesh.material.uniforms.rotationEaseTime, 0.5, {

            value: 0.0

        })

        TweenLite.to(this.soul, 1.5 * 2, {

            transitionTime: 0.0

        })


    }

    initProjectMode() {

        TweenLite.to(this.body.mesh.material.uniforms.easeTime, 1.5 * 2, {

            value: 1.0

        })

        TweenLite.to(this.body.mesh.material.uniforms.rotationEaseTime, 0.5, {

            value: 1.0

        })


        TweenLite.to(this.soul, 1.0, {

            transitionTime: 1.0

        })


    }

    animate(deltaTime, mousePos) {

        this.activityTime += deltaTime

        if (this.activityTime <= 0) {

            this.isInteracting = false

        }

        // this.activityCoef -= (this.activityCoef > 0.0 && this.isInteracting) ? 0.25 : 0.0;

        this.soul.animate(deltaTime, mousePos, this.activityCoef)

        this.body.mesh.material.uniforms.previousPos.value = this.soul.position.rtt2

        this.body.mesh.material.uniforms.currentPos.value = this.soul.position.rtt

        this.prevPos.copy(this.currPos)

        this.currPos.copy(mousePos)

        this.body.mesh.material.uniforms.prevMousePos.value.copy(this.prevPos)

        this.body.mesh.material.uniforms.mousePos.value.copy(this.currPos)

        this.body.mesh.material.uniforms.animTime.value += deltaTime

    }

}