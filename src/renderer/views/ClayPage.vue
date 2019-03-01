<template>
  <div class="clay-page">
    <div class="dot-left" @click="navBack"></div>
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
      </div>
      <div class="swiper-container swiper-container-horizontal">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="item in clayLib" :key="item.name">
            <img class="item-bg" :src="item.name | toClayBgUrl">
            <img class="item-sample" :src="item.name | toClaySampleUrl">
            <div class="dot-tiny" @click.stop="showFormula(item)"></div>
            <div class="item-info">
              <h4>Ceramics Lib&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;C/L</h4>
              <p>001-{{item.name}}</p>
              <p>{{item.info}}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="dot-all" @click="navToClayLib"></div>
    </div>
    <div class="logo" @click="navToMaterialMenu">
      <img src="../assets/logo.png">
    </div>

    <div id="formulaModal" class="modal">
      <div class="modal-content">
        <h5>配方详情 - {{formulaItem.name}}</h5>
        <div class="detail">{{ formulaItem.formula || '该素材没有添加配方数据！' }}</div>
      </div>
      <div class="modal-footer">
        <a href="javascript:;" class="modal-close waves-effect waves-green btn-flat">关闭</a>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import 'swiper/dist/css/swiper.min.css'
import Swiper from 'swiper'
import _ from 'lodash'
import Render from '@/components/Render'

export default {
  data () {
    return {
      isReady: false,
      swiper: null,
      swiperInitIndex: 1,
      formulaModal: null,
      formulaItem: {}
    }
  },
  components: { Render },
  mounted () {
    this.swiperInitIndex = this.clayLib.length > 7 ? 3 : Math.floor(this.clayLib.length / 2)
    if (this.clay.name) {
      const index = _.findIndex(this.clayLib, { name: this.clay.name })
      this.swiperInitIndex = index
    } else {
      this.setCurrentClay(this.clayLib[this.swiperInitIndex].name)
    }
    console.log('mounted')
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
      clayLib: state => state.Material.clayLib,
      glaze: state => state.Material.glaze,
      texture: state => state.Material.texture
    })
  },
  methods: {
    ...mapActions(['setCurrentClay']),
    navBack () {
      this.$router.go(-1)
    },
    navToMaterialMenu () {
      this.$router.push({ path: '/materialmenu' })
    },
    navToClayLib () {
      this.$router.push({ path: '/clay-lib' })
    },
    initSwiper () {
      this.swiper = new Swiper('.swiper-container', {
        slidesPerView: 7,
        initialSlide: this.swiperInitIndex,
        centeredSlides: this.clayLib.length > 7,
        spaceBetween: 0,
        centerInsufficientSlides: true,
        slideToClickedSlide: true,
        grabCursor: true
      })
      this.swiper.on('slideChange', () => {
        console.log('onChange', this.swiper.activeIndex)
        this.setCurrentClay(this.clayLib[this.swiper.activeIndex].name)
      })
    },
    showFormula (item) {
      this.formulaItem = item
      this.formulaModal.open()
    }
  }
}
</script>

<style lang="scss" scoped>
.clay-page {
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
    // margin-top: 2%;
    width: 28vw;
    height: 45vw;
  }
  .swiper-container {
    flex: 1;
    top: 50%;
    transform: translate(0, -50%);
    width: 50%;
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
    background-color: #b59c59;
    z-index: 9;
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
