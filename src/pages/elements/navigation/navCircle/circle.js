import React, {Component} from 'react'

import ReactDOM from 'react-dom'

import {TweenLite} from 'gsap'

import {map} from 'math'

import {translate} from 'helpers'

import eventEmitter from 'eventEmitter'

const emitter = eventEmitter.emitter

export default class NavCircle extends Component {

    constructor(props) {

        super(props)

        this.props = props
        
        this.state = {

            clicked: false,

            focused: false,

            onProject: false

        }

        this.pos = { //rename to circle

            x: 0,

            y: 0,

            r: 0

        }

        this.target = {

            x: 0,

            y: 0,

            focusX: 0,

            focusY: 0

        }

        this.size = {

            x: 0,

            y: 0

        }

        this.activeTime = null

        // this.ease = 0.15
        this.ease = 1.0
        
    }

    componentDidMount() {

        emitter.on('hintClick', this.onClickable.bind(this)) //rename

        emitter.on('stick', this.onFocus.bind(this)) //rename

        emitter.on('unStick', (b) => this.setState({focused: false}))

        emitter.on('projectHovered', (b) => this.setState({onProject: b}))

        emitter.on('resizing', this.onResize.bind(this))

        emitter.on('update', this.onUpdate.bind(this))

        this.size.x = ReactDOM.findDOMNode(this.container).getBoundingClientRect().width

        this.size.y = ReactDOM.findDOMNode(this.container).getBoundingClientRect().height

        this.offSetX = this.size.x * 0.5

        this.offSetY = this.size.y * 0.5

        this.target.x = window.innerWidth * 0.5

        this.target.y = window.innerHeight * 0.5

        this.spawn()
    
    }

    onClickable(b) {

        TweenLite.killTweensOf(this.circle)

        TweenLite.to(this.circle, 0.25, {
    
            attr: {

                r: (b) ? 30.0 : 10.0

            }

        })

    }

    onFocus(el) {

        this.setState({focused: true}, () => {

            this.target.focusX = (el.x - this.offSetX) + (el.width * 0.5 || 0)

            this.target.focusY = (el.y - this.offSetY) + (el.height * 0.5 || 0)

        })

    }

    animate(b) { //rename

        TweenLite.killTweensOf(this.circle)

        TweenLite.to(this.circle, 0.5, {

            attr: {

                r: (b) ? 50 : 10

            } 

        })

    }

    componentDidUpdate(prevProps, prevState) {

        if(this.props.active !== prevProps.active) {

            if(this.state.onProject) {

            TweenLite.killTweensOf(this.circle)

            TweenLite.to(this.circle, 0.35, {

                opacity: this.props.active ? 1.0 : 0.0

             })

            }

        }

    }

    onUpdate() {

        this.target.x = this.props.target.x - this.offSetX

        this.target.y = this.props.target.y - this.offSetY

        if(this.state.focused === false) {

            this.pos.x += (this.target.x - this.pos.x) * this.ease

            this.pos.y += (this.target.y - this.pos.y) * this.ease

        } else {

            this.pos.x += (this.target.focusX - this.pos.x) * 0.1

            this.pos.y += (this.target.focusY - this.pos.y) * 0.1

        }

        // this.container.style.transform = 'matrix(1, 0, 0, 1, ' + this.pos.x + ', ' + this.pos.y + ')' //matrix transform this
        
        this.container.style.transform = translate(this.pos) //maybe overkill?

        // console.log(this.container.style.transform)

    }

    spawn() {

        TweenLite.to(this.circle, 0.35, {

            attr: {

                r: 10

            },

            opacity: 1.0,
        
        })

    }

    onResize() {

        this.offSetX = ReactDOM.findDOMNode(this.container).getBoundingClientRect().width * 0.5
        
        this.offSetY = ReactDOM.findDOMNode(this.container).getBoundingClientRect().height * 0.5

    }

    componentWillUnmount() {

        window.removeEventListener('resize', this.onResize.bind(this))

        emitter.off('update', this.onUpdate.bind(this))

    }

    render() {

        return(

            <div ref = {(container) => {this.container = container}} style = {{position: 'absolute', width: '200px', height: '200px', pointerEvents: 'none'}}>

            <svg style = {{width: '100%', height: '100%'}}>
                    
                <circle className = "NavCircle" ref = {(circle) => {this.circle = circle}} cx = {'50%'} cy = {'50%'} r = {this.pos.r}/>

            </svg>

        </div>
            
        )

    }

}