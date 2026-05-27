<template>
  <header class="header">
    <div class="header-top">
      <CustomLink to="/" class="logo"></CustomLink>
      <div class="search-box m-hidden-block">
        <!-- <transition name="slide"> -->
        <input v-model="input" placeholder="ウェブ検索" class="search" @keyup.enter="search" />
        <!-- </transition> -->
        <i v-show="input != ''" class="icon-clear" @click="clear"></i>
        <i class="icon-search" @click="search"></i>
      </div>
    </div>
    <div class="menu">
      <div class="category">
        <ul class="dropdown">
          <li v-for="(item, i) in navData.list.slice(0, 6)" :key="i"
            ><CustomLink :to="`/category/${item.path}/`">{{
              capitalizeFirstLetter(item.name)
            }}</CustomLink></li
          >
        </ul>
      </div>

      <div class="search-m-box pc-hidden-flex">
        <i class="icon-search" :class="{ 'show-close': showSearch }" @click="handleOpenSearch"></i>
        <div class="pc-hidden-block">
          <div class="icon-sidebar" :class="{ 'show-close': isSidebarOpen }" @click="toggleSidebar">
          </div>
          <!--          <Sidebar :is-open="isSidebarOpen" :nav-data="navData" @close="closeSidebar" />-->
        </div>
        <transition name="opacity">
          <div class="mask" @click="handleClickMask" v-show="isSidebarOpen || showSearch">
            <transition name="slide">
              <div class="menu-nav-list" v-show="isSidebarOpen">
                <ul>
                  <li v-for="item in navData.list">
                    <CustomLink :to="`/category/${item.path}/`">{{
                      capitalizeFirstLetter(item.name)
                    }}</CustomLink>
                  </li>
                </ul>
              </div>
            </transition>
            <transition name="slide">
              <div class="menu-nav-list" v-show="showSearch">
                <div class="search-box-nav" @click.stop="handleClick">
                  <input
                    v-model="input"
                    placeholder="ウェブ検索"
                    class="search-nav"
                    @keyup.enter="search"
                  />
                  <i v-show="input != ''" class="icon-clear-nav" @click="clear"></i>
                  <i class="icon-search-nav" @click="search"></i>
                </div>
              </div> </transition
          ></div>
        </transition>
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
      showSearch: false,
      navData: this.$root.$options.navData || this.$navData || { list: [] },
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
    handleOpenSearch() {
      this.isSidebarOpen = false;
      this.showSearch = !this.showSearch;
      if (this.showSearch) {
        document.body.classList.add("no-scroll");
      } else {
        document.body.classList.remove("no-scroll");
      }
    },
    handleClickMask(){
      this.showSearch = false;
      this.isSidebarOpen = false;
      document.body.classList.remove("no-scroll");
    },
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
      this.showSearch = false;
      this.isSidebarOpen = !this.isSidebarOpen;
      if (this.isSidebarOpen) {
        document.body.classList.add("no-scroll");
      } else {
        document.body.classList.remove("no-scroll");
      }
    },
    closeSidebar() {
      this.isSidebarOpen = false;
    },
    handleClick(){},
    clear() {
      this.input = "";
    },
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
  z-index: 11;
  .header-top {
    width: 100%;
    height: 66px;
    display: flex;
    align-items: center;
    justify-content: center;
    .logo {
      display: block;
      width: 265px;
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
    width: 100%;
    overflow: hidden;
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
      overflow-x: auto;
      /*justify-content: space-around;*/
    }
    li {
      white-space: nowrap;
      flex: 1;
      a {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
  }
}
.search-box {
  position: absolute;
  top: 9px;
  right: 0;
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
  right: 13px;
  top: 8px;
  display: block;
  cursor: pointer;
  border-radius: 0 8px 8px 0;
  //background-color: $color1;
  @include icon(32px, 32px, "icon-search4.png");
  background-size: 32px 32px;
}

.dropdown li:hover {
  /* background: rgba($color1, 0.2);*/
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
@media screen and (max-width: 1100px) {
  .search-box {
    width: 240px;
  }
}
@media screen and (max-width: 750px) {
  .header {
    width: 100%;
    padding: 0 vw(32);
    max-width: 100vw;
    height: vw(114);
    display: flex;
    align-items: center;
    justify-content: space-between;
    /*margin-bottom: vw(32);*/
    border-bottom: vw(2) solid rgba($font3, 0.35);
    z-index: 11;
    .header-top {
      height: 100%;
      justify-content: start;
      .logo {
        width: vw(320);
        height: vw(48);
        @include bg("logo.png");
        margin-right: 0;
      }
    }
  }
  .menu-nav-list {
    position: absolute;
    top: 0;
    left: 0;
    padding: vw(40) vw(32);
    height: auto;
    width: 100vw;
    transition: all 0.6s;
    overflow: hidden;
    background-color: #fff;
    z-index: 12;
    font-family: Helvetica Neue, Helvetica Neue;
    font-size: vw(32);
    li {
      padding: vw(16) 0;
      line-height: vw(48);
      border-bottom: vw(2) solid rgba($font3, 0.2);
    }
    a{
      display: inline-block;
      width: 100%;
    }
  }
  .show-menu {
    height: fit-content;
  }
  .contact,
  .category {
    display: none;
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
    position: relative;
    width: 100%;
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
    top: 0;
    right: 0;
    position: relative;
    display: block;
    border-radius: vw(8);
    @include icon(vw(48), vw(48), "icon-search4.png");
    background-size: vw(48) vw(48);
    background-color: transparent;
  }
  .search-box-nav {
    position: relative;
    width: 100%;
    height: vw(80);
    display: flex;
    flex-wrap: nowrap;
    .search-nav {
      width: 100%;
      border: vw(2) solid $font3;
      border-radius: vw(12);
      padding-left: vw(32);
    }
    .icon-clear-nav {
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
    .icon-search-nav {
      position: absolute;
      right: vw(32);
      top: 50%;
      transform: translateY(-50%);
      display: block;
      @include btn-img(vw(48), vw(48), "icon-search4.png");
    }
  }
  .show-close {
    @include icon(vw(48), vw(48), "icon-close.png");
  }
  .mask {
    position: absolute;
    top: vw(114);
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 10;
    background: rgba(#111, 0.7);
    overflow: hidden;
    pointer-events: all;
  }
}
</style>
