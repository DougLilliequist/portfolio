import * as THREE from 'three'

import renderer from 'renderer'

const glslify = require('glslify')

export default class FBO {

    constructor(width, height) {

        const gl = renderer.getContext()

        if(!gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS)) {

            throw new error('Buuu...No support for vertex shader textures! ｡゜(｀Д´)゜｡')

        }

        if(!gl.getExtension('OES_texture_float')) {

            throw new error('Buuu...No support for float textures! ｡゜(｀Д´)゜｡')

        }

        this.w = width

        this.h = height

        this.initFBOScene()

        this.initRenderTargets()

        this.initRenderquad()

    }

    initFBOScene() {

        this.scene = new THREE.Scene()

        this.cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.0000000000001, 1)

    }

    initRenderTargets() {

        this.options = {

            minFilter: THREE.NearestFilter,

            magFilter: THREE.NearestFilter,

            wrapS: THREE.ClampToEdgeWrapping,

            wrapT: THREE.ClampToEdgeWrapping,

            format: THREE.RGBAFormat,

            type: THREE.FloatType,

            depthTest: false,

            depthWrite: false,

            stencilBuffer: false

        }

        this.rtt = new THREE.WebGLRenderTarget(this.w, this.h, this.options)

        this.rtt2 = this.rtt.clone()

    }

    initRenderquad() {

        const geo = new THREE.PlaneBufferGeometry(2, 2)

        const initMat = new THREE.ShaderMaterial({

            uniforms: {

                tex: {

                    type: 't',

                    value: null
                },

                resolution: {

                    type: 'v2',
                    value: new THREE.Vector2(this.w || 1, this.h || 1)

                }

            },

            vertexShader: glslify('../../doli/shaders/renderQuad.glsl'),

            fragmentShader: glslify('../../doli/shaders/init.glsl')

        })

        this.renderQuad = new THREE.Mesh(geo, initMat)

        this.scene.add(this.renderQuad)

    }

    initSim(renderer, data) {

        if (data instanceof THREE.DataTexture === false) {

            console.error('No simulation data found')

        } else {

            this.renderQuad.material.uniforms.tex.value = data

            renderer.render(this.scene, this.cam, this.rtt, true)

            this.renderQuad.material.uniforms.tex.value = this.rtt

            renderer.render(this.scene, this.cam, this.rtt2, true)

        }

    }

}