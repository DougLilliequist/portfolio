import React, {Component} from 'react'

import {TweenLite, Power4} from 'gsap'

import GlitchText from '../elements/glitchText.js'

import eventEmitter from 'eventEmitter'

const emitter = eventEmitter.emitter

export default class ContactLink extends Component {

    constructor(props) {

        super(props)

        this.state = {

            hovered: false

        }

        this.props = props

        this.onLinkHover = this.onLinkHover.bind(this)

    }

    onLinkHover() {

        if(this.props.enable) {

            this.setState({hovered: !this.state.hovered})

        }

    }

    animate() {

            TweenLite.killTweensOf(this.link)

            TweenLite.to(this.link, 1.5, {

                ease: Power4.easeOut,
    
                opacity: this.state.hovered ? 1.0 : 0.4
    
            })

    }

    hideReveal() {

        TweenLite.killTweensOf(this.link)

        TweenLite.to(this.link, 0.5, {

            delay: this.props.delay,

            ease: Power4.easeInOut,

            opacity: this.props.enable ? 0.4 : 0.0

        })

    }

    componentDidUpdate(prevProps, prevState) {

        if(this.props.enable !== prevProps.enable) {

            this.hideReveal()

        }

        if(this.state.hovered !== prevState.hovered) {

            if(this.props.enable) {

            emitter.emit('hintClick', this.state.hovered)

            this.animate()

            }

        }

    }


    render() {

        return(

            <a className = 'ContactLink' ref = {(el) => this.link = el} href = {this.props.url} onMouseEnter = {this.onLinkHover} onMouseLeave = {this.onLinkHover} target = {this.props.target}>{this.props.channel}</a>

        )

    }

}