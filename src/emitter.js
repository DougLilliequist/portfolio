import ee from 'event-emitter'

import {TweenMax} from 'gsap'

class EventEmitter {

    constructor() {

        this.initEmitter()

        this.initEvents()

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

        this.emitter.emit('scrolling', e)

    }

    onResize(e) {

        this.emitter.emit('resizing', e)

    }

}

const eventEmitter = new EventEmitter()

export default eventEmitter