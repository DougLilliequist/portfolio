import React, {Component} from 'react'

import ReactDOM from 'react-dom'

import {TweenLite} from 'gsap'

import {map} from 'math'

import eventEmitter from 'eventEmitter'

const emitter = eventEmitter.emitter

import NavLine from './navLine.js'

export default class CuriousNavigation extends Component {

    constructor(props) {

        super(props)

        this.props = props

        console.log(this.props)
        
        this.state = {

            navigating: false,

            prevIndex: 0,

            index: 0,

            percent: 0,

            targetView: ' ',

            direction: 0

        }

        // this.mouse = {

        //     x: 0,

        //     y: 0

        // }

        this.pos = { //rename to circle

            x: 0,

            y: 0,

            lastX: 0,

            lastY: 0,

            r: 0

        }

        this.target = {

            x: 0,

            y: 0

        }

        this.start = {

            x: 0,

            y: 0

        }

        this.dir = {

            x: 0,

            y: 0,

            prevX: 0,

            prevY: 0

        }

        this.ease = 0.75

        this.increment = 0

        this.views = []

        this.views[0] = 'home' //omitt later

        this.views[1] = 'Project: '
        
        this.views[2] = 'Project: '
        
        this.views[3] = 'Project: '
        
        this.views[4] = 'Project: '
        
    }

    componentDidMount() {

        //replace to emitter events

        // emitter.on('dragStart', this.onDragStart.bind(this))
        
        emitter.on('curious', this.onDragStart.bind(this))
        
        emitter.on('viewSelected', this.onDragStop.bind(this))

        emitter.on('panMove', this.onDragMove.bind(this)) //rename

        emitter.on('update', this.onUpdate.bind(this))

        emitter.on('resizing', this.onResize.bind(this))

        emitter.on('updateRange', (val) => this.range = val)

        this.range = 0 //rename to something more index related

        this.offSetX = 0
        
        this.offSetY = 0

        this.offSet = 0.8 //rename to something more related to ui position

        this.width = window.innerWidth

        this.height = window.innerHeight

    }

    onDragStart(e) {

        this.setState({navigating: true, prevIndex: this.state.index}, () => {

            this.offSetX = this.props.size.x * 0.5
            
            this.offSetY = this.props.size.y * 0.5

            this.target.x = e.center.x - this.offSetX

            this.target.y = e.center.y - this.offSetY
        

            // this.refs['navLine'].fadeIn()

            // TweenLite.to(this.refs['view'], 0.25, {

            //     opacity: 1.0

            // })

            // TweenLite.to(this.refs['counter'], 0.35, {

            //     opacity: 1.0

            // })

            // TweenLite.to(this.refs['navLine1'], 0.35, {

            //     // strokeDashoffset: 0,
                
            //     opacity: 1.0

            // })

            // TweenLite.to(this.refs['navLine2'], 0.35, {

            //     // strokeDashoffset: 0,

            //     opacity: 1.0

            // })


            // TweenLite.to(this.arrowUp, 0.35, {

            //     opacity: 1.0

            // })

            // TweenLite.to(this.arrowDown, 0.35, {

            //     opacity: 1.0

            // })

            // TweenLite.to(this.refs['navLine3'], 0.35, {

            //     opacity: 0.5

            // })

        })
    
    }
    
    onDragMove(e) {

        if(this.state.navigating) {

        this.offSetX = this.props.size.x * 0.5
            
        this.offSetY = this.props.size.y * 0.5
        
        this.target.x = e.center.x - this.offSetX

        this.target.y = e.center.y - this.offSetY

        if(this.state.navigating) {

            this.dir.prevX = this.dir.x
            
            this.dir.prevY = this.dir.y

            this.dir.x = this.target.x

            this.dir.y = this.target.y

            let deltaX = this.dir.x - this.dir.prevX

            let deltaY = this.dir.y - this.dir.prevY

        this.increment = (deltaY > 0) ? this.increment + 1 : this.increment - 1

        this.increment = Math.min(Math.max(this.increment, 0), 100)

            }

        }

    }

    onDragStop(e) {

        if(this.state.navigating) {

        this.setState({navigating: false, index: this.range}, () => {

            this.pos.lastX = e.clientX

            this.pos.lastY = e.clientY

            // emitter.emit('viewSelected', this.range)

            // this.refs['navLine'].props = {visible: true}

            // this.refs['navLine'].fadeOut()

            // TweenLite.to(this.refs['counter'], 0.35, {

            //     opacity: 0.0

            // })

            // TweenLite.to(this.refs['navLine1'], 0.35, {

            //     // strokeDashoffset: -25,

            //     opacity: 0.0

            // })

            // TweenLite.to(this.refs['navLine2'], 0.35, {

            //     // strokeDashoffset: 25,

            //     opacity: 0.0

            // })

            // TweenLite.to(this.arrowUp, 0.35, {

            //     opacity: 0.0

            // })

            // TweenLite.to(this.arrowDown, 0.35, {

            //     opacity: 0.0

            // })

            // TweenLite.to(this.refs['navLine3'], 0.35, {

            //     strokeDashoffset: 25,

            //     opacity: 0.0

            // })

            // TweenLite.to(this.refs['view'], 0.35, {

            //     opacity: 0.0

            // })

        })

    }

}

    shouldComponentUpdate(newProp, newState) {

        let isNavigating = this.state.navigating !== newState.navigating

        let percentUpdated = this.state.percent !== newState.percent

        let viewUpdated = this.state.targetView !== newState.targetView

        let prevIndexUpdated = this.state.prevIndex !== newState.prevIndex

        let indexUpdated = this.state.index !== newState.index

        let directionChanged = this.state.direction !== newState.direction

        return percentUpdated || viewUpdated || prevIndexUpdated || indexUpdated || isNavigating || directionChanged

    }

    componentWillUnmount() {

        emitter.off('dragStart', this.onDragStart.bind(this))
        
        emitter.off('dragStop', this.onDragStop.bind(this))
        
        emitter.off('dragMove', this.onDragMove.bind(this))

        emitter.off('update', this.onUpdate.bind(this))

    }

    onUpdate() {

        this.pos.x += (this.target.x - this.pos.x) * this.ease

        this.pos.y += (this.target.y - this.pos.y) * this.ease

        this.range = Math.round(map(Math.min(Math.max(this.increment, 0), 100), 0, 100, 0 , 4))
        
        this.container.style.transform = 'matrix(1, 0, 0, 1, ' + this.pos.x + ', ' + this.pos.y + ')'

        this.setState({percent: Math.round(map(this.increment, 0, 100, 0, 100)), targetView: this.views[this.range]})

    }

    onResize() {

        this.height = window.innerHeight * this.offSet

    }

    render() {

        return(

            <div className = "CuriousNav" ref = {(component) => {this.container = component}} style = {{width: this.props.size.x, height: this.props.size.y}}>

                {/* <div className = "Counter" ref = "counter">[ {this.state.percent + ' %'} ]</div> */}

                {/* <svg ref = {(element) => {this.navEl = element}} style = {{position: 'absolute', width: '100%', height: '100%', left: '0%', top: '5.75%'}}>
                    
                    <line className = "Line1" ref = "navLine1" x1 = {'20%'} y1 = {'40%'} x2 = {'20%'} y2 = {'50%'} />
                    
                    <line className = "Line2" ref = "navLine2" x1 = {'80%'} y1 = {'40%'} x2 = {'80%'} y2 = {'50%'} />


                </svg> */}

                {/* <svg className = "ArrowContainerUp" style ={{position: 'absolute', top: '20%', left: '47.5%', width: '20px', height: '10px'}}>

                    <polyline className = "ArrowUp" ref = {(arrow) => {this.arrowUp = arrow}} points = "0, 10, 10, 2.5, 20, 10"/>

                </svg> */}

                {/* <svg className = "ArrowContainerDown" style ={{position: 'absolute', top: '80%', left: '47.5%', width: '20px', height: '10px'}}> */}

                    {/* <polyline className = "ArrowDown" points = "0, 0, 25, 25, 50, 0"/> */}
                    {/* <polyline className = "ArrowDown" ref = {(arrow) => {this.arrowDown = arrow}} points = "0, 0, 10, 7.5, 20, 0"/> */}

                {/* </svg> */}

                {/* <div className = "View" ref = "view"> */}
                
                    {/* <p>{this.state.targetView}</p> */}
                    
                    {/* <p>{(this.range <= 0 ? ' ' : '0')}{this.range}</p> */}

                {/* </div> */}

                </div>
         
        )

    }

}