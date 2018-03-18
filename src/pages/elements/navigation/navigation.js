import React, {Component} from 'react'

import ReactDOM from 'react-dom'

import {TweenLite} from 'gsap'

import NavCircle from './navCircle/circle.js'

import CuriousNavigation from './curiousNav.js'

import ExitPrompt from './navCircle/exitPrompt.js'

import eventEmitter from 'eventEmitter'

const emitter = eventEmitter.emitter

export default class Navigation extends Component {

    constructor(props) {

        super(props)

        this.props = props

        this.state = {

            curious: false, //rename and not recognizing state...?
            
            interacting: false

        }

        this.mouse = {

            x: 0,

            y: 0

        }

        this.cursorSize = {

            x: 0,

            y: 0

        }

        this.offSet = {

            x: 0,

            y: 0

        }

    }

    componentDidMount() {

        this.initEvents()

        this.cursorSize.x = ReactDOM.findDOMNode(this.navCircle.container).getBoundingClientRect().width

        this.cursorSize.y = ReactDOM.findDOMNode(this.navCircle.container).getBoundingClientRect().height

        this.offSet.x = this.cursorSize.x * 0.5
        
        this.offSet.y = this.cursorSize.y * 0.5

        this.activeTime = 0

    }

    initEvents() {

        
        emitter.on('mouseMove', this.onMouseMove.bind(this))

        // emitter.on('mouseDown', this.onMouseDown.bind(this))
        
        // emitter.on('press', this.onPress.bind(this))
        
        emitter.on('panStart', this.onPress.bind(this))
    
        // emitter.on('panEnd', this.onMouseUp.bind(this))
        
        emitter.on('mouseUp', this.onMouseUp.bind(this))

        emitter.on('update', this.onUpdate.bind(this))

        // emitter.on('pan')

    }

    onPress(e) {

        if(this.navCircle.state.onProject === false) {

        this.setState({curious: true}, () => {

            this.navCircle.animate(this.state.curious)

            emitter.emit('morphDOLI', 'curious')

            emitter.emit('curious', e)

        })

        } else {

            return

        }

    }

    onMouseDown() {

        this.navCircle.animate(this.state.curious)

    }

    onMouseMove(e) {

        this.setState({interacting: true}, () => {

            this.activeTime = 0

            this.mouse.x = e.clientX

            this.mouse.y = e.clientY            

        })

    }

    onMouseUp(e) {

        if(this.state.curious) {

        this.setState({curious: false}, () => {

            this.navCircle.animate(this.state.curious)
            
            emitter.emit('viewSelected')
    
        })

    }

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

    // componentDidUpdate(newProp, newState) {


    // }

    render() {

        return (

            <div className = "Navigation">

                <NavCircle ref = {(el) => {this.navCircle = el}} target = {this.mouse} active = {this.state.interacting}/>

                <ExitPrompt />
                
                <CuriousNavigation ref = {(el) => {this.curiousNav = el}} target = {this.mouse} size = {{x: this.cursorSize.x * 2, y: this.cursorSize.y * 2.0}} offSet = {this.offSet}/>

            </div>
   
        )

    }

}