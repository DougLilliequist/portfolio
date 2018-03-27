import React, {Component} from 'react'

import ReactDOM from 'react-dom'

import ViewLoader from './pages/viewLoader/index.js'

import Navigation from './pages/elements/navigation/navigation.js'

import Contact from './pages/elements/contact/contact.js'

import './styles/main.scss'
import './styles/landingPage.scss'
import './styles/projects.scss'
import './styles/components.scss'
import './styles/navigation.scss'
import './styles/world3d.scss'

export default class Main extends Component {

    constructor(props) {

        super(props)

    }

    render() {

        return(
       
        <div className = "Main" ref = "mainContainer">
            <Navigation ref = "nav" />
            <Contact />
            <ViewLoader ref = {(container) => {this.loader = container}} />
        </div>
        
        )
    }

}