import Vue from 'vue'
import path from 'path'
import { userDir } from '@/const'

Vue.filter('toClayBgUrl', function (name) {
  return 'file://' + path.join(userDir, `/material/clay/${name}/${name}.jpg`)
})
Vue.filter('toClaySampleUrl', function (name) {
  return 'file://' + path.join(userDir, `/material/clay/${name}/00.jpg`)
})
Vue.filter('toGlazeBgUrl', function (name) {
  return 'file://' + path.join(userDir, `/material/glaze/${name}/${name}.jpg`)
})
Vue.filter('toGlazeSampleUrl', function (name) {
  return 'file://' + path.join(userDir, `/material/glaze/${name}/00.jpg`)
})
Vue.filter('toTextureBgUrl', function (name) {
  return 'file://' + path.join(userDir, `/material/texture/${name}/${name}.jpg`)
})
Vue.filter('toTextureSampleUrl', function (name) {
  return 'file://' + path.join(userDir, `/material/texture/${name}/00.jpg`)
})
