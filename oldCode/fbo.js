import * as THREE from 'three'

const glslify = require('glslify')

export default class FBO {

    constructor(width, height) {

        this.w = width

        this.h = height

        this.initFBOScene()

        this.initRenderTargets()

        this.initInitmat()

        //maybe include an initSim method here?

    }

    initFBOScene() {

        this.scene = new THREE.Scene()

        this.cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.0000000000001, 1)

    }

    initRenderTargets() {

        this.options = {
            
            minFilter: THREE.NearestFilter,

            magFilter: THREE.NearestFilter,

            format: THREE.RGBAFormat,

            type: THREE.FloatType,

            depthTest: false,

            depthWrite: false,

            stencilBuffer: false

        }

        this.rtt = new THREE.WebGLRenderTarget(this.w, this.h, this.options)

        this.rtt2 = this.rtt.clone()

    }

    initInitmat() {

        this.initMat = new THREE.ShaderMaterial({

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

            vertexShader: glslify('../../doli/shaders/renderQuad.glsl'),

            fragmentShader: glslify('../../doli/shaders/init.glsl')

        })

    }

}