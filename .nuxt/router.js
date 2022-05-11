import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _d28dac66 = () => interopDefault(import('..\\pages\\About\\index.vue' /* webpackChunkName: "pages/About/index" */))
const _2fbadd82 = () => interopDefault(import('..\\pages\\coursehome.vue' /* webpackChunkName: "pages/coursehome" */))
const _48e5d1de = () => interopDefault(import('..\\pages\\login.vue' /* webpackChunkName: "pages/login" */))
const _11e573fa = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages/index" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/About",
    component: _d28dac66,
    name: "About"
  }, {
    path: "/coursehome",
    component: _2fbadd82,
    name: "coursehome"
  }, {
    path: "/login",
    component: _48e5d1de,
    name: "login"
  }, {
    path: "/",
    component: _11e573fa,
    name: "index"
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config._app && config._app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}
