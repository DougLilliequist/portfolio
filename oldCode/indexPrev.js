// //dolis body which is a particle mesh

// import * as THREE from 'three'

// import {
//     config
// } from '../config.js'

// const glslify = require('glslify')

// export default class Body extends THREE.Object3D {

//     constructor() {

//         super()

//         this.initGeo()

//         this.initMat()

//         this.initMesh()

//     }

//     initGeo() {

//         const amnt = config.particleAmntX * config.particleAmntY

//         const vertices = new Float32Array(amnt * 3)

//         for (let i = 0; i < amnt; i++) {

//             let i3 = i * 3

//             vertices[i3 + 0] = (i % config.particleAmntX) / config.particleAmntX
//             vertices[i3 + 1] = (i / config.particleAmntX) / config.particleAmntY

//         }

//         this.geo = new THREE.BufferGeometry()

//         this.geo.addAttribute('position', new THREE.BufferAttribute(vertices, 3))

//     }

//     initMat() {

//         this.img = new THREE.TextureLoader().load('./src/js/doli/body/testImg/test.jpeg')
        
//         this.img2 = new THREE.TextureLoader().load('./src/js/doli/body/testImg/test2.jpg')

//         this.mat = new THREE.ShaderMaterial({

//             uniforms: {

//                 _positions: {

//                     type: 't',
//                     value: null

//                 },

//                 tex: {

//                     type: 't',
//                     value: null

//                 },

//                 tex2: {

//                     type: 't',
//                     value: null

//                 },

//                 size: {

//                     type: 'f',

//                     // value: 1.5
//                     value: 5.0

//                 },

//                 resolution: {

//                     type: 'v2',
//                     value: new THREE.Vector2(1920, 1080)

//                 }

//             },

//             vertexShader: glslify('./shaders/vertexShader.glsl'),
//             fragmentShader: glslify('./shaders/fragmentShader.glsl'),
//             transparent: true,

//         })

//         this.mat.uniforms.tex.value = this.img
//         this.mat.uniforms.tex2.value = this.img2

//     }

//     initMesh() {

//         this.mesh = new THREE.Points(this.geo, this.mat)

//         this.add(this.mesh)

//     }

// }