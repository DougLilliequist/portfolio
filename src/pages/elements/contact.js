import React from 'react'

import ReactDOM from 'react-dom'

import {TweenLite} from 'gsap'

import ReactRevealText from 'react-reveal-text'

export default class Contact extends React.Component {

    constructor(props) {

        super(props)

    }

    componentDidMount() {

        TweenLite.to(this.refs['contactLine'], 1.0, {

            strokeDashoffset: 0.0,

            opacity: 1.0,

            onStart: () => {

                this.refs['contactLine'].style.opacity = 0.0

            }

        })

    }

    render() {

        return(

            <div className = "ContactLinks">

                <svg style = {{width: '50px', height: '50px'}}>
                    <line className = "Line" ref = "contactLine" x1 = {0} y1 = {0} x2 = {0.0} y2 = {18.5} />
                </svg>

            <div className = "ContactContainer">
                <div className = "LinkedIn"><a href = "https://www.linkedin.com/in/douglas-lilliequist-a2798b110/">linkedin</a></div>
                <div className = "LinkedIn"><a href = "https://twitter.com/DougLilliequist">twitter</a></div>
                <div className = "Email"><a href = "mailto:douglas.lilliequist@hyperisland.se">mail</a></div>

            </div>
            
            </div>

        )


    }

}