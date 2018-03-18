// import * as THREE from 'three'

// import FBO from '../../utils/FBO/fbo.js'

// import renderer from '../../renderer.js'

// const glslify = require('glslify')

// export default class FlowField extends FBO {

//     constructor(width, height) {

//         super(width, height)

//         this.initFlowFieldVectors()

//         this.initRenderQuad()

//         this.initSim()

//     }

//     initFlowFieldVectors() {

//         const amnt = (this.w * this.h) * 4

//         const data = new Float32Array(amnt)

//         let iterator = 0

//         for (let x = 0; x < this.w; x++) {

//             for (let y = 0; y < this.h; y++) {

//                 let i4 = iterator * 4

//                 // data[i4 + 0] = Math.cos(Math.random() * -30 + 15)
//                 data[i4 + 0] = Math.cos(0)

//                 // data[i4 + 0] = x * 10 - (this.w * 0.5)

//                 // data[i4 + 1] = Math.sin(Math.random() * -30 + 15)
//                 data[i4 + 1] = Math.sin(0)
//                 // data[i4 + 1] = y * 10 - (this.h * 0.5)

//                 // data[i4 + 2] = 0
//                 data[i4 + 2] = Math.cos(Math.random() * -30 + 15)
                
//                 data[i4 + 3] = 0

//                 iterator++

//             }

//         }

//         this.flowField = new THREE.DataTexture(data, this.w, this.h, THREE.RGBAFormat, THREE.FloatType)

//         this.flowField.minFilter = THREE.NearestFilter

//         this.flowField.magFilter = THREE.NearestFilter

//         this.flowField.needsUpdate = true

//         this.flowField.generateMipmaps = false

//         this.flowField.flipY = false

//     }

//     initRenderQuad() {

//         this.geo = new THREE.PlaneBufferGeometry(2, 2)

//         this.mat = new THREE.ShaderMaterial({

//             uniforms: {

//                 flowField: {

//                     type: 't',
//                     value: null

//                 },

//                 animTime: {

//                     type: 'f',
//                     value: null

//                 },

//                 mousePos: {

//                     type: 'v3',
//                     value: new THREE.Vector3()

//                 },

//                 resolution: {

//                     type: 'v2',
//                     // value: new THREE.Vector2(this.w, this.h)
//                     value: new THREE.Vector2(window.innerWidth, window.innerHeight)

//                 },

//             },

//             vertexShader: glslify('../shaders/flowField/vertexShader.glsl'),

//             fragmentShader: glslify('../shaders/flowField/fragmentShader.glsl'),

//             transparent: true,

//             depthTest: false,

//             depthWrite: false,

//             blending: THREE.NoBlending

//         })

//         this.renderQuad = new THREE.Mesh(this.geo, this.initMat)

//         this.scene.add(this.renderQuad)

//     }

//     initSim() {

//         this.renderQuad.material.uniforms.tex.value = this.flowField

//         renderer.render(this.scene, this.cam, this.rtt, true)

//         this.renderQuad.material.uniforms.tex.value = this.rtt

//         renderer.render(this.scene, this.cam, this.rtt2, true)

//     }

//     update(time, mousePos) {

//         let tmp = this.rtt

//         this.rtt = this.rtt2

//         this.rtt2 = tmp

//         this.renderQuad.material = this.mat

//         this.renderQuad.material.uniforms.flowField.value = this.rtt2

//         this.renderQuad.material.uniforms.animTime.value += time

//         this.renderQuad.material.uniforms.mousePos.value.copy(mousePos)

//         renderer.render(this.scene, this.cam, this.rtt, true)

//     }

// }