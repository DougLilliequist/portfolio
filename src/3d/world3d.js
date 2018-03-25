// import {h, Component} from 'preact'

import React, {
    Component
} from 'react'

import ReactDOM from 'react-dom'

// import className from 'classnames'

import * as THREE from 'three'

import DOLI from './doli/index.js'

import RenderTarget from 'renderTarget'

import renderer from 'renderer'

import Post from './postProcessing/index.js' //rename

import eventEmitter from 'eventEmitter'

const emitter = eventEmitter.emitter

import {
    TweenLite
} from 'gsap'

import {
    threeDtoTwoD
} from './utils/3dTo2d.js'

export default class World3D extends Component {

    constructor(props) {

        super(props)

        this.props = props

    }

    componentDidMount() {

        this.init()

        this.initScene()

        this.initPost()

        this.initDoli()

        // this.initNavOrbs()

        this.initEvents()

    }

    init() {

        this.w = window.innerWidth

        this.h = window.innerHeight

        this.time = new THREE.Clock()

        this.deltaTime = 0

        this.mouse = {}

        this.mouse.position = new THREE.Vector2(0.0, 0.0)

        this.mouse.prevPos = new THREE.Vector3(0.0, 0.0, 0.0)

        this.mouse.worldPos = new THREE.Vector3(0.0, 0.0, 0.0)

        this.mouse.screenPos = new THREE.Vector2(0.0, 0.0)

        this.currentTarget = null

        this.previousTarget = null

        this.ray = new THREE.Ray()

        this.rayDistScalar = 1.0

        this.rayCaster = new THREE.Raycaster()

        this.delta = 0

    }

    initScene() {

        this.scene = new THREE.Scene()

        this.scene.fog = new THREE.FogExp2(0xefd1b5, 0.0025)

        const rad = Math.PI / 180

        const fov = 65 * rad

        // this.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, .1, 10000)
        
        this.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, .1, 10000)

        this.camera.position.set(0, 0, 850)

        // this.camera.lookAt(this.scene)

        this.rtt = new RenderTarget(window.innerWidth, window.innerHeight)

        this.renderer = renderer

        this.container.appendChild(this.renderer.domElement)
        // document.body.appendChild(this.renderer.domElement)

    }

    initPost() {

        this.post = new Post(window.innerWidth, window.innerHeight)

        this.post.initPasses(window.innerWidth, window.innerHeight)

    }

    initDoli() {

        this.doli = new DOLI()

        this.scene.add(this.doli)

    }

    initNavOrbs() {

        this.navObjs = new NavObjs()

        this.scene.add(this.navObjs)

    }

    initEvents() {

        // this.focusing = false

        emitter.on('mouseMove', this.onMouseMove.bind(this))

        emitter.on('resizing', this.onResize.bind(this))

        emitter.on('update', this.animate.bind(this))

    }

    onMouseMove(e) {

        this.mouse.position.x = (e.clientX / window.innerWidth) * 2 - 1

        this.mouse.position.y = ((e.clientY / window.innerHeight) * -1) * 2 + 1

    }

    updateMouseWorldPos() {

        this.camera.updateMatrixWorld()

        this.ray.origin.setFromMatrixPosition(this.camera.matrixWorld)

        this.ray.direction.set(this.mouse.position.x, this.mouse.position.y, 0.5).unproject(this.camera).sub(this.ray.origin).normalize()

        let dist = this.ray.origin.length() / Math.cos(Math.PI - this.ray.direction.angleTo(this.ray.origin))

        this.ray.origin.add(this.ray.direction.multiplyScalar(dist * this.rayDistScalar))

        this.mouse.worldPos.copy(this.ray.origin)

    }

    animate() {

        //add a function that checks the distance between the mouse and all navorbs
        //if the distance is x, call stick and make the circle seek towards orb

        this.deltaTime = this.time.getDelta()

        this.updateMouseWorldPos()

        this.rayCaster.setFromCamera(this.mouse.position, this.camera)

        this.doli.animate(this.deltaTime, this.mouse.worldPos)

        // this.navObjs.update(this.deltaTime, this.w, this.h, this.mouse.worldPos, this.camera, this.rayCaster)

        this.renderer.render(this.scene, this.camera)

        // this.renderer.render(this.scene, this.camera, this.rtt, true)

        // this.post.render({scene: this.scene, camera: this.camera})

    }

    onMouseMove(e) {

        this.mouse.position.x = (e.clientX / window.innerWidth) * 2 - 1

        this.mouse.position.y = ((e.clientY / window.innerHeight) * -1) * 2 + 1

    }

    onResize() {

        this.renderer.setSize(window.innerWidth, window.innerHeight)

        this.camera.aspect = window.innerWidth / window.innerHeight

        this.camera.updateProjectionMatrix()

    }

    render() {

        return(
        
            <div className='World3D' ref = {(world) => {this.container = world}}></div>
        
        )

    }

}