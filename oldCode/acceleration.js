import * as THREE from 'three'

import FBO from '../../utils/FBO/fbo.js'

import renderer from '../../renderer.js'

import SimData from '../../utils/simdata.js'

const glslify = require('glslify')

export default class Acceleration extends FBO {

    constructor(width, height) {

        super(width, height)

        this.initAccelerations()

        this.init()

    }

    initAccelerations() {

        const amnt = (this.w * this.h) * 4

        const data = new Float32Array(amnt)

        for (let i = 0; i < data.length; i++) {

            let i4 = i * 4

            data[i4 + 0] = 0

            data[i4 + 1] = 0

            data[i4 + 2] = 1

            data[i4 + 3] = (Math.random() * 10)

        }

        this.accelerations = new SimData(data, this.w, this.h)

    }

    init() {

        this.mat = new THREE.ShaderMaterial({

            uniforms: {

                separation: {

                    type: 't',
                    value: null

                },

                seek: {

                    type: 't',
                    value: null

                },

                acceleration: {

                    type: 't',
                    value: null

                },

                maxForce: {

                    type: 'f',
                    value: 0.4
                    
                },

                resolution: {

                    type: 'v2',
                    value: new THREE.Vector2(this.w, this.h)

                },

            },


            vertexShader: glslify('../shaders/renderQuad.glsl'),

            fragmentShader: glslify('../shaders/acceleration.glsl'),

            transparent: false,

            depthTest: false,

            depthWrite: false,

            blending: THREE.NoBlending

        })

        this.initSim(this.accelerations)

    }

    update(separationForce, seekForce, time) {

        let autoClearCol = renderer.autoClearColor

        let clearCol = renderer.getClearColor().getHex()

        let clearAlpha = renderer.getClearAlpha()

        renderer.autoClearColor = false

        let tmp = this.rtt

        this.rtt = this.rtt2

        this.rtt2 = tmp

        this.renderQuad.material = this.mat

        this.renderQuad.material.uniforms.separation.value = separationForce

        this.renderQuad.material.uniforms.seek.value = seekForce

        this.renderQuad.material.uniforms.acceleration.value = this.rtt2

        renderer.render(this.scene, this.cam, this.rtt, true)

        renderer.setClearColor(clearCol, clearAlpha)

        renderer.autoClearColor = autoClearCol

    }

}