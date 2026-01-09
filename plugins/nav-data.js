// plugins/navData.js
export default async function ({ $axios, env, isServer }, inject) {
  // if (!isServer) return;

  try {
    const data = await $axios.$get("/api/article/get_all_seo_category", {
      params: {
        site_id: env.SITE_ID
      }
    });
    // const recKeywordsData = await $axios.$get("/api/article/search_recommend_words", {
    //   params: {
    //     site_id: env.SITE_ID
    //   }
    // });
    inject("navData", data);
    inject("sameAs", [
      // "https://www.facebook.com/people/Seniorsbetter/61586174372459/",
      // "https://x.com/seniorsbetter",
      "https://x.com/koureishalife",
      "https://www.facebook.com/people/Koureishalife/61585924755675/",
      // "https:\\/\\/www.facebook.com\\/TheFamilyHandyman",
      // "https:\\/\\/www.instagram.com\\/familyhandyman\\/",
      // "https:\\/\\/www.youtube.com\\/user\\/thefamilyhandyman",
      // "https:\\/\\/www.pinterest.com\\/family_handyman\\/",
      // "https:\\/\\/twitter.com\\/Family_Handyman"
    ]);
    // inject("recKeywords", recKeywordsData.list);
  } catch (error) {
    console.error("Failed to fetch navigation data:", error);
    inject("navData", []);
    // inject("recKeywords", []);
  }
}
