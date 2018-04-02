import React, {Component} from 'react'

import {TweenLite, TimelineMax} from 'gsap'

import eventEmitter from 'eventEmitter'

const emitter = eventEmitter.emitter

export default class LandingPageScroll extends Component {

    constructor(props) {

        super(props)

        this.state = {

            animating: false,
            
            hide: false

        }

    }

    componentDidMount() {

        this.initEvents()

        TweenLite.to(this, 0.5, {

            delay: this.props.delay,

            onComplete: () => {

                this.setState({animating: true}, () => {

                    TweenLite.fromTo(this.cta, 0.5, {

                        opacity: 0.0

                    }, {

                        opacity: 1.0


                    })

                })

            }

        })

    }

    animate() {

       TweenLite.fromTo(this.scrollLine, 1.5, {

            ease: Sine.easeInOut,
            strokeDashoffset: 270

        }, {

            ease: Sine.easeInOut,
            strokeDashoffset: 90,
            onComplete: () => this.animate()

        })

    }

    initEvents() {

        emitter.on('hideScroll', (b) => this.setState({hide: b}))

    }

    hide() {

        TweenLite.killTweensOf(this.cta)
    
        TweenLite.to(this.cta, 0.35, {

            opacity: 0.0

        })

        TweenLite.to(this.scrollLine, 0.35, {

            opacity: 0.0,

            onComplete: () => {

                this.setState({animating: false})

            }

        })

    }

    reveal() {

        TweenLite.killTweensOf(this.cta)

        TweenLite.to(this.cta, 0.35, {

            opacity: 1.0

        })

        TweenLite.to(this.scrollLine, 0.35, {

            opacity: 1.0,

        })

    }

    componentDidUpdate(prevProps, prevState) {

        if(this.state.animating !== prevState.animating) {

            if(this.state.animating) {

                this.animate()

            }
        }

        if(this.state.hide !== prevState.hide) {

            if(this.state.hide) {

                this.hide()

            } else {

                this.reveal()

            }

        }

    }

    render() {

        return(

            <div className = "Scroll">
                
                <div className = "ScrollHint" ref = {(el) => this.cta = el}>scroll</div> 
                
                <svg style = {{width: '100%', height: '2px'}}> 
                    <line className = "Line"  ref = {(el) => this.scrollLine = el} x1 = {0} y1 = {0} x2 = {90} y2 = {0} />
                </svg>
            
            </div>

        )

    }

}