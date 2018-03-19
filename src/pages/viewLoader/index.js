import React, {Component} from 'react'

import ReactDOM from 'react-dom'

import {TweenLite} from 'gsap'

import LandingPage from '../landingPage/index.js'

import Project from '../projects/index.js'

import ViewIndicator from '../elements/viewIndicator.js'

import eventEmitter from 'eventEmitter'

import TransitionGroup from 'react-transition-group/TransitionGroup'

const emitter = eventEmitter.emitter

export default class ViewLoader extends Component {

    constructor(props) {

        super(props)

        this.state = {

            currentView: 'home',

            viewLoaded: true,

            currentTarget: null,

            index: 0,

            scrolling: false
            
        }

        this.pos = {}

        this.pos.x = 0

        this.pos.y = 0

        this.offSet = 0

        this.initViews()

        this.initEvents()

    }

    initViews() {

        this.views = []
        // this.views[0] = {name: 'home', component: <LandingPage ref = {(view) => {this.currentView = view}}/>}
        
    }

    initEvents() {

        // emitter.on('curious', this.enterCuriousView.bind(this))

        emitter.on('viewTargeted', (target) => {this.setState({currentTarget: target})})

        emitter.on('viewSelected', this.selectView.bind(this))

        // emitter.on('scrolling', this.onScroll.bind(this))

        // emitter.on('update', this.onUpdate.bind(this))

    }

    enterCuriousView() {

        TweenLite.killTweensOf(this)

        // this.currentView.transitionOut()

        this.setState({currentTarget: 'home', index: 0, viewLoaded: false}, () => { //ugly solution

            this.viewIndicator.updateText('curious')

            // TweenLite.to(this, 0.15, {

            //     onComplete: () => this.setState({viewLoaded: false})

            // })

        })

    }

    selectView() {

        TweenLite.killTweensOf(this)

        if(this.state.currentTarget !== 'home') {

        this.setState({index:
            
            this.views.map((view) => {

                const viewProjectProp = view.component.props.project

                return viewProjectProp

            }).indexOf(this.state.currentTarget)
            
        }, () => {

            this.updateView()

        })

        } else {

            this.setState({index: 0}, () => {

                this.updateView()

            })

        }

    }

    updateView() {

        // TweenLite.to(this, 0.15, {

            // onComplete: ()=> {
                
                this.setState({viewLoaded: true, currentView: this.views[this.state.index].name}, () => {
    
                emitter.emit('morphDOLI', this.views[this.state.index].name)
    
                // this.viewIndicator.updateText(this.views[this.state.index].name)
        
                if(this.state.currentView === 'work') {

                    emitter.emit('projectChanged', this.state.index)
        
                }
        
            })

        // }

        // })

    }

    componentDidUpdate() {

        // console.log(this.state.index)

    }

    componentDidMount() {

        // this.viewIndicator.updateText('home')

        this.currentView.transitionIn()

    }

    onScroll(e) {

        this.offSet += e.deltaY

        if(this.offSet < 0) {
            
            this.offSet = 0

        } else if(this.offSet >= ReactDOM.findDOMNode(this.currentView).getBoundingClientRect().height * 4.0) {

            this.offSet = ReactDOM.findDOMNode(this.currentView).getBoundingClientRect().height * 4.0

        }

    }

    onUpdate() {

        this.pos.y += (this.offSet - this.pos.y) * Math.sin(0.3 * Math.PI) * 0.05

        // this.container.style.transform = 'matrix(1.0, 0.0, 0.0, 1.0, ' + 0.0 + ', ' + -this.pos.y + ')'

        this.offSet = Math.min(Math.max(this.offSet, 0), ReactDOM.findDOMNode(this.currentView).getBoundingClientRect().height * 4.0)
    }

    render() {

        return(

            <div className = "Loader" ref = {(container) => this.container = container}>

                {/* <ViewIndicator ref = {(component) => {this.viewIndicator = component}} /> */}
                <LandingPage ref = {(view) => {this.currentView = view}} pos = {this.pos.y}/>
                <Project ref = {(view) => {this.currentView = view}} project = 'doli' />
                <Project ref = {(view) => {this.currentView = view}} project = 'redCrossWebVR' /> 
                <Project ref = {(view) => {this.currentView = view}} project = 'internshipProject' />
                <Project ref = {(view) => {this.currentView = view}} project = 'hyperInstallation' />
            
            </div>

        )

    }

}