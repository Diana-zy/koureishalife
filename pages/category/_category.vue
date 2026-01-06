<template>
  <div class="page">
    <Header />
    <main class="main">
      <div class="layout-left">
        <breadcrumb
          :info="{
            category_id: id,
            category_locale_name: categoryInfo?.seo_category?.name
          }"
          isCategory
        ></breadcrumb>
        <common-page-label
          :title="`「${capitalizeFirstLetter(categoryInfo?.seo_category.name)}」の記事一覧`"
        />
        <section>
          <InfiniteLoadList
            api-endpoint="/api/article/get_category_article"
            :initial-page="3"
            :page-size="20"
            :query="{
              category_id: id
            }"
            :initial-items="categoryInfo?.list"
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
        $axios.$get("/api/article/get_seo_category_page", {
          params: {
            site_id: env.SITE_ID,
            seo_category_id: id,
            size: 20,
            page: 1
          }
        })
      ]);
      // console.log(categoryInfoResponse, "categoryInfoResponse");
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
  head() {
    return {
      script: [
        {
          type: "application/ld+json",
          innerHTML: JSON.stringify({
            "@context": "https:\/\/schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                item: {
                  "@id": "https:\/\/www.koureishalife.com\/",
                  name: "Home"
                }
              },
              {
                "@type": "ListItem",
                position: 2,
                item: {
                  "@id": `https://www.koureishalife.com/category/${this.id}/`,
                  name: this.categoryInfo?.seo_category.name
                }
              }
            ]
          })
        },
        {
          type: "application/ld+json",
          innerHTML: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: [
              ...this.categoryInfo?.list.map((item, index) => ({
                "@type": "ListItem",
                position: index + 1,
                url: `https://www.koureishalife.com/detail/${item.path_v2}/`
              }))
            ]
          })
        }
      ],
      __dangerouslyDisableSanitizers: ["script"] // 禁用清理，允许插入内联 JavaScript
    };
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
