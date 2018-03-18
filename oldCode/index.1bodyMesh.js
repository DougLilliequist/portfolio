//dolis body which is a particle mesh

import * as THREE from 'three'

import videoTexture from './textures/vidTexture.js'

import {
    config
} from '../config.js'

const glslify = require('glslify')

import eventEmitter from 'eventEmitter'

const emitter = eventEmitter.emitter

export default class Body extends THREE.Mesh {

    constructor() {

        const amnt = config.particleAmntX * config.particleAmntY

        const geo = new THREE.InstancedBufferGeometry()

        const baseGeo = new THREE.BoxBufferGeometry(1, 1, 1) //would be cool to use noise to make morphing blobs when in seek form and change to cubes when in project mode

        geo.addAttribute('position', baseGeo.attributes.position)

        geo.addAttribute('uv', baseGeo.attributes.uv)

        geo.addAttribute('normal', baseGeo.attributes.normal)

        const translations = new Float32Array(amnt * 3)

        const rotations = new Float32Array(amnt * 3)

        const scales = new Float32Array(amnt * 3)

        const forwardVec = new Float32Array(amnt * 3)

        let projectModeW = config.particleAmntX * 1.25

        let projectModeH = config.particleAmntY * 0.75

        let uvScaleConstX = 1 / projectModeW

        let uvScaleConstY = 1 / projectModeH

        const uvScale = new Float32Array(amnt * 2)

        const uvOffset = new Float32Array(amnt * 2)

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

        let uvIterator = 0

        //need to rework the loop that shapes the project mode
        //right now, this iteration is VERY confusing

        for (let i = 0; i < projectModeW; i++) {

            for (let y = 0; y < projectModeH; y++) {

                let i2 = uvIterator * 2

                uvScale[i2 + 0] = uvScaleConstX

                uvScale[i2 + 1] = uvScaleConstY

                uvOffset[i2 + 0] = i * uvScaleConstX

                uvOffset[i2 + 1] = y * uvScaleConstY

                uvIterator++

            }

        }


        geo.addAttribute('translation', new THREE.InstancedBufferAttribute(translations, 3, 1))

        geo.addAttribute('rotation', new THREE.InstancedBufferAttribute(rotations, 3, 1))

        geo.addAttribute('scale', new THREE.InstancedBufferAttribute(scales, 3, 1))

        geo.addAttribute('forward', new THREE.InstancedBufferAttribute(forwardVec, 3, 1))

        geo.addAttribute('uvScale', new THREE.InstancedBufferAttribute(uvScale, 2, 1))

        geo.addAttribute('uvOffSet', new THREE.InstancedBufferAttribute(uvOffset, 2, 1))

        geo.setIndex(baseGeo.index)

        geo.attributes.translation.setDynamic(true)

        // this.vidTexture = new THREE.VideoTexture()

        const mat = new THREE.RawShaderMaterial({

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

                rotationEaseTime: {

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

            blending: THREE.AdditiveBlending

        })

        mat.extensions.derivatives = true

        mat.needsUpdate = true

        super(geo, mat)

        this.frustumCulled = false

        this.name = 'DOLI'

        this.currentMode = ''

        this.geometry.computeBoundingBox()

        this.bbox = this.geometry.boundingBox

        console.log(this.bbox)

        this.initTextures()

        this.initEvents()

    }

    initTextures() {

        const texRes = {

            w: 80,
            h: 48

        }

        this.srces = [] //make this to an object and instead refer to project name when applying texture
        this.srces[0] = './src/media/gdnghtswthrtweb.mp4'
        this.srces[1] = './src/media/tbntproj.mp4'
        this.srces[2] = './src/media/tbntproj.mp4'
        this.srces[3] = './src/media/intrnshpproj.mp4'
        this.srces[4] = './src/media/gdnghtswthrtweb.mp4'

        this.textures = []
        this.textures[0] = videoTexture.get(this.srces[0], texRes)
        this.textures[1] = videoTexture.get(this.srces[1], texRes)
        this.textures[2] = videoTexture.get(this.srces[2], texRes)
        this.textures[3] = videoTexture.get(this.srces[3], texRes)
        this.textures[4] = videoTexture.get(this.srces[4], texRes)

        this.material.uniforms['tex'].value = this.textures[0]

    }

    initEvents() {

        emitter.on('projectChanged', this.updateTexture.bind(this))

    }

    updateTexture(data) {

        console.log('updating')

        this.material.uniforms.tex.value = this.textures[data]

        this.material.needsUpdate = true

    }


}