import React, {Component} from 'react'

import ReactDOM from 'react-dom'

import {TweenLite} from 'gsap'

import {map} from 'math'

import eventEmitter from 'eventEmitter'

const emitter = eventEmitter.emitter

export default class NavLine extends Component {

    constructor(props) {

        super(props)

        this.props = props

    }

    componentDidMount() {

        this.init()

        this.initEvents()

    }

    init() {

        this.strokeDash = this.getStrokeDash()

        TweenLite.set(this.refs['prog'],{

            css: {

                strokeDasharray: this.strokeDash,

                strokeDashoffset: this.strokeDash

            }

        })

    }

    fadeIn() {

        TweenLite.to(this.refs['line'], 0.25, {

            opacity: 1.0

        })

        TweenLite.to(this.refs['prog'], 0.25, {

            // scaleY: 1,
            
            opacity: 1.0,

        })

    }

    fadeOut() {

        TweenLite.to(this.refs['line'], 0.5, {

            delay: 2.25,

            opacity: 0.0

        })

        TweenLite.to(this.refs['prog'], 0.5, {
            
            // scaleY: 0.0,

            delay: 2.25,
            
            opacity: 0.0

        })

    }

    animate(val) {

        this.progress = map(val, this.props.min, this.props.max, this.strokeDash, 0.0)

        TweenLite.killTweensOf(this.refs['prog'])

        TweenLite.to(this.refs['prog'], 0.25, {

            css: {

                strokeDashoffset: this.progress

            },

            onStart: () => {

                this.fadeIn()

            },

            onComplete: () => {

                this.fadeOut()

            }

        })

    }

    initEvents() {

        emitter.on('resize', this.onResize.bind(this))

    }

    onResize() {

        this.strokeDash = this.getStrokeDash()

        this.progress = map(val, this.props.min, this.props.max, this.strokeDash, 0.0)

        TweenLite.set(this.refs['prog'], {

            css: {

                strokeDasharray: this.strokeDash
            }

        })

    }

    getStrokeDash() {

        return ReactDOM.findDOMNode(this.refs['prog']).getBoundingClientRect().height

    }

    render() {

        return(

            <svg className = "NavLineContainer">

                <line className = "NavLine" ref = "line" x1 = {'0%'} y1 = {'0%'} x2 = {'100%'} y2 = {'100%'}/>
                
                <line className = "ProgressLine" ref = "prog" x1 = {'0%'} y1 = {'0%'} x2 = {'100%'} y2 = {'100%'}/>

            </svg>

        )

    }

}