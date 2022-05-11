exports.ids = [1,2,3];
exports.modules = {

/***/ 26:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(30);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(7).default
module.exports.__inject__ = function (context) {
  add("0fd6aa2e", content, true, context)
};

/***/ }),

/***/ 27:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
const TOUCH_EVENT_MAP = {
  'touchstart': 1,
  'touchmove': 1,
  'touchend': 1
};
const MOUSE_EVENT_MAP = {
  'mousedown': 1,
  'mousemove': 1,
  'mouseup': 1
};
const _ = {
  on(el, type, func) {
    el.addEventListener(type, func, false);
  },

  off(el, type, func) {
    el.removeEventListener(type, func, false);
  }

};

class CovTouch {
  constructor({
    el
  }) {
    this._hasTouch = 'ontouchstart' in window;
    this.$el = el;
    this.init();
    this.touch = {
      start: null,
      end: null
    };
    this.state = {
      swiping: false,
      global: false
    };
    this.queue = {
      'swiping': [],
      'swiped': [],
      'swipe-left': [],
      'swipe-right': [],
      'swipe-up': [],
      'swipe-down': []
    };
  }

  init() {
    if (this._hasTouch) {
      _.on(this.$el, 'touchstart', this.touchStart.bind(this));

      _.on(window, 'touchmove', this.touchMove.bind(this));

      _.on(window, 'touchend', this.touchEnd.bind(this));

      _.on(window, 'touchcancel', this.touchCancel.bind(this));
    } else {
      _.on(this.$el, 'mousedown', this.touchStart.bind(this));

      _.on(window, 'mousemove', this.touchMove.bind(this));

      _.on(window, 'mouseup', this.touchEnd.bind(this));
    }
  }

  destroy() {
    if (this.$el) {
      _.off(this.$el, 'touchstart', this.touchStart.bind(this));

      _.off(this.$el, 'mousedown', this.touchStart.bind(this));
    }

    _.off(window, 'touchmove', this.touchMove.bind(this));

    _.off(window, 'touchend', this.touchEnd.bind(this));

    _.off(window, 'touchcancel', this.touchCancel.bind(this));

    _.off(window, 'mousemove', this.touchMove.bind(this));

    _.off(window, 'mouseup', this.touchEnd.bind(this));

    this.queue = {
      'swiping': [],
      'swiped': [],
      'swipe-left': [],
      'swipe-right': [],
      'swipe-up': [],
      'swipe-down': []
    };
  }

  setGlobal() {
    this.state.global = true;
  }

  cancelGlobal() {
    this.state.global = false;
  }

  listen(type, $el, func) {
    let rect;

    if (!$el) {
      rect = null;
    } else {
      let tmp = $el.getBoundingClientRect();
      rect = {
        x: tmp.left,
        y: tmp.top,
        width: tmp.width,
        height: tmp.height
      };
    }

    let token = Math.random() * 9999 + type;
    this.queue[type].push({
      $el: $el,
      token: token,
      func: func,
      rect: rect
    });
  }

  leave(type, token) {
    if (!this.queue[type]) return false;

    for (let i = 0, len = this.queue[type].length; i < len; i++) {
      if (this.queue[type].token === token) {
        this.queue[type].splice(i - 1, 1);
        return true;
      }
    }

    return false;
  }

  update() {
    let keys = Object.keys(this.queue);
    let tmp;

    for (let key of keys) {
      this.queue[key].forEach(item => {
        if (item.$el) {
          tmp = item.$el.getBoundingClientRect();
          item.rect = {
            x: tmp.left,
            y: tmp.top,
            width: tmp.width,
            height: tmp.height
          };
        }
      });
    }
  }

  clear() {
    let keys = Object.keys(this.queue);

    for (let key of keys) {
      this.queue[key].length = 0;
    }
  }

  notice(type, rect) {
    let rectTmp = {};
    let once = true;
    let tmpFunc = null;

    for (let i = 0, len = this.queue[type].length; i < len; i++) {
      rectTmp = this.queue[type][i].rect;

      if (!rectTmp) {
        tmpFunc = this.queue[type][i].func;
      } else {
        if (this.rectIn(rect, rectTmp) && !this.state.global) {
          this.queue[type][i].func(this.touch.start, this.touch.end);
          once = false;
        }
      }
    }

    if (once && tmpFunc) {
      tmpFunc(this.touch.start, this.touch.end);
    }
  }

  rectIn(small, big) {
    if (small.x > big.x && small.x + small.width < big.x + big.width && small.y > big.y && small.y + small.height < big.y + big.height) {
      return true;
    }

    return false;
  }

  getRect(dot1, dot2) {
    let rect = {};

    if (dot1.x < dot2.x) {
      rect.x = dot1.x;
      rect.width = dot2.x - dot1.x;
    } else {
      rect.x = dot2.x;
      rect.width = dot1.x - dot2.x;
    }

    if (dot1.y < dot2.y) {
      rect.y = dot1.y;
      rect.height = dot2.y - dot1.y;
    } else {
      rect.y = dot2.y;
      rect.height = dot1.y - dot2.y;
    }

    return rect;
  }

  getPosition(e) {
    if (TOUCH_EVENT_MAP[e.type]) {
      let poss = [];
      const len = e.touches.length;

      for (let i = 0; i < len; i++) {
        poss.push({
          x: e.touches[i].pageX,
          y: e.touches[i].pageY
        });
      }

      return poss;
    } else if (MOUSE_EVENT_MAP[e.type]) {
      return [{
        x: e.pageX,
        y: e.pageY
      }];
    }
  }

  getDistance(dot1, dot2) {
    return Math.sqrt(Math.pow(dot1.x - dot2.x, 2) + Math.pow(dot1.y - dot2.y, 2));
  }

  getAngle(dot1, dot2) {
    return Math.atan2(dot2.y - dot1.y, dot2.x - dot1.x) * 180 / Math.PI;
  }

  touchStart(e) {
    this.state.swiping = true;
    this.touch.start = this.getPosition(e)[0];
  }

  touchMove(e) {
    if (!this.touch.start) return;
    this.touch.end = this.getPosition(e)[0];
    this.notice('swiping', this.getRect(this.touch.end, this.touch.start));
  }

  touchEnd(e) {
    if (!this.touch.start) return;

    if (e.type === 'mouseup') {
      this.touch.end = this.getPosition(e)[0];
    }

    let angle = this.getAngle(this.touch.end, this.touch.start);

    if (angle > -45 && angle < 45) {
      this.notice('swipe-left', this.getRect(this.touch.end, this.touch.start));
    }

    if (angle < -135 || angle > 135) {
      this.notice('swipe-right', this.getRect(this.touch.end, this.touch.start));
    }

    if (angle > 45 && angle < 135) {
      this.notice('swipe-up', this.getRect(this.touch.end, this.touch.start));
    }

    if (angle < -45 && angle > -135) {
      this.notice('swipe-down', this.getRect(this.touch.end, this.touch.start));
    }

    this.notice('swiped', this.getRect(this.touch.end, this.touch.start));
    this.state.swiping = false;
    this.touch.start = null;
  }

  touchCancel(e) {
    e.preventDefault();
    console.log(e);
  }

}

/* harmony default export */ __webpack_exports__["default"] = (CovTouch);

/***/ }),

/***/ 29:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_3_oneOf_1_2_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_vue_slide_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(26);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_3_oneOf_1_2_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_vue_slide_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_3_oneOf_1_2_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_vue_slide_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_3_oneOf_1_2_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_vue_slide_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_3_oneOf_1_2_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_vue_slide_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 30:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(6);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".rd-swipe{height:400px;width:600px;margin:0 auto;position:relative;overflow:hidden;z-index:1}.rd-swipe-wrapper{position:relative;width:100%;height:100%;z-index:1;display:flex;transition-property:transform;box-sizing:content-box}.rd-swipe-item{width:100%;flex-shrink:0;height:100%;background-size:cover;background-position:50%}.rd-swipe-pagination{position:absolute;bottom:.5rem;width:100%;display:flex;justify-content:center}.rd-swipe-pagination-item{width:8px;height:8px;background:rgba(0,0,0,.5);z-index:1;margin:4px;border-radius:50%}.rd-swipe-pagination-item.active{background:rgba(0,0,0,.8)}.rd-swipe-pagination-item:hover{background:rgba(0,0,0,.3)}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 31:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(37);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(7).default
module.exports.__inject__ = function (context) {
  add("58b538f7", content, true, context)
};

/***/ }),

/***/ 33:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./components/carousel/vue-slide.vue?vue&type=template&id=a43bac3c&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"rd-swipe"},[_vm._ssrNode("<div class=\"rd-swipe-wrapper\""+(_vm._ssrStyle(null,_vm.wrapperStyle, null))+">","</div>",[_vm._t("default")],2),_vm._ssrNode(" "+((_vm.options.pagination)?("<div class=\"rd-swipe-pagination\">"+(_vm._ssrList((_vm.pagination),function(item,index){return ("<div"+(_vm._ssrClass("rd-swipe-pagination-item",{ 'active': item.active }))+"></div>")}))+"</div>"):"<!---->"))],2)}
var staticRenderFns = []


// CONCATENATED MODULE: ./components/carousel/vue-slide.vue?vue&type=template&id=a43bac3c&

// EXTERNAL MODULE: ./components/carousel/cov-touch.js
var cov_touch = __webpack_require__(27);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./components/carousel/vue-slide.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

const _ = {
  on(el, type, handler) {
    el.addEventListener(type, handler, false);
  },

  off(el, type, handler) {
    el.addEventListener(type, handler, false);
  }

};
/* harmony default export */ var vue_slidevue_type_script_lang_js_ = ({
  props: {
    swipe: {
      type: Object,

      default() {
        return {};
      }

    }
  },

  data() {
    return {
      $wrapper: null,
      $touch: null,
      timer: null,
      pagination: [],
      swiper: {
        swiping: false,
        rect: {
          width: 0,
          height: 0
        },
        count: 0,
        index: 0,
        options: {}
      },
      position: {
        x: 0,
        y: 0,
        z: 0
      },
      options: {
        activeIndex: 0,
        autoplay: 1000,
        pagination: true
      }
    };
  },

  computed: {
    wrapperStyle() {
      if (this.swiper.swiping) {
        return {
          transform: `translate3d(-${this.position.x}px, ${this.position.y}px, ${this.position.z}px)`,
          '-webkit-transform': `translate3d(-${this.position.x}px, ${this.position.y}px, ${this.position.z}px)`
        };
      } else {
        return {
          transform: `translate3d(-${this.position.x}px, ${this.position.y}px, ${this.position.z}px)`,
          '-webkit-transform': `translate3d(-${this.position.x}px, ${this.position.y}px, ${this.position.z}px)`,
          transition: 'all .3s',
          '-webkit-transition': 'all .3s'
        };
      }
    }

  },

  mounted() {
    _.on(window, 'resize', this.init);

    _.on(this.$el, 'resize', this.init);

    this.init();
  },

  beforeDestroy() {
    if (this.$touch) {
      this.$touch.destroy();
    }
  },

  methods: {
    init() {
      this.options = Object.assign(this.options, this.swipe);
      this.$wrapper = this.$el.getElementsByClassName('rd-swipe-wrapper')[0];
      this.swiper.count = this.$el.getElementsByClassName('rd-swipe-item').length;
      this.swiper.rect = this.$el.getBoundingClientRect();

      if (this.options.pagination) {
        this.pagination = Array.from({
          length: this.swiper.count
        }).map((item, index) => {
          return {
            index: index,
            active: index === 0
          };
        });
      }

      this.initSwipe();

      if (this.swipe.autoplay) {
        this.startAutoPlay(this.swipe.autoplay);
      }
    },

    initSwipe() {
      if (this.$touch) {
        this.$touch.destroy();
      }

      this.$touch = new cov_touch["default"]({
        el: this.$el
      });
      this.$touch.listen('swipe-left', null, () => {
        this.swiper.swiping = false;
        this.next();
      });
      this.$touch.listen('swipe-right', null, () => {
        this.swiper.swiping = false;
        this.pre();
      });
      let movediff = 0;
      this.$touch.listen('swiping', null, (start, end) => {
        this.swiper.swiping = true;
        let move = start.x - end.x;
        this.position.x += move - movediff;
        movediff = move;
      });
      this.$touch.listen('swiped', null, (start, end) => {
        movediff = 0;
        this.swiper.swiping = false;
      });
    },

    startAutoPlay(delay) {
      this.stopAutoPlay();
      this.timer = setInterval(this.play, delay || this.options.autoplay);
    },

    stopAutoPlay() {
      if (this.timer) {
        window.clearInterval(this.timer);
        window.clearTimeout(this.timer);
        this.timer = null;
      }
    },

    play() {
      if (this.swiper.index === this.swiper.count - 1) {
        this.swiper.index = -1;
      }

      if (this.swiper.swiping) return;
      this.next();
    },

    next() {
      if (this.swiper.index < this.swiper.count - 1) {
        this.swiper.index++;
      }

      this.position.x = this.swiper.rect.width * this.swiper.index;
      this.checkOut();
    },

    pre() {
      if (this.swiper.index > 0) {
        this.swiper.index--;
      }

      this.position.x = this.swiper.rect.width * this.swiper.index;
      this.checkOut();
    },

    turnTo(index) {
      index = Math.floor(index);
      if (index < -1 || index > this.swiper.count) return console.error('invaild index: ', index);
      this.stopAutoPlay();
      this.swiper.index = index;
      this.position.x = this.swiper.rect.width * index;
      this.checkOut();
      this.timer = setTimeout(() => {
        this.startAutoPlay();
      }, this.swipe.autoplay * 2);
    },

    setPaginationActive(index) {// this.pagination.forEach(item => item.active = false)
      // this.pagination[index].active = true
    },

    checkOut() {
      this.swipe.activeIndex = this.swiper.index;

      if (this.options.pagination) {
        this.setPaginationActive(this.swiper.index);
      }

      if (this.position.x > this.swiper.rect.width * this.swiper.count) {
        this.position.x = this.swiper.rect.width * this.swiper.count;
      }

      if (this.position.x < 0) {
        this.position.x = 0;
      }
    }

  }
});
// CONCATENATED MODULE: ./components/carousel/vue-slide.vue?vue&type=script&lang=js&
 /* harmony default export */ var carousel_vue_slidevue_type_script_lang_js_ = (vue_slidevue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(3);

// CONCATENATED MODULE: ./components/carousel/vue-slide.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(29)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  carousel_vue_slidevue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  injectStyles,
  null,
  "b2be7074"
  
)

/* harmony default export */ var vue_slide = __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ 36:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_6_oneOf_1_3_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Carousel_vue_vue_type_style_index_0_lang_sass___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(31);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_6_oneOf_1_3_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Carousel_vue_vue_type_style_index_0_lang_sass___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_6_oneOf_1_3_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Carousel_vue_vue_type_style_index_0_lang_sass___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_6_oneOf_1_3_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Carousel_vue_vue_type_style_index_0_lang_sass___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_6_oneOf_1_3_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Carousel_vue_vue_type_style_index_0_lang_sass___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 37:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(6);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".rd-swipe{width:100%!important;height:140px!important}.rd-swipe-item{background-size:100% 100%!important}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 40:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./components/carousel/Carousel.vue?vue&type=template&id=a0d7a11c&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{attrs:{"id":"app"}},[_vm._ssrNode("<div class=\"swiper-box\">","</div>",[_c('rd-swipe',{attrs:{"swipe":_vm.swipe}},_vm._l((_vm.imgs),function(img,index){return _c('div',{key:index,staticClass:"rd-swipe-item",style:({ 'background-image': ("url(" + img + ")") })})}),0)],1)])}
var staticRenderFns = []


// CONCATENATED MODULE: ./components/carousel/Carousel.vue?vue&type=template&id=a0d7a11c&

// EXTERNAL MODULE: ./components/carousel/vue-slide.vue + 4 modules
var vue_slide = __webpack_require__(33);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./components/carousel/Carousel.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var Carouselvue_type_script_lang_js_ = ({
  data() {
    return {
      swipe: {
        activeIndex: 0
      },
      imgs: ['img/banner_test.jpg', 'img/round01.jpg', 'img/round01.jpg', 'img/round01.jpg']
    };
  },

  options: {
    activeIndex: 0,
    autoplay: 1000,
    pagination: true
  },
  components: {
    rdSwipe: vue_slide["default"]
  },
  methods: {
    turnTo(index) {
      this.$children.map(swipe => {
        if (swipe.turnTo) {
          swipe.turnTo(index);
        }
      });
    }

  }
});
// CONCATENATED MODULE: ./components/carousel/Carousel.vue?vue&type=script&lang=js&
 /* harmony default export */ var carousel_Carouselvue_type_script_lang_js_ = (Carouselvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(3);

// CONCATENATED MODULE: ./components/carousel/Carousel.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(36)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  carousel_Carouselvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  injectStyles,
  null,
  "4dcdc7d8"
  
)

/* harmony default export */ var Carousel = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=carousel.js.map