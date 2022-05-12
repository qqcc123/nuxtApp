<template>
  <div>
    <div class="container full">
      <div class="order_sort">
        <ul class="order_sort_u clearfix">
          <li class="tabslist">
            <a
              :class="{ on: searchBy == 'location' }"
              href="javascript:"
              @click="activeSort('location')"
              class="tab_swi_a"
            ></a>
            <transition name="showlist">
              <div
                class="search_tab"
                id="citylocation"
                v-show="searchBy == 'location'"
              >
                <div class="left_area">
                  <p
                    v-for="(value, index) in cityArr"
                    :key="index"
                    :class="{ activityCity: changeActivated == index }"
                    @click="chooseActive(index, '', 'location')"
                  >
                    {{ value }}
                  </p>
                </div>
                <div class="right_area">
                  <div class="right_area_d">
                    <div class="rigth_third">
                      <a
                        href="javascript:;"
                        class="switch_a area_r mar_l third_menu"
                        >全部</a
                      >
                    </div>
                    <div class="right_third">
                      <a
                        href="javascript:;"
                        class="switch_a area_r mar_l third_menu on"
                        >双榆树</a
                      >
                      <div class="third_menu_con current">
                        <ul>
                          <li><a href="javascript:;">雅思</a></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </transition>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "~/plugins/axios";
import { mapState, mapMutations } from "vuex";
import { syncClass, filter, courselist, getleckCourse } from "../ajax/getData";

export default {
  async asyncData() {},

  data() {
    return {
      // 位置左侧是选中的id
      changeActivated: 0,
      // 城市数组
      cityArr: "",
      // 一级选中名字
      gradeOneName: "艺术",
      // 分类数组
      classGrade: "",
      // 筛选的请求来的展示数据
      screen: "",
      // 展示下拉的控制变量
      searchBy: null,
      // 筛选
      filter: "筛选",
      // 选中筛选的数组 保存状态
      selectScreen: [],
      // 当前选中的分类课程
      currentId: "15963587",
    };
  },

  async activeSort(type) {
    if (type == "filter" && this.screen.length === 0) {
      // 调用渲染数据
      this.filterdata();
    }

    if (this.searchBy !== type) {
      this.searchBy = type;
    } else {
      this.searchBy = null;
    }
  },

  async filterData() {
    this.screen = await filter() 

    this.screen.forEach((item, index) => {
      let listObj = { classList: [] };
      item.classList.forEach((item, index) => {
        listObj.classList.push({ status: false, id: item.id });
      });
      this.selectScreen.push(listObj);
    });
  },

  async chooseActive(index, id, name) {
    this.changeActivated = index;
    this.classGrade = await syncClass(id) 
    this.currentId = id;
    this.gradeOneName = name;
  },
};
</script>

<style lang="sass" scoped>
@import "~static/common/style.sass"

.order_sort
  width: 100%
  height: 46px
  line-height: 44px
  border-bottom: 1px solid #d9d9d9
  background: #fff
  margin: 0 0 10px 0
  position: fixed
  z-index: 1100
  .order_sort_u
    width: 100%
    position: relative
    .tabslist
      width: 25%
      float: left
      background: url("/img/smart_line.png") no-repeat right 12px
      background-size: 1px 20px
      &.last
        background-image: none
        position: relative
</style>
