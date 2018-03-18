import * as THREE from 'three'

import NavObj from './factory/index.js'

import {
    TweenLite
} from 'gsap'

import {
    threeDtoTwoD
} from '../utils/3dTo2d.js'

import map from 'math'

import eventEmitter from 'eventEmitter'

const emitter = eventEmitter.emitter

export default class NavObjs extends THREE.Object3D {

    constructor(amnt) {

        super()

        this.init()

        this.initEvents()

    }

    init() {

        // this.focused = false

        this.minDistance = 50

        this.maxDistance = 80

        this.objs = []

        this.objs[0] = new NavObj('doli', '004', new THREE.Vector3(256, 256, 256), new THREE.Vector3(-140, 90, 30))
        this.objs[1] = new NavObj('redCrossWebVR', '003', new THREE.Vector3(256, 256, 256), new THREE.Vector3(80, -110, -10))
        this.objs[2] = new NavObj('internshipProject', '002', new THREE.Vector3(256, 256, 256), new THREE.Vector3(240, 180, 3))
        this.objs[3] = new NavObj('hyperInstallation', '001', new THREE.Vector3(256, 256, 256), new THREE.Vector3(-270, -110, -20))

        this.objs.forEach((obj) => {

            obj.activated = false

            this.add(obj)

        })

        console.log(this.objs)

    }

    initEvents() {

        emitter.on('curious', this.onCurious.bind(this))

        emitter.on('viewSelected', this.onViewSelected.bind(this))

    }

    onCurious() {

        this.objs.forEach((obj) => {

            let offSet = Math.random()

            obj.activate(offSet)

        })

    }

    onViewSelected() {

        this.objs.forEach((obj) => {

            // obj._position = new THREE.Vector3(0.0, 0.0, 0.0)

            obj.deActivate()

        })

        emitter.emit('unStick')

    }

    update(animTime, w, h, target, camera, rayCaster) { //this args list is fucking akward...

        const interSects = rayCaster.intersectObjects(this.children, true)

        if (interSects.length > 0) {

            const intersect = interSects[0].object

            if (intersect.tag === 'navObj' && intersect.parent.activated) {

                this.targetObj = intersect.parent

                if (this.targetObj.focused === false) {

                    this.targetObj.focused = true

                    this.targetObj.expandCollapse()

                    const pos = threeDtoTwoD(w, h, this.targetObj.position, camera)

                    emitter.emit('viewTargeted', this.targetObj.name)

                    emitter.emit('stick', {

                        project: this.targetObj.project,
                        x: pos.x,
                        y: pos.y

                    })

                }

            }

        } else {

            if (this.targetObj) {

                if (this.targetObj.focused === true) {

                    this.targetObj.focused = false

                    this.targetObj.expandCollapse()

                    emitter.emit('viewTargeted', 'home')

                    emitter.emit('unStick')

                    this.targetObj = null

                }

            }

        }

        this.objs.forEach((obj) => {

            obj.animate(animTime)

        })


    }

}