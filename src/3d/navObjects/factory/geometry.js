import * as THREE from 'three'

export default class Geometry extends THREE.InstancedBufferGeometry {

    constructor() {

        super()

        this.amnt = 30

        const baseGeo = new THREE.BoxBufferGeometry(1, 1, 1)

        this.addAttribute('position', baseGeo.attributes.position)

        this.addAttribute('uv', baseGeo.attributes.uv)
        
        this.addAttribute('normal', baseGeo.attributes.normal)

        this.setIndex(baseGeo.index)

        const translations = new Float32Array(this.amnt * 3)

        const rotations = new Float32Array(this.amnt * 3)

        const scales = new Float32Array(this.amnt * 3)

        for(let i = 0; i < this.amnt * 3; i++) {

            let i3 = i * 3

            translations[i3 + 0] = Math.cos(Math.random() * 2 * Math.PI) * Math.cos(Math.random () * 2 * Math.PI) * 0.5 + Math.random() * -30 + 15
            translations[i3 + 1] = Math.sin(Math.random() * 2 * Math.PI) * 0.5 + Math.random() * -30 + 15
            translations[i3 + 2] = Math.cos(Math.random() * 2 * Math.PI) * Math.sin(Math.random() * 2 * Math.PI) * 0.5 + Math.random() * -30 + 15

            rotations[i3 + 0] = Math.random() - 0.5
            rotations[i3 + 1] = Math.random() - 0.5
            rotations[i3 + 2] = Math.random() - 0.5

            scales[i3 + 0] = scales[i3 + 1] = scales[i3 + 2] = Math.random() * 5

        }

        this.addAttribute('translation', new THREE.InstancedBufferAttribute(translations, 3, 1))
        
        this.addAttribute('rotation', new THREE.InstancedBufferAttribute(rotations, 3, 1))
        
        this.addAttribute('scale', new THREE.InstancedBufferAttribute(scales, 3, 1))

        console.log(this)

    }

}