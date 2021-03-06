<template>
  <div class="glaze-page">
    <div class="dot-left" @click="navBack"></div>
    <!-- <div class="dot-right" @click="navToPrintPage"></div> -->
    <div class="title">
      <h4>Ceramics Fitting Room</h4>
      <p>
        <span v-if="clay.name">
          ●&nbsp;&nbsp;&nbsp;Clay 001-{{clay.name}}
        </span>
        <span v-if="texture.name">
          &nbsp;&nbsp;&nbsp;●&nbsp;&nbsp;&nbsp;Texture 001-{{texture.name}}
        </span>
        <span v-if="glaze.name">
          &nbsp;&nbsp;&nbsp;●&nbsp;&nbsp;&nbsp;Glaze 001-{{glaze.name}}
        </span>
        &nbsp;&nbsp;&nbsp;●
      </p>
    </div>
    <div class="middle">
      <div class="render-wrapper">
        <render></render>
        <div class="shot" @click="picShot">
          <span class="dot-shot"></span>
          <span>0{{shotPicCount === 3 ? 3 : shotPicCount + 1}}</span>
        </div>
      </div>

      <div class="swiper-container swiper-container-horizontal">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="item in glazeLib" :key="item.name">
            <img class="item-bg" :src="item.name | toGlazeBgUrl">
            <img class="item-sample" :src="item.name | toGlazeSampleUrl">
            <div class="dot-tiny" @click.stop="showFormula(item)"></div>
            <div class="item-info">
              <h4>Ceramics Lib&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;C/L</h4>
              <p>001-{{item.name}}</p>
              <p>{{item.info}}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="range">
        <p class="range-field">
          <input type="range" id="opacityRange" @change="onOpacityChange" min="0" max="100" />
        </p>
      </div>
      <div class="dot-all" @click="navToGlazeLib"></div>
    </div>
    <div class="logo" @click="navBack">
      <img src="../assets/logo.png">
    </div>

    <div id="formulaModal" class="modal">
      <div class="modal-content">
        <h5>配方详情 - {{formulaItem.name}}</h5>
        <div class="detail" v-if="formulaItem.formula">
          <div class="row" v-if="formulaItem.password && formulaItem.password !== formulaItem.inputPassword">
            <div class="input-field col s12">
              <i class="material-icons prefix">lock</i>
              <input type="password" v-model="formulaItem.inputPassword" id="passwdInput1" class="materialize-textarea">
              <label for="passwdInput1">输入密码可查看/编辑配方</label>
            </div>
          </div>
          <div v-else>{{formulaItem.formula}}</div>
        </div>
        <div class="detail" v-else>
          该素材没有添加配方数据！
        </div>
      </div>
      <div class="modal-footer">
        <a href="javascript:;" class="modal-close waves-effect waves-green btn-flat">关闭</a>
      </div>
    </div>
  </div>
</template>

<script>
import fs from 'fs'
import { mapState, mapActions } from 'vuex'
import 'swiper/dist/css/swiper.min.css'
import Swiper from 'swiper'
import _ from 'lodash'
import { convertToPNG } from 'canvas2image-es6'
import Render from '@/components/Render'
import { setTimeout } from 'timers'
import { userDir } from '@/const'

export default {
  data () {
    return {
      isReady: false,
      swiper: null,
      swiperInitIndex: 1,
      formulaModal: null,
      formulaItem: {},
      shotPicCount: 0
    }
  },
  components: { Render },
  mounted () {
    this.swiperInitIndex = this.glazeLib.length > 7 ? 3 : Math.floor(this.glazeLib.length / 2)
    if (this.glaze.name) {
      const index = _.findIndex(this.glazeLib, { name: this.glaze.name })
      this.swiperInitIndex = index
    } else {
      this.setCurrentGlaze(this.glazeLib[this.swiperInitIndex].name)
    }
    this.clearShotPics()
    this.initSwiper()

    this.$nextTick(() => {
      M.AutoInit() // 初始化 materialize
      this.formulaModal = M.Modal.getInstance(
        document.getElementById('formulaModal')
      )
    })
  },
  computed: {
    ...mapState({
      clay: state => state.Material.clay,
      glaze: state => state.Material.glaze,
      texture: state => state.Material.texture,
      glazeLib: state => state.Material.glazeLib,
      shotPics: state => state.Main.shotPics,
      glazeOpacity: state => state.Material.glazeOpacity
    })
  },
  methods: {
    ...mapActions(['setCurrentGlaze', 'saveShotPic', 'clearShotPics', 'setGlazeOpacity']),
    navBack () {
      this.$router.go(-1)
    },
    navToPrintPage () {
      this.$router.push({ path: '/print' })
    },
    navToGlazeLib () {
      this.$router.push({ path: '/glaze-lib' })
    },
    onOpacityChange (e) {
      const opacity = e.target.value
      this.setGlazeOpacity(opacity)
    },
    initSwiper () {
      this.swiper = new Swiper('.swiper-container', {
        slidesPerView: 7,
        initialSlide: this.swiperInitIndex,
        centeredSlides: this.glazeLib.length > 7,
        spaceBetween: 0,
        centerInsufficientSlides: true,
        slideToClickedSlide: true,
        grabCursor: true
      })
      this.swiper.on('slideChange', () => {
        console.log('onchange', this.swiper.activeIndex)
        this.setCurrentGlaze(this.glazeLib[this.swiper.activeIndex].name)
      })
    },
    showFormula (item) {
      this.formulaItem = _.clone(item)
      this.formulaModal.open()
    },
    picShot () {
      if (this.shotPicCount === 3) return
      const pic = convertToPNG('threeCanvas')

      let imgData = pic.src
      const base64Data = imgData.replace(/^data:image\/\w+;base64,/, '')
      const dataBuffer = Buffer.from(base64Data, 'base64')
      fs.writeFile(`${userDir}/shotPicture${this.shotPicCount + 1}.png`, dataBuffer, (err) => {
        if (err) return
        console.log('图片保存成功')
        this.shotPicCount++
        if (this.shotPicCount === 3) {
          setTimeout(this.navToPrintPage, 500)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.glaze-page {
  position: relative;
  width: 100%;
  height: 100%;
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

.middle {
  position: relative;
  display: flex;
  left: 2%;
  text-align: center;
  width: 96%;
  height: 60%;
  .render-wrapper {
    position: relative;
    margin-top: 2%;
    width: 28vw;
    height: 45vw;
  }
  .swiper-container {
    flex: 1;
    top: 50%;
    transform: translate(0, -50%);
    height: 26vw;
    .swiper-slide {
      position: relative;
      top: 2vw;
      text-align: center;
      font-size: 18px;
      background: #fff;
      height: 56%;
      width: 14.3%;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.14s ease-in-out;
      .item-bg {
        width: 120%;
      }
      .item-sample {
        position: absolute;
        top: 36%;
        left: 45%;
        width: 10%;
      }
      .dot-tiny {
        position: absolute;
        top: 8%;
        left: 50%;
        width: 0.8vw;
        height: 0.8vw;
        border-radius: 2vw 2vw;
        transform: translate(-50%, 0);
        background-color: #fff;
        &:hover {
          background-color: #555;
        }
      }
      .item-info {
        text-align: left;
        padding: 0 4px;
        h4 {
          margin: 0em 0 0.2em;
          font-size: 4px;
        }
        p {
          font-size: 3px;
          margin: 0.3em 0;
        }
      }
    }
    .swiper-slide-active {
      transform-origin: 50% 20%;
      box-shadow: 1px 2px 6px #555;
      transform: scale(1.4);
      z-index: 1;
    }
  }
  .dot-all {
    position: absolute;
    top: 64%;
    right: 0;
    width: 24px;
    height: 24px;
    cursor: pointer;
    background-color: #3d3d57;
    z-index: 9;
  }
  .range {
    position: absolute;
    top: 76%;
    right: 28%;
    width: 14.6%;
    z-index: 2;
  }
  .shot {
    position: absolute;
    left: 0;
    bottom: -20px;
    width: 28vw;
    text-align: center;
    cursor: pointer;
    z-index: 9;
    color: #3d5f72;
    line-height: 1;
    font-size: 12px;
    font-weight: bold;
    .dot-shot {
      position: relative;
      top: 3px;
      margin-right: 6px;
      display: inline-block;
      width: 16px;
      height: 16px;
      border-radius: 16px;
      background-color: #72627c;
    }
    &:hover {
      color: #6d6fa2;
      .dot-shot {
        background-color: #3d5f72;
      }
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

.modal {
  .modal-content {
    padding: 18px;
    h5 {
      font-size: 16px;
      margin: 0 0 10px;
    }
    .detail {
      padding: 20px 10px;
      font-size: 14px;
      background-color: #f4f4f4;
      border-radius: 4px;
    }
  }
}
</style>
