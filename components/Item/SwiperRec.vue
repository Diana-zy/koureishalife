<template>
  <CustomLink class="swiper-rec" :to="`/detail/${item.path_v2}/`">
    <div class="swiper-rec-img">
      <NuxtImg
        format="auto"
        fit="cover"
        width="795"
        height="418"
        :src="item.cover"
        :alt="item.name"
        loading="lazy"
        class="img m-hidden"
      />
      <NuxtImg
        format="auto"
        fit="cover"
        width="658"
        height="346"
        :src="item.cover"
        :alt="item.name"
        loading="lazy"
        class="img pc-hidden"
      />
    </div>
    <div class="swiper-rec-tag">
      <div class="rec-tag">相続税・贈与税</div>
    </div>
    <div class="swiper-rec-title">
      {{ item.name }}
    </div>
    <div class="swiper-rec-author">
      <div class="author-org">
        <div class="author-icon"></div>
        <div>{{ item.author.name }}</div>
      </div>
      <div class="edit-date">{{ item.updated_at }}</div>
    </div>
  </CustomLink>
</template>

<script>
export default {
  name: "SwiperRec",
  props: {
    item: {
      type: Object,
      required: true
    }
  }
};
</script>

<style scoped lang="scss">
.swiper-rec {
  .swiper-rec-img {
    width: 100%;
    height: auto;
    .img {
      width: 100%;
      object-fit: cover;
    }
  }
  .swiper-rec-tag {
    width: 100%;
    display: flex;
    gap: 8px;
    margin: 24px 0 16px;
    .rec-tag {
      line-height: 19px;
      font-size: 16px;
      padding: 6px 8px;
      background: $tagColor1;
      color: #000;
    }
  }
  .swiper-rec-title {
    min-height: 60px;
    font-size: 24px;
    line-height: 30px;
    font-weight: 700;
    margin-bottom: 16px;
    @include ellipsis(2);
  }
  .swiper-rec-author {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .author-org {
      display: flex;
      align-items: center;
      .author-icon {
        margin-right: 8px;
        @include icon(24px, 24px, "icon-logo-m.png");
      }
    }
    .edit-date {
    }
  }
}
@media screen and (max-width: 750px) {
  .swiper-rec {
    padding: 0 0 vw(48);
    border-bottom: vw(1) solid rgba($font3, 0.35);
    .swiper-rec-img {
      margin-bottom: vw(24);
      .img {
        width: vw(658);
        height: vw(346);
      }
    }
    .swiper-rec-tag {
      width: 100%;
      margin: vw(24) 0 vw(48);
      gap: vw(12);
      .rec-tag {
        padding: vw(12) vw(16);
      }
    }
    .swiper-rec-title {
      @include ellipsis(3);
      font-size: vw(40);
      line-height: vw(60);
      margin-bottom: vw(20);
      min-height: vw(180);
    }
    .swiper-rec-author {
      height: vw(42);
      line-height: vw(42);
      .author-org {
        height: vw(40);
        display: flex;
        align-items: center;
        .author-icon {
          margin-right: vw(6);
          @include icon(vw(40), vw(40), "icon-logo-m.png");
        }
        div {
          line-height: vw(40);
          font-size: vw(30);
        }
      }
      .edit-date {
        font-size: vw(24);
        line-height: vw(28);
      }
    }
  }
}
</style>
