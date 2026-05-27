import { shuffleArray, capitalizeFirstLetter } from "../../utils/utils";
import Breadcrumb from "../../components/Breadcrumb";
import CustomLink from "../../components/CustomLink";
import ItemModeNew from "../../components/Item/ModeNew";
import { processHtmlWithToc, generateNestedToc } from "../../utils/cheerio-toc.js";

export default {
  components: { Breadcrumb, CustomLink, ItemModeNew },
  async asyncData({ $axios, params, env }) {
    const path = params.detail;
    if (!path) return { newInfo: null, all: null, floatArray: [], toc: [], id: null, htmlWithAnchor: "", recNews: [], trendingNews: [], articleFaqs: [] };
    const lastDashIndex = path.lastIndexOf("-");
    const id = path.substring(lastDashIndex + 1, path.length);
    try {
      let data = null;
      try {
        data = await $axios.$get("/api/article/detail", {
          params: { site_id: env.SITE_ID, article_id: id, related_num: 3 }
        });
      } catch (detailError) {
        console.error(`Failed to fetch detail for ID ${id}:`, detailError);
        return { newInfo: null, all: null, floatArray: [], toc: [], id, htmlWithAnchor: "", recNews: [], trendingNews: [], articleFaqs: [] };
      }
      if (!data?.content) {
        console.warn(`No content found for ID ${id}`);
        return { newInfo: null, all: null, floatArray: [], toc: [], id, htmlWithAnchor: "", recNews: [], trendingNews: [], articleFaqs: [] };
      }
      let recNewsResponse = null, trendingNewsResponse = null, allResponse = null;
      try {
        [recNewsResponse, trendingNewsResponse, allResponse] = await Promise.all([
          $axios.$get("/api/article/menu", { params: { site_id: env.SITE_ID, mod_id: "rec" } }).catch(err => { console.error("recNews API error:", err.message); return null; }),
          $axios.$get("/api/article/get_all_articles", { params: { site_id: env.SITE_ID, size: 4, page: 1 } }).catch(err => { console.error("trendingNews API error:", err.message); return null; }),
          $axios.$get("/api/article/menu", { params: { site_id: env.SITE_ID, mod_id: "all", page: 1, size: 20 } }).catch(err => { console.error("allResponse API error:", err.message); return null; })
        ]);
      } catch (error) { console.error("Parallel fetch error:", error); }
      const extractList = (response) => {
        if (!response) return [];
        if (Array.isArray(response)) return response;
        if (response.list) return response.list;
        if (response.data?.list) return response.data.list;
        if (response.data && Array.isArray(response.data)) return response.data;
        if (response.items) return response.items;
        if (response.result) return response.result;
        return [];
      };
      data.content = data.content.replace(/font-family:\s*['"]?宋体['"]?;/g, "");
      data.content = data.content.replace(/<\/h4><p><br><br>|<br><br><\/p><h4>/g, (match) => {
        return match.includes("</h4><p>") ? "</h4><p>" : "</p><h4>";
      });
      const { toc: flatToc, htmlWithAnchor: rawHtml } = processHtmlWithToc(data.content, [2]);
      const toc = generateNestedToc(flatToc);
      let htmlWithAnchor = rawHtml;
      const pEnds = [];
      const pRegex = /<\/p>/gi;
      let pMatch;
      while ((pMatch = pRegex.exec(rawHtml)) !== null) {
        pEnds.push(pMatch.index + pMatch[0].length);
      }
      if (pEnds.length > 0) {
        const midPos = pEnds[Math.floor(pEnds.length / 2)];
        htmlWithAnchor = rawHtml.slice(0, midPos) + '<div id="relatedsearches2"></div>' + rawHtml.slice(midPos);
      }
      htmlWithAnchor = htmlWithAnchor
        .replace(/(<table)/g, '<div class="table-scroll-wrapper">$1')
        .replace(/<\/table>/g, '</table></div>');
      const articleFaqs = data.faqs || [
        { question: "この文章の内容について、もっと詳しく知りたいですか？", answer: "本站点は老後資金準備に関する最新情報を提供ています。" },
        { question: "老後の資金準備はいつから始めるべきですか？", answer: "一般的に、30代から老後の資金準備を始めることが推奨されています。" },
        { question: "老後資金についての情報はどこで見つけられますか？", answer: "本站点のカテゴリページからご覧いただけます。" }
      ];
      return {
        newInfo: data, all: allResponse,
        floatArray: shuffleArray(allResponse?.list?.slice() || []),
        toc, id, htmlWithAnchor,
        recNews: extractList(recNewsResponse),
        trendingNews: extractList(trendingNewsResponse),
        articleFaqs
      };
    } catch (error) {
      console.error("Error fetching data:", error);
      return { newInfo: null, all: null, floatArray: [], toc: [], id, htmlWithAnchor: "", recNews: [], trendingNews: [], articleFaqs: [] };
    }
  },
  data() {
    return { channelId: "", navData: this.$root.$options.navData || this.$navData || {} };
  },
  head() {
    const seoTitle = this.newInfo?.seo_title || this.newInfo?.name;
    const seoDesc = this.newInfo?.seo_desc;
    return {
      title: seoTitle ? `${seoTitle} | 高齢者ライフ` : "高齢者ライフ",
      meta: [
        { hid: "description", name: "description", content: seoDesc },
        { hid: "og:title", property: "og:title", content: seoTitle },
        { hid: "og:description", property: "og:description", content: seoDesc },
        { hid: "og:url", property: "og:url", content: `https://koureishalife.com/${this.newInfo?.path_v2}/` },
        { hid: "og:locale", property: "og:locale", content: this.newInfo?.language },
        { hid: "og:image", property: "og:image", content: `https://bunchthings.com/cdn-cgi/image/w=600,f=auto,fit=cover/${this.newInfo?.cover}` },
        { hid: "og:type", property: "og:type", content: "article" },
        { hid: "twitter:image", property: "twitter:image", content: `https://bunchthings.com/cdn-cgi/image/w=600,f=auto,fit=cover/${this.newInfo?.cover}` },
        { hid: "twitter:title", property: "twitter:title", content: seoTitle },
        { hid: "twitter:description", property: "twitter:description", content: seoDesc },
        { hid: "twitter:url", property: "twitter:url", content: `https://koureishalife.com/${this.newInfo?.path_v2}/` },
        { hid: "twitter:locale", property: "twitter:locale", content: this.newInfo?.language }
      ],
      script: [
        { type: "application/ld+json", json: { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: (this.articleFaqs || []).map(faq => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) } },
        { type: "application/ld+json", json: { "@context": "https://schema.org", "@type": "NewsArticle", articleBody: this.newInfo?.content_text || "", articleSection: `Home, ${this.newInfo?.seo_category_name || this.newInfo?.category_locale_name || ""}, ${this.newInfo?.name || ""}`, headline: this.newInfo?.seo_title || this.newInfo?.name || "", description: seoDesc || "", datePublished: this.newInfo?.updated_at || "", dateModified: this.newInfo?.updated_at || "", author: [{ "@type": "Person", name: this.newInfo?.author?.name || "", description: this.newInfo?.author?.intro || "", image: `https://bunchthings.com/${this.newInfo?.author?.avatar || ""}` }], mainEntityOfPage: { "@type": "WebPage", "@id": `https://www.koureishalife.com/${this.newInfo?.path_v2 || ""}/` }, publisher: { "@type": "NewsMediaOrganization", name: "Koureisha Life", url: "https://www.koureishalife.com", publishingPrinciples: "https://www.koureishalife.com/us/", sameAs: this.$sameAs }, image: [`https://bunchthings.com/cdn-cgi/image/f=auto,fit=cover/${this.newInfo?.cover || ""}`, `https://bunchthings.com/cdn-cgi/image/w=600,f=auto,fit=cover/${this.newInfo?.cover || ""}`] } },
        { type: "application/ld+json", json: { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, item: { "@id": "https://www.koureishalife.com/", name: "Home" } }, { "@type": "ListItem", position: 2, item: { "@id": `https://www.koureishalife.com/category/${this.newInfo?.category_id || ""}/`, name: this.newInfo?.category_name || "" } }, { "@type": "ListItem", position: 3, item: { "@id": `https://www.koureishalife.com/${this.newInfo?.path_v2 || ""}/`, name: this.newInfo?.name || "" } }] } }
      ]
    };
  },
  mounted() {
    this.handleCreateTableParentDom();
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has("channel")) {
      this.channelId = searchParams.get("channel");
    } else {
      this.channelId = this.newInfo?.channel || "";
    }
    this.$nextTick(() => { this.handleAdsScript(); });
  },
  methods: {
    capitalizeFirstLetter,
    scrollToAnchor(anchorId) {
      const target = document.getElementById(anchorId);
      if (!target) return;
      const targetTop = target.getBoundingClientRect().top + window.pageYOffset - 60;
      window.scrollTo({ top: targetTop, behavior: "smooth" });
      window.history.pushState({}, "", `#${anchorId}`);
    },
    handleAdsScript() {
      if (this.newInfo?.no_entry !== 1) { this.addAdSenseScript(); }
    },
    addAdSenseScript() {
      const searchParams = new URLSearchParams(window.location.search);
      let terms = searchParams.has("terms") ? searchParams.get("terms") : "";
      terms = terms.replace(/[，]/g, ",");
      let headline = searchParams.has("headline") ? searchParams.get("headline") : "";
      if (headline === "{title}" || headline === "{{ad_title}}") { headline = ""; }
      const paramKeys = [];
      for (const param of searchParams) { paramKeys.push(param[0]); }
      const ignoredPageParams = paramKeys.join(",");
      const hiSource = window.getParam("hi_source");
      const hiPc = window.getParam("hi_pc");
      const resultsPageBaseUrl = window.getResultsPageUrl({ channel: this.channelId, from: "detail", hi_source: hiSource, hi_pc: hiPc });
      const adSenseConfig = { channel: this.channelId, pubId: "partner-pub-6612490456597819", styleId: "6462282781", adsafe: "low", ignoredPageParams, relatedSearchTargeting: "content", resultsPageBaseUrl, resultsPageQueryParam: "query", terms: terms || this.newInfo?.terms, referrerAdCreative: headline || terms || this.newInfo?.referrer_ad_creative, ivt: false };
      // eslint-disable-next-line no-undef
      _googCsa("relatedsearch", adSenseConfig, { container: "relatedsearches1", relatedSearches: 5, adLoadedCallback: function (loaded, response, isExperimentVariant, callbackOptions) { if (response) { window.trackEventToPixel("D_C_AC"); window.pushEventParamsToGtm("C_AC"); try { let numberOfKeys = 0; let concatenatedKeys = "miss"; if (callbackOptions.termPositions) { const keys = Object.keys(callbackOptions.termPositions); numberOfKeys = keys.length; concatenatedKeys = keys.join(","); } const element = document.getElementById("master-1"); const height = parseFloat(element.style.height); const result = Math.round(height / 105); dataLayer.push({ event: "C_AC_IN", queryNum: 10, num: result, key1: numberOfKeys, key2: concatenatedKeys }); } catch (e) { console.log(e); } } } }, { container: "relatedsearches2", relatedSearches: 5 });
    },
    handleCreateTableParentDom() {
      document.querySelectorAll("table.table-container").forEach(dom => {
        if (!dom.parentNode.classList.contains("table-container-parent")) {
          const newParent = document.createElement("div");
          newParent.setAttribute("class", "table-container-parent");
          dom.parentNode.insertBefore(newParent, dom);
          newParent.appendChild(dom);
        }
      });
    }
  }
};
