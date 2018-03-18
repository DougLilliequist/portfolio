//disclaimer: this is a very duct tapey solution
//to have my raycaster register the mouse is over DOLI
//when he is in project mode...

import * as THREE from 'three'

import { config } from '../../config'

import eventEmitter from 'eventEmitter'
import { TweenLite } from 'gsap';

const emitter = eventEmitter.emitter


export default class Mesh extends THREE.Mesh {

    constructor() {

        let scalar = 5.75

        const w = (config.particleAmntX * 1.25) * scalar

        const h = (config.particleAmntY * 0.75) * scalar

        const geo = new THREE.PlaneBufferGeometry(w, h)

        const mat = new THREE.MeshBasicMaterial({

            color: 0xffffff,
            
            visible: false,
            
            side: THREE.DoubleSide

        })

        super(geo, mat)

        this.name = "projectQuad"

        this.hovered = false

        // this.initEvents()

    }

    // initEvents() {

    //     emitter.on('projectHovered', this.onHover.bind(this))

    // }

    get _position() {

        return this.position

    }

    set _position(v) {

        this.position.set(v.x, v.y, v.z)

    }

    // onHover(b) {

    //     TweenLite.killTweensOf(this.scale)

    //     TweenLite.to(this.scale, 0.5, {

    //         ease: Circ.easeInOut,

    //         y: b === true ? 0.6 : 1.0

    //     })

    // } 


}