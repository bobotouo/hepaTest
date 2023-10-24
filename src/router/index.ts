import { createRouter,createWebHashHistory } from "vue-router";

// import Home  from '../pages/Home.vue'
import NctA from '../pages/Nct-a.vue'
import NctB from '../pages/Nct-b.vue'

import Dst from '../pages/Dst.vue'

const  routes :any = [
    {
        path: '/',
        component:Dst
    },
    {
        path:'/ncta',
        component:NctA

    },
    {
        path:'/nctb',
        component:NctB

    }
]

const router = createRouter({
    history:createWebHashHistory(),
    routes
  })

  export default router