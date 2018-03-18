import * as THREE from 'three'

import FBO from '../../utils/FBO/fbo.js'

import renderer from '../../renderer.js'

import SimData from '../../utils/simdata.js'

const glslify = require('glslify')

export default class Velocity extends FBO {

    constructor(width, height) {

        super(width, height)

        this.initVelocities()

        this.init() //rename

    }

    initVelocities() {

        const amnt = (this.w * this.h) * 4

        const data = new Float32Array(amnt)

        for (let i = 0; i < data.length; i++) {

            let i4 = i * 4

            data[i4 + 0] = 0

            data[i4 + 1] = 0

            data[i4 + 2] = 0

            data[i4 + 3] = 0

        }

        this.velocities = new SimData(data, this.w, this.h)

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

                velocity: {

                    type: 't',
                    value: null

                },

                positions: {

                    type: 't',
                    value: null

                },

                offSets: {

                    type: 't',
                    value: null

                },

                maxVel: {

                    type: 'f',
                    value: 10.0

                },

                animTime: {

                    type: 'f',
                    value: null

                },

                resolution: {

                    type: 'v2',
                    value: new THREE.Vector2(this.w || 1, this.h || 1)

                }

            },

            vertexShader: glslify('../shaders/renderQuad.glsl'),

            fragmentShader: glslify('../shaders/velocity.glsl'),

            transparent: false,

            depthTest: false,

            depthWrite: false,

            blending: THREE.NoBlending

        })

        this.initSim(renderer,this.velocities)

    }

    update(positions, /*separate,*/ seek, offSets, time) {

        let autoClearCol = renderer.autoClearColor

        let clearCol = renderer.getClearColor().getHex()

        let clearAlpha = renderer.getClearAlpha()

        renderer.autoClearColor = false

        let tmp = this.rtt

        this.rtt = this.rtt2

        this.rtt2 = tmp

        this.renderQuad.material = this.mat

        this.renderQuad.material.uniforms.animTime.value += time

        this.renderQuad.material.uniforms.offSets.value = offSets

        // this.renderQuad.material.uniforms.acceleration.value = acceleration

        // this.renderQuad.material.uniforms.separation.value = separate

        this.renderQuad.material.uniforms.seek.value = seek

        this.renderQuad.material.uniforms.positions.value = positions

        this.renderQuad.material.uniforms.velocity.value = this.rtt2

        renderer.render(this.scene, this.cam, this.rtt, true)

        renderer.setClearColor(clearCol, clearAlpha)

        renderer.autoClearColor = autoClearCol

    }

}