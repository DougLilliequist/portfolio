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

        // this.randomChars = '[|!#%)_!@#!@~%)_%#@_%(/-'
        this.randomChars = 'X/|-1[|1X)0)(0/-]1]X|^'

        this.randomChars += String.fromCharCode(9604)
        
        this.randomChars += String.fromCharCode(9612)
        
        this.randomChars += String.fromCharCode(9602)
        
        this.randomChars += String.fromCharCode(9609)
        
        this.randomChars += String.fromCharCode(9626)

        this.randomChars += String.fromCharCode(9614)

        this.delay = this.props.start

        this.animSpeed = this.props.speed

        this.animate = this.animate.bind(this)

    }

    init() {

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

            animProgress: this.animCounterLimit - this.state.textCounter

        }), () => {

            if(this.state.animProgress <= this.targetTextLen) {

                let slice = this.targetTextLen - this.state.animProgress

                let str = this.targetText.slice(0, slice)

                str += this.getRandomChar().slice(0, this.state.animProgress)

                this.outPutText = str

            } else if (this.state.textCounter + 2 < this.targetTextLen) {

                let len = Math.min(this.state.textCounter + 2, 9)

                this.outPutText = this.getRandomChar().slice(0, len)

            } else {

                this.outPutText = this.getRandomChar().slice(0, 9)

            }


        })

        if(this.state.textCounter < this.animCounterLimit) {

            this.setState((prevState) => ({

                textCounter: prevState.textCounter + 1

            }), () => {

                this.animTime = TweenLite.delayedCall(this.animSpeed, this.animate)

            })

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

        let str = ''

        if(this.targetTextLen > 10) {

            for(let i = 0; i < this.targetTextLen; i++) {

                str += this.randomChars[Math.floor(Math.random() * this.randomChars.length)]

                str.slice(0, 10)

            }

            for(let j = 0; j < this.targetTextLen - 10; j++) {

                str += this.randomChars[Math.floor(Math.random() * this.randomChars.length)]

                str.slice(0, this.targetTextLen - 10)

            }

        } else {

        for(let i = 0; i < this.targetTextLen; i ++) {

            str += this.randomChars[Math.floor(Math.random() * this.randomChars.length)]

            str.slice(0, this.targetTextLen)

        }

    }

        return str
        

    }

    // shouldComponentUpdate(nextProps, nextState) {

    //     // const counterChanged = this.state.textCounter !== newState.textCounter && nextState.textCounter > this.state.textCounter

    //     // const scramblerChanged = this.state.scrambleCounter !== newState.scrambleCounter

    //     // const progressChanged = this.state.animProgress !== newState.animProgress

    //     // return counterChanged

    //     // return (scramblerChanged || counterChanged || progressChanged)

    // }

    componentDidUpdate(prevProps, prevState) {

        if(this.props.glitch !== prevProps.glitch) {

            if(this.props.glitch) {

                this.glitch(this.props.text)

            } else {

                this.outPutText = ' '

            }

        }

        if(this.state.textCounter !== prevState.textCounter) {

            if(this.state.textCounter >= this.animCounterLimit) {

                this.outPutText = this.targetText

            }

        }

    }

    render() {

        return <div className = "GlitchText" ref = {(text) => this.text = text}>{this.outPutText}</div>
        // return <div className = "GlitchText" ref = {(text) => this.text = text}>{this.props.text}</div>

    }

}