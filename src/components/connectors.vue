<template>
  <svg class="backdrop" width="1" height="1">
    <defs>
      <marker id="arrow" markerWidth="10" markerHeight="10" refX="10" refY="3" orient="auto" markerUnits="strokeWidth">
        <path d="M0,0 L0,6 L9,3 z" />
      </marker>
    </defs>
    <!-- <line :x1="offset.x + item.a.x" :y1="offset.y + item.a.y" :x2="offset.x + item.b.x" :y2="offset.y + item.b.y" :data-id1="item.id1" :data-id2="item.id2"
      v-for="(item, index) in items" marker-end="url(#arrow)"/> -->
      <line :data-id1="item.id1" :data-id2="item.id2" :key="`${item.id1}:${item.id2}`"
        v-for="(item, index) in items" marker-end="url(#arrow)"/>
  </svg>
</template>

<style lang="scss">
  .backdrop {
    width: 100%;
    height: 100%;
    line {
      stroke: black;
      stroke-width: 2;
    }
  }
</style>

<script>
  export default {
    props: ["items", "offset"],
    data() {
      return {}
    }
  }
</script>
