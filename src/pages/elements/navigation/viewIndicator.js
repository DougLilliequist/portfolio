// import React, {
//     Component
// } from 'react'

// // import ReactRevalText from 'react-reveal-text'

// import {
//     TweenLite
// } from 'gsap'

// export default class ViewIndicator extends Component {

//     constructor(props) {

//         super(props)

//         this.state = {

//             currentView: ' ',

//             show: true

//         }

//     }

//     componentWillUpdate(newProps) {

//         if (this.props.currentPage !== newProps.currentPage) {

//             return true

//         }

//     }

//     updateText(v) {

//         if (this.state.currentView !== v) {

//             TweenLite.to(this.refs['viewLine'], 1.0, {

//                 strokeDashoffset: 18.0,

//                 opacity: 0.0,

//                 // ease: Sine.easeOut,

//                 onStart: () => {
//                     this.setState({
//                         show: false
//                     })

//                 },

//                 onComplete: () => {

//                     this.setState({
//                         currentView: '(' + v + ')'
//                     })

//                     TweenLite.to(this.refs['viewLine'], 1.0, {

//                         strokeDashoffset: 0.0,

//                         opacity: 1.0,

//                         // ease: Sine.easeOut,

//                         onComplete: () => this.setState({
//                             show: true
//                         })

//                     })

//                 }

//             })

//         }

//     }

//     render() {

//         return(

//             <div className = "ViewIndicator">
//                 <div className = "ViewIndicatorContainer">
//                 <svg style = {{width: '50px', height: '50px'}}>
//                     <line className = "Line" ref = 'viewLine' x1 = {0} y1 = {0} x2 = {18.5} y2 = {0.0} />
//                 </svg>
//                 <ReactRevalText className = "CurrentView" transitionTime = {250} delayMax = {800} show = {this.state.show}>{this.state.currentView}</ReactRevalText>
//                 </div>
//             </div>

//         )

//     }


// }