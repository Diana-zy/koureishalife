<template>
  <div class="page">
    <Header />
    <main class="main">
      <div class="layout-left">
        <common-page-label
          :title="`「${capitalizeFirstLetter(categoryInfo.category.locale_name.ja)}」の記事一覧`"
        />
        <section>
          <InfiniteLoadList
            api-endpoint="/api/article/get_category_article"
            :initial-page="2"
            :page-size="10"
            :query="{
              category_id: id
            }"
            :initial-items="categoryInfo.list"
            class="news-box-4"
          >
            <template #default="{ items }">
              <news-item-4
                v-for="(item, index) in items"
                :key="index"
                :index="index"
                :item="item"
              />
            </template>
          </InfiniteLoadList>
        </section>
      </div>
      <div class="layout-right">
        <right-side-box :rec-news="recNews.list" :trending-news="trendingNews.list" />
      </div>
    </main>
    <FooterSeo />
  </div>
</template>

<script>
import { capitalizeFirstLetter } from "~/utils/utils";

export default {
  async asyncData({ $axios, params, env }) {
    try {
      const path = params.category;
      const lastDashIndex = path.lastIndexOf("-");
      const id = path.substring(lastDashIndex + 1, path.length);
      const [recNewsResponse, trendingNewsResponse, categoryInfoResponse] = await Promise.all([
        $axios.$get("/api/article/menu", {
          params: {
            site_id: env.SITE_ID,
            mod_id: "rec"
          }
        }),
        $axios.$get("/api/article/menu", {
          params: {
            site_id: env.SITE_ID,
            mod_id: "trending",
            size: 6
          }
        }),
        $axios.$get("/api/article/get_category_article", {
          params: {
            site_id: env.SITE_ID,
            category_id: id,
            size: 10
          }
        })
      ]);
      console.log(categoryInfoResponse, "categoryInfoResponse");
      // 返回多个接口的数据
      return {
        recNews: recNewsResponse,
        trendingNews: trendingNewsResponse,
        categoryInfo: categoryInfoResponse,
        id
      };
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },
  methods: {
    capitalizeFirstLetter
  }
};
</script>

<style lang="scss" scoped>
::v-deep .news-box-4 {
  .load-list-content {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px 28px;
    font-family: "Noto Sans JP", "Lucida Grande", "Hiragino Kaku Gothic ProN", Meiryo, sans-serif;
  }
}
@media screen and (max-width: 750px) {
  ::v-deep .news-box-4 {
    .load-list-content {
      grid-template-columns: repeat(1, 1fr);
      gap: vw(52);
    }
  }
}
</style>
