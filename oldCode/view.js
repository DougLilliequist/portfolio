import React, {Component} from 'react'

import {TweenLite} from 'gsap'

export default class View extends Component {

    constructor(props) {

        super(props)

        this.prepUnMount = this.prepareUnMount.bind(this)

    }

    prepareUnMount() {

        let promise = new Promise((resolve, reject) => {

            TweenLite.to(this, 0.5, {

                onStart: () => {

                    console.log('fading out')

                },

                onComplete: () => {
                    
                    console.log('faded out')

                    resolve()

                }
            
            })


        })

        return promise

    }

}