import electron from 'electron'

const app = electron.app || electron.remote.app

export const userDir = app.getPath('userData')

export const desktopDir = app.getPath('desktop')

export const version = '1.1.0'
