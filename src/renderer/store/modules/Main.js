const state = {
  appLaunchCount: 0,
  shotPics: []
}

const mutations = {
  setAppLaunchCount (state, count) {
    state.appLaunchCount = count
  },
  saveShotPic (state, data) {
    if (state.shotPics.length < 3) {
      state.shotPics.push(data)
    } else {
      state.shotPics.push(data)
      state.shotPics.shift()
    }
  },
  clearShotPics (state) {
    state.shotPics = []
  }
}

const actions = {
  incrementAppLaunchCount ({ commit, state }) {
    commit('setAppLaunchCount', state.appLaunchCount + 1)
  },
  saveShotPic ({ commit, state }, data) {
    commit('saveShotPic', data)
  },
  clearShotPics ({ commit }) {
    commit('clearShotPics')
  }
}

export default {
  state,
  mutations,
  actions
}
