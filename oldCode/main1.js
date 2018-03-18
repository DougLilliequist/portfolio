import React, {Component} from 'react'

import ReactDOM from 'react-dom'

import {TweenLite} from 'gsap'

import eventEmitter from 'eventEmitter'

const emitter = eventEmitter.emitter

// import {h, Component} from 'preact'

import World3D from './3d/world3d.js'

import ViewLoader from './pages/viewLoader/index.js'

import LandingPage from './pages/landingPage/index.js'

import Project from './pages/projects/index.js'

import ViewIndicator from './pages/elements/viewIndicator.js'

import Navigation from './pages/elements/navigation/navigation.js'

import Contact from './pages/elements/contact.js'

import Scroll from './pages/elements/scroll.js'

import './styles/main.scss'

import './styles/landingPage.scss'

import './styles/projects.scss'

import './styles/components.scss'

import './styles/world3d.scss'


export default class Main extends Component {

    constructor(props) {

        super(props)

        this.state = {

            view: 'home',

            viewIndex: 0,

            prevViewIndex: null,

            scrolling: false

        }

        this.viewIndex = 0

    }

    componentDidMount() {

        this.init()

        this.initEvents()
        
    }

    init() {

        // const world3D = new World3D()

        this.views = []
        
        this.views[0] = {name: 'home', component: <LandingPage ref = {(view) => {this.home = view}} />}

        this.views[1] = {name: 'work', component: <Project ref = {(view) => {this.project = view}} project = 'doli' />} // special case with click and hold function
        
        this.views[2] = {name: 'work', component: <Project ref = {(view) => {this.project = view}} project = 'redCrossWebVR' />}
        
        this.views[3] = {name: 'work', component: <Project ref = {(view) => {this.project = view}} project = 'internshipProject' />}
        
        this.views[4] = {name: 'work', component: <Project ref = {(view) => {this.project = view}} project = 'hyperInstallation' />}
        
        this.loadContent(this.views[this.state.viewIndex])

    }

    initEvents() {

        // window.addEventListener('wheel', this.onScroll.bind(this))

        emitter.on('scrolling', this.onScroll.bind(this))

        emitter.on('viewSelected', this.onSelect.bind(this))

    }

    onScroll(e) {

        // if (this.state.scrolling === false) {

        //     this.setState(() => {
                
        //         return {scrolling: true}
            
        //     })

            this.setState({prevViewIndex: this.state.viewIndex})


            if (e.deltaY > 0) {

                this.setState((prevState) => {

                    return {viewIndex: prevState.viewIndex += (this.state.viewIndex < this.views.length - 1) ? 1 : 0}

            })

                } else {

            this.setState((prevState) => {

                    return {viewIndex: prevState.viewIndex -= (this.state.viewIndex > 0) ? 1 : 0}

                })

            }

                //     console.log(this.state.viewIndex)

                //     this.setState({scrolling: false})

                //     if(this.state.viewIndex !== this.state.prevViewIndex) {

                //         emitter.emit('morphDOLI', this.views[this.state.viewIndex].name)

                //         this.unmountComponent(this.views[this.state.prevViewIndex].name).then(() => {

                //             this.loadContent(this.views[this.state.viewIndex])

                //         })

                //     } else {

                //         return

                //     }

                // }

            // })

        // }

        console.log(this.state.viewIndex)

    }

    onSelect(data) {

        this.setState({prevViewIndex: this.state.viewIndex, viewIndex: data}, ()=> {

            if(this.state.viewIndex !== this.state.prevViewIndex) {
                            
            this.unmountComponent(this.views[this.state.prevViewIndex].name).then(() => {

                emitter.emit('morphDOLI', this.views[this.state.viewIndex].name)

                this.loadContent(this.views[this.state.viewIndex])

                })

            }
        
        })

    }

    loadContent(view) {

        console.log('content loaded')

        this.setState({view: view.name})

        this.refs['viewIndicator'].updateText(this.state.view)
                
        ReactDOM.render(view.component, this.refs['container'])

    }

    unmountComponent(view) {

        let promise = new Promise((resolve, reject) => {

            switch(view){

                case 'home': {

                    this.home.prepareUnmount().then(() => {

                        this.unMount()

                        resolve()

                    })

                }

                break

                case 'work': {

                    this.project.prepareUnmount().then(() => {

                        this.unMount()

                        resolve()

                    })

                }

                break

            }

        })

        return promise

    }

    unMount() {

        ReactDOM.unmountComponentAtNode(this.refs['container'])

    }

    render() {

        return(
       
        <div className = "Main" ref ="mainContainer">
            <Scroll />
            <ViewIndicator ref = "viewIndicator" />
            <Navigation ref = "nav" />
            <Contact />
            <div className = "Content" ref = "container"></div>
            <World3D />
        </div>
        
        )
    }

}