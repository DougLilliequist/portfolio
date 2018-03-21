import React, {Component} from 'react'

import ReactDOM from 'react-dom'

import {TweenLite} from 'gsap'

import eventEmitter from 'eventEmitter'

const emitter = eventEmitter.emitter

export default class ScrollBar extends Component {

    constructor(props) {

        super(props)

        this.len = 0

        this.target = 0

    }

    componentDidMount() {

        this.initEvents()

    }

    initEvents() {

        emitter.on('updateScrollBar', (v) => this.len = v)
        
        // emitter.on('updateScrollBar', this.updateEl.bind(this))

        emitter.on('update', this.update.bind(this))

    }

    // updateEl(v) {

    //     TweenLite.killTweensOf(this)

    //     TweenLite.to(this.scrollBar, 0.2, {

    //         ease: Circ.easeInOut,

    //         attr: {

    //             x2: v + '%'

    //         },

    //         // onUpdate: () => {

    //         //     this.target += (v - this.target) * 0.05

    //         // }

    //     })

    // }

    update() {

        this.target += (this.len - this.target) * 0.05

        if(this.target <= 0) {

            this.target = 0.1

        }
        
        TweenLite.set(this.scrollBar, {attr: {y2: this.target + '%'}})

    }

    render() {

        return(

            <div className = "ScrollBarContainer">

                <svg style = {{width: '100%', height: '100%'}}>

                    <line className = "ScrollBar" ref = {(el) => this.scrollBar = el} x1 = {0} y2 = {0} x1 = {0} y2 = {'100%'}/>

                </svg>

            </div>

        )

    }

}