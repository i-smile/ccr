<template>
  <div class="print-page">
    <div class="dot-left" @click="navBack"></div>
    <!-- <div class="dot-right" @click="saveAll"></div> -->
    <div class="title">
      <h4>Ceramics Fitting Room</h4>
      <p>
        <span>●&nbsp;&nbsp;&nbsp;Print&nbsp;&nbsp;&nbsp;●</span>
      </p>
    </div>

    <ul class="list">
      <li v-for="index in [0, 1, 2]" :key="index">
        <canvas :id="'canvas' + index" :width="canvasWidth" :height="canvasHeight"></canvas>
        <!-- <div class="dot dot-print" @click="print(index)"></div> -->
        <!-- <div class="dot dot-save" @click="save(index)"></div> -->
      </li>
    </ul>

    <div class="dot-all" @click="saveAll"></div>

    <div class="logo"  @click="navToStartPage">
      <img src="../assets/logo.png">
    </div>
  </div>
</template>

<script>
import fs from 'fs'
import fse from 'fs-extra'
import path from 'path'
// import { mapState } from 'vuex';
import { ipcRenderer } from 'electron'
import { mapState, mapActions } from 'vuex'
import Render from '@/components/Render'
import { userDir, desktopDir } from '@/const'
import bgImgUrl from '@/assets/print-bg.jpg'
import { saveAsJPEG } from 'canvas2image-es6'

export default {
  data () {
    return {
      canvasWidth: 1000,
      canvasHeight: 1500,
      canvasList: []
    }
  },
  components: { Render },
  computed: {
    ...mapState({
      // shotPics: state => state.Main.shotPics
    })
  },
  mounted () {
    const that = this
    this.canvasList = document.getElementsByTagName('canvas')

    ;[0, 1, 2].forEach(index => {
      const canvas = that.canvasList[index]
      const ctx = canvas.getContext('2d')

      const bgImg = new Image()
      const threeImg = new Image()
      bgImg.onload = () => {
        ctx.drawImage(bgImg, 0, 0, that.canvasWidth, that.canvasHeight)
        threeImg.src = path.join(`file://`, `${userDir}/shotPicture${index + 1}.png`)
      }
      threeImg.onload = () => {
        ctx.drawImage(threeImg, 160, 320, that.canvasWidth - 336, that.canvasHeight - 510)
      }
      bgImg.src = bgImgUrl
    })
  },
  methods: {
    ...mapActions(['clearShotPics', 'setCurrentClay', 'setCurrentGlaze', 'setCurrentTexture']),
    navBack () {
      this.$router.go(-1)
    },
    navToMaterialMenu () {
      this.$router.push({ path: 'materialmenu' })
    },
    navToStartPage () {
      // this.setCurrentClay()
      // this.setCurrentGlaze()
      // this.setCurrentTexture()
      this.clearShotPics()
      this.$router.push({ path: '/' })
    },
    print (index) {
      let imgData = this.canvasList[index].toDataURL('image/png')
      const base64Data = imgData.replace(/^data:image\/\w+;base64,/, '')
      const dataBuffer = Buffer.from(base64Data, 'base64')
      fs.writeFile(`${userDir}/printPicture${index + 1}.png`, dataBuffer, function (err) {
        if (err) return
        console.log('图片保存成功')
        // ipcRenderer.send('print-silent', `file://${userDir}/printPicture${index + 1}.png`)
        ipcRenderer.send('print-preview', path.join('file://', `${userDir}/printPicture${index + 1}.png`))
      })
    },
    save (index) {
      saveAsJPEG(this.canvasList[index], undefined, undefined, `picture${index + 1}.jpg`)
    },
    saveAll () {
      fse.ensureDirSync(`${desktopDir}/cfr-pics/`)
      ;[0, 1, 2].forEach(index => {
        let imgData = this.canvasList[index].toDataURL('image/png')
        const base64Data = imgData.replace(/^data:image\/\w+;base64,/, '')
        const dataBuffer = Buffer.from(base64Data, 'base64')
        fs.writeFile(`${desktopDir}/cfr-pics/picture${index + 1}.png`, dataBuffer, function (err) {
          if (err) {
            console.log(err)
            return
          }
          console.log('图片保存成功')
          if (index === 2) {
            M.toast({html: '图片保存成功!', displayLength: 600})
          }
        })
      })
    }
  }
}
</script>

<style>
#toast-container {
  top: 60% !important;
  left: 50% !important;
  width: 160px;
  text-align: center;
  transform: translate(-50%, 0);
}
</style>

<style lang="scss" scoped>
.print-page {
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
.dot-left {
  position: absolute;
  top: 30px;
  left: 30px;
  width: 24px;
  height: 24px;
  border-radius: 24px;
  cursor: pointer;
  background-color: #eacfc8;
  z-index: 9;
}
.dot-right {
  position: absolute;
  top: 30px;
  right: 30px;
  width: 24px;
  height: 24px;
  border-radius: 24px;
  cursor: pointer;
  background-color: #8e9ec0;
  z-index: 9;
}

.dot-all {
  position: absolute;
  bottom: 22%;
  left: 50%;
  width: 30px;
  height: 30px;
  border-radius: 30px;
  cursor: pointer;
  transform: translate(-50%, 0);
  background-color: #8e9ec0;
  z-index: 9;
}

.title {
  position: relative;
  padding-top: 26px;
  color: #525966;
  text-align: center;
  h4 {
    font-weight: bold;
    font-size: 22px;
    letter-spacing: 0.3em;
  }
  p {
    margin-top: 30px;
    font-weight: bold;
  }
}

.list {
  display: flex;
  margin-top: 3%;
  width: 100%;
  height: 40%;
  justify-content: space-around;
  li {
    height: 30vw;
    width: 20vw;
    text-align: center;
    // background-color: red;
    canvas {
      height: 100%;
      width: 100%;
    }
    .dot {
      position: relative;
      top: 10px;
      margin-right: 6px;
      display: inline-block;
      width: 16px;
      height: 16px;
      border-radius: 16px;
      background-color: #72627c;
      cursor: pointer;
    }
    .dot-save {
      background-color: #82927c;
    }
  }
}

.logo {
  position: absolute;
  left: 50%;
  bottom: 4%;
  width: 10%;
  transform: translate(-50%, 0);
  cursor: pointer;
  img {
    width: 100%;
  }
}
</style>
