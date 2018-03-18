// import {h, Component} from 'preact'

import React, {
    Component
} from 'react'

import ReactDOM from 'react-dom'

// import View from '../view/index.js'

import {
    projectCopy
} from './projectCopy.js'

import {
    TweenLite
} from 'gsap'

import Project from './project.js'

import ReactRevealText from 'react-reveal-text'

export default class Projects extends Component {

    constructor(props) {

        super(props)

        this.initProjectCopy()

        this.state = {

            index: 0,

            scrolling: false,

            revealCopy: false,

            viewingProjects: false

        }

    }

    componentDidMount() {

        TweenLite.to(this, 0.5, {

            onComplete: () => this.setState({revealCopy: true})

        })

    }

    componentWillUnmount() {

        this.removeEvents()

    }

    initProjectCopy() {

        this.projectCopy = projectCopy

    }

    getState() {

        return this.state.revealCopy

    }

    initProjects() {

        this.projects = []

        this.projects[0] = <Project viewing = {this.state.revealCopy} copy = {this.projectCopy[0]}/>

        this.projects[1] = <Project viewing = {this.state.revealCopy} copy = {this.projectCopy[1]}/>

        this.projects[2] = <Project viewing = {this.state.revealCopy} copy = {this.projectCopy[2]}/>

        ReactDOM.render(this.projects[0], this.refs['projectContainer'])

    }

    initEvents() {

        window.addEventListener('wheel', this.loadProject.bind(this))

    }

    removeEvents() {

        window.removeEventListener('wheel', this.loadProject.bind(this))

    }

    loadProject(e) {

        if (this.state.scrolling === false) {

            this.setState(() => {
                
                return {scrolling: true}
            
            })

            TweenLite.to(this, 1.5, {

                onStart: () => {

                    this.setState({revealCopy: false})
                    
                },

                onUpdate: () => {

                    e.preventDefault()

                },

                onComplete: () => {

                    if (e.deltaY > 0) {

                        this.setState((prevState) => {

                            return {index: prevState.index += (this.state.index < this.projectCopy.length - 1) ? 1 : 0}

                        })

                    } else {

                        this.setState((prevState) => {

                            return {index: prevState.index - (this.state.index > 0) ? 1 : 0}

                        })

                    }

                    TweenLite.to(this, 0.5, {

                        onComplete: () => {
                            
                            this.setState({revealCopy: true})

                        }

                    })

                    this.setState({scrolling: false})

                }

            })

        }

    }

    prepareUnmount() {

        let promise = new Promise((resolve, reject) => {

            TweenLite.to(this, 1.0, {

                onStart: () => this.setState({revealCopy: false}),

                onComplete: () => {
                    
                    TweenLite.to(this, 1.0, {

                        onComplete: () => resolve()

                    })

                }

            })

        })

        return promise

    }

    render() {
        
        return(

            <div className = "Projects" ref = "work">

                <ReactRevealText className = "Title" ref = "titleContainer" transitionTime = {500} show = {this.state.revealCopy} text = {this.projectCopy[this.state.index].title}/>
                
                <ReactRevealText className = "Description" ref = "decrContainer" transitionTime = {500} show = {this.state.revealCopy} text = {this.projectCopy[this.state.index].description}/>
                
                <ReactRevealText className = "Tech" ref = "techContainer" transitionTime = {500} show = {this.state.revealCopy} text = {this.projectCopy[this.state.index].tech}/>
                
            </div>

        )

    }

}