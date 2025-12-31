<template>
  <div class="page">
    <Header />
    <div class="page-layout">
      <breadcrumb></breadcrumb>
      <article class="article">
        <h1 class="article-title" style="">{{ newInfo.name }}</h1>
        <div class="news-detail first_paragraph">{{ newInfo.first_paragraph }}</div>
        <div id="relatedsearches1"> </div>
        <NuxtImg
          format="auto"
          fit="cover"
          width="600"
          :src="newInfo.cover"
          :alt="newInfo.name"
          class="article-img"
          preload
        />
        <!-- eslint-disable vue/no-v-html -->
        <div class="news-detail" v-html="newInfo.content"></div>
        <!--eslint-enable-->
      </article>
    </div>
    <footer-seo />
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

    const [data, allResponse] = await Promise.all([
      $axios.$get("/api/article/detail", {
        params: {
          site_id: env.SITE_ID,
          article_id: id
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

    const mixArray = allResponse.list.slice();

    return {
      newInfo: data,
      all: allResponse,
      floatArray: shuffleArray(mixArray),
      toc,
      htmlWithAnchor
    };
  },
  data() {
    return {
      channelId: ""
    };
  },
  head() {
    return {
      htmlAttrs: {
        lang: this.newInfo.language
      },
      title: this.newInfo.name + " - Koureishalife",
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.newInfo.first_paragraph
        },
        {
          hid: "keywords",
          name: "keywords",
          content: this.newInfo.terms
        },
        {
          hid: "og:title",
          property: "og:title",
          content: this.newInfo.name
        },
        {
          hid: "og:description",
          property: "og:description",
          content: this.newInfo.first_paragraph
        },
        {
          hid: "og:url",
          property: "og:url",
          content: `https://koureishalife.com/detail/${this.newInfo.path}/`
        },
        {
          hid: "og:locale",
          property: "og:locale",
          content: this.newInfo.language
        },
        {
          hid: "og:image",
          property: "og:image",
          content: this.newInfo.cover
        },
        {
          hid: "og:type",
          property: "og:type",
          content: "article"
        }
      ],
      __dangerouslyDisableSanitizers: ["script"] // 禁用清理，允许插入内联 JavaScript
    };
  },

  mounted: function () {
    window.handleRequestAdByChannel("mounted", 1);
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
    this.handleInitSchema();
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
        articleBody:
          "I have a confession: I am a tire snob. With almost 60 years in the \u201ccar wars\u201d as a master technician and vocational educator, there are three safety systems on any car I work on (especially my own) where I refuse to compromise: brakes, steering and suspension, and tires.When the tires on my SUV began to dry rot, the tire manufacturer replaced them under warranty. The tire shop where I took my SUV to have the tires replaced suggested filling the new tires with nitrogen to help prevent further dry rot. I figured it was an \u201cupsell\u201d (as were the new tire valves, plus the \u201chard sell\u201d for the road hazard warranty), but since I was getting four new tires for free, I let them do it for the $30 fee.Unfortunately, over the next four years, my SUV was driven very little. The replacement tires, with tread that was almost brand new, developed a nasty case of dry rot\u2014again replaced under warranty. In my case, the nitrogen didn\u2019t help. So, how do you decide whether to use nitrogen in your tires\u2014 is it ever worth it? Read along as experts in the field separate myth from fact on using nitrogen in your tiresBenefits of NitrogenYuliya Taba\/Getty ImagesThe selling points are fairly straightforward: nitrogen-inflated tires maintain steady air pressure even during seasonal temperature fluctuations, improve fuel economy, extend tire life, and enhance driving safety. \u201cNitrogen molecules are larger than oxygen molecules, so in theory, the larger nitrogen molecules are supposed to leak more slowly,\u201d says Jim DeLeo, of Hunter Engineering Company. \u201cNitrogen also does not contain moisture, which supposedly reduces corrosion and oxidation inside the tire and wheel.\u201dWhat Does the Science Say?\u201cNitrogen used in service garages, as is regular shop compressed air, is usually filtered and dry, but still in regular driving, the difference [in overall tire performance] is very slight,\u201d says William Fletcher from car.com.uk.Scientific testing from multiple sources shows that the benefits of tires inflated with nitrogen may be real but negligible:Consumer Reports conducted a 12-month test of 31 nitrogen\u2011filled tires. Those tires lost 2.2 psi, while traditional air\u2011filled tires lost 3.5 psi, a difference of just 1.3 psi over an entire year. Consumer Reports added, \u201cOur test showed that while nitrogen has some advantages, both nitrogen and air-filled tires lose pressure over time. It is important that car owners routinely check their tire pressure.\u201dThe National Highway Traffic Safety Administration\u2019s (NHTSA) tests found that nitrogen slows pressure loss slightly, while also reducing oxidation; however, this reduction is not enough to affect real-world tire life or rolling resistance. The report asserted, \u201cEven slight contamination of the tire inflation gas with compressed atmospheric air during normal inflation pressure maintenance\u00a0may negate the benefits of using nitrogen.\u201dAAA testing noted that nitrogen-filled tires did not eliminate temperature\u2011related pressure changes and didn\u2019t make tires maintenance\u2011free. According to AAA, \u201cSince nitrogen does not completely eliminate temperature-related pressure changes under normal driving conditions, it is of little benefit to vehicle owners who properly maintain their tires.\u201d\u201cIf you understand that air is already 78 percent nitrogen, and it\u2019s virtually impossible to evacuate all of the air from a tire assembly. That makes it impractical to try filling a tire with 100 percent pure nitrogen,\u201d said DeLeo. \u201cMixing air and nitrogen is safe, it just reduces the nitrogen\u2019s purity and any of the small benefits that may come with it. DeLeo added that when it comes to dry rot, \u201cNitrogen protects the inside of a tire. A tire\u2019s outside is exposed to heat, cold, UV rays, and Ozone that cause rubber to degrade.\u201d Other causes of dry rot include harsh tire and wheel cleaning chemicals, road salts or a car sitting idle for an extended period without being moved.When Nitrogen Makes SenseRacing cars have used nitrogen-filled tires for years, primarily due to stability during extreme temperature swings and because nitrogen doesn\u2019t support moisture or combustion. Many commercial fleets also use nitrogen-filled tires. While an individual driver normally sees minimal economic gain when using nitrogen-filled tires, the savings can be significant when multiplied across hundreds of vehicles.Of course, if you never bother to check your tire\u2019s air pressure or wait until the tire pressure light comes on, then going with nitrogen-filled tires would make sense.When Nitrogen Probably Isn\u2019t Worth ItIf you use regular air and you check your tire pressure monthly, nitrogen usually doesn\u2019t justify the cost. The total air pressure loss difference is insignificant. In addition:All the tests show nitrogen did not substantially improve fuel economy when pressures are properly maintained.Nitrogen does not prevent punctures, major leaks or valve stem issues. In these situations, \u201cboth gases will leak equally,\u201d says Fletcher.Nitrogen does not typically increase tire life under normal driving conditions.Online tire retailer, Tire Rack may have said it best, \u201cRather than pay extra for nitrogen, most drivers would be better off buying an accurate tire pressure gauge and checking and adjusting their tire pressures regularly.\u201dFAQHow do I know if my tires can be filled with nitrogen?\u201cAny modern tubeless tire can be filled with nitrogen,\u201d says DeLeo. Tires today are manufactured to exacting standards, making it more difficult for both nitrogen and air to seep through microscopic spaces that exist between a tire\u2019s rubber molecules than in previous tire generations. If you want to switch to nitrogen, your shop must purge (inflate, then deflate) the tires with nitrogen several times to reach a purity level of 95 percent or greater. Although not required, install green valve stem caps (with N2 logo), which indicate that your tires are filled with nitrogen.Is nitrogen environmentally better?No, not really. Our breathable air already contains 78 percent nitrogen and is an essential necessity for all life on earth. Additionally, nitrogen as a fertilizer plays a crucial role in farming and agricultural production. However, nitrogen oxides (NOX) is an environmentally damaging tailpipe emission and a major contributor to air pollution, increasing health risks. \u201cProperly inflated tires can increase fuel economy, reducing emissions (smog) over time,\u201d says Fletcher, which can help the environment.ExpertsJim DeLeo is the Northeast Division Manager for Hunter Engineering Company.William Fletcher MBE (Order of the British Empire) is the CEO of Car.co.uk a UK-based online car-selling and automotive services platform.ResourcesAAA Automotive: \u201cTop 4 Myths Vs Facts About Using Nitrogen To Inflate Car Tires\u201cBiology Insights: \u201cIs Nitrogen Good or Bad for the Environment and Your Health?\u201cCar Buzz: \u201cNitrogen In Tires: Understanding The Benefits\u201cConsumer Reports: \u201cShould You Use Nitrogen in Your Car Tires?\u201cNHTSA: \u201cUse of Nitrogen Gas in Tires\u201cTire Rack: \u201cShould I Use Nitrogen In My Tires?\u201d",
        //文章归属的板块（参考站是填写的面包屑层级）
        articleSection: "Home, Automotive, Parts, Tires",
        //文章标题
        headline: "Should You Use Nitrogen In Your Tires? Experts Weigh In",
        //文章描述（参考站是填写的正文上方的一段文本）
        description:
          "Nitrogen promises stable tire pressure, better tire performance and other benefits; but is it really worth the extra cost?",
        datePublished: "2025-12-23T07:30:46Z", //发布时间
        dateModified: "2025-12-23T07:30:46Z", //修改时间
        //作者相关
        author: [
          {
            "@type": "Person",
            name: "Bob Lacivita",
            //作者页面    （暂无）
            url: "https:\/\/www.familyhandyman.com\/author\/bob-lacivita\/",
            //作者卡片里面的内容描述  （暂无）
            description:
              "Since rebuilding his first engine at age 14, cars have been Bob Lacivita's passion, as well as his way of life. He went on to become an award-winning ASE and General Motors auto technician, vocational educator, career and technical center administrator, technical consultant and freelance writer; teaching legions of students and readers about DIY car repairs, vehicle maintenance and other self-help topics. Bob maintains his ASE Master Technician credentials, among many others, and has served as a Family Handyman auto repair pro for decades. He and his wife lived through 40 years' worth of DIY home remodeling while parenting two (now grown) boys, and currently relax by watching their three fabulous granddaughters.\r\n\u00a0",
            //作者头像
            image:
              "https:\/\/www.familyhandyman.com\/wp-content\/uploads\/2020\/07\/BL-Headshot-TFH-2_16_2022-Bob-Lacivita-scaled-e1708699973594.jpg?resize=75,75",
            email: "bobl273@comcast.net" //（暂无）
          }
        ],
        //该文章内容所描述的主要实体所在的页面
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id":
            "https:\/\/www.familyhandyman.com\/article\/should-you-use-nitrogen-in-your-tires\/"
        },
        //发布商相关
        publisher: {
          "@type": "NewsMediaOrganization",
          name: "Family Handyman",
          url: "https:\/\/www.familyhandyman.com",
          //关于我们About Us
          publishingPrinciples: "https:\/\/www.familyhandyman.com\/about-the-family-handyman\/",
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
          "https:\/\/www.familyhandyman.com\/wp-content\/uploads\/2025\/12\/Should-You-Use-Nitrogen-In-Your-Tires_GettyImages-2244450896_FT.jpg",
          "https:\/\/www.familyhandyman.com\/wp-content\/uploads\/2025\/12\/Should-You-Use-Nitrogen-In-Your-Tires_GettyImages-2244450896_FT.jpg?fit=700,1024"
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
              "@id": "https:\/\/www.familyhandyman.com\/",
              name: "Home"
            }
          },
          {
            "@type": "ListItem",
            position: 2,
            item: {
              "@id": "https:\/\/www.familyhandyman.com\/automotive\/",
              name: "Automotive"
            }
          },
          {
            "@type": "ListItem",
            position: 3,
            item: {
              "@id": "https:\/\/www.familyhandyman.com\/automotive\/parts\/",
              name: "Parts"
            }
          },
          {
            "@type": "ListItem",
            position: 4,
            item: {
              "@id": "https:\/\/www.familyhandyman.com\/automotive\/parts\/tires\/",
              name: "Tires"
            }
          }
        ]
      };
      window.handleCreatScriptSchema(JSON.stringify(data1));
    },
    handleAdsScript() {
      const buffer = window.getCookie("pathInfo");
      if (!buffer || Number(JSON.parse(buffer)[window.location.pathname]) < 3) {
        this.addAdSenseScript();
      }
    },
    addAdSenseScript() {
      if (window.getCountyByLanguage() !== "Japan") {
        return;
      }
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
        styleId: "5492246976",
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
            window.handleRequestAdByChannel("query_ad", 1);
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
    }
  }
};
</script>

<style lang="scss" scoped>
.page-layout {
  padding: 0 20px;
}
.article-img {
  width: 100%;
  margin-bottom: 1em;
}
.article {
  line-height: 19px;
  font-family: "hem";
  padding-bottom: 32px;
  border-bottom: 1px solid #ececee;
  min-height: calc(100vh - 72px - 56px - 64px);
}
.article-title {
  font-size: 26px;
  font-family: "hem";
  line-height: 30px;
  margin-bottom: 24px;
}
.news-detail {
  p {
    text-indent: 1em;
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
  text-indent: 1em;
  font-size: 14px;
  line-height: 19px;
}
.google-ad-preload {
  margin-bottom: 4px;
}
.news-box-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

@media screen and (max-width: 1100px) {
  .news-box-2 {
    display: flex;
    flex-wrap: wrap;
  }
}

@media screen and (max-width: 750px) {
  .page-layout {
    padding: 0 vw(46);
  }
  .article {
    line-height: vw(38);
    padding-bottom: vw(32);
    border-bottom: vw(2) solid #ececee;
    min-height: calc(100vh - vw(304));
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
}
</style>
