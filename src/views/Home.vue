<template>
  <div class="home">
    <h1>{{title}}</h1>
    <span class="subtitle">{{subtitle}}</span>
    <div class="item-group-container">
      <ItemGroup title="Server Management"/>
      <ItemGroup title="External Infrastructure"/>
      <ItemGroup title="Utilities"/>
    </div>
  </div>
</template>

<script>

import ItemGroup from '@/components/ItemGroup.vue'

export default {
  name: 'home',
  components: {
    ItemGroup
  },
  props: {
    title: { default: 'Panel', type: String },
    subtitle: { default: 'All your server management tools in one place', type: String }
  }
}
</script>

<style lang="scss" scoped>
h1 {
  background: -webkit-linear-gradient(to left top, #9F86FF, #1CA8DD, #007AE1);
  background: linear-gradient(to left top, #9F86FF, #1CA8DD, #007AE1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 3em;
  margin: 0;
  display: inline;
}
span.subtitle {
  color: #9F86FF;
  margin: 10px;
  font-style: italic;
  text-shadow: 1px 1px 2px #130f23;
}
.item-group-container {
  display: flex;
  margin: 2em 0;
  .item-group-outer {
    margin: 10px;
  }
}
</style>