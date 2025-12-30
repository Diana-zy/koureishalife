<template>
  <CustomLink class="mode-new" :to="`/detail/${item.path}/`">
    <div class="img-box">
      <NuxtImg
        format="auto"
        fit="cover"
        width="366"
        height="244"
        :src="item.cover"
        :alt="item.name"
        loading="lazy"
        class="img"
      />
    </div>
    <div class="right-info">
      <p class="title">{{ item.name }}</p>
      <div class="tag">{{ capitalizeFirstLetter(item.category_locale_name) }}</div>
    </div>
  </CustomLink>
</template>

<script>
import { capitalizeFirstLetter } from "~/utils/utils";
export default {
  name: "ModeNew",
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

<style scoped lang="scss">
.mode-new {
  width: 100%;
  height: auto;
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  gap: 12px;
  &:hover {
    .img {
      transform: scale(1.2);
    }
  }
  .img-box {
    flex-shrink: 0;
    width: 90px;
    height: 90px;
    overflow: hidden;
  }
  .img {
    width: 90px;
    height: 90px;
    object-fit: cover;
    transition: 0.6s;
  }
  .right-info {
    flex: 1;
    .title {
      line-height: 21px;
      font-size: 17px;
      margin-bottom: 8px;
      @include ellipsis(3);
    }
    .tag {
      width: fit-content;
      padding: 8px 12px;
      color: $color1;
      background: rgba($color1, 0.2);
    }
  }
}
</style>
