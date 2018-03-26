import React, {Component} from 'react'

import {TweenLite} from 'gsap'

import eventEmitter from 'eventEmitter'

const emitter = eventEmitter.emitter

export default class LandingPageScroll extends Component {

    constructor(props) {

        super(props)

        this.state = {

            animating: false,
            hide: false

        }

        // this.hide = this.hide.bind(this)

    }

    componentDidMount() {

        // TweenLite.set(this.cta, {opacity: 0.0})

        this.initEvents()

        TweenLite.to(this, this.props.delay, {

            onComplete: () => {

                this.setState({animating: true}, () => {

                    TweenLite.fromTo(this.cta, 0.5, {

                        opacity: 0.0

                    }, {

                        opacity: 1.0


                    })

                    this.setState({animating: true})

                })

            }

        })

    }

    initEvents() {

        emitter.on('hideScroll', (b) => this.setState({hide: b}))

    }

    hide() {

        TweenLite.killTweensOf(this.cta)
        
        TweenLite.killTweensOf(this.refs['scrollLine'])

        TweenLite.to(this.cta, 0.35, {

            opacity: 0.0

        })

        TweenLite.to(this.refs['scrollLine'], 0.35, {

            opacity: 0.0,

            onComplete: () => {

                this.setState({animating: false})

            }

        })

    }

    reveal() {

        TweenLite.killTweensOf(this.cta)

        TweenLite.killTweensOf(this.refs['scrollLine'])

        TweenLite.to(this.cta, 0.35, {

            opacity: 1.0

        })

        TweenLite.to(this.refs['scrollLine'], 0.35, {

            opacity: 1.0,

            onComplete: () => {

                this.setState({animating: true})

            }

        })

    }

    animate() {

        TweenLite.to(this.refs['scrollLine'], 2.25, {

            strokeDashoffset: -180.0,

            ease: Sine.easeInOut,

            onComplete: () => {

                this.refs['scrollLine'].style.strokeDashoffset = 180.0

                // this.refs['scrollLine'].style.opacity = 1.0

                if(this.state.animating) {

                    this.animate()

                } else {

                    return

                }
                
            }

        })

    }

    componentDidUpdate(prevProps, prevState) {

        if(this.state.animating !== prevState.animating) {

            this.animate()

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
                
                {/* replace with react-reveal text */}
                <div className = "ScrollHint" ref = {(el) => this.cta = el}>scroll</div> 
                
                <svg style = {{width: '100%', height: '2px'}}> 
                    {/* <path className = "ScrollLine"  ref = "scrollLine" d = {'m0 0 l 180 0'}/> */}
                    <line className = "Line"  ref = "scrollLine" x1 = {0} y1 = {0} x2 = {180} y2 = {0} />
                </svg>
            
            </div>

        )

    }

}