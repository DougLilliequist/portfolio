import React, {Component} from 'react'

import {TweenLite} from 'gsap'

import LandingPageScroll from './landingPageScroll.js'

import ProjectScroll from './projectScroll'

export default class Scroll extends Component {

    constructor(props) {

        super(props)

        this.props = props

        this.init()

    }

    init() {

        this.landingPageScroll = <LandingPageScroll ref = {(currentScroll) => {this.scrollOne = currentScroll}}/>

        this.projectScroll = <ProjectScroll ref = {(currentScroll) => {this.scrollTwo = currentScroll}}/>

    }

    render() {

        let activeScroll = null

        switch(this.props.view) {

            case 'home': {

                activeScroll = this.landingPageScroll

            }

            break

            case 'work' : {

                // this.scrollOne.hide().then(() => {

                    activeScroll = <div/>
                    // activeScroll = this.projectScroll

                // })

            }

            break

        }

        return(

            <div>
            
                {activeScroll}

            </div>

        )

    }

}