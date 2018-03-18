import React, {Component} from 'react'

export default class Events extends Component {

    constructor(props) {

        super(props)

        this.parent = props

        this.initEvents()

    }

    initEvents() {

        window.addEventListener('mousewheel', this.onScroll.bind(this))

    }

    onScroll(e) {

        this.parent.loadProject(e.deltaY)

    }

}