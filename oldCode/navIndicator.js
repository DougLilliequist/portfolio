// import React, {Component} from 'react'

// import ReactDOM from 'react-dom'

// import {TweenLite} from 'gsap'

// import {map} from 'math'

// import eventEmitter from 'eventEmitter'

// const emitter = eventEmitter.emitter

// export default class NavIndicator extends Component {

//     constructor(props) {

//         super(props)

//         this.props = props
        
//         this.state = {

//             clicked: false,

//             percent: 0,

//             targetView: ' '

//         }

//         this.views = []

//         this.views[0] = 'home' //omitt later

//         this.views[1] = 'DOLI'
        
//         this.views[2] = 'We\'re all Human'
        
//         this.views[3] = 'Internship Project'
        
//         this.views[4] = 'Good Night SweetHeart'
        
//         // this.onMouseDown = this.onMouseDown.bind(this)

//     }

//     componentDidMount() {

//         // window.addEventListener('mousemove', this.onMouseMove.bind(this))

//         // window.addEventListener('mouseup', this.onMouseUp.bind(this))

//         emitter.on('update', this.onUpdate.bind(this))

//         this.offSetY = this.props.offsetY

//         this.targetY = 0

//         this.range = 0 //rename to something more index related

//     }

//     onMouseDown() {

//         this.setState({clicked: true, prevIndex: this.state.index}, () => {

//             TweenLite.to(this.refs['view'], 0.25, {

//                 opacity: 1.0

//             })

//             TweenLite.to(this.refs['counter'], 0.35, {

//                 opacity: 1.0

//             })

//             TweenLite.to(this.refs['navLine'], 0.35, {

//                 opacity: 1.0

//             })

//         })
    
//     }

//     onMouseUp() {

//         this.setState({clicked: false, index: this.range}, () => {

//             // emitter.emit('viewSelected', this.range)
//             emitter.emit('dragEnd', this.range)

//             TweenLite.to(this.refs['navCircle'], 0.25, {

//                 css: {

//                     transform: 'matrix(1.0, 0, 0, 1.0, 0, 0)'

//                 }

//             })

//             TweenLite.to(this.refs['counter'], 0.35, {

//                 opacity: 0.0

//             })

//             TweenLite.to(this.refs['navLine'], 0.35, {

//                 opacity: 0.0

//             })

//             TweenLite.to(this.refs['view'], 0.35, {

//                 opacity: 0.0

//             })  

//         })

//     }

//     onMouseMove(e) {

//         if(this.state.clicked) {

//             this.mouse.x = e.pageX

//             this.mouse.y = e.clientY - (this.offSetY)

//         }

//     }

//     // componentDidUpdate(newState, newProps) {

//     //     const clicked = this.state.clicked !== newState.clicked
        
//     //     if(clicked === true) {

//     //         TweenLite.to(this.refs['view'], 0.25, {

//     //             opacity: 1.0

//     //         })

//     //     } else if(clicked === false) {

//     //         TweenLite.to(this.refs['view'], 0.25, {

//     //             opacity: 0.0

//     //         })  

//     //     }

//     // }

//     shouldComponentUpdate(newState, newProps) {

//         let percentUpdated = this.state.percent !== newState.percent

//         let viewUpdated = this.state.targetView !== newState.targetView

//         return percentUpdated || viewUpdated

//     }

//     onUpdate() {

//         if(this.state.clicked) {

//             this.pos.x += (this.mouse.x - this.pos.x) * 0.15
        
//             this.pos.y += (this.mouse.y - this.pos.y) * 0.15

//             this.range = Math.round(map(Math.min(Math.max(this.pos.y, 0), 350), 0, 350, 0 , 4))

//             this.refs['counter'].style.transform = 'matrix(1, 0, 0, 1, 0, ' + Math.min(Math.max(this.pos.y, 0), 350) + ')'

//             this.refs['navLine'].style.transform = 'matrix(1, 0, 0, 1, 0, ' + Math.min(Math.max(this.pos.y, 0), 350) + ')'

//             this.refs['view'].style.transform = 'matrix(1, 0, 0, 1, 0, ' + Math.min(Math.max(this.pos.y, 0), 350) + ')'

//             this.setState({percent: Math.round(map(Math.min(Math.max(this.pos.y, 0), 350), 0, 350, 0, 100)),
//             targetView: this.views[this.range]})

//         } else {

//             // this.pos.y += (this.targetY - this.pos.y) * 0.15

//             // this.refs['navCircle'].style.transform = 'matrix(1, 0, 0, 1, 0, ' + Math.min(Math.max(this.pos.y, 0), 350) + ')' //matrix transform this

//         }

//     }

//     animate(val) {
        
//         // TweenLite.to(this.refs['navCircle'], 0.5, {

//         //     y: map(val, this.props.min, this.props.max, 0, 350),
            
//         //     x: 0

//         // })

//         this.targetY = map(val, this.props.min, this.props.max, 0, 350)

//     }

//     render() {

//         return(

//             <div className = "Navigation" ref = "nav">

//             <NavButton ref = 'navCircle'/>

//                 {/* <div className = "Counter" ref = "counter">{this.state.percent + ' %'}</div>

//                 <svg style ={{width: '50px', height: '450px'}}>

//                     <circle className = "NavCircle" ref = "navCircle" cx = {25} cy = {50} r = {8.5} 
//                     onMouseDown = {this.onMouseDown} />

//                     <line className = "Line" ref = "navLine" x1 = {0} y1 = {80} x2 = {50} y2 = {80} />

//                 </svg>

//                 <div className = "View" ref = "view">{this.state.targetView}</div> */}

//             </div>
            
//         )

//     }

// }