// import {h, Component} from 'preact'

import React, {Component} from 'react'

import ReactDOM from 'react-dom'

import LandingPageScroll from '../elements/scroll/landingPageScroll.js'

import ReactRevealText from 'react-reveal-text'

import Events from './events.js'

import { TweenLite } from 'gsap'

import eventEmitter from 'eventEmitter'

const emitter = eventEmitter.emitter

// import TransitionGroup from 'react-transition-group/TransitionGroup'

export default class LandingPage extends Component {

    constructor(props) {

        super(props)

        // console.log(Transition)

        this.state = {

            revealCopy: true,
            onLandingPage: true

        }

        this.copy = {
            
            title: 'DOUGLAS LILLIEQUIST',

            intro: '[ Junior Creative / Interactive Developer ]'

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

        const events = new Events(this)
        
    }


    transitionIn() {

        this.setState({onLandingPage: true})

    }

    transitionOut() {

        this.setState({onLandingPage: false})

    }

    componentWillLeave(callback) {

        TweenLite.killTweensOf(this)

        TweenLite.to(this, 0.15, {

            opacity: 0.0,

            // onStart: () => this.transitionOut(),

            onComplete: callback
        
        })

    }

    shouldComponentUpdate(newProps, newState) {

        if(this.state.onLandingPage !== newState.onLandingPage) {

            return true

        } else {

            return false

        }

    }

    componentDidUpdate(prevProps, prevState) {

        if(this.state.onLandingPage !== prevState.onLandingPage) {

            if(this.state.onLandingPage) {

                emitter.emit('reveal')

                TweenLite.to(this, 0.5, {

                    opacity: 1.0

                })

            } else {

                emitter.emit('hide')


                TweenLite.to(this, 0.5, {

                    opacity: 0.0

                })

            }

        }

    }

    // componentWillUnmount() {

    //     this.transitionOut()

    // }

    render() {

        return(
            
            <div className = "LandingPage" ref = {(container) => {this.container = container}}>

                {/* <LandingPageScroll /> */}
                            
                <div className = "Title">

                <h1><ReactRevealText show = {this.state.revealCopy} text = {this.copy.title}/></h1>
                </div>
                
                <div className = "Intro">

                <ReactRevealText show = {this.state.revealCopy} text = {this.copy.intro}/>
                
                </div>

                <div className = "CTA">

                <ReactRevealText show = {this.state.revealCopy} text = {'[ drag + hold ]'}/>

                </div>
                            
            </div>

        )

    }

}