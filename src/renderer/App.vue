<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import fs from 'fs-extra'
import path from 'path'
import { mapState, mapActions } from 'vuex'
import 'materialize-css'
import 'materialize-css/dist/css/materialize.css'
import { userDir, version } from '@/const'

export default {
  name: 'ceramics-fitting-room',
  data () {
    return {}
  },
  computed: {
    ...mapState({
      appLaunchCount: state => state.Main.appLaunchCount
    })
  },
  methods: {
    ...mapActions([
      'incrementAppLaunchCount',
      'addClay',
      'addGlaze',
      'addTexture',
      'setCurrentClay',
      'setCurrentGlaze',
      'setCurrentTexture',
      'setModelPath',
      // 'clearClayLib',
      // 'clearGlazeLib',
      // 'clearTextureLib',
      'clearShotPics'
    ]),
    // 初始化素材库
    initMaterialLib () {
      let needUpdate = false
      const materialSrcPath = path.join(__static, '/material')
      const materialDistPath = path.join(userDir, '/material') // 个人用户目录下的APP数据

      if (localStorage.getItem('version') !== version) {
        // fs.removeSync(materialDistPath)
        needUpdate = true
        // this.clearClayLib()
        // this.clearGlazeLib()
        // this.clearTextureLib()
      }

      localStorage.setItem('version', version)

      // const isTexturesExist = fs.existsSync(materialDistPath);

      // 判断是否是第一次运行，是的话就把static下的素材复制过去，并构建素材库
      if (this.appLaunchCount === 0 || needUpdate) {
        fs.copySync(materialSrcPath, materialDistPath)

        if (process.platform === 'darwin') {
          fs.chmodSync(materialDistPath, 0o777)
          fs.chmodSync(path.join(materialDistPath, '/clay'), 0o777)
          fs.chmodSync(path.join(materialDistPath, '/glaze'), 0o777)
          fs.chmodSync(path.join(materialDistPath, '/texture'), 0o777)
        }

        const clayFiles = fs.readdirSync(path.join(materialDistPath, '/clay'))
        const glazeFiles = fs.readdirSync(path.join(materialDistPath, '/glaze'))
        const textureFiles = fs.readdirSync(path.join(materialDistPath, '/texture'))

        clayFiles.forEach((item, index) => {
          const itemPath = path.join(materialDistPath, '/clay/' + item)
          if (process.platform === 'darwin') {
            fs.chmodSync(itemPath, 0o777)
          }
          if (!path.parse(itemPath).name.startsWith('.')) {
            this.addClay({
              needCopyFile: false,
              bgPath: itemPath + '.jpg'
            })
          }
        })
        glazeFiles.forEach((item, index) => {
          const itemPath = path.join(materialDistPath, '/glaze/' + item)
          if (process.platform === 'darwin') {
            fs.chmodSync(itemPath, 0o777)
          }
          if (!path.parse(itemPath).name.startsWith('.')) {
            this.addGlaze({
              needCopyFile: false,
              bgPath: itemPath + '.jpg'
            })
          }
        })
        textureFiles.forEach((item, index) => {
          const itemPath = path.join(materialDistPath, '/texture/' + item)
          if (process.platform === 'darwin') {
            fs.chmodSync(itemPath, 0o777)
          }
          if (!path.parse(itemPath).name.startsWith('.')) {
            this.addTexture({
              needCopyFile: false,
              bgPath: itemPath + '.jpg'
            })
          }
        })
      }
    }
  },
  created () {
    // 清空
    console.log('(created)')
    // this.setCurrentClay()
    // this.setCurrentTexture()
    // this.setCurrentGlaze()
    // this.setModelPath()
  },
  mounted () {
    this.initMaterialLib()
    this.incrementAppLaunchCount()
    console.log('(mounted)appLaunchCount: ', this.appLaunchCount)
  },
  beforeDestroy () {
    console.log('beforeDestroy')
    // 清空
    this.setCurrentClay()
    this.setCurrentTexture()
    this.setCurrentGlaze()
    this.setModelPath()
    this.clearShotPics()
  }
}
</script>

<style>
html,
body,
#app {
  width: 100%;
  height: 100%;
}

@font-face {
  font-family: 'Material Icons';
  font-style: normal;
  font-weight: 400;
  src: url(assets/iconfont/MaterialIcons-Regular.eot); /* For IE6-8 */
  src: local('Material Icons'), local('MaterialIcons-Regular'),
    url(assets/iconfont/MaterialIcons-Regular.woff2) format('woff2'),
    url(assets/iconfont/MaterialIcons-Regular.woff) format('woff'),
    url(assets/iconfont/MaterialIcons-Regular.ttf) format('truetype');
}
.material-icons {
  font-family: 'Material Icons';
  font-weight: normal;
  font-style: normal;
  font-size: 24px; /* Preferred icon size */
  display: inline-block;
  line-height: 1;
  text-transform: none;
  letter-spacing: normal;
  word-wrap: normal;
  white-space: nowrap;
  direction: ltr;

  /* Support for all WebKit browsers. */
  -webkit-font-smoothing: antialiased;
  /* Support for Safari and Chrome. */
  text-rendering: optimizeLegibility;

  /* Support for Firefox. */
  -moz-osx-font-smoothing: grayscale;

  /* Support for IE. */
  font-feature-settings: 'liga';
}
</style>
