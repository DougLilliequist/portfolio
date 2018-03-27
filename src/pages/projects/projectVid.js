import React, {Component} from 'react'

import ReactDOM from 'react-dom'

import {TweenLite, TimelineLite} from 'gsap'

export default class ProjectVid extends Component {

    constructor(props) {

        super(props)

        this.state = {

            hovered: false

        }

        this.props = props

    }

    componentDidMount() {


        this.initAnim()

    }

    initAnim() {

        this.hoverAnim = new TimelineLite({

            paused: true

        })

        this.hoverAnim.fromTo(this.vid, 0.5, {ease: Power4.easeOut, opacity: 1.0}, {ease: Power4.easeOut, opacity: 0.4})

        this.hoverAnim.fromTo(this.letterBox, 0.75, {ease: Power4.easeOut, scaleY: 0.0, transformOrigin: '0% top'}, {ease: Power4.easeOut, scaleY: 1.0, transformOrigin: '0% top'}, "-=0.5")
        
        this.hoverAnim.fromTo(this.letterBox2, 0.75, {ease: Power4.easeOut, scaleY: 0.0, transformOrigin: '0% bottom'}, {ease: Power4.easeOut, scaleY: 1.0, transformOrigin: '0% bottom'}, "-=0.75")

    }

    componentDidUpdate(prevProps, prevState) {

        if(this.state.hovered !== prevState.hovered) {

            this.hoverAnim.kill()

            if(this.state.hovered) {
                
                this.hoverAnim.play().timeScale(1.0)

            } else {

                this.hoverAnim.reverse().timeScale(1.5)

            }

        }

    }

    render() {

        return (
        
        <div className = "ProjectVid" ref = {(video) => this.projectVid = video} onMouseEnter = {()=> this.setState({hovered: true})} onMouseLeave = {()=> this.setState({hovered: false})}>

            <div className = "VideoContainer">

            <video ref = {(vid) => this.vid = vid} autoPlay = {true} loop = {true} crossOrigin = {'Anonymous'}>

                <source src = {this.props.src} type = {'video/mp4'} />

            </video>

            </div>

            <div className = 'LetterBoxContainer' ref = {(container) => this.letterBoxContainer = container}>

                <svg ref = {(container) => this.letterBox = container} style = {{position: 'absolute', width: '100%', height: '20%', top: '-1%', left: '0%', zIndex: '5'}}>

                    <rect className = "LetterBox1" ref = {(el) => this.ltrBox1 = el} width = {'100%'} height = {'100%'} style ={{position: 'absolute', fill: 'rgba(255, 255, 255)', pointerEvents: 'none'}}/>

                </svg>

                <svg ref ={(container) => this.letterBox2 = container} style = {{position: 'absolute', width: '100%', height: '20%', bottom: '-1%', left: '0%', zIndex: '5'}}>

                    <rect className = "LetterBox2" ref = {(el) => this.ltrBox2 = el} width = {'100%'} height = {'100%'} style ={{position: 'absolute', fill: 'rgba(255, 255, 255)', pointerEvents: 'none'}}/>

                </svg>

            </div>

        </div>

        )

    }

}