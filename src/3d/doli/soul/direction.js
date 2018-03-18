import * as THREE from 'three'

import FBO from 'FBO'

import SimData from 'simData'

import renderer from 'renderer'

const glslify = require('glslify')

export default class Direction extends FBO {

    constructor(width, height) {

        super(width, height)

        this.initDirections()

        this.init()

    }

    initDirections() {

        const amnt = (this.w * this.h) * 4

        const directionData = new Float32Array(amnt)

        for (let i = 0; i < directionData.length; i++) {

            directionData[i] = 0

        }

        this.directions = new SimData(directionData, this.w, this.h)

        this.prevPos = new THREE.Vector3(0.0, 0.0, 0.0)

        this.currPos = new THREE.Vector3(0.0, 0.0, 0.0)

    }

    init() {

        this.mat = new THREE.ShaderMaterial({

            uniforms: {

                directions: {

                    type: 't',

                    value: null

                },

                currentPos: {

                    type: 't',

                    value: null

                },

                previousPos: {

                    type: 't',

                    value: null

                },

                prevMousePos: {

                    type: 'v3',

                    value: null


                },

                mousePos: {

                    type: 'v3',

                    value: null

                },

                resolution: {

                    type: 'v2',

                    value: new THREE.Vector2(this.w || 1, this.h || 1)

                }

            },

            vertexShader: glslify('../shaders/renderQuad.glsl'),

            fragmentShader: glslify('../shaders/direction.glsl'),

            transparent: false,

            depthTest: false,

            depthWrite: false,

            blending: THREE.NoBlending

        })

        this.initSim(renderer, this.directions)

    }

    update(mousePos, currPos, prevPos) {

        let autoClearCol = renderer.autoClearColor

        let clearCol = renderer.getClearColor().getHex()

        let clearAlpha = renderer.getClearAlpha()

        renderer.autoClearColor = false

        let tmp = this.rtt

        this.rtt = this.rtt2

        this.rtt2 = tmp

        this.prevPos.copy(this.currPos)

        this.currPos.copy(mousePos)

        this.renderQuad.material = this.mat

        this.renderQuad.material.uniforms.directions.value = this.rtt2

        this.renderQuad.material.uniforms.currentPos.value = currPos

        this.renderQuad.material.uniforms.previousPos.value = prevPos

        this.renderQuad.material.uniforms.prevMousePos.value = this.prevPos

        this.renderQuad.material.uniforms.mousePos.value = this.currPos

        renderer.render(this.scene, this.cam, this.rtt, true)

        renderer.setClearColor(clearCol, clearAlpha)

        renderer.autoClearColor = autoClearCol

    }

}