import * as THREE from 'three'

import FBO from 'FBO'

import SimData from 'simData'

import renderer from 'renderer'

const glslify = require('glslify')

export default class Position extends FBO {

    constructor(width, height) {

        super(width, height)

        this.initPositions()

        this.init()

    }

    initPositions() {

        const amnt = (this.w * this.h) * 4

        const posData = new Float32Array(amnt)

        for (let i = 0; i < posData.length; i++) {

            let i4 = i * 4

            posData[i4 + 0] = 10 * Math.cos((Math.random() * -32 + 16) * Math.PI) * Math.cos((Math.random() * -10 + 5) * 2 * Math.PI)

            posData[i4 + 1] = 10 * Math.sin((Math.random() * -32 + 16) * Math.PI)
            // data[i3 + 1] = -32

            posData[i4 + 2] = 10 * Math.cos((Math.random() * -32 + 16) * 2 * Math.PI) * Math.sin((Math.random() * -10 + 5) * Math.PI)

            posData[i4 + 3] = (Math.random() * 8) + 1

        }

        this.positions = new SimData(posData, this.w, this.h)

        const offSetData = new Float32Array(amnt)

        for (let i = 0; i < offSetData.length; i++) {

            offSetData[i] = 0.5 + Math.random()

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

                originPos: {

                    type: 't',
                    value: null

                },

                offSets: {

                    type: 't',
                    value: null
                },

                state: {

                    type: 't',
                    value: null

                },

                animTime: {

                    type: 'f',
                    value: 0.0

                },

                mousePos: {

                    type: 'v3',
                    value: new THREE.Vector3(0.0, 0.0, 0.0)

                },

                activityCoef: {

                    type: 'f',
                    value: 0.0

                },

                mode: {

                    type: 'f',
                    value: 0.0

                },

                transitionTime: {

                    type: 'f',
                    value: 0.0

                },

                scrollDirection: {

                    type: 'f',
                    value: 0.0

                },

                mouseTravel: {

                    type: 'f',
                    value: 0.0

                },

                resolution: {

                    type: 'v2',
                    value: new THREE.Vector2(this.w || 1, this.h || 1)

                }

            },

            vertexShader: glslify('../shaders/renderQuad.glsl'),

            fragmentShader: glslify('../shaders/position.1.glsl'),

            transparent: false,

            depthTest: false,

            depthWrite: false,

            blending: THREE.NoBlending

        })

        this.initSim(renderer,this.positions)

    }

    get mode() {

        return this.mat.uniforms['mode'].value

    }

    set mode(v) {

        this.mat.uniforms['mode'].value = v

    }

    update(mousePos, delta, deltaTime, velocity, bool, scrollDirection, portfolioPos, transition) {

        let autoClearCol = renderer.autoClearColor

        let clearCol = renderer.getClearColor().getHex()

        let clearAlpha = renderer.getClearAlpha()

        renderer.autoClearColor = false

        //feeling a need to understand this bit

        let tmp = this.rtt

        this.rtt = this.rtt2

        this.rtt2 = tmp

        ////////////////////////////////////////

        this.renderQuad.material = this.mat

        if (bool === true) {

            this.renderQuad.material.uniforms.originPos.value = this.positions

        } else {

            this.renderQuad.material.uniforms.originPos.value = portfolioPos

        }

        // this.renderQuad.material = this.mat

        this.renderQuad.material.uniforms.mousePos.value.copy(mousePos)

        this.renderQuad.material.uniforms.activityCoef.value = delta

        this.renderQuad.material.uniforms.animTime.value += deltaTime

        this.renderQuad.material.uniforms.transitionTime.value = transition

        this.renderQuad.material.uniforms.offSets.value = this.offSets

        this.renderQuad.material.uniforms.scrollDirection.value = scrollDirection

        this.renderQuad.material.uniforms.velocity.value = velocity

        this.renderQuad.material.uniforms.positions.value = this.rtt2 //what I do know, is that the quad will read from the second rendertarget
        //and the result will be rendered to the target rendertarget (did I just answer my own question?)

        //From what I understand, I'm basically reading from the previous render target
        //then use the said values and write new values on it which in turn, will be rendererd on the main
        //render target and have the displayed on screen

        renderer.render(this.scene, this.cam, this.rtt, true)

        renderer.setClearColor(clearCol, clearAlpha)

        renderer.autoClearColor = autoClearCol

    }

}