<template>
  <div class="page">
    <Header />
    <main class="main">
      <div class="layout-left">
        <div class="page-layout">
          <breadcrumb :info="newInfo"></breadcrumb>
          <article class="article">
            <h1 class="article-title" style="">{{ newInfo.name }}</h1>
            <div class="news-author">
              <div>{{ newInfo.author.name }}</div>
              <div>{{ newInfo.updated_at }}</div>
            </div>
            <div class="news-detail first_paragraph">{{ newInfo.first_paragraph }}</div>
            
            <!-- 文章摘要框 - SEO+GEO优化 -->
            <div class="article-summary" v-if="newInfo.seo_desc">
              <div class="summary-icon">📋</div>
              <div class="summary-content">
                <h3 class="summary-title">この記事の要約</h3>
                <p class="summary-text">{{ newInfo.seo_desc }}</p>
              </div>
            </div>
            
            <div id="relatedsearches1"> </div>
            <aside class="toc-container" v-if="toc.length">
              <h3 class="toc-title">この記事の内容</h3>
              <nav class="toc-nav">
                <ul class="toc-list">
                  <li
                    v-for="item in toc"
                    :key="item.id"
                    :class="['toc-item', `toc-level-${item.level}`]"
                    @click="scrollToAnchor(item.id)"
                  >
                    {{ item.text }}
                  </li>
                </ul>
              </nav>
            </aside>
            <NuxtImg
              format="auto"
              fit="cover"
              width="600"
              :src="newInfo.cover"
              :alt="newInfo.cover_seo_alt"
              class="article-img"
              preload
            />
            <div class="news-detail" v-html="htmlWithAnchor"></div>
            
            <!-- FAQ区块 - GEO优化 -->
            <section class="faq-section" v-if="articleFaqs && articleFaqs.length">
              <h2 class="faq-title">関連質問</h2>
              <div class="faq-list">
                <div v-for="(faq, index) in articleFaqs" :key="index" class="faq-item">
                  <h3 class="faq-question">{{ faq.question }}</h3>
                  <p class="faq-answer">{{ faq.answer }}</p>
                </div>
              </div>
            </section>
          </article>
          <section v-if="newInfo?.related_articles?.length">
            <h3 class="title-h2">関連記事</h3>
            <div class="related-articles">
              <news-item-5 v-for="(item, i) in newInfo.related_articles" :key="i" :item="item">
              </news-item-5>
            </div>
          </section>
        </div>
      </div>
      <div class="layout-right">
        <right-side-box :rec-news="trendingNews?.list" :trending-news="recNews?.list" />
      </div>
    </main>
    <footer-seo :info="newInfo" />
  </div>
</template>

<script>
import { shuffleArray } from "../../utils/utils";
import Breadcrumb from "../../components/Breadcrumb";
import { processHtmlWithToc, generateNestedToc } from "../../utils/cheerio-toc.js";
export default {
  components: { Breadcrumb },
  async asyncData({ $axios, params, env }) {
    // 从URL中提取文章ID
    // 新格式: /分类slug/文章slug-id/ => params.category=分类slug, params.slug=文章slug-id
    const slug = params.slug;
    const lastDashIndex = slug.lastIndexOf("-");
    const id = slug.substring(lastDashIndex + 1, slug.length);

    const [recNewsResponse, trendingNewsResponse, data, allResponse] = await Promise.all([
      $axios.$get("/api/article/menu", {
        params: {
          site_id: env.SITE_ID,
          mod_id: "rec"
        }
      }),
      $axios.$get("/api/article/get_all_articles", {
        params: {
          site_id: env.SITE_ID,
          size: 4,
          page: 1
        }
      }),
      $axios.$get("/api/article/detail", {
        params: {
          site_id: env.SITE_ID,
          article_id: id,
          related_num: 3
        }
      }),
      $axios.$get("/api/article/menu", {
        params: {
          site_id: env.SITE_ID,
          mod_id: "all",
          page: 1,
          size: 20
        }
      })
    ]);
    data.content = data.content.replace(/font-family:\s*['"]?宋体['"]?;/g, "");
    data.content = data.content.replace(/<\/h4><p><br><br>|<br><br><\/p><h4>/g, (match) => {
      return match.includes("</h4><p>") ? "</h4><p>" : "</p><h4>";
    });

    const { toc: flatToc, htmlWithAnchor } = processHtmlWithToc(data.content, [2]);
    const toc = generateNestedToc(flatToc);

    const mixArray = allResponse?.list?.slice();

    // FAQ数据
    const articleFaqs = data.faqs || [
      {
        question: "この文章の内容について、もっと詳しく知りたいですか？",
        answer: "本站点は老後資金準備に関する最新情報を提供ています。相关文章为您详细介绍。"
      },
      {
        question: "老後の資金準備はいつから始めるべきですか？",
        answer: "一般的に、30代から老後の資金準備を始めることが推奨されています。早ければ早いほど、複利効果により 적은 부담で目標を達成できます。"
      },
      {
        question: "老後資金についての更多信息はどこで見つけられますか？",
        answer: "本站点のカテゴリ页面，您可以找到更多关于老後資金準備的相关文章。"
      }
    ];

    const newInfo = {
      ...data,
      faqs: articleFaqs,
      author: data.author || { name: "不明" },
      first_paragraph: data.first_paragraph,
      seo_desc: data.seo_desc
    };

    const recNews = shuffleArray(recNewsResponse?.list || []);
    const trendingNews = shuffleArray(trendingNewsResponse?.list || []);

    if (mixArray) {
      shuffleArray(mixArray);
    }

    return {
      newInfo,
      toc,
      htmlWithAnchor,
      articleFaqs,
      recNews,
      trendingNews,
      mixArray
    };
  },
  methods: {
    scrollToAnchor(id) {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
// 样式在页面组件中直接定义，复用 detail 页面的样式结构
</style>
