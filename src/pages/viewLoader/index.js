import React, {Component} from 'react'

import ReactDOM from 'react-dom'

import {TweenLite} from 'gsap'

import LandingPage from '../landingPage/index.js'

import Project from '../projects/index.js'

import {map} from 'math'

import eventEmitter from 'eventEmitter'

const emitter = eventEmitter.emitter

export default class ViewLoader extends Component {

    constructor(props) {

        super(props)

        this.state = {

            currentView: 'home',
            
        }

        this.pos = {}

        this.pos.x = 0

        this.pos.y = 0

        this.offSet = 0

        this.counter = 0

        this.counterLimit = 0.1

        this.animSpeed = 0.001

        this.ease = 0.05

        this.update = this.onUpdate.bind(this)

    }

    componentDidMount() {

        this.initEvents()

        this.scrollMax = ReactDOM.findDOMNode(this.currentView).getBoundingClientRect().height * 4.0

    }

    initEvents() {

        emitter.on('viewTargeted', (target) => {this.setState({currentTarget: target})})

        emitter.on('scrolling', this.onScroll.bind(this))

        emitter.on('resizing', this.onResize.bind(this))

    }

    onScroll(e) {

        this.counter = 0

        this.offSet += e.deltaY

        emitter.emit('updateScrollBar', map(this.offSet, 0, this.scrollMax, 0, window.innerHeight))

        if(this.animate) {

            this.animate.kill()

        }

        this.animate = TweenLite.delayedCall(this.animSpeed, this.update)

    }

    onUpdate() {

            this.counter += 0.001

            this.pos.y += (this.offSet - this.pos.y) * Math.sin(0.5 * Math.PI) * this.ease

            if(this.pos.y / window.innerHeight > 0.1) {

                emitter.emit('hideScroll', true)

            } else {

                emitter.emit('hideScroll', false)

            }
            
            this.container.style.MozTransform = 'matrix(1.0, 0.0, 0.0, 1.0, 0.0 , ' + -this.pos.y + ')'
            this.container.style.webkitTransform = 'matrix(1.0, 0.0, 0.0, 1.0, 0.0 , ' + -this.pos.y + ')'
            this.container.style.transform = 'matrix(1.0, 0.0, 0.0, 1.0, 0.0 , ' + -this.pos.y + ')'
            
            // this.container.style.transform = 'translate3d(0.0px, ' + -this.pos.y + 'px' + ', 0.0px)'
    
            if(this.offSet < 0) {
                
                this.offSet = 0.1
    
            } else if(this.offSet >= this.scrollMax) {
    
                this.offSet = this.scrollMax
    
            }

            if(this.counter > this.counterLimit) {

                this.counter = this.counterLimit

                return

            } else {

                this.animate = TweenLite.delayedCall(this.animSpeed, this.update) 

            }
    
    }

    onResize() {

        this.counter = 0

        this.scrollMax = ReactDOM.findDOMNode(this.currentView).getBoundingClientRect().height * 4.0

        emitter.emit('updateScrollBar', map(this.offSet, 0, this.scrollMax, 0, window.innerHeight))

        if(this.animate) {

            this.animate.kill()

        }

        this.animte = TweenLite.delayedCall(0.001, this.update)

    }

    render() {

        return(

            <div className = "Loader" ref = {(container) => this.container = container}>

                <LandingPage ref = {(view) => {this.currentView = view}} />
                <Project ref = {(view) => {this.currentView = view}} project = 'needaHand' />
                <Project ref = {(view) => {this.currentView = view}} project = 'doli' />
                <Project ref = {(view) => {this.currentView = view}} project = 'internshipProject' />
                <Project ref = {(view) => {this.currentView = view}} project = 'hyperInstallation' />
            
            </div>

        )

    }

}