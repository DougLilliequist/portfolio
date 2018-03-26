import React from 'react'

import ReactDOM from 'react-dom'

// import {TweenLite} from 'gsap'

import {TweenLite, TimelineLite, Power4} from 'gsap'

import ContactLink from './contactLink.js'

import ReactRevealText from 'react-reveal-text'

export default class Contact extends React.Component {

    constructor(props) {

        super(props)

        this.state = {

            hovered: false,

            linkHovered: false

        }

        this.onHover = this.onHover.bind(this)

        this.onLeave = this.onLeave.bind(this)

    }


    onHover() {

        this.setState({hovered: true})

    }

    onLeave() {

        this.setState({hovered: false})

    }

    componentDidUpdate(prevProp, prevState) {

        if(this.state.hovered !== prevState.hovered) {

            TweenLite.killTweensOf(this.contactSymbol)

            if(this.state.hovered) {

                TweenLite.to(this.contactSymbol, 0.75, {

                    ease: Power4.easeInOut,
                    rotation: -135.0

                })

            } else {

                TweenLite.to(this.contactSymbol, 0.75, {

                    ease: Power4.easeInOut,
                    rotation: 0.0

                })

            }

        }

    }


    render() {

        return(

            <div className = "ContactLinks" onMouseLeave = {this.onLeave}>

                <svg ref = {(el) => this.contactSymbol = el}style = {{display: 'inline-block', position: 'absolute', width: '50px', height: '50px'}} onMouseEnter = {this.onHover}>
                    <line className = "Line" ref = "contactLine1" x1 = {0} y1 = {0} x2 = {0.0} y2 = {25} />
                    <line className = "Line" ref = "contactLine2" x1 = {-12.5} y1 = {12.5} x2 = {12.5} y2 = {12.5} />
                </svg>

            <div className = "ContactContainer" ref = {(container) => this.container = container}>

                <ContactLink ref = {(link) => this.linkedIn = link} url = {'https://www.linkedin.com/in/douglas-lilliequist-a2798b110/'} enable = {this.state.hovered} channel = {'linkedIn'} target = {'_blank'} delay = {0.0}/>
                <ContactLink ref = {(link) => this.twitter = link} url = {'https://twitter.com/DougLilliequist'} enable = {this.state.hovered} channel = 'twitter' target = {'_blank'} delay = {0.15}/>
                <ContactLink ref = {(link) => this.mail = link} url = {'mailto:douglas.lilliequist@hyperisland.se'} enable = {this.state.hovered} channel = 'mail' target = {'_self'} delay = {0.30}/>
            
            </div>
            
            </div>

        )


    }

}