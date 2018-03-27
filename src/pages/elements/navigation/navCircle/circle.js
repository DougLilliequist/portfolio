import React, {Component} from 'react'

import ReactDOM from 'react-dom'

import {TweenLite, Power4} from 'gsap'

import {map} from 'math'

import eventEmitter from 'eventEmitter'

const emitter = eventEmitter.emitter

export default class NavCircle extends Component {

    constructor(props) {

        super(props)

        this.props = props
        
        this.state = {

            clicked: false,

            focused: false,

            onProject: false,

            interacting: false

        }

        this.pos = { //rename to circle

            x: 0,

            y: 0,

        }

        this.target = {

            x: 0,

            y: 0,

            focusX: 0,

            focusY: 0

        }

        this.activeTime = null

        this.radius = 0

        this.ease = 0.25

        this.update = this.onUpdate.bind(this)

        // this.ease = 1.0
        
    }

    componentDidMount() {

        emitter.on('hintClick', this.onClickable.bind(this)) //rename

        // emitter.on('stick', this.onFocus.bind(this)) //rename

        // emitter.on('unStick', (b) => this.setState({focused: false}))

        // emitter.on('projectHovered', (b) => this.setState({onProject: b}))

        this.canvas = this.canvasEl

        this.ctx = this.canvas.getContext('2d')

        this.w = this.canvas.width = window.innerWidth

        this.h = this.canvas.height = window.innerHeight
        
        emitter.on('update', this.onUpdate.bind(this))
        
        emitter.on('resizing', this.onResize.bind(this))
        
        this.spawn()
    
    }

    onClickable(b) {

        TweenLite.to(this, 0.35, {

            ease: Power4.easeInOut,

            radius: b === true ? 20 : 15

        })

    }

    onUpdate() {

        this.draw()

        this.target.x = this.props.target.x

        this.target.y = this.props.target.y

        this.pos.x += (this.target.x - this.pos.x) * this.ease
        
        this.pos.y += (this.target.y - this.pos.y) * this.ease

        // if(Math.abs(this.pos.x) < 0.1 && Math.abs(this.pos.y) < 0.1) {

        //     console.log('too close')

        //     if(this.animate) this.animate.kill()

        //     return

        // } else {

        //     console.log(this.pos.x)

        //     this.animate = TweenLite.delayedCall(0.001, this.update)

        // }

    }

    spawn() {

        // this.pos.x = this.w * 0.3

        // this.pos.y = this.h * 0.8

        TweenLite.to(this, 2.5, {

            ease: Power4.easeInOut,

            radius: 15,

            // onStart: () => this.animate = TweenLite.delayedCall(0.001, this.update)

            // onComplete: () => {

            //     emitter.on('update', this.onUpdate.bind(this))

            // }

        })


    }

    draw() {

        this.ctx.clearRect(0, 0, this.w, this.h)
        
        this.ctx.beginPath()

        this.ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2, false)

        this.ctx.lineWidth = 0.5

        this.ctx.strokeStyle = '#000000'

        this.ctx.stroke()

    }

    onResize() {

        this.w = this.canvas.width = window.innerWidth
    
        this.h = this.canvas.height = window.innerHeight

    }

    // componentWillUnmount() {

    //     window.removeEventListener('resize', this.onResize.bind(this))

    //     emitter.off('update', this.onUpdate.bind(this))

    // }

    render() {

        return(

            <canvas className = "NavCircle" ref = {(el) => this.canvasEl = el}/>
            
        )

    }

}