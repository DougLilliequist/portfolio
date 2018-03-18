'use strict'

import * as THREE from 'three'

import Pass from 'renderPass'

import BloomPass from './bloom3.js'

import BlurPass from './blur.js'

import FxaaPass from './fxaa.js';

import {TweenLite} from 'gsap'

const glslify = require('glslify')

import renderer from 'renderer'

import eventEmitter from 'eventEmitter'

const emitter = eventEmitter.emitter

export default class FinalRender extends Pass {

    constructor(width, height) {

        super(width, height)

        this.initParams()

        this.initEvents()

    }

    initParams() {

        this.renderQuad.material.uniforms.bloom = {

            type: 't',

            value: null

        }

        this.renderQuad.material.uniforms.blur = {

            type: 't',
            value: null

        }

        this.renderQuad.material.uniforms.mainTex = {

            type: 't',

            value: null

        }

        this.renderQuad.material.uniforms.lerp = {

            type: 'f',

            value: 0.0

        }

        this.renderQuad.material.uniforms.modePercent = {

            type: 'f',

            value: 1.0

        }

        this.renderQuad.material.uniforms.blurPercent = {

            type: 'f',
            
            value: 0.0

        }

        this.renderQuad.material.fragmentShader = glslify('./shaders/finalRender.glsl')

        this.renderQuad.material.transparent = true

        this.renderQuad.material.depthTest = false

        this.renderQuad.material.depthWrite = false

        this.renderQuad.frustumCulled = false

        this.renderQuad.material.blending = THREE.AdditiveBlending

    }

    initPasses(width, height, rtt) {

        this.bloomPass = new BloomPass(width, height)

        this.blurPass = new BlurPass(width, height)

        this.fxaaPass = new FxaaPass(width, height)
        
    }

    initEvents() {

        // emitter.on('blurDOLI', this.blur.bind(this))

        emitter.on('bloom', this.bloom.bind(this))

        emitter.on('resizing', this.onResize.bind(this))

    }

    bloom(b) {

        const percent = this.renderQuad.material.uniforms['modePercent']

        TweenLite.to(percent, 0.5,{

            value: b === true ? 1.0 : 0.0

        })

    }

    //Do I need to explicitly clear the renderer here as well?

    render(rtt) {
        
        this.bloomPass.render(rtt)

        this.blurPass.render(rtt) //remove this later

        this.fxaaPass.render(rtt)

        this.renderQuad.material.uniforms['bloom'].value = this.bloomPass.rtt

        this.renderQuad.material.uniforms['blur'].value = this.blurPass.rtt
        
        // this.renderQuad.material.uniforms.mainTex.value = rtt
        this.renderQuad.material.uniforms['mainTex'].value = this.fxaaPass.rtt

        //or rather, make the fxaa pass it's uniform and apply final blending

        renderer.render(this.scene, this.cam) //get uuid error when forceclearing

        renderer.toneMappingExposure = Math.pow(1.0, 4.0)

    }

    onResize() {

        renderer.setSize(this.w, this.h)

    }

}