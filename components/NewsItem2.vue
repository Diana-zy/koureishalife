<template>
  <CustomLink class="news-style-2" :to="`/detail/${item.path}/`">
    <NuxtImg
      format="auto"
      fit="cover"
      width="658"
      height="440"
      :src="item.cover"
      :alt="item.name"
      loading="lazy"
      class="img"
    />
    <p class="category">{{ capitalizeFirstLetter(item.category_locale_name) }}</p>
    <p class="title">{{ item.name }}</p>
  </CustomLink>
</template>

<script>
import { capitalizeFirstLetter } from "~/utils/utils";
export default {
  props: {
    item: {
      type: Object,
      required: true
    }
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
    padding: 1px 4px;
    line-height: 16px;
    font-size: 12px;
    font-family: "hem";
    color: $color1;
    background: rgba($color1, 0.2);
    border-radius: 4px 4px 4px 4px;
    margin: 16px 0 10px;
  }
  .title {
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
    border-bottom: vw(2) solid #ececee;
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
    }
    .title {
      margin: 0 0 vw(32);
      font-size: vw(30);
      line-height: vw(44);
    }
  }
}
</style>
