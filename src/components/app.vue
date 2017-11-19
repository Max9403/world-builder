<template>
    <section class="content base" :style="{gridTemplateColumns: gridSize}">
      <list :items="items"></list>
      <flow @resize-width="resizeFlow" @flow-size="setSize"></flow>
      <div>
        <heightmap class="heightmap" :generator="getGenerator()"></heightmap>
      </div>
    </section>
</template>

<style lang="scss">;
    @import "../styles/variables";
    @import "~font-awesome/scss/font-awesome";

    html {
        min-width: 100vw;
        min-height: 100vh;
        overflow: hidden;
    }

    .heightmap {
      width: 100%;
      height: 100%;
    }

    .base {
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        display: grid;
        grid-template-columns: 10rem 20rem 1fr;
        grid-template-rows: auto;
    }
</style>

<script>
  import _ from 'lodash'

  import list from './list.vue'
  import flow from './flow.vue'
  import heightmap from './heightmap.vue'

  export default {
      components: {
        flow,
        list,
        heightmap
      },
      data() {
          return {
            items: this.$store.state.components,
            gridSize: "10rem 20rem 1fr",
            flowSize: 0
          };
      },
      methods: {
        resizeFlow({x}) {
          this.gridSize = `10rem ${(this.flowSize = Math.max(this.flowSize + x, 50))}px 1fr`;
        },
        setSize({x}) {
          this.flowSize = x;
        },
        getGenerator() {
          let render = this.$store.state.flow.render;
          if (!render) return () => 0;
          let stack = this.buildStack(render);
          return stack;
        },
        getType(item) {
            return this.$store.state.components[item.type];
        },
        buildStack(item) {
          if (item.binding && !_.isEmpty(item.binding.input)) {
            let binding = {};
            for (let key in item.binding.input) {
                if (item.binding.input.hasOwnProperty(key)) {
                  let value = item.binding.input[key][0];
                  binding[value.component] = binding[value.component] || {};
                  binding[value.component][key] = value.output
                }
            }

            let prep = [];
            for (let key in binding) {
              if (binding.hasOwnProperty(key)) {
                let binds = binding[key];
                let data = this.$store.state.flow[key];
                let type = this.getType(data);
                let func = type.calculate;
                if (data.binding && !_.isEmpty(data.binding.input)) {
                  func = this.buildStack(data);
                }
                prep.push((out, globals) => {
                  let called = func(data, undefined, globals);
                  for (let key in binds) {
                    if (binds.hasOwnProperty(key)) {
                      out[key] = called[binds[key]];
                    }
                  }
                });
              }
            }
            return (_, globals, __) => {
              if (__) {
                globals = __;
              }
              if (!globals) {
                globals = _;
              }
              let data = {};
              for(let set of prep) {
                set(data, globals);
              }
              return this.getType(item).calculate(item, data, globals);
            }
          } else {
            return (_, globals) => {
              if (!globals) {
                globals = _;
              }
              return this.getType(item).calculate(item, {}, globals);
            }
          }
        },
      }
    }
</script>
