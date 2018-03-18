import * as THREE from 'three'

import Pass from './pass.js'

import eventEmitter from 'eventEmitter'

const emitter = eventEmitter.emitter

export default class Outline extends Pass {

    constructor(width, height) {

        super(width, height)

        this.initMat()

    }

}