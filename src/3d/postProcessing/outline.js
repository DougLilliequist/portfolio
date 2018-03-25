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

        this.initNormalDepthPass()
        
        this.initEdgePass()

        this.initEvents()

    }

    init() {

        this.rtt = new RenderTarget(this.w, this.h)

        this.copyRtt = new RenderTarget(this.w, this.h)

    }

    initNormalDepthPass() {

        this.normalRtt = new RenderTarget(this.w, this.h)

        this.depthRtt = new RenderTarget(this.w, this.h)

        this.depthRtt.minFilter = THREE.NearestFilter

        this.depthRtt.magFilter = THREE.NearestFilter

        this.depthRtt.stencilBuffer = false

        this.depthRtt.depthBuffer = true

        this.depthRtt.depthTexture = new THREE.DepthTexture()

        this.depthRtt.depthTexture.type = THREE.UnsignedShortType

        this.normDepthMat = this.getNormalDepthMat()

    }

    initEdgePass() {

        this.edgeRtt = new RenderTarget(this.w, this.h)

        this.edgeMat = this.getEdgeMat()

    }

    initEvents() {

        emitter.on('resizing', this.onResize.bind(this))

    }

    render(args = {}) {

        const scene = args.scene

        const camera = args.camera

        renderer.render(scene, camera, this.copyRtt)

        emitter.emit('applyNormal', true)

        renderer.render(scene, camera, this.normalRtt)

        emitter.emit('applyNormal', false)

        renderer.render(scene, camera, this.depthRtt)

        this.renderQuad.material = this.normDepthMat

        this.renderQuad.material.uniforms['tNormal'].value = this.normalRtt
        
        this.renderQuad.material.uniforms['tDepth'].value = this.depthRtt.depthTexture

        renderer.render(this.scene, this.cam, this.edgeRtt)

        this.renderQuad.material = this.edgeMat

        this.renderQuad.material.uniforms['tDiffuse'].value = this.copyRtt
        
        this.renderQuad.material.uniforms['tNormDepth'].value = this.edgeRtt

        renderer.render(this.scene, this.cam, this.rtt)

    }

    onResize() {

        renderer.setSize(window.innerWidth, window.innerHeight)

    }

    getNormalDepthMat() {

        return new THREE.ShaderMaterial({

            uniforms: {

                tNormal: {

                    type: 't',

                    value: null

                },

                tDepth: {

                    type: 't',

                    value: null

                },

                cameraNear: {

                    type: 'f',

                    value: 1.25

                },

                cameraFar: {

                    type: 'f',
                    value: 5.0

                },

            },

            vertexShader: glslify('./shaders/renderQuad.glsl'),

            fragmentShader: glslify('./shaders/edges/normal.glsl'),

        })

    }

    getEdgeMat() {

        return new THREE.ShaderMaterial({

            uniforms: {

                tDiffuse: {

                    type: 't',
                    value: null

                },

                tNormDepth: {

                    type: 't',
                    value: null

                },

                resolution: {

                    type: 'v2',
                    value: new THREE.Vector2(this.w || 1, this.h || 1)

                }


            },

            vertexShader: glslify('./shaders/renderQuad.glsl'),

            fragmentShader: glslify('./shaders/edges/edge.glsl')


        })

    }


}