'use strict'

import * as THREE from 'three'

import Pass from 'renderPass'

import RenderTarget from 'renderTarget'

import OutlinePass from './outline.js'

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

        this.renderQuad.material.uniforms.fxaa = {

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

    initPasses(width, height) {

        this.rtt = new RenderTarget(width, height)

        this.outlinePass = new OutlinePass(width, height)

        // this.bloomPass = new BloomPass(width, height)

        // this.blurPass = new BlurPass(width, height)

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

    render(args = {}) {

        // renderer.render(args.scene, args.camera, this.rtt)

        this.outlinePass.render(args)
        
        // this.bloomPass.render(this.rtt)

        // this.blurPass.render(this.rtt) //remove this later

        // this.fxaaPass.render(this.outlinePass.rtt)

        // this.renderQuad.material.uniforms['blur'].value = this.blurPass.rtt
        
        // this.renderQuad.material.uniforms['mainTex'].value = this.outlinePass.rtt
        this.renderQuad.material.uniforms['mainTex'].value = this.outlinePass.rtt
        // this.renderQuad.material.uniforms['mainTex'].value = this.rtt

        renderer.render(this.scene, this.cam) //get uuid error when forceclearing

    }

    onResize() {

        this.rtt.setSize(this.w, this.h)

        renderer.setSize(this.w, this.h)

    }

}