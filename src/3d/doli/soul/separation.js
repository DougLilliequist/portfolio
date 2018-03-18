import * as THREE from 'three'

import FBO from '../../utils/FBO/fbo.js'

import SimData from '../../utils/simdata.js'

const glslify = require('glslify')

import renderer from '../../renderer.js'

import {
    config
} from '../config';

export default class Separate extends FBO {

    constructor(width, height) {

        super(width, height)

        this.initSeperationTexture()

        this.init()

    }

    initSeperationTexture() {

        const amnt = (this.w * this.h) * 4

        const separationData = new Float32Array(amnt)

        for (let i = 0; i < separationData.length; i++) {

            let i4 = i * 4

            separationData[i4 + 0] = 0

            separationData[i4 + 1] = 0

            separationData[i4 + 2] = 0

            separationData[i4 + 3] = 0

        }

        this.separationTexture = new SimData(separationData, this.w, this.h)

    }

    init() {

        this.mat = new THREE.ShaderMaterial({

            uniforms: {

                positions: {

                    type: 't',
                    value: null

                },

                velocity: {

                    type: 't',
                    value: null

                },

                separation: {

                    type: 't',
                    value: null

                },

                radius: {

                    type: 'f',
                    value: 0.4 * 2

                },

                maxForce: {

                    type: 'f',

                    value: 1.8

                },

                maxSpeed: {

                    type: 'f',
                    value: 10.0

                },

                mode: {

                    type: 'b',

                    value: null

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

            fragmentShader: glslify('../shaders/separation.glsl'),

            transparent: false,

            depthTest: false,

            depthWrite: false,

            blending: THREE.NoBlending

        })

        this.initSim(this.separationTexture)

    }

    update(position, velocity, bool, animTime) {

        let autoClearCol = renderer.autoClearColor

        let clearCol = renderer.getClearColor().getHex()

        let clearAlpha = renderer.getClearAlpha()

        renderer.autoClearColor = false

        let tmp = this.rtt

        this.rtt = this.rtt2

        this.rtt2 = tmp

        this.renderQuad.material = this.mat

        this.renderQuad.material.uniforms.mode.value = bool

        this.renderQuad.material.uniforms.animTime.value += animTime;

        this.renderQuad.material.uniforms.positions.value = position

        this.renderQuad.material.uniforms.velocity.value = velocity

        this.renderQuad.material.uniforms.separation.value = this.rtt2

        renderer.render(this.scene, this.cam, this.rtt, true)

        renderer.setClearColor(clearCol, clearAlpha)

        renderer.autoClearColor = autoClearCol

    }

}