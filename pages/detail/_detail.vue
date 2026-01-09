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
            <div id="relatedsearches1"> </div>
            <aside class="toc-container" v-if="toc.length">
              <h3 class="toc-title">この記事の内容</h3>
              <nav class="toc-nav">
                <ul class="toc-list">
                  <!-- 两种方式都行 -->
                  <!--                <a v-for="item in toc" :key="item.id" :href="`#${item.id}`">{{ item.text }}</a>-->
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
            <!-- eslint-disable vue/no-v-html -->
            <div class="news-detail" v-html="htmlWithAnchor"></div>
            <!--eslint-enable-->
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
    const path = params.detail;
    const lastDashIndex = path.lastIndexOf("-");
    const id = path.substring(lastDashIndex + 1, path.length);

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
          page:1
        }
      }),
      $axios.$get("/api/article/detail", {
        params: {
          site_id: env.SITE_ID,
          article_id: id,
          related_num:3,
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

    return {
      newInfo: data,
      all: allResponse,
      floatArray: shuffleArray(mixArray),
      toc,
      id,
      htmlWithAnchor,
      recNews: recNewsResponse,
      trendingNews: trendingNewsResponse
    };
  },
  data() {
    return {
      channelId: ""
    };
  },
  head() {
    return {
      // htmlAttrs: {
      //   lang: this.newInfo.language
      // },
      title: this.newInfo.name + " - Koureishalife",
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.newInfo.seo_desc
        },
        // {
        //   hid: "keywords",
        //   name: "keywords",
        //   content: this.newInfo.terms
        // },
        {
          hid: "og:title",
          property: "og:title",
          content: this.newInfo.seo_title
        },
        {
          hid: "og:description",
          property: "og:description",
          content: this.newInfo.seo_desc
        },
        {
          hid: "og:url",
          property: "og:url",
          content: `https://koureishalife.com/detail/${this.newInfo.path_v2}/`
        },
        {
          hid: "og:locale",
          property: "og:locale",
          content: this.newInfo.language
        },
        {
          hid: "og:image",
          property: "og:image",
          content: `https://bunchthings.com/cdn-cgi/image/w=600,f=auto,fit=cover/${this.newInfo?.cover}`
        },
        {
          hid: "og:type",
          property: "og:type",
          content: "article"
        },
        {
          hid: "twitter:image",
          property: "twitter:image",
          content: `https://bunchthings.com/cdn-cgi/image/w=600,f=auto,fit=cover/${this.newInfo?.cover}`
        },
        {
          hid: "twitter:title",
          property: "twitter:title",
          content: this.newInfo.seo_title
        },
        {
          hid: "twitter:description",
          property: "twitter:description",
          content: this.newInfo.seo_desc
        },
        {
          hid: "twitter:url",
          property: "twitter:url",
          content: `https://koureishalife.com/detail/${this.newInfo.path_v2}/`
        },
        {
          hid: "twitter:locale",
          property: "twitter:locale",
          content: this.newInfo.language
        }
      ],
      script: [
        {
          type: "application/ld+json",
          json: {
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            articleBody: this.newInfo.content_text,
            articleSection: `Home, ${this.newInfo.seo_category_name || this.newInfo.category_locale_name}, ${this.newInfo.name}`,
            headline: this.newInfo.seo_title,
            description: this.newInfo.seo_desc,
            datePublished: this.newInfo.updated_at,
            dateModified: this.newInfo.updated_at,
            author: [
              {
                "@type": "Person",
                name: this.newInfo?.author?.name,
                description: this.newInfo?.author?.intro,
                image: `https://bunchthings.com/${this.newInfo?.author?.avatar}`
              }
            ],
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://www.koureishalife.com/detail/${this.newInfo.path_v2}/`
            },
            publisher: {
              "@type": "NewsMediaOrganization",
              name: "Koureisha Life",
              url: "https://www.koureishalife.com",
              publishingPrinciples: "https://www.koureishalife.com/us/",
              sameAs: this.$sameAs
            },
            image: [
              `https://bunchthings.com/cdn-cgi/image/f=auto,fit=cover/${this.newInfo?.cover}`,
              `https://bunchthings.com/cdn-cgi/image/w=600,f=auto,fit=cover/${this.newInfo?.cover}`
            ]
          }
        },
        {
          type: "application/ld+json",
          json:{
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                item: {
                  "@id": "https://www.koureishalife.com/",
                  name: "Home"
                }
              },
              {
                "@type": "ListItem",
                position: 2,
                item: {
                  "@id": `https://www.koureishalife.com/category/${this.newInfo.category_id}/`,
                  name: this.newInfo.category_name
                }
              },
              {
                "@type": "ListItem",
                position: 3,
                item: {
                  "@id": `https://www.koureishalife.com/detail/${this.newInfo.path_v2}/`,
                  name: this.newInfo.name
                }
              }
            ]
          }
        }
      ],
      // __dangerouslyDisableSanitizers: ["script"] // 禁用清理，允许插入内联 JavaScript
    };
  },

  mounted: function () {
    // window.handleRequestAdByChannel("mounted", 1);
    this.handleCreateTableParentDom();
    // 获取 URL 查询参数
    const searchParams = new URLSearchParams(window.location.search);
    // AdSense 配置参数
    if (searchParams.has("channel")) {
      this.channelId = searchParams.get("channel");
    } else {
      this.channelId = this.newInfo.channel || "";
      if (this.channelId !== "") {
        searchParams.set("channel", this.channelId);
        const newUrl = `${window.location.origin}${
          window.location.pathname
        }?${searchParams.toString()}`;
        window.history.replaceState({}, "", newUrl);
      }
    }
    setTimeout(() => {
      this.handleAdsScript();
    }, 0);
  },
  methods: {
    //处理Schema
    handleInitSchema() {
      // 文章主体
      const data = {
        "@context": "https:\/\/schema.org",
        "@type": "NewsArticle",
        //文章主体的所有内容（正文部分）
        articleBody: this.newInfo.content_text, //文章归属的板块（参考站是填写的面包屑层级）
        articleSection: `Home, ${this.newInfo.seo_category_name || this.newInfo.category_locale_name}, ${this.newInfo.name}`,
        //文章标题
        headline: this.newInfo.seo_title,
        //文章描述（参考站是填写的正文上方的一段文本）
        description: this.newInfo.seo_desc,
        datePublished: this.newInfo.updated_at, //发布时间
        dateModified: this.newInfo.updated_at, //修改时间
        //作者相关
        author: [
          {
            "@type": "Person",
            name: this.newInfo?.author?.name,
            // //作者页面    （暂无）
            // url: "https:\/\/www.familyhandyman.com\/author\/bob-lacivita\/",
            // //作者卡片里面的内容描述  （暂无）
            description: this.newInfo?.author?.intro,
            //作者头像
            image: `https://bunchthings.com/${this.newInfo?.author?.avatar}`
            // email: "bobl273@comcast.net" //（暂无）
          }
        ],
        //该文章内容所描述的主要实体所在的页面
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `https:${window.getMainDomain()}${window.location.pathname}`
        },
        //发布商相关
        publisher: {
          "@type": "NewsMediaOrganization",
          name: "Koureisha Life",
          url: "https:\/\/www.koureishalife.com",
          //关于我们About Us
          publishingPrinciples: "https:\/\/www.koureishalife.com\/us\/",
          sameAs: [
            "https:\/\/www.wikidata.org\/wiki\/Q7733312",
            "https:\/\/www.freebase.com\/m\/0bmcfp1",
            "https:\/\/en.wikipedia.org\/wiki\/The_Family_Handyman",
            "https:\/\/www.facebook.com\/TheFamilyHandyman",
            "https:\/\/www.instagram.com\/familyhandyman\/",
            "https:\/\/www.youtube.com\/user\/thefamilyhandyman",
            "https:\/\/www.pinterest.com\/family_handyman\/",
            "https:\/\/twitter.com\/Family_Handyman"
          ]
        },
        //文章主图的两个尺寸（参考站用的顶部的主图，非文章中间的图片）
        image: [
          `https://bunchthings.com/cdn-cgi/image/f=auto,fit=cover/${this.newInfo?.cover}`,
          `https://bunchthings.com/cdn-cgi/image/w=600,f=auto,fit=cover/${this.newInfo?.cover}`
        ]
      };
      window.handleCreatScriptSchema(JSON.stringify(data));
      // 面包屑
      const data1 = {
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
              "@id": `https:\/\/www.koureishalife.com\/category\/${this.newInfo.seo_category_path}\/`,
              name: this.newInfo.category_name
            }
          },
          {
            "@type": "ListItem",
            position: 3,
            item: {
              "@id": `https:\/\/www.koureishalife.com${window.location.pathname}`,
              name: this.newInfo.name
            }
          }
        ]
      };
      window.handleCreatScriptSchema(JSON.stringify(data1));
    },
    scrollToAnchor(anchorId) {
      const target = document.getElementById(anchorId);
      if (!target) return;
      // 考虑导航栏高度，避免锚点被遮挡
      const navbarHeight = 60;
      const targetTop = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

      window.scrollTo({
        top: targetTop,
        behavior: "smooth" // 平滑滚动
      });

      // 更新URL锚点（可选，优化体验）
      window.history.pushState({}, "", `#${anchorId}`);
    },
    handleAdsScript() {
      if(this.newInfo.no_entry !== 1){
        this.addAdSenseScript();
      }

    },
    addAdSenseScript() {
      // if (window.getCountyByLanguage() !== "Japan") {
      //   return;
      // }
      // 获取 URL 查询参数
      const searchParams = new URLSearchParams(window.location.search);
      // 获取Url携带的terms参数
      let terms = searchParams.has("terms") ? searchParams.get("terms") : "";
      terms = terms.replace(/[，]/g, ",");
      // 获取Url携带的headline参数
      let headline = searchParams.has("headline") ? searchParams.get("headline") : "";
      if (headline === "{title}" || headline === "{{ad_title}}") {
        headline = "";
      }

      const paramKeys = [];
      // 遍历查询参数并将其添加到 paramKeys 数组中
      for (const param of searchParams) {
        paramKeys.push(param[0]);
      }
      const ignoredPageParams = paramKeys.join(",");

      const channelId = window.getParam("channel");
      const hiSource = window.getParam("hi_source");
      const hiPc = window.getParam("hi_pc");
      const resultsPageBaseUrl = window.getResultsPageUrl({
        channel: channelId,
        from: "detail",
        hi_source: hiSource,
        hi_pc: hiPc
      });
      const adSenseConfig = {
        channel: this.channelId,
        pubId: "partner-pub-6612490456597819",
        styleId: "6462282781",
        adsafe: "low",
        ignoredPageParams,
        relatedSearchTargeting: "content",
        resultsPageBaseUrl,
        resultsPageQueryParam: "query",
        terms: terms || this.newInfo.terms,
        referrerAdCreative: headline || terms || this.newInfo.referrer_ad_creative,
        ivt: false
      };

      // 初始化 _googCsa 并加载相关搜索广告
      // eslint-disable-next-line no-undef
      _googCsa("relatedsearch", adSenseConfig, {
        container: "relatedsearches1", // 广告容器 ID
        relatedSearches: 10, // 相关搜索广告数量
        adLoadedCallback: function (loaded, response, isExperimentVariant, callbackOptions) {
          if (response) {
            window.trackEventToPixel("D_C_AC");
            window.pushEventParamsToGtm("C_AC");
            const hi_user_source = window.getValueByURLOrCookie("hi_source");
            if(hi_user_source === "unknown"){
              window.dataLayer.push({
                event: 'Detail_D_C_AC_SEO',
                SEO_detail:"detail_"+this.id
              })
            }
            try {
              let numberOfKeys = 0;
              let concatenatedKeys = "miss";
              if (callbackOptions.termPositions) {
                const keys = Object.keys(callbackOptions.termPositions);
                numberOfKeys = keys.length;
                concatenatedKeys = keys.join(",");
              }

              const element = document.getElementById("master-1");
              const height = parseFloat(element.style.height);
              const result = Math.round(height / 105);

              // eslint-disable-next-line no-undef
              dataLayer.push({
                event: "C_AC_IN",
                queryNum: 10,
                num: result,
                key1: numberOfKeys,
                key2: concatenatedKeys
              }); // 事件推送到 dataLayer
            } catch (e) {
              console.log(e);
            }
          }
        }
      });
    },
    //处理表格
    handleCreateTableParentDom() {
      let dom = document.getElementsByClassName("table-container")?.[0];
      if (dom) {
        let newParent = document.createElement("div"); // 创建一个新的div元素作为父级元素
        newParent.setAttribute("class", "table-container-parent"); // 设置新元素的class属性
        let parent = dom.parentNode; // 获取现有元素的父级元素
        parent.insertBefore(newParent, dom); // 将新父级元素插入到现有元素之前
        newParent.appendChild(dom); // 将现有元素移动到新父级元素中
      }
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .table-container-parent {
  width: 100%;
  overflow-x: auto;
}
.news-author {
  display: flex;
  justify-content: space-between;
  margin-top: 13px;
  font-size: 14px;
  padding-bottom: 16px;
  @include author-icon(25px, 25px);
}
::v-deep .table-container {
  position: relative;
  width: 100%;
  margin: 24px 0;
  border-top: 3px solid rgba($font3, 0.65);
  border-collapse: collapse;
  tr {
    text-align: center;
    padding: 10px;
    height: 61px;
    td {
      background: rgba(#fd9a25, 0.1);
      border: 2px solid #fff;
      font-size: 14px;
      color: $font5;
    }
    td:first-child {
      /*font-weight: bold;*/
      font-size: 16px;
      color: $font5;
    }
  }
  tr:first-child {
    th,td {
      /*font-weight: bold;*/
      color: $font5;
      font-size: 16px;
      border-bottom: 3px solid rgba($font3, 0.35);
    }
  }
}
::v-deep .iframe-video-style {
  width: 100%;
  aspect-ratio: 16/9;
  iframe {
    width: 100%;
    height: 100%;
  }
}
.page-layout {
  padding: 0 20px;
}
.article-img {
  width: 100%;
  margin-bottom: 1em;
}
::v-deep .article {
  line-height: 1.5;
  font-family: "hem";
  font-size: 16px;
  padding-bottom: 32px;
  border-bottom: 1px solid #ececee;
  min-height: calc(100vh - 72px - 56px - 64px);
  menu,
  ul {
    list-style: disc;
    padding-left: 40px;
  }
  menu,
  ol{
    list-style: decimal;
    padding-left: 40px;
  }
  a{
    text-decoration: underline;
    color: $color1;
  }
  p{
    margin-bottom: 28px;
  }
  h2
  {
    font-size: 1.2em !important;
  }
}
.article-title {
  font-size: 26px;
  font-weight: bold;
  line-height: 30px;
  margin-bottom: 24px;
}
.news-detail {
  color: $font5;
  p {
    /*text-indent: 1em;*/
  }
}
.read-more {
  line-height: 4;
}
.hide {
  display: none;
  &.show {
    display: block;
  }
}
.first_paragraph {
  /*text-indent: 1em;*/
  font-size: 14px;
  /*line-height: 19px;*/
  margin-bottom: 28px;
}
.google-ad-preload {
  margin-bottom: 4px;
}
.news-box-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.toc-container {
  margin: 0px 0 20px;
  padding: 12px 0;
  width: 100%;
  color: $font1;
  background: rgba(#fd9a25, 0.1);
  ul{
    padding-left: 0;
  }
  .toc-title {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 12px;
  }
  .toc-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    li {
      cursor: pointer;
      line-height: 26px;
      font-size: 20px;
      width: 100%;
      @include ellipsis();
    }
  }
}

.related-articles {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}
@media screen and (max-width: 1100px) {
  .news-box-2 {
    display: flex;
    flex-wrap: wrap;
  }
}

@media screen and (max-width: 750px) {
  ::v-deep .table-container {
    margin: vw(30) 0;
    max-width: vw(658);
    width: vw(658);
    border-top: vw(4) solid rgba($font3, 0.65);
    tr {
      text-align: center;
      padding: vw(20);
      min-height: vw(122);
      td {
        background: rgba(#fd9a25, 0.1);
        border: vw(4) solid #fff;
        font-size: vw(28);
        padding: vw(12) vw(32);
        /*min-width: vw(300);*/
      }
      td:first-child {
        font-weight: normal;
        font-size: vw(32);
      }
    }
    tr:first-child {
      border-collapse: collapse;
      /*border-bottom: vw(2) solid rgba($font3, 0.35);*/
      th,td {
        border-bottom: vw(4) solid rgba($font3, 0.35);
        min-width: vw(200);
        padding: vw(12) vw(32);
        background: rgba(#fd9a25, 0.1);
        font-weight: normal;
        font-size: vw(32);
      }
    }
  }
  /*.news-author {
    display: flex;
    justify-content: space-between;
    margin-top: 0;
    font-size: vw(28);
    padding-bottom: vw(24);
    @include author-icon(vw(50), vw(50));
  }*/
  .page-layout {
    padding: 0 0;
  }
  ::v-deep .article {
    line-height: vw(38);
    font-size: vw(36);
    padding-bottom: vw(32);
    border-bottom: vw(2) solid #ececee;
    min-height: calc(100vh - vw(304));
    menu,
    ol,
    ul {
      padding-left: vw(32);
    }
    p{
      margin-bottom: vw(32);
    }
  }
  .article-title {
    font-size: vw(40);
    line-height: vw(56);
    margin-bottom: vw(32);
  }
  .article-desc {
    margin-bottom: vw(48);
  }
  .first_paragraph {
    font-size: vw(32);
    color: rgba(23, 23, 23, 0.8);
    line-height: vw(44);
    margin-bottom: vw(32);
  }
  .google-ad-preload {
    margin-bottom: vw(10);
  }
  .title-h2-margin {
    margin-top: vw(74);
    margin-bottom: vw(32);
  }
  .news-box-2 {
    gap: vw(32);
  }
  .toc-container {
    margin: 0 0 vw(32);
    padding: vw(24) 0;
    .toc-title {
      font-size: vw(40);
      margin-bottom: vw(24);
    }
    ul{
      padding-left: 0;
    }
    .toc-list {
      gap: vw(10);
      li {
        line-height: vw(50);
        font-size: vw(32);
      }
    }
  }
  .related-articles {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: vw(40);
    padding-bottom: vw(32);
  }
}
</style>
