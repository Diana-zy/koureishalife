<template>
  <div class="page">
    <Header />
    <main>
      <div class="content-box">
        <common-page-label :title="`「${input}」の検索結果`" />
        <div id="afscontainer1"> </div>
        <div id="relatedsearches1"> </div>
        <h3 class="title-h3">{{ searchTitle }}</h3>
        <section>
          <item-search-result v-for="(item, i) in searchResultNews" :key="i" :item="item">
          </item-search-result>
        </section>
      </div>
      <div class="aside-box">
        <right-side-box :rec-news="recNews.list" :trending-news="trendingNews.list" />
      </div>
    </main>
    <FooterSeo />
  </div>
</template>

<script>
export default {
  async asyncData({ $axios, env }) {
    try {
      // 并行处理多个异步请求
      const [recNewsResponse, trendingNewsResponse] = await Promise.all([
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
            size: 30
          }
        })
      ]);
      // 返回多个接口的数据
      return {
        recNews: recNewsResponse,
        trendingNews: trendingNewsResponse
      };
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },
  data() {
    return {
      searchResultNews: [], // 新闻列表
      input: "", // 搜索输入
      channelId: "", // 频道 ID
      isShowResults: false // 是否显示搜索结果
    };
  },
  computed: {
    searchTitle() {
      const title = this.isShowResults
        ? `"${this.input}"について${this.searchResultNews.length}件見つかりました`
        : "検索情報を取得しています...";
      return title;
    }
  },
  mounted() {
    window.handleRequestAdByChannel("first", 5, true);
    const searchParams = new URLSearchParams(window.location.search);
    this.channelId = searchParams.has("channel") ? searchParams.get("channel") : "";
    if (window.getDetailIsClickAc()) {
      window.dataLayer.push({
        event: "S_PL"
      });
    }

    this.input = this.$route.query.query || "";
    if (window.isLoadAd === true) {
      this.input && this.addAdSense();
    } else {
      window.addEventListener("loadAd", () => {
        this.input && this.addAdSense();
      });
    }
    this.input && this.searchNews();
  },
  methods: {
    addAdSense() {
      setTimeout(() => {
        if (this.$route.query.from.includes("detail")) {
          if (window.handleRequestAdByChannel("", "", true)) {
            window.pushEventParamsToGtm("Q_AR");
            window.trackEventToPixel("Q_AR");
            this.addAdSenseScript();
          }
        }
      }, 0);
    },
    async searchNews() {
      try {
        const response = await this.$axios.$post("/api/article/search", {
          site_id: process.env.SITE_ID,
          key: this.input
        });

        this.searchResultNews = response.list;
        this.isShowResults = true;
      } catch (error) {
        this.isShowResults = true;
        console.error("Error fetching data:", error);
      }
    },
    addAdSenseScript() {
      if (window.getCountyByLanguage() !== "Japan") {
        return;
      }
      const queryString = this.input;

      const channelId = window.getParam("channel");
      const from = window.getParam("from");
      const hiSource = window.getParam("hi_source");
      const hiPc = window.getParam("hi_pc");
      const resultsPageBaseUrl = window.getResultsPageUrl({
        channel: channelId,
        from,
        hi_source: hiSource,
        hi_pc: hiPc
      });
      // 配置 AdSense 参数
      const adSenseConfig = {
        channel: channelId,
        pubId: "partner-pub-6612490456597819",
        query: queryString,
        styleId: "7223178098",
        adsafe: "low",
        ivt: false,
        resultsPageBaseUrl,
        resultsPageQueryParam: "query"
      };

      // AdSense 加载回调函数
      const adLoadedCallback =
        (eventName, additionalData = {}) =>
        (loaded, response) => {
          if (response) {
            // eslint-disable-next-line no-undef
            dataLayer.push({ event: eventName, ...additionalData });
          }
        };

      const adblock1 = {
        container: "afscontainer1",
        number: 8,
        adLoadedCallback: (loaded, e) => {
          if (e) {
            window.trackEventToPixel("C_AR");
            window.pushEventParamsToGtm("C_AR");
            if (window.getDetailIsClickAc()) {
              window.dataLayer.push({
                event: "C_AR_C"
              });
            }
            try {
              const element = document.getElementById("master-1");
              const height = parseFloat(element.style.height);
              const result = Math.round(height / 456);
              // eslint-disable-next-line no-undef
              dataLayer.push({ event: "C_AR_IN", num: result, query: queryString });
            } catch (error) {
              console.error(error);
            }
          } else {
            // eslint-disable-next-line no-undef
            dataLayer.push({ event: "FF_AR", query: queryString });
          }
        }
      };

      // 根据来源配置 rsblock1
      const rsblock1 = (() => {
        const baseConfig = {
          container: "relatedsearches1",
          relatedSearches: 5,
          adLoadedCallback: adLoadedCallback("C_AC", { query: queryString })
        };
        return baseConfig;
      })();

      // 加载 Google AdSense
      // eslint-disable-next-line no-undef
      _googCsa("ads", adSenseConfig, adblock1, rsblock1);
    }
  }
};
</script>

<style lang="scss" scoped>
main {
  padding-bottom: 32px;
  border-bottom: 1px solid #ececee;
}
.title-h3 {
  color: $font4;
}
@media screen and (max-width: 750px) {
  main {
    padding-bottom: vw(32);
    border-bottom: vw(2) solid #ececee;
  }
}
</style>
