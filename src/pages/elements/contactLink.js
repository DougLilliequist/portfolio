import React, {Component} from 'react'

import {TweenLite, Power4} from 'gsap'

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

        } else {

            return

        }

    }

    animate() {

        TweenLite.killTweensOf(this.link)

        TweenLite.to(this.link, 0.7, {

            ease: Power4.easeOut,

            opacity: this.state.hovered ? 1.0 : 0.4

        })

    }

    // hideReveal() {

    //     TweenLite.killTweensOf(this.link)

    //     TweenLite.to(this.link, 0.4, {

    //         opacity: this.props.reveal ? 0.7 : 0.0

    //     })

    // }

    componentDidUpdate(prevProps, prevState) {

        if(this.state.hovered !== prevState.hovered) {

            this.animate()

        }

    }


    render() {

        return(

            <div onMouseEnter = {this.onLinkHover} onMouseLeave = {this.onLinkHover}><a ref = {(el) => this.link = el} className = "Link" href = {this.props.url}>{this.props.channel}</a></div>

        )

    }

}