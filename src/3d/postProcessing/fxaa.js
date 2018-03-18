import * as THREE from 'three'

import Pass from './pass.js'

import RenderTarget from 'renderTarget'

import renderer from 'renderer'

const glslify = require('glslify')

export default class FxaaPass extends Pass {

    constructor(width, height) {

        super(width, height)

        this.init(width, height)

        this.initFxaaPass()

    }

    init(width, height) {

        this.w = width

        this.h = height

        this.rtt = new RenderTarget(width, height)

    }

    initFxaaPass() {

        this.mat = new THREE.ShaderMaterial({

            uniforms: {

                tex: {

                    type: 't',
                    value: null

                },

                resolution: {

                    type: 'v2',
                    value: new THREE.Vector2(this.w, this.h)

                }

            },

            vertexShader: glslify('./shaders/renderQuad.glsl'),
            
            fragmentShader: glslify('./shaders/fxaa.glsl'),

            depthTest: false,

            depthWrite: false,

            transparent: false

        })

        this.renderQuad.material = this.mat

    }

    render(inputRtt) {

        this.renderQuad.material.uniforms.tex.value = inputRtt

        renderer.render(this.scene, this.cam, this.rtt)

    }

}