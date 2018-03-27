import React, {Component} from 'react'

import eventEmitter from 'eventEmitter'

const emitter = eventEmitter.emitter

export default class Events extends Component {

    constructor(props) {

        super(props)

        this.parent = props

        this.mouse = {}

        this.mouse.x = 0

        this.mouse.y = 0

        this.pos = {}

        this.pos.x = 0

        this.pos.y = 0

        this.offSet = 0

    }


    enable() {

        emitter.on('scrolling', this.onScroll.bind(this))

        emitter.on('update', this.onUpdate.bind(this))
        
    }

    onScroll(e) {

        this.offSet += e.deltaY

        if(this.offSet < 0) {
            
            this.offSet = 0.1

        } else if(this.offSet >= this.parent.project.getBoundingClientRect().height * 4) {

            this.offSet = this.parent.project.getBoundingClientRect().height * 4

        }

    }

    onUpdate() {
        
        this.pos.y += (this.offSet - this.pos.y) * 0.05

        this.parent.copyContainer.style.transform = 'matrix(1.0, 0.0, 0.0, 1.0, ' + 0.0 + ', ' + this.pos.y * 0.05 * -1 + ')'

        this.pos.y = Math.min(Math.max(this.pos.y, 0), this.parent.project.getBoundingClientRect().height * 4)

    }

}