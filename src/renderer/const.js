import electron from 'electron'

const app = electron.app || electron.remote.app

export const userDir = app.getPath('userData')

export const version = '1.1.0'
