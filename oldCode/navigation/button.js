import React from 'react'

import ReactDOM from 'react-dom'

import {TweenLite} from 'gsap'

import eventEmitter from 'eventEmitter'

const emitter = eventEmitter.emitter

export default class NavButton extends React.Component {

    constructor(props) {

        super(props)

        this.state = {

            selected: false

        }

        this.props = props

        this.onMouseEnter = this.onMouseEnter.bind(this)
        
        this.onMouseLeave = this.onMouseLeave.bind(this)

        this.onClick = this.onClick.bind(this)

    }

    onMouseEnter() {
        
        TweenLite.killTweensOf(this.refs['navCircle'])

        TweenLite.killTweensOf(this.refs['navLine'])

        TweenLite.killTweensOf(this.refs['label'])

        TweenLite.to(this.refs['navButton'], 0.35, {

            attr: {

                r: '50'

            }

        })
        
        TweenLite.to(this.refs['navCircle'], 0.35, {

            css: {

                strokeWidth: 15,

            },

            ease: Sine.easeOut,

            onComplete: () => {

                TweenLite.to(this.refs['navLine'], 0.15, {

                    css: {

                        strokeDashoffset: 0

                    }, 

                    onComplete: () => {

                        TweenLite.to(this.refs['label'], 0.35, {

                            opacity: 1
                            
                        })

                    }

                })

            }

        })

    }

    onMouseLeave() {

        TweenLite.killTweensOf(this.refs['navLine'])
        
        TweenLite.killTweensOf(this.refs['navCircle'])

        TweenLite.killTweensOf(this.refs['label'])

        TweenLite.to(this.refs['label'], 0.35, {

            opacity: 0,

            onComplete: () => {

                TweenLite.to(this.refs['navLine'], 0.15, {

                    css: {
        
                        strokeDashoffset: 15
        
                    },
        
                    ease: Sine.easeOut,
        
                    onComplete: () => {
        
                        TweenLite.to(this.refs['navCircle'], 0.35, {
        
                            css: {
        
                                strokeWidth: 7.5,
        
                            }
        
                        })
        
                    }
        
                })

            }
            
        })

    }

    onClick() {

        this.setState((prevState)=>{

            selected: !prevState

        })

        emitter.emit('viewSelected', this.props.targetView)

    }

    render() {

        return(
            
            <li key = {this.props.keyVal} className = "NavButton" ref ='navButton'>
            
                <svg style = {{width: '25px', height: '25px'}}>

                    <line className = "NavCircle" ref = "navCircle" x1 = {0} y1 = {0} x2 = {0} y2 = {0} onClick = {this.onClick} onMouseEnter = {this.onMouseEnter} onMouseLeave = {this.onMouseLeave}/>
                    {/* <circle className = "NavCircle" ref = "navCircle" cx = {0} cy = {0} r = {5} /> */}

                </svg>

                <svg style = {{width: '25px', height: '25px'}}>

                    <line className = "NavLine" ref = "navLine" x1 = {0} y1 = {0} x2 = {15} y2 = {0} />

                </svg>

                <div className = "Label" ref = "label"> {this.props.label} </div>
            
            </li>

        )

    }

}

