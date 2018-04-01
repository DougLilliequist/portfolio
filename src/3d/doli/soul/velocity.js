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

        const offSetData = new Float32Array(amnt)

        for(let i = 0; i < offSetData.length; i++) {

            offSetData[i] = Math.random()

        }

        this.offSets = new SimData(offSetData, this.w, this.h)

    }

    init() {

        this.mat = new THREE.ShaderMaterial({

            uniforms: {

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
                    value: 5.0

                },

                mousePos: {

                    type: 'v3',
                    value: new THREE.Vector3(0, 0, 0)

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

    update(props = {}) {

        let autoClearCol = renderer.autoClearColor

        let clearCol = renderer.getClearColor().getHex()

        let clearAlpha = renderer.getClearAlpha()

        renderer.autoClearColor = false

        let tmp = this.rtt

        this.rtt = this.rtt2

        this.rtt2 = tmp

        this.renderQuad.material = this.mat

        this.renderQuad.material.uniforms.animTime.value += props.time

        this.renderQuad.material.uniforms.positions.value = props.pos

        this.renderQuad.material.uniforms.offSets.value = props.offSets

        this.renderQuad.material.uniforms.velocity.value = this.rtt2

        this.renderQuad.material.uniforms.mousePos.value.copy(props.mouse)

        renderer.render(this.scene, this.cam, this.rtt, true)

        renderer.setClearColor(clearCol, clearAlpha)

        renderer.autoClearColor = autoClearCol

    }

}