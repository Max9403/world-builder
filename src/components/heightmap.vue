<template>
  <div class="heightmap">
    <settings @changed="setSettings" :settings="$store.state.settings" :generator="generator"></settings>
    <div class="tiles" :style="{ gridAutoRows: `${$store.state.settings.resolution}px`, gridAutoColumns: `${$store.state.settings.resolution}px`}">
      <template v-for="x in $store.state.settings.tiles.horizontal" v-show="$store.state.settings.show === 'heightmap'">
        <template v-for="y in $store.state.settings.tiles.vertical">
          <tile :x="x - 1" :y="y - 1" :resolution="$store.state.settings.resolution" :generator="generator" :border="$store.state.settings.border"></tile>
        </template>
      </template>
    </div>
  </div>
</template>

<style lang="scss">
  .heightmap {
    overflow: hidden;
    position: relative;
    border-left: 1rem solid #BCB7AF;
    background: #BCB7AF;
    .tiles {
      position: absolute;
      display: inline-grid;
      background: red;
      grid-gap: 1px;
    }
  }
</style>

<script>
import $ from 'jquery'
import interact from 'interactjs'

import settings from './settings.vue'
import tile from './tile.vue'

export default {
  props: ["generator"],
  components: {
    settings,
    tile
  },
  data() {
    return { position: {x: 0, y: 0}};
  },
  methods: {
    setSettings(settings) {
      this.$store.commit("setSettings", settings);
    }
  },
  mounted() {
    let component = this;
    let el = this.$el;
    let $el = $(el);
    interact(el)
      .draggable({
          ignoreFrom: 'a, input, textarea, .modal',
          inertia: true,
          autoScroll: true,
          onmove(event) {
            component.position.x += event.dx;
            component.position.y += event.dy;
            $el.find('.tiles').css({top: component.position.y, left: component.position.x})
          },
      })
  }
}
</script>
