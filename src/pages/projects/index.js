import React, {
    Component
} from 'react'

import ReactDOM from 'react-dom'

import {
    projectCopy
} from './projectCopy.js'

import {
    TimelineLite, TweenLite, Circ, Power4,
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

        ReactDOM.findDOMNode(this.ltrBox1)

        console.log(this.ltrBox1)

        this.tl.fromTo(this.ltrBox1, 0.75, {ease: Power4.easeOut, scaleY: 0.0, transformOrigin: '0% top'}, {ease: Power4.easeOut, scaleY: 0.2, transformOrigin: '0% top'})
        
        this.tl.fromTo(this.ltrBox2, 0.75, {ease: Power4.easeOut, scaleY: 0.0, transformOrigin: '0% bottom'}, {ease: Power4.easeOut, scaleY: 0.2, transformOrigin: '0% bottom'}, "-= 0.75")

        // this.tl.fromTo(this.ltrBox1, 0.5, {scaleY: 0.0, transformOrigin: '0% top'}, {scaleY: 0.2, transformOrigin: '0% top'})
        
        // this.tl.fromTo(this.ltrBox2, 0.5, {scaleY: 0.0, transformOrigin: '0% bottom'}, {scaleY: 0.2, transformOrigin: '0% bottom'}, "-= 0.5")

        // this.tl.fromTo(this.ltrBox1, 0.5, {scaleY: 0.0, transformOrigin: '0% top'}, {scaleY: 0.2, transformOrigin: '0% top'})
        
        // this.tl.fromTo(this.ltrBox2, 0.5, {scaleY: 0.0, transformOrigin: '0% bottom'}, {scaleY: 0.2, transformOrigin: '0% bottom'}, "-= 0.5")


        this.tl.staggerFromTo([this.projectNumb, this.title], 0.5, {opacity: 0.0, x: 15}, {opacity: 1.0, x: 0}, 0.15, "-=0.8")

        // this.tl.staggerFromTo([this.textLine1, this.textLine2], 0.35, {strokeDashoffset: 50}, {strokeDashoffset: 0.0}, 0.1, " -= 0.15")

        this.tl.staggerFromTo([this.desc, this.role, this.tech], 0.5, {opacity: 0.0, x: -15}, {opacity: 1.0, x: 0}, 0.15, "-=0.6")

        // this.hideAnim = new TimelineLite({

        //     paused: true

        // })
        // this.tl.to(this.ltrBox1, 0.5, {height: this.projectVid.getBoundingClientRect().height * 0.2})


    }

    revealCopyIn() {

        // this.setState({viewingProject: true, revealCopy: true}, () => {

        // emitter.emit('enableExit', true)
        
        this.tl.kill()
        
        this.tl.play().timeScale(1)

        console.log(this.ltrBox1)

        // })


    }

    revealCopyOut() {

        // this.setState({viewingProject: false, revealCopy: false}, () => {
        // emitter.emit('enableExit', false)
        
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

    // componentDidUpdate(newProps, newState) {

    //     this.project.style.transform = 'matrix(1.0, 0.0, 0.0, 1.0, ' + 0.0 + ', ' + -this.props.pos + ')'

    // }

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

        // this.textLineContainer2.style.transform = 'matrix(1, 0, 0, 1, 0,' + this.role.getBoundingClientRect().y + ')'
        
        // this.textLineContainer1.style.transform = 'matrix(1, 0, 0, 1, 0,' + this.desc.getBoundingClientRect().y + ')'

        // this.ltrBox1.attributes.width = this.projectVid.getBoundingClientRect().width
        
        // this.ltrBox2.attributes.width = this.projectVid.getBoundingClientRect().width

        // this.ltrBox1.attributes.height = this.projectVid.getBoundingClientRect().height * 0.2
        
        // this.ltrBox2.attributes.height = this.projectVid.getBoundingClientRect().height * 0.2

        // this.ltrBox1.style.transform = 'translate(0%, 0%)'
        
        // this.ltrBox2.style.transform = 'translate(0%, 80%)'
        // this.ltrBox2.style.transform = 'translate(0px, ' + this.projectVid.getBoundingClientRect().height * 0.8 + 'px)'

        // console.log(this.ltrBox1.attributes)

        // this.tl.set(this.ltrBox1, {transformOrigin: '0%, top'})
        // this.tl.set(this.ltrBox2, {transformOrigin: '0%, bottom'})

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

                <div className = "ProjectVid" ref = {(video) => this.projectVid = video}>

                <svg ref = {(container) => this.letterBox = container} style = {{position: 'absolute', width: '100%', height: '100%'}}>

                {/* <rect className = "LetterBox1" ref = {(el) => this.ltrBox1 = el} transformorigin = {'50% top'} width = {'100%'} height = {'100%'} style ={{position: 'absolute', fill: 'rgba(255, 255, 255, 1)'}}/> */}
                {/* <rect className = "LetterBox2" ref = {(el) => this.ltrBox2 = el} transformorigin = {'50% bottom'} width = {'100%'} height = {'100%'} style ={{position: 'absolute', fill: 'rgba(255, 255, 255, 1)'}}/> */}

                <rect className = "LetterBox1" ref = {(el) => this.ltrBox1 = el} width = {'100%'} height = {'100%'} style ={{fill: 'rgba(255, 255, 255, 1)', transform: 'translate(0%, 0%)'}}/>
                
                <rect className = "LetterBox2" ref = {(el) => this.ltrBox2 = el} width = {'100%'} height = {'100%'} style ={{fill: 'rgba(255, 255, 255, 1)', transform: 'translate(0%, 0%)'}}/>
                
                
                {/* <rect className = "LetterBox1" ref = {(el) => this.ltrBox1 = el} style ={{position: 'absolute', width: '100%', height: '20%', fill: 'rgba(255, 255, 255, 1)', transform: 'scale(1.0, 1.0) translate(0%, 0%)'}}/>
                <rect className = "LetterBox2" ref = {(el) => this.ltrBox2 = el} style ={{position: 'absolute', width: '100%', height: '20%', fill: 'rgba(255, 255, 255, 1)', transform: 'translate(0%, 80%)'}}/> */}

                </svg>

                    <video autoPlay = {true} loop = {true} crossOrigin = {'Anonymous'}>

                        <source src = {this.projectCopy[this.props.project].vid} type = {'video/mp4'} />

                    </video>

                </div>  

            </div>              
            

        )

    }

}