import React, {Component} from 'react'

import ReactDOM from 'react-dom'

import {TweenLite} from 'gsap'

import eventEmitter from 'eventEmitter'

const emitter = eventEmitter.emitter

export default class InfoButton extends Component {

    constructor(props) {

        super(props)

        this.props = props

        this.state = {

            hovered: false

        }

        this.onHover = this.onHover.bind(this)

    }

    onHover() {

        this.setState({hovered: !this.state.hovered}, () => {

            emitter.emit('hintClick', this.state.hovered)

            emitter.emit('stick', ReactDOM.findDOMNode(this.button).getBoundingClientRect())

        })

    }

    componentWillReceiveProps(newProp) {

        if(this.props.enabled !== newProp.enabled) {

            this.animate()

        }

    }

    animate() {

        TweenLite.to(this.button, 0.25, {

            opacity: (!this.props.enabled) ? 0.0 : 1.0, //SUPER weird logic

        })

    }

    render() {

        return(

            <div className = "InfoButton" ref = {(button) => {this.button = button}} onMouseEnter = {this.onHover} onMouseLeave = {this.onHover} onClick = {(!this.props.enabled) ? this.props.onMouseDown : null}>[ Info ]</div>

        )

    }

}