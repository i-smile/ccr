import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'start',
      component: require('@/views/startPage').default
    },
    {
      path: '/scanning',
      name: 'scanning',
      component: require('@/views/ScanningPage').default
    },
    {
      path: '/materialmenu',
      name: 'materialmenu',
      component: require('@/views/MaterialMenuPage').default
    },
    {
      path: '/clay',
      name: 'clay',
      component: require('@/views/ClayPage').default
    },
    {
      path: '/glaze',
      name: 'glaze',
      component: require('@/views/GlazePage').default
    },
    {
      path: '/texture',
      name: 'texture',
      component: require('@/views/TexturePage').default
    },
    {
      path: '/clay-lib',
      name: 'clay-lib',
      component: require('@/views/ClayLibPage').default
    },
    {
      path: '/glaze-lib',
      name: 'glaze-lib',
      component: require('@/views/GlazeLibPage').default
    },
    {
      path: '/texture-lib',
      name: 'texture-lib',
      component: require('@/views/TextureLibPage').default
    },
    {
      path: '/print',
      name: 'print',
      component: require('@/views/PrintPage').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
