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

import NavLine from './pages/elements/navigation/navLine.js'

import Contact from './pages/elements/contact.js'

import Scroll from './pages/elements/scroll/scroll.js'

import './styles/main.scss'
import './styles/landingPage.scss'
import './styles/projects.scss'
import './styles/components.scss'
import './styles/navigation.scss'
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

    }

    componentDidMount() {

        this.initViews()

        this.initEvents()
        
    }

    initViews() {

        // const world3D = new World3D()

        this.views = []
        
        // this.views[0] = {name: 'home', component: <LandingPage ref = {(view) => {this.home = view}} />}
        // this.views[1] = {name: 'work', component: <Project ref = {(view) => {this.project = view}} project = 'doli' />} // special case with click and hold function
        // this.views[2] = {name: 'work', component: <Project ref = {(view) => {this.project = view}} project = 'redCrossWebVR' />} 
        // this.views[3] = {name: 'work', component: <Project ref = {(view) => {this.project = view}} project = 'internshipProject' />}
        // this.views[4] = {name: 'work', component: <Project ref = {(view) => {this.project = view}} project = 'hyperInstallation' />}

        this.views[0] = {name: 'home', component: <LandingPage ref = {(view) => {this.currentView = view}} />}
        this.views[1] = {name: 'work', component: <Project ref = {(view) => {this.currentView = view}} project = 'doli' />} // special case with click and hold function
        this.views[2] = {name: 'work', component: <Project ref = {(view) => {this.currentView = view}} project = 'redCrossWebVR' />} 
        this.views[3] = {name: 'work', component: <Project ref = {(view) => {this.currentView = view}} project = 'internshipProject' />}
        this.views[4] = {name: 'work', component: <Project ref = {(view) => {this.currentView = view}} project = 'hyperInstallation' />}
        
        this.loadContent(this.views[this.state.viewIndex])

    }

    initEvents() {

        this.progress = 0

        emitter.on('scrolling', this.onScroll.bind(this))

        emitter.on('curious', (data) => {

            this.setState({prevViewIndex: data}, () => {

                this.refs['viewIndicator'].updateText('curious')

                // this.unmountComponent(this.views[this.state.prevViewIndex].name)
                
                this.currentView.transitionOut()

            })

        })

        emitter.on('viewSelected', (data) => {

            this.setState({viewIndex: data}, () => {

                emitter.emit('morphDOLI', this.views[this.state.viewIndex].name)

                this.unmountComponent(this.currentView).then(()=>{

                    this.loadContent(this.views[this.state.viewIndex])

                })


            })

        })

    }

    onScroll(e) {

        if (this.state.scrolling === false) {

            this.setState(() => {
                
                return {scrolling: true}
            
            })

            TweenLite.to(this, 0.5, {

                onStart: () => {

                    this.setState({prevViewIndex: this.state.viewIndex})

                },

                onUpdate: () => {

                    e.preventDefault()

                },

                onComplete: () => {

                    if (e.deltaY > 0) {

                        this.setState((prevState) => {

                            return {viewIndex: prevState.viewIndex += (this.state.viewIndex < this.views.length - 1) ? 1 : 0}

                        })

                    } else {

                        this.setState((prevState) => {

                            return {viewIndex: prevState.viewIndex -= (this.state.viewIndex > 0) ? 1 : 0}

                        })

                    }

                    this.setState({scrolling: false})

                    if(this.state.viewIndex !== this.state.prevViewIndex) {
                        
                        this.refs['navLine'].animate(this.state.viewIndex)

                        emitter.emit('morphDOLI', this.views[this.state.viewIndex].name)

                        this.unmountComponent(this.views[this.state.prevViewIndex].name).then(() => {

                            this.loadContent(this.views[this.state.viewIndex])

                        })

                    } else {

                        return

                    }

                }

            })

        }

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

        this.setState({view: view.name}, () => {

            if(this.state.view === 'work') {

                // this.refs['navLine'].fadeIn()

            }

            this.refs['viewIndicator'].updateText(this.state.view)

            emitter.emit('projectChanged', this.state.viewIndex)

            ReactDOM.render(view.component, this.refs['container'])
    
        })
            
    }

    unmountComponent(view) {

        let promise = new Promise((resolve, reject) => {

            view.prepareUnmount().then(() => {

                this.unMount()

                resolve()

            })

            // switch(view){

            //     case 'home': {

            //         this.home.prepareUnmount().then(() => {

            //             this.unMount()

            //             resolve()

            //         })

            //     }

            //     break

            //     case 'work': {

            //         this.project.prepareUnmount().then(() => {

            //             this.unMount()

            //             // this.refs['navLine'].fadeOut()

            //             resolve()

            //         })

            //     }

            //     break

            // }

        })

        return promise

    }


    unMount() {

        ReactDOM.unmountComponentAtNode(this.refs['container'])

    }

    render() {

        return(
       
        <div className = "Main" ref ="mainContainer">
            <Scroll ref = "scroll" view = {this.state.view} />
            <ViewIndicator ref = "viewIndicator" />
            {/* <Navigation ref = "nav" min = {0} max = {4}/> */}
            <Navigation ref = "nav" />
            <Contact />
            <NavLine ref = "navLine" min = {0} max = {4}/>
            <div className = "Content" ref = "container"></div>
            <World3D />
        </div>
        
        )
    }

}