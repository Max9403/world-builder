<template>
  <canvas class="maptile" :data-s="cal" :width="resolution" :height="resolution" :style="{ gridColumn: x + 1, gridRow: y + 1}"></canvas>
</template>

<script>
  import eventBus from '../event-bus'

  export default {
    props: ["x", "y", "resolution", "generator", "border"],
    data() {
      return {};
    },
    computed: {
      cal() {
        return this.$store.state.flow ? "" : "";
      }
    },
    watch: {
      generator(newG) {
        this.redraw(newG);
      }
    },
    methods: {
      redraw(func) {
        func = func || this.generator;
        let el = this.$el;
        let component = this;
        let ctx = el.getContext('2d');
        let image = ctx.createImageData(component.resolution, component.resolution);
        for (let localY = 0; localY < component.resolution; localY++) {
          for (let localX = 0; localX < component.resolution; localX++) {
            let value = func({x: this.x * component.resolution + localX, y: this.y * component.resolution + localY}) * 255;
            for (let offset = 0; offset < 3; offset++) {
              image.data[(localX + localY * component.resolution) * 4 + offset] = value;
            }
            image.data[(localX + localY * component.resolution) * 4 + 3] = 255;
          }
        }
        ctx.putImageData(image, 0, 0);
      }
    },
    created() {
      eventBus.$on('tile-rerender', () => this.redraw());
    },
    mounted() {
      this.redraw();
    }
  }
</script>
