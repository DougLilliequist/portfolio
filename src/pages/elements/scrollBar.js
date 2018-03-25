import React, {Component} from 'react'

import ReactDOM from 'react-dom'

import {TweenLite} from 'gsap'

import eventEmitter from 'eventEmitter'

const emitter = eventEmitter.emitter

export default class ScrollBar extends Component {

    constructor(props) {

        super(props)

        this.len = 0

        this.target = 0

        this.counter = 0

        this.countLimit = 1

        this.update = this.update.bind(this)

    }

    componentDidMount() {

        this.canvas = this.canvasEl

        this.ctx = this.canvasEl.getContext('2d')

        this.w = this.canvas.width = 5
        
        this.h = this.canvas.height = window.innerHeight

        this.initEvents()

    }

    initEvents() {
        
        emitter.on('updateScrollBar', this.updateEl.bind(this))
        
        emitter.on('resizing', this.onResize.bind(this))

    }

    updateEl(v) {

        this.counter = 0

        this.len = v

        if(this.animate) {

            this.animate.kill()

        }

        this.animate = TweenLite.delayedCall(0.001, this.update)

    }

    update() {

        this.counter += 0.01

        this.target += (this.len - this.target) * 0.05

        if(this.target <= 0) {

            this.target = 0.1

        }

        this.draw()

        if(this.counter > this.countLimit) {

                this.counter = this.countLimit

            return

        } else {
    
            this.animate = TweenLite.delayedCall(0.001, this.update)

        }
        
    }
    
    draw() {

        this.ctx.clearRect(0, 0, this.w, this.h)

        this.ctx.beginPath()

        this.ctx.lineWidth = 20

        this.ctx.strokeStyle = '#000000'

        this.ctx.moveTo(0, 0)

        this.ctx.lineTo(0, this.target)

        this.ctx.stroke()

    }

    onResize() {

        this.w = this.canvas.width = 5

        this.h = this.canvas.height = window.innerHeight

    }

    render() {

        return(

            <canvas className = 'ScrollBar' ref = {(el) => this.canvasEl = el}/>

        )

    }

}