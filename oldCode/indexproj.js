import React, {
    Component
} from 'react'

import ReactDOM from 'react-dom'

import {
    projectCopy
} from './projectCopy.js'

import {
    TweenLite,
    TweenMax
} from 'gsap'

import InfoButton from './infoButton.js'

import eventEmitter from 'eventEmitter'

const emitter = eventEmitter.emitter

export default class Project extends Component {

    constructor(props) {

        super(props)

        this.props = props

        this.projectCopy = projectCopy

        this.state = {

            mounting: false,

            revealCopy: false

        }

        // this.revealText = this.revealText.bind(this)

    }

    componentDidMount() {

        this.lineLength = ReactDOM.findDOMNode(this.refs['titleContainer']).getBoundingClientRect().width

        ReactDOM.findDOMNode(this.refs['titleContainer']).style.strokeDasharray = this.lineLength

        ReactDOM.findDOMNode(this.refs['titleContainer']).style.strokeDashoffset = this.lineLength * -1

        // this.revealText()

        this.initEvents()

    }

    initEvents() {

        console.log('events inited')

        emitter.on('revealCopy', this.revealText.bind(this))

    }

    revealText() {

        console.log('revealing text')

        TweenLite.to(this, 0.5, {

            onComplete: () => {

                this.setState({
                    mounting: true,
                    revealCopy: true
                }, () => {

                    this.animate()

                })

            }

        })
        
    }

    prepareUnmount() {

        let promise = new Promise((resolve, reject) => {

            TweenLite.to(this, 0.5, {

                onStart: () => {

                    this.setState({
                        mounting: false,
                        revealCopy: false
                    }, () => {

                        this.animate()

                    })

                },

                onComplete: () => {

                    TweenLite.to(this, 0.5, {

                        onComplete: () => {

                            resolve()

                        }

                    })

                }

            })

        })

        return promise

    }

    animate() {

        this.domComponents = {

            title: ReactDOM.findDOMNode(this.refs['titleContainer']),

            description: ReactDOM.findDOMNode(this.refs['decrContainer']), //fix typo

            tech: ReactDOM.findDOMNode(this.refs['techContainer'])

        }

        if (this.state.mounting) {

            TweenLite.to(this.domComponents.title, 1.0, {

                ease: Sine.easeOut,
                x: 0,
                y: 0,
                opacity: 1.0,

                onStart: () => {

                    TweenLite.to(this.refs['titleLine'], 1.0, {

                        strokeDashoffset: 0.0,

                        // delay: 0.25,

                    })

                }

            })

            TweenLite.to(this.domComponents.description, 1.0, {

                ease: Sine.easeOut,
                x: 0,
                y: 0,
                opacity: 1.0

            })

            TweenLite.to(this.domComponents.tech, 1.0, {

                ease: Sine.easeOut,
                x: 0,
                y: 0,
                opacity: 1.0

            })

        } else {

            TweenLite.to(this.domComponents.title, 1.0, {

                ease: Sine.easeOut,
                x: -25,
                y: 0,
                opacity: 0.0,
                onStart: () => {

                    TweenLite.to(this.refs['titleLine'], 1.0, {

                        strokeDashoffset: this.lineLength * -1,

                    })

                }

            })

            TweenLite.to(this.domComponents.description, 1.0, {

                ease: Sine.easeOut,
                x: 0,
                y: 25,
                opacity: 0.0

            })

            TweenLite.to(this.domComponents.tech, 1.0, {

                ease: Sine.easeOut,
                x: 25,
                y: 0,
                opacity: 0.0

            })

        }

    }

    render() {

        return(

            <div className = "Projects" ref = "work">

            <InfoButton />

                <div className = "Title" ref = "titleContainer"><h3>{this.projectCopy[this.props.project].title}</h3>

                <svg className = "LineContainer">

                    {/* add a prop for setting length of line */}
                    <line className = "Line" ref ="titleLine" x1 = {'0%'} y1 = {0} x2 = {this.lineLength} y2 = {0} /> 

                </svg>

                </div>
                
                <div className = "Description" ref = "decrContainer">{this.projectCopy[this.props.project].description}</div>
                
                <div className = "Tech" ref = "techContainer">{this.projectCopy[this.props.project].tech}</div>
                
            </div>

        )

    }

}