import * as THREE from 'three'

import Velocity from './velocity.js'

import Position from './position.js'

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

    }

    initParams() {

        this.velocity = new Velocity(config.particleAmntX, config.particleAmntY)

        this.position = new Position(config.particleAmntX, config.particleAmntY)

    }

    animate(deltaTime, mousePos, delta, scrollDirection, distance) {

        // this.velocity.update({mouse: mousePos, pos: this.position.rtt, offSet: this.position.offSets, time: deltaTime})

        this.position.update({mouse: mousePos, time: deltaTime, vel: this.velocity.rtt, transition: this.transitionTime})

    }

}