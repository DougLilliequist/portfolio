import React, {
    Component
} from 'react'

import ReactDOM from 'react-dom'

import {
    projectCopy
} from './projectCopy.js'

import {
    TimelineLite, TweenLite,
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

        this.events = new Events(this)

        this.events.enable()

        this.initAnim()

        // this.updateLayout()

        // this.transitionIn()

        // this.revealCopyIn()

        // console.log(this.project.getBoundingClientRect())
        
    }

    initAnim() {

        this.tl = new TimelineLite({

            paused: true

        })

        this.tl.staggerFromTo([this.projectNumb, this.title], 0.5, {opacity: 0.0, x: 15}, {opacity: 1.0, x: 0}, 0.15)

        // this.tl.staggerFromTo([this.textLine1, this.textLine2], 0.35, {strokeDashoffset: 50}, {strokeDashoffset: 0.0}, 0.1, " -= 0.15")

        this.tl.staggerFromTo([this.desc, this.role, this.tech], 0.5, {opacity: 0.0, x: -15}, {opacity: 1.0, x: 0}, 0.15, " += 0.35")

        // this.hideAnim = new TimelineLite({

        //     paused: true

        // })



    }

    revealCopyIn() {

        // this.setState({viewingProject: true, revealCopy: true}, () => {

        emitter.emit('enableExit', true)
        
        this.tl.kill()
        
        this.tl.play().timeScale(1)

        // })


    }

    revealCopyOut() {

        // this.setState({viewingProject: false, revealCopy: false}, () => {
        emitter.emit('enableExit', false)
        
        this.tl.kill()

        this.tl.reverse().timeScale(1.5)

        // })

    }

    transitionIn() {


    }

    transitionOut() {


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

        this.textLineContainer2.style.transform = 'matrix(1, 0, 0, 1, 0,' + this.role.getBoundingClientRect().y + ')'
        
        this.textLineContainer1.style.transform = 'matrix(1, 0, 0, 1, 0,' + this.desc.getBoundingClientRect().y + ')'

    }

    render() {

        return(

            <div className = "Project" ref = {(component) => {this.project = component}}>

            {/* <div className = "ProjectContainer"> */}

            <div className = "ProjectNumb" ref = {(numb) => {this.projectNumb = numb}}><h3>{'[ PROJECT : ' + this.projectCopy[this.props.project].number + ' ]'}</h3>
            
            {/* <svg className = "LineContainer" ref = {(container) => this.titleLineContainer = container} style = {{position: 'absolute', width: '35px', height: '2px', left: '16.25%', bottom: '3.5%'}}>

                <line className = "Line" ref = {(container) => this.titleLine = container} x1 = {0} y1 = {0} x2 = {100} y2 = {0} /> 

            </svg> */}
            
            
            </div>
            
                <div className = "Title" ref = {(title) => this.title = title}><h2>{this.projectCopy[this.props.project].title}</h2>

                {/* <svg className = "LineContainer"> */}

                    {/* <line className = "Line" ref = {(container) => this.titleLine = container} x1 = {0.0} y1 = {'7.5%'} x2 = {this.lineLength} y2 = {'7.5%'} />  */}

                {/* </svg> */}

                </div>

                <div className = "CopyContainer" ref = {(container) => this.copyContainer = container}>
                
                <div className = "Description" ref = {(desc) => this.desc = desc}><h5 style = {{margin: 0}}>{this.projectCopy[this.props.project].description}</h5></div>
                
                <div className = "Role" ref = {(role) => this.role = role}><b style = {{fontStyle: 'normal'}}>role: </b>{this.projectCopy[this.props.project].role}</div>
                
                <div className = "Tech" ref = {(tech) => this.tech = tech}><b style = {{fontStyle: 'normal'}}>tech: </b>{this.projectCopy[this.props.project].tech}</div>
                
                </div>

                {/* <svg className = "LineContainer1" ref = {(container) => this.textLineContainer1 = container} style = {{position: 'absolute', height: '2px', width: '35px', top: '0.75%', left: '18.25%'}}> */}

                    {/* <line className = "TextLine1" ref = {(line) => this.textLine1 = line} x1 = {0} y1 = {0} x2 = {50} y2 = {0}/> */}

                {/* </svg> */}

                {/* <svg className = "LineContainer2" ref = {(container) => this.textLineContainer2 = container} style = {{position: 'absolute', height: '2px', width: '35px', top: '0.75%', left: '18.25%'}}> */}

                    {/* <line className = "TextLine2" ref = {(line) => this.textLine2 = line} x1 = {0} y1 = {0} x2 = {50} y2 = {0}/> */}

                {/* </svg> */}

                <div className = "ProjectVid" ref = {(video) => this.projectVid = video}>

                    <video autoPlay = {true} loop = {true} crossOrigin = {'Anonymous'}>

                        <source src = {this.projectCopy[this.props.project].vid} type = {'video/mp4'} />

                    </video>

                </div>  

                </div>              
            
            // </div>

        )

    }

}