<template>
  <div class="texture-lib-page">
    <div class="list-wrapper">
      <draggable class="list" element="ul" v-model="textureLib">
        <transition-group>
          <li class="item" v-for="item in textureLib" :key="item.name" @click="chooseItem(item.name)">
            <div class="item-bg">
              <img :src="item.name | toTextureBgUrl">
            </div>
            <img class="item-sample" :src="item.name | toTextureSampleUrl">
            <div class="dot-tiny"></div>
            <div class="item-info">
              <h4>Ceramics Lib&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;C/L</h4>
              <p>001-{{item.name}}</p>
              <p>{{item.info}}</p>
            </div>
            <div class="actions">
              <div>
                <i
                  class="material-icons tiny"
                  @click.stop="editItem(item)"
                >edit</i>
              </div>
              <div>
                <i class="material-icons tiny" @click.stop="deleteItem(item)">delete_forever</i>
              </div>
            </div>
          </li>
        </transition-group>
      </draggable>
      <li class="item add-placeholder" key="add" @click="addItem">
        <i class="material-icons">add</i>
      </li>
    </div>
    <div class="logo" @click="navBack">
      <img src="../assets/logo.png">
    </div>

    <div id="modalAdd" class="modal modal-fixed-footer">
      <div class="modal-content">
        <h5>添加纹理</h5>
        <div class="add-img-row">
          <div class="add-img-wrapper" @click="chooseBgFile">
            <img v-if="newItem.bgUrl" :src="newItem.bgUrl">
            <div v-else class="add-placeholder">
              <i class="material-icons medium">add</i>
            </div>
            <p>纹理图片</p>
          </div>
          <div class="add-img-wrapper" @click="chooseSampleFile">
            <img v-if="newItem.sampleUrl" :src="newItem.sampleUrl">
            <div v-else class="add-placeholder">
              <i class="material-icons medium">add</i>
            </div>
            <p>试片图片</p>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <i class="material-icons prefix">insert_drive_file</i>
            <input type="text" :disabled="currentAction === 'edit'" v-model="newItem.name" id="nameInput" class="materialize-textarea">
            <label for="nameInput" class="active">Name</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <i class="material-icons prefix">info</i>
            <textarea
              type="text"
              v-model="newItem.info"
              id="infoInput"
              class="materialize-textarea"
            ></textarea>
            <label for="infoInput" class="active">Infomations</label>
          </div>
        </div>
        <!-- 有密码，需要输入密码 -->
        <div v-if="newItem.hasPassword && newItem.inputPassword !== newItem.password">
          <div class="row">
            <div class="input-field col s12">
              <i class="material-icons prefix">lock</i>
              <input type="password" v-model="newItem.inputPassword" id="passwdInput1" class="materialize-textarea">
              <label for="passwdInput1">输入密码可查看/编辑配方</label>
            </div>
          </div>
        </div>
        <!-- 有密码，且已经输入了正确的密码，可以查看配方、编辑配方、修改密码 -->
        <div v-else-if="newItem.hasPassword && newItem.inputPassword === newItem.password">
          <div class="row">
            <div class="input-field col s12">
              <i class="material-icons prefix">palette</i>
              <input type="text" v-model="newItem.formula" id="formulaInput" class="materialize-textarea">
              <label for="formulaInput" :class="{'active': newItem.formula}">Formula</label>
            </div>
          </div>
        </div>
        <!-- 没有密码 -->
        <div v-else>
          <div class="row">
            <div class="input-field col s12">
              <i class="material-icons prefix">lock</i>
              <input type="password" :disabled="newItem.hasPassword" v-model="newItem.password" id="passwdInput" class="materialize-textarea">
              <label for="passwdInput" :class="{'active': newItem.password}">Formula Password</label>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12">
              <i class="material-icons prefix">palette</i>
              <input type="text" v-model="newItem.formula" id="formulaInput" class="materialize-textarea">
              <label for="formulaInput" :class="{'active': newItem.formula}">Formula</label>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <a href="javascript:;" class="waves-effect light-blue lighten-4 btn-small btn-flat" @click="commit">提交</a>
        <a href="javascript:;" class="modal-close waves-effect grey lighten-2 btn-small btn-flat">取消</a>
      </div>
    </div>
  </div>
</template>

<script>
import path from 'path'
import { mapState, mapActions } from 'vuex'
import draggable from 'vuedraggable'
import { remote } from 'electron'
import _ from 'lodash'
import { userDir } from '@/const'

const { dialog } = remote

export default {
  data () {
    return {
      currentAction: 'add', // add edit
      newItem: {
        bgPath: '',
        samplePath: '',
        bgUrl: '',
        sampleUrl: '',
        name: '',
        info: 'Porcelain, Oxidation Firng, Cone 6, 1220°C',
        formula: '',
        password: '',
        hasPassword: false,
        inputPassword: ''
      },
      myAddModal: null
    }
  },
  mounted () {
    this.$nextTick(() => {
      M.AutoInit() // 初始化 materialize
      this.myAddModal = M.Modal.getInstance(
        document.getElementById('modalAdd')
      )
    })
    this.textureLib.forEach(i => {
      console.log(i.name)
    })
  },
  components: {
    draggable
  },
  computed: {
    ...mapState({}),
    textureLib: {
      get () {
        return this.$store.state.Material.textureLib
      },
      set (value) {
        this.$store.dispatch('updateTextureLib', value)
      }
    }
  },
  methods: {
    ...mapActions(['setCurrentTexture', 'addTexture', 'editTexture', 'deleteTexture']),
    navBack () {
      this.$router.go(-1)
    },
    navToMaterialMenu () {
      this.$router.push({ path: '/materialmenu' })
    },
    chooseItem (name) {
      this.setCurrentTexture(name)
      this.navBack()
    },
    chooseBgFile () {
      dialog.showOpenDialog(
        {
          filters: [{ extensions: ['jpg'] }]
        },
        filePaths => {
          if (filePaths && filePaths.length) {
            const { name } = path.parse(filePaths[0])
            if (!this.newItem.name) {
              this.newItem.name = name
              document.getElementById('nameInput').focus()
            }
            this.newItem.bgPath = filePaths[0]
            this.newItem.bgUrl = 'file://' + filePaths[0]
          }
        }
      )
    },
    chooseSampleFile () {
      dialog.showOpenDialog(
        {
          filters: [{ extensions: ['jpg'] }]
        },
        filePaths => {
          if (filePaths && filePaths.length) {
            this.newItem.samplePath = filePaths[0]
            this.newItem.sampleUrl = 'file://' + filePaths[0]
          }
        }
      )
    },
    commit () {
      if (!this.newItem.bgUrl) {
        dialog.showErrorBox('错误提示', '请选择素材图片')
      } else if (!this.newItem.sampleUrl) {
        dialog.showErrorBox('错误提示', '请选择试片图片')
      } else if (!this.newItem.name) {
        dialog.showErrorBox('错误提示', '名字不能为空')
      } else if (!this.newItem.info) {
        dialog.showErrorBox('错误提示', '描述信息不能为空')
      } else if (this.newItem.password && !/^.{6}$/.test(this.newItem.password)) {
        dialog.showErrorBox('错误提示', '密码必须为6位')
      } else {
        const indexInLib = _.findIndex(this.textureLib, {
          name: this.newItem.name
        })

        if (this.currentAction === 'add') {
          if (indexInLib !== -1) {
            dialog.showErrorBox(
              '错误提示',
              `素材库中已经有名字为${this.newItem.name}，请更换一个名字`
            )
          } else {
            this.addTexture(this.newItem)
          }
        } else {
          this.editTexture(this.newItem)
        }
        this.myAddModal.close()
      }
    },
    editItem ({ name, info, formula, password = '', inputPassword = '' }) {
      this.currentAction = 'edit'
      const bgPath = path.join(userDir, `/material/texture/${name}/${name}.jpg`)
      const samplePath = path.join(userDir, `/material/texture/${name}/00.jpg`)

      const hasPassword = !!password

      this.newItem = {
        bgPath,
        samplePath,
        bgUrl: 'file://' + bgPath,
        sampleUrl: 'file://' + samplePath,
        name,
        info,
        formula,
        password,
        hasPassword,
        inputPassword
      }
      this.myAddModal.open()
    },
    addItem () {
      this.currentAction = 'add'
      this.newItem = {
        bgPath: '',
        samplePath: '',
        bgUrl: '',
        sampleUrl: '',
        name: '',
        info: 'Porcelain, Oxidation Firng, Cone 6, 1220°C',
        formula: '',
        password: '',
        hasPassword: false,
        inputPassword: ''
      }
      this.myAddModal.open()
    },
    deleteItem ({ name }) {
      this.deleteTexture(name)
    }
  }
}
</script>

<style lang="scss" scoped>
.texture-lib-page {
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

.list-wrapper {
  width: 100%;
  padding: 20px 20px 90px;
}

.list {
  display: inline;
  margin: 0;
  // width: 100%;
  // padding: 20px 20px 90px;
  box-sizing: border-box;
}

.item {
  position: relative;
  display: inline-block;
  text-align: center;
  font-size: 18px;
  background: #fff;
  width: 10%;
  height: 14.5vw;
  // overflow: hidden;
  transition: all 0.14s ease-in-out;
  transform-origin: 50% 20%;
  .item-bg {
    width: 100%;
    overflow: hidden;
    img {
      width: 120%;
    }
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
  }
  .item-info {
    text-align: left;
    padding: 0 4px;
    font-weight: bold;
    h4 {
      margin: 0em 0 0.2em;
      font-size: 4px;
    }
    p {
      font-size: 3px;
      margin: 0.3em 0;
    }
  }
  .actions {
    position: absolute;
    visibility: hidden;
    display: flex;
    bottom: -26px;
    width: 100%;
    padding: 0 6px;
    box-sizing: border-box;
    background-color: #fff;
    justify-content: space-between;
    box-shadow: 1px 2px 4px #555;
    i {
      font-size: 14px;
      &:hover {
        color: #999;
      }
    }
  }
  &:hover {
    cursor: pointer;
    box-shadow: 1px 1px 4px #555;
    transform: scale(1.4);
    z-index: 1;
    .actions {
      visibility: visible;
    }
  }
}
.add-placeholder {
  position: relative;
  border: dashed 1px #aaa;
  border-radius: 6px;
  width: 9%;
  height: 14vw;
  cursor: pointer;
  i {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 2em;
  }
  &:hover {
    transform: scale(1.04);
  }
}

.modal {
  .modal-content {
    padding: 18px;
    // max-height: 9999px;
    h5 {
      font-size: 16px;
      margin: 0 0 10px;
    }
  }
  .add-img-row {
    display: flex;
    justify-content: space-around;
    .add-img-wrapper {
      display: inline-block;
      text-align: center;
      width: 160px;
      cursor: pointer;
      .add-placeholder {
        width: 100%;
        height: 160px;
      }
      img {
        max-width: 100%;
        max-height: 160px;
      }
    }
  }
  .row {
    margin-bottom: 0;
  }
  .modal-close.btn-small {
    color: #555;
  }
}
.modal.modal-fixed-footer {
  top: 5% !important;
  height: 90%;
  max-height: 90%;
}

.logo {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 60px;
  background-color: #fff;
  z-index: 2;
  img {
    position: absolute;
    left: 50%;
    top: 20%;
    height: 60%;
    transform: translate(-50%, 0);
    cursor: pointer;
  }
}
</style>
