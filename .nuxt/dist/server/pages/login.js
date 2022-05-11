exports.ids = [11];
exports.modules = {

/***/ 42:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(50);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(7).default
module.exports.__inject__ = function (context) {
  add("37d52f28", content, true, context)
};

/***/ }),

/***/ 49:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_6_oneOf_1_3_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_login_vue_vue_type_style_index_0_lang_sass___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(42);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_6_oneOf_1_3_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_login_vue_vue_type_style_index_0_lang_sass___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_6_oneOf_1_3_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_login_vue_vue_type_style_index_0_lang_sass___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_6_oneOf_1_3_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_login_vue_vue_type_style_index_0_lang_sass___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_6_oneOf_1_3_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_login_vue_vue_type_style_index_0_lang_sass___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 50:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(6);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".container_login{padding-top:3rem;width:100%;height:100%;background-size:100%}.container_login .login{width:100%;height:10.7rem;background:url(/img/logo_login.png) no-repeat 50%;background-size:5.8rem 10.7rem}.container_login .login_form{padding:0 1.3rem;margin-top:2rem}.container_login .login_form input{width:100%;height:4.5rem;border-radius:5rem}.container_login .login_form .phone.verification{position:relative}.container_login .login_form .phone.verification input{background:rgba(62,35,74,.1) url(/img/icon_login_valid.png) no-repeat 1.7rem;background-size:1.7rem 2.1rem}.container_login .login_form .phone.verification .clickImg{width:100px;height:100%;position:absolute;top:.3rem;right:1rem}.container_login .login_form .phone.verification b{width:68px;display:block;height:23px;background:#999;margin:0 1.5rem 0 auto}.container_login .login_form .phone.verification i{width:100%;color:#fff;display:inline-block;font-size:1rem;text-align:center;margin-top:.3rem}.container_login .login_form .phone{margin-bottom:1rem;position:relative}.container_login .login_form .phone input{background:rgba(62,35,74,.3) url(/img/icon_login_phone.png) no-repeat 1.9rem;background-size:1.3rem 2.3rem}.container_login .login_form .phone span{position:absolute;top:50%;right:1.5rem;width:1.4rem;height:1.4rem;background:#fff;color:#7e6382;line-height:1.5rem;text-align:center;border-radius:50%;transform:translateY(-50%)}.container_login .login_form .phone input{background:rgba(62,35,74,.3) url(/img/icon_login_num.png) no-repeat 1.9rem;background-size:1.8rem 2.3rem;padding-left:4.5rem;color:#fff}.container_login .login_form .phone input::-webkit-input-placeholder{color:#fff}.container_login .login_form .phone input::-ms-input-placeholder{color:#fff}.container_login .login_form .phone input::-o-input-placeholder{color:#fff}.container_login .login_form .phone input::input-placeholder{color:#fff}.container_login .login_form .phone input span{position:absolute;top:50%;right:1.5rem;width:10rem;text-align:center;display:inline-block;padding-left:1.5rem;border-left:1px solid #fff;height:3rem;color:#fff;line-height:3rem;font-size:1.5rem;transform:translateY(-50%)}.container_login .login_form .login_btn{margin-top:1.7rem}.container_login .login_form .login_btn input{background:#9a4a62;color:#fff;font-size:1.8rem}.container_login .login_form .login_btn input.on{background:#ef4040}.container_login .login_form .logup{height:3rem;float:right;margin-right:1.6rem;font-size:1.4rem}.container_login .login_form .logup a{line-height:3rem;color:#afaaaf}.container_login .login_form .user_trans{margin-top:1.5rem;color:#ccc;line-height:1.5rem}.container_login .login_form .user_trans b{font-weight:400;color:#ccc}.container_login .login_form .user_trans a{color:#f99630;-webkit-tap-highlight-color:transparent}.login-page{width:100%;height:100%;padding:0;background:url(/img/login_bg.jpg) no-repeat 0 0;background-size:100% 100%;background-attachment:fixed}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 57:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/login.vue?vue&type=template&id=573c2f21&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"container_login"},[_vm._ssrNode("<h3 class=\"login\"></h3> <div class=\"login_form\"><p class=\"phone\"><input type=\"text\" placeholder=\"输入手机号\""+(_vm._ssrAttr("value",(_vm.phone)))+"><span>×</span></p> <p class=\"phone verification\"><input type=\"password\" placeholder=\"首次登录为注册\""+(_vm._ssrAttr("value",(_vm.password)))+"></p> <p class=\"login_btn\"><input type=\"button\" value=\"登录\"></p> <p class=\"user_trans\">未注册用户登录将自动创建报哪好账号，<b>即视为您已同意</b><a href>《报哪好用户服务协议》</a></p></div>")])}
var staticRenderFns = []


// CONCATENATED MODULE: ./pages/login.vue?vue&type=template&id=573c2f21&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/login.vue?vue&type=script&lang=js&
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
// import { setStore } from '../config/common'
// import { userLongin } from '../ajax/getData'
// import layerMsg from '~/components/layer/layerMsg.vue'
/* harmony default export */ var loginvue_type_script_lang_js_ = ({
  data() {
    return {//   phone: '',
      //   password: '',
      //   layerMSg: '手机号格式不对',
      //   isLayer: false
    };
  },

  head: {
    bodyAttrs: {
      class: 'login-page'
    }
  },
  methods: {
    async longin() {//   if (/^1[345789]\d{9}$/.test(this.phone)) {
      //     if (!this.password) {
      //       this.layerMSg = '密码不能为空' // 更换提示语
      //       this.isLayer = true // 提示
      //       return
      //     }
      //     let data = await userLongin(this.phone, this.password)
      //     if (data.status) {
      //       alert(234)
      //       //setStore('user', this.phone) // 存储用户手机号
      //       this.$router.push({ path: '/' }) // 跳转
      //     } else {
      //       this.layerMSg = data.msg // 更换提示语
      //       this.isLayer = true // 提示
      //       setTimeout(() => { // 两秒恢复为true
      //         this.isLayer = false
      //       }, 2000)
      //     }
      //   } else {
      //     this.isLayer = true
      //     setTimeout(() => { // 两秒恢复为true
      //       this.isLayer = false
      //     }, 2000)
      //   }
    },

    clear() {
      this.phone = '';
    }

  },
  components: {// layerMsg
  }
});
// CONCATENATED MODULE: ./pages/login.vue?vue&type=script&lang=js&
 /* harmony default export */ var pages_loginvue_type_script_lang_js_ = (loginvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(3);

// CONCATENATED MODULE: ./pages/login.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(49)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  pages_loginvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  injectStyles,
  null,
  "53337763"
  
)

/* harmony default export */ var login = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=login.js.map