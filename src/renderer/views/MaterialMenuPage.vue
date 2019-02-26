<template>
  <div class="material-page">
    <img class="title-text-pic" src="../assets/cfr.png" alt="">
    <ul class="content">
      <li @click="navToClay">
        <img src="../assets/btn-clay.png" />
      </li>
      <li @click="navToTexture">
        <img src="../assets/btn-texture.png" />
      </li>
      <li @click="navToGlaze">
        <img src="../assets/btn-glaze.png" />
      </li>
    </ul>
    <div class="logo" @click="navBack">
      <img src="../assets/logo.png">
    </div>
  </div>
</template>

<script>
// import { mapState } from 'vuex';
import { remote } from 'electron'
import { mapState } from 'vuex'
import Render from '@/components/Render'

const { dialog } = remote

export default {
  data () {
    return {}
  },
  components: { Render },
  computed: {
    ...mapState({
      clay: state => state.Material.clay
    })
  },
  methods: {
    navBack () {
      this.$router.go(-1)
    },
    navToClay () {
      this.$router.push({ path: '/clay' })
    },
    navToTexture () {
      if (this.clay.name) {
        this.$router.push({ path: '/texture' })
      } else {
        dialog.showErrorBox('错误提示', '请先选择泥料')
      }
    },
    navToGlaze () {
      if (this.clay.name) {
        this.$router.push({ path: '/glaze' })
      } else {
        dialog.showErrorBox('错误提示', '请先选择泥料')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.material-page {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #f9ece7;
}
.title-text-pic {
  position: absolute;
  top: 12%;
  left: 10%;
  width: 24%;
}

.content {
  position: absolute;
  top: 30%;
  left: 10%;
  width: 80%;
  height: 40%;
  li {
    position: absolute;
    cursor: pointer;
    width: 14vw;
    height: 14vw;
    max-width: 160px;
    max-height: 160px;
    img {
      width: 100%;
      height: 100%;
    }
    &:nth-child(1) {
      left: 0;
      bottom: 0;
    }
    &:nth-child(2) {
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
    &:nth-child(3) {
      right: 0;
      top: 0;
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
