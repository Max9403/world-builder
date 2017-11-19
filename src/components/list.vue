<template>
  <div class="list">
     <listing :item="item" v-for="(item, index) in items" :key="item.id"></listing>
  </div>
</template>

<style lang="scss">
  @import "~perfect-scrollbar/css/perfect-scrollbar.css";

  .list {
    position: relative;
    border-right: 1px solid #4B4E4E;
    background-color: #666767;
  }
</style>

<script>
    import listing from './component/component-listing.vue'
    import PerfectScrollbar from 'perfect-scrollbar';

    export default {
        props: ["items"],
        components: {
          listing
        },
        data() {
            return {};
        },
        mounted() {
          new PerfectScrollbar(this.$el)
        }
    }
</script>
