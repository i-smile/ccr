import fs from 'fs-extra';
import path from 'path';
import electron from 'electron';
import _ from 'lodash';

const app = electron.app || electron.remote.app;

const state = {
  modelPath: '', // 模型文件路径
  glazeOpacity: 75,
  clay: {
    name: '',
    info: ''
  },
  glaze: {
    name: '',
    info: ''
  },
  texture: {
    name: '',
    info: ''
  },
  clayLib: [],
  glazeLib: [],
  textureLib: []
};

/* ===============================================
===================== mutations ====================
================================================ */
const mutations = {
  // 模型文件路径
  setModelPath(state, path) {
    state.modelPath = path;
  },
  // 釉料透明度
  setGlazeOpacity(state, value) {
    state.glazeOpacity = value;
  },
  // 增加泥料
  addClay(state, {
    name,
    info
  }) {
    state.clayLib.push({
      name,
      info
    });
  },
  // 编辑
  editClay(state, { name, info }) {
    const indexInLib = _.findIndex(state.clayLib, (n) => n.name === name);
    state.clayLib.splice(indexInLib, 1, { name, info });
  },
  // 删除泥料
  deleteClay(state, name) {
    const indexInLib = _.findIndex(state.clayLib, (n) => n.name === name);
    state.clayLib.splice(indexInLib, 1);
  },
  setCurrentClay(state, name) {
    if (!name) {
      state.clay = {
        name: '',
        info: ''
      };
    } else {
      state.clay = _.find(state.clayLib, { name });
    }
  },
  // 更新整个泥料列表（排序）
  updateClayLib(state, list) {
    state.clayLib = list;
  },
  clearClayLib(state) {
    state.clayLib = [];
  },

  // 增加釉料
  addGlaze(state, {
    name,
    info
  }) {
    state.glazeLib.push({
      name,
      info
    });
  },
  // 编辑
  editGlaze(state, { name, info }) {
    const indexInLib = _.findIndex(state.glazeLib, (n) => n.name === name);
    state.glazeLib.splice(indexInLib, 1, { name, info });
  },
  // 删除釉料
  deleteGlaze(state, name) {
    const indexInLib = _.findIndex(state.glazeLib, (n) => n.name === name);
    state.glazeLib.splice(indexInLib, 1);
  },
  setCurrentGlaze(state, name) {
    if (!name) {
      state.glaze = {
        name: '',
        info: ''
      };
    } else {
      state.glaze = _.find(state.glazeLib, { name });
    }
  },
  // 更新整个泥料列表（排序）
  updateGlazeLib(state, list) {
    state.glazeLib = list;
  },
  clearGlazeLib(state) {
    state.glazeLib = [];
  },

  // 增加纹理
  addTexture(state, {
    name,
    info
  }) {
    state.textureLib.push({
      name,
      info
    });
  },
  // 编辑
  editTexture(state, { name, info }) {
    const indexInLib = _.findIndex(state.textureLib, (n) => n.name === name);
    state.textureLib.splice(indexInLib, 1, { name, info });
  },
  // 删除纹理
  deleteTexture(state, name) {
    const indexInLib = _.findIndex(state.textureLib, (n) => n.name === name);
    state.textureLib.splice(indexInLib, 1);
  },
  setCurrentTexture(state, name) {
    if (!name) {
      state.texture = {
        name: '',
        info: ''
      };
    } else {
      state.texture = _.find(state.textureLib, { name });
    }
  },
  // 更新整个纹理列表（排序）
  updateTextureLib(state, list) {
    state.textureLib = list;
  },
  clearTextureLib(state) {
    state.textureLib = [];
  }
};

/* ===============================================
===================== actions ====================
================================================ */
const actions = {
  changeModelPath({
    commit
  }, data) {
    commit('setModelPath', data);
  },
  setGlazeOpacity({
    commit
  }, value) {
    commit('setGlazeOpacity', value);
  },
  // 添加泥料
  addClay({
    commit,
    state
  }, {
    needCopyFile = true,
    bgPath,
    samplePath,
    name = '',
    info = 'Porcelain, Oxidation Firng, Cone 6, 1220°C'
  }) {
    const {
      name: fileName
    } = path.parse(bgPath);
    if (!name) {
      name = fileName;
    };

    const distDir = path.join(
      app.getPath('userData'),
      '/material/clay/' + name
    );
    const distBgPath = path.join(distDir, `${name}.jpg`);
    const distSamplePath = path.join(distDir, '00.jpg');

    if (needCopyFile) {
      fs.copySync(bgPath, distBgPath);
      fs.copySync(samplePath, distSamplePath);
    }

    commit('addClay', {
      name,
      info
    });
  },
  // 编辑
  editClay({ commit }, item) {
    const {
      bgPath,
      samplePath,
      name
    } = item;

    const distDir = path.join(
      app.getPath('userData'),
      '/material/clay/' + name
    );
    const distBgPath = path.join(distDir, `${name}.jpg`);
    const distSamplePath = path.join(distDir, '00.jpg');

    bgPath !== distBgPath && fs.copySync(bgPath, distBgPath);
    samplePath !== distSamplePath && fs.copySync(samplePath, distSamplePath);

    commit('editClay', item);
  },
  // 删除泥料
  deleteClay({
    commit
  }, name) {
    console.log(name);
    const dir = path.join(
      app.getPath('userData'),
      '/material/clay/' + name
    );
    fs.removeSync(dir);
    commit('deleteClay', name);
  },
  setCurrentClay({
    commit
  }, name) {
    commit('setCurrentClay', name);
  },
  // 更新泥料库列表（排序）
  updateClayLib({ commit }, list) {
    commit('updateClayLib', list);
  },
  clearClayLib({ commit }) {
    commit('clearClayLib');
  },

  // 添加釉料
  addGlaze({
    commit,
    state
  }, {
    needCopyFile = true,
    bgPath,
    samplePath,
    name = '',
    info = 'Porcelain, Oxidation Firng, Cone 6, 1220°C'
  }) {
    const {
      name: fileName
    } = path.parse(bgPath);
    if (!name) {
      name = fileName;
    };

    const distDir = path.join(
      app.getPath('userData'),
      '/material/glaze/' + name
    );
    const distBgPath = path.join(distDir, `${name}.jpg`);
    const distSamplePath = path.join(distDir, '00.jpg');

    if (needCopyFile) {
      fs.copySync(bgPath, distBgPath);
      fs.copySync(samplePath, distSamplePath);
    }

    commit('addGlaze', {
      name,
      info
    });
  },
  // 编辑
  editGlaze({ commit }, item) {
    const {
      bgPath,
      samplePath,
      name
    } = item;

    const distDir = path.join(
      app.getPath('userData'),
      '/material/glaze/' + name
    );
    const distBgPath = path.join(distDir, `${name}.jpg`);
    const distSamplePath = path.join(distDir, '00.jpg');

    bgPath !== distBgPath && fs.copySync(bgPath, distBgPath);
    samplePath !== distSamplePath && fs.copySync(samplePath, distSamplePath);

    commit('editGlaze', item);
  },
  // 删除釉料
  deleteGlaze({
    commit
  }, name) {
    const dir = path.join(
      app.getPath('userData'),
      '/material/glaze/' + name
    );
    fs.removeSync(dir);
    commit('deleteGlaze', name);
  },
  setCurrentGlaze({
    commit
  }, name) {
    commit('setCurrentGlaze', name);
  },
  // 更新釉料库列表（排序）
  updateGlazeLib({ commit }, list) {
    commit('updateGlazeLib', list);
  },
  clearGlazeLib({ commit }) {
    commit('clearGlazeLib');
  },

  // 添加纹理
  addTexture({
    commit,
    state
  }, {
    needCopyFile = true,
    bgPath,
    samplePath,
    name = '',
    info = 'Porcelain, Oxidation Firng, Cone 6, 1220°C'
  }) {
    const {
      name: fileName
    } = path.parse(bgPath);
    if (!name) {
      name = fileName;
    };

    const distDir = path.join(
      app.getPath('userData'),
      '/material/texture/' + name
    );
    const distBgPath = path.join(distDir, `${name}.jpg`);
    const distSamplePath = path.join(distDir, '00.jpg');

    if (needCopyFile) {
      fs.copySync(bgPath, distBgPath);
      fs.copySync(samplePath, distSamplePath);
    }

    commit('addTexture', {
      name,
      info
    });
  },
  // 编辑
  editTexture({ commit }, item) {
    const {
      bgPath,
      samplePath,
      name
    } = item;

    const distDir = path.join(
      app.getPath('userData'),
      '/material/texture/' + name
    );
    const distBgPath = path.join(distDir, `${name}.jpg`);
    const distSamplePath = path.join(distDir, '00.jpg');

    bgPath !== distBgPath && fs.copySync(bgPath, distBgPath);
    samplePath !== distSamplePath && fs.copySync(samplePath, distSamplePath);

    commit('editTexture', item);
  },
  // 删除纹理
  deleteTexture({
    commit
  }, name) {
    const dir = path.join(
      app.getPath('userData'),
      '/material/texture/' + name
    );
    fs.removeSync(dir);
    commit('deleteTexture', name);
  },
  setCurrentTexture({
    commit
  }, name) {
    commit('setCurrentTexture', name);
  },
  // 更新纹理库列表（排序）
  updateTextureLib({ commit }, list) {
    commit('updateTextureLib', list);
  },
  clearTextureLib({ commit }) {
    commit('clearTextureLib');
  }
};

export default {
  state,
  mutations,
  actions
};
