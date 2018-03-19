import React, {Component} from 'react'

import eventEmitter from 'eventEmitter'

const emitter = eventEmitter.emitter

export default class Events extends Component {

    constructor(props) {

        super(props)

        this.parent = props

        this.state = {

            outOfProjectBounds: false

        }

        this.mouse = {}

        this.mouse.x = 0

        this.mouse.y = 0

        this.enabled = false

        this.outOfProjectBounds = false

        this.offSet = 0

        this.target = {}

        this.target.x = 0

        this.target.y = 0

        this.scrollY = 0

        this.lastPos = 0

        this.pos = {}

        this.pos.x = 0

        this.pos.y = 0

        this.posOffset = {}

        this.force = 0

        this.vel = 0

        this.posOffset.x = this.parent.projectVid.getBoundingClientRect().width * .75
        this.posOffset.y = this.parent.projectVid.getBoundingClientRect().height * .75

    }


    enable() {

        emitter.on('mouseDown', this.onMouseDown.bind(this))

        // emitter.on('revealCopy', this.revealCopy.bind(this))

        emitter.on('mouseMove', this.onmouseMove.bind(this))

        emitter.on('projectHovered', this.revealCopy.bind(this))

        this.parent.projectVid.addEventListener('mouseenter', this.onEnter.bind(this))

        this.parent.projectVid.addEventListener('mouseleave', this.onLeave.bind(this))

        emitter.on('scrolling', this.onScroll.bind(this))

        emitter.on('update', this.onUpdate.bind(this))

        emitter.on('resizing', this.onResize.bind(this))
        
    }

    revealCopy(b) {


        b === true ? this.parent.revealCopyIn() : this.parent.revealCopyOut()

        b === true ? this.onEnter() : this.onLeave()

    }

    onMouseDown() {

        const b = this.outOfProjectBounds !== false && this.parent.state.viewingProject === true

        if(b) {

            emitter.emit('exitProject') //use this to disable the exit prompt

            this.parent.revealCopyOut()

        }

    }

    onmouseMove(e) {

        this.mouse.x = e.clientX

        this.mouse.y = e.clientY

        // this.target.x = this.mouse.x - this.parent.projectVid.getBoundingClientRect().x + ((this.mouse.x / window.innerWidth * 2 - 1) * 1)
        
        // this.target.y = this.mouse.y - this.parent.projectVid.getBoundingClientRect().y + ((this.mouse.y / window.innerHeight * 2 - 1) * 1)

        this.target.x = this.mouse.x - this.posOffset.x
        
        this.target.y = this.mouse.y - this.posOffset.y

    }

    onScroll(e) {

        this.offSet += e.deltaY

        if(this.offSet < 0) {
            
            this.offSet = 0

        } else if(this.offSet >= this.parent.project.getBoundingClientRect().height * 4) {

            this.offSet = this.parent.project.getBoundingClientRect().height * 4

        }

    }

    onUpdate() {

        // this.pos.y += (this.offSet - this.pos.y) * Math.sin(0.3 * Math.PI) * 0.05
        
        this.pos.y += (this.offSet - this.pos.y) * 0.05

        this.parent.project.style.transform = 'matrix(1.0, 0.0, 0.0, 1.0, ' + 0.0 + ', ' + -this.pos.y + ')'

        this.offSet = Math.min(Math.max(this.offSet, 0), this.parent.project.getBoundingClientRect().height * 4)


        // this.pos.x += (this.target.x * 0.01 - this.pos.x) * 0.05
        
        // this.pos.y += (this.target.y * 0.01 - this.pos.y) * 0.05

        // this.parent.projectVid.style.transform = 'matrix(1.0, 0.0, 0.0, 1.0, ' + 0.0 + ', ' + -this.offSet + ')'

        // this.offSet = Math.min(Math.max(this.offSet, 0), this.parent.project.getBoundingClientRect().height * 4)

    }

    onEnter() {

        this.parent.revealCopyIn()

    }

    onLeave() {
        
        this.parent.revealCopyOut()

    }

    onResize() {

        this.parent.updateLayout()

    }

    // disable() {

    //     console.log('eventsDisabled')
        
    //     window.removeEventListener('mousedown', this.onMouseDown.bind(this))

    //     emitter.off('revealCopy', this.revealCopy.bind(this))

    //     this.parent.projectContainer.removeEventListener('mouseenter', this.onEnter.bind(this))

    //     this.parent.projectContainer.removeEventListener('mouseleave', this.onLeave.bind(this))
        
    // }

}