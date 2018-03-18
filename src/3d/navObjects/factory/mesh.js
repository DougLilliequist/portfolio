import * as THREE from 'three'

import Geometry from './geometry.js'

import {map} from 'math'

const glslify = require('glslify')

export default class Mesh extends THREE.Mesh {

    constructor(col) {

        const geo = new Geometry()

        const mat = new THREE.RawShaderMaterial({

            uniforms: {

                colr: {

                    type: 'v3',
                    value: new THREE.Vector3(col.x / 256, col.y / 256, col.z / 256)

                },

                alpha: {

                    type: 'f',
                    value: 0.0

                },

                radiusScalar: {

                    type: 'f',

                    value: 1.0

                },

                direction: {

                    type: 'f',

                    value: 0

                },

                speed: {

                    type: 'f',

                    value: 1.0

                },

                animTime: {

                    type: 'f',
                    value: 0.0

                }

            },

            vertexShader: glslify('./shaders/vertexShader.glsl'),
            
            fragmentShader: glslify('./shaders/fragmentShader.glsl'),

            transparent: true

        })

        super(geo, mat)

        this.frustumCulled = false

        this.material.needsUpdate = true

        console.log(this)

    }

    set _alpha(val) {

        this.material.uniforms['alpha'].value = val

    }

    get _alpha() {

        return this.material.uniforms['alpha'].value

    }

}