<!--右侧边栏-->
<template>
  <div class="right-sider">
    <div class="category-box">
      <div class="right-title"> カテゴリー</div>
      <div class="category-content">
        <custom-link
          v-for="(item, i) in navData.list"
          :key="i"
          :to="`/category/${item.path}/`"
          class="category-item"
          >{{ capitalizeFirstLetter(item.locale_name.ja) }}</custom-link
        >
      </div>
    </div>
    <div class="new-box">
      <div class="right-title"> 新着記事 </div>
      <div class="new-content">
        <item-mode-new v-for="(item, i) in recNews" :key="i" :item="item"></item-mode-new>
      </div>
    </div>
    <div class="rec-box">
      <div class="right-title"> イチオシ記事</div>
      <div class="rec-content">
        <item-mode-new v-for="(item, i) in trendingNews" :key="i" :item="item"></item-mode-new
      ></div>
    </div>
  </div>
</template>

<script>
import { simulateAFSSearch, capitalizeFirstLetter } from "~/utils/utils";
import CustomLink from "./CustomLink";
export default {
  name: "RightSideBox",
  components: { CustomLink },
  props: {
    recNews: {
      type: Array
    },
    trendingNews: {
      type: Array
    }
  },
  data() {
    return {
      navData: this.$root.$options.navData || this.$navData
    };
  },
  mounted() {
    console.log(this.navData);
  },
  methods: {
    capitalizeFirstLetter
  }
};
</script>

<style scoped lang="scss">
.right-sider {
  .right-title {
    background: $color1;
    line-height: 1;
    margin-bottom: 20px;
    font-weight: normal;
    display: block;
    color: #ffffff;
    padding: 1em;
  }
  .category-box {
    width: 100%;
    margin-bottom: 20px;
    .category-content {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      .category-item {
        border: 1px solid $font1;
        padding: 0.4em 0.8em;
        border-radius: 20px;
      }
    }
  }
  .new-box {
    width: 100%;
    margin-bottom: 20px;
    .new-content {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
  }
  .rec-box {
    width: 100%;
    .rec-content {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
  }
}
</style>
