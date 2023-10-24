import {defineConfig,presetAttributify} from 'unocss'


export default defineConfig({
  shortcuts: [
    ['center', 'flex items-center justify-center'],
],
    presets: [
      presetAttributify(),
    ],
  })