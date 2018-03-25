//dolis body which is a particle mesh

import * as THREE from 'three'

import {
    config
} from '../config.js'

const glslify = require('glslify')

import eventEmitter from 'eventEmitter'

import { TweenLite, Power1, Sine, Expo } from 'gsap';

const emitter = eventEmitter.emitter

export default class Body extends THREE.Object3D {

    constructor() {

        super()

        this.initGeo()

        this.initMat()

        this.initMesh()

        // this.initProjectQuad()

        this.initEvents()

    }

    initGeo() {

        //instances goes here

        const amnt = config.particleAmntX * config.particleAmntY

        this.geo = new THREE.InstancedBufferGeometry()

        const baseGeo = new THREE.BoxBufferGeometry(1, 1, 1) //would be cool to use noise to make morphing blobs when in seek form and change to cubes when in project mode

        this.geo.addAttribute('position', baseGeo.attributes.position)

        this.geo.addAttribute('uv', baseGeo.attributes.uv)

        this.geo.addAttribute('normal', baseGeo.attributes.normal)

        const translations = new Float32Array(amnt * 3)

        const rotations = new Float32Array(amnt * 3)

        const scales = new Float32Array(amnt * 3)

        const forwardVec = new Float32Array(amnt * 3)

        for (let i = 0; i < translations.length; i++) {

            let i3 = i * 3

            translations[i3 + 0] = (i % config.particleAmntX) / config.particleAmntX

            translations[i3 + 1] = (i / config.particleAmntX) / config.particleAmntY

            translations[i3 + 2] = 0

        }

        for (let i = 0; i < rotations.length; i++) {

            let i3 = i * 3

            rotations[i3 + 0] = 0

            rotations[i3 + 1] = 0

            rotations[i3 + 2] = 0

        }

        for (let i = 0; i < scales.length; i++) {

            let i3 = i * 3

            scales[i3 + 0] = 0.25

            scales[i3 + 1] = 0

            scales[i3 + 2] = 0

        }

        for (let i = 0; i < forwardVec.length; i++) {

            let i3 = i * 3

            forwardVec[i3 + 0] = 0.0

            forwardVec[i3 + 1] = 0.0

            forwardVec[i3 + 2] = -1.0

        }


        this.geo.addAttribute('translation', new THREE.InstancedBufferAttribute(translations, 3, 1))

        this.geo.addAttribute('rotation', new THREE.InstancedBufferAttribute(rotations, 3, 1))

        this.geo.addAttribute('scale', new THREE.InstancedBufferAttribute(scales, 3, 1))

        this.geo.addAttribute('forward', new THREE.InstancedBufferAttribute(forwardVec, 3, 1))

        this.geo.setIndex(baseGeo.index)

        this.geo.attributes.translation.setDynamic(true)

        console.log(this.geo)

    }

    initMat() {

        const texRes = {

            w: config.particleAmntX,
            
            h: config.particleAmntY

        }
        

        this.mat = new THREE.RawShaderMaterial({

            uniforms: {

                currentPos: {

                    type: 't',
                
                    value: null

                },

                previousPos: {

                    type: 't',
                    
                    value: null

                },

                direction: {

                    type: 't',

                    value: null

                },

                tex: {

                    type: 't',
                    
                    value: null

                },

                tex2: {

                    type: 't',
                   
                    value: null

                },

                prevMousePos: {

                    type: 'v3',

                    value: new THREE.Vector3()

                },

                mousePos: {

                    type: 'v3',
                    
                    value: new THREE.Vector3()

                },

                animTime: {

                    type: 'f',
                    
                    value: null

                },

                easeTime: {

                    type: 'f',
                    
                    value: 0

                },

                alpha: {

                    type: 'f',
                    value: 1.0

                },

                mode: {

                    type: 'f',

                    value: 0.0

                },

                rotationEaseTime: {

                    type: 'f',

                    value: 0.0

                },

                projectEase: {

                    type: 'f',

                    value: 0.0

                },

                resolution: {

                    type: 'v2',
                    // value: new THREE.Vector2(1920, 1080) //change / remove this later
                    value: new THREE.Vector2(config.particleAmntX, config.particleAmntY) //change / remove this later

                }

            },

            vertexShader: glslify('./shaders/vertexShader.glsl'),
            
            fragmentShader: glslify('./shaders/fragmentShader.glsl'),
            
            transparent: true,
            
            // blending: THREE.AdditiveBlending

        })

        this.mat.extensions.derivatives = true
        
        // this.mat.uniforms.tex.value = this.textures[0]

        this.mat.needsUpdate = true

    }

    //need to clean this mess up...

    initMesh() {

        this.mesh = new THREE.Mesh(this.geo, this.mat)
        this.mesh.frustumCulled = false
        this.mesh.name = 'DOLI'
        this.mesh.currentMode = ''
        // this.mesh.rotation.x = Math.PI / -8
        this.add(this.mesh)

    }

    initEvents() {

        emitter.on('applyNormal', this.applyNormal.bind(this))

    }

    applyNormal(b) {

        this.mesh.material.uniforms['mode'].value = (b === true) ? 1.0 : 0.0

    }


}