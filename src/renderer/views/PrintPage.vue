<template>
  <div class="print-page">
    <div class="dot-left" @click="navBack"></div>
    <div class="title">
      <h4>Ceramics Fitting Room</h4>
      <p>
        <span>●&nbsp;&nbsp;&nbsp;Print&nbsp;&nbsp;&nbsp;●</span>
      </p>
    </div>

    <ul class="list">
      <li v-for="(item, index) in shotPics" :key="index">
        <canvas :id="'canvas' + index" :width="canvasWidth" :height="canvasHeight"></canvas>
        <div class="dot" @click="print(index)"></div>
      </li>
    </ul>

    <div class="logo"  @click="navToStartPage">
      <img src="../assets/logo.png">
    </div>
  </div>
</template>

<script>
import fs from 'fs'
// import path from 'path';
// import { mapState } from 'vuex';
import { ipcRenderer } from 'electron'
import { mapState, mapActions } from 'vuex'
import Render from '@/components/Render'
import { setTimeout } from 'timers'
import { userDir } from '@/const'
import bgImgUrl from '@/assets/print-bg.jpg'

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
      shotPics: state => state.Main.shotPics
    })
  },
  mounted () {
    this.canvasList = document.getElementsByTagName('canvas');

    [0, 1, 2].forEach(index => {
      const canvas = this.canvasList[index]
      const ctx = canvas.getContext('2d')

      const bgImg = new Image()
      const threeImg = new Image()
      bgImg.src = bgImgUrl
      threeImg.src = this.shotPics[index]

      setTimeout(() => {
        ctx.fillStyle = 'rgba(192, 80, 77, 0.7)'
        ctx.drawImage(bgImg, 0, 0, this.canvasWidth, this.canvasHeight)
        // ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        ctx.drawImage(threeImg, 160, 320, this.canvasWidth - 336, this.canvasHeight - 510)
        ctx.fillStyle = '#a37150'
        ctx.font = '50px Arial'
        ctx.rotate(90 * Math.PI / 180)
        // ctx.fillText(dateText, 480, -890);
      }, 1000)
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
      this.setCurrentClay()
      this.setCurrentGlaze()
      this.setCurrentTexture()
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
        // ipcRenderer.send('print-silent', `file://${userDir}/printPicture${index + 1}.png`);
        ipcRenderer.send('print-preview', `file://${userDir}/printPicture${index + 1}.png`)
      })
    }
  }
}
</script>

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
