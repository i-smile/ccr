<template>
  <div class="scanning-page">
    <div class="title">
      <h4>Ceramics Fitting Room</h4>
      <p>
        <span>●&nbsp;&nbsp;&nbsp;3D-Scanning&nbsp;&nbsp;&nbsp;●</span>
      </p>
    </div>
    <div class="render-wrapper">
      <render v-if="modelPath"></render>
    </div>
    <div class="logo"  @click="navToMaterialMenu">
      <img src="../assets/logo.png">
    </div>
  </div>
</template>

<script>
// import { mapState } from 'vuex';
import { mapState } from 'vuex';
import Render from '@/components/Render';

export default {
  data() {
    return {};
  },
  components: { Render },
  computed: {
    ...mapState({
      modelPath: state => state.Material.modelPath
    })
  },
  methods: {
    navToMaterialMenu() {
      this.$router.push({ path: 'materialmenu' });
    }
  }
};
</script>

<style lang="scss" scoped>
.scanning-page {
  position: relative;
  width: 100%;
  height: 100%;
  // padding: 40px;
  box-sizing: border-box;
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

.render-wrapper {
  position: relative;
  left: 25%;
  width: 50%;
  height: 60%;
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
