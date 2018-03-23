import * as THREE from 'three'

import Pass from './pass.js'

import RenderTarget from 'renderTarget'

import renderer from 'renderer'

const glslify = require('glslify')

import eventEmitter from 'eventEmitter'

const emitter = eventEmitter.emitter

export default class OutlinePass extends Pass {

    constructor(width, height) {

        super(width, height)

        this.init()

        this.initNormalPass()
        
        this.initDepthPass()

        this.initEdgePass()

        this.initEvents()

    }

    init() {

        this.copyMat = this.getCopyMat()

        this.renderQuad.material = this.copyMat


    }

    initNormalPass() {

        return

    }

    initDepthPass() {

        this.depthRtt = new RenderTarget(this.w, this.h)

        this.depthRtt.minFilter = THREE.NearestFilter

        this.depthRtt.magFilter = THREE.NearestFilter

        this.depthRtt.stencilBuffer = false

        this.depthRtt.depthBuffer = true

        this.depthRtt.depthTexture = new THREE.DepthTexture()

        this.depthRtt.depthTexture.type = THREE.UnsignedShortType

        console.log(this.depthRtt)

        this.depthMat = this.getDepthMat()

        this.renderQuad.material = this.depthMat

        console.log(this.depthMat)

    }

    initEdgePass() {

        this.rtt = new RenderTarget(this.w, this.h)

    }

    initEvents() {

        emitter.on('resizing', this.onResize.bind(this))

    }

    render(args = {}) {

        const scene = args.scene

        const camera = args.camera

        renderer.render(scene, camera, this.depthRtt, true)

        // console.log(this.renderQuad.material)

        // this.renderQuad.material.uniforms['tex'].value = this.rtt

        // renderer.render(this.scene, this.cam, this.depthRtt)
        
        this.renderQuad.material = this.depthMat

        // this.depthMat.uniforms['tDiffuse'].value = this.depthRtt

        // this.depthMat.uniforms['tDepth'].value = this.depthRtt.depthTexture

        // this.normalMat.uniforms['tDiffuse'].value = this.normalRtt

        // this.material = this.normalMat

        // scene.overrideMaterial = null

        // renderer.render(scene, camera, this.rtt)

    }

    onResize() {

        renderer.setSize(window.innerWidth, window.innerHeight)

    }

    getCopyMat() {

        return new THREE.ShaderMaterial({

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

            depthTest: false,

            depthWrite: false


        })

    }

    getDepthMat() {

        return new THREE.ShaderMaterial({

            uniforms: {

                tDiffuse: {

                    type: 't',
                    value: null

                },

                tDepth: {

                    type: 't',

                    value: null

                },

                near: {

                    type: 'f',

                    value: 0.1
                },

                far: {

                    type: 'f',

                    value: 1.0

                }

            },

            // vertexShader: glslify('./shaders/renderQuad.glsl'),
            
            // fragmentShader: glslify('./shaders/depth.glsl')

        })

    }


}