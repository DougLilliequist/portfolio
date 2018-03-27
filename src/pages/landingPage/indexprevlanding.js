import React, {Component} from 'react'

import ReactDOM from 'react-dom'

import LandingPageScroll from './landingPageScroll.js'

import Events from './events.js'

import { TweenLite } from 'gsap'

import GlitchText from '../elements/glitchText.js'

import World3D from '../../3d/world3d.js'

import eventEmitter from 'eventEmitter'

const emitter = eventEmitter.emitter

export default class LandingPage extends Component {

    constructor(props) {

        super(props)

        this.state = {

            revealCopy: false,
            onLandingPage: true

        }

        this.copy = {
            
            // title: '[ My name is Douglas Lilliequist, \n ' +
            // 'and I\'m a junior creative developer and an Hyper Island alumni who likes to make interactive and beautiful experiences ]',
            title: 'DOUGLAS LILLIEQUIST',

            intro: '[ Junior Creative Developer / Hyper Island alumni]'

        }

    }

    componentDidMount() {

        const world = new World3D()

        ReactDOM.render(<World3D />, this.worldContainer)

        this.setState({revealCopy: true})
        
    }

    render() {

        return(
            
            <div className = "LandingPage" ref = {(container) => {this.container = container}}>

                <LandingPageScroll delay = {2.2}/>
                            
                <div className = "Title">

                <h1><GlitchText text = {this.copy.title} glitch = {this.state.revealCopy} delay = {1.5} speed = {0.01 / (this.copy.title.length * 0.1)} /></h1>

                </div>
                
                <div className = "Intro">

                <GlitchText text = {this.copy.intro} glitch = {this.state.revealCopy} delay = {1.8} speed = {0.01 / (this.copy.intro.length * 1.5)}/>
                
                </div>

                    <div className = "WorldContainer" ref = {(container) => this.worldContainer = container}/>
                            
            </div>

        )

    }

}