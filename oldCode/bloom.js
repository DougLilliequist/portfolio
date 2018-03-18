'use strict'

import * as THREE from 'three'

const glslify = require('glslify')

import Pass from './pass.js'

import RenderTarget from '../utils/renderTarget.js'

import Blur from './blur.js'

import renderer from '../renderer.js'

export default class BloomPass extends Pass {

    constructor(width, height, mainRtt) {

        super(width, height)

        this.rtt = new RenderTarget(width, height)

        this.initBlurPasses(width, height, mainRtt)

        this.initParams()

    }

    initBlurPasses(width, height, mainRtt) {

        this.vBlur = new Blur(width, height, new THREE.Vector2(0.0, 1.0))
        
        this.hBlur = new Blur(width, height, new THREE.Vector2(1.0, 0.0))

        this.vBlur.renderQuad.material.uniforms.tex.value = mainRtt
        // this.hBlur.renderQuad.material.uniforms.tex.value = mainRtt
        
        renderer.render(this.hBlur.scene, this.hBlur.cam, this.vBlur.rtt)

        // this.vBlur.renderQuad.material.uniforms.tex.value = this.vBlur.rtt

        // renderer.render(this.vBlur.scene, this.vBlur.cam, this.hBlur.rtt)

    }

    initParams() {

        this.renderQuad.material.uniforms.blur = {

            type: 't',

            value: null

        }

        this.renderQuad.material.uniforms.tex = {

            type: 't',

            value: null

        }

        this.renderQuad.material.uniforms.strength = {

            type: 'f',

            value: 1.15

        }

        this.renderQuad.material.fragmentShader = glslify('./shaders/bloom.glsl')

    }

    render(rtt) {

        let tmp = this.hBlur.rtt

        this.hBlur.rtt = this.vBlur.rtt

        this.vBlur.rtt = tmp

        this.vBlur.render(this.hBlur.rtt)

        this.hBlur.render(this.vBlur.rtt)

        this.hBlur.renderQuad.material.uniforms.tex.value = this.vBlur.rtt

        this.renderQuad.material.uniforms.blur.value = this.vBlur.rtt

        this.renderQuad.material.uniforms.tex.value = rtt

        renderer.render(this.scene, this.cam, this.rtt)

    }    

}