import * as THREE from 'three'

import FBO from '../../utils/FBO/fbo.js'

import SimData from '../../utils/simdata.js'

const glslify = require('glslify')

import renderer from '../../renderer.js'

import {
    config
} from '../config';

export default class Seek extends FBO {

    constructor(width, height) {

        super(width, height)

        this.initSeekData()

        this.initPathDrawing()

        this.initPortfolioMode()

        this.init()

    }

    initSeekData() {

        const amnt = (this.w * this.h) * 4

        const seekData = new Float32Array(amnt)

        for (let i = 0; i < seekData.length; i++) {

            let i4 = i * 4

            seekData[i4 + 0] = 0

            seekData[i4 + 1] = 0

            seekData[i4 + 2] = 0

            seekData[i4 + 3] = (Math.random() * 20.5) + 0.5

        }

        this.seekTexture = new SimData(seekData, this.w, this.h)

    }

    initPathDrawing() {

        const length = 90

        this.path = {}

        this.path.vertices = new Float32Array(length * 3)

        this.path.radius = 3.0 * 2.0

        for (let i in this.path.vertices) {

            this.path.vertices[i] = 0

        }

    }

    initPortfolioMode() { //rename

        const posAmnt = (this.w * this.h) * 4

        const shapeArray = new Float32Array(posAmnt)

        let iterator = 0

        let shapeWidth = this.w * 1.25

        let shapeHeight = this.h * 0.75

        for (let x = 0; x < this.w; x++) {

            for (let y = 0; y < this.h; y++) {

                let i4 = iterator * 4

                shapeArray[i4 + 0] = ((x * 1.25) * 5.0 - (shapeWidth * 0.5 * 5.0))

                shapeArray[i4 + 1] = ((y * 0.75) * 5.0 - (shapeHeight * 0.5 * 5.0))

                shapeArray[i4 + 2] = 0

                shapeArray[i4 + 3] = Math.random() * 10

                iterator++

            }

        }

        this.portfolioTexture = new SimData(shapeArray, this.w, this.h)

    }

    init() {

        this.mat = new THREE.ShaderMaterial({

            uniforms: {

                positions: {

                    type: 't',

                    value: null

                },

                velocity: {

                    type: 't',

                    value: null

                },

                predictVelocity: {

                    type: 't',
                    value: null

                },

                steer: {

                    type: 't',

                    value: null

                },

                shape: {

                    type: 't',
                    value: null

                },

                pointA: {

                    type: 'v3',
                    value: new THREE.Vector3(-50, 0, 0)

                },

                pointB: {

                    type: 'v3',
                    value: new THREE.Vector3(50, 0, 0)

                },

                path: {

                    type: 'fv',
                    value: this.path.vertices

                },

                delta: {

                    type: 'f',
                    value: 0.0

                },

                mousePos: {

                    type: 'v3',

                    value: new THREE.Vector3(0.0, 0.0, 0.0)

                },

                radius: {

                    type: 'f',

                    value: 5 * 2

                },

                maxForce: {

                    type: 'f',
                    value: 0.8

                },

                maxSpeed: {

                    type: 'f',

                    value: 15.0

                },

                scrollDirection: {

                    type: 'f',
                    value: 0.0

                },

                mode: {

                    type: 'b',
                    value: null

                },

                animTime: {

                    type: 'f',
                    value: 0.0

                },

                resolution: {

                    type: 'v2',

                    value: new THREE.Vector2(config.particleAmntX, config.particleAmntY)

                }

            },

            vertexShader: glslify('../shaders/renderQuad.glsl'),

            fragmentShader: glslify('../shaders/seek.glsl'),

            transparent: true,

            depthTest: false,

            depthWrite: false,

            blending: THREE.NoBlending

        })

        this.mat2 = this.mat.clone() //rename

        this.mat2.uniforms.offSet = {

            type: 'f',

            value: 0.0

        }

        this.mat2.fragmentShader = glslify('../shaders/projectMode.glsl')

        this.initSim(this.seekTexture)

    }

    update(deltaTime, mousePos, delta, position, velocity, /*flow,*/ bool, scrollDirection) {

        let tmp = this.rtt

        this.rtt = this.rtt2

        this.rtt2 = tmp

        if (bool === true) {

            this.renderQuad.material = this.mat

            this.drawPath(mousePos)

        } else {

            this.renderQuad.material = this.mat2

            this.renderQuad.material.uniforms.scrollDirection.value = scrollDirection

            this.renderQuad.material.uniforms.delta.value = delta

            this.renderQuad.material.uniforms.shape.value = this.portfolioTexture

        }

        this.renderQuad.material.uniforms.mousePos.value.copy(mousePos)

        this.renderQuad.material.uniforms.animTime.value += deltaTime

        this.renderQuad.material.uniforms.positions.value = position

        this.renderQuad.material.uniforms.velocity.value = velocity

        this.renderQuad.material.uniforms.predictVelocity.value = velocity.clone()

        this.renderQuad.material.uniforms.steer.value = this.rtt2

        renderer.render(this.scene, this.cam, this.rtt, true)

    }

    drawPath(pos) {

        for (let i = 0; i < this.path.vertices.length - 1;) {

            let i3 = i * 3

            this.path.vertices[i3 + 0] = this.path.vertices[i3 + 3]

            this.path.vertices[i3 + 1] = this.path.vertices[i3 + 4]

            this.path.vertices[i3 + 2] = this.path.vertices[i3 + 5]

            i++

        }

        const len = this.path.vertices.length

        let loc = pos.clone()

        this.path.vertices[len - 3] = loc.x

        this.path.vertices[len - 2] = loc.y

        this.path.vertices[len - 1] = loc.z

    }

}