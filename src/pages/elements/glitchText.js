import React, {Component} from 'react'

import ReactDOM from 'react-dom'

import {TweenLite} from 'gsap'

import eventEmitter from 'eventEmitter'

const emitter = eventEmitter.emitter

export default class GlitchText extends Component {

    constructor(props) {

        super(props)

        this.props = props

        this.init()

        this.initEvents()

    }

    init() {

        this.randomChars = '[|!#%)_!@#!@~%)_%#@_%(/-'

        this.randomChars += '&#9612'

        this.randomChars += '&##9603'

    }

    initEvents() {

        // emitter.on('update', this.onUpdate.bind(this))

    }

    glitch() {


    }

    componentDidUpdate(prevProps, prevState) {

        if(this.props.glitch !== prevProps.glitch) {

            if(this.props.glitch) {

                this.glitch()

            }

        }

    }

    setNewText(targetText) {

        this.charCounter = 0

        this.animTime = 0

        this.outPutText = ' '

        this.newText = targetText

        this.newTextLen = this.newText.length

        //contains all the chars that will animate
        this.animCharQue = []

        for(let i = 0; i < this.newTextLen; i++) {

            let animChar = {

                newChar: this.newText[i],
                
                duration: Math.random()

            }

            this.animCharQue.push(animChar)

        }

        this.outPutText = this.newText

    }

    onUpdate() {

        if(this.props.glitch === true && this.charCounter <= this.newTextLen) {

        this.animTime += 0.15

        for(let i = 0; i < this.animCharQue.length; i++) {

            if(this.animCharQue[i].duration >= this.animTime) {

                this.outPutText += this.newText.slice(0, i)

                console.log(this.outPutText)

                this.charCounter++
            }

        }

    }

}

    getRandomChar() {

        return this.randomChars[Math.floor(Math.random() * this.randomChars.length)]

    }

    render() {

        // return <div className = "GlitchText" ref = {(text) => this.text = text}>{this.outPutText}</div>
        return <div className = "GlitchText" ref = {(text) => this.text = text}>{this.props.text}</div>

    }

}