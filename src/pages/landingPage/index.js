// import {h, Component} from 'preact'

import React, {Component} from 'react'

import ReactDOM from 'react-dom'

import LandingPageScroll from '../elements/scroll/landingPageScroll.js'

import ReactRevealText from 'react-reveal-text'

import Events from './events.js'

import { TweenLite } from 'gsap'

import GlitchText from '../elements/glitchText.js'

import World3D from '../../3d/world3d.js'

import eventEmitter from 'eventEmitter'

const emitter = eventEmitter.emitter

// import TransitionGroup from 'react-transition-group/TransitionGroup'

export default class LandingPage extends Component {

    constructor(props) {

        super(props)

        // console.log(Transition)

        this.state = {

            revealCopy: false,
            onLandingPage: true

        }

        this.copy = {
            
            title: 'DOUGLAS LILLIEQUIST',

            intro: '[ Junior Creative Developer / Hyper Island alumni]'

        }

    }

    // componentWillEnter(callback) {

    //     TweenLite.killTweensOf(this)

    //     TweenLite.to(this, 0.15, {

    //         onStart: () => this.transitionIn(),

    //         onComplete: callback

    //     })

    // }

    // componentDidEnter() {

    //     this.transitionIn()

    // }

    componentDidMount() {

        const world = new World3D()

        ReactDOM.render(<World3D />, this.worldContainer)

        this.setState({revealCopy: true})

        // const events = new Events(this)
        
    }


    // transitionIn() {

    //     this.setState({onLandingPage: true})

    // }

    // transitionOut() {

    //     this.setState({onLandingPage: false})

    // }

    // componentWillLeave(callback) {

    //     TweenLite.killTweensOf(this)

    //     TweenLite.to(this, 0.15, {

    //         opacity: 0.0,

    //         // onStart: () => this.transitionOut(),

    //         onComplete: callback
        
    //     })

    // }

    // shouldComponentUpdate(newProps, newState) {

    //     if(this.state.onLandingPage !== newState.onLandingPage) {

    //         return true

    //     } else {

    //         return false

    //     }

    // }

    // componentDidUpdate(prevProps, prevState) {

    //     if(this.state.onLandingPage !== prevState.onLandingPage) {

    //         if(this.state.onLandingPage) {

    //             emitter.emit('reveal')

    //             TweenLite.to(this, 0.5, {

    //                 opacity: 1.0

    //             })

    //         } else {

    //             emitter.emit('hide')


    //             TweenLite.to(this, 0.5, {

    //                 opacity: 0.0

    //             })

    //         }

    //     }

    // }

    // componentWillUnmount() {

    //     this.transitionOut()

    // }

    render() {

        return(
            
            <div className = "LandingPage" ref = {(container) => {this.container = container}}>

                <LandingPageScroll />
                            
                <div className = "Title">

                <h1><GlitchText text = {this.copy.title} glitch = {this.state.revealCopy} delay = {0.5} speed = {0.01 / (this.copy.title.length * 0.1)} /></h1>

                {/* <h1><ReactRevealText show = {this.state.revealCopy} text = {this.copy.title}/></h1>*/}
                </div>
                
                <div className = "Intro">

                <GlitchText text = {this.copy.intro} glitch = {this.state.revealCopy} delay = {0.8} speed = {0.01 / (this.copy.intro.length * 0.1)}/>

                {/* <ReactRevealText show = {this.state.revealCopy} text = {this.copy.intro}/> */}
                
                </div>

                    <div className = "WorldContainer" ref = {(container) => this.worldContainer = container}/>
                            
            </div>

        )

    }

}