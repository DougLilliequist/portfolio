'use strict'

import * as THREE from 'three'

const glslify = require('glslify')

import eventEmitter from 'eventEmitter'

const emitter = eventEmitter.emitter

export default class Pass {

    constructor(width, height) {

        this.w = width

        this.h = height

        this.initScene()

        this.initRenderQuad()

        this.initEvents()

    }

    initScene() {

        this.scene = new THREE.Scene()

        this.cam = new THREE.OrthographicCamera(-1.0, 1.0, 1.0, -1.0, 0.0, 1.0)
        
    }

    initRenderQuad() {

        const geo = new THREE.PlaneBufferGeometry(2.0, 2.0, 1.0, 1.0)

        const mat = new THREE.ShaderMaterial({

            uniforms: {

                resolution: {

                    type: 'v2',

                    // value: new THREE.Vector2(this.w, this.h)
                    value: new THREE.Vector2(this.w, this.h)

                }

            },

            vertexShader: glslify('./shaders/renderQuad.glsl'),

            fragmentShader: null,

        })

        this.renderQuad = new THREE.Mesh(geo, mat)

        this.scene.add(this.renderQuad)

    }

    initEvents() {

        emitter.on('resizing', this.onResize.bind(this))

    }

    onResize() {

        this.w = window.innerWidth

        this.h = window.innerHeight

        this.renderQuad.material.uniforms.resolution.value = new THREE.Vector2(this.w, this.h)

        // renderer.setSize(this.w, this.h)

        this.cam.updateProjectionMatrix()

    }

}