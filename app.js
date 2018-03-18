// import {h, render, Component} from 'preact'

import React, {Component} from 'react'

import ReactDOM from 'react-dom'

import Main from './src/main.js'

export default class App extends Component {

    constructor(props) {

        super(props)

        this.init()

    }

    init() {

        this.root = document.getElementById('root')

        ReactDOM.render(<Main/>, this.root)

    }

}

window.app = new App()