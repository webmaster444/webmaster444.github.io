import * as THREE from './three/build/three.module.js'

import { OrbitControls } from './three/examples/jsm/controls/OrbitControls.js'
import { OBJLoader } from './three/examples/jsm/loaders/OBJLoader.js'
import { GLTFLoader } from './three/examples/jsm/loaders/GLTFLoader.js'
import { WEBGL } from './three/examples/jsm/WebGL.js'
import { RoughnessMipmapper } from './three/examples/jsm/utils/RoughnessMipmapper.js';

let camera = null
let scene = null
let renderer = null
let mesh = null

if (WEBGL.isWebGLAvailable()) {

  init()

} else {

  const warning = WEBGL.getWebGLErrorMessage()
  document.getElementsByTagName('body').appendChild(warning)

}

function init() {
  scene = new THREE.Scene()

  let width = window.innerWidth

  if (width > 980) {
    width /= 2
  }

  const height = window.innerHeight

  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
  camera.position.z = 100

  renderer = new THREE.WebGLRenderer()
  renderer.setSize(width, height)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableZoom = true

  scene.background = new THREE.Color(0xfcd21d)
  scene.add(new THREE.AmbientLight(0x404040))

  var roughnessMipmapper = new RoughnessMipmapper(renderer)

  const loader = new OBJLoader()
  // loader.load('./assets/models/presenting/00246_Zeef006.obj',
  // loader.load('./assets/models/presenting/00219_Paul008.obj',
  // loader.load('./assets/models/presenting/00218_Jon005.obj',
  loader.load('./assets/models/presenting/00208_Quint009.obj',
    (obj) => {
      console.log(obj)
      // let material = new THREE.PointsMaterial({ color: 0x353740, size: 0.4 })
      let material = new THREE.PointsMaterial({ color: 0xffffff, size: 0.4 })

      // if (obj.children[0].isMesh) {
      //   roughnessMipmapper.generateMipmaps(obj.children[0].material);
      // }
      mesh = new THREE.Points(obj.children[0].geometry, material)
      mesh.position.y = -25
      scene.add(mesh)
      // scene.add(obj.scene)
      // roughnessMipmapper.dispose()
    },
    (xhr) => { },
    (err) => {
      console.error("loading .obj went wrong, ", err)
    }
  )

  document.body.appendChild(renderer.domElement)
  animationLoop()
  window.addEventListener('resize', onResize, false)
}

function animationLoop() {
  renderer.render(scene, camera)
  if (mesh) {
    mesh.rotation.y += 0.005
  }
  requestAnimationFrame(animationLoop)
}

function onResize() {

  let width = window.innerWidth

  if (width > 980) {
    width /= 2
  }

  const height = window.innerHeight

  camera.aspect = width / height
  camera.updateProjectionMatrix()

  renderer.setSize(width, height)

  renderer.render(scene, camera)

}
