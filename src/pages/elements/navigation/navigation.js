import React, {Component} from 'react'

import ReactDOM from 'react-dom'

import {TweenLite} from 'gsap'

import NavCircle from './navCircle/circle.js'

import ScrollBar from './scrollBar.js'

import eventEmitter from 'eventEmitter'

const emitter = eventEmitter.emitter

export default class Navigation extends Component {

    constructor(props) {

        super(props)

        this.props = props

        this.state = {
            
            interacting: false

        }

        this.mouse = {

            x: 0,

            y: 0

        }

    }

    componentDidMount() {

        this.initEvents()

        this.activeTime = 0

    }

    initEvents() {
   
        emitter.on('mouseMove', this.onMouseMove.bind(this))
        
    }

    onMouseMove(e) {

        this.setState({interacting: true}, () => {

            this.activeTime = 0

            this.mouse.x = e.clientX

            this.mouse.y = e.clientY            

        })

        emitter.emit('updateCursor')

    }

    onUpdate() {

        this.activeTime += (this.activeTime > 0.1) ? 0.0 : 0.0035

        if(this.state.interacting === true && this.activeTime > 0.1) {

            this.setState({interacting: false})

        }

    }

    shouldComponentUpdate(newProps, newState) {

        const activityChange = this.state.interacting !== newState.interacting

        return activityChange

    }

    render() {

        return (

            <div className = "Navigation">

                <NavCircle ref = {(el) => {this.navCircle = el}} target = {this.mouse} active = {this.state.interacting}/>

                <ScrollBar />
                
            </div>
   
        )

    }

}