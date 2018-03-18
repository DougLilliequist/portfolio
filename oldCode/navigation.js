// import React, {Component} from 'react'

// import ReactDOM from 'react-dom'

// import {TweenLite} from 'gsap'

// import {map} from 'math'

// import eventEmitter from 'eventEmitter'

// const emitter = eventEmitter.emitter

// import NavLine from './navLine.js'

// export default class Navigation extends Component {

//     constructor(props) {

//         super(props)

//         this.props = props
        
//         this.state = {

//             clicked: false,

//             prevIndex: null,

//             index: 0,

//             percent: 0,

//             targetView: ' '

//         }

//         this.pos = { //rename to circle

//             x: 0,

//             y: 0,

//             r: 0

//         }

//         this.countPosY = 0

//         this.target = {

//             x: 0,

//             y: 0

//         }

//         // this.ease = 0.15
//         this.ease = 1.0

//         this.views = []

//         this.views[0] = 'home' //omitt later

//         this.views[1] = 'Project: '
        
//         this.views[2] = 'Project: '
        
//         this.views[3] = 'Project: '
        
//         this.views[4] = 'Project: '
        
//         this.onMouseDown = this.onMouseDown.bind(this)

//     }

//     componentDidMount() {

//         window.addEventListener('mousemove', this.onMouseMove.bind(this))

//         window.addEventListener('mousedown', this.onMouseDown.bind(this))

//         window.addEventListener('mouseup', this.onMouseUp.bind(this))

//         window.addEventListener('resize', this.onResize.bind(this))

//         emitter.on('update', this.onUpdate.bind(this))

//         this.onHover = this.onHover.bind(this)
        
//         this.onHoverOut = this.onHoverOut.bind(this)

//         this.offSetX = ReactDOM.findDOMNode(this.refs['navCircle']).getBoundingClientRect().left + this.pos.r

//         this.offSetY = ReactDOM.findDOMNode(this.refs['navCircle']).getBoundingClientRect().top + this.pos.r

//         // this.startX = 25
//         // this.startX = ReactDOM.findDOMNode(this.refs['navCircle']).getBoundingClientRect().x

//         this.target.x = window.innerWidth * 0.5

//         this.target.y = window.innerHeight * 0.5

//         this.range = 0 //rename to something more index related

//         // this.target.y = 350 - this.offSetY

//         this.spawn()

//     }

//     onMouseDown(e) {

//         this.setState({clicked: true, prevIndex: this.state.index}, () => {

//             emitter.emit('dragStart', this.state.prevIndex) //rename

//             this.target.x = (e.clientX - this.offSetX)

//             this.target.y = (e.clientY - this.offSetY)

//             TweenLite.to(this.refs['navCircle'], 1.0, {

//                 attr: {

//                     r: 80

//                 }

//             })

//             TweenLite.to(this.refs['view'], 0.25, {

//                 opacity: 1.0

//             })

//             TweenLite.to(this.refs['counter'], 0.35, {

//                 opacity: 1.0

//             })

//             TweenLite.to(this.refs['navLine1'], 0.35, {

//                 strokeDashoffset: 0,
                
//                 opacity: 1.0

//             })

//             TweenLite.to(this.refs['navLine2'], 0.35, {

//                 strokeDashoffset: 0,

//                 opacity: 1.0

//             })

//         })
    
//     }

//     onMouseUp() {

//         this.setState({clicked: false, index: this.range}, () => {

//             // this.target.x = this.startX

//             TweenLite.to(this.refs['navCircle'], 1.0, {

//                 attr: {

//                     r: 10

//                 },

//             })

//             // emitter.emit('viewSelected', this.range)
            
//             emitter.emit('dragEnd', this.range)

//             // this.refs['navLine'].props = {visible: true}

//             TweenLite.to(this.refs['counter'], 0.35, {

//                 opacity: 0.0

//             })

//             TweenLite.to(this.refs['navLine1'], 0.35, {

//                 strokeDashoffset: -25,

//                 opacity: 0.0

//             })

//             TweenLite.to(this.refs['navLine2'], 0.35, {

//                 strokeDashoffset: 25,

//                 opacity: 0.0

//             })

//             TweenLite.to(this.refs['view'], 0.35, {

//                 opacity: 0.0

//             })  

//         })

//     }

//     onMouseMove(e) {

//         // if(this.state.clicked) {

//             this.target.x = (e.clientX - this.offSetX)

//             this.target.y = (e.clientY - this.offSetY)

//         // }

//     }

//     onHover(e) {

//     //     e.preventDefault()

//     //     if(this.state.clicked === false) {

//     //     TweenLite.to(this.refs['navCircle'], 0.5, {

//     //         attr: {

//     //             r: 20

//     //         }

//     //     })
    
//     // }

// }

//     onHoverOut(e) {
        
//     //     e.preventDefault()

//     //     if(this.state.clicked === false) {

//     //     TweenLite.to(this.refs['navCircle'], 0.5, {

//     //         attr: {

//     //             r: 10

//     //         }

//     //     })

//     // }

// }

//     shouldComponentUpdate(newState, newProps) {

//         let percentUpdated = this.state.percent !== newState.percent

//         let viewUpdated = this.state.targetView !== newState.targetView

//         return percentUpdated || viewUpdated

//     }

//     componentWillUnmount() {

//         window.removeEventListener('mousemove', this.onMouseMove.bind(this))

//         window.removeEventListener('mouseup', this.onMouseUp.bind(this))

//         window.removeEventListener('resize', this.onResize.bind(this))

//         emitter.off('update', this.onUpdate.bind(this))

//         this.onHover = null

//         this.onHoverOut = null

//     }

//     onUpdate() {

//         this.pos.x += (this.target.x - this.pos.x) * this.ease

//         this.pos.y += (this.target.y - this.pos.y) * this.ease

//         this.countPosY += (this.target.y - this.countPosY) * 0.015

//         this.range = Math.round(map(Math.min(Math.max(this.pos.y, 0), 550), 0, 550, 0 , 4))

//         this.refs['navCircle'].style.transform = 'matrix(1, 0, 0, 1, ' + this.pos.x + ', ' + this.pos.y + ')' //matrix transform this

//         this.refs['counter'].style.transform = 'matrix(1, 0, 0, 1, 0, ' + Math.min(Math.max(this.countPosY, 0), 550) + ')'

//         this.refs['navLine1'].style.transform = 'matrix(1, 0, 0, 1, 0, ' + Math.min(Math.max(this.countPosY, 0), 550) + ')'

//         this.refs['navLine2'].style.transform = 'matrix(1, 0, 0, 1, 0, ' + Math.min(Math.max(this.countPosY, 0), 550) + ')'

//         this.refs['view'].style.transform = 'matrix(1, 0, 0, 1, 0, ' + Math.min(Math.max(this.countPosY, 0), 550) + ')'

//         this.setState({percent: Math.round(map(Math.min(Math.max(this.pos.y, 0), 550), 0, 550, 0, 100)),
        
//         targetView: this.views[this.range]})

//     }

//     animate(val) { //rename to something more scroll related
        
//         // this.target.y = map(val, this.props.min, this.props.max, 0, 550)

//         // this.progress = map(val, this.props.min, this.props.max, 0, 100)

//         // this.refs['navLine'].animate(val, this.props.min, this.props.max) //akward solution, but animation works

//     }

//     spawn() {

//         TweenLite.to(this.refs['navCircle'], 0.35, {

//             attr: {

//                 r: 10

//             },

//             opacity: 1.0,

//             onStart: () => {

//                 this.pos.x = window.innerWidth * 0.5

//                 this.pos.y = window.innerHeight * 0.5

//             },

//             // onComplete: () => {

//             //     TweenLite.to(this, 0.15, {

//             //         onUpdate: () => {

//             //             this.pos.y += (this.target.y - this.pos.y) * this.ease

//             //         },

//             //         onComplete: () => {

//             //             this.ease = 0.15

//             //         }

//             //     })

//             // }

//             // onUpdate: () => {

//             //     this.pos.y += (this.target.y - this.pos.y) * this.ease

//             // },

//             // onComplete: () => {

//             //     this.ease = 0.15

//             // }

//         })

//     }

//     deSpawn() {

//         TweenLite.to(this.refs['navCircle'], {

//             opacity: 0.0

//         })

//     }

//     onResize() {

//         this.offSetX = ReactDOM.findDOMNode(this.refs['navCircle']).getBoundingClientRect().left + this.pos.r
        
//         this.offSetY = ReactDOM.findDOMNode(this.refs['navCircle']).getBoundingClientRect().top + this.pos.r

//     }

//     render() {

//         return(

//             <div className = "Navigation" ref = "nav">

//                 <div className = "Counter" ref = "counter">[ {this.state.percent + ' %'} ]</div>

//                 <svg style = {{width: '100%', height: '100%'}}>
//                 {/* <svg style = {{width: '150px', height: '400px'}}> */}

//                     <circle className = "NavCircle" ref = "navCircle" cx = {'84.5%'} cy = {'20%'} r = {this.pos.r} onMouseOver = {this.onHover} onMouseOut = {this.onHoverOut}/>
                    
//                     <line className = "Line1" ref = "navLine1" x1 = {150} y1 = {80} x2 = {175} y2 = {80} />
                    
//                     <line className = "Line2" ref = "navLine2" x1 = {175} y1 = {80} x2 = {200} y2 = {80} />

//                 </svg>

//                 {/* <NavLine  ref = "navLine" progress = {this.progress}/> */}

//                 <div className = "View" ref = "view">
                
//                     <p>{this.state.targetView}</p>
//                     <p>{(this.range <= 0 ? ' ' : '0')}{this.range}</p>

//                 </div>

//             </div>
            
//         )

//     }

// }