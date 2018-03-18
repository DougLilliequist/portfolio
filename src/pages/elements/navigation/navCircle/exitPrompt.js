import React, {
    Component
} from 'react'

import ReactDOM from 'react-dom'

import {
    TweenLite
} from 'gsap'

import eventEmitter from 'eventEmitter'

const emitter = eventEmitter.emitter

export default class ExitPrompt extends Component {

    constructor(props) {

        super(props)

        this.props = props

        this.state = {

            enabled: false,

            reveal: false

        }

        this.pos = {

            x: 0,

            y: 0

        }

        this.target = {

            x: 0,

            y: 0

        }

    }

    componentDidMount() {

        this.initEvents()

    }

    initEvents() {

        emitter.on('enableExit', (b) => this.setState({enabled: b}))

        emitter.on('revealExit', this.reveal.bind(this))

        emitter.on('mouseMove', this.onMouseMove.bind(this))

        emitter.on('update', this.onUpdate.bind(this))

        this.offSetX = ReactDOM.findDOMNode(this.container).getBoundingClientRect().width * 0.5

        this.offSetY = ReactDOM.findDOMNode(this.container).getBoundingClientRect().height * 0.5

        TweenLite.set(this.message, {

            opacity: 0.0

        })

    }

    onMouseMove(e) {

        this.target.x = e.clientX - this.offSetX

        this.target.y = e.clientY - this.offSetY

    }

    onUpdate() {

        this.pos.x += (this.target.x - this.pos.x) * 1.0

        this.pos.y += (this.target.y - this.pos.y) * 1.0

        this.container.style.transform = 'matrix(1, 0, 0, 1, ' + (this.pos.x) + ', ' + (this.pos.y) + ')' //apply offset with text container boundingrect

    }

    componentDidUpdate() {

        if (this.state.enabled === false) {

            TweenLite.killTweensOf(this.message)

            TweenLite.killTweensOf(this.exitLine)

            TweenLite.to(this.message, 0.25, {

                opacity: 0.0,

            })

            TweenLite.to(this.exitLine, 0.25, {

                opacity: 0.0

            })

        } else {

            return
            
        }

    }

    reveal(b) {

        if (this.state.enabled) {

            this.setState({reveal: b}, () => {

                TweenLite.killTweensOf(this.message)

                TweenLite.killTweensOf(this.exitLine)

                if(this.state.reveal) {

                TweenLite.to(this.exitLine, 0.25, {

                    strokeDashoffset: (this.state.reveal) ? 0 : 25,

                    opacity: (this.state.reveal) ? 1.0 : 0.0,

                    onComplete: () => {

                        TweenLite.to(this.message, 0.25, {

                            opacity: (this.state.reveal) ? 1.0 : 0.0,
        
                        })

                    }

                })

            } else {

                TweenLite.to(this.message, 0.25, {

                    opacity: (this.state.reveal) ? 1.0 : 0.0,

                    onComplete: () => {

                        TweenLite.to(this.exitLine, 0.25, {

                            strokeDashoffset: (this.state.reveal) ? 0 : 25,

                            opacity: (this.state.reveal) ? 1.0 : 0.0,
        
                        })

                    }

                })


            }

            })

        }

    }

    componentWillUnmount() {

        TweenLite.killTweensOf(this.message)

        emitter.off('revealExit', this.reveal.bind(this))

    }

    render() {

        return (

            <div className = "Message" ref = {(component) => {this.container = component}}>

                <p ref = {(component) => {this.message = component}} style = {{margin: '0', position: 'absolute', top: '40%', left: '80%'}}> [ exit ] </p>

                <svg style = {{position: 'absolute', width: '25px', height: '10px', top: '50%', left: '65.75%'}}>

                    <line className = "ExitLine" ref = {(el) => {this.exitLine = el}} x1 = {0} y1 = {0} x2 = {25} y2 = {0}/>

                </svg>

            </div>

        )

    }

}