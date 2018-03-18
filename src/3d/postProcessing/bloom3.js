/**
 * @author Douglas Lilliequist / http://iamdoli.com/
 * @author spidersharma / http://eduperiment.com/
 * 
 * Inspired from Unreal Engine
 * https://docs.unrealengine.com/latest/INT/Engine/Rendering/PostProcessEffects/Bloom/
 */

import * as THREE from 'three'

const glslify = require('glslify')

import Pass from 'renderPass'

import RenderTarget from 'renderTarget'

import Blur from './blur.js'

import renderer from 'renderer'

export default class BloomPass extends Pass {

    constructor(width, height) {

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

        this.strength = 0.9

        this.rad = 0.3

        this.threshold = 0.4

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

            this.blurMats.push(blurMat)

            blurResX = Math.round(blurResX / 2)

            blurResY = Math.round(blurResY / 2)

        }

    }

    initCompositeMaterial() {

        this.compositeMat = this.getCompositeMat( this.nMips );
        this.compositeMat.uniforms[ "blurTexture1" ].value = this.verticalBlurs[ 0 ].texture;
        this.compositeMat.uniforms[ "blurTexture2" ].value = this.verticalBlurs[ 1 ].texture;
        this.compositeMat.uniforms[ "blurTexture3" ].value = this.verticalBlurs[ 2 ].texture;
        this.compositeMat.uniforms[ "blurTexture4" ].value = this.verticalBlurs[ 3 ].texture;
        this.compositeMat.uniforms[ "blurTexture5" ].value = this.verticalBlurs[ 4 ].texture;
        this.compositeMat.uniforms[ "bloomStrength" ].value = this.strength;
        this.compositeMat.uniforms[ "bloomRadius" ].value = 0.1;
        this.compositeMat.needsUpdate = true;

        this.compositeMat.depthTest = false

        this.compositeMat.depthWrite = false

        this.bloomFactors = [1.0, 0.8, 0.6, 0.4, 0.2]

        this.compositeMat.uniforms.bloomFactors.value = this.bloomFactors

        this.bloomTintColors = [new THREE.Vector3(1.0, 1.0, 1.0), new THREE.Vector3(1.0, 1.0, 1.0), new THREE.Vector3(1.0, 1.0, 1.0),
            new THREE.Vector3(1.0, 1.0, 1.0), new THREE.Vector3(1.0, 1.0, 1.0)
        ]

        this.compositeMat.uniforms.bloomTintColors.value = this.bloomTintColors

    }

    initEvents() {

        window.addEventListener('resize', this.resizeBloomPass.bind(this))

    }

    render(rtt) {

        if(rtt === undefined || rtt === null) {

            console.error('no rendertarget found')

            renderer.render(this.scene, this.cam, null, false)

        }

        let autoClearCol = renderer.autoClearColor
        
        let clearCol = renderer.getClearColor().getHex()
        
        let clearAlpha = renderer.getClearAlpha()

        renderer.autoClearColor = false

        this.lumaMat.uniforms.luminosityThreshold.value = this.threshold

        this.lumaMat.uniforms.tDiffuse.value = rtt

        this.renderQuad.material = this.lumaMat

        renderer.render(this.scene, this.cam, this.lumaRtt, true)

        this.inputRtt = this.lumaRtt.texture

        for (let i = 0; i < this.nMips; i++) {

            this.renderQuad.material = this.blurMats[i]

            this.blurMats[i].uniforms["colorTexture"].value = this.inputRtt

            this.blurMats[i].uniforms["direction"].value = this.blurDirX

            renderer.render(this.scene, this.cam, this.horizontalBlurs[i], true)

            this.blurMats[i].uniforms["colorTexture"].value = this.horizontalBlurs[i].texture

            this.blurMats[i].uniforms["direction"].value = this.blurDirY
            
            renderer.render(this.scene, this.cam, this.verticalBlurs[i], true)

            this.inputRtt = this.verticalBlurs[i].texture

        }

        this.renderQuad.material = this.compositeMat

        this.compositeMat.uniforms.bloomStrength.value = this.strength

        this.compositeMat.uniforms.bloomRadius.value = this.rad

        this.compositeMat.uniforms.bloomTintColors.value = this.bloomTintColors

        renderer.render(this.scene, this.cam, this.horizontalBlurs[0], true)

        this.renderQuad.material = this.copyMat

        this.renderQuad.material.uniforms.tex.value = this.horizontalBlurs[0].texture
        // this.renderQuad.material.uniforms.tex.value = this.verticalBlurs[0].texture
        // this.renderQuad.material.uniforms.tex.value = this.lumaRtt.texture

        renderer.render(this.scene, this.cam, this.rtt, false)

        renderer.setClearColor(clearCol, clearAlpha)

        renderer.autoClearColor = autoClearCol

        // renderer.setClearColor(this.oldClearColor, this.oldClearAlpha)

        // renderer.autoClear = oldAutoClear

    }

    resizeBloomPass() {

        this.w = window.innerWidth

        this.h = window.innerHeight

        this.copyMat.uniforms.resolution.value = new THREE.Vector2(this.w, this.h)

        let blurResX = Math.round(this.w / 2)

        let blurResY = Math.round(this.h / 2)

        this.lumaRtt.setSize(blurResX, blurResY)

        this.lumaMat.uniforms.resolution.value = new THREE.Vector2(this.w, this.h)

        for(let i = 0; i < this.nMips; i++) {

            this.horizontalBlurs[i].setSize(blurResX, blurResY)

            this.verticalBlurs[i].setSize(blurResX, blurResY)

            this.blurMats[i].uniforms["texSize"].value = new THREE.Vector2(blurResX, blurResY)
            
            // this.blurMats[i].uniforms.texSize.value = new THREE.Vector2(blurResX, blurResY)
            
            // this.blurMats[i].uniforms["resolution"].value = new THREE.Vector2(this.w, this.h)
            // this.blurMats[i].uniforms.resolution.value = new THREE.Vector2(this.w, this.h)

            blurResX = Math.round(blurResX / 2)
            
            blurResY = Math.round(blurResY / 2)

        }

        // this.compositeMat.uniforms["resolution"].value = new THREE.Vector2(this.w, this.h)

        renderer.setSize(this.w, this.h)

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
                
                resolution: {

                    type: 'v2',

                    value: new THREE.Vector2(this.w, this.h)

                }

            },

            vertexShader: glslify('./shaders/renderQuad.glsl'),

            fragmentShader: glslify('./shaders/luma.glsl')

        })

        return lumaMat

    }

    getBlurMat(kernelRadius) {

		return new THREE.ShaderMaterial( {

			defines: {
				"KERNEL_RADIUS": kernelRadius,
				"SIGMA": kernelRadius
			},

			uniforms: {
				"colorTexture": { value: null },
				"texSize": { value: new THREE.Vector2( 0.5, 0.5 ) },
				"direction": { value: new THREE.Vector2( 0.5, 0.5 ) }
			},

			vertexShader:
				"varying vec2 vUv;\n\
				void main() {\n\
					vUv = uv;\n\
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\
				}",

			fragmentShader:
				"#include <common>\
				varying vec2 vUv;\n\
				uniform sampler2D colorTexture;\n\
				uniform vec2 texSize;\
                uniform vec2 direction;\
                uniform vec2 resolution;\
				\
				float gaussianPdf(in float x, in float sigma) {\
					return 0.39894 * exp( -0.5 * x * x/( sigma * sigma))/sigma;\
				}\
                void main() {\n\
                    vec2 uv = gl_FragCoord.xy / resolution.xy;\
					vec2 invSize = 1.0 / texSize;\
					float fSigma = float(SIGMA);\
					float weightSum = gaussianPdf(0.0, fSigma);\
					vec3 diffuseSum = texture2D( colorTexture, vUv).rgb * weightSum;\
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {\
						float x = float(i);\
						float w = gaussianPdf(x, fSigma);\
						vec2 uvOffset = direction * invSize * x;\
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset).rgb;\
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset).rgb;\
						diffuseSum += (sample1 + sample2) * w;\
						weightSum += 2.0 * w;\
					}\
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);\n\
				}"
		} );

    }

    getCompositeMat(nMips) {

        return new THREE.ShaderMaterial( {

			defines: {
				"NUM_MIPS": nMips
			},

			uniforms: {
				"blurTexture1": { value: null },
				"blurTexture2": { value: null },
				"blurTexture3": { value: null },
				"blurTexture4": { value: null },
				"blurTexture5": { value: null },
				"dirtTexture": { value: null },
				"bloomStrength": { value: 1.0 },
				"bloomFactors": { value: null },
				"bloomTintColors": { value: null },
                "bloomRadius": { value: 0.0 },
                "resolution": {value: new THREE.Vector2(this.w, this.h)}
			},

			vertexShader:
				"varying vec2 vUv;\n\
				void main() {\n\
					vUv = uv;\n\
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\
				}",

			fragmentShader:
				"varying vec2 vUv;\
				uniform sampler2D blurTexture1;\
				uniform sampler2D blurTexture2;\
				uniform sampler2D blurTexture3;\
				uniform sampler2D blurTexture4;\
				uniform sampler2D blurTexture5;\
				uniform sampler2D dirtTexture;\
				uniform float bloomStrength;\
				uniform float bloomRadius;\
				uniform float bloomFactors[NUM_MIPS];\
                uniform vec3 bloomTintColors[NUM_MIPS];\
                uniform vec2 resolution;\
				\
				float lerpBloomFactor(const in float factor) { \
					float mirrorFactor = 1.2 - factor;\
					return mix(factor, mirrorFactor, bloomRadius);\
				}\
				\
                void main() {\
                    vec2 uv = gl_FragCoord.xy / resolution.xy;\
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) + \
													 lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) + \
													 lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) + \
													 lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) + \
													 lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );\
				}"
		} );

    }

}