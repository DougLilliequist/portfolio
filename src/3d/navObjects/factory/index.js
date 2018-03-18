import * as THREE from 'three'

import Mesh from './mesh.js'

import {map} from 'math'

import eventEmitter from 'eventEmitter'

const emitter = eventEmitter.emitter

export default class NavObj extends THREE.Object3D {

    constructor(name, projNumb, col, pos) {

        super()

        this.init(name, projNumb, col, pos)

        this.initSphere()

        this.initMesh()

    }

    init(name, projNumb, col, pos) {

        this.name = name

        this.project = projNumb

        this.position.copy(pos)

        this.col = col

        this.activated = false

        this.focused = false

        this.frustumCulled = false

    }

    initSphere(name, projNumb) {

        const geo = new THREE.SphereBufferGeometry(30, 80, 80)

        const mat = new THREE.MeshBasicMaterial({

            color: 0xffffff,
            // transparent: true,
            // opacity: 0.5,
            visible: false

        })

        this.collider = new THREE.Mesh(geo, mat)

        this.collider.tag = 'navObj'

        this.add(this.collider)

    }

    initMesh() {

        this.mesh = new Mesh(this.col)

        this.add(this.mesh)

    }

    activate(offSet) {

        TweenLite.killTweensOf(this)

        TweenLite.killTweensOf(this.mesh)

        this.scale.multiplyScalar(0.001)

        this.mesh._alpha = 0

        this.direction = map(Math.round(Math.random()), 0.0, 1.0, -1.0, 1.0)

        TweenLite.to(this.scale, 0.5, {

            ease: Power2.easeOut,

            // delay: offSet,

            x: 1.0,

            y: 1.0,

            z: 1.0,

            onStart: () => {

                TweenLite.to(this.mesh, 0.25, {

                    ease: Power2.easeOut,

                    _alpha: 1.0

                })

            },

            onComplete: () => {

                this.activated = true

            }

        })

    }

    deActivate() {

        TweenLite.killTweensOf(this)

        TweenLite.killTweensOf(this.mesh)

        this.timeOffset = 0

        TweenLite.to(this.scale, 0.5, {

            ease: Power2.easeOut,

            // delay: offSet,

            x: 0.001,

            y: 0.001,

            z: 0.001,

            onStart: () => {

                TweenLite.to(this.mesh, 0.25, {

                    ease: Power2.easeOut,

                    _alpha: 0.0

                })

            },

            onComplete: () => {

                //set it so that the entire navObj is not visible when not activated

                this.activated = false

            }

        })

    }

    expandCollapse() {

        const radiusScalar = this.mesh.material.uniforms['radiusScalar']

        TweenLite.to(radiusScalar, 0.35, {

            ease: Circ.easeInOut,

            value: this.focused === true? 50.0 : 0.0

        })

    }

    animate(animTime) {

        // this.material.uniforms['animTime'].value += (this.focused) ? 0 : animTime

        this.mesh.material.uniforms['animTime'].value += animTime

    }

}