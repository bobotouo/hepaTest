import { createRouter,createWebHashHistory } from "vue-router";

// import Home  from '../pages/Home.vue'
import NctA from '../pages/Nct-a.vue'
import NctB from '../pages/Nct-b.vue'
import Dst from '../pages/Dst.vue'
import Ltt from '../pages/Ltt.vue'

const  routes :any = [
    {
        path: '/',
        component:NctA
    },
    {
        path:'/ncta',
        component:NctA

    },
    {
        path:'/nctb',
        component:NctB
    },
    {
        path:'/ltt',
        component:Ltt
    }
]

const router = createRouter({
    history:createWebHashHistory(),
    routes
  })

  export default router