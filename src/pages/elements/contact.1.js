import React from 'react'

import ReactDOM from 'react-dom'

// import {TweenLite} from 'gsap'

import {TweenLite, TimelineLite} from 'gsap'

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

        // this.onLinkHover = this.onLinkHover.bind(this)

    }

    componentDidMount() {

        this.tl = new TimelineLite({

            paused: true

        })

        this.tl.fromTo(this.contactSymbol, 0.35, {rotation: 0.0}, {rotation: -135.0})

        this.tl.staggerTo(this.container.getElementsByClassName('Link'), 0.35, {

            opacity: 0.7

        }, -.15, "-= 0.15")

    }

    onHover() {

        this.setState({hovered: true})

    }

    onLeave() {

        this.setState({hovered: false})

    }

    componentDidUpdate(prevProp, prevState) {

        if(this.state.hovered !== prevState.hovered) {

            this.animate()

        }

    }

    // animate() {

    //     console.log('animating!')

    //     TweenMax.killTweensOf(this.contactSymbol)

    //     TweenMax.killChildTweensOf(ReactDOM.findDOMNode(this.container))

    //     TweenMax.to(this.contactSymbol, 0.35, {

    //         rotation: (this.state.hovered) ? -135.0 : 0.0,

    //     })

    //     TweenMax.staggerTo(this.container.getElementsByClassName('Link'), 0.35, {

    //         opacity: (this.state.hovered) ? 1.0 : 0.0

    //     }, (this.state.hovered) ? -.15 : .15)

    // }
    
    animate() {
        
        this.tl.kill()


        this.state.hovered ? this.tl.play() : this.tl.reverse()

    }


    render() {

        return(

            <div className = "ContactLinks" onMouseLeave = {this.onLeave}>

                <svg ref = {(el) => this.contactSymbol = el}style = {{display: 'inline-block', position: 'absolute', width: '50px', height: '50px'}} onMouseEnter = {this.onHover}>
                    <line className = "Line" ref = "contactLine1" x1 = {0} y1 = {0} x2 = {0.0} y2 = {25} />
                    <line className = "Line" ref = "contactLine2" x1 = {-12.5} y1 = {12.5} x2 = {12.5} y2 = {12.5} />
                </svg>

            <div className = "ContactContainer" ref = {(container) => this.container = container}>

                <ContactLink url = {'https://www.linkedin.com/in/douglas-lilliequist-a2798b110/'} enable = {this.state.hovered} channel = {'linkedIn'} />
                <ContactLink url = {'https://twitter.com/DougLilliequist'} enable = {this.state.hovered} channel = 'twitter' />
                <ContactLink url = {'mailto:douglas.lilliequist@hyperisland.se'} enable = {this.state.hovered} channel = 'mail' />
                {/* <div className = "LinkedIn" onMouseEnter = {this.onLinkHover}><a className = "Link" href = "https://www.linkedin.com/in/douglas-lilliequist-a2798b110/" target = "_blank">linkedin</a></div> */}
                {/* <div className = "Twitter" onMouseEnter = {this.onLinkHover}><a className = "Link" href = "https://twitter.com/DougLilliequist" target = "_blank">twitter</a></div> */}
                {/* <div className = "Email" onMouseEnter = {this.onLinkHover}><a className = "Link" href = "mailto:douglas.lilliequist@hyperisland.se">mail</a></div> */}
            </div>
            
            </div>

        )


    }

}