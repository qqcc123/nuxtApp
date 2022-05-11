<template>
  <div>
    <div class="container full"></div>
    <div class="order_sort">
      <ul class="order_sort_u clearfix">
        <li class="tabslist"></li>
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
          </div>
        </transition>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  async asyncData() {},

  data() {
    return {
      // 位置左侧是选中的id
      changeActivated: 0,
      // 城市数组
      cityArr: '',
      // 一级选中名字
      gradeOneName: '艺术',
      // 分类数组
      classGrade: '',
      // 筛选的请求来的展示数据
      screen: "",
      // 展示下拉的控制变量
      searchBy: null,
      // 筛选
      filter: "筛选",
      // 选中筛选的数组 保存状态
      selectScreen: [],
      // 当前选中的分类课程
      currentId: '15963587',
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
    //this.screen = await filter() 暂未添加该模块

    this.screen.forEach((item, index) => {
      let listObj = { classList: [] };
      item.classList.forEach((item, index) => {
        listObj.classList.push({ status: false, id: item.id });
      });
      this.selectScreen.push(listObj);
    });
  },

  async chooseActive(index, id, name) {
    this.changeActivated = index
    //this.classGrade = await syncClass(id) 暂未添加该模块
    this.currentId = id
    this.gradeOneName = name
  }
};
</script>
