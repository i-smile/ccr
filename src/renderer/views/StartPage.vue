<template>
  <div class="start-page">
    <div class="wrapper">
      <img class="bg" src="../assets/start-bg.png">
      <div class="cfr-area" @click="chooseModelFile"></div>
      <div class="logo" @click="chooseModelFile">
        <img src="../assets/logo2.png">
      </div>
    </div>
  </div>
</template>

<script>
import { remote } from 'electron'
import { mapActions } from 'vuex'
const { dialog } = remote

export default {
  data () {
    return {}
  },
  methods: {
    ...mapActions(['changeModelPath']),
    chooseModelFile () {
      dialog.showOpenDialog(
        {
          filters: [{ name: 'Model', extensions: ['obj'] }]
        },
        async (filePaths) => {
          if (filePaths && filePaths.length) {
            await this.changeModelPath('file://' + filePaths[0])
            this.$router.push({ path: '/scanning' })
          }
        }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.start-page {
  position: relative;
  width: 100%;
  height: 100%;
}
.wrapper {
  position: relative;
  text-align: center;
  width: 100%;
  height: 100%;
  .bg {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    max-width: 100%;
    max-height: 100%;
  }
  .cfr-area {
    position: absolute;
    top: 36%;
    left: 35%;
    width: 30%;
    height: 20%;
    cursor: pointer;
  }
  .logo {
    position: absolute;
    left: 50%;
    bottom: 10%;
    width: 10%;
    transform: translate(-50%, 0);
    cursor: pointer;
    img {
      width: 100%;
    }
  }
}
</style>
