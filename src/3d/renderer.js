import * as THREE from 'three'

const renderer = new THREE.WebGLRenderer({precision: 'lowp', antialias: true, alpha: true})

// renderer.setClearColor(0x000000, 0)
// renderer.setPixelRatio(2)

renderer.sortObjects = false

renderer.setClearColor(0xfffffff, 0)

// renderer.sortObjects = false

renderer.setSize(window.innerWidth, window.innerHeight)

renderer.domElement.style.position = 'absolute'

renderer.domElement.style.width = '100%'

renderer.domElement.style.height = '100%'

renderer.domElement.style.top = '0%'

renderer.domElement.style.left = '0%'

// window.renderer = renderer

export default renderer