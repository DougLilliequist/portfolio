'use strict'

import * as THREE from 'three'

import Pass from './pass.js'

const glslify = require('glslify')

import RenderTarget from 'renderTarget'

import renderer from 'renderer'

export default class BlurPass extends Pass {

    constructor(width, height) {

        super(width, height)

        this.init(width, height)

        this.initBlurPasses()

        this.initBlurMat()

        this.initEvents()

    }

    init(width, height) {

        this.numMips = 3

        this.rtt = new RenderTarget(width, height)

        this.copyMat = this.getCopyMat()

    }

    initBlurPasses() {

        this.verticalBlur = []

        this.horizontalBlur = []

        let blurResX = Math.round(this.w / 2.0)

        let blurResY = Math.round(this.h / 2.0)

        this.blurDir = {

            v: new THREE.Vector2(0.0, 1.0),

            h: new THREE.Vector2(1.0, 0.0)

        }

        for (let i = 0; i < this.numMips; i++) {

            const blurH = new RenderTarget(blurResX, blurResY)

            this.horizontalBlur.push(blurH)

            const blurV = new RenderTarget(blurResX, blurResY)

            this.verticalBlur.push(blurV)

            blurResX = Math.round(blurResX / 2.0)

            blurResY = Math.round(blurResY / 2.0)

        }

    }

    initBlurMat() {

        this.blurMats = []

        this.blurKernels = [

            glslify('./shaders/blur/blur1.glsl'),
            glslify('./shaders/blur/blur2.glsl'),
            glslify('./shaders/blur/blur3.glsl'),

        ]

        let blurResX = Math.round(this.w / 2.0)

        let blurResY = Math.round(this.h / 2.0)

        for (let i = 0; i < this.numMips; i++) {

            const blurMat = this.getBlurMat(this.blurKernels[i])

            blurMat.uniforms.resolution.value = new THREE.Vector2(blurResX, blurResY)

            this.blurMats.push(blurMat)

            blurResX = Math.round(blurResX / 2.0)

            blurResY = Math.round(blurResY / 2.0)

        }

        console.log(this.blurMats)

    }


    initEvents() {

        window.addEventListener('resize', this.resizeBlur.bind(this))

    }

    render(rtt) {

        this.inputRtt = rtt

        let autoClearCol = renderer.autoClearColor

        let clearColor = renderer.getClearColor().getHex()

        let clearAlpha = renderer.getClearAlpha()

        renderer.autoClearColor = false

        for (let i = 0; i < this.numMips; i++) {

            this.renderQuad.material = this.blurMats[i]

            this.renderQuad.material.uniforms['tex'].value = this.inputRtt.texture

            this.renderQuad.material.uniforms['direction'].value = this.blurDir.h

            renderer.render(this.scene, this.cam, this.horizontalBlur[i], true)

            this.renderQuad.material.uniforms['tex'].value = this.horizontalBlur[i].texture

            this.renderQuad.material.uniforms['direction'].value = this.blurDir.v

            renderer.render(this.scene, this.cam, this.verticalBlur[i], true)

            this.inputRtt = this.verticalBlur[i].texture

        }

        this.renderQuad.material = this.copyMat

        this.renderQuad.material.uniforms['tex'].value = this.verticalBlur[0].texture
        // this.renderQuad.material.uniforms['tex'].value = this.inputRtt

        renderer.render(this.scene, this.cam, this.rtt, false)

        renderer.setClearColor(clearColor, clearAlpha)

        renderer.autoClearColor = autoClearCol

    }

    resizeBlur() {

        this.w = window.innerWidth

        this.h = window.innerHeight

        let blurResX = Math.round(this.w / 2.0)

        let blurResY = Math.round(this.h / 2.0)

        for (let i = 0; i < this.numMips; i++) {

            this.horizontalBlur[i].setSize = new THREE.Vector2(blurResX, blurResY)

            this.verticalBlur[i].setSize = new THREE.Vector2(blurResX, blurResY)

            this.blurMats[i].uniforms['resolution'].value = new THREE.Vector2(blurResX, blurResY)

            blurResX = Math.round(blurResX / 2.0)

            blurResY = Math.round(blurResY / 2.0)

        }

    }

    getBlurMat(frag) {

        const blurMat = new THREE.ShaderMaterial({

            uniforms: {

                tex: {

                    type: 't',
                    value: null

                },

                direction: {

                    type: 'v2',
                    value: null

                },

                resolution: {

                    type: 'v2',
                    value: new THREE.Vector2(1.0, 1.0)

                },

            },

            vertexShader: glslify('./shaders/renderQuad.glsl'),

            fragmentShader: frag

        })

        return blurMat

    }

    getCopyMat() {

        const copyMat = new THREE.ShaderMaterial({

            uniforms: {

                tex: {

                    type: 't',
                    value: null

                },

                opacity: {

                    type: 'f',
                    value: 1.0

                }

            },

            vertexShader: glslify('./shaders/renderQuad.glsl'),

            fragmentShader: glslify('./shaders/copy.glsl'),

            transparent: true,

            depthWrite: false,

            depthTest: false

        })

        return copyMat

    }

}