import * as THREE from 'three'

// import Separate from './separation.js'

import Seek from './seek.js'

import Velocity from './velocity.js'

import Position from './position.js'

import Direction from './direction.js'

import {
    TweenLite
} from 'gsap'

import {
    config
} from '../config'

import eventEmitter from 'eventEmitter'

const emitter = eventEmitter.emitter

export default class Soul {

    constructor() {

        this.initParams()

        this.initEvents()

    }

    initParams() {

        this.bool = true

        this.transitionTime = 0.0 //?

        // this.separate = new Separate(config.particleAmntX, config.particleAmntY)

        this.seek = new Seek(config.particleAmntX, config.particleAmntY)

        this.velocity = new Velocity(config.particleAmntX, config.particleAmntY)

        this.position = new Position(config.particleAmntX, config.particleAmntY)

        this.direction = new Direction(config.particleAmntX, config.particleAmntY)

    }

    initEvents() {

        emitter.on('morphDOLI', this.updateMode.bind(this))

    }

    updateMode(v) {

        switch(v) {

            case 'home': {

                TweenLite.to(this.seek, 0.35, {

                    mode: 0.0,
                    
                })

                TweenLite.to(this.position, 0.35, {

                    mode: 0.0

                })

                // this.seek.mode = 0.0

                // this.position.mode = 0.0

            }

            break

            case 'curious': {

                // this.seek.mode = 1.0

                // this.position.mode = 1.0

                TweenLite.to(this.seek, 0.15, {

                    mode: 0.0,
                    
                })

                TweenLite.to(this.position, 0.15, {

                    mode: 1.0

                })

                TweenLite.to(this, 0.35, {

                    transitionTime: 1.0

                })

            }

            break

            case 'work': {

                // this.seek.mode = 1.0

                // this.position.mode = 2.0

                TweenLite.to(this, 0.35, {

                    transitionTime: 0.0
                    
                })

                TweenLite.to(this.position, 0.15, {

                    mode: 2.0
                    
                })

                TweenLite.to(this.seek, 0.15, {

                    mode: 1.0,

                })

            }

        }

    }

    animate(deltaTime, mousePos, delta, scrollDirection, distance) {

        // this.separate.update(this.position.rtt, this.velocity.rtt, this.bool, deltaTime)

        this.seek.update(deltaTime, mousePos, delta, this.position.rtt, this.velocity.rtt, scrollDirection)

        // this.velocity.update(this.position.rtt, this.separate.rtt, this.seek.rtt, this.position.offSets, deltaTime)
        this.velocity.update(this.position.rtt, /*this.separate.rtt,*/ this.seek.rtt, this.position.offSets, deltaTime)

        this.position.update(mousePos, delta, deltaTime, this.velocity.rtt, this.bool, scrollDirection, this.seek.portfolioTexture, this.transitionTime)

        this.direction.update(mousePos, this.position.rtt, this.position.rtt2)

    }

}