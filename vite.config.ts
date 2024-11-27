import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { getRootPath, getSrcPath } from './build'


// https://vitejs.dev/config/
export default defineConfig(()=>{

  const rootPath = getRootPath()
  const srcPath = getSrcPath()

  return {
    plugins: [vue(),UnoCSS()],
    resolve: {
      alias: {
        '~': rootPath,
        '@': srcPath,
  
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "./src/styles/scss/global.scss" as *;',
        },
      },
    },
    server:{
      host:'0.0.0.0',
      port:8081
    }
  }

})
