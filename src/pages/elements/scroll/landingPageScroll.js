import React, {Component} from 'react'

import {TweenLite} from 'gsap'

export default class LandingPageScroll extends Component {

    constructor(props) {

        super(props)

        this.state = {

            animating: false

        }

        this.hide = this.hide.bind(this)

    }

    componentDidMount() {

        console.log(this.refs['scrollLine'])

        this.setState({animating: true})

        this.animate()

    }

    animate() {

        TweenLite.fromTo(this.refs['scrollLine'], 3.75, {

            ease: Sine.easeInOut,
            opacity: 1.0

        }, {

            ease: Sine.easeInOut,
            opacity: 0.0

        })

        TweenLite.to(this.refs['scrollLine'], 2.25, {

            strokeDashoffset: -180.0,

            ease: Sine.easeInOut,

            onComplete: () => {

                this.refs['scrollLine'].style.strokeDashoffset = 180.0

                // this.refs['scrollLine'].style.opacity = 1.0

                if(this.state.animating) {

                    this.animate()

                } else {

                    TweenLite.killTweensOf(this.refs['scrollLine'])

                }
                
            }

        })

    }

    hide() {

        let promise = new Promise((resolve, reject) => {

        this.setState({animating: false}, () => {

            TweenLite.to(this.refs['scrollHint'], 0.5, {

                opacity: 0.0,

                onComplete: () => resolve()

            })

        })

      })

      return promise

    }

    render() {

        return(

            <div className = "Scroll">
                
                {/* replace with react-reveal text */}
                <div className = "ScrollHint" ref = "scrollHint">scroll</div> 
                
                <svg style = {{width: '100%', height: '2px'}}> 
                    {/* <path className = "ScrollLine"  ref = "scrollLine" d = {'m0 0 l 180 0'}/> */}
                    <line className = "Line"  ref = "scrollLine" x1 = {0} y1 = {0} x2 = {180} y2 = {0} />
                </svg>
            
            </div>

        )

    }

}