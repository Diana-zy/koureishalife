<template>
  <div class="bread-crumb">
    <CustomLink to="/" class="type">home</CustomLink>
    <span> / </span>
    <CustomLink to="/" class="type">{{ info?.name }}</CustomLink>
    <span> / </span>
    <CustomLink to="/" class="type">{{ info?.name }}</CustomLink>
  </div>
</template>

<script>
export default {
  name: "Breadcrumb",
  props: {
    info: {
      type: Object,
      default: () => {}
    }
  }
};
</script>

<style scoped lang="scss">
.bread-crumb {
  font-weight: bold;
  color: $font1;
  display: flex;
  align-items: center;
  height: 40px;
  font-size: 16px;
  line-height: 40px;
  gap: 12px;
  margin-bottom: 20px;
  .type {
    max-width: 200px;
    @include ellipsis();
  }
}
@media screen and (max-width: 750px) {
  .bread-crumb {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    height: vw(80);
    font-size: vw(28);
    line-height: vw(60);
    gap: vw(10);
    margin-bottom: vw(20);
    .type {
      max-width: vw(150);
    }
  }
}
</style>
