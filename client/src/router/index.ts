import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'
import H5pEditorRender from '../views/H5pEditorRender.vue'
import H5pPlayerRender from '../views/H5pPlayerRender.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/h5peditor',
    component: H5pEditorRender
  },
  {
    path: '/h5player',
    component: H5pPlayerRender
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
