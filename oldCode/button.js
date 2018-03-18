import React, {Component} from 'react'

import ReactDOM from 'react-dom'

import {TweenLite} from 'gsap'

import {map} from 'math'

import eventEmitter from 'eventEmitter'

const emitter = eventEmitter.emitter

export default class NavButton extends Component {

    constructor(props) {

        super(props)

        this.props = props
        
        this.state = {

            clicked: false,

            prevIndex: null,

            index: 0,

            percent: 0,

            position: 0

        }

        this.mouse = {}

        this.mouse.x = 0

        this.mouse.y = 0

        this.pos = {}

        this.pos.x = 0

        this.pos.y = 0
        
        this.onMouseDown = this.onMouseDown.bind(this)

    }

    componentDidMount() {

        window.addEventListener('mousemove', this.onMouseMove.bind(this))

        window.addEventListener('mouseup', this.onMouseUp.bind(this))

        emitter.on('update', this.onUpdate.bind(this))

        // this.offSetY = ReactDOM.findDOMNode(this.refs['navCircle']).getBoundingClientRect().top

        this.targetY = 0

        this.range = 0 //rename to something more index related

    }

    onMouseDown() {

        this.setState({clicked: true, prevIndex: this.state.index}, () => {

            console.log('clicked')

            // emitter.emit('dragStart', this.state.prevIndex) //rename

            TweenLite.to(this.refs['circle'], 0.25, {

                css: {

                    transform: 'matrix(10.5, 0, 0, 10.5, 0, 0)'

                }

            })

        })
    
    }

    onMouseUp() {

        this.setState({clicked: false, index: this.range}, () => {

            // emitter.emit('viewSelected', this.range)
            // emitter.emit('dragEnd', this.range)

            TweenLite.to(this.refs['circle'], 0.25, {

                css: {

                    transform: 'matrix(1.0, 0, 0, 1.0, 0, 0)'

                }

            })

        })

    }

    onMouseMove(e) {

        if(this.state.clicked) {

            this.mouse.x = e.pageX

            this.mouse.y = e.clientY - (this.props.offsetY)

        }

    }

    // componentDidUpdate(newState, newProps) {

    //     const clicked = this.state.clicked !== newState.clicked
        
    //     if(clicked === true) {

    //         TweenLite.to(this.refs['view'], 0.25, {

    //             opacity: 1.0

    //         })

    //     } else if(clicked === false) {

    //         TweenLite.to(this.refs['view'], 0.25, {

    //             opacity: 0.0

    //         })  

    //     }

    // }

    shouldComponentUpdate(newState, newProps) {

        let percentUpdated = this.state.percent !== newState.percent

        return percentUpdated || viewUpdated

    }

    componentWillUnmount() {

        window.removeEventListener('mousemove', this.onMouseMove.bind(this))

        window.removeEventListener('mouseup', this.onMouseUp.bind(this))

    }

    onUpdate() {

        if(this.state.clicked) {

            this.pos.x += (this.mouse.x - this.pos.x) * 0.15
        
            this.pos.y += (this.mouse.y - this.pos.y) * 0.15

            this.range = Math.round(map(Math.min(Math.max(this.pos.y, 0), 350), 0, 350, 0 , 4))

            this.refs['circle'].style.transform = 'matrix(1, 0, 0, 1, 0, ' + Math.min(Math.max(this.pos.y, 0), 350) + ')' //matrix transform this

            this.setState({percent: Math.round(map(Math.min(Math.max(this.pos.y, 0), 350), 0, 350, 0, 100))})

        } else {

            // this.pos.y += (this.targetY - this.pos.y) * 0.15

            // this.refs['navCircle'].style.transform = 'matrix(1, 0, 0, 1, 0, ' + Math.min(Math.max(this.pos.y, 0), 350) + ')' //matrix transform this

        }

    }

    animate(val) {
        
        // TweenLite.to(this.refs['navCircle'], 0.5, {

        //     y: map(val, this.props.min, this.props.max, 0, 350),
            
        //     x: 0

        // })

        this.targetY = map(val, this.props.min, this.props.max, 0, 350)

    }

    render() {

        return(

            <div className = "NavButton" ref = "nav">

                <svg style ={{width: '50px', height: '450px'}}>

                    <circle className = "NavCircle" ref = "circle" cx = {25} cy = {50} r = {8.5} 
                    onMouseDown = {this.onMouseDown} />

                </svg>

            </div>
            
        )

    }

}