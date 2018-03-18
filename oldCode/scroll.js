import React, {Component} from 'react'

import {TweenLite} from 'gsap'

export default class ProjectScroll extends Component {

    constructor(props) {

        super(props)

        this.state = {

            animating: false

        }

    }

    componentDidMount() {

        console.log('hello')

        this.setState({animating: true})

        this.animate()

    }

    componentWillUnmount() {

        this.setState({animating: false})

    }

    animate() {

        TweenLite.to(this.refs['scrollLine'], 2.25, {

            strokeDashoffset: -180.0,

            opacity: 0.0,

            ease: Sine.easeOut,

            onComplete: () => {

                this.refs['scrollLine'].style.strokeDashoffset = 180.0

                this.refs['scrollLine'].style.opacity = 1.0

                if(this.state.animating) {

                    this.animate()

                } else {

                    TweenLite.killTweensOf(this.refs['scrollLine'])

                }
                
            }

        })

    }

    render() {

        return(

            <div className = "ProjectScroll">
                
                <svg> 
                    <line className = "Line"  ref = "scrollLine" x1 = {0} y1 = {0} x2 = {40} y2 = {0} />
                </svg>
            
            </div>

        )

    }

}