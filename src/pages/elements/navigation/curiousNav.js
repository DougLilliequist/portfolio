import React, {Component} from 'react'

import ReactDOM from 'react-dom'

import {TweenMax} from 'gsap'

import {translate} from 'helpers'

import GlitchText from '../glitchText.js'

import eventEmitter from 'eventEmitter'

const emitter = eventEmitter.emitter

export default class CuriousNav extends Component {

    constructor(props) {

        super(props)

        this.state = {

            reveal: false,

            targetProject: null

        }

        this.pos = {

            x: 0,

            y: 0

        }

    }

    componentDidMount() {

        this.initEvents()

    }

    initEvents() {

        emitter.on('stick', this.onFocus.bind(this)) //rename!

        emitter.on('unStick', this.onUnFocus.bind(this))

        emitter.on('viewSelected', this.onSelected.bind(this))

        // emitter.on('unStick', this.onUnFocus.bind(this))

        // emitter.on('resizing', this.onResize.bind(this))

    }

    onFocus(el) {

        this.setState({reveal: true, targetProject: el.project}, () => {

            this.pos.x = el.x

            this.pos.y = el.y

        })

    }

    onSelected() {

        this.setState({reveal: false})

    }

    onUnFocus() {

        this.setState({reveal: false})

    }

    componentDidUpdate(newProp, newState) {

        if(this.state.reveal !== newState.reveal) {

            this.animate()

        }

    }

    animate() {

        //need to replace this with a staggering timeline event to reduce the opacity of the release to view message

        const targets = [ReactDOM.findDOMNode(this.title), ReactDOM.findDOMNode(this.message)]

        TweenMax.killTweensOf(this.title)
        
        TweenMax.killTweensOf(this.message)

        TweenMax.staggerTo(targets, 0.5, {

            opacity: (this.state.reveal) ? 1.0 : 0.0,

            onStart: () => {

                this.offsetX = ReactDOM.findDOMNode(this.container).getBoundingClientRect().width

                this.offsetY = ReactDOM.findDOMNode(this.container).getBoundingClientRect().height
        
                // this.title.innerText = '[ PROJECT : ' + this.state.targetProject + ' ]'

                // this.titleText.props = {text: '[ PROJECT : ' + this.state.targetProject + ' ]'}
        
                this.container.style.transform = translate({x: this.pos.x - this.offsetX, y: (this.pos.y - this.offsetY) - 50})

            }

        }, (this.state.reveal) ? 0.25 : -0.1)

        TweenMax.to(this.messageLine, (this.state.reveal) ? 0.25 : 0.1, {

            strokeDashoffset: (this.state.reveal) ? 0 : -25,

            onComplete: () => {

                TweenMax.set(this.messageLine, {

                    strokeDashoffset: (this.state.reveal) ? 0 : 25

                })

            }

        })

    }

    render() {

        return(

            <div className = "CuriousNav" ref = {(el) => this.container = el}>
            
                <div className = "TitleContainer" ref = {(container) => this.titleContainer = container}>
                
                <h2 className = "CuriousTitle" ref = {(el) => this.title = el}><GlitchText glitch = {this.state.reveal} text = {'[ PROJECT : ' + this.state.targetProject + ' ]'}/></h2>
                
                </div>

                <div className = "MessageContainer" ref = {(container) => this.messageContainer = container}>

                        <p className = "CuriousMessage" ref = {(el) => this.message = el}>( release to view )</p>

                        <svg className = "CuriousLineContainer2" style = {{position: 'absolute', width: '25px', height: '2px', bottom: '0%', left: '-5.25%'}}>

                            <line className = "CuriousLine2" ref = {(line) => this.messageLine = line} x1 = {0} y1 = {0} x2 = {25} y2 = {0}/>

                        </svg>

                </div>

            </div>


        )

    }

}