import React, {
    Component
} from 'react'

import ReactDOM from 'react-dom'

import {
    projectCopy
} from './projectCopy.js'

import {
    TimelineLite, TweenLite, Power4
} from 'gsap'

import GlitchText from '../elements/glitchText.js'

import Events from './events.js'

import eventEmitter from 'eventEmitter'

const emitter = eventEmitter.emitter

export default class Project extends Component {

    constructor(props) {

        super(props)

        this.props = props

        this.projectCopy = projectCopy

        this.state = {

            mounting: false,

            viewingProject: false,

            revealCopy: false,

            hovering: false,

            revealLink: false

        }

        this.hintClick = this.hintClick.bind(this)

    }

    componentDidMount() {

        // this.events = new Events(this)

        // this.events.enable()

        this.initAnim()
        
    }

    initAnim() {

        this.tl = new TimelineLite({

            paused: true

        })

        this.tl.fromTo(this.letterBox, 0.75, {ease: Power4.easeOut, scaleY: 0.0, transformOrigin: '50% top'}, {ease: Power4.easeOut, scaleY: 1.0, transformOrigin: '50% top'})
        
        this.tl.fromTo(this.letterBox2, 0.75, {ease: Power4.easeOut, scaleY: 0.0, transformOrigin: '0% bottom'}, {ease: Power4.easeOut, scaleY: 1.0, transformOrigin: '0% bottom'}, "-=0.75")

        this.tl.fromTo(this.title, 0.8, {opacity: 0.0, y: -10}, {opacity: 1.0, x: 0.0}, '-=0.7')
        
        this.tl.fromTo(this.projectNumb, 0.5, {opacity: 0.0, x: 8}, {opacity: 1.0, x: 0.0}, '-=0.5')
        
        this.tl.fromTo(this.link, 0.5, {delay: 0.4, opacity: 0.0, x: -15}, {delay: 0.4, opacity: 1.0, x: 0, onStart: ()=> this.setState({revealLink: true})}, 0.15, "-=0.7")

        this.tl.staggerFromTo([this.numbLine, this.descLine], 0.8, {opacity: 0.0, x: -50}, {opacity: 1.0, x: 0}, 0.18, " += 0.15")

        this.tl.fromTo(this.desc, 0.5, {opacity: 0.0, x: 8}, {opacity: 1.0, x: 0}, '-=0.7')

        this.tl.staggerFromTo([this.ctx, this.role, this.tech], 0.5, {ease: Circ.easeIn, opacity: 0.0, y: 30}, {ease: Circ.easeOut, opacity: 1.0, y: 0}, 0.15, "-=0.6")


    }

    hintClick() {

        this.setState({hovering: !this.state.hovering}, () => {

            emitter.emit('hintClick', this.state.hovering)

            TweenLite.to(this.linkText, 0.35, {

                ease: Sine.easeInOut,

                // scale: this.state.hovering ? 1.025 : 1.0,

                opacity: this.state.hovering ? 1.0 : 0.7

            })

        })

    }



    componentDidUpdate(prevProps, prevState) {

        if(prevState.viewingProject !== this.state.viewingProject) {

            if(this.state.viewingProject) {

            this.tl.kill()

            TweenLite.killTweensOf(this.vid)

            TweenLite.to(this.vid, 0.75, {

                opacity: 0.4

            })
        
            this.tl.play().timeScale(1)

            } else if (!this.state.viewingProject) {

            this.tl.kill()

            TweenLite.killTweensOf(this.vid)

            TweenLite.to(this.vid, 0.75, {

                delay: 0.5,
                opacity: 1.0
            
            })

            this.tl.reverse().timeScale(1.5)

            }

        }

        if(this.state.hovering !== prevState.hovering) {

            emitter.emit('linkHovered', this.state.hovering)

        }

    }

    render() {

        return(

            <div className = "Project" ref = {(component) => {this.project = component}}>
            
                <div className = "CopyContainer" ref = {(container) => this.copyContainer = container}>

                    <div className = "ProjectNumb" ref = {(numb) => {this.projectNumb = numb}}><p>{'( PROJECT : ' + this.projectCopy[this.props.project].number + ' )'}</p>
            
            <svg className = "LineContainer" ref = {(container) => this.numbLine = container} style = {{position: 'relative', width: '2.5vw', height: '2px', marginRight: '1em'}}>

                <line className = "Line" x1 = {0} y1 = {0} x2 = {100} y2 = {0} /> 

            </svg>

            </div>

                {/* <div className = "Title" ref = {(title) => this.title = title}><h2>{this.projectCopy[this.props.project].title}</h2></div> */}
                
                <div className = "Title" ref = {(title) => this.title = title}><h2><GlitchText text = {this.projectCopy[this.props.project].title} glitch = {this.state.viewingProject} delay = {0.0} speed = {0.01 / (this.projectCopy[this.props.project].title.length * 0.1)}/></h2></div>
                
                <div className = "Description" ref = {(desc) => this.desc = desc}><p style = {{margin: 0}}>{this.projectCopy[this.props.project].description}</p>
                
                <svg className = "LineContainer" ref = {(container) => this.descLine = container} style = {{position: 'relative', width: '2.5vw', height: '2px', marginRight:'1em'}}>

<line className = "Line" x1 = {0} y1 = {0} x2 = {100} y2 = {0} /> 

</svg>
                
                </div>
                
                <div className = "ProjectInfo" ref = {(container) => this.projectInfo = container}>

                <div className = "Context" ref = {(el) => this.ctx = el}><b style = {{fontStyle: 'normal'}}>Context: </b>{this.projectCopy[this.props.project].context}<b style = {{fontStyle: 'normal'}}></b></div>
                
                <div className = "Role" ref = {(el) => this.role = el}><b style = {{fontStyle: 'normal'}}>Role: </b>{this.projectCopy[this.props.project].role}<b style = {{fontStyle: 'normal'}}></b></div>                
                
                <div className = "Tech" ref = {(el) => this.tech = el}><b style = {{fontStyle: 'normal'}}>Tech: </b>{this.projectCopy[this.props.project].tech}<b style = {{fontStyle: 'normal'}}></b></div>

                {/* <div className = "Context" ref = {(el) => this.ctx = el}><b style = {{fontStyle: 'normal'}}>Context: </b><GlitchText text = {this.projectCopy[this.props.project].context} glitch = {this.state.viewingProject} delay = {0.15} speed = {0.01 / (this.projectCopy[this.props.project].context.length * 0.5)}/><b style = {{fontStyle: 'normal'}}></b></div> */}
                
                {/* <div className = "Role" ref = {(el) => this.role = el}><b style = {{fontStyle: 'normal'}}>Role: </b><GlitchText text = {this.projectCopy[this.props.project].role} glitch = {this.state.viewingProject} delay = {0.3} speed = {0.01 / (this.projectCopy[this.props.project].role.length * 0.5)}/><b style = {{fontStyle: 'normal'}}></b></div>                 */}
                
                {/* <div className = "Tech" ref = {(el) => this.tech = el}><b style = {{fontStyle: 'normal'}}>Tech: </b><GlitchText text = {this.projectCopy[this.props.project].tech} glitch = {this.state.viewingProject} delay = {0.4} speed = {0.01 / (this.projectCopy[this.props.project].tech.length * 0.5)}/><b style = {{fontStyle: 'normal'}}></b></div> */}

                 {/* <svg className = "LineContainer" ref = {(container) => this.projectLine = container} style = {{position: 'relative', width: '2.5vw', height: '100%', marginRight: '2em'}}>

                    <line className = "Line" x1 = {0} y1 = {0} x2 = {100} y2 = {0}/> 

                </svg> */}

                </div>

                </div>

                <div className = "ProjectVid" ref = {(video) => this.projectVid = video} onMouseEnter = {()=> this.setState({viewingProject: true})} onMouseLeave = {()=> this.setState({viewingProject: false})}>

                           <div className = "ProjectLink" ref = {(el) => this.link = el} onMouseEnter = {this.hintClick} onMouseLeave = {this.hintClick}>
                           
                           {this.projectCopy[this.props.project].link === ' ' ? <div className = "Link"><p ref = {(text) => this.linkText = text}><GlitchText text = {'[ there_is_no_link ]'} glitch = {this.state.revealLink} delay = {0.4} speed = {0.01} /></p></div> : 
                           
                           <a className = "Link" href = {this.projectCopy[this.props.project].link} target = "_blank"><p ref = {(text) => this.linkText = text}><GlitchText text = {'[ VIEW PROJECT ]'} glitch = {this.state.revealLink} delay = {0.4} speed = {0.01} /></p></a>

                           }
        
        
                </div>

                    <video ref = {(vid) => this.vid = vid} autoPlay = {true} loop = {true} crossOrigin = {'Anonymous'}>

                        <source src = {this.projectCopy[this.props.project].vid} type = {'video/mp4'} />

                    </video>

                </div>

                <div className = 'LetterBoxContainer' ref = {(container) => this.letterBoxContainer = container}>

                <svg ref = {(container) => this.letterBox = container} style = {{position: 'absolute', width: '100%', height: '20%', top: '0%', left: '0%', zIndex: '5'}}>

                    <rect className = "LetterBox1" ref = {(el) => this.ltrBox1 = el} width = {'100%'} height = {'100%'} style ={{position: 'absolute', fill: 'rgba(255, 255, 255)', pointerEvents: 'none'}}/>

                </svg>

                <svg ref ={(container) => this.letterBox2 = container} style = {{position: 'absolute', width: '100%', height: '20%', bottom: '0%', left: '0%', zIndex: '5'}}>

                    <rect className = "LetterBox2" ref = {(el) => this.ltrBox2 = el} width = {'100%'} height = {'100%'} style ={{position: 'absolute', fill: 'rgba(255, 255, 255)', pointerEvents: 'none'}}/>

                </svg>

                    </div>

            </div>              
            

        )

    }

}