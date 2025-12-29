<template>
  <header class="header">
    <div class="header-top">
      <CustomLink to="/" class="logo"></CustomLink>
    </div>
    <div class="menu">
      <div class="category">
        <ul class="dropdown">
          <li v-for="(item, i) in navData.list.slice(0, 5)" :key="i"
            ><CustomLink :to="`/category/${item.path}/`">{{
              capitalizeFirstLetter(item.locale_name.ja)
            }}</CustomLink></li
          >
        </ul>
      </div>

      <div class="search-box m-hidden-block">
        <!-- <transition name="slide"> -->
        <input v-model="input" placeholder="ウェブ検索" class="search" @keyup.enter="search" />
        <!-- </transition> -->
        <i v-show="input != ''" class="icon-clear" @click="clear"></i>
        <i class="icon-search" @click="search"></i>
      </div>
      <div class="search-m-box pc-hidden-flex">
        <i class="icon-search" @click="search"></i>
        <div class="pc-hidden">
          <div class="icon-sidebar" @click="toggleSidebar"> </div>
          <Sidebar :is-open="isSidebarOpen" :nav-data="navData" @close="closeSidebar" />
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { simulateAFSSearch, capitalizeFirstLetter } from "~/utils/utils";

export default {
  props: {
    categories: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      input: "",
      searchInput: "",
      // currentIndex: 0,
      // currentWord: "",
      deferredPrompt: null,
      showInstallButton: false,
      isSidebarOpen: false,
      navData: this.$root.$options.navData || this.$navData,
      recKeywords: this.$recKeywords // 站点推荐关键字
    };
  },
  // beforeMount() {
  //   this.input = this.$route.query.query || "";
  //   let currentPath = this.$route.path;
  //   if (!currentPath.startsWith("/detail/")) {
  //     this.hotWords = this.recKeywords;
  //   }
  // },
  mounted() {
    this.input = this.$route.query.query || "";
    // 判断是否支持 PWA
    if ("serviceWorker" in navigator && "PushManager" in window) {
      if (window.deferredPrompt) {
        this.deferredPrompt = window.deferredPrompt;
        this.showInstallButton = true;
      } else {
        window.addEventListener("beforeinstallprompt", (e) => {
          e.preventDefault();
          this.deferredPrompt = e;
          this.showInstallButton = true;
        });
      }
    }
  },
  methods: {
    capitalizeFirstLetter,
    search() {
      if (this.input.length < 1) {
        this.$globalMethod.showNotification({
          message: "Please enter at least 1 characters",
          type: "warning"
        });
        return;
      }
      simulateAFSSearch(this.input);
    },
    installPWA() {
      if (this.deferredPrompt) {
        this.deferredPrompt.prompt();
        this.deferredPrompt.userChoice.then(() => {
          this.deferredPrompt = null;
        });
      }
    },
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    closeSidebar() {
      this.isSidebarOpen = false;
    },
    clear() {
      this.input = "";
    }
    // 清空热词
  }
};
</script>
<style lang="scss" scoped>
.toggle-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.toggle-button:hover {
  background-color: #0056b3;
}
.header {
  position: relative;
  max-width: 1200px;
  height: 147px;
  margin-bottom: 0px;
  .header-top {
    height: 66px;
    display: flex;
    align-items: center;
    .logo {
      display: block;
      width: 135px;
      height: 40px;
      @include bg("logo.png");
      margin-right: 56px;
    }
  }
}
.menu {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .category {
    width: auto;
    font-size: 16px;
    line-height: 72px;
    cursor: pointer;
    position: relative;
    z-index: 2;
    .dropdown {
      display: flex;
      align-items: center;
      flex-wrap: nowrap;
      gap: 40px;
    }
    li {
      white-space: nowrap;
      a {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
  }
}
.pwa-download {
  width: 32px;
  height: 32px;
  background: rgba($color1, 0.2);
  border-radius: 850%;
  @include center;
  font-family: "hem";
  color: $font2;
}
/*.icon-pwa {
  @include icon(20px, 20px, "icon-pwa.png");
}*/
.search-box {
  position: relative;
  width: 380px;
  height: 48px;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0);
  border-radius: 8px;
  border: 1px solid $font3;
  margin: 0 0 0 24px;
  padding-left: 16px;
  padding-right: 120px;
}
.search {
  position: absolute;
  top: 0;
  left: 16px;
  width: 60%;
  height: 100%;
  font-family: "hem";
  &::placeholder {
    font-family: "hem";
    color: rgba($font1, 0.4);
  }
}
.icon-clear {
  position: absolute;
  right: 94px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  background-image: url("~/assets/images/icon-clear.png");
  width: 16px;
  height: 16px;
  background-size: cover;
}
.icon-search {
  position: absolute;
  right: -1px;
  top: -1px;
  display: block;
  border-radius: 0 8px 8px 0;
  background-color: $color1;
  @include btn-img(64px, 48px, "icon-search.png");
  background-size: 32px 32px;
}

.dropdown li:hover {
  background: rgba($color1, 0.2);
  color: $color1;
}
.contact {
  width: 116px;
  height: 72px;
  line-height: 72px;
  font-size: 16px;
  font-family: "hem";
  color: $font1;
  text-align: right;
  cursor: pointer;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s ease;
}

.slide-enter {
  opacity: 0;
  transform: translateY(40%);
}

.slide-leave-to {
  transform: translateY(-40%);
  opacity: 0;
}
@media screen and (max-width: 750px) {
  .header {
    width: 100%;
    padding: 0;
    max-width: 100vw;
    height: vw(160);
    display: flex;
    align-items: center;
    justify-content: space-between;
    .header-top {
      height: 100%;
    }
  }
  .contact,
  .category {
    display: none;
  }
  .logo {
    width: vw(202);
    height: vw(60);
    @include bg("logo.png");
    margin-right: 0;
  }
  .icon-sidebar {
    @include icon(vw(48), vw(48), "icon-sidebar.png");
    cursor: pointer;
  }
  .pc-hidden {
    margin-left: auto;
  }
  .menu {
    height: 100%;
    width: auto;
  }
  .search-m-box {
    width: auto;
    height: vw(64);
    display: flex;
    align-items: center;
    gap: vw(20);
  }
  .search {
    width: 46%;
    height: 100%;
    font-family: "hem";
    &::placeholder {
      font-family: "hem";
      color: rgba($font1, 0.4);
    }
  }
  .icon-clear {
    position: absolute;
    right: vw(100);
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    background-image: url("~/assets/images/icon-clear.png");
    width: vw(28);
    height: vw(28);
    background-size: cover;
  }
  .icon-search {
    position: relative;
    display: block;
    border-radius: vw(8);
    @include btn-img(vw(80), vw(64), "icon-search.png");
    background-size: vw(48) vw(48);
  }
}
</style>
