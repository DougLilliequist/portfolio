// import * as THREE from 'three'

// import { TweenLite } from 'gsap';

// import {map} from 'math'

// const glslify = require('glslify')

// export default class NavOrb extends THREE.Mesh {

//     constructor(name, projNumb, col, pos) {

//         const geo = new THREE.SphereBufferGeometry(15, 80, 80)

//         const mat = new THREE.ShaderMaterial({

//             uniforms: {

//                 col: {

//                     type: 'v3',
//                     value: new THREE.Vector3(col.x / 256, col.y / 256, col.z / 256)

//                 },

//                 alpha: {

//                     type: 'f',
//                     value: 0.0

//                 },

//                 location: {

//                     type: 'v3',
//                     value: new THREE.Vector3(0.0, 0.0, 0.0)

//                 },

//                 direction: {

//                     type: 'f',

//                     value: 0

//                 },

//                 speed: {

//                     type: 'f',

//                     value: 0

//                 },

//                 animTime: {

//                     type: 'f',
//                     value: 0.0

//                 }

//             },

//             vertexShader: glslify('./shaders/vertexShader.glsl'),
            
//             fragmentShader: glslify('./shaders/fragmentShader.glsl'),

//             transparent: true

//         })

//         super(geo, mat)

//         this.tag = 'navOrb'

//         this.name = name

//         this.project = projNumb

//         this.activated = true

//         this.focused = false

//         this.timeOffset = 0

//         this.dt = 0

//         // this.initAnimProps(pos)

//     }

//     initAnimProps(pos) {

//         this.tooClose = false

//         this.tooFar = false

//         this.m = 0

//         this.minDist = 10

//         this.maxDist = 30

//         this.origin = pos.clone()

//         this.acc = new THREE.Vector3(0, 0, 0)

//         this.vel = new THREE.Vector3(0, 0, 0)

//         this.currentVel = new THREE.Vector3(0, 0, 0)

//         this.currentPos = new THREE.Vector3(0, 0, 0)


//     }

//     set _position(v) {

//         this.position.set(v.x, v.y, v.z)

//     }

//     get _position() {

//         return new THREE.Vector3(this.position.x, this.position.y, this.position.z)

//     }

//     set _scale(val) {

//         this.scale.set(val, val, val)

//     }

//     get _scale() {

//         return this.scale.x
//         // return new THREE.Vector3(this.scale.x, this.scale.y, this.scale.z)

//     }

//     set _alpha(val) {

//         this.material.uniforms['alpha'].value = val

//     }

//     get _alpha() {

//         return this.material.uniforms['alpha'].value

//     }

//     activate(offSet) {

//         TweenLite.killTweensOf(this)

//         this._scale = 0.001

//         this._alpha = 0.001

//         // this.r = (0.5 + Math.random() * 0.5) * 225

//         // this.phi = (Math.random() - 0.5) * Math.PI

//         // this.theta = Math.random() * 2.0 * Math.PI

//         // this.position.set(

//         //     Math.cos(this.phi) * Math.cos(this.theta) * this.r,
//         //     Math.sin(this.phi) * this.r,
//         //     Math.sin(this.phi) * Math.cos(this.theta) * 0

//         // )

//         this.timeOffset = Math.random()

//         this.material.uniforms['location'].value = this.position.clone()

//         this.material.uniforms['speed'].value = 0.5 + Math.random()

//         this.material.uniforms['direction'].value = map(Math.round(Math.random()), 0, 1, -1, 1) //try the 'better random' method

//         TweenLite.to(this, 0.5, {

//             ease: Power2.easeOut,

//             delay: offSet,
            
//             _scale: 0.75,
            
//             _alpha: 0.75,

//             onComplete: () => {

//                 this.activated = true

//             }

//         })

//     }

//     deActivate() {

//         TweenLite.killTweensOf(this)

//         this.timeOffset = 0

//         this.material.uniforms['location'].value = new THREE.Vector3(0.0 ,0.0, 0.0)


//         TweenLite.to(this, 0.5, {

//             ease: Power2.easeOut,
            
//             _scale: 0.001,
            
//             _alpha: 0.001,

//             onComplete: () => {

//                 this.activated = false

//             }

//         })

//     }

//     animate(animTime) {

//         this.material.uniforms['animTime'].value += (this.focused) ? 0 : animTime

//     }


// }