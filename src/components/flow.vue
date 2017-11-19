<template>
  <div class="flow">
    <div class="components">
      <connectors :offset="position" :items="points"></connectors>
      <flow-component :offset="position" :item="item" v-for="(item, index) in $store.state.flow" :key="item.id" @set-input="setInput" @set-output="setOutput"></flow-component>
    </div>
    <div class="drag-handle">
      <div class="icon">
        <i class="fa fa-chevron-left" aria-hidden="true"></i><i class="fa fa-chevron-right" aria-hidden="true"></i>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  .flow {
    background-color: #666767;
    display: grid;
    grid-template-columns: 1fr 1.5rem;
    grid-template-rows: 100vh;
    .components {
      position: relative;
      overflow: hidden;
    }
    .drag-handle {
      background: #EBEBEB;
      border-left: 1px solid #4B4E4E;
      border-right: 1px solid #4B4E4E;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 1px;
      .icon {
        margin-right: 1px;
      }
    }
  }
</style>

<script>
  import $ from 'jquery'
  import _ from 'lodash'
  import interact from 'interactjs'

  import component from './component/component-flow.vue'
  import connectors from './connectors.vue'

  export default {
    components: {
      "flow-component": component,
      connectors
    },
    data() {
      return {location: {}, position: {x: 0, y: 0}, in: {}, out: {}};
    },
    computed: {
      points() {
        let points = [];
        // for (let key in this.$store.state.flow) {
        //   if (this.$store.state.flow.hasOwnProperty(key)) {
        //     let value = this.$store.state.flow[key]
        //     value.position.x;
        //     let me = $(`[data-flow="${value.id}"]`);
        //     let outputs = _.get(value, "binding.output");
        //     if (outputs && !_.isEmpty(outputs)) {
        //       for (let out in outputs) {
        //         if (outputs.hasOwnProperty(out)) {
        //           let gah = me.find(`[data-id="${out}"]`);
        //           let start = this.getPosition(gah);
        //           start.x += gah.width();
        //           start.y += gah.height() / 2;
        //           for (let other of outputs[out]) {
        //             let poh = $(`[data-flow="${other.component}"] [data-id="${other.input}"]`);
        //             let another = this.getPosition(poh)
        //             this.$store.state.flow[other.component].position.x;
        //             another.y += poh.height() / 2;
        //             points.push({a:start, b: another});
        //           }
        //         }
        //       }
        //     }
        //   }
        // }
        for (let key in this.$store.state.flow) {
          if (this.$store.state.flow.hasOwnProperty(key)) {
            let value = this.$store.state.flow[key]
            let outputs = _.get(value, "binding.output");
            if (outputs && !_.isEmpty(outputs)) {
              for (let out in outputs) {
                if (outputs.hasOwnProperty(out)) {
                  for (let other of outputs[out]) {
                    points.push({
                      id1: `${value.id}:${out}`,
                      id2: `${other.component}:${other.input}`
                    })
                    // let poh = $(`[data-flow="${other.component}"] [data-id="${other.input}"]`);
                    // let another = this.getPosition(poh)
                    // this.$store.state.flow[other.component].position.x;
                    // another.y += poh.height() / 2;
                    // points.push({a:start, b: another});
                  }
                }
              }
            }
          }
        }

        return points;
      }
    },
    methods: {
      getPosition(item) {
        let position = {x: 0, y: 0};
        while (!item.is(".components")) {
          let temp = item.position();
          position.x += temp.left;
          position.y += temp.top;
          item = item.parent();
        }
        return position;
      },
      setInput(input) {
        if (!_.isEmpty(this.out)) {
          this.$store.commit("bindFlow", {input, output: this.out});
          this.out = {};
        } else {
          this.in = input
        }
      },
      setOutput(output) {
        if (!_.isEmpty(this.in)) {
          this.$store.commit("bindFlow", {input: this.in, output});
          this.in = {};
        } else {
          this.out = output
        }
      }
    },
    mounted() {
        let el = this.$el;
        let $el = $(el);
        let component = this;
        this.location = $el.position();

        component.$store.commit("setFlow", {id: "render", type: "render", position: {x: 16, y: 16}})

        interact(el).dropzone({
              accept: ".component.adding",
              ondrop(event) {
                let offset = event.interaction.curCoords.page;
                let comp = event.draggable.target.__vue__;
                if (!comp) return;
                component.$emit("add-to-flow", {originalEvent: event, type: comp.item.id, position: {x: offset.x - component.location.left, y: offset.y - component.location.top}})
                component.$store.commit("setFlow", {type: comp.item.id, position: {x: offset.x - component.location.left, y: offset.y - component.location.top}})
              }
            })
            .draggable({
                ignoreFrom: 'a, input, textarea, .modal',
                inertia: true,
                autoScroll: true,
                onmove(event) {
                  component.position.x += event.dx;
                  component.position.y += event.dy;
                },
            })
            .resizable({
              edges: { left: false, right: ".drag-handle", top: false, bottom: true}
            }).on('resizemove', (e) => {
              this.$emit('resize-width', { x: e.dx, element: this, originalEvent: e});
            })
      this.$emit('flow-size', { x: $el.width(), element: this});
    }
  }
</script>
