//dolis body which is a particle mesh

import * as THREE from 'three'

import videoTexture from './textures/vidTexture.js'

// import ProjectQuad from './projectQuad/index.js'

import Mesh from './projectQuad/mesh.js'

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

        // let projectModeW = config.particleAmntX

        // let projectModeH = config.particleAmntY

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

        for(let i = 0; i < projectModeW; i++) {

            for(let y = 0; y < projectModeH; y++) {

                let i2 = uvIterator * 2

                uvScale[i2 + 0] = uvScaleConstX

                uvScale[i2 + 1] = uvScaleConstY

                uvOffset[i2 + 0] = i * uvScaleConstX

                uvOffset[i2 + 1] = y * uvScaleConstY

                uvIterator++

            }

        }


        this.geo.addAttribute('translation', new THREE.InstancedBufferAttribute(translations, 3, 1))

        this.geo.addAttribute('rotation', new THREE.InstancedBufferAttribute(rotations, 3, 1))

        this.geo.addAttribute('scale', new THREE.InstancedBufferAttribute(scales, 3, 1))

        this.geo.addAttribute('forward', new THREE.InstancedBufferAttribute(forwardVec, 3, 1))

        this.geo.addAttribute('uvScale', new THREE.InstancedBufferAttribute(uvScale, 2, 1))
        
        this.geo.addAttribute('uvOffSet', new THREE.InstancedBufferAttribute(uvOffset, 2, 1))

        this.geo.setIndex(baseGeo.index)

        this.geo.attributes.translation.setDynamic(true)

        console.log(this.geo)

    }

    initMat() {

        const texRes = {

            w: config.particleAmntX,
            
            h: config.particleAmntY
            // w: config.particleAmntX * 1.25,
            
            // h: config.particleAmntY * 0.75

        }
        

        // this.srces = [] //make this to an object and instead refer to project name when applying texture
        // this.srces[0] = './src/media/gdnghtswthrtweb.mp4'
        // this.srces[1] = './src/media/tbntproj.mp4'
        // this.srces[2] = './src/media/tbntproj.mp4'
        // this.srces[3] = './src/media/intrnshpproj.mp4'
        // this.srces[4] = './src/media/gdnghtswthrtweb.mp4'

        // this.textures = []
        // this.textures[0] = videoTexture.get(this.srces[0], texRes)
        // this.textures[1] = videoTexture.get(this.srces[1], texRes)
        // this.textures[2] = videoTexture.get(this.srces[2], texRes)
        // this.textures[3] = videoTexture.get(this.srces[3], texRes)
        // this.textures[4] = videoTexture.get(this.srces[4], texRes)

        // console.log(this.textures)

        // this.img = new THREE.TextureLoader().load('./src/3d/doli/body/testImg/test.jpeg')

        // this.img2 = new THREE.TextureLoader().load('./src/3d/doli/body/testImg/test2.jpg')

        // this.vidTexture = new THREE.VideoTexture()

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

    // initProjectQuad() {

    //     // this.projectQuadFactory = new ProjectQuad()

    //     this.projectQuad = new Mesh()

    //     this.projectQuad.visible = false

    //     this.add(this.projectQuad)


    // }

    initEvents() {

        // emitter.on('projectChanged', this.updateTexture.bind(this))

        // emitter.on('projectHovered', this.onHover.bind(this))

        emitter.on('reveal', this.onReveal.bind(this))

        emitter.on('hide', this.onHide.bind(this))

    }

    onReveal() {

        console.log('revealing')

        TweenLite.killTweensOf(this)

        TweenLite.to(this.mesh.material.uniforms['alpha'], 0.5, {

            value: 1.0

        })


    }

    onHide() {

        TweenLite.killTweensOf(this)

        TweenLite.to(this.mesh.material.uniforms['alpha'], 0.5, {

            value: 0.0

        })

    }


}