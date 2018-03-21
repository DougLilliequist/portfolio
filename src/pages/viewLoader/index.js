import React, {Component} from 'react'

import ReactDOM from 'react-dom'

import {TweenLite} from 'gsap'

import LandingPage from '../landingPage/index.js'

import Project from '../projects/index.js'

import ViewIndicator from '../elements/viewIndicator.js'

import {map} from 'math'

import eventEmitter from 'eventEmitter'

// import TransitionGroup from 'react-transition-group/TransitionGroup'

const emitter = eventEmitter.emitter

export default class ViewLoader extends Component {

    constructor(props) {

        super(props)

        this.state = {

            currentView: 'home',

            viewLoaded: true,

            currentTarget: null,

            index: 0,

            scrolling: false
            
        }

        this.pos = {}

        this.pos.x = 0

        this.pos.y = 0

        this.offSet = 0

        this.initEvents()

    }

    initEvents() {

        emitter.on('viewTargeted', (target) => {this.setState({currentTarget: target})})

        emitter.on('scrolling', this.onScroll.bind(this))

        emitter.on('update', this.onUpdate.bind(this))

    }

    componentDidUpdate() {

        // console.log(this.state.index)

    }

    componentDidMount() {

        // this.viewIndicator.updateText('home')

    }

    onScroll(e) {

        let scrollMax = ReactDOM.findDOMNode(this.currentView).getBoundingClientRect().height * 4.0

        this.offSet += e.deltaY

        if(this.offSet < 0) {
            
            this.offSet = 0.1

        } else if(this.offSet >= scrollMax) {

            this.offSet = scrollMax

        }

        emitter.emit('updateScrollBar', map(this.offSet, 0, scrollMax, 0, 100))

    }

    onUpdate() {

        this.pos.y += (this.offSet - this.pos.y) * Math.sin(0.3 * Math.PI) * 0.05

        this.container.style.transform = 'matrix(1.0, 0.0, 0.0, 1.0, ' + 0.0 + ', ' + -this.pos.y + ')'

        // this.offSet = Math.min(Math.max(this.offSet, 0), ReactDOM.findDOMNode(this.currentView).getBoundingClientRect().height * 4.0)
    
        // console.log(this.offSet)
    
    }

    render() {

        return(

            <div className = "Loader" ref = {(container) => this.container = container}>

                {/* <ViewIndicator ref = {(component) => {this.viewIndicator = component}} /> */}
                <LandingPage ref = {(view) => {this.currentView = view}} />
                <Project ref = {(view) => {this.currentView = view}} project = 'doli' />
                <Project ref = {(view) => {this.currentView = view}} project = 'redCrossWebVR' /> 
                <Project ref = {(view) => {this.currentView = view}} project = 'internshipProject' />
                <Project ref = {(view) => {this.currentView = view}} project = 'hyperInstallation' />
            
            </div>

        )

    }

}