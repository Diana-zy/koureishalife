<template>
  <CustomLink class="news-style-2" :to="`/detail/${item.path_v2}/`">
    <NuxtImg
      format="auto"
      fit="cover"
      width="658"
      height="440"
      :src="item?.cover || ''"
      :alt="item?.name"
      loading="lazy"
      class="img"
    />
    <p
      class="category"
      :style="{ background: colorList[index] }"
      v-if="item.seo_category_name || item.category_locale_name || item.category_name"
      >{{ capitalizeFirstLetter(item.seo_category_name || item.category_locale_name || item.category_name) }}</p
    >
    <p class="title">{{ item?.name }}</p>
    <div class="m-news-author pc-hidden-flex">
      <div>{{ item.author?.name }}</div>
      <div>{{ item.updated_at }}</div>
    </div>
  </CustomLink>
</template>

<script>
import { capitalizeFirstLetter } from "~/utils/utils";
export default {
  props: {
    item: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      colorList: ["#C6F3E2", "#C9CDF2", "#C0E8B2", "#D2F0FD", "#FDD8DE"]
    };
  },mounted() {
  },
  methods: {
    capitalizeFirstLetter
  }
};
</script>

<style lang="scss" scoped>
.news-style-2 {
  padding-right: 16px;
  .img {
    width: 100%;
    height: auto;
    object-fit: cover;
    border-radius: 8px 8px 8px 8px;
  }
  .category {
    display: inline-block;
    padding: 4px 8px;
    line-height: 18px;
    font-size: 13px;
    font-family: "hem";
    color: #000;
    background: $tagColor2;
    border-radius: 4px 4px 4px 4px;
    margin: 16px 0 0;
  }
  .title {
    margin-top: 10px;
    font-size: 16px;
    font-family: "se3";
    line-height: 22px;
    @include ellipsis(3);
    transition: color 0.2s;
  }
  &:hover {
    .title {
      color: $color1;
      text-decoration: underline;
    }
  }
}
@media screen and (max-width: 1100px) {
  .news-style-2 {
    width: 100%;
  }
}
@media screen and (max-width: 750px) {
  .news-style-2 {
    padding-right: 0;
    /*border-bottom: vw(2) solid #ececee;*/
    width: 100%;
    // position: relative;
    // &::after {
    //   content: "";
    //   position: absolute;
    //   right: left;
    //   bottom: 0;
    //   width: calc(100% - vw(236));
    //   height: vw(2);
    //   background: #ececee;
    // }
    .img {
      width: 100%;
      height: auto;
      object-fit: cover;
      border-radius: vw(16);
      margin-right: 0;
    }
    .category {
      /*display: none;*/
      font-size: vw(24);
      line-height: vw(44);
      padding: vw(8) vw(16);
      border-radius: 0;
      margin: vw(20) 0 0;
    }
    .title {
      margin-top: vw(16);
      /*margin: vw(16) 0;*/
      font-size: vw(26);
      line-height: vw(36);
      min-height: vw(106);
    }
    .m-news-author {
      display: flex;
      justify-content: space-between;
      margin-top: vw(8);
      font-size: vw(16);
      padding-bottom: vw(10);
      @include author-icon(vw(16), vw(16));
      div:first-child {
        max-width: vw(156);
        @include ellipsis();
      }
      div:last-child {
        max-width: vw(120);
        font-size: vw(16);
        @include ellipsis();
      }
    }
  }
}
</style>
