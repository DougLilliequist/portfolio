/**
 * @author Douglas Lilliequist / http://iamdoli.com/
 * @author spidersharma / http://eduperiment.com/
 * 
 * Inspired from Unreal Engine
 * https://docs.unrealengine.com/latest/INT/Engine/Rendering/PostProcessEffects/Bloom/
 */

import * as THREE from 'three'

const glslify = require('glslify')

import Pass from './pass.js'

import RenderTarget from '../utils/renderTarget.js'

import Blur from './blur.js'

import renderer from '../renderer.js'

// export default class BloomPass {
export default class BloomPass extends Pass {

    constructor(width, height, mainRtt) {

        super(width, height)

        this.init(width, height)

        this.initCopyShader()

        this.initLuminosityPass()

        this.initBlurPasses()

        this.initBlurMaterials()

        this.initCompositeMaterial()

        this.initEvents()

    }

    init(width, height) {

        this.w = width

        this.h = height

        this.rtt = new RenderTarget(this.w, this.h)

        this.oldClearColor = new THREE.Color()

        this.oldClearAlpha = 1.0

        this.strength = 0.7

        this.rad = 0.1

        this.threshold = 0.01

        this.nMips = 5.0

    }

    initCopyShader() {

        this.copyMat = this.getCopyMat()

    }

    initLuminosityPass() {

        this.lumaRtt = new RenderTarget(this.w, this.h)

        this.lumaMat = this.getLumaMat()

        this.lumaMat.uniforms.luminosityThreshold.value = this.threshold

        this.lumaMat.uniforms.smoothWidth.value = 0.01

    }

    initBlurPasses() {

        this.horizontalBlurs = []

        this.verticalBlurs = []

        this.blurDirX = new THREE.Vector2(1.0, 0.0)

        this.blurDirY = new THREE.Vector2(0.0, 1.0)

        let blurResX = Math.round(this.w / 2)

        let blurResY = Math.round(this.h / 2)

        for (let i = 0; i < this.nMips; i++) {

            let blurRttH = new RenderTarget(blurResX, blurResY)

            this.horizontalBlurs.push(blurRttH)

            let blurRttV = new RenderTarget(blurResX, blurResY)

            this.verticalBlurs.push(blurRttV)

            blurResX = Math.round(blurResX / 2)

            blurResY = Math.round(blurResY / 2)

        }

    }

    initBlurMaterials() {

        this.blurMats = []

        this.kernelSizes = [3, 5, 7, 9, 11]

        let blurResX = Math.round(this.w / 2)

        let blurResY = Math.round(this.h / 2)

        for (let i = 0; i < this.nMips; i++) {

            let blurMat = this.getBlurMat(this.kernelSizes[i])

            blurMat.uniforms.texSize.value = new THREE.Vector2(blurResX, blurResY)

            this.blurMats.push(this.getBlurMat(this.kernelSizes[i]))

            this.blurMats[i].uniforms.texSize.value = new THREE.Vector2(blurResX, blurResY)

            blurResX = Math.round(blurResX / 2)

            blurResY = Math.round(blurResY / 2)

        }

    }

    initCompositeMaterial() {

        this.compositeMat = this.getCompositeMat(this.nMips)

        this.compositeMat.uniforms.blurTex1.value = this.verticalBlurs[0].texture

        this.compositeMat.uniforms.blurTex2.value = this.verticalBlurs[1].texture

        this.compositeMat.uniforms.blurTex3.value = this.verticalBlurs[2].texture

        this.compositeMat.uniforms.blurTex4.value = this.verticalBlurs[3].texture

        this.compositeMat.uniforms.blurTex5.value = this.verticalBlurs[4].texture

        this.compositeMat.uniforms.bloomStr.value = this.strength

        this.compositeMat.uniforms.bloomRadius.value = this.rad

        this.compositeMat.needsUpdate = true

        this.compositeMat.depthTest = false

        this.compositeMat.depthWrite = false

        console.log(this.compositeMat)

        this.bloomFactors = [1.0, 0.8, 0.6, 0.4, 0.2]

        this.compositeMat.uniforms["bloomFactors"].value = this.bloomFactors

        this.bloomTintColors = [new THREE.Vector3(1.0, 1.0, 1.0), new THREE.Vector3(1.0, 1.0, 1.0), new THREE.Vector3(1.0, 1.0, 1.0),
            new THREE.Vector3(1.0, 1.0, 1.0), new THREE.Vector3(1.0, 1.0, 1.0)
        ]

        this.compositeMat.uniforms["bloomTintColors"].value = this.bloomTintColors

    }

    initEvents() {

        window.addEventListener('resize', this.resizeBloomPass.bind(this))

    }

    getCopyMat() {

        const copyMat = new THREE.ShaderMaterial({

            uniforms: {

                tex: {

                    type: 't', 

                    value: null

                },

                opacity: {

                    type: 'f',

                    value: 1.0

                },

                resolution: {

                    type: 'v2',

                    value: new THREE.Vector2(this.w, this.h)

                }

            },

            vertexShader: glslify('./shaders/renderQuad.glsl'),

            fragmentShader: glslify('./shaders/copy.glsl'),

            transparent: true,

            depthWrite: false,

            depthTest: false,

        })

        return copyMat

    }

    getLumaMat() {

        const lumaMat = new THREE.ShaderMaterial({

            uniforms: {

                tDiffuse: {
                    
                    type: 't',
                    
                    value: null
                
                },
                
                luminosityThreshold: {
                   
                    type: 'f',
                    
                    value: 1.0
                
                },
                
                smoothWidth: {
                   
                    type: 'f',
                    
                    value: 1.0
                
                },
                
                defaultColor: {
                    
                    type: 'c',
                    
                    value: new THREE.Color( 0x000000 )
                
                },
                
                defaultOpacity: {
                    
                    type: 'f',
                    
                    value: 0.0
                
                },

            },

            vertexShader: glslify('./shaders/renderQuad.glsl'),

            fragmentShader: glslify('./shaders/luma.glsl')

        })

        return lumaMat

    }

    getBlurMat(kernelRadius) {

        const blurMat = new THREE.ShaderMaterial({

            defines: {

                "KERNEL_RADIUS": kernelRadius,

                "SIGMA": kernelRadius

            },

            uniforms: {

                colorTex: {

                    type: 't',

                    value: null

                },

                texSize: {

                    type: 'v2',

                    value: new THREE.Vector2(0.5, 0.5)

                },

                direction: {

                    type: 'v2',

                    value: new THREE.Vector2(0.5, 0.5)

                },

            },

            vertexShader: glslify('./shaders/renderQuad.glsl'),

            fragmentShader: glslify('./shaders/blur2.glsl')

        })

        return blurMat

    }

    getCompositeMat(nMips) {

        return new THREE.ShaderMaterial({

            defines: {

                "NUM_MIPS": nMips

            },

            uniforms: {

                blurTex1: {

                    type: 't',

                    value: null

                },


                blurTex2: {

                    type: 't',

                    value: null

                },


                blurTex3: {

                    type: 't',

                    value: null

                },


                blurTex4: {

                    type: 't',

                    value: null

                },


                blurTex5: {

                    type: 't',

                    value: null

                },

                bloomStr: {

                    type: 'f',

                    value: 1.0

                },

                "bloomFactors": {

                    // type: 'fv1',

                    value: null

                },

                "bloomTintColors": {

                    // type: 'v3v',

                    value: null

                },

                bloomRadius: {

                    type: 'f',

                    value: null

                },

            },

            vertexShader: glslify('./shaders/renderQuad.glsl'),

            fragmentShader: glslify('./shaders/bloom2.glsl'),

            needsUpdate: true

        })

        // return compositeMat

    }

    render(rtt) {

        if(rtt === undefined) {

            console.error('no rendertarget found')

        }

        this.oldClearColor.copy(renderer.getClearColor())

        this.oldClearAlpha = renderer.getClearAlpha()

        let oldAutoClear = renderer.autoClear

        renderer.autoClear = false

        renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0), 0)

        this.lumaMat.uniforms.luminosityThreshold.value = this.threshold

        this.lumaMat.uniforms.tDiffuse.value = rtt

        this.renderQuad.material = this.lumaMat

        renderer.render(this.scene, this.cam, this.lumaRtt, true)

        this.inputRtt = this.lumaRtt.texture

        for (let i = 0; i < this.nMips; i++) {

            this.renderQuad.material = this.blurMats[i]

            this.blurMats[i].uniforms.colorTex.value = this.inputRtt

            this.blurMats[i].uniforms.direction.value = this.blurDirX

            renderer.render(this.scene, this.cam, this.horizontalBlurs[i], true)

            this.blurMats[i].uniforms.colorTex.value = this.horizontalBlurs[i].texture

            this.blurMats[i].uniforms.direction.value = this.blurDirY

            renderer.render(this.scene, this.cam, this.verticalBlurs[i], true)

            this.inputRtt = this.horizontalBlurs[i].texture
            // this.inputRtt = this.verticalBlurs[i].texture

        }

        this.renderQuad.material = this.compositeMat

        this.compositeMat.uniforms.bloomStr.value = this.strength

        this.compositeMat.uniforms.bloomRadius.value = this.rad

        this.compositeMat.uniforms["bloomTintColors"].value = this.bloomTintColors

        renderer.render(this.scene, this.cam, this.horizontalBlurs[0], true)

        // // this.rtt = this.horizontalBlurs[0]

        this.renderQuad.material = this.copyMat

        this.renderQuad.material.uniforms.tex.value = this.horizontalBlurs[0].texture

        renderer.render(this.scene, this.cam, this.rtt, false)

        renderer.setClearColor(this.oldClearColor, this.oldClearAlpha)

        renderer.autoClear = oldAutoClear

    }

    resizeBloomPass() {

        this.w = window.innerWidth

        this.h = window.innerHeight

        let blurResX = Math.round(this.w / 2)

        let blurResY = Math.round(this.h / 2)

        this.lumaRtt.setSize(blurResX, blurResY)

        for(let i = 0; i < this.nMips; i++) {

            this.horizontalBlurs[i].setSize(blurResX, blurResY)

            this.verticalBlurs[i].setSize(blurResX, blurResY)

            this.blurMats[i].uniforms.texSize.value = new THREE.Vector2(blurResX, blurResY)
            
            // this.blurMats[i].uniforms.resolution.value = new THREE.Vector2(this.w, this.h)

            blurResX = Math.round(blurResX / 2)
            
            blurResY = Math.round(blurResY / 2)

        }

    }

}