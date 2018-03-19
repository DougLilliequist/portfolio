import React, {Component} from 'react'

import ReactDOM from 'react-dom'

import {TweenLite} from 'gsap'

import eventEmitter from 'eventEmitter'

const emitter = eventEmitter.emitter

// import {h, Component} from 'preact'

// import World3D from './3d/world3d.js'

import ViewLoader from './pages/viewLoader/index.js'

import ViewIndicator from './pages/elements/viewIndicator.js'

import Navigation from './pages/elements/navigation/navigation.js'

import NavLine from './pages/elements/navigation/navLine.js'

import Contact from './pages/elements/contact.1.js'

import Scroll from './pages/elements/scroll/scroll.js'

import {TransitionGroup} from 'react-transition-group'

import './styles/main.scss'
import './styles/landingPage.scss'
import './styles/projects.scss'
import './styles/components.scss'
import './styles/navigation.scss'
import './styles/world3d.scss'


export default class Main extends Component {

    constructor(props) {

        super(props)

    }

    componentDidMount() {

        // const world = new World3D()

        // ReactDOM.render(<World3D />, this.worldContainer)

    }

    render() {

        return(
       
        <div className = "Main" ref = "mainContainer">
            <Navigation ref = "nav" />
            <Contact />
            <ViewLoader ref = {(container) => {this.loader = container}} />
            {/* <div className = "WorldContainer" ref = {(container) => this.worldContainer = container}/> */}
        </div>
        
        )
    }

}