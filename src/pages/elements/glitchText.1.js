import React, {Component} from 'react'

import ReactDOM from 'react-dom'

import {TweenLite} from 'gsap'

import eventEmitter from 'eventEmitter'

const emitter = eventEmitter.emitter

export default class GlitchText extends Component {

    constructor(props) {

        super(props)

        this.state = {

            scrambling: false,

            animProgress: 0,
            
            textCounter: 0,

            scrambleCounter: 0

        }

        this.props = props

        this.initParams()

    }

    initParams() {

        this.targetText = this.props.text

        this.targetTextLen = this.targetText.length

        this.animCounterLimit = this.targetTextLen

        this.randomChars = '[|!#%)_!@#!@~%)_%#@_%(/-'

        this.delay = this.props.start

        this.animSpeed = this.props.speed

        this.animate = this.animate.bind(this)

    }

    init() {

        console.log('starting glitch')

        this.setState({
            
            scrambling: true,
            
            animProgress: 0,
            
            textCounter: 0,
            
            scrambleCounter: 0 }, () => {

            this.outPutText = ' '

        })

    }

    glitch(text) {

        this.init()

        if(this.animTime) {

            this.animTime.kill()

        }

        this.animTime = TweenLite.delayedCall(this.delay, this.animate)

    }

    scramble() {

        console.log('scrambling')

        if(this.state.scrambleCounter < this.targetTextLen) {

            this.outPutText = this.getRandomChar().slice(0, this.state.scrambleCounter)

            this.setState((prevState) => ({

                scrambleCounter: prevState.scrambleCounter + 1

            }))

        } else {

            this.setState({scrambling: false})

        }

        this.animTime = TweenLite.delayedCall(this.animSpeed, this.animate)

    }

    revealText() {

        this.setState((prevState) => ({

            animProgress: this.animCounterLimit - prevState.animProgress

        }), () => {


            if(this.state.animProgress <= this.targetTextLen) {

                let slice = this.targetTextLen - this.state.animProgress

                let str = this.targetText.slice(0, slice)

                str += this.getRandomChar().slice(0, this.state.animProgress)

                this.outPutText = str

            } else if(this.state.textCounter + 2 > this.targetTextLen) {
                
                let len = Math.min(this.targetTextLen + 2, 9)

                this.outPutText = this.getRandomChar().slice(0, len)
                
            }  else {

                this.outPutText = this.getRandomChar().slice(0, 9)

            }


        })

        if(this.state.textCounter < this.animCounterLimit) {

            this.setState((prevState) => ({

                textCounter: prevState.textCounter + 1

            }), () => {

                this.animTime = TweenLite.delayedCall(this.animSpeed, this.animate)

            })

        } else {

            this.outPutText = this.targetText

        }

    }

    animate() {

        if(this.state.scrambling) {

            this.scramble()

        } else {

            this.revealText()

        }

    }

    getRandomChar() {

        let str = ' '

        // if(this.targetTextLen > 20) {

        //     for(let i = 0; i < this.targetTextLen; i++) {

        //         str += this.randomChars[Math.floor(Math.random() * this.randomChars.length)]

        //     }

        //     str.slice(0, 20)

        //     for(let j = 0; j < this.targetTextLen; j++) {

        //         str += this.this.randomChars[Math.floor(Math.random() * this.randomChars.length)]

        //     }

        //     str.slice(0, this.targetTextLen - 20)

        // } else {

            for(let i = 0; i < this.targetTextLen; i ++) {

                str += this.randomChars[Math.floor(Math.random() * this.randomChars.length)]
    
            }

            str.slice(0, this.targetTextLen)

        // }
        
        // return str.slice(0, this.targetTextLen)
        return str

    }

    componentDidUpdate(prevProps, prevState) {

        console.log(this.state)

        if(this.props.glitch !== prevProps.glitch) {

            if(this.props.glitch) {

                this.glitch(this.props.text)

            } else {

                this.outPutText = ' '

            }

        }

        // if(this.state.scrambling !== prevState.scrambling) {

        //     if(this.state.scrambling === false) {

        //         this.revealText()

        //     }

        // }

        // if(this.state.progress !== prevState.progress) {

        //     if(this.state.progress >= this.charCount) {

        //         emitter.off('update', this.update.bind(this))

        //     }

        // }

    }

    render() {

        return <div className = "GlitchText" ref = {(text) => this.text = text}>{this.outPutText}</div>
        // return <div className = "GlitchText" ref = {(text) => this.text = text}>{this.props.text}</div>

    }

}