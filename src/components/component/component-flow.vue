<template>
  <div class="component" :data-flow="item.id">
    <div class="name has-text-centered">
      {{ type.name }}
    </div>
    <div class="in" :data-id="input.id" v-for="(input, index) in type.inputs" :key="input.id" :style="{background: colours.input[staticIz(input)]}" :title="staticIz(input)" @click="setInput(input.id)"></div>
    <div class="out" :data-id="output.id" v-for="(output, index) in type.outputs" :key="output.id" :style="{background: colours.output[staticIz(output)]}" :title="staticIz(output)" @click="setOutput(output.id)"></div>
    <div class="extra" v-if="type.custom">
      <component :is="type.custom" :item="item"></component>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .component {
    position: absolute;
    margin: 0;
    width: 8rem;
    top: 1rem;
    left: 1rem;
    .extra {
        grid-column:  1 / 4;
    }
  }
</style>

<script>
  import interact from 'interactjs'
  import _ from 'lodash'
  import $ from 'jquery'

  import colours from './colours'

  export default {
    props: ["item", "offset"],
    data() {
      return {colours, position: _.cloneDeep(this.item.position), old: {x: 0, y: 0}, cache: {input: {}, output: {}}};
    },
    computed: {
      type() {
        return this.$store.state.components[this.item.type];
      }
    },
    methods: {
      staticIz(put) {
        return put.type === 'dynamic' ? (this.type.staticIzer || ((_, t) => t.type))(this.item, put) : put.type
      },
      setInput(id) {
        this.$emit("set-input", {component: this.item.id, input: id});
      },
      setOutput(id) {
        this.$emit("set-output", {component: this.item.id, output: id})
      },
      getPosition(item, stop = ".components") {
        let position = {x: 0, y: 0};
        while (!item.is(stop)) {
          let temp = item.position();
          position.x += temp.left;
          position.y += temp.top;
          item = item.parent();
        }
        return position;
      },
      updateConnector() {
        let el = this.$el;
        let $el = $(el);
        let backdrop = $(".backdrop");

        let outputs = _.get(this.item, "binding.output");
        if (outputs && !_.isEmpty(outputs)) {
          for (let out in outputs) {
            if (outputs.hasOwnProperty(out)) {
              let output = $el.find(`[data-id=${out}]`)
              let relPos = this.cache.output[out] = this.cache.output[out] || this.getPosition(output, '.component')
              let pos = {};
              let res = $el.css(["top", "left"])
              pos.y1 = (res.top && parseInt(res.top.substring(-2)) || 0) + relPos.y + output.height() / 2
              pos.x1 = (res.left && parseInt(res.left.substring(-2)) || 0)+ relPos.x + output.width()
              // let pos = this.getPosition(output);
              backdrop.find(`[data-id1="${this.item.id}:${out}"]`).attr(pos)
            }
          }
        }
        let inputs = _.get(this.item, "binding.input");
        if (inputs && !_.isEmpty(inputs)) {
          for (let inp in inputs) {
            if (inputs.hasOwnProperty(inp)) {
              let input = $el.find(`[data-id=${inp}]`)
              let relPos = this.cache.input[inp] = this.cache.input[inp] || this.getPosition(input, '.component')
              let pos = {};//this.getPosition(input);
              let res = $el.css(["top", "left"])
              pos.y2 = (res.top && parseInt(res.top.substring(-2)) || 0) + relPos.y + input.height() / 2
              pos.x2 = (res.left && parseInt(res.left.substring(-2)) || 0)+ relPos.x
              backdrop.find(`[data-id2="${this.item.id}:${inp}"]`).attr(pos)
            }
          }
        }
      }
    },
    watch: {
      offset: {
        deep: true,
        handler(newItem) {
          let $el = $(this.$el);
          let res = $el.css(["top", "left"])
          res.top = (res.top && parseInt(res.top.substring(-2)) || 0) - (this.old.y - newItem.y)
          res.left = (res.left && parseInt(res.left.substring(-2)) || 0) - (this.old.x - newItem.x)
          $el.css(res);
          this.old = _.cloneDeep(newItem);
        }
      },
      'item.binding': {
        deep: true,
        handler() { this.updateConnector() }
      }
    },
    mounted() {
      let el = this.$el;
      let $el = $(el);
      let component = this;
      $el.css({top: this.item.position.y, left: this.item.position.x})
      interact(el).draggable({
          ignoreFrom: 'a, input, textarea, .modal',
              inertia: false,
              autoScroll: true,
              onmove(event) {
                component.$store.commit("moveFlow", {
                  id: component.item.id,
                  x: event.dx,
                  y: event.dy
                });
                let res = $el.css(["top", "left"])
                res.top = (res.top && parseInt(res.top.substring(-2)) || 0) + event.dy
                res.left = (res.left && parseInt(res.left.substring(-2)) || 0) + event.dx
                $el.css(res);
                component.updateConnector();
              },
          })
      this.updateConnector()
    },
    updated() {
      let el = this.$el;
      let $el = $(el);
      $el.css({top: this.item.position.y, left: this.item.position.x})
      this.updateConnector();
    }
  }
</script>
