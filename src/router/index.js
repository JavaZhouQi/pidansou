import { createRouter,createWebHashHistory} from "vue-router";

const home = () => import("@/views/home/home.vue")
const user = () => import("@/views/user/user.vue")

const routes = [
  { 
    path: "/", 
    redirect: "/home" 
  },
  {
    path: "/home",
    name: "home",
    component: home
  },
  {
    path: "/user",
    name: "user",
    component: user
  }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes: routes
})

export default router