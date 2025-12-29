<template>
    <div class="bread-crumb">
      <CustomLink to="/" class="logo">home</CustomLink>
      <span> > </span>
      <CustomLink to="/" class="logo">type</CustomLink>
      <span> > </span>
      <CustomLink to="/" class="logo">one</CustomLink>
    </div>
</template>

<script>
    export default {
        name: "Breadcrumb"
    }
</script>

<style scoped lang="scss">
.bread-crumb{
  display: flex;
  align-items: center;
  height: 40px;
  font-size: 16px;
  line-height: 40px;
  gap: 12px;
  margin-bottom: 20px;
}
@media screen and (max-width: 750px) {
  .bread-crumb{
    display: flex;
    align-items: center;
    height: vw(80);
    font-size: vw(24);
    line-height: vw(80);
    gap: vw(20);
    margin-bottom: vw(20);
  }
}
</style>
