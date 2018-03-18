import * as THREE from 'three'

import FBO from 'FBO'

import SimData from 'simData'

const glslify = require('glslify')

import renderer from 'renderer'

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

        // let shapeWidth = this.w

        // let shapeHeight = this.h
        
        let shapeWidth = this.w * 1.25

        let shapeHeight = this.h * 0.75
        

        // for (let z = 0; z < posAmnt; z++) {

        //     for (let y = 0; y < shapeHeight; y++) {

        //         for (let x = 0; x < shapeWidth; x++) {

        //             let i4 = iterator * 4

        //             shapeArray[i4 + 0] = (x % shapeWidth) * 5.0 * 1.0 - (shapeWidth * 5.0 * 0.5)

        //             shapeArray[i4 + 1] = (y % shapeWidth) * 5.0 * 1.0 - (shapeHeight * 5.0 * 0.5)

        //             shapeArray[i4 + 2] = 0

        //             shapeArray[i4 + 3] = Math.random()

        //             iterator++

        //         }

        //     }

        // }

        for(let x = 0; x < shapeWidth; x++) {

            for(let y = 0; y < shapeHeight; y++) {

                let i4 = iterator * 4
 
                shapeArray[i4 + 0] = (x % shapeWidth) * 5.75 - (shapeWidth * 5.75 * 0.5) //why the 5.75...?
                
                shapeArray[i4 + 1] = (y % shapeHeight) * 5.75 - (shapeHeight * 5.75 * 0.5)

                // shapeArray[i4 + 0] = -shapeWidth / 2 + (x * 5) + 0.5
                
                // shapeArray[i4 + 1] = -shapeHeight / 2 + (y * 5) + 0.5

                // shapeArray[i4 + 0] = (x * 1.25) * 5.75 - (shapeWidth * 5.75 * 0.5)
                
                // shapeArray[i4 + 1] = (y * 0.75) * 5.75 - (shapeHeight * 5.75 * 0.5)
                
                shapeArray[i4 + 2] = 0
                
                shapeArray[i4 + 3] = 0

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

                steer: {

                    type: 't',

                    value: null

                },

                shape: {

                    type: 't',

                    value: null

                },

                state: {

                    type: 't',

                    value: null

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

                    value: new THREE.Vector2(this.w || 1, this.h || 1)

                }

            },

            vertexShader: glslify('../shaders/renderQuad.glsl'),

            fragmentShader: glslify('../shaders/seek.glsl'),

            transparent: false,

            depthTest: false,

            depthWrite: false,

            blending: THREE.NoBlending

        })

        this.mat2 = this.mat.clone() //rename

        this.mat2.uniforms.offSet = {

            type: 'f',

            value: 0.0

        }

        this.mat2.fragmentShader = glslify('../shaders/projectMode.glsl') // why am I making a simulation for separation when I'm using it here...?

        this.initSim(renderer,this.seekTexture)

    }

    update(deltaTime, mousePos, delta, position, velocity, bool, scrollDirection) {

        let autoClearCol = renderer.autoClearColor

        let clearCol = renderer.getClearColor().getHex()

        let clearAlpha = renderer.getClearAlpha()

        renderer.autoClearColor = false

        let tmp = this.rtt

        this.rtt = this.rtt2

        this.rtt2 = tmp

        if (bool === true) {

            this.renderQuad.material = this.mat

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

        this.renderQuad.material.uniforms.steer.value = this.rtt2

        renderer.render(this.scene, this.cam, this.rtt, true)

        renderer.setClearColor(clearCol, clearAlpha)

        renderer.autoClearColor = autoClearCol

    }

}