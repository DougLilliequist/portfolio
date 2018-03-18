import ee from 'event-emitter'

import {TweenMax} from 'gsap'

import Hammer from 'hammerjs'

class EventEmitter {

    constructor() {

        this.initEmitter()

        this.initEvents()

        this.initInteractionManager()

    }

    initEmitter() {

        this.emitter = ee({})

    }

    initEvents() {

        TweenMax.ticker.addEventListener('tick', this.update.bind(this))

        window.addEventListener('mousedown', this.onMouseDown.bind(this), false)
        
        window.addEventListener('mouseup', this.onMouseUp.bind(this), false)
        
        window.addEventListener('mousemove', this.onMouseMove.bind(this), false)

        window.addEventListener('wheel', this.onScroll.bind(this), false)

        window.addEventListener('resize', this.onResize.bind(this))

    }

    initInteractionManager() {

        const interActionManager = new Hammer.Manager(document.body)

        interActionManager.options.domEvents = true

        const press = new Hammer.Press({

            time: 150

        })

        const pan = new Hammer.Pan({

            direction: Hammer.DIRECTION_ALL,
            threshold: 10

        })

        interActionManager.add(press)

        interActionManager.add(pan)

        interActionManager.on('press', (e) => {

            this.emitter.emit('press', e)

        })

        interActionManager.on('panstart', (e) => {

            this.emitter.emit('panStart', e)

        })

        interActionManager.on('panmove', (e) => {

            this.emitter.emit('panMove', e)

        })

        interActionManager.on('panend', (e) => {

            this.emitter.emit('panEnd', e)

        })

    }

    onMouseDown(e) {

        this.emitter.emit('mouseDown', e)

    }

    onMouseUp(e) {

        this.emitter.emit('mouseUp', e)

    }

    onMouseMove(e) {

        this.emitter.emit('mouseMove', e)

    }

    update() {

        this.emitter.emit('update')

    }

    onScroll(e) {

        // e.preventDefault()

        // e.stopPropagation()

        this.emitter.emit('scrolling', e)

    }

    onResize(e) {

        this.emitter.emit('resizing', e)

    }

}

const eventEmitter = new EventEmitter()

export default eventEmitter