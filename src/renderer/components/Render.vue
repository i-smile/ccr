<template>
  <div class="render" id="render">
    <canvas id="threeCanvas"></canvas>
  </div>
</template>

<script>
// import path from 'path';
import * as THREE from 'three'
import OrbitControls from 'three-dlc/src/controls/OrbitControls'
import WEBGL from 'three-dlc/src/WebGL'
import OBJLoader from 'three-dlc/src/loaders/OBJLoader'
import SceneUtils from 'three-dlc/src/utils/SceneUtils'
import { mapState } from 'vuex'
import path from 'path'
import _ from 'lodash'
import { userDir } from '@/const'

export default {
  name: 'render',
  data () {
    return {
      object: null, // 模型物体对象
      objGroup: undefined, // 跟object一样，不过是一个新的
      box3: null, // 模型的尺寸、位置
      material0: null,
      material1: null,
      material2: null,
      scene: null,
      camera: null,
      renderer: null
    }
  },
  computed: {
    ...mapState({
      modelPath: state => state.Material.modelPath,
      clay: state => state.Material.clay,
      glaze: state => state.Material.glaze,
      texture: state => state.Material.texture,
      glazeOpacity: state => state.Material.glazeOpacity
    })
  },
  mounted () {
    if (WEBGL.isWebGLAvailable() === false) {
      document.body.appendChild(WEBGL.getWebGLErrorMessage())
      return
    }
    this.startup()
  },

  watch: {
    modelPath: async function () {
      await this.loadModel()
      this.buildMaterial()
      this.mergeModelAndMaterial()
    },
    clay: async function (value) {
      if (!this.object) {
        await this.loadModel()
      }
      this.buildMaterial()
      this.mergeModelAndMaterial()
    },
    glaze: async function (value) {
      if (!this.object) {
        await this.loadModel()
      }
      this.buildMaterial()
      this.mergeModelAndMaterial()
    },
    texture: async function (value) {
      if (!this.object) {
        await this.loadModel()
      }
      this.buildMaterial()
      this.mergeModelAndMaterial()
    },
    glazeOpacity: async function () {
      if (!this.object) {
        await this.loadModel()
      }
      this.buildMaterial()
      this.mergeModelAndMaterial()
    }
  },

  methods: {
    async startup () {
      await this.loadModel() // 保证首先要加载好模型，拿到模型的大小后才方面后续处理

      this.init()
      this.buildMaterial()
      this.mergeModelAndMaterial()
      this.animate()
    },

    // 渲染
    render () {
      this.camera.lookAt(this.scene.position)
      this.renderer.render(this.scene, this.camera)
    },
    // 不停的刷新渲染
    animate () {
      requestAnimationFrame(this.animate)
      this.render()
    },

    async init () {
      // renderer
      this.renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('threeCanvas'),
        antialias: true,
        preserveDrawingBuffer: true // 要生成图片以供保存，必须加这个
      })
      const renderDom = document.getElementById('render')
      console.log(renderDom.offsetWidth, renderDom.offsetHeight)
      this.renderer.setPixelRatio(4)
      this.renderer.setSize(renderDom.offsetWidth, renderDom.offsetHeight)

      // camera
      this.camera = new THREE.PerspectiveCamera(
        45,
        renderDom.offsetWidth / renderDom.offsetHeight,
        1,
        2000
      )
      this.camera.position.z = 250

      this.reflectionCube = new THREE.CubeTextureLoader()
        .setPath('file://' + __static + '/envreflect/Park3Med/')
        .load([ 'px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg' ])
      // this.reflectionCube = new THREE.CubeTextureLoader()
      //   .setPath('file://' + __static + '/envreflect/Bridge2/')
      //   .load([ 'posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg' ]);
      this.reflectionCube.format = THREE.RGBFormat

      // scene
      this.scene = new THREE.Scene()

      const ambientLight = new THREE.AmbientLight(0xeeeeee, 0.9) // 均匀的环境光，参数: 光的颜色, 关的强度
      this.scene.add(ambientLight)
      this.scene.background = new THREE.Color(0xffffff)

      const pointLight = new THREE.PointLight(0xffffff, 0.8)
      this.camera.add(pointLight)
      this.scene.add(this.camera)

      // CONTROLS
      const cameraControls = new OrbitControls(
        this.camera,
        this.renderer.domElement
      )
      cameraControls.addEventListener('change', this.render)

      window.addEventListener('resize', this.onWindowResize, false)
    },

    // material
    buildMaterial () {
      const textureLoader = new THREE.TextureLoader()
      let { clay, texture, glaze } = this

      // 默认材质
      const map0 = textureLoader.load('file://' + path.join(__static, `/CGB.jpg`))
      map0.wrapS = map0.wrapT = THREE.MirroredRepeatWrapping
      map0.anisotropy = 12
      map0.repeat = new THREE.Vector2(8, 8)

      this.material0 = new THREE.MeshStandardMaterial({
        map: map0,
        roughness: 0.85,
        side: THREE.DoubleSide
      })

      // 泥料
      if (clay.name) {
        const clayFilePath = 'file://' + path.join(userDir, `/material/clay/${clay.name}/${clay.name}.jpg`)
        const map1 = textureLoader.load(clayFilePath)
        map1.wrapS = map1.wrapT = THREE.MirroredRepeatWrapping
        map1.anisotropy = 12
        map1.repeat = new THREE.Vector2(8, 8)

        this.material1 = new THREE.MeshStandardMaterial({
          map: map1,
          side: THREE.DoubleSide,
          roughness: glaze.name ? 0.2 : 0.85,
          metalness: 0.04,
          envMap: glaze.name ? this.reflectionCube : null
        })
      } else {
        this.material1 = null
      }

      // 纹理
      if (texture.name) {
        const textureFilePath = 'file://' + path.join(userDir, `/material/texture/${texture.name}/${texture.name}.jpg`)
        const map3 = textureLoader.load(textureFilePath)
        map3.wrapS = map3.wrapT = THREE.MirroredRepeatWrapping
        map3.anisotropy = 12
        map3.repeat = new THREE.Vector2(8, 8)

        this.material3 = new THREE.MeshPhongMaterial({
          map: map3,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.5,
          // reflectivity: 0.7,
          shininess: 8 // 高亮的程度,
          // envMap: this.reflectionCube
        })
      } else {
        this.material3 = null
      }

      // 釉料
      if (glaze.name) {
        const glazeFilePath = 'file://' + path.join(userDir, `/material/glaze/${glaze.name}/${glaze.name}.jpg`)
        const map2 = textureLoader.load(glazeFilePath)
        map2.wrapS = map2.wrapT = THREE.MirroredRepeatWrapping
        map2.anisotropy = 12
        map2.repeat = new THREE.Vector2(8, 8)

        this.material2 = new THREE.MeshPhongMaterial({
          map: map2,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: this.glazeOpacity / 100,
          reflectivity: 0.7,
          shininess: 256, // 高亮的程度,
          envMap: this.reflectionCube
        })
      }
    },

    // 合并模型和纹理素材，并添加到场景中
    mergeModelAndMaterial () {
      if (this.objGroup !== undefined) {
        this.scene.remove(this.objGroup)
      }
      this.objGroup = new THREE.Group()

      let mergedMaterials = []
      if (!this.material1 && !this.material2) {
        console.log('ddddddd')
        mergedMaterials = [this.material0]
      } else {
        console.log('cccccccc')
        mergedMaterials = _.compact([
          this.material1,
          this.material3,
          this.material2
        ])
      }

      console.log('mergedMaterials.length: ', mergedMaterials.length)

      this.object.traverse(child => {
        if (child.isMesh) {
          const mesh = SceneUtils.createMultiMaterialObject(child.geometry, mergedMaterials)
          this.objGroup.add(mesh)
        }
      })
      this.objGroup.position.y = 0 - this.box3.getCenter().y
      this.scene.add(this.objGroup)
    },

    // 加载模型文件
    loadModel () {
      // manager
      const manager = new THREE.LoadingManager()

      function onLoadModelProgress (xhr) {
        if (xhr.lengthComputable) {
          var percentComplete = (xhr.loaded / xhr.total) * 100
          console.log(
            'model ' + Math.round(percentComplete, 2) + '% downloaded'
          )
        }
      }

      return new Promise((resolve, reject) => {
        const loader = new OBJLoader(manager)
        loader.load(
          this.modelPath,
          obj => {
            this.object = obj
            console.log(this.object)
            const box3 = new THREE.Box3()
            box3.expandByObject(this.object)
            this.box3 = box3
            resolve()
          },
          onLoadModelProgress
        )
      })
    },

    onWindowResize () {
      const renderDom = document.getElementById('render')
      if (renderDom) {
        this.camera.aspect = renderDom.offsetWidth / renderDom.offsetHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(renderDom.offsetWidth, renderDom.offsetHeight)
      }
    }
  }
}
</script>

<style>
.render {
  position: relative;
  width: 100%;
  height: 100%;
  font-size: 0;
}
</style>
