exports.ids = [8,1,2,3,4];
exports.modules = Array(22).concat([
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(26);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(5).default
module.exports.__inject__ = function (context) {
  add("0fd6aa2e", content, true, context)
};

/***/ }),
/* 23 */
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
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(30);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(5).default
module.exports.__inject__ = function (context) {
  add("1a92e910", content, true, context)
};

/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_3_oneOf_1_2_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_vue_slide_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(22);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_3_oneOf_1_2_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_vue_slide_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_3_oneOf_1_2_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_vue_slide_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_3_oneOf_1_2_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_vue_slide_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_3_oneOf_1_2_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_vue_slide_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(4);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".rd-swipe{height:400px;width:600px;margin:0 auto;position:relative;overflow:hidden;z-index:1}.rd-swipe-wrapper{position:relative;width:100%;height:100%;z-index:1;display:flex;transition-property:transform;box-sizing:content-box}.rd-swipe-item{width:100%;flex-shrink:0;height:100%;background-size:cover;background-position:50%}.rd-swipe-pagination{position:absolute;bottom:.5rem;width:100%;display:flex;justify-content:center}.rd-swipe-pagination-item{width:8px;height:8px;background:rgba(0,0,0,.5);z-index:1;margin:4px;border-radius:50%}.rd-swipe-pagination-item.active{background:rgba(0,0,0,.8)}.rd-swipe-pagination-item:hover{background:rgba(0,0,0,.3)}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(32);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(5).default
module.exports.__inject__ = function (context) {
  add("58b538f7", content, true, context)
};

/***/ }),
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./components/carousel/vue-slide.vue?vue&type=template&id=a43bac3c&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"rd-swipe"},[_vm._ssrNode("<div class=\"rd-swipe-wrapper\""+(_vm._ssrStyle(null,_vm.wrapperStyle, null))+">","</div>",[_vm._t("default")],2),_vm._ssrNode(" "+((_vm.options.pagination)?("<div class=\"rd-swipe-pagination\">"+(_vm._ssrList((_vm.pagination),function(item,index){return ("<div"+(_vm._ssrClass("rd-swipe-pagination-item",{ 'active': item.active }))+"></div>")}))+"</div>"):"<!---->"))],2)}
var staticRenderFns = []


// CONCATENATED MODULE: ./components/carousel/vue-slide.vue?vue&type=template&id=a43bac3c&

// EXTERNAL MODULE: ./components/carousel/cov-touch.js
var cov_touch = __webpack_require__(23);

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
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./components/carousel/vue-slide.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(25)
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
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_6_oneOf_1_3_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Myheader_vue_vue_type_style_index_0_lang_sass___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(24);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_6_oneOf_1_3_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Myheader_vue_vue_type_style_index_0_lang_sass___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_6_oneOf_1_3_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Myheader_vue_vue_type_style_index_0_lang_sass___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_6_oneOf_1_3_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Myheader_vue_vue_type_style_index_0_lang_sass___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_6_oneOf_1_3_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Myheader_vue_vue_type_style_index_0_lang_sass___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(4);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "header{padding-top:5px}header .city_change{font-size:15px;color:#fff;background:url(/img/city_change.png) no-repeat 51px 12px;background-size:12px 7px;float:left;padding:6px 25px 0 15px;margin-top:2px}header .city_change.new{background-position:right 14px;padding-right:15px}header .input_box{margin:5px 70px 0 88px}header .input_box.word_2{margin-left:72px;margin-right:47px}header .input_box.word_3{margin-left:87px;margin-right:47px}header .input_box.word_4{margin-left:98px;margin-right:60px}header .index_sear_inp{width:100%;height:25px;font-size:12px;line-height:25px;color:#fff;border-radius:70px;background:url(/img/index_header_sear.png) no-repeat 7px #a20407;background-size:14px 14px;-moz-placeholder-color:#fff;-ms-input-placeholder-color:#fff;padding:5px 0 5px 26px}header .index_sear_inp::-webkit-input-placeholder{color:#fff}header .index_sear_inp ::-moz-placeholder{color:#fff}header .hed_login{width:32px;height:33px;line-height:33px;text-align:right;font-size:15px;color:#fff;float:right;margin:2px 13px 0 0}header .hed_login.login{background:url(/img/index_has_login.png) no-repeat 14px;background-size:12px 15px}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_6_oneOf_1_3_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Carousel_vue_vue_type_style_index_0_lang_sass___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(27);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_6_oneOf_1_3_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Carousel_vue_vue_type_style_index_0_lang_sass___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_6_oneOf_1_3_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Carousel_vue_vue_type_style_index_0_lang_sass___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_6_oneOf_1_3_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Carousel_vue_vue_type_style_index_0_lang_sass___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_6_oneOf_1_3_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Carousel_vue_vue_type_style_index_0_lang_sass___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(4);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".rd-swipe{width:100%!important;height:140px!important}.rd-swipe-item{background-size:100% 100%!important}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),
/* 33 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./components/carousel/Carousel.vue?vue&type=template&id=a0d7a11c&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{attrs:{"id":"app"}},[_vm._ssrNode("<div class=\"swiper-box\">","</div>",[_c('rd-swipe',{attrs:{"swipe":_vm.swipe}},_vm._l((_vm.imgs),function(img,index){return _c('div',{key:index,staticClass:"rd-swipe-item",style:({ 'background-image': ("url(" + img + ")") })})}),0)],1)])}
var staticRenderFns = []


// CONCATENATED MODULE: ./components/carousel/Carousel.vue?vue&type=template&id=a0d7a11c&

// EXTERNAL MODULE: ./components/carousel/vue-slide.vue + 4 modules
var vue_slide = __webpack_require__(28);

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
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./components/carousel/Carousel.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(31)
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

/***/ }),
/* 34 */,
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(41);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(5).default
module.exports.__inject__ = function (context) {
  add("183cce12", content, true, context)
};

/***/ }),
/* 36 */,
/* 37 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./components/home/Myheader.vue?vue&type=template&id=5f30a5d3&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('header',{staticClass:"all_nav_zone",attrs:{"id":"header"}},[_c('nuxt-link',{staticClass:"city_change new",attrs:{"to":"/About/index"}},[_vm._v("北京")]),_vm._ssrNode(" "),_c('nuxt-link',{directives:[{name:"show",rawName:"v-show",value:(this.islogin),expression:"this.islogin"}],staticClass:"hed_login hed_fz",attrs:{"to":"/login"}},[_vm._v("登录")]),_vm._ssrNode(" <div class=\"input_box word_2\"><input type=\"text\" placeholder=\"搜索：课程、机构\" class=\"index_sear_inp\"></div>")],2)}
var staticRenderFns = []


// CONCATENATED MODULE: ./components/home/Myheader.vue?vue&type=template&id=5f30a5d3&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./components/home/Myheader.vue?vue&type=script&lang=js&
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
//import {getStore} from '../../config/common.js'
/* harmony default export */ var Myheadervue_type_script_lang_js_ = ({
  data() {
    return {
      islogin: true
    };
  },

  methods: {
    search() {//this.$router.push({path: '/search/searchPage'})
    }

  },

  mounted() {// if (getStore('user')) {
    //   this.islogin = false
    // }
  }

});
// CONCATENATED MODULE: ./components/home/Myheader.vue?vue&type=script&lang=js&
 /* harmony default export */ var home_Myheadervue_type_script_lang_js_ = (Myheadervue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./components/home/Myheader.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(29)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  home_Myheadervue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  injectStyles,
  null,
  "7b09f84e"
  
)

/* harmony default export */ var Myheader = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 38 */,
/* 39 */,
/* 40 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_6_oneOf_1_3_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_011a6d84_lang_sass_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(35);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_6_oneOf_1_3_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_011a6d84_lang_sass_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_6_oneOf_1_3_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_011a6d84_lang_sass_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_6_oneOf_1_3_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_011a6d84_lang_sass_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_6_oneOf_1_3_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_011a6d84_lang_sass_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(4);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".body[data-v-011a6d84]{background:#eee;padding-top:44px;padding-bottom:70px}html[data-v-011a6d84]{width:100%;height:100%;font-size:62.5%;color:#474747}body[data-v-011a6d84]{font-family:\"Microsoft YaHei\",\"Hiragino Sans GB\",\"Arail\";padding-top:44px;padding-bottom:6rem;-webkit-box-sizing:border-box;margin:0}body.gray[data-v-011a6d84]{background:#eee}button[data-v-011a6d84],input[data-v-011a6d84],textarea[data-v-011a6d84]{border:none;-webkit-outline:none;outline:none;-webkit-tap-highlight-color:rgba(0,0,0,0);-webkit-appearance:none;border-radius:0;padding:0}.fl[data-v-011a6d84]{float:left}.fr[data-v-011a6d84]{float:right}a[data-v-011a6d84]{color:#474747}a[data-v-011a6d84],a.active[data-v-011a6d84],a[data-v-011a6d84]:focus,a[data-v-011a6d84]:hover{text-decoration:none}h1[data-v-011a6d84],h2[data-v-011a6d84],h3[data-v-011a6d84],h4[data-v-011a6d84],h5[data-v-011a6d84],h6[data-v-011a6d84],p[data-v-011a6d84],ul[data-v-011a6d84]{padding:0;margin:0}li[data-v-011a6d84]{list-style:none}em[data-v-011a6d84],i[data-v-011a6d84]{font-style:normal}img[data-v-011a6d84]{vertical-align:middle}.index-enter-active[data-v-011a6d84],.index-leave-active[data-v-011a6d84]{transition:opacity .2s}.index-enter[data-v-011a6d84],.index-leave-active[data-v-011a6d84]{opacity:0}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),
/* 42 */,
/* 43 */,
/* 44 */,
/* 45 */,
/* 46 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/index.vue?vue&type=template&id=011a6d84&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('transition',{attrs:{"name":"index"}},[_c('div',{staticClass:"body"},[_c('Myheader'),_vm._v(" "),_c('Carousel')],1)])}
var staticRenderFns = []


// CONCATENATED MODULE: ./pages/index.vue?vue&type=template&id=011a6d84&scoped=true&

// EXTERNAL MODULE: ./components/home/Myheader.vue + 4 modules
var Myheader = __webpack_require__(37);

// EXTERNAL MODULE: ./components/carousel/Carousel.vue + 4 modules
var Carousel = __webpack_require__(33);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/index.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//


/* harmony default export */ var lib_vue_loader_options_pagesvue_type_script_lang_js_ = ({
  layout: 'mystyle',

  //   // ajax module as axios
  // async asyncData () {
  //   // let { data } = await axios.get('http://127.0.0.1:3005/api/')
  //   return {
  //     allparentinfo: {"allparentinfo":[{"headinfo":{"before":"更多课程","after":"中小学","imgurl":"img/icon_middle.png"},"course":{"classList":[{"classname":"精品钢琴课","imgurl":"img/cls_mid1.jpg"},{"classname":"精品数学课","imgurl":"img/cls_mid2.jpg"}],"classMoreList":[{"classname":"高中语文","imgurl":"img/cls_icon_chaness.png"},{"classname":"小学英语","imgurl":"img/cls_icon_english.png"},{"classname":"初中物理","imgurl":"img/cls_icon_wuli.png"},{"classname":"高中数学","imgurl":"img/cls_icon_math.png"}]}},{"headinfo":{"before":"更多课程","after":"艺术/体育","imgurl":"img/icon_art.png"},"course":{"classList":[{"classname":"精品语文课","imgurl":"img/cls_mid3.jpg"},{"classname":"精品生物课","imgurl":"img/cls_mid4.jpg"}],"classMoreList":[{"classname":"钢琴","imgurl":"img/cls_icon_gangqin.png"},{"classname":"古筝","imgurl":"img/cls_icon_guzheng.png"},{"classname":"吉他","imgurl":"img/cls_icon_jita.png"},{"classname":"小提琴","imgurl":"img/cls_icon_tiqin.png"}]}},{"headinfo":{"before":"更多课程","after":"语言/留学","imgurl":"img/icon_liuxue.png"},"course":{"classList":[{"classname":"精品体育课","imgurl":"img/cls_mid5.jpg"},{"classname":"精品麻将课","imgurl":"img/cls_mid6.jpg"}],"classMoreList":[{"classname":"葡萄牙语","imgurl":"img/cls_icon_putao.png"},{"classname":"外教口语","imgurl":"img/cls_icon_waijiao.png"},{"classname":"新概念英语","imgurl":"img/cls_icon_xingainian.png"},{"classname":"剑桥英语","imgurl":"img/cls_icon_jianqiao.png"}]}},{"headinfo":{"before":"更多课程","after":"拓展训练","imgurl":"img/icon_tuozhan.png"},"course":{"classList":[{"classname":"精品出游课","imgurl":"img/cls_mid7.jpg"},{"classname":"精品玩耍课","imgurl":"img/cls_mid8.jpg"}],"classMoreList":[{"classname":"冬夏令营","imgurl":"img/cls_icon_dongxia.png"},{"classname":"亲子出游","imgurl":"img/cls_icon_qinzi.png"},{"classname":"儿童乐园","imgurl":"img/cls_icon_ertong.png"},{"classname":"拓展培训","imgurl":"img/cls_icon_tuozhanpei.png"}]}}],"indexClass":[{"showClassImg":"img/class_art_icon.png","showClassName":"艺术","classPid":"15963587"},{"showClassImg":"img/class_tiyu_icon.png","showClassName":"体育","classPid":"15963588"},{"showClassImg":"img/class_yuyan_icon.png","showClassName":"语言","classPid":"15963589"},{"showClassImg":"img/class_liuxue_icon.png","showClassName":"留学","classPid":"15963590"},{"showClassImg":"img/class_xiao_icon.png","showClassName":"小学","classPid":"15963591"},{"showClassImg":"img/class_sheng_icon.png","showClassName":"小升初","classPid":"15963592"},{"showClassImg":"img/class_chuzhong_icon.png","showClassName":"初中","classPid":"15963593"},{"showClassImg":"img/class_zhongkao_icon.png","showClassName":"中考","classPid":"15963594"},{"showClassImg":"img/class_gao_icon.png","showClassName":"高中","classPid":"15963595"},{"showClassImg":"img/class_sheng_icon.png","showClassName":"更多","classPid":"all"}]}
  //   }
  // },
  // computed: {
  //   ...mapState([
  //     'coursetype'
  //   ])
  // },
  // mounted () {
  //   this.COURSE_TYPE('1')
  // },
  // methods: {
  //   ...mapMutations([
  //     'COURSE_TYPE'
  //   ])
  // },
  head() {
    return {
      title: 'bnhcp'
    };
  },

  components: {
    Myheader: Myheader["default"],
    Carousel: Carousel["default"] // Classification,
    // RecommendedSchools,
    // Grabactivity,
    // Courseblock,
    // Footertabs,
    // axios

  }
});
// CONCATENATED MODULE: ./pages/index.vue?vue&type=script&lang=js&
 /* harmony default export */ var pagesvue_type_script_lang_js_ = (lib_vue_loader_options_pagesvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./pages/index.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(40)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  pagesvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "011a6d84",
  "ece85768"
  
)

/* harmony default export */ var pages = __webpack_exports__["default"] = (component.exports);

/* nuxt-component-imports */
installComponents(component, {Carousel: __webpack_require__(33).default})


/***/ })
]);;
//# sourceMappingURL=index.js.map