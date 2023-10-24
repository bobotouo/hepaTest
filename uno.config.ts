import {defineConfig,presetAttributify, presetUno} from 'unocss'


export default defineConfig({
  shortcuts: [
    ['center', 'flex items-center justify-center'],
],
    presets: [
      presetUno(),
      presetAttributify(),
    ],
  })