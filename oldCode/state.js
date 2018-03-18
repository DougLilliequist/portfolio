import * as THREE from 'three'

import FBO from '../../utils/FBO/fbo.js'

import SimData from '../../utils/simdata.js'

import renderer from '../../renderer.js'

const glslify = require('glslify')

export default class State extends FBO {

    constructor(width, height) {

        super(width, height)

        this.initStateData()

        this.init()

    }

    initStateData() {

        const amnt = (this.w * this.h) * 4

        const stateData = new Float32Array(amnt)

        for (let i = 0; i < stateData.length; i++) {

            let i4 = i * 4

            stateData[i4 + 0] = 1

            stateData[i4 + 1] = 1

            stateData[i4 + 2] = 0

            stateData[i4 + 3] = 0


        }

        this.states = new SimData(stateData, this.w, this.h)

    }

    init() {

        this.mat = new THREE.ShaderMaterial({

            uniforms: {

                states: {

                    type: 't',

                    value: null

                },

                resolution: {

                    type: 'v2',
                    value: new THREE.Vector2(this.w, this.h)

                }

            },

            vertexShader: glslify('../shaders/renderQuad.glsl'),

            fragmentShader: glslify('../shaders/state.glsl'),

            transparent: true,

            depthWrite: false,

            depthTest: false,

            blending: THREE.NoBlending

        })

        this.initSim(this.states)

    }

    update() {

        let tmp = this.rtt

        this.rtt = this.rtt2

        this.rtt2 = tmp

        this.renderQuad.material = this.mat

        this.renderQuad.material.uniforms.states.value = this.rtt2

        renderer.render(this.scene, this.cam, this.rtt, true)

    }

}