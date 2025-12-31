<template>
  <footer class="footer" :class="{ sm: ['de'].indexOf(lang) !== -1 }">
    <div class="footer-info">
      <div class="icon-logo">
        <img :src="icon" alt="" />
      </div>
      <div class="website-info">
        中高年(40代・50代・60代)の暮らしとキャリアを、いくつになっても満ち足りたものにするための情報サイトです。日々の生活に役立つ情報から「これからの働き方」を考えるヒントとなる情報まで、様々なコンテンツを配信しています。</div
      >
      <div class="link-info">
        <ul>
          <li class="link-item">
            <a href=""> 会社概要 </a>
          </li>
          <li class="link-item">
            <a href="mailto:service@koureishalife.com"> お問い合わせ </a>
          </li>
          <li class="link-item">
            <CustomLink :to="'/cookies-jp.html'" target="_blank">プライバシーポリシー </CustomLink>
          </li>
          <li class="link-item">
            <CustomLink :to="`/eula-jp.html`" target="_blank">利用規約: </CustomLink>
          </li>
          <li class="link-item">
            <CustomLink :to="``" target="_blank">X (Twitter) </CustomLink>
          </li>
          <li class="link-item">
            <CustomLink :to="``" target="_blank">Instagram </CustomLink>
          </li>
          <li class="link-item">
            <CustomLink :to="``" target="_blank">Facebook </CustomLink>
          </li>
          <li class="link-item">
            <CustomLink :to="``" target="_blank">LINE公式アカウント </CustomLink>
          </li>
        </ul>
      </div>
      <div class="bottom-info">© G-PLAN , Inc.</div>
    </div>
    <Notification v-if="showNotification" :message="notificationMessage" />
  </footer>
</template>

<script>
import { validateEmail } from "~/utils/utils";

export default {
  props: {
    lang: {
      type: String,
      default: "ja"
    },
    channelId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      input: "",
      icon: require("@/assets/images/logo.png")
    };
  },
  computed: {
    showNotification() {
      return this.$globalData.notification.show;
    },
    notificationMessage() {
      return this.$globalData.notification.message;
    }
  },
  methods: {
    async submitEmail() {
      if (validateEmail(this.input)) {
        await this.$axios.$post("/api/game/subscribe", {
          site_id: process.env.SITE_ID,
          email: this.input
        });
        this.$globalMethod.showNotification({
          message: "Thank you for subscribing!",
          type: "success"
        });
      } else {
        this.$globalMethod.showNotification({
          message: "Please enter a valid email address",
          type: "warning"
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.footer {
  position: relative;
  margin-top: 32px;
  .icon-logo {
    width: 285px;
    margin-bottom: 24px;
    img {
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
  }
  .website-info {
    font-size: 16px;
    line-height: 22px;
  }
  .link-info {
    li {
      padding: 20px 0;
      display: inline-block;
      margin-right: 30px;
    }
  }
  .bottom-info {
    width: 100%;
    height: 44px;
    font-size: 14px;
    text-align: center;
    line-height: 44px;
    color: #fff;
    background: #fd9a25;
  }
}

@media screen and (max-width: 750px) {
  .footer {
    position: relative;
    margin-top: vw(32);
    .icon-logo {
      margin-left: vw(46);
      width: vw(460);
      height: vw(64);
    }
    .website-info {
      padding: 0 vw(46);
      line-height: vw(36);
      font-size: vw(24);
    }
    .link-info {
      padding: vw(48) vw(46) 0;
      li {
        padding: 0;
        display: block;
        line-height: vw(66);
        font-size: vw(24);
        color: rgba(#000, 0.65);
        border-top: vw(1) solid rgba($font3, 0.35);
      }
      li:last-child {
        border-bottom: vw(1) solid rgba($font3, 0.35);
      }
    }
    .bottom-info {
      width: 100%;
      height: vw(70);
      font-size: vw(28);
      line-height: vw(70);
      margin-top: vw(64);
    }
  }
}
</style>
