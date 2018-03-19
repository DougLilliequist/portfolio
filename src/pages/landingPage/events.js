import React, {Component} from 'react'

import ReactDOM from 'react-dom'

import eventEmitter from 'eventEmitter'

const emitter = eventEmitter.emitter

export default class Events extends Component {

    constructor(props) {

        super(props)

        this.parent = props

        this.pos = {}

        this.pos.x = 0

        this.pos.y = 0

        this.offSet = 0

        this.ease = 0.15

        this.initEvents()

    }


    initEvents() {

        // console.log(this.parent.container.getBoundingClientRect())

        emitter.on('scrolling', this.onScroll.bind(this))

        emitter.on('update', this.onUpdate.bind(this))

    }

    onScroll(e) {

        // console.log(this.parent.container.getBoundingClientRect())

        this.offSet += e.deltaY

        if(this.offSet > 100) {

            this.parent.transitionOut()

        } else if(this.offSet <= 0) {

            this.parent.transitionIn()

        }

        if(this.offSet < 0) {

            this.offSet = 0

        } else if(this.offSet > this.parent.container.getBoundingClientRect().height * 4) {

            this.offSet = this.parent.container.getBoundingClientRect().height * 4

        }

    }

    onUpdate() {

        // this.pos.y += (this.offSet - this.pos.y) * Math.sin(0.3 * Math.PI) * 0.05
        this.pos.y += (this.offSet - this.pos.y) * 0.05

        this.parent.container.style.transform = 'matrix(1.0, 0.0, 0.0, 1.0, 0.0,' + -this.pos.y + ')'

        this.offSet = Math.min(Math.max(this.offSet, 0), this.parent.container.getBoundingClientRect().height * 4.0)

        let x = this.parent.container.getBoundingClientRect().x

        let y = this.parent.container.getBoundingClientRect().y

        let dist = Math.sqrt(Math.pow(0 - x, 2) + Math.pow(0 - y, 2))
        
        // console.log(dist)

    }

}