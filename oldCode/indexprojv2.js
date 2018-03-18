import React, {
    Component
} from 'react'

import ReactDOM from 'react-dom'

import {
    projectCopy
} from './projectCopy.js'

import {
    TweenLite,
} from 'gsap'

import Events from './events.js'

import InfoButton from './infoButton.js'

import eventEmitter from 'eventEmitter'

const emitter = eventEmitter.emitter

// import TransitionGroup from 'react-transition-group/TransitionGroup'

export default class Project extends Component {

    constructor(props) {

        super(props)

        this.props = props

        this.projectCopy = projectCopy

        this.state = {

            mounting: false,

            viewingProject: false,

            revealCopy: false,

        }

    }

    componentDidMount() {

        this.domComponents = {

            title: ReactDOM.findDOMNode(this.refs['titleContainer']),

            description: ReactDOM.findDOMNode(this.refs['decrContainer']), //fix typo

            role: ReactDOM.findDOMNode(this.refs['roleContainer']),

            tech: ReactDOM.findDOMNode(this.refs['techContainer']),

            button: ReactDOM.findDOMNode(this.button),

            number: ReactDOM.findDOMNode(this.projectNumb)

        }

        this.lineLength = ReactDOM.findDOMNode(this.refs['titleContainer']).getBoundingClientRect().width

        this.domComponents.title.style.strokeDasharray = this.lineLength

        this.domComponents.title.style.strokeDashoffset = this.lineLength * -1

        this.updateLayout()

        this.events = new Events(this)

        this.events.enable()
        
        // this.transitionIn()

        // this.revealCopyIn()
        
    }

    revealCopyIn() {

        this.setState({viewingProject: true, revealCopy: true}, () => {

        // emitter.emit('enableExit', true)

        // emitter.emit('blurDOLI', 1.0)

        Object.keys(this.domComponents).map((component) => TweenLite.killTweensOf(component))

        TweenLite.to(this.domComponents.title, 1.0, {

            ease: Sine.easeOut,
            x: 0,
            y: 0,
            opacity: 1.0,

            onStart: () => {

                TweenLite.to(this.titleLine, 1.0, {

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

        })


    }

    revealCopyOut() {

        this.setState({viewingProject: false, revealCopy: false}, () => {

        // emitter.emit('enableExit', false)
        
        // emitter.emit('blurDOLI', 0.0)

        Object.keys(this.domComponents).map((component) => TweenLite.killTweensOf(component))

        TweenLite.to(this.domComponents.title, 1.0, {

            ease: Sine.easeOut,
            x: 0,
            y: 0,
            opacity: 0.0,
            onStart: () => {

                TweenLite.to(this.titleLine, 1.0, {

                    strokeDashoffset: this.lineLength * -1,

                })

            }

        })

        TweenLite.to(this.domComponents.description, 1.0, {

            ease: Sine.easeOut,
            x: 0,
            y: 0,
            opacity: 0.0

        })

        TweenLite.to(this.domComponents.tech, 1.0, {

            ease: Sine.easeOut,
            x: 0,
            y: 0,
            opacity: 0.0

        })

        })

    }

    transitionIn() {

        TweenLite.killTweensOf(this.domComponents.button)
        
        // TweenLite.killTweensOf(this.domComponents.number)

        // TweenLite.to(this.domComponents.button, 0.5, {

        //     opacity: 1.0

        // })

        // TweenLite.to(this.domComponents.number, 0.5, {

        //     opacity: 1.0

        // })

    }

    transitionOut() {

        TweenLite.killTweensOf(this.domComponents.button)
        
        // TweenLite.killTweensOf(this.domComponents.number)

        // TweenLite.to(this.domComponents.button, 0.25, {

        //     opacity: 0.0

        // })

        // TweenLite.to(this.domComponents.number, 0.25, {

        //     opacity: 0.0

        // })

    }

    componentWillEnter(callback) {

        TweenLite.killTweensOf(this)

        TweenLite.to(this, 0.15, {

            onStart: () => {
                this.transitionIn()
                // console.log('called')
            },

            onComplete: callback

        })

    }

    // componentDidEnter() {

    //     this.transitionIn()

    // }

    componentWillLeave(callback) {

        // TweenLite.killTweensOf(this)

        TweenLite.to(this, 0.15, {

            onStart: () => {
                
                // console.log('project called when it shouldnt?')

                this.transitionOut()

            },

            onComplete: callback
        
        })

    }

    componentDidUpdate() {

        this.updateLayout()
        
    }

    updateLayout() {

        this.textLineContainer1.style.transform = 'matrix(1, 0, 0, 1, 0,' + this.domComponents.description.getBoundingClientRect().y + ')'

        this.textLineContainer2.style.transform = 'matrix(1, 0, 0, 1, 0,' + this.domComponents.role.getBoundingClientRect().y + ')'

    }

    // componentWillUnmount() {

    //     console.log('unmounting')

    //     // if(this.state.viewingProject) {

    //     //     emitter.emit('blurDOLI', 0.0)

    //     // }

    //     this.transitionOut()

    //     this.events.disable()

    // }

    render() {

        return(

            <div className = "Projects" ref = {(component) => {this.project = component}}>

            <div className = "ProjectNumb" ref = {(numb) => {this.projectNumb = numb}}><h3>{'[ PROJECT : ' + this.projectCopy[this.props.project].number + ' ]'}</h3>
            
            <svg className = "LineContainer" ref = {(container) => this.titleLineContainer = container} style = {{position: 'absolute', width: '35px', height: '2px', left: '16.25%', bottom: '3.5%'}}>

                <line className = "Line" ref = {(container) => this.titleLine = container} x1 = {0} y1 = {0} x2 = {100} y2 = {0} /> 

            </svg>
            
            
            </div>
            
            {/* <InfoButton ref = {(button) => {this.button = button}} enabled = {this.state.revealCopy} onMouseDown = {this.revealCopyIn.bind(this)}/> */}

            <div className = "ProjectsContainer" ref = {(container) => {this.projectContainer = container}}>

                <div className = "Title" ref = "titleContainer"><h2>{this.projectCopy[this.props.project].title}</h2>

                {/* <svg className = "LineContainer"> */}

                    {/* <line className = "Line" ref = {(container) => this.titleLine = container} x1 = {0.0} y1 = {'7.5%'} x2 = {this.lineLength} y2 = {'7.5%'} />  */}

                {/* </svg> */}

                </div>

                <div className = "CopyContainer" ref = {(container) => this.copyContainer = container}>
                
                <div className = "Description" ref = "decrContainer"><h5 style = {{margin: 0}}>{this.projectCopy[this.props.project].description}</h5></div>
                
                <div className = "Role" ref = "roleContainer"><b style = {{fontStyle: 'normal'}}>role: </b>{this.projectCopy[this.props.project].role}</div>
                
                <div className = "Tech" ref = "techContainer"><b style = {{fontStyle: 'normal'}}>tech: </b>{this.projectCopy[this.props.project].tech}</div>
                
                </div>

                <svg className = "LineContainer1" ref = {(container) => this.textLineContainer1 = container} style = {{position: 'absolute', height: '2px', width: '35px', top: '0.75%', left: '18.25%'}}>

                    <line className = "TextLine1" ref = {(line) => this.textLine1 = line} x1 = {0} y1 = {0} x2 = {50} y2 = {0}/>

                </svg>

                <svg className = "LineContainer2" ref = {(container) => this.textLineContainer2 = container} style = {{position: 'absolute', height: '2px', width: '35px', top: '0.75%', left: '18.25%'}}>

                    <line className = "TextLine2" ref = {(line) => this.textLine2 = line} x1 = {0} y1 = {0} x2 = {50} y2 = {0}/>

                </svg>
                
                </div>

            </div>

        )

    }

}