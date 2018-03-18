// import {h, Component} from 'preact'

import React, {Component} from 'react'

import ReactDOM from 'react-dom'

import View from '../viewLoader/view.js'

// import Scroll from '../elements/scroll.js'

import ReactRevealText from 'react-reveal-text'

import { TweenLite } from 'gsap';

import TransitionGroup from 'react-transition-group/Transition'

export default class LandingPage extends Component {
// export default class LandingPage extends View {

    constructor(props) {

        super(props)

        this.state = {

            revealCopy: false,

            title: 'DOUGLAS LILLIEQUIST',

            intro: '( Junior Creative / Interactive Developer )'

        }

    }

    componentWillEnter(callback) {

        TweenLite.to(this, 0.25, {

            // onComplete: () => this.setState({revealCopy: true})
            onStart: () => {

                this.transitionIn()

            },
            
            onComplete: callback

        })

    }

    componentWillLeave(callback) {

        this.setState({revealCopy: false}, () =>{

            TweenLite.to(this, 0.25, {

                onComplete: () => {
                    
                    callback

                    console.log('unmounting')

                }

            })

        })

    }

    // transitionIn() {

    //     this.setState({revealCopy: true})

    // }

    // transitionOut() {

    //     this.setState({revealCopy: false})

    // }

    prepareUnmount() {

        let promise = new Promise((resolve, reject) => {

            TweenLite.to(this, 0.5, {

                onStart: () => this.setState({revealCopy: false}),

                onComplete: () => {
                    
                    TweenLite.to(this, 0.25, {

                        onComplete: () => resolve()

                    })
                
                }
            
            })

        })

        return promise

    }

    render() {

        return(

            <div className = "LandingPage" ref = "home">

                {/* <Scroll /> */}
                            
                <div className = "Title">

                <h1><ReactRevealText show = {this.state.revealCopy} text = {this.state.title}/></h1>
                </div>
                
                <div className = "Intro">

                <ReactRevealText show = {this.state.revealCopy} text = {this.state.intro}/>
                
                </div>
                            
            </div>

        )

    }

}