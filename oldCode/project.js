// import {h, Component} from 'preact'

import React, {Component} from 'react'

import ReactDOM from 'react-dom'

import ReactRevealText from 'react-reveal-text'

//need to rework this class as the boolenas are getting fucking ridicilous

export default class Project extends Component {

    constructor(props) {

        super(props)

        this.props = props

        this.state = {

            show: true,

            isLoaded: false

        }

    }

    componentDidMount() {

        setTimeout(() => {

            this.setState({isLoaded: this.props.viewing})

        }, 10)

    }

    componentWillUnmount() {

        this.setState({isLoaded: false})

    }

    // shouldComponentUpdate()

    componentWillReceiveProps(newProp) {

        if(this.props.show !== newProp.viewing) {

            setTimeout(() => {

                this.setState({isLoaded: newProp.viewing})
    
            }, 10)

        }

    }

    render() {

        return(

            <div className = "ContentContainer" ref = "container">

                {/* <ReactRevealText transitionTime = {500} delayMax = {800} text = {this.props.copy.title} show = {this.state.isLoaded}/>
                
                <ReactRevealText transitionTime = {500} delayMax = {800} text = {this.props.copy.description} show = {this.state.isLoaded}/>
                
                <ReactRevealText transitionTime = {500} delayMax = {800} text = {this.props.copy.tech} show = {this.state.isLoaded}/> */}

                <ReactRevealText transitionTime = {500} delayMax = {800} text = {this.props.copy.title} show = {this.state.isLoaded}/>
                
                <ReactRevealText transitionTime = {500} delayMax = {800} text = {this.props.copy.description} show = {this.state.isLoaded}/>
                
                <ReactRevealText transitionTime = {500} delayMax = {800} text = {this.props.copy.tech} show = {this.state.isLoaded}/>

            </div>

        )

    }

}