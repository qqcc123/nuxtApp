export const NuxtLogo = () => import('../..\\components\\NuxtLogo.vue' /* webpackChunkName: "components/nuxt-logo" */).then(c => wrapFunctional(c.default || c))
export const Tutorial = () => import('../..\\components\\Tutorial.vue' /* webpackChunkName: "components/tutorial" */).then(c => wrapFunctional(c.default || c))
export const Carousel = () => import('../..\\components\\carousel\\Carousel.vue' /* webpackChunkName: "components/carousel" */).then(c => wrapFunctional(c.default || c))
export const CarouselCovTouch = () => import('../..\\components\\carousel\\cov-touch.js' /* webpackChunkName: "components/carousel-cov-touch" */).then(c => wrapFunctional(c.default || c))
export const CarouselVueSlide = () => import('../..\\components\\carousel\\vue-slide.vue' /* webpackChunkName: "components/carousel-vue-slide" */).then(c => wrapFunctional(c.default || c))
export const HomeClassification = () => import('../..\\components\\home\\Classification.vue' /* webpackChunkName: "components/home-classification" */).then(c => wrapFunctional(c.default || c))
export const HomeMyheader = () => import('../..\\components\\home\\Myheader.vue' /* webpackChunkName: "components/home-myheader" */).then(c => wrapFunctional(c.default || c))

// nuxt/nuxt.js#8607
function wrapFunctional(options) {
  if (!options || !options.functional) {
    return options
  }

  const propKeys = Array.isArray(options.props) ? options.props : Object.keys(options.props || {})

  return {
    render(h) {
      const attrs = {}
      const props = {}

      for (const key in this.$attrs) {
        if (propKeys.includes(key)) {
          props[key] = this.$attrs[key]
        } else {
          attrs[key] = this.$attrs[key]
        }
      }

      return h(options, {
        on: this.$listeners,
        attrs,
        props,
        scopedSlots: this.$scopedSlots,
      }, this.$slots.default)
    }
  }
}
